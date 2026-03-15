from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User


def count_manager_users(db: Session, manager_id: int) -> int:
    return db.query(User).filter(User.manager_id == manager_id).count()


def create_manager(db: Session, current_user: User, payload):
    if current_user.role != "ciso_admin":
        raise HTTPException(status_code=403, detail="Only ciso admin can create managers")

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    manager = User(
        name=payload.name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        role="manager",
        plan_type=payload.plan_type or "free",
        created_by=current_user.id,
    )
    db.add(manager)
    db.commit()
    db.refresh(manager)
    return manager


def create_user(db: Session, current_user: User, payload):
    if current_user.role not in ["ciso_admin", "admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    manager_id = payload.manager_id

    if current_user.role == "manager":
        manager_id = current_user.id
        current_count = count_manager_users(db, current_user.id)

        if current_user.plan_type == "free" and current_count >= 5:
            raise HTTPException(status_code=403, detail="Free plan supports up to 5 users")

    # Only ciso_admin/admin can create other admins/managers via this catch-all if we want.
    if payload.role in ["admin", "manager"] and current_user.role not in ["ciso_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Only admins can create higher level roles")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        role=payload.role,
        plan_type="free",
        manager_id=manager_id,
        created_by=current_user.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_visible_users(db: Session, current_user: User):
    if current_user.role == "ciso_admin":
        return db.query(User).all()

    if current_user.role == "manager":
        return db.query(User).filter(User.manager_id == current_user.id).all()

    return [current_user]
