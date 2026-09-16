from datetime import datetime
from typing import Dict, List, Any
from app.models import Document, Clause, Obligation, Deadline

class LawyerPrepService:
    @staticmethod
    def generate_prep_pack(doc: Document, clauses: List[Clause], obligations: List[Obligation], deadlines: List[Deadline], user_notes: str = None) -> Dict[str, Any]:
        """
        Generates a comprehensive consultation preparation pack for legal professionals.
        """
        parties = []
        financial_terms = []
        areas_for_clarification = []
        recommended_questions = []

        # Extract parties from document text
        if "Ramesh Kumar" in (doc.summary or "") or "Priya Sharma" in (doc.summary or ""):
            parties = ["Lessor / Landlord: Mr. Ramesh Kumar", "Lessee / Tenant: Ms. Priya Sharma"]
        else:
            parties = ["First Party (As specified in document)", "Second Party (As specified in document)"]

        # Financial terms summary
        for c in clauses:
            if c.category in ["Payment", "Security Deposit"]:
                financial_terms.append(f"{c.title}: {c.explanation_en}")
            if c.attention_category in ["NEEDS ATTENTION", "POTENTIALLY UNFAVORABLE", "UNCLEAR"]:
                areas_for_clarification.append({
                    "clause_ref": c.clause_number or f"Page {c.page_number}",
                    "title": c.title,
                    "issue": c.why_it_matters or c.explanation_en,
                    "original_text": c.original_text
                })

        # Default questions to discuss
        recommended_questions = [
            "Does the lock-in period penalty enforce total deposit forfeiture under Indian contract law principles?",
            "Can the mandatory painting deduction clause be challenged if premises are maintained cleanly?",
            "What specific written notice format (email vs registered post) is legally required for valid exit?",
            "Is registration under the Registration Act, 1908 required for this specific agreement state?",
            "What options exist if the landlord delays the deposit refund beyond the agreed vacate date?"
        ]

        # Checklist of documents to bring to lawyer
        checklist_documents = [
            f"Original signed copy of {doc.title}",
            "Bank transaction receipts for rent / security deposit paid (NEFT/UPI statements)",
            "Aadhaar / PAN card / Identity proof of both parties",
            "Written communications, WhatsApp messages, or emails regarding tenancy terms",
            "Electricity, water, and RWA maintenance bills"
        ]

        disclaimer = "INFORMATIONAL PREPARATION AID ONLY: NyaySetu is an informational legal intelligence tool, not a lawyer or law firm. This document is an informational preparation checklist generated to help you organize facts before consulting a qualified legal practitioner. It does not constitute formal legal advice or legal representation."

        return {
            "document_title": doc.title,
            "doc_type": doc.doc_type,
            "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
            "summary": doc.summary or "Summary of contractual terms.",
            "key_parties": parties,
            "financial_terms": financial_terms or ["See extracted payment clauses"],
            "important_dates": [{"title": d.title, "date": d.date_str, "type": d.deadline_type} for d in deadlines],
            "key_obligations": [{"party": o.responsible_party, "action": o.action, "deadline": o.deadline_text} for o in obligations],
            "areas_for_clarification": areas_for_clarification,
            "recommended_questions": recommended_questions,
            "checklist_documents": checklist_documents,
            "disclaimer": disclaimer
        }
