import React, { useState, useEffect } from 'react';
import type { LawyerPrepResponse } from '../types';
import { generateLawyerPrep } from '../services/api';
import { FileText, Printer, CheckSquare, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface LawyerPrepProps {
  documentId: string;
}

export const LawyerPrep: React.FC<LawyerPrepProps> = ({ documentId }) => {
  const [prep, setPrep] = useState<LawyerPrepResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrep() {
      setLoading(true);
      try {
        const data = await generateLawyerPrep(documentId);
        setPrep(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPrep();
  }, [documentId]);

  const handlePrint = () => {
    window.open(`/api/v1/lawyer-preparation/${documentId}/export`, '_blank');
  };

  if (loading) {
    return (
      <div className="text-center py-12 space-y-3">
        <Sparkles className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Generating Legal Consultation Preparation Pack...</div>
        <p className="text-xs text-slate-500">Extracting key facts, financial commitments, questions, and evidence checklists...</p>
      </div>
    );
  }

  if (!prep) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        Failed to load preparation pack. Please ensure a document is selected.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Export Action */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-amber-300" />
            <h2 className="font-bold text-xl">Lawyer Consultation Preparation Pack</h2>
          </div>
          <p className="text-xs text-slate-300">
            Organized checklist and evidence summary for discussing your contract with a qualified advocate.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-center"
        >
          <Printer className="w-4 h-4" />
          <span>Export / Print PDF Pack</span>
        </button>
      </div>

      {/* Informational Disclaimer Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 p-4 rounded-xl flex items-start space-x-3 text-blue-900 dark:text-blue-200 text-xs">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>INFORMATIONAL PREPARATION AID ONLY:</strong> {prep.disclaimer}
        </div>
      </div>

      {/* Executive Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">1. Executive Document Overview</h3>
        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{prep.summary}</p>
      </div>

      {/* Grid of Parties & Financials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">2. Key Identified Parties</h3>
          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {prep.key_parties.map((p, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">3. Financial Terms & Commitments</h3>
          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {prep.financial_terms.map((ft, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                <span>{ft}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Questions for Advocate */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>4. Recommended Questions to Discuss with your Lawyer</span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200">
          {prep.recommended_questions.map((q, idx) => (
            <li key={idx} className="flex items-start space-x-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-amber-600 dark:text-amber-400">{idx + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Supporting Documents Checklist */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
          <CheckSquare className="w-4 h-4" />
          <span>5. Documents & Evidence Checklist to Gather</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
          {prep.checklist_documents.map((docItem, idx) => (
            <div key={idx} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{docItem}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
