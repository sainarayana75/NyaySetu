import React, { useState } from 'react';
import type { Clause } from '../types';
import { ShieldCheck, Eye, HelpCircle } from 'lucide-react';

interface ClauseIntelligenceProps {
  clauses: Clause[];
  language: string;
  onShowSource: (page: number, text: string) => void;
}

export const ClauseIntelligence: React.FC<ClauseIntelligenceProps> = ({
  clauses,
  language,
  onShowSource,
}) => {
  const [selectedClauseForExplain, setSelectedClauseForExplain] = useState<Clause | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(clauses.map(c => c.category)))];

  const filteredClauses = filterCategory === 'ALL'
    ? clauses
    : clauses.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6">
      
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Clause Intelligence & "Explain Simply"</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated legal clause identification with plain-language explanations across English, Hindi, and Telugu.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clause Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClauses.map((clause) => {
          const explanation = language === 'hi' && clause.explanation_hi
            ? clause.explanation_hi
            : language === 'te' && clause.explanation_te
            ? clause.explanation_te
            : clause.explanation_en;

          return (
            <div key={clause.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all">
              
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-[10px] font-extrabold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                      {clause.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Page {clause.page_number}</span>
                    <span className="text-xs text-slate-400 font-medium">• {clause.clause_number}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{clause.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedClauseForExplain(clause)}
                    className="flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 border border-blue-200 dark:border-blue-900 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explain Simply</span>
                  </button>

                  <button
                    onClick={() => onShowSource(clause.page_number, clause.original_text)}
                    className="flex items-center space-x-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>SHOW SOURCE</span>
                  </button>
                </div>
              </div>

              {/* Plain Language Summary */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-lg text-xs space-y-1">
                <div className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Plain Explanation ({language.toUpperCase()}):</div>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{explanation}</p>
              </div>

              {/* Original Excerpt */}
              <div className="text-xs font-mono bg-slate-100 dark:bg-slate-950/60 p-2.5 rounded-md text-slate-600 dark:text-slate-400 truncate">
                "{clause.original_text}"
              </div>

            </div>
          );
        })}
      </div>

      {/* "EXPLAIN SIMPLY" Modal */}
      {selectedClauseForExplain && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Explain Simply: {selectedClauseForExplain.title}</h3>
              </div>
              <button
                onClick={() => setSelectedClauseForExplain(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="font-bold text-blue-900 dark:text-blue-300 text-sm">What this clause means in plain language:</div>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">
                  {selectedClauseForExplain.explanation_en}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">WHO IT AFFECTS:</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedClauseForExplain.affected_party || 'All Parties'}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">ACTION REQUIRED:</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedClauseForExplain.requires_action || 'None'}</div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-900/40">
                <div className="font-bold text-amber-800 dark:text-amber-300 uppercase text-[10px]">WHY IT MAY MATTER:</div>
                <p className="text-amber-900 dark:text-amber-200 mt-0.5">{selectedClauseForExplain.why_it_matters}</p>
              </div>

              {selectedClauseForExplain.suggested_questions.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Questions to Consider Asking:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    {selectedClauseForExplain.suggested_questions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                onClick={() => {
                  onShowSource(selectedClauseForExplain.page_number, selectedClauseForExplain.original_text);
                  setSelectedClauseForExplain(null);
                }}
                className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 rounded-lg border border-amber-500/30"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>SHOW SOURCE ON DOCUMENT</span>
              </button>

              <button
                onClick={() => setSelectedClauseForExplain(null)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
