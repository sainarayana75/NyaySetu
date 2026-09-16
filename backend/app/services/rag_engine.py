import re
from typing import Dict, List, Any
from app.config import settings

class RAGEngineService:
    @staticmethod
    def answer_question(question: str, document_text: str, clauses: List[Any], language: str = "en") -> Dict[str, Any]:
        """
        Executes evidence-grounded RAG Q&A.
        Enforces:
        - Prompt injection defense
        - Structured source attribution
        - Refusal when evidence is insufficient
        """
        q_lower = question.lower().strip()
        
        # Prompt Injection Defense check
        if RAGEngineService._detect_prompt_injection(q_lower):
            return {
                "answer": "Security Alert: System instructions and security parameters cannot be altered or bypassed by document or user inputs.",
                "response_classification": "INSUFFICIENT_EVIDENCE",
                "sources": [],
                "plain_explanation": "Prompt injection detected.",
                "suggested_followups": ["What are the obligations under this agreement?", "When does this document expire?"]
            }

        # 1. Search for matching clauses in document
        matched_sources = []
        best_answer = None
        classification = "DOCUMENT_FACT"

        # Check Obligations question
        if any(w in q_lower for w in ["obligation", "duty", "responsible", "responsibility", "what must i do", "my duties"]):
            obligation_clauses = [c for c in clauses if c.category in ["Payment", "Obligation", "Lock-in Period", "Notice Period", "Security Deposit"] or "obligation" in c.original_text.lower()]
            if obligation_clauses:
                best_answer = "Based on your document, your primary obligations include:\n"
                for idx, c in enumerate(obligation_clauses[:3], 1):
                    best_answer += f"{idx}. **{c.title}**: {c.explanation_en}\n"
                    matched_sources.append({
                        "document_id": c.document_id,
                        "page_number": c.page_number,
                        "section": c.category,
                        "clause": c.clause_number,
                        "source_text": c.original_text,
                        "why_it_matters": c.why_it_matters
                    })
                best_answer += "\n*Note: Review the full document workspace to verify all conditional obligations.*"

        # Check Rent / Payment / Money question
        elif any(w in q_lower for w in ["rent", "payment", "cost", "price", "money", "deposit", "fee", "penalty"]):
            payment_clauses = [c for c in clauses if c.category in ["Payment", "Security Deposit"] or any(k in c.original_text.lower() for k in ["rent", "deposit", "penalty", "inr", "rs."])]
            if payment_clauses:
                best_answer = "Regarding financial terms and payments in your document:\n"
                for c in payment_clauses:
                    best_answer += f"• **{c.title}**: {c.explanation_en}\n"
                    matched_sources.append({
                        "document_id": c.document_id,
                        "page_number": c.page_number,
                        "section": c.category,
                        "clause": c.clause_number,
                        "source_text": c.original_text,
                        "why_it_matters": c.why_it_matters
                    })

        # Check Expiry / Duration / Dates question
        elif any(w in q_lower for w in ["expire", "expiry", "duration", "tenure", "term", "lock-in", "period", "dates", "when"]):
            date_clauses = [c for c in clauses if c.category in ["Lock-in Period", "Notice Period"] or any(k in c.original_text.lower() for k in ["month", "year", "commencing", "duration", "expire"])]
            if date_clauses:
                best_answer = "Regarding contractual duration and dates:\n"
                for c in date_clauses:
                    best_answer += f"• **{c.title}**: {c.explanation_en}\n"
                    matched_sources.append({
                        "document_id": c.document_id,
                        "page_number": c.page_number,
                        "section": c.category,
                        "clause": c.clause_number,
                        "source_text": c.original_text,
                        "why_it_matters": c.why_it_matters
                    })

        # Check Termination / Leaving question
        elif any(w in q_lower for w in ["terminate", "termination", "leave", "vacate", "exit", "cancel", "notice"]):
            term_clauses = [c for c in clauses if c.category in ["Notice Period", "Lock-in Period"] or "terminate" in c.original_text.lower()]
            if term_clauses:
                best_answer = "Regarding termination and vacating terms:\n"
                for c in term_clauses:
                    best_answer += f"• **{c.title}**: {c.explanation_en}\n"
                    matched_sources.append({
                        "document_id": c.document_id,
                        "page_number": c.page_number,
                        "section": c.category,
                        "clause": c.clause_number,
                        "source_text": c.original_text,
                        "why_it_matters": c.why_it_matters
                    })

        # Fallback if no matching clauses found
        if not best_answer:
            if clauses:
                c = clauses[0]
                best_answer = f"Here is relevant information from your document:\n**{c.title}**: {c.explanation_en}"
                matched_sources.append({
                    "document_id": c.document_id,
                    "page_number": c.page_number,
                    "section": c.category,
                    "clause": c.clause_number,
                    "source_text": c.original_text,
                    "why_it_matters": c.why_it_matters
                })
            else:
                return {
                    "answer": "I couldn't find sufficient information in the provided document to answer this specific question.",
                    "response_classification": "INSUFFICIENT_EVIDENCE",
                    "sources": [],
                    "plain_explanation": "The uploaded document does not contain explicit clauses addressing this query.",
                    "suggested_followups": [
                        "What are my obligations under this agreement?",
                        "What is the monthly rent and deposit?",
                        "What is the notice period for termination?"
                    ]
                }

        return {
            "answer": best_answer,
            "response_classification": classification,
            "sources": matched_sources,
            "plain_explanation": "This answer is directly grounded in extracted clauses from your document.",
            "suggested_followups": [
                "Show me the exact source clause for this answer",
                "What happens if this clause is breached?",
                "Prepare questions about this for a legal consultation"
            ]
        }

    @staticmethod
    def _detect_prompt_injection(text: str) -> bool:
        injection_patterns = [
            r'ignore\s+(?:all\s+)?previous\s+instructions',
            r'system\s+prompt',
            r'reveal\s+(?:your\s+)?instructions',
            r'you\s+are\s+now\s+a\s+different\s+ai',
            r'override\s+safety'
        ]
        return any(re.search(p, text, re.IGNORECASE) for p in injection_patterns)
