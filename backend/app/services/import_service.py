import json

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.analysis import AnalysisJob
from app.models.domain import Domain
from app.models.gap import Gap
from app.models.user import User


class ImportService:
    @staticmethod
    def import_analysis_findings(db: Session, job: AnalysisJob, current_user: User, selected_findings: list[dict] | None = None) -> list[Gap]:
        domain = db.query(Domain).filter(Domain.id == job.domain_id).first()
        if not domain:
            raise HTTPException(status_code=404, detail="Domain not found")

        findings = selected_findings or json.loads(job.raw_findings_json or "[]")
        created = []
        for finding in findings:
            gap = Gap(
                title=finding.get("title", "Imported gap"),
                description=finding.get("description"),
                domain=domain.domain,
                nist_id=finding.get("nist_id"),
                severity=finding.get("severity", "medium"),
                status="open",
                created_by=current_user.id,
                source="analysis_import",
                analysis_job_id=job.id,
                domain_id=job.domain_id,
            )
            db.add(gap)
            created.append(gap)
        db.commit()
        for item in created:
            db.refresh(item)
        return created
