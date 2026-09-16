from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="user")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    title = Column(String, index=True)
    original_filename = Column(String)
    file_type = Column(String) # pdf, docx, txt
    file_path = Column(String)
    file_size_bytes = Column(Integer)
    doc_type = Column(String, default="General Agreement") # Rental, Employment, NDA, Loan, etc.
    language = Column(String, default="en")
    page_count = Column(Integer, default=1)
    status = Column(String, default="UPLOADING") # UPLOADING, EXTRACTING, ANALYZING, READY, FAILED
    status_message = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    clarity_score = Column(Float, default=85.0)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    clauses = relationship("Clause", back_populates="document", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="document", cascade="all, delete-orphan")
    obligations = relationship("Obligation", back_populates="document", cascade="all, delete-orphan")
    deadlines = relationship("Deadline", back_populates="document", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    chunk_index = Column(Integer)
    page_number = Column(Integer)
    section_title = Column(String, nullable=True)
    clause_number = Column(String, nullable=True)
    text = Column(Text)
    start_char = Column(Integer, nullable=True)
    end_char = Column(Integer, nullable=True)
    embedding = Column(JSON, nullable=True)

    document = relationship("Document", back_populates="chunks")

class Clause(Base):
    __tablename__ = "clauses"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    category = Column(String, index=True) # Payment, Termination, Renewal, Penalty, Notice, etc.
    title = Column(String)
    clause_number = Column(String, nullable=True)
    page_number = Column(Integer, default=1)
    original_text = Column(Text)
    explanation_en = Column(Text)
    explanation_hi = Column(Text, nullable=True)
    explanation_te = Column(Text, nullable=True)
    affected_party = Column(String, nullable=True)
    requires_action = Column(Text, nullable=True)
    why_it_matters = Column(Text, nullable=True)
    attention_category = Column(String, default="IMPORTANT") # NEEDS ATTENTION, POTENTIALLY UNFAVORABLE, UNCLEAR, MISSING INFORMATION, POTENTIAL INCONSISTENCY, IMPORTANT OBLIGATION
    suggested_questions = Column(JSON, default=list)

    document = relationship("Document", back_populates="clauses")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    category = Column(String) # NEEDS ATTENTION, UNFAVORABLE, UNCLEAR, INCONSISTENCY, MISSING_INFO
    title = Column(String)
    explanation = Column(Text)
    source_text = Column(Text)
    page_number = Column(Integer, default=1)
    clause_ref = Column(String, nullable=True)
    why_review = Column(Text)
    question_to_ask = Column(Text, nullable=True)
    clause_a_id = Column(String, nullable=True)
    clause_b_id = Column(String, nullable=True)

    document = relationship("Document", back_populates="findings")

class Obligation(Base):
    __tablename__ = "obligations"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    responsible_party = Column(String) # Tenant, Landlord, Employee, Employer, Service Provider, etc.
    action = Column(Text)
    condition_trigger = Column(Text, nullable=True)
    deadline_text = Column(String, nullable=True)
    frequency = Column(String, nullable=True)
    amount_inr = Column(String, nullable=True)
    source_clause = Column(String, nullable=True)
    page_number = Column(Integer, default=1)
    is_completed = Column(Boolean, default=False)

    document = relationship("Document", back_populates="obligations")

class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    title = Column(String)
    date_str = Column(String)
    deadline_type = Column(String, default="Contractual") # Payment, Notice, Renewal, Expiry, Start
    responsible_party = Column(String, nullable=True)
    source_clause = Column(String, nullable=True)
    page_number = Column(Integer, default=1)

    document = relationship("Document", back_populates="deadlines")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"), nullable=True)
    title = Column(String, default="Document Q&A")
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id"))
    sender = Column(String) # user or assistant
    content = Column(Text)
    response_classification = Column(String, nullable=True) # DOCUMENT_FACT, GENERAL_LEGAL_INFORMATION, AI_EXPLANATION, INFERENCE, INSUFFICIENT_EVIDENCE
    sources = Column(JSON, default=list) # [{page_number, section, clause, source_text}]
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")

class Comparison(Base):
    __tablename__ = "comparisons"

    id = Column(String, primary_key=True, index=True)
    doc_a_id = Column(String, ForeignKey("documents.id"))
    doc_b_id = Column(String, ForeignKey("documents.id"))
    title = Column(String)
    summary = Column(Text)
    changes_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

class LegalKnowledgeItem(Base):
    __tablename__ = "legal_knowledge_items"

    id = Column(String, primary_key=True, index=True)
    topic = Column(String, index=True)
    category = Column(String) # Agreements, Notices, Rights, Dispute Resolution, Statutory Terms
    title = Column(String)
    summary = Column(Text)
    detailed_explanation = Column(Text)
    authoritative_source = Column(String) # India Code, eCourts, NALSA, Supreme Court
    source_url = Column(String, nullable=True)
    questions = Column(JSON, default=list)

class Source(Base):
    __tablename__ = "sources"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    authority = Column(String) # Government of India / NALSA / Judiciary
    url = Column(String, nullable=True)
    description = Column(Text)
