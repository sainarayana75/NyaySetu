import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.config import settings
from app.models import Document, Clause, Finding, Obligation, Deadline
from app.schemas import DocumentOverviewSchema
from app.services.seed_data import get_demo_documents_data, DEMO_RENTAL_V1_ID, DEMO_RENTAL_V2_ID
from app.services.document_parser import DocumentParserService
from app.services.legal_intelligence import LegalIntelligenceService

router = APIRouter(prefix="/documents", tags=["Documents"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 # 10 MB Limit

@router.post("/upload", response_model=DocumentOverviewSchema)
async def upload_document(
    file: UploadFile = File(...),
    doc_type: Optional[str] = Form("General Agreement"),
    db: Session = Depends(get_db)
):
    """
    Uploads legal document (PDF, DOCX, TXT), validates, extracts text & clause boundaries, and runs initial analysis.
    Hardened against path traversal, oversized files, and invalid formats.
    """
    # 1. Path Traversal Defense: Sanitize filename
    clean_filename = os.path.basename(file.filename or "uploaded_document")
    ext = clean_filename.split(".")[-1].lower() if "." in clean_filename else ""

    if ext not in ["pdf", "docx", "txt"]:
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload PDF, DOCX, or TXT.")

    content = await file.read()

    # 2. Oversized File Defense
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed limit of 10MB.")

    doc_id = str(uuid.uuid4())
    safe_filename = f"{doc_id}_{clean_filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    # 3. Parse document text & pages
    try:
        full_text, pages_data = DocumentParserService.parse_document(file_path, ext)
        page_count = len(pages_data)
    except Exception as e:
        full_text, pages_data = content.decode("utf-8", errors="ignore"), [{"page_number": 1, "text": ""}]
        page_count = 1

    # 4. Analyze legal intelligence
    analysis = LegalIntelligenceService.analyze_document(full_text, doc_type or "General Agreement", pages_data)

    doc = Document(
        id=doc_id,
        title=clean_filename.replace(f".{ext}", "").replace("_", " ").title(),
        original_filename=clean_filename,
        file_type=ext,
        file_path=file_path,
        file_size_bytes=len(content),
        doc_type=doc_type or "General Agreement",
        language="en",
        page_count=page_count,
        status="READY",
        summary=analysis.get("summary"),
        clarity_score=analysis.get("clarity_score", 85.0),
        is_demo=False
    )
    db.add(doc)
    db.commit()

    # Save extracted clauses, findings, obligations, deadlines
    for c in analysis.get("clauses", []):
        cl = Clause(
            id=c.get("id", str(uuid.uuid4())),
            document_id=doc_id,
            category=c.get("category", "General"),
            title=c.get("title", "Clause"),
            clause_number=c.get("clause_number"),
            page_number=c.get("page_number", 1),
            original_text=c.get("original_text", ""),
            explanation_en=c.get("explanation_en", ""),
            explanation_hi=c.get("explanation_hi"),
            explanation_te=c.get("explanation_te"),
            affected_party=c.get("affected_party"),
            requires_action=c.get("requires_action"),
            why_it_matters=c.get("why_it_matters"),
            attention_category=c.get("attention_category", "IMPORTANT OBLIGATION"),
            suggested_questions=c.get("suggested_questions", [])
        )
        db.add(cl)

    for f_item in analysis.get("findings", []):
        fd = Finding(
            id=f_item.get("id", str(uuid.uuid4())),
            document_id=doc_id,
            category=f_item.get("category", "NEEDS ATTENTION"),
            title=f_item.get("title", "Finding"),
            explanation=f_item.get("explanation", ""),
            source_text=f_item.get("source_text", ""),
            page_number=f_item.get("page_number", 1),
            clause_ref=f_item.get("clause_ref"),
            why_review=f_item.get("why_review", ""),
            question_to_ask=f_item.get("question_to_ask")
        )
        db.add(fd)

    for o in analysis.get("obligations", []):
        ob = Obligation(
            id=o.get("id", str(uuid.uuid4())),
            document_id=doc_id,
            responsible_party=o.get("responsible_party", "Party"),
            action=o.get("action", ""),
            condition_trigger=o.get("condition_trigger"),
            deadline_text=o.get("deadline_text"),
            frequency=o.get("frequency"),
            amount_inr=o.get("amount_inr"),
            source_clause=o.get("source_clause"),
            page_number=o.get("page_number", 1)
        )
        db.add(ob)

    db.commit()
    db.refresh(doc)

    return _build_doc_schema(doc, db)

@router.get("", response_model=List[DocumentOverviewSchema])
def list_documents(db: Session = Depends(get_db)):
    """
    Lists all available documents (including pre-seeded demo documents).
    """
    _ensure_demo_documents_seeded(db)
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return [_build_doc_schema(d, db) for d in docs]

@router.get("/{doc_id}", response_model=DocumentOverviewSchema)
def get_document(doc_id: str, db: Session = Depends(get_db)):
    """
    Retrieves document overview metadata.
    """
    _ensure_demo_documents_seeded(db)
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return _build_doc_schema(doc, db)

def _build_doc_schema(doc: Document, db: Session) -> DocumentOverviewSchema:
    c_count = db.query(Clause).filter(Clause.document_id == doc.id).count()
    f_count = db.query(Finding).filter(Finding.document_id == doc.id).count()
    o_count = db.query(Obligation).filter(Obligation.document_id == doc.id).count()
    d_count = db.query(Deadline).filter(Deadline.document_id == doc.id).count()
    return DocumentOverviewSchema(
        id=doc.id,
        title=doc.title,
        original_filename=doc.original_filename,
        file_type=doc.file_type,
        file_size_bytes=doc.file_size_bytes,
        doc_type=doc.doc_type,
        language=doc.language,
        page_count=doc.page_count,
        status=doc.status,
        status_message=doc.status_message,
        summary=doc.summary,
        clarity_score=doc.clarity_score,
        is_demo=doc.is_demo,
        created_at=doc.created_at,
        clauses_count=c_count,
        findings_count=f_count,
        obligations_count=o_count,
        deadlines_count=d_count
    )

def _ensure_demo_documents_seeded(db: Session):
    existing = db.query(Document).filter(Document.id == DEMO_RENTAL_V1_ID).first()
    if existing:
        return

    demo_data = get_demo_documents_data()
    for d_item in demo_data:
        doc = Document(
            id=d_item["id"],
            title=d_item["title"],
            original_filename=d_item["original_filename"],
            file_type=d_item["file_type"],
            file_path="",
            file_size_bytes=48000,
            doc_type=d_item["doc_type"],
            language=d_item["language"],
            page_count=d_item["page_count"],
            status=d_item["status"],
            summary=d_item["summary"],
            clarity_score=d_item["clarity_score"],
            is_demo=True
        )
        db.add(doc)

        for c in d_item.get("clauses", []):
            db.add(Clause(
                id=c["id"],
                document_id=doc.id,
                category=c["category"],
                title=c["title"],
                clause_number=c["clause_number"],
                page_number=c["page_number"],
                original_text=c["original_text"],
                explanation_en=c["explanation_en"],
                explanation_hi=c.get("explanation_hi"),
                explanation_te=c.get("explanation_te"),
                affected_party=c["affected_party"],
                requires_action=c["requires_action"],
                why_it_matters=c["why_it_matters"],
                attention_category=c["attention_category"],
                suggested_questions=c.get("suggested_questions", [])
            ))

        for f_item in d_item.get("findings", []):
            db.add(Finding(
                id=f_item["id"],
                document_id=doc.id,
                category=f_item["category"],
                title=f_item["title"],
                explanation=f_item["explanation"],
                source_text=f_item["source_text"],
                page_number=f_item["page_number"],
                clause_ref=f_item["clause_ref"],
                why_review=f_item["why_review"],
                question_to_ask=f_item.get("question_to_ask")
            ))

        for o in d_item.get("obligations", []):
            db.add(Obligation(
                id=o["id"],
                document_id=doc.id,
                responsible_party=o["responsible_party"],
                action=o["action"],
                condition_trigger=o["condition_trigger"],
                deadline_text=o["deadline_text"],
                frequency=o["frequency"],
                amount_inr=o["amount_inr"],
                source_clause=o["source_clause"],
                page_number=o["page_number"]
            ))

        for dl in d_item.get("deadlines", []):
            db.add(Deadline(
                id=dl["id"],
                document_id=doc.id,
                title=dl["title"],
                date_str=dl["date_str"],
                deadline_type=dl["deadline_type"],
                responsible_party=dl["responsible_party"],
                source_clause=dl["source_clause"],
                page_number=dl["page_number"]
            ))

    db.commit()
