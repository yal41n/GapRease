from typing import Literal, Optional

from pydantic import BaseModel


class GapCreate(BaseModel):
    title: str
    description: Optional[str] = None
    domain: str
    nist_id: Optional[str] = None
    severity: Literal["low", "medium", "high", "critical"] = "medium"
    domain_id: Optional[int] = None


class GapReportCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: Literal["low", "medium", "high", "critical"] = "medium"
    domain_id: int


class GapAssignRequest(BaseModel):
    assigned_user_id: Optional[int] = None
    assigned_unit: Optional[str] = None


class GapStatusUpdate(BaseModel):
    status: Literal["open", "in_progress", "resolved"]
    remediation_note: Optional[str] = None


class GapOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    domain: str
    nist_id: Optional[str]
    status: str
    severity: str
    assigned_user_id: Optional[int]
    assigned_unit: Optional[str]
    domain_id: Optional[int]
    reported_by_user_id: Optional[int]
    source: str
    remediation_note: Optional[str]

    model_config = {"from_attributes": True}
