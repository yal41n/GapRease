from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.auth import LoginRequest, RegisterFreeRequest, TokenResponse, UserOut, ChangePasswordRequest
from app.services.auth_service import authenticate_user, register_free_manager, change_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token, user = authenticate_user(db, payload.username, payload.password)
    return {"access_token": token, "token_type": "bearer", "requires_password_change": user.requires_password_change}

@router.post("/change-password", response_model=UserOut)
def change_password_endpoint(payload: ChangePasswordRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return change_password(db, current_user, payload.new_password)


@router.post("/register-free", response_model=UserOut)
def register_free(payload: RegisterFreeRequest, db: Session = Depends(get_db)):
    return register_free_manager(db, payload)


@router.get("/me", response_model=UserOut)
def me(current_user=Depends(get_current_user)):
    return current_user
