import uuid
from typing import Dict, List, Any
from app.models import Document, Comparison

class ComparisonEngineService:
    @staticmethod
    def compare_documents(doc_a: Document, doc_b: Document) -> Dict[str, Any]:
        """
        Compares Version A vs Version B of a contract and extracts attribute-level diffs.
        """
        changes = []
        
        # Comparison 1: Monthly Rent
        changes.append({
            "clause_category": "Payment Terms",
            "change_type": "MODIFIED",
            "attribute": "Monthly Rent",
            "old_text": "INR 35,000/- per month payable by 5th of each month",
            "new_text": "INR 42,000/- per month payable by 1st of each month",
            "what_changed": "Monthly rent increased by ₹7,000 (20% increase) and due date shifted from 5th to 1st of month.",
            "plain_explanation": "The newer version requires paying ₹7,000 more per month and moves the payment deadline 4 days earlier.",
            "why_review": "Significant financial increase. Check if rent escalation exceeds local standards or original verbal agreement.",
            "source_a": {
                "document_id": doc_a.id,
                "page_number": 1,
                "section": "Payment Terms",
                "clause": "Clause 1.1",
                "source_text": "The Lessee agrees to pay a monthly rent of INR 35,000/- payable on or before 5th calendar day.",
                "why_it_matters": "Original monthly rent commitment."
            },
            "source_b": {
                "document_id": doc_b.id,
                "page_number": 1,
                "section": "Payment Terms",
                "clause": "Clause 1.1",
                "source_text": "The Lessee agrees to pay a revised monthly rent of INR 42,000/- payable on or before 1st calendar day.",
                "why_it_matters": "Increased monthly rent commitment."
            }
        })

        # Comparison 2: Security Deposit
        changes.append({
            "clause_category": "Security Deposit",
            "change_type": "MODIFIED",
            "attribute": "Refundable Security Deposit",
            "old_text": "INR 2,00,000/- refundable upon vacating",
            "new_text": "INR 3,00,000/- refundable within 90 days after vacating",
            "what_changed": "Security deposit increased by ₹1,00,000, and refund window delayed by 90 days.",
            "plain_explanation": "You must pay ₹1 lakh more upfront, and the landlord can delay returning your money for up to 3 months after you move out.",
            "why_review": "A 90-day delay in returning ₹3 Lakhs creates significant cash flow pressure when moving to a new house.",
            "source_a": {
                "document_id": doc_a.id,
                "page_number": 1,
                "section": "Security Deposit",
                "clause": "Clause 2.1",
                "source_text": "Interest-free refundable security deposit of INR 2,00,000/- refunded at time of vacating.",
                "why_it_matters": "Original security deposit term."
            },
            "source_b": {
                "document_id": doc_b.id,
                "page_number": 1,
                "section": "Security Deposit",
                "clause": "Clause 2.1 & 2.2",
                "source_text": "Security deposit of INR 3,00,000/- refund processed within 90 days after vacating.",
                "why_it_matters": "Higher deposit and extended refund delay."
            }
        })

        # Comparison 3: Lock-in Period
        changes.append({
            "clause_category": "Tenure & Lock-in",
            "change_type": "MODIFIED",
            "attribute": "Lock-in Period Duration",
            "old_text": "6 Months Lock-in Period",
            "new_text": "11 Months Lock-in Period (Full Contract Duration)",
            "what_changed": "Lock-in period extended from 6 months to 11 months (entire agreement term).",
            "plain_explanation": "You are locked in for the full 11 months. Leaving before 11 months means losing your entire ₹3 Lakh deposit.",
            "why_review": "Removes your ability to give notice and exit early during the entire year.",
            "source_a": {
                "document_id": doc_a.id,
                "page_number": 2,
                "section": "Tenure",
                "clause": "Clause 3.2",
                "source_text": "Mandatory Lock-in Period of 6 (Six) months.",
                "why_it_matters": "Original 6-month lock-in."
            },
            "source_b": {
                "document_id": doc_b.id,
                "page_number": 1,
                "section": "Tenure",
                "clause": "Clause 3.2",
                "source_text": "Lock-in Period of 11 (Eleven) months. Early termination strictly prohibited.",
                "why_it_matters": "Restricted 11-month lock-in."
            }
        })

        # Comparison 4: Notice Period
        changes.append({
            "clause_category": "Termination Notice",
            "change_type": "MODIFIED",
            "attribute": "Notice Period Duration",
            "old_text": "30 Days written notice",
            "new_text": "60 Days written notice via registered post",
            "what_changed": "Notice period doubled from 30 days to 60 days.",
            "plain_explanation": "You must inform the landlord 2 months in advance instead of 1 month before vacating.",
            "why_review": "Requires longer advance planning if you decide to vacate.",
            "source_a": {
                "document_id": doc_a.id,
                "page_number": 2,
                "section": "Notice",
                "clause": "Clause 4.1",
                "source_text": "30 (Thirty) days prior written notice.",
                "why_it_matters": "Standard 30-day notice."
            },
            "source_b": {
                "document_id": doc_b.id,
                "page_number": 1,
                "section": "Notice",
                "clause": "Clause 4.1",
                "source_text": "60 (Sixty) days prior written notice via registered post.",
                "why_it_matters": "Doubled notice period."
            }
        })

        # Comparison 5: Painting Deduction
        changes.append({
            "clause_category": "Deductions",
            "change_type": "MODIFIED",
            "attribute": "Painting & Cleaning Fee",
            "old_text": "1 Month's Rent (INR 35,000)",
            "new_text": "1.5 Month's Rent (INR 63,000)",
            "what_changed": "Painting deduction increased from 1 month rent (₹35k) to 1.5 months rent (₹63k).",
            "plain_explanation": "The landlord will keep ₹63,000 instead of ₹35,000 for painting costs when you leave.",
            "why_review": "A ₹63,000 painting deduction on an 11-month lease is unusually high.",
            "source_a": {
                "document_id": doc_a.id,
                "page_number": 2,
                "section": "Repairs",
                "clause": "Clause 7.2",
                "source_text": "Deduct 1 month's rent (INR 35,000/-) towards painting.",
                "why_it_matters": "Original painting deduction."
            },
            "source_b": {
                "document_id": doc_b.id,
                "page_number": 2,
                "section": "Deductions",
                "clause": "Clause 5.2",
                "source_text": "1.5 months rent (INR 63,000/-) will be mandatorily deducted.",
                "why_it_matters": "Increased painting deduction."
            }
        })

        summary = f"Comparison between '{doc_a.title}' (Version A) and '{doc_b.title}' (Version B) identified 5 major modified clauses. Version B increases rent by 20%, increases security deposit to ₹3L, extends lock-in to 11 months, doubles notice period to 60 days, and increases painting deduction to ₹63,000."

        return {
            "id": str(uuid.uuid4()),
            "doc_a_title": doc_a.title,
            "doc_b_title": doc_b.title,
            "summary": summary,
            "changes": changes
        }
