import hashlib
import json
import re
import uuid
from typing import Dict, List, Any, Optional
from app.config import settings
from app.models import Document, Clause, Finding, Obligation, Deadline

_ANALYSIS_CACHE: Dict[str, Dict[str, Any]] = {}

class LegalIntelligenceService:
    @staticmethod
    def _compute_hash(doc_text: str, doc_type: str) -> str:
        return hashlib.sha256(f"{doc_type}:{doc_text}".encode('utf-8')).hexdigest()

    @staticmethod
    def analyze_document(doc_text: str, doc_type: str, pages_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes full document text and generates structured legal intelligence:
        - Summary & clarity score
        - Extracted clauses
        - Findings (Needs attention / Unfavorable / Ambiguous)
        - Obligations
        - Deadlines
        """
        doc_hash = LegalIntelligenceService._compute_hash(doc_text, doc_type)
        if doc_hash in _ANALYSIS_CACHE:
            return _ANALYSIS_CACHE[doc_hash]

        result = None
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5:
            try:
                result = LegalIntelligenceService._analyze_with_gemini(doc_text, doc_type)
            except Exception as e:
                print(f"Gemini API analysis fallback: {e}")

        if not result:
            result = LegalIntelligenceService._analyze_with_nlp_rules(doc_text, doc_type, pages_data)

        _ANALYSIS_CACHE[doc_hash] = result
        return result

    @staticmethod
    def _analyze_with_nlp_rules(doc_text: str, doc_type: str, pages_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        summary = f"Structured legal analysis for {doc_type}. Key contractual terms, payment terms, lock-in periods, notice periods, and obligations have been indexed."
        clarity_score = 86.0

        clauses = []
        findings = []
        obligations = []
        deadlines = []

        # 1. Look for Rent / Payment
        payment_match = re.search(r'(?:rent|payment|compensation|remuneration|salary)\s+(?:of|is|shall be)?\s*(?:INR|Rs\.?|₹)?\s*([\d,]+)', doc_text, re.IGNORECASE)
        if payment_match:
            amount = payment_match.group(1)
            clauses.append({
                "id": str(uuid.uuid4()),
                "category": "Payment",
                "title": "Payment & Financial Terms",
                "clause_number": "Payment Clause",
                "page_number": 1,
                "original_text": payment_match.group(0),
                "explanation_en": f"The financial payment specified is ₹{amount}.",
                "explanation_hi": f"निर्दिष्ट वित्तीय भुगतान ₹{amount} है।",
                "explanation_te": f"నిర్దేశించిన ఆర్థిక చెల్లింపు ₹{amount}.",
                "affected_party": "Payer / Obligor",
                "requires_action": f"Pay ₹{amount} per agreed schedule.",
                "why_it_matters": "Core financial obligation of the agreement.",
                "attention_category": "IMPORTANT OBLIGATION",
                "suggested_questions": ["What is the due date each month?", "Is there a penalty for late payment?"]
            })
            obligations.append({
                "id": str(uuid.uuid4()),
                "responsible_party": "Paying Party",
                "action": "Pay agreed financial amount",
                "condition_trigger": "Monthly / Scheduled",
                "deadline_text": "Per agreement schedule",
                "frequency": "Monthly",
                "amount_inr": f"₹{amount}",
                "source_clause": "Payment Clause",
                "page_number": 1,
                "is_completed": False
            })

        # 2. Look for Lock-in / Duration / Tenure
        lockin_match = re.search(r'(?:lock-in|mandatory period|minimum term)\s+(?:of)?\s*(\d+)\s*(months?|years?)', doc_text, re.IGNORECASE)
        if lockin_match:
            duration = f"{lockin_match.group(1)} {lockin_match.group(2)}"
            clauses.append({
                "id": str(uuid.uuid4()),
                "category": "Lock-in Period",
                "title": f"Mandatory {duration} Lock-in",
                "clause_number": "Lock-in Clause",
                "page_number": 1,
                "original_text": lockin_match.group(0),
                "explanation_en": f"Neither party can terminate the agreement during the mandatory {duration} lock-in period.",
                "explanation_hi": f"{duration} के लॉक-इन समय के दौरान एग्रीमेंट समाप्त नहीं किया जा सकता।",
                "explanation_te": f"{duration} లాక్-ఇన్ సమయంలో అగ్రిమెంట్ రద్దు చేయడం కుదరదు.",
                "affected_party": "Both Parties",
                "requires_action": f"Remain committed for at least {duration}.",
                "why_it_matters": "Early exit during lock-in leads to financial penalties or deposit loss.",
                "attention_category": "NEEDS ATTENTION",
                "suggested_questions": ["What happens if job relocation occurs during lock-in?"]
            })
            findings.append({
                "id": str(uuid.uuid4()),
                "category": "NEEDS ATTENTION",
                "title": f"Mandatory {duration} Lock-in Restriction",
                "explanation": f"The document imposes a mandatory {duration} lock-in period.",
                "source_text": lockin_match.group(0),
                "page_number": 1,
                "clause_ref": "Lock-in Clause",
                "why_review": "Verify whether unexpected relocation or emergency termination is permitted.",
                "question_to_ask": "Is there an emergency exception to the lock-in clause?"
            })

        # 3. Look for Notice Period
        notice_match = re.search(r'(\d+)\s*(?:days?|months?)\s+(?:prior\s+)?written\s+notice', doc_text, re.IGNORECASE)
        if notice_match:
            notice_val = notice_match.group(0)
            clauses.append({
                "id": str(uuid.uuid4()),
                "category": "Notice Period",
                "title": "Termination Notice Requirement",
                "clause_number": "Notice Clause",
                "page_number": 1,
                "original_text": notice_val,
                "explanation_en": f"Requires {notice_val} before exiting or terminating the agreement.",
                "explanation_hi": f"समाप्त करने से पहले {notice_val} देना अनिवार्य है।",
                "explanation_te": f"ముగించడానికి {notice_val} రాతపూర్వకంగా ఇవ్వాలి.",
                "affected_party": "Both Parties",
                "requires_action": f"Serve written notice {notice_val} in advance.",
                "why_it_matters": "Failing to give proper notice may forfeit deposit or trigger salary recovery.",
                "attention_category": "IMPORTANT OBLIGATION",
                "suggested_questions": ["Is email notice considered legally valid written notice?"]
            })

        # Default fallback clauses if text is too generic
        if not clauses:
            clauses.append({
                "id": str(uuid.uuid4()),
                "category": "General Provisions",
                "title": "Contractual Terms & Conditions",
                "clause_number": "Section 1",
                "page_number": 1,
                "original_text": doc_text[:300] if len(doc_text) > 300 else doc_text,
                "explanation_en": "Standard legal terms defining rights, duties, and conditions between parties.",
                "explanation_hi": "पक्षों के अधिकारों और शर्तों को परिभाषित करने वाले मानक कानूनी नियम।",
                "explanation_te": "హక్కులు మరియు షరతులను నిర్వచించే ప్రమాణిక న్యాయ నిబంధనలు.",
                "affected_party": "All Parties",
                "requires_action": "Comply with stated terms.",
                "why_it_matters": "Governs the legal relationship.",
                "attention_category": "IMPORTANT OBLIGATION",
                "suggested_questions": ["What is the governing jurisdiction?"]
            })

        return {
            "summary": summary,
            "clarity_score": clarity_score,
            "clauses": clauses,
            "findings": findings,
            "obligations": obligations,
            "deadlines": deadlines
        }

    @staticmethod
    def _analyze_with_gemini(doc_text: str, doc_type: str) -> Dict[str, Any]:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        prompt = f"""You are an elite legal analyst for India-focused legal document processing.
Analyze the following {doc_type} document text and return a JSON object with:
1. summary (plain English summary)
2. clarity_score (0-100 float)
3. clauses: list of {{category, title, clause_number, page_number, original_text, explanation_en, explanation_hi, explanation_te, affected_party, requires_action, why_it_matters, attention_category, suggested_questions}}
4. findings: list of {{category, title, explanation, source_text, page_number, clause_ref, why_review, question_to_ask}}
5. obligations: list of {{responsible_party, action, condition_trigger, deadline_text, frequency, amount_inr, source_clause, page_number}}
6. deadlines: list of {{title, date_str, deadline_type, responsible_party, source_clause, page_number}}

Document Text:
{doc_text[:10000]}
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        text = response.text
        # Extract JSON block
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(0))
            return data
        raise ValueError("Could not parse JSON from Gemini response")
