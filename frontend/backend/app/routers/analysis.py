from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.analysis import AnalysisAnswerRequest, AnalysisImportRequest, AnalysisJobOut
from app.schemas.gap import GapOut
from app.services.analysis_service import AnalysisService
from app.services.import_service import ImportService

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/upload", response_model=AnalysisJobOut)
async def upload_for_analysis(
    domain_id: int = Form(...),
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await AnalysisService.create_analysis_job(db, current_user, domain_id, files)


@router.get("/{job_id}", response_model=AnalysisJobOut)
def get_analysis_job(job_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AnalysisService.get_job_or_403(db, current_user, job_id)


@router.post("/{job_id}/answer", response_model=AnalysisJobOut)
def answer_questions(
    job_id: int,
    payload: AnalysisAnswerRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    job = AnalysisService.get_job_or_403(db, current_user, job_id)
    return AnalysisService.store_answers(db, job, payload.answers)


@router.post("/{job_id}/import", response_model=list[GapOut])
def import_findings(
    job_id: int,
    payload: AnalysisImportRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    job = AnalysisService.get_job_or_403(db, current_user, job_id)
    return ImportService.import_analysis_findings(db, job, current_user, payload.selected_findings)


@router.get("/{job_id}/stream")
def stream_analysis(job_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    job = AnalysisService.get_job_or_403(db, current_user, job_id)

    def event_stream():
        yield 'event: status\ndata: {"message":"analysis_started"}\n\n'
        yield 'event: status\ndata: {"message":"processing_complete"}\n\n'
        yield f'event: report\ndata: {job.report_markdown!r}\n\n'
        yield 'event: done\ndata: {"message":"finished"}\n\n'

    return StreamingResponse(event_stream(), media_type="text/event-stream")
