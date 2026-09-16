from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Finding, Document
from app.schemas import FindingSchema
from app.routers.documents import _ensure_demo_documents_seeded

router = APIRouter(prefix="/documents", tags=["Findings"])

@router.get("/{doc_id}/findings", response_model=List[FindingSchema])
def get_document_findings(doc_id: str, db: Session = Depends(get_db)):
    _ensure_demo_documents_seeded(db)
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    findings = db.query(Finding).filter(Finding.document_id == doc_id).all()
    return [
        FindingSchema(
            id=f.id,
            document_id=f.document_id,
            category=f.category,
            title=f.title,
            explanation=f.explanation,
            source_text=f.source_text,
            page_number=f.page_number,
            clause_ref=f.clause_ref,
            why_review=f.why_review,
            question_to_ask=f.question_to_ask
        )
        for f in findings
    ]
