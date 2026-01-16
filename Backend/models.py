from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, EmailStr


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    username: str = Field(min_length=3, max_length=50)
    age: int = Field(ge=1, le=120)
    gender: Literal["Male", "Female", "Other"]


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordUpdate(BaseModel):
    access_token: str
    new_password: str = Field(min_length=6)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class TrackEvent(BaseModel):
    feature_name: str = Field(
        min_length=1,
        max_length=100,
        examples=["date_filter", "gender_filter", "bar_chart_zoom"]
    )


class TrackResponse(BaseModel):
    success: bool
    message: str


class AnalyticsQuery(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    age_group: Optional[Literal["<18", "18-40", ">40"]] = None
    gender: Optional[Literal["Male", "Female", "Other"]] = None


class FeatureCount(BaseModel):
    feature_name: str
    count: int


class DailyCount(BaseModel):
    date: str
    count: int


class AnalyticsResponse(BaseModel):
    feature_counts: list[FeatureCount]
    daily_counts: list[DailyCount]


class UserProfile(BaseModel):
    id: str
    username: str
    age: int
    gender: Literal["Male", "Female", "Other"]
    created_at: datetime
