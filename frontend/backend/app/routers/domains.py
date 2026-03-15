from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.domain import DomainCreate, DomainOut
from app.services.domain_service import create_domain, get_visible_domains

router = APIRouter(prefix="/domains", tags=["domains"])


@router.post("", response_model=DomainOut)
def create_domain_endpoint(payload: DomainCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_domain(db, current_user, payload)


@router.get("", response_model=list[DomainOut])
def list_domains(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_visible_domains(db, current_user)
