from fastapi import FastAPI
from sqlalchemy.orm import Session

from app.core.database import Base, SessionLocal, engine
from app.core.security import get_password_hash
from app.models.analysis import AnalysisJob
from app.models.community import CommunitySharedGap
from app.models.domain import Domain
from app.models.gap import Gap
from app.models.user import User
from app.routers.analysis import router as analysis_router
from app.routers.auth import router as auth_router
from app.routers.community import router as community_router
from app.routers.domains import router as domains_router
from app.routers.gaps import router as gaps_router
from app.routers.leaderboard import router as leaderboard_router
from app.routers.users import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cyber GAP Backend")


@app.on_event("startup")
def on_startup():
    db: Session = SessionLocal()

    admin = db.query(User).filter(User.email == "admin@ciso.local").first()
    if not admin:
        admin = User(
            name="CISO Admin",
            email="admin@ciso.local",
            password_hash=get_password_hash("admin123"),
            role="ciso_admin",
            plan_type="internal",
        )
        db.add(admin)

    free_manager = db.query(User).filter(User.email == "manager@example.com").first()
    if not free_manager:
        free_manager = User(
            name="Free Manager",
            email="manager@example.com",
            password_hash=get_password_hash("manager123"),
            role="manager",
            plan_type="free",
        )
        db.add(free_manager)

    db.commit()
    db.close()


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(domains_router)
app.include_router(gaps_router)
app.include_router(analysis_router)
app.include_router(community_router)
app.include_router(leaderboard_router)
