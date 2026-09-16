import React, { useState } from 'react';
import type { Obligation, Deadline } from '../types';
import { UserCheck, Calendar, CheckSquare, Square, Eye } from 'lucide-react';

interface ObligationEngineProps {
  obligations: Obligation[];
  deadlines: Deadline[];
  onShowSource: (page: number, text: string) => void;
}

export const ObligationEngine: React.FC<ObligationEngineProps> = ({
  obligations,
  deadlines,
  onShowSource,
}) => {
  const [filterParty, setFilterParty] = useState<string>('ALL');
  const [completedState, setCompletedState] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompletedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredObligations = obligations.filter(ob => {
    if (filterParty === 'ALL') return true;
    if (filterParty === 'TENANT') return ob.responsible_party.toLowerCase().includes('tenant') || ob.responsible_party.toLowerCase().includes('priya');
    if (filterParty === 'LANDLORD') return ob.responsible_party.toLowerCase().includes('landlord') || ob.responsible_party.toLowerCase().includes('ramesh');
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* OBLIGATIONS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Structured Obligation Engine</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Extracted contractual duties broken down by responsible party, action, condition, deadline, and financial amount.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterParty('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${filterParty === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterParty('TENANT')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${filterParty === 'TENANT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              MY OBLIGATIONS
            </button>
            <button
              onClick={() => setFilterParty('LANDLORD')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${filterParty === 'LANDLORD' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              OTHER PARTY
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredObligations.map((ob) => {
            const isDone = completedState[ob.id] || false;
            return (
              <div
                key={ob.id}
                className={`border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  isDone
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleComplete(ob.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {isDone ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5" />}
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                        {ob.responsible_party}
                      </span>
                      {ob.amount_inr && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{ob.amount_inr}</span>
                      )}
                    </div>
                    <h3 className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{ob.action}</h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>Deadline: {ob.deadline_text || 'Per agreement schedule'}</span>
                      {ob.source_clause && <span>• Clause: {ob.source_clause}</span>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onShowSource(ob.page_number, ob.action)}
                  className="flex items-center space-x-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg whitespace-nowrap self-end sm:self-center"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>SHOW SOURCE</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEGAL TIMELINE SECTION */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Interactive Legal Timeline</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key contractual dates, payment cycles, lock-in milestones, notice windows, and expiration deadlines.
          </p>
        </div>

        <div className="relative border-l-2 border-blue-500/30 dark:border-blue-900 ml-4 pl-6 space-y-6">
          {deadlines.map((dl) => (
            <div key={dl.id} className="relative group">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-sm" />
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                    {dl.deadline_type}
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{dl.date_str}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{dl.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Applies to: {dl.responsible_party || 'Both Parties'}</span>
                  <button
                    onClick={() => onShowSource(dl.page_number, dl.title)}
                    className="text-amber-700 dark:text-amber-400 hover:underline font-semibold text-[11px]"
                  >
                    Source Page {dl.page_number} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
