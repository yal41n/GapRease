import hashlib

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.community import CommunitySharedGap
from app.models.domain import Domain
from app.models.gap import Gap
from app.models.user import User


class CommunityService:
    @staticmethod
    def share_gap(db: Session, current_user: User, gap_id: int, client_reference: str) -> CommunitySharedGap:
        gap = db.query(Gap).filter(Gap.id == gap_id).first()
        if not gap:
            raise HTTPException(status_code=404, detail="Gap not found")

        if current_user.role == "manager":
            domain = db.query(Domain).filter(Domain.id == gap.domain_id).first()
            if not domain or domain.manager_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not allowed")
        elif current_user.role != "ciso_admin":
            raise HTTPException(status_code=403, detail="Not allowed")

        hashed_client_id = hashlib.sha256(client_reference.encode("utf-8")).hexdigest()
        row = CommunitySharedGap(
            hashed_client_id=hashed_client_id,
            gap_title=gap.title,
            gap_domain=gap.domain,
            nist_id=gap.nist_id,
            recommendation=gap.description[:300] if gap.description else None,
            source_gap_id=gap.id,
            shared_by_user_id=current_user.id,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return row
