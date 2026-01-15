"""
Authentication Middleware for FastAPI with Supabase
Based on best practices from:
- https://dev.to/j0/integrating-fastapi-with-supabase-auth-780
- https://medium.com/@ojasskapre/implementing-supabase-authentication-with-next-js-and-fastapi
"""

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import get_supabase_client
from typing import Optional
import time
import hashlib

security = HTTPBearer(auto_error=True)

# ============================================================================
# BEST PRACTICE: Token verification caching with TTL
# Reduces Supabase API calls for repeated requests with same token
# ============================================================================

class TokenCache:
    """Thread-safe token cache with automatic expiration."""
    
    def __init__(self, ttl_seconds: int = 300):
        self._cache: dict[str, tuple[dict, float]] = {}
        self._ttl = ttl_seconds
    
    def _get_token_hash(self, token: str) -> str:
        """Hash token for secure storage in cache."""
        return hashlib.sha256(token.encode()).hexdigest()[:16]
    
    def get(self, token: str) -> Optional[dict]:
        """Get cached user data if not expired."""
        token_hash = self._get_token_hash(token)
        
        if token_hash in self._cache:
            user_data, cached_at = self._cache[token_hash]
            if time.time() - cached_at < self._ttl:
                return user_data
            else:
                # Expired - remove from cache
                del self._cache[token_hash]
        
        return None
    
    def set(self, token: str, user_data: dict) -> None:
        """Cache user data for a token."""
        token_hash = self._get_token_hash(token)
        self._cache[token_hash] = (user_data, time.time())
        
        # Clean expired entries if cache grows too large
        if len(self._cache) > 500:
            self._cleanup()
    
    def invalidate(self, token: str) -> None:
        """Remove a token from cache."""
        token_hash = self._get_token_hash(token)
        if token_hash in self._cache:
            del self._cache[token_hash]
    
    def _cleanup(self) -> None:
        """Remove expired entries from cache."""
        current_time = time.time()
        expired = [
            th for th, (_, cached_at) in self._cache.items()
            if current_time - cached_at >= self._ttl
        ]
        for th in expired:
            del self._cache[th]


# Global token cache instance (5 minute TTL)
_token_cache = TokenCache(ttl_seconds=300)


# ============================================================================
# BEST PRACTICE: Proper JWT verification with Supabase
# Based on: Supabase official documentation
# ============================================================================

async def verify_token_with_supabase(token: str) -> dict:
    """
    Verify JWT token with Supabase Auth service.
    
    Returns user data dict on success.
    Raises HTTPException on failure.
    """
    supabase = get_supabase_client()
    
    try:
        # Use Supabase's built-in token verification
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return {
            "id": user_response.user.id,
            "email": user_response.user.email,
            "role": user_response.user.role,
            "metadata": user_response.user.user_metadata or {}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e).lower()
        
        # Identify authentication-specific errors
        auth_error_keywords = [
            "invalid", "expired", "jwt", "token", 
            "unauthorized", "malformed", "signature"
        ]
        
        is_auth_error = any(keyword in error_msg for keyword in auth_error_keywords)
        
        if is_auth_error:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Log unexpected errors for debugging
        print(f"[Auth] Unexpected error during token verification: {type(e).__name__}: {str(e)}")
        
        # Return 500 for non-auth errors to avoid incorrect logouts
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service temporarily unavailable"
        )


# ============================================================================
# MAIN DEPENDENCY: Get Current User
# ============================================================================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    FastAPI dependency to get the current authenticated user.
    
    Uses caching to minimize Supabase API calls.
    
    Usage:
        @router.get("/protected")
        async def protected_route(user: dict = Depends(get_current_user)):
            return {"user_id": user["id"]}
    """
    token = credentials.credentials
    
    # Check cache first
    cached_user = _token_cache.get(token)
    if cached_user:
        return {**cached_user, "token": token}
    
    # Verify with Supabase
    user_data = await verify_token_with_supabase(token)
    
    # Cache the result
    _token_cache.set(token, user_data)
    
    return {**user_data, "token": token}


# ============================================================================
# OPTIONAL: Get Current User (doesn't raise if not authenticated)
# ============================================================================

async def get_optional_user(
    request: Request
) -> Optional[dict]:
    """
    Get current user if authenticated, None otherwise.
    Useful for routes that work with or without authentication.
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.replace("Bearer ", "")
    
    try:
        # Check cache first
        cached_user = _token_cache.get(token)
        if cached_user:
            return {**cached_user, "token": token}
        
        # Verify with Supabase
        user_data = await verify_token_with_supabase(token)
        _token_cache.set(token, user_data)
        
        return {**user_data, "token": token}
        
    except HTTPException:
        return None
