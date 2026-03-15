from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.core.database import Base


class CommunitySharedGap(Base):
    __tablename__ = "community_shared_gaps"

    id = Column(Integer, primary_key=True, index=True)
    hashed_client_id = Column(String, nullable=False, index=True)
    gap_title = Column(String, nullable=False)
    gap_domain = Column(String, nullable=False)
    nist_id = Column(String, nullable=True)
    recommendation = Column(Text, nullable=True)
    source_gap_id = Column(Integer, ForeignKey("gaps.id"), nullable=True)
    shared_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
