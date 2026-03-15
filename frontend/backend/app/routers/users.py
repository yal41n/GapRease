from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.user import UserCreate, UserOut
from app.services.user_service import create_manager, create_user, get_visible_users

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=UserOut)
def create_user_endpoint(payload: UserCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if payload.role == "manager":
        return create_manager(db, current_user, payload)
    return create_user(db, current_user, payload)


@router.get("", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_visible_users(db, current_user)
