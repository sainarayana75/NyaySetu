import React from 'react';
import type { Finding, Clause } from '../types';
import { AlertTriangle, Eye } from 'lucide-react';

interface AttentionSystemProps {
  findings: Finding[];
  clauses: Clause[];
  onShowSource: (page: number, text: string) => void;
}

export const AttentionSystem: React.FC<AttentionSystemProps> = ({
  findings,
  clauses,
  onShowSource,
}) => {
  const unfavClauses = clauses.filter(c => ['NEEDS ATTENTION', 'POTENTIALLY UNFAVORABLE', 'UNCLEAR', 'MISSING INFORMATION', 'POTENTIAL INCONSISTENCY'].includes(c.attention_category));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Attention & Neutral Review Points</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Identified clauses that may deserve review before signing. Framed neutrally ("This clause may deserve review because...") without definitive legal validity judgments.
        </p>
      </div>

      {/* Findings List */}
      <div className="grid grid-cols-1 gap-4">
        {findings.map((f) => (
          <div key={f.id} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                  {f.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">{f.title}</h3>
              </div>
              <button
                onClick={() => onShowSource(f.page_number, f.source_text)}
                className="flex items-center space-x-1 text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-1.5 rounded-lg transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>SHOW SOURCE</span>
              </button>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{f.explanation}</p>

            <div className="bg-white dark:bg-slate-900/80 p-3 rounded-lg text-xs border border-amber-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[10px]">WHY IT MAY DESERVE REVIEW:</div>
              <p className="text-slate-700 dark:text-slate-300">{f.why_review}</p>
            </div>

            {f.question_to_ask && (
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                <strong>Suggested Question to Ask:</strong> "{f.question_to_ask}"
              </div>
            )}
          </div>
        ))}

        {unfavClauses.map((c) => (
          <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded">
                  {c.attention_category}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">{c.title}</h3>
              </div>
              <button
                onClick={() => onShowSource(c.page_number, c.original_text)}
                className="flex items-center space-x-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>SHOW SOURCE</span>
              </button>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">{c.explanation_en}</p>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded text-xs font-mono text-slate-500 dark:text-slate-400">
              "{c.original_text}"
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
