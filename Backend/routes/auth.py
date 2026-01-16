from fastapi import APIRouter, HTTPException, status
from models import UserRegister, UserLogin, AuthResponse, PasswordResetRequest, PasswordUpdate
from config import get_supabase_client, get_supabase_admin_client, get_settings
from supabase import create_client

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse)
async def register(user_data: UserRegister):
    """
    Register a new user with Supabase Auth and create profile.
    """
    supabase = get_supabase_client()

    try:
        # Create auth user in Supabase
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })

        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )

        user_id = auth_response.user.id

        # Create profile in profiles table (use admin client to bypass RLS)
        admin_supabase = get_supabase_admin_client()
        profile_data = {
            "id": user_id,
            "username": user_data.username,
            "age": user_data.age,
            "gender": user_data.gender
        }

        profile_response = admin_supabase.table("profiles").upsert(profile_data, on_conflict="id").execute()

        if not profile_response.data:
            # Rollback: delete auth user if profile creation fails
            # Note: This requires service role key for admin operations
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user profile"
            )

        return AuthResponse(
            access_token=auth_response.session.access_token,
            user={
                "id": user_id,
                "email": user_data.email,
                "username": user_data.username,
                "age": user_data.age,
                "gender": user_data.gender
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        # Handle common Supabase auth errors
        if "already registered" in error_msg.lower() or "already exists" in error_msg.lower():
            error_msg = "Email already registered"
        elif "422" in error_msg:
            error_msg = "Email already registered or invalid"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """
    Authenticate user and return JWT token.
    """
    supabase = get_supabase_client()

    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })

        if not auth_response.user or not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        user_id = auth_response.user.id

        # Fetch user profile
        profile_response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()

        profile = profile_response.data if profile_response.data else {}

        return AuthResponse(
            access_token=auth_response.session.access_token,
            user={
                "id": user_id,
                "email": credentials.email,
                "username": profile.get("username", ""),
                "age": profile.get("age", 0),
                "gender": profile.get("gender", "")
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )


@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    """
    Send password reset email via Supabase Auth.
    """
    supabase = get_supabase_client()
    settings = get_settings()

    try:
        # Supabase sends reset email with link to redirect_to URL
        supabase.auth.reset_password_email(
            request.email,
            options={
                "redirect_to": f"{settings.frontend_url}/reset-password"
            }
        )

        # Always return success to prevent email enumeration
        return {"message": "If an account exists, a password reset email has been sent."}

    except Exception as e:
        # Still return success to prevent email enumeration
        return {"message": "If an account exists, a password reset email has been sent."}


@router.post("/reset-password")
async def reset_password(data: PasswordUpdate):
    """
    Update user password using recovery token from Supabase.
    """
    settings = get_settings()

    try:
        # Create a new client with the recovery access token
        supabase = create_client(settings.supabase_url, settings.supabase_key)

        # Set the session with the recovery token
        supabase.auth.set_session(data.access_token, "")

        # Update the user's password
        supabase.auth.update_user({"password": data.new_password})

        return {"message": "Password updated successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to reset password. The link may have expired."
        )
