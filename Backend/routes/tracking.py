from fastapi import APIRouter, Depends, HTTPException, status
from models import TrackEvent, TrackResponse
from middleware.auth import get_current_user
from config import get_supabase_admin_client

router = APIRouter(prefix="/track", tags=["Tracking"])


@router.post("", response_model=TrackResponse)
async def track_event(
    event: TrackEvent,
    current_user: dict = Depends(get_current_user)
):
    """
    Record a user interaction (feature click).
    Requires authentication.
    """
    # Use admin client to bypass RLS for tracking
    supabase = get_supabase_admin_client()

    try:
        # Insert click event
        click_data = {
            "user_id": current_user["id"],
            "feature_name": event.feature_name
            # timestamp defaults to NOW() in database
        }

        response = supabase.table("feature_clicks").insert(click_data).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to record event"
            )

        return TrackResponse(
            success=True,
            message=f"Event '{event.feature_name}' tracked successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to track event: {str(e)}"
        )
