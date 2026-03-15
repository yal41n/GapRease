from datetime import datetime
from typing import Any

from pydantic import BaseModel


class AnalysisJobOut(BaseModel):
    id: int
    filename: str | None = None
    status: str
    report_markdown: str | None = None
    raw_findings_json: str | None = None
    questions_json: str | None = None
    answers_json: str | None = None
    domain_id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AnalysisAnswerRequest(BaseModel):
    answers: dict[str, str]


class AnalysisImportRequest(BaseModel):
    selected_findings: list[dict[str, Any]] | None = None
