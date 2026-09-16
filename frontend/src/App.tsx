import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { DocumentViewer } from './components/DocumentViewer';
import { LegalClarityMap } from './components/LegalClarityMap';
import { ClauseIntelligence } from './components/ClauseIntelligence';
import { AttentionSystem } from './components/AttentionSystem';
import { ObligationEngine } from './components/ObligationEngine';
import { AskDocument } from './components/AskDocument';
import { ContractComparison } from './components/ContractComparison';
import { LegalKnowledge } from './components/LegalKnowledge';
import { LawyerPrep } from './components/LawyerPrep';
import { NextStepsPanel } from './components/NextStepsPanel';

import type {
  DocumentOverview,
  Clause,
  Finding,
  Obligation,
  Deadline
} from './types';

import {
  fetchDocuments,
  fetchDocumentClauses,
  fetchDocumentFindings,
  fetchDocumentObligations,
  fetchDocumentDeadlines,
  uploadDocument
} from './services/api';

import { Upload, Sparkles } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [language, setLanguage] = useState<string>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [documents, setDocuments] = useState<DocumentOverview[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentOverview | null>(null);

  const [clauses, setClauses] = useState<Clause[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  const [activeSourceHighlight, setActiveSourceHighlight] = useState<{ page_number: number; source_text: string } | null>(null);

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial load of documents
  useEffect(() => {
    async function initDocs() {
      try {
        const docs = await fetchDocuments();
        setDocuments(docs);
        if (docs.length > 0) {
          const defaultDoc = docs.find(d => d.id === 'demo-rental-v1') || docs[0];
          loadDocumentDetails(defaultDoc);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    }
    initDocs();
  }, []);

  const loadDocumentDetails = async (doc: DocumentOverview) => {
    setSelectedDoc(doc);
    try {
      const [cData, fData, oData, dData] = await Promise.all([
        fetchDocumentClauses(doc.id),
        fetchDocumentFindings(doc.id),
        fetchDocumentObligations(doc.id),
        fetchDocumentDeadlines(doc.id),
      ]);
      setClauses(cData);
      setFindings(fData);
      setObligations(oData);
      setDeadlines(dData);
    } catch (err) {
      console.error('Error loading document details:', err);
    }
  };

  const handleShowSource = (page_number: number, source_text: string) => {
    setActiveSourceHighlight({ page_number, source_text });
    if (currentTab === 'landing' || currentTab === 'knowledge') {
      setCurrentTab('workspace');
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress('Reading document...');
    try {
      setTimeout(() => setUploadProgress('Identifying clauses...'), 600);
      setTimeout(() => setUploadProgress('Finding obligations & dates...'), 1200);
      setTimeout(() => setUploadProgress('Building Legal Clarity Map...'), 1800);

      const newDoc = await uploadDocument(file, 'General Agreement');
      const docs = await fetchDocuments();
      setDocuments(docs);
      await loadDocumentDetails(newDoc);
      setShowUploadModal(false);
      setCurrentTab('workspace');
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleOpenDemo = () => {
    const demoDoc = documents.find(d => d.id === 'demo-rental-v1');
    if (demoDoc) {
      loadDocumentDetails(demoDoc);
      setCurrentTab('workspace');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenDemo={handleOpenDemo}
      />

      {/* Main View Renderer */}
      <main className="flex-1">
        
        {currentTab === 'landing' && (
          <LandingPage
            onAnalyzeDocument={() => setShowUploadModal(true)}
            onCompareDocuments={() => setCurrentTab('compare')}
            onOpenDemo={handleOpenDemo}
          />
        )}

        {currentTab !== 'landing' && currentTab !== 'knowledge' && currentTab !== 'compare' && (
          <div className="flex flex-col">
            <WorkspaceHeader
              document={selectedDoc}
              language={language}
              setLanguage={setLanguage}
              onExportPrep={() => setCurrentTab('lawyer_prep')}
              onCompare={() => setCurrentTab('compare')}
              onSelectAnother={() => setShowUploadModal(true)}
            />

            <DocumentViewer
              document={selectedDoc}
              activeSourceHighlight={activeSourceHighlight}
              onClearHighlight={() => setActiveSourceHighlight(null)}
            >
              {currentTab === 'workspace' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Document Executive Overview</h2>
                    <p className="text-xs text-slate-500 mt-0.5">High-level summary and extracted key domains.</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {selectedDoc?.summary}
                  </div>

                  <AttentionSystem
                    findings={findings}
                    clauses={clauses}
                    onShowSource={handleShowSource}
                  />

                  <LegalClarityMap
                    clauses={clauses}
                    language={language}
                    onShowSource={handleShowSource}
                  />
                </div>
              )}

              {currentTab === 'clarity_map' && (
                <LegalClarityMap
                  clauses={clauses}
                  language={language}
                  onShowSource={handleShowSource}
                />
              )}

              {currentTab === 'clauses' && (
                <ClauseIntelligence
                  clauses={clauses}
                  language={language}
                  onShowSource={handleShowSource}
                />
              )}

              {currentTab === 'obligations' && (
                <ObligationEngine
                  obligations={obligations}
                  deadlines={deadlines}
                  onShowSource={handleShowSource}
                />
              )}

              {currentTab === 'ask' && (
                <AskDocument
                  documentId={selectedDoc?.id || 'demo-rental-v1'}
                  language={language}
                  onShowSource={handleShowSource}
                />
              )}

              {currentTab === 'next_steps' && (
                <NextStepsPanel
                  obligations={obligations}
                  deadlines={deadlines}
                  onExportPrep={() => setCurrentTab('lawyer_prep')}
                />
              )}

              {currentTab === 'lawyer_prep' && (
                <LawyerPrep documentId={selectedDoc?.id || 'demo-rental-v1'} />
              )}
            </DocumentViewer>
          </div>
        )}

        {currentTab === 'compare' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <ContractComparison
              docAId="demo-rental-v1"
              docBId="demo-rental-v2"
              onShowSource={handleShowSource}
            />
          </div>
        )}

        {currentTab === 'knowledge' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <LegalKnowledge />
          </div>
        )}

      </main>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Legal Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>

            {uploading ? (
              <div className="py-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <div className="font-bold text-sm text-slate-900 dark:text-white">{uploadProgress}</div>
                <p className="text-xs text-slate-500">Extracting clauses, obligations, dates, and evidence boundaries...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0]);
                  }}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 p-8 rounded-xl text-center space-y-3 cursor-pointer bg-slate-50 dark:bg-slate-800/50"
                >
                  <Upload className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="font-bold text-xs text-slate-700 dark:text-slate-200">
                    Drag & Drop your PDF, DOCX, or TXT legal agreement
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) handleFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                    id="modal-file-input"
                  />
                  <label htmlFor="modal-file-input" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer">
                    Browse File
                  </label>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Or select from pre-loaded Indian demo agreements:</div>
                  <div className="space-y-2">
                    {documents.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          loadDocumentDetails(d);
                          setShowUploadModal(false);
                          setCurrentTab('workspace');
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{d.title}</div>
                          <div className="text-[11px] text-slate-500">{d.doc_type}</div>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">DEMO</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NyaySetu © 2026 • Evidence-First Legal Intelligence Platform</span>
          <span>Informational assistance aid • Not legal representation</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
