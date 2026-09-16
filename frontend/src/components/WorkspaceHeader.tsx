import React from 'react';
import type { DocumentOverview } from '../types';
import { FileText, Download, GitCompare, RefreshCw, CheckCircle2 } from 'lucide-react';

interface WorkspaceHeaderProps {
  document: DocumentOverview | null;
  language: string;
  setLanguage: (lang: string) => void;
  onExportPrep: () => void;
  onCompare: () => void;
  onSelectAnother: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  document,
  language,
  setLanguage,
  onExportPrep,
  onCompare,
  onSelectAnother,
}) => {
  if (!document) {
    return (
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-500">No document selected</div>
        <button onClick={onSelectAnother} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">Select Demo Document</button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Document Metadata */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-blue-800">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-base text-slate-900 dark:text-white leading-tight">{document.title}</h2>
              {document.is_demo && (
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                  DEMO DOCUMENT
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{document.doc_type}</span>
              <span>•</span>
              <span>{document.page_count} {document.page_count === 1 ? 'Page' : 'Pages'}</span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Clarity Score: {document.clarity_score}/100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Quick Actions */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          
          {/* Explanation Language Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-1.5">Explain in:</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded font-bold ${language === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded font-bold ${language === 'hi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 rounded font-bold ${language === 'te' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              తెలుగు
            </button>
          </div>

          <button
            onClick={onCompare}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Compare Version</span>
          </button>

          <button
            onClick={onExportPrep}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Lawyer Prep Pack</span>
          </button>

          <button
            onClick={onSelectAnother}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            title="Switch Document"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
