from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.email == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
            "plan_type": user.plan_type,
        }
    )
    return token, user

def change_password(db: Session, current_user: User, new_password: str):
    current_user.password_hash = get_password_hash(new_password)
    current_user.requires_password_change = False
    db.commit()
    db.refresh(current_user)
    return current_user


def register_free_manager(db: Session, payload):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    manager = User(
        name=payload.name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        role="manager",
        plan_type="free",
    )
    db.add(manager)
    db.commit()
    db.refresh(manager)
    return manager
