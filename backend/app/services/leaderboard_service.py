from sqlalchemy import func, literal
from sqlalchemy.orm import Session

from app.models.domain import Domain
from app.models.gap import Gap
from app.models.user import User


class LeaderboardService:
    @staticmethod
    def get_leaderboard(db: Session, current_user: User):
        query = (
            db.query(
                User.id.label("user_id"),
                User.name.label("name"),
                literal(None).label("unit"),
                func.count(Gap.id).label("resolved_count"),
            )
            .outerjoin(Gap, (Gap.assigned_user_id == User.id) & (Gap.status == "resolved"))
            .outerjoin(Domain, Gap.domain_id == Domain.id)
            .group_by(User.id, User.name)
        )

        if current_user.role == "ciso_admin":
            return query.order_by(func.count(Gap.id).desc(), User.name.asc()).all()

        if current_user.role == "manager":
            return (
                query
                .filter(Domain.manager_id == current_user.id)
                .order_by(func.count(Gap.id).desc(), User.name.asc())
                .all()
            )

        return (
            query
            .filter(User.id == current_user.id)
            .order_by(func.count(Gap.id).desc(), User.name.asc())
            .all()
        )
