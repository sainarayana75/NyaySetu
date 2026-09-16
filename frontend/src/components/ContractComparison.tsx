import React, { useState, useEffect } from 'react';
import type { ComparisonResponse } from '../types';
import { compareDocuments } from '../services/api';
import { GitCompare, Eye, Sparkles } from 'lucide-react';

interface ContractComparisonProps {
  docAId: string;
  docBId: string;
  onShowSource: (page: number, text: string) => void;
}

export const ContractComparison: React.FC<ContractComparisonProps> = ({
  docAId,
  docBId,
  onShowSource,
}) => {
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDiff() {
      setLoading(true);
      try {
        const data = await compareDocuments(docAId, docBId);
        setComparison(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDiff();
  }, [docAId, docBId]);

  if (loading) {
    return (
      <div className="text-center py-12 space-y-3">
        <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Comparing Version A vs Version B...</div>
        <p className="text-xs text-slate-500">Detecting modified rent, deposits, notice periods, and lock-in clauses...</p>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        Failed to load document comparison. Please ensure two documents are uploaded.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center space-x-2">
          <GitCompare className="w-6 h-6 text-amber-300" />
          <h2 className="font-bold text-xl">Contract Version Comparison</h2>
        </div>
        <p className="text-xs text-indigo-200 leading-relaxed max-w-3xl">
          {comparison.summary}
        </p>

        <div className="flex items-center space-x-4 text-xs font-semibold pt-2 border-t border-indigo-800">
          <div className="bg-indigo-950 px-3 py-1 rounded-lg border border-indigo-700">
            Version A: <span className="text-amber-300">{comparison.doc_a_title}</span>
          </div>
          <div className="bg-indigo-950 px-3 py-1 rounded-lg border border-indigo-700">
            Version B: <span className="text-emerald-300">{comparison.doc_b_title}</span>
          </div>
        </div>
      </div>

      {/* Changes List */}
      <div className="space-y-4">
        {comparison.changes.map((change, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            
            {/* Title & Badge */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {change.change_type}: {change.clause_category}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{change.attribute}</h3>
              </div>

              {/* Dual Source Buttons */}
              <div className="flex items-center space-x-2">
                {change.source_a && (
                  <button
                    onClick={() => onShowSource(change.source_a!.page_number, change.source_a!.source_text)}
                    className="flex items-center space-x-1 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Source A</span>
                  </button>
                )}
                {change.source_b && (
                  <button
                    onClick={() => onShowSource(change.source_b!.page_number, change.source_b!.source_text)}
                    className="flex items-center space-x-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Source B</span>
                  </button>
                )}
              </div>
            </div>

            {/* Old vs New Side by Side Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-400 uppercase text-[10px]">OLD VERSION (VERSION A):</div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{change.old_text}</p>
              </div>

              <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 space-y-1">
                <div className="font-bold text-amber-800 dark:text-amber-300 uppercase text-[10px]">NEW REVISED VERSION (VERSION B):</div>
                <p className="text-xs text-slate-900 dark:text-white font-bold">{change.new_text}</p>
              </div>
            </div>

            {/* Plain Language Explanation */}
            <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200/60 dark:border-blue-900/40 space-y-1 text-xs">
              <div className="font-bold text-blue-900 dark:text-blue-300 uppercase text-[10px]">WHAT CHANGED & PLAIN EXPLANATION:</div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{change.plain_explanation}</p>
            </div>

            {/* Attention Note */}
            <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg text-xs text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/40">
              <strong>Attention Note:</strong> {change.why_review}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
