from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.domain import Domain
from app.models.user import User


def count_manager_domains(db: Session, manager_id: int) -> int:
    return db.query(Domain).filter(Domain.manager_id == manager_id).count()


def create_domain(db: Session, current_user: User, payload):
    if current_user.role not in ["manager", "ciso_admin"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    existing = db.query(Domain).filter(Domain.domain == payload.domain).first()
    if existing:
        raise HTTPException(status_code=400, detail="Domain already exists")

    if current_user.role == "manager":
        domain_count = count_manager_domains(db, current_user.id)

        if current_user.plan_type == "free" and domain_count >= 1:
            raise HTTPException(status_code=403, detail="Free plan supports only 1 domain")

        manager_id = current_user.id
    else:
        raise HTTPException(
            status_code=400,
            detail="CISO admin should create domains through manager context or extend this flow",
        )

    domain = Domain(
        name=payload.name,
        domain=payload.domain,
        manager_id=manager_id,
    )
    db.add(domain)
    db.commit()
    db.refresh(domain)
    return domain


def get_visible_domains(db: Session, current_user: User):
    if current_user.role == "ciso_admin":
        return db.query(Domain).all()

    if current_user.role == "manager":
        return db.query(Domain).filter(Domain.manager_id == current_user.id).all()

    return []
