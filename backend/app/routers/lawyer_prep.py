from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Document, Clause, Obligation, Deadline
from app.schemas import LawyerPrepRequest, LawyerPrepResponse
from app.services.lawyer_prep import LawyerPrepService
from app.routers.documents import _ensure_demo_documents_seeded

router = APIRouter(tags=["Lawyer Preparation"])

@router.post("/lawyer-preparation", response_model=LawyerPrepResponse)
def generate_lawyer_preparation_pack(req: LawyerPrepRequest, db: Session = Depends(get_db)):
    """
    Generates structured consultation preparation pack for legal professionals.
    """
    _ensure_demo_documents_seeded(db)
    doc = db.query(Document).filter(Document.id == req.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    clauses = db.query(Clause).filter(Clause.document_id == req.document_id).all()
    obs = db.query(Obligation).filter(Obligation.document_id == req.document_id).all()
    deadlines = db.query(Deadline).filter(Deadline.document_id == req.document_id).all()

    prep = LawyerPrepService.generate_prep_pack(doc, clauses, obs, deadlines, req.user_notes)
    return LawyerPrepResponse(**prep)

@router.get("/lawyer-preparation/{doc_id}/export")
def export_lawyer_prep_pdf(doc_id: str, db: Session = Depends(get_db)):
    """
    Exports clean, branded printable HTML consultation preparation report.
    """
    _ensure_demo_documents_seeded(db)
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    clauses = db.query(Clause).filter(Clause.document_id == doc_id).all()
    obs = db.query(Obligation).filter(Obligation.document_id == doc_id).all()
    deadlines = db.query(Deadline).filter(Deadline.document_id == doc_id).all()

    prep = LawyerPrepService.generate_prep_pack(doc, clauses, obs, deadlines)

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>NyaySetu Legal Consultation Preparation Pack - {prep['document_title']}</title>
    <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; max-width: 850px; margin: 0 auto; }}
        .header {{ border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }}
        .logo {{ font-size: 28px; font-weight: bold; color: #1e3a8a; }}
        .tagline {{ font-size: 14px; color: #64748b; font-style: italic; }}
        .doc-title {{ font-size: 22px; font-weight: bold; margin-top: 15px; color: #0f172a; }}
        .section {{ margin-bottom: 30px; }}
        .section-title {{ font-size: 16px; font-weight: bold; color: #2563eb; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }}
        .disclaimer-box {{ background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 30px; font-size: 13px; color: #1e40af; }}
        ul {{ padding-left: 20px; }}
        li {{ margin-bottom: 8px; }}
        .footer {{ margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }}
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">NyaySetu</div>
        <div class="tagline">Bridging Legal Complexity and Understanding.</div>
        <div class="doc-title">LEGAL CONSULTATION PREPARATION REPORT</div>
        <div style="font-size: 13px; color: #64748b; margin-top: 5px;">Document: {prep['document_title']} ({prep['doc_type']}) | Generated: {prep['generated_at']}</div>
    </div>

    <div class="disclaimer-box">
        <strong>IMPORTANT INFORMATIONAL NOTICE:</strong> {prep['disclaimer']}
    </div>

    <div class="section">
        <div class="section-title">1. Document Executive Overview</div>
        <p>{prep['summary']}</p>
    </div>

    <div class="section">
        <div class="section-title">2. Identified Key Parties</div>
        <ul>
            {"".join(f"<li>{p}</li>" for p in prep['key_parties'])}
        </ul>
    </div>

    <div class="section">
        <div class="section-title">3. Financial Terms & Commitments</div>
        <ul>
            {"".join(f"<li>{ft}</li>" for ft in prep['financial_terms'])}
        </ul>
    </div>

    <div class="section">
        <div class="section-title">4. Key Contractual Obligations</div>
        <ul>
            {"".join(f"<li><strong>{o['party']}</strong>: {o['action']} (Deadline: {o['deadline']})</li>" for o in prep['key_obligations'])}
        </ul>
    </div>

    <div class="section">
        <div class="section-title">5. Areas Recommended for Professional Clarification</div>
        <ul>
            {"".join(f"<li><strong>{a['title']} ({a['clause_ref']})</strong>: {a['issue']}</li>" for a in prep['areas_for_clarification'])}
        </ul>
    </div>

    <div class="section">
        <div class="section-title">6. Suggested Questions to Discuss with Advocate</div>
        <ul>
            {"".join(f"<li>{q}</li>" for q in prep['recommended_questions'])}
        </ul>
    </div>

    <div class="section">
        <div class="section-title">7. Supporting Documents Checklist</div>
        <ul>
            {"".join(f"<li>[  ] {doc_item}</li>" for doc_item in prep['checklist_documents'])}
        </ul>
    </div>

    <div class="footer">
        Generated by NyaySetu Evidence-First Legal Intelligence Platform • www.nyaysetu.in
    </div>
</body>
</html>"""

    return Response(content=html_content, media_type="text/html")
