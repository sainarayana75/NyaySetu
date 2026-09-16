from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class SourceReference(BaseModel):
    document_id: Optional[str] = None
    page_number: int = 1
    section: Optional[str] = None
    clause: Optional[str] = None
    source_text: str
    why_it_matters: Optional[str] = None

class FindingSchema(BaseModel):
    id: str
    document_id: str
    category: str
    title: str
    explanation: str
    source_text: str
    page_number: int
    clause_ref: Optional[str] = None
    why_review: str
    question_to_ask: Optional[str] = None
    clause_a_id: Optional[str] = None
    clause_b_id: Optional[str] = None

class ClauseSchema(BaseModel):
    id: str
    document_id: str
    category: str
    title: str
    clause_number: Optional[str] = None
    page_number: int
    original_text: str
    explanation_en: str
    explanation_hi: Optional[str] = None
    explanation_te: Optional[str] = None
    affected_party: Optional[str] = None
    requires_action: Optional[str] = None
    why_it_matters: Optional[str] = None
    attention_category: str
    suggested_questions: List[str] = []

class ObligationSchema(BaseModel):
    id: str
    document_id: str
    responsible_party: str
    action: str
    condition_trigger: Optional[str] = None
    deadline_text: Optional[str] = None
    frequency: Optional[str] = None
    amount_inr: Optional[str] = None
    source_clause: Optional[str] = None
    page_number: int
    is_completed: bool = False

class DeadlineSchema(BaseModel):
    id: str
    document_id: str
    title: str
    date_str: str
    deadline_type: str
    responsible_party: Optional[str] = None
    source_clause: Optional[str] = None
    page_number: int

class DocumentOverviewSchema(BaseModel):
    id: str
    title: str
    original_filename: str
    file_type: str
    file_size_bytes: int
    doc_type: str
    language: str
    page_count: int
    status: str
    status_message: Optional[str] = None
    summary: Optional[str] = None
    clarity_score: float
    is_demo: bool
    created_at: datetime
    clauses_count: int = 0
    findings_count: int = 0
    obligations_count: int = 0
    deadlines_count: int = 0

class AskQuestionRequest(BaseModel):
    question: str
    language: Optional[str] = "en"

class AskQuestionResponse(BaseModel):
    answer: str
    response_classification: str # DOCUMENT_FACT, GENERAL_LEGAL_INFORMATION, AI_EXPLANATION, INFERENCE, INSUFFICIENT_EVIDENCE, PROFESSIONAL_REVIEW_RECOMMENDED
    sources: List[SourceReference] = []
    plain_explanation: Optional[str] = None
    suggested_followups: List[str] = []

class CompareRequest(BaseModel):
    doc_a_id: str
    doc_b_id: str

class ComparisonItemSchema(BaseModel):
    clause_category: str
    change_type: str # ADDED, REMOVED, MODIFIED, UNCHANGED
    attribute: str # Notice period, Rent, Security Deposit, Penalty, etc.
    old_text: Optional[str] = None
    new_text: Optional[str] = None
    what_changed: str
    plain_explanation: str
    why_review: str
    source_a: Optional[SourceReference] = None
    source_b: Optional[SourceReference] = None

class ComparisonResponse(BaseModel):
    id: str
    doc_a_title: str
    doc_b_title: str
    summary: str
    changes: List[ComparisonItemSchema] = []

class LawyerPrepRequest(BaseModel):
    document_id: str
    user_notes: Optional[str] = None

class LawyerPrepResponse(BaseModel):
    document_title: str
    doc_type: str
    generated_at: str
    summary: str
    key_parties: List[str]
    financial_terms: List[str]
    important_dates: List[Dict[str, Any]]
    key_obligations: List[Dict[str, Any]]
    areas_for_clarification: List[Dict[str, Any]]
    recommended_questions: List[str]
    checklist_documents: List[str]
    disclaimer: str

class LegalKnowledgeResponse(BaseModel):
    id: str
    topic: str
    category: str
    title: str
    summary: str
    detailed_explanation: str
    authoritative_source: str
    source_url: Optional[str] = None
    questions: List[str] = []
