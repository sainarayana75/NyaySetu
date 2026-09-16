from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Document, Clause
from app.schemas import AskQuestionRequest, AskQuestionResponse
from app.services.rag_engine import RAGEngineService
from app.routers.documents import _ensure_demo_documents_seeded

router = APIRouter(prefix="/documents", tags=["Ask Document"])

@router.post("/{doc_id}/ask", response_model=AskQuestionResponse)
def ask_document_question(doc_id: str, req: AskQuestionRequest, db: Session = Depends(get_db)):
    """
    Executes grounded RAG Q&A on specified legal document.
    """
    _ensure_demo_documents_seeded(db)
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    clauses = db.query(Clause).filter(Clause.document_id == doc_id).all()
    doc_text = doc.summary or ""

    result = RAGEngineService.answer_question(
        question=req.question,
        document_text=doc_text,
        clauses=clauses,
        language=req.language or "en"
    )

    return AskQuestionResponse(**result)
