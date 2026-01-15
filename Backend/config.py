import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


def get_supabase_client() -> Client:
    """Get Supabase client for authenticated user operations."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_key)


def get_supabase_admin_client() -> Client:
    """Get Supabase admin client for service operations (seeding, etc)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_key)
