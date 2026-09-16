from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Clause, Document
from app.schemas import ClauseSchema
from app.routers.documents import _ensure_demo_documents_seeded

router = APIRouter(prefix="/documents", tags=["Clauses"])

@router.get("/{doc_id}/clauses", response_model=List[ClauseSchema])
def get_document_clauses(doc_id: str, db: Session = Depends(get_db)):
    _ensure_demo_documents_seeded(db)
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    clauses = db.query(Clause).filter(Clause.document_id == doc_id).all()
    return [
        ClauseSchema(
            id=c.id,
            document_id=c.document_id,
            category=c.category,
            title=c.title,
            clause_number=c.clause_number,
            page_number=c.page_number,
            original_text=c.original_text,
            explanation_en=c.explanation_en,
            explanation_hi=c.explanation_hi,
            explanation_te=c.explanation_te,
            affected_party=c.affected_party,
            requires_action=c.requires_action,
            why_it_matters=c.why_it_matters,
            attention_category=c.attention_category,
            suggested_questions=c.suggested_questions or []
        )
        for c in clauses
    ]
