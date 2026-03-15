from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.core.database import Base


class Gap(Base):
    __tablename__ = "gaps"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    domain = Column(String, nullable=False)
    nist_id = Column(String, nullable=True)
    status = Column(String, nullable=False, default="open")
    severity = Column(String, nullable=False, default="medium")
    assigned_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_unit = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    analysis_job_id = Column(Integer, nullable=True)
    source = Column(String, nullable=False, default="manual")
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=True)
    reported_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    remediation_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
