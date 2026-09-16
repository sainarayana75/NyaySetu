export interface SourceReference {
  document_id?: string;
  page_number: number;
  section?: string;
  clause?: string;
  source_text: string;
  why_it_matters?: string;
}

export interface DocumentOverview {
  id: string;
  title: string;
  original_filename: string;
  file_type: string;
  file_size_bytes: number;
  doc_type: string;
  language: string;
  page_count: number;
  status: string;
  status_message?: string;
  summary?: string;
  clarity_score: number;
  is_demo: boolean;
  created_at: string;
  clauses_count: number;
  findings_count: number;
  obligations_count: number;
  deadlines_count: number;
}

export interface Clause {
  id: string;
  document_id: string;
  category: string;
  title: string;
  clause_number?: string;
  page_number: number;
  original_text: string;
  explanation_en: string;
  explanation_hi?: string;
  explanation_te?: string;
  affected_party?: string;
  requires_action?: string;
  why_it_matters?: string;
  attention_category: 'IMPORTANT OBLIGATION' | 'NEEDS ATTENTION' | 'POTENTIALLY UNFAVORABLE' | 'UNCLEAR' | 'MISSING INFORMATION' | 'POTENTIAL INCONSISTENCY';
  suggested_questions: string[];
}

export interface Finding {
  id: string;
  document_id: string;
  category: string;
  title: string;
  explanation: string;
  source_text: string;
  page_number: number;
  clause_ref?: string;
  why_review: string;
  question_to_ask?: string;
  clause_a_id?: string;
  clause_b_id?: string;
}

export interface Obligation {
  id: string;
  document_id: string;
  responsible_party: string;
  action: string;
  condition_trigger?: string;
  deadline_text?: string;
  frequency?: string;
  amount_inr?: string;
  source_clause?: string;
  page_number: number;
  is_completed: boolean;
}

export interface Deadline {
  id: string;
  document_id: string;
  title: string;
  date_str: string;
  deadline_type: string;
  responsible_party?: string;
  source_clause?: string;
  page_number: number;
}

export interface AskResponse {
  answer: string;
  response_classification: 'DOCUMENT_FACT' | 'GENERAL_LEGAL_INFORMATION' | 'AI_EXPLANATION' | 'INFERENCE' | 'INSUFFICIENT_EVIDENCE' | 'PROFESSIONAL_REVIEW_RECOMMENDED';
  sources: SourceReference[];
  plain_explanation?: string;
  suggested_followups: string[];
}

export interface ComparisonItem {
  clause_category: string;
  change_type: 'ADDED' | 'REMOVED' | 'MODIFIED' | 'UNCHANGED';
  attribute: string;
  old_text?: string;
  new_text?: string;
  what_changed: string;
  plain_explanation: string;
  why_review: string;
  source_a?: SourceReference;
  source_b?: SourceReference;
}

export interface ComparisonResponse {
  id: string;
  doc_a_title: string;
  doc_b_title: string;
  summary: string;
  changes: ComparisonItem[];
}

export interface LawyerPrepResponse {
  document_title: string;
  doc_type: string;
  generated_at: string;
  summary: string;
  key_parties: string[];
  financial_terms: string[];
  important_dates: Array<{ title: string; date: string; type: string }>;
  key_obligations: Array<{ party: string; action: string; deadline: string }>;
  areas_for_clarification: Array<{ clause_ref: string; title: string; issue: string; original_text: string }>;
  recommended_questions: string[];
  checklist_documents: string[];
  disclaimer: string;
}

export interface LegalKnowledgeItem {
  id: string;
  topic: string;
  category: string;
  title: string;
  summary: string;
  detailed_explanation: string;
  authoritative_source: string;
  source_url?: string;
  questions: string[];
}

export interface LegalSource {
  id: string;
  name: string;
  authority: string;
  url?: string;
  description: string;
}
