from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.domain import Domain
from app.models.gap import Gap
from app.models.user import User


def create_gap(db: Session, current_user: User, payload):
    if current_user.role not in ["ciso_admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    if current_user.role == "manager":
        domain = db.query(Domain).filter(
            Domain.id == payload.domain_id,
            Domain.manager_id == current_user.id
        ).first()
        if not domain:
            raise HTTPException(status_code=403, detail="You do not own this domain")
    else:
        domain = db.query(Domain).filter(Domain.id == payload.domain_id).first()

    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")

    gap = Gap(
        title=payload.title,
        description=payload.description,
        domain=domain.domain,
        nist_id=payload.nist_id,
        severity=payload.severity,
        status="open",
        created_by=current_user.id,
        source="manual",
        domain_id=domain.id,
    )
    db.add(gap)
    db.commit()
    db.refresh(gap)
    return gap


def report_gap(db: Session, current_user: User, payload):
    if current_user.role != "user":
        raise HTTPException(status_code=403, detail="Only users can report gaps")

    gap = Gap(
        title=payload.title,
        description=payload.description,
        domain="reported",
        severity=payload.severity,
        status="open",
        source="user_reported",
        reported_by_user_id=current_user.id,
        created_by=current_user.id,
        domain_id=payload.domain_id,
    )
    db.add(gap)
    db.commit()
    db.refresh(gap)
    return gap


def get_visible_gaps(db: Session, current_user: User):
    if current_user.role == "ciso_admin":
        return db.query(Gap).all()

    if current_user.role == "manager":
        return (
            db.query(Gap)
            .join(Domain, Gap.domain_id == Domain.id)
            .filter(Domain.manager_id == current_user.id)
            .all()
        )

    if current_user.role == "user":
        return db.query(Gap).filter(Gap.assigned_user_id == current_user.id).all()

    return []


def assign_gap(db: Session, current_user: User, gap_id: int, assigned_user_id: int | None, assigned_unit: str | None):
    gap = db.query(Gap).filter(Gap.id == gap_id).first()
    if not gap:
        raise HTTPException(status_code=404, detail="Gap not found")

    if current_user.role == "manager":
        domain = db.query(Domain).filter(Domain.id == gap.domain_id, Domain.manager_id == current_user.id).first()
        if not domain:
            raise HTTPException(status_code=403, detail="You cannot assign this gap")

    elif current_user.role != "ciso_admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    gap.assigned_user_id = assigned_user_id
    gap.assigned_unit = assigned_unit
    db.commit()
    db.refresh(gap)
    return gap


def update_gap_status(db: Session, current_user: User, gap_id: int, status: str, remediation_note: str | None = None):
    gap = db.query(Gap).filter(Gap.id == gap_id).first()
    if not gap:
        raise HTTPException(status_code=404, detail="Gap not found")

    if current_user.role == "user" and gap.assigned_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update your assigned gaps")

    if current_user.role == "manager":
        domain = db.query(Domain).filter(Domain.id == gap.domain_id, Domain.manager_id == current_user.id).first()
        if not domain:
            raise HTTPException(status_code=403, detail="Not allowed")

    gap.status = status
    if remediation_note:
        gap.remediation_note = remediation_note

    db.commit()
    db.refresh(gap)
    return gap
