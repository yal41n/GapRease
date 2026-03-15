from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    # ciso_admin / manager / user
    role = Column(String, nullable=False, default="user")

    # mainly meaningful for managers
    # free / approved / internal
    plan_type = Column(String, nullable=False, default="free")

    requires_password_change = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    # who manages this user (only for normal users usually)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # who created this account
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    manager = relationship("User", remote_side=[id], foreign_keys=[manager_id], post_update=True)
