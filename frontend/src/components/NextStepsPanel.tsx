import React, { useState } from 'react';
import type { Obligation, Deadline } from '../types';
import { HelpCircle, FileText, Calendar, MessageSquare, Briefcase, Info } from 'lucide-react';

interface NextStepsPanelProps {
  obligations: Obligation[];
  deadlines: Deadline[];
  onExportPrep: () => void;
}

export const NextStepsPanel: React.FC<NextStepsPanelProps> = ({
  obligations: _obligations,
  deadlines,
  onExportPrep,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const infoToVerify = [
    "Verify landlord's bank account details (NEFT/UPI) match the registered owner name.",
    "Verify electricity & water meter readings on the exact day of possession.",
    "Verify whether Society Welfare Association (RWA) maintenance charges include GST.",
    "Check if rent agreement registration under Registration Act, 1908 is required in your state."
  ];

  const docsToGather = [
    "Original signed copy of the Lease / Agreement",
    "Government ID proof (Aadhaar / PAN Card) of both parties",
    "Bank payment transaction receipts for Security Deposit & first month rent",
    "WhatsApp / Email communications regarding lease negotiations",
    "Previous electricity & water bill clearance receipts"
  ];

  const questionsForLawyer = [
    "Does the deposit forfeiture penalty during lock-in stand enforceable under Indian Contract Act, 1872?",
    "Can the mandatory 1-month painting deduction be challenged if premises are handed back cleanly?",
    "What specific notice format (Registered Post vs Email) is mandatory for valid exit?",
    "What recourse exists if the landlord delays security deposit refund past the agreed vacate date?"
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-amber-300" />
            <h2 className="font-bold text-xl">WHAT CAN I PREPARE NEXT?</h2>
          </div>
          <button
            onClick={onExportPrep}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <Briefcase className="w-4 h-4" />
            <span>Generate Lawyer Consultation Pack</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Actionable preparation guide: key items to verify, documents to gather, dates to monitor, and questions to ask a legal advocate.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Section 1: Information to Verify */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
            <Info className="w-4 h-4" />
            <span>1. Key Information to Verify</span>
          </h3>
          <div className="space-y-2 text-xs">
            {infoToVerify.map((item, idx) => (
              <label key={idx} className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!checkedItems[`v-${idx}`]}
                  onChange={() => toggleCheck(`v-${idx}`)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className={checkedItems[`v-${idx}`] ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Documents to Gather */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
            <FileText className="w-4 h-4" />
            <span>2. Essential Documents to Gather</span>
          </h3>
          <div className="space-y-2 text-xs">
            {docsToGather.map((docItem, idx) => (
              <label key={idx} className="flex items-start space-x-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!checkedItems[`d-${idx}`]}
                  onChange={() => toggleCheck(`d-${idx}`)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className={checkedItems[`d-${idx}`] ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                  {docItem}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: Important Dates to Check */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
            <Calendar className="w-4 h-4" />
            <span>3. Critical Contractual Dates to Monitor</span>
          </h3>
          <div className="space-y-2 text-xs">
            {deadlines.length > 0 ? (
              deadlines.map((dl) => (
                <div key={dl.id} className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{dl.title}</div>
                    <div className="text-[11px] text-slate-500">{dl.deadline_type} • Clause: {dl.source_clause || 'General'}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded">
                    {dl.date_str}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-400 italic">No specific deadlines indexed.</div>
            )}
          </div>
        </div>

        {/* Section 4: Questions to Discuss with Lawyer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>4. Questions to Discuss with a Legal Professional</span>
          </h3>
          <div className="space-y-2 text-xs">
            {questionsForLawyer.map((q, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 flex items-start space-x-2">
                <span className="font-bold text-amber-600">{idx + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mandatory Disclaimer */}
      <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-center">
        <strong>INFORMATIONAL NOTICE:</strong> This next-steps preparation checklist is an informational aid to help you organize documents and questions before consulting a lawyer. It does not constitute formal legal advice or legal representation.
      </div>

    </div>
  );
};
