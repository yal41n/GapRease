from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.core.database import Base


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=True)
    status = Column(String, default="pending", nullable=False)
    report_markdown = Column(Text, nullable=True)
    raw_findings_json = Column(Text, nullable=True)
    questions_json = Column(Text, nullable=True)
    answers_json = Column(Text, nullable=True)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
