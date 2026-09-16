from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Obligation, Deadline, Document
from app.schemas import ObligationSchema, DeadlineSchema
from app.routers.documents import _ensure_demo_documents_seeded

router = APIRouter(prefix="/documents", tags=["Obligations & Timeline"])

@router.get("/{doc_id}/obligations", response_model=List[ObligationSchema])
def get_document_obligations(doc_id: str, db: Session = Depends(get_db)):
    _ensure_demo_documents_seeded(db)
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    obs = db.query(Obligation).filter(Obligation.document_id == doc_id).all()
    return [
        ObligationSchema(
            id=o.id,
            document_id=o.document_id,
            responsible_party=o.responsible_party,
            action=o.action,
            condition_trigger=o.condition_trigger,
            deadline_text=o.deadline_text,
            frequency=o.frequency,
            amount_inr=o.amount_inr,
            source_clause=o.source_clause,
            page_number=o.page_number,
            is_completed=o.is_completed
        )
        for o in obs
    ]

@router.get("/{doc_id}/deadlines", response_model=List[DeadlineSchema])
def get_document_deadlines(doc_id: str, db: Session = Depends(get_db)):
    _ensure_demo_documents_seeded(db)
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    dls = db.query(Deadline).filter(Deadline.document_id == doc_id).all()
    return [
        DeadlineSchema(
            id=d.id,
            document_id=d.document_id,
            title=d.title,
            date_str=d.date_str,
            deadline_type=d.deadline_type,
            responsible_party=d.responsible_party,
            source_clause=d.source_clause,
            page_number=d.page_number
        )
        for d in dls
    ]
