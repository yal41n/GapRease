import json
import os
from datetime import datetime
from pathlib import Path

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.ai.loaders import load_file_text
from app.ai.pipeline import run_analysis_pipeline
from app.core.config import settings
from app.models.analysis import AnalysisJob
from app.models.domain import Domain
from app.models.user import User


class AnalysisService:
    @staticmethod
    def create_upload_dir() -> None:
        Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)

    @staticmethod
    async def save_uploads(files: list[UploadFile]) -> list[str]:
        AnalysisService.create_upload_dir()
        saved_paths: list[str] = []
        timestamp = datetime.utcnow().timestamp()

        for index, file in enumerate(files):
            filename = file.filename or f"upload_{index}"
            file_path = os.path.join(settings.upload_dir, f"{timestamp}_{index}_{filename}")
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            saved_paths.append(file_path)

        return saved_paths

    @staticmethod
    def build_bundle_file(saved_paths: list[str]) -> str:
        AnalysisService.create_upload_dir()
        bundle_path = os.path.join(settings.upload_dir, f"bundle_{datetime.utcnow().timestamp()}.txt")
        combined_parts = []

        for path in saved_paths:
            combined_parts.append(f"# File: {Path(path).name}\n")
            combined_parts.append(load_file_text(path))
            combined_parts.append("\n\n")

        with open(bundle_path, "w", encoding="utf-8") as f:
            f.write("".join(combined_parts))

        return bundle_path

    @staticmethod
    def get_domain_or_403(db: Session, current_user: User, domain_id: int) -> Domain:
        domain = db.query(Domain).filter(Domain.id == domain_id).first()
        if not domain:
            raise HTTPException(status_code=404, detail="Domain not found")

        if current_user.role == "ciso_admin":
            return domain

        if current_user.role == "manager":
            if domain.manager_id != current_user.id:
                raise HTTPException(status_code=403, detail="You do not own this domain")
            return domain

        raise HTTPException(status_code=403, detail="Users cannot start analysis jobs")

    @staticmethod
    def create_job(db: Session, filename: str, current_user: User, domain_id: int) -> AnalysisJob:
        job = AnalysisJob(
            filename=filename,
            status="processing",
            domain_id=domain_id,
            created_by=current_user.id,
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    async def create_analysis_job(db: Session, current_user: User, domain_id: int, files: list[UploadFile]) -> AnalysisJob:
        if not files:
            raise HTTPException(status_code=400, detail="At least one file is required")

        AnalysisService.get_domain_or_403(db, current_user, domain_id)
        saved_paths = await AnalysisService.save_uploads(files)
        bundle_path = AnalysisService.build_bundle_file(saved_paths)
        filename = ", ".join((file.filename or "upload") for file in files)
        job = AnalysisService.create_job(db, filename, current_user, domain_id)
        return AnalysisService.run_job(db, job, bundle_path)

    @staticmethod
    def run_job(db: Session, job: AnalysisJob, file_path: str) -> AnalysisJob:
        result = run_analysis_pipeline(file_path)
        report_lines = [
            "# Cyber Gap Analysis Report",
            "",
            f"**Summary:** {result.get('summary', 'No summary')}",
            "",
        ]
        for finding in result.get("findings", []):
            report_lines.extend(
                [
                    f"## [{finding['nist_id']}] {finding['title']}",
                    f"- **Domain:** {finding['domain']}",
                    f"- **Severity:** {finding['severity']}",
                    f"- **Confidence:** {finding['confidence']}",
                    f"- **Gap:** {finding['description']}",
                    f"- **Recommendation:** {finding['recommendation']}",
                    "",
                ]
            )

        job.status = "completed"
        job.raw_findings_json = json.dumps(result.get("findings", []))
        job.questions_json = json.dumps(result.get("questions", []))
        job.report_markdown = "\n".join(report_lines)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def get_job_or_404(db: Session, job_id: int) -> AnalysisJob:
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Analysis job not found")
        return job

    @staticmethod
    def get_job_or_403(db: Session, current_user: User, job_id: int) -> AnalysisJob:
        job = AnalysisService.get_job_or_404(db, job_id)

        if current_user.role == "ciso_admin":
            return job

        if current_user.role == "manager":
            domain = db.query(Domain).filter(Domain.id == job.domain_id).first()
            if not domain or domain.manager_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not allowed")
            return job

        raise HTTPException(status_code=403, detail="Not allowed")

    @staticmethod
    def store_answers(db: Session, job: AnalysisJob, answers: dict[str, str]) -> AnalysisJob:
        job.answers_json = json.dumps(answers)
        db.commit()
        db.refresh(job)
        return job
