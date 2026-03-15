from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.gap import GapAssignRequest, GapCreate, GapOut, GapReportCreate, GapStatusUpdate
from app.services.gap_service import assign_gap, create_gap, get_visible_gaps, report_gap, update_gap_status

router = APIRouter(prefix="/gaps", tags=["gaps"])


@router.post("", response_model=GapOut)
def create_gap_endpoint(payload: GapCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_gap(db, current_user, payload)


@router.post("/report", response_model=GapOut)
def report_gap_endpoint(payload: GapReportCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return report_gap(db, current_user, payload)


@router.get("", response_model=list[GapOut])
def list_gaps(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_visible_gaps(db, current_user)


@router.patch("/{gap_id}/assign", response_model=GapOut)
def assign_gap_endpoint(gap_id: int, payload: GapAssignRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return assign_gap(db, current_user, gap_id, payload.assigned_user_id, payload.assigned_unit)


@router.patch("/{gap_id}/status", response_model=GapOut)
def update_gap_status_endpoint(gap_id: int, payload: GapStatusUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return update_gap_status(db, current_user, gap_id, payload.status, payload.remediation_note)
