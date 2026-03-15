from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.community_service import CommunityService

router = APIRouter(prefix="/community", tags=["community"])


@router.post("/share")
def share_gap(
    gap_id: int = Query(...),
    client_reference: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return CommunityService.share_gap(db, current_user, gap_id, client_reference)
