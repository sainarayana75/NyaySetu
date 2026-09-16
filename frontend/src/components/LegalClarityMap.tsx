import React, { useState } from 'react';
import type { Clause } from '../types';
import { Network, Users, IndianRupee, Clock, AlertTriangle, ShieldCheck, FileText, Eye } from 'lucide-react';

interface LegalClarityMapProps {
  clauses: Clause[];
  language: string;
  onShowSource: (page: number, text: string) => void;
}

export const LegalClarityMap: React.FC<LegalClarityMapProps> = ({
  clauses,
  language,
  onShowSource,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('MONEY');

  const nodes = [
    { id: 'PARTIES', label: 'PARTIES', icon: Users, color: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/60' },
    { id: 'MONEY', label: 'MONEY / RENT', icon: IndianRupee, color: 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
    { id: 'LOCKIN', label: 'LOCK-IN PERIOD', icon: Clock, color: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/60' },
    { id: 'TERMINATION', label: 'TERMINATION / NOTICE', icon: AlertTriangle, color: 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/60' },
    { id: 'OBLIGATIONS', label: 'OBLIGATIONS', icon: ShieldCheck, color: 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60' },
    { id: 'RESTRICTIONS', label: 'RESTRICTIONS', icon: FileText, color: 'border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/60' },
    { id: 'DISPUTES', label: 'DISPUTE RESOLUTION', icon: Network, color: 'border-cyan-500 text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60' },
  ];

  const getMatchedClauses = (nodeId: string) => {
    switch (nodeId) {
      case 'PARTIES':
        return clauses.filter(c => c.category.includes('Preamble') || c.category.includes('Party') || c.title.includes('Agreement'));
      case 'MONEY':
        return clauses.filter(c => c.category === 'Payment' || c.category === 'Security Deposit' || c.title.includes('Rent'));
      case 'LOCKIN':
        return clauses.filter(c => c.category === 'Lock-in Period' || c.title.includes('Lock-in'));
      case 'TERMINATION':
        return clauses.filter(c => c.category === 'Notice Period' || c.title.includes('Notice') || c.title.includes('Termination'));
      case 'OBLIGATIONS':
        return clauses.filter(c => c.attention_category === 'IMPORTANT OBLIGATION');
      case 'RESTRICTIONS':
        return clauses.filter(c => c.category === 'Restrictions' || c.category === 'Subletting');
      case 'DISPUTES':
        return clauses.filter(c => c.category.includes('Dispute') || c.category.includes('Law'));
      default:
        return clauses;
    }
  };

  const activeClauses = getMatchedClauses(selectedNode);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Network className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Interactive Legal Clarity Map</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual structural decomposition of contractual domains. Click any node to inspect extracted terms and source evidence.
          </p>
        </div>
      </div>

      {/* Interactive Node Graph */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 transition-all transform hover:-translate-y-0.5 ${
                isSelected
                  ? `${node.color} ring-2 ring-blue-500 font-bold shadow-md`
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] uppercase tracking-wider">{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* Node Content Inspector */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Selected Domain: <span className="text-blue-600 dark:text-blue-400">{selectedNode}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {activeClauses.length} {activeClauses.length === 1 ? 'Clause' : 'Clauses'} Identified
          </span>
        </div>

        {activeClauses.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
            No specific clauses categorized under {selectedNode} in this document summary.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeClauses.map((clause) => {
              const explanation = language === 'hi' && clause.explanation_hi
                ? clause.explanation_hi
                : language === 'te' && clause.explanation_te
                ? clause.explanation_te
                : clause.explanation_en;

              return (
                <div key={clause.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4 shadow-xs">
                  
                  {/* Title & Category Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                          {clause.clause_number || `Page ${clause.page_number}`}
                        </span>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">{clause.title}</h4>
                      </div>
                      {clause.affected_party && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Applies to: <strong className="text-slate-700 dark:text-slate-300">{clause.affected_party}</strong>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onShowSource(clause.page_number, clause.original_text)}
                      className="flex items-center space-x-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>SHOW SOURCE</span>
                    </button>
                  </div>

                  {/* Plain Language Explanation */}
                  <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 p-3.5 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-blue-900 dark:text-blue-300 uppercase text-[10px]">Plain Language Explanation</div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{explanation}</p>
                  </div>

                  {/* Original Legal Passage */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span className="text-[10px] font-bold font-sans text-slate-400 uppercase block mb-1">Original Legal Text (Page {clause.page_number}):</span>
                    "{clause.original_text}"
                  </div>

                  {/* Why It Matters */}
                  {clause.why_it_matters && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 p-3 rounded-lg">
                      <strong className="text-amber-800 dark:text-amber-300">Why this may matter:</strong> {clause.why_it_matters}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
