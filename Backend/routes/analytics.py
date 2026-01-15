from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from models import AnalyticsResponse, FeatureCount, DailyCount
from middleware.auth import get_current_user
from config import get_supabase_admin_client

router = APIRouter(prefix="/analytics", tags=["Analytics"])


def get_age_range(age_group: str) -> tuple[int, int]:
    """Convert age group string to min/max range."""
    if age_group == "<18":
        return (0, 17)
    elif age_group == "18-40":
        return (18, 40)
    elif age_group == ">40":
        return (41, 150)
    return (0, 150)


@router.get("", response_model=AnalyticsResponse)
async def get_analytics(
    start_date: Optional[datetime] = Query(None, description="Filter start date"),
    end_date: Optional[datetime] = Query(None, description="Filter end date"),
    age_group: Optional[str] = Query(None, description="Age group: <18, 18-40, >40"),
    gender: Optional[str] = Query(None, description="Gender: Male, Female, Other"),
    feature_name: Optional[str] = Query(None, description="Specific feature for daily counts"),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve aggregated analytics data with optional filters.
    Returns:
    - feature_counts: Total clicks per feature
    - daily_counts: Daily click counts (for selected feature or all)
    """
    # Use admin client to bypass RLS and see all data
    supabase = get_supabase_admin_client()

    try:
        # Build base query joining feature_clicks with profiles
        # We need to use RPC or raw SQL for complex joins
        # For simplicity, we'll do two queries

        # Get all relevant user IDs based on age/gender filters
        profile_query = supabase.table("profiles").select("id")

        if age_group:
            min_age, max_age = get_age_range(age_group)
            profile_query = profile_query.gte("age", min_age).lte("age", max_age)

        if gender:
            profile_query = profile_query.eq("gender", gender)

        profile_response = profile_query.execute()
        user_ids = [p["id"] for p in profile_response.data] if profile_response.data else []

        if not user_ids:
            return AnalyticsResponse(feature_counts=[], daily_counts=[])

        clicks_query = supabase.table("feature_clicks").select("*").in_("user_id", user_ids)

        if start_date:
            clicks_query = clicks_query.gte("timestamp", start_date.isoformat())

        if end_date:
            clicks_query = clicks_query.lte("timestamp", end_date.isoformat())

        clicks_response = clicks_query.execute()
        clicks = clicks_response.data if clicks_response.data else []

        feature_count_map: dict[str, int] = {}
        for click in clicks:
            fname = click["feature_name"]
            feature_count_map[fname] = feature_count_map.get(fname, 0) + 1

        feature_counts = [
            FeatureCount(feature_name=k, count=v)
            for k, v in sorted(feature_count_map.items(), key=lambda x: -x[1])
        ]

        # Aggregate daily counts
        # If feature_name specified, filter for that feature only
        filtered_clicks = clicks
        if feature_name:
            filtered_clicks = [c for c in clicks if c["feature_name"] == feature_name]

        daily_count_map: dict[str, int] = {}
        for click in filtered_clicks:
            ts = click["timestamp"]
            if isinstance(ts, str):
                date_str = ts[:10]  # YYYY-MM-DD
            else:
                date_str = ts.strftime("%Y-%m-%d")
            daily_count_map[date_str] = daily_count_map.get(date_str, 0) + 1

        daily_counts = [
            DailyCount(date=k, count=v)
            for k, v in sorted(daily_count_map.items())
        ]

        return AnalyticsResponse(
            feature_counts=feature_counts,
            daily_counts=daily_counts
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch analytics: {str(e)}"
        )
