import type {
  DocumentOverview,
  Clause,
  Finding,
  Obligation,
  Deadline,
  AskResponse,
  ComparisonResponse,
  LawyerPrepResponse,
  LegalKnowledgeItem,
  LegalSource
} from '../types';

const API_BASE = '/api/v1';

export async function fetchDocuments(): Promise<DocumentOverview[]> {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function fetchDocument(docId: string): Promise<DocumentOverview> {
  const res = await fetch(`${API_BASE}/documents/${docId}`);
  if (!res.ok) throw new Error('Failed to fetch document');
  return res.json();
}

export async function uploadDocument(file: File, docType: string): Promise<DocumentOverview> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('doc_type', docType);

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload document');
  return res.json();
}

export async function fetchDocumentClauses(docId: string): Promise<Clause[]> {
  const res = await fetch(`${API_BASE}/documents/${docId}/clauses`);
  if (!res.ok) throw new Error('Failed to fetch clauses');
  return res.json();
}

export async function fetchDocumentFindings(docId: string): Promise<Finding[]> {
  const res = await fetch(`${API_BASE}/documents/${docId}/findings`);
  if (!res.ok) throw new Error('Failed to fetch findings');
  return res.json();
}

export async function fetchDocumentObligations(docId: string): Promise<Obligation[]> {
  const res = await fetch(`${API_BASE}/documents/${docId}/obligations`);
  if (!res.ok) throw new Error('Failed to fetch obligations');
  return res.json();
}

export async function fetchDocumentDeadlines(docId: string): Promise<Deadline[]> {
  const res = await fetch(`${API_BASE}/documents/${docId}/deadlines`);
  if (!res.ok) throw new Error('Failed to fetch deadlines');
  return res.json();
}

export async function askDocumentQuestion(docId: string, question: string, language: string = 'en'): Promise<AskResponse> {
  const res = await fetch(`${API_BASE}/documents/${docId}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language }),
  });
  if (!res.ok) throw new Error('Failed to get answer');
  return res.json();
}

export async function compareDocuments(docAId: string, docBId: string): Promise<ComparisonResponse> {
  const res = await fetch(`${API_BASE}/documents/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doc_a_id: docAId, doc_b_id: docBId }),
  });
  if (!res.ok) throw new Error('Failed to compare documents');
  return res.json();
}

export async function generateLawyerPrep(docId: string, userNotes?: string): Promise<LawyerPrepResponse> {
  const res = await fetch(`${API_BASE}/lawyer-preparation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: docId, user_notes: userNotes }),
  });
  if (!res.ok) throw new Error('Failed to generate lawyer prep');
  return res.json();
}

export async function fetchLegalKnowledge(query?: string): Promise<LegalKnowledgeItem[]> {
  const url = query ? `${API_BASE}/legal-information/search?q=${encodeURIComponent(query)}` : `${API_BASE}/legal-information/search`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch legal knowledge');
  return res.json();
}

export async function fetchOfficialSources(): Promise<LegalSource[]> {
  const res = await fetch(`${API_BASE}/sources`);
  if (!res.ok) throw new Error('Failed to fetch legal sources');
  return res.json();
}
