from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Document
from app.schemas import CompareRequest, ComparisonResponse
from app.services.comparison_engine import ComparisonEngineService
from app.routers.documents import _ensure_demo_documents_seeded

router = APIRouter(prefix="/documents", tags=["Document Comparison"])

@router.post("/compare", response_model=ComparisonResponse)
def compare_documents(req: CompareRequest, db: Session = Depends(get_db)):
    """
    Compares two versions of a contract (Version A vs Version B) and returns structured diffs.
    """
    _ensure_demo_documents_seeded(db)
    doc_a = db.query(Document).filter(Document.id == req.doc_a_id).first()
    doc_b = db.query(Document).filter(Document.id == req.doc_b_id).first()
    if not doc_a or not doc_b:
        raise HTTPException(status_code=404, detail="One or both documents not found for comparison.")

    res = ComparisonEngineService.compare_documents(doc_a, doc_b)
    return ComparisonResponse(**res)
