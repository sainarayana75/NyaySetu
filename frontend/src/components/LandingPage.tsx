import React from 'react';
import { Scale, ShieldCheck, Search, GitCompare, UserCheck, FileText, ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onAnalyzeDocument: () => void;
  onCompareDocuments: () => void;
  onOpenDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeDocument,
  onCompareDocuments,
  onOpenDemo,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl border border-blue-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-blue-700/50 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-200 backdrop-blur-md">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>PromptWars Competition Grade Legal Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            See the Law <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">Clearly.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Understand complex legal documents, discover what deserves attention, compare changes, organize obligations, and prepare better questions — with AI assistance grounded strictly in your information.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onAnalyzeDocument}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Analyze a Document</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onCompareDocuments}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              <GitCompare className="w-4 h-4 text-indigo-400" />
              <span>Compare Versions</span>
            </button>

            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Try Bengaluru Rental Demo</span>
            </button>
          </div>

          {/* Key Value Badges */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
              <div className="font-semibold text-xs text-white">Evidence-First</div>
              <div className="text-[11px] text-slate-400">Traceable to exact page & clause</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <Search className="w-5 h-5 text-blue-400 mb-1" />
              <div className="font-semibold text-xs text-white">Legal Clarity Map</div>
              <div className="text-[11px] text-slate-400">Interactive node breakdown</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <UserCheck className="w-5 h-5 text-indigo-400 mb-1" />
              <div className="font-semibold text-xs text-white">Obligation Engine</div>
              <div className="text-[11px] text-slate-400">Party, action & date matrix</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <Lock className="w-5 h-5 text-amber-400 mb-1" />
              <div className="font-semibold text-xs text-white">Multilingual EN/HI/TE</div>
              <div className="text-[11px] text-slate-400">English, हिंदी & తెలుగు</div>
            </div>
          </div>

        </div>
      </section>

      {/* Flagship Differentiator: SHOW SOURCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 shadow-xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-md">
              Flagship Differentiator
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Never Force Users to Blindly Trust AI.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Every single NyaySetu AI finding, clause summary, obligation, and Q&A answer is linked directly to the original document. Click <strong className="text-amber-600 dark:text-amber-400">"SHOW SOURCE"</strong> to instantly jump to the exact page, section, and passage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">1</div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Finding</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">"Mandatory ₹35,000 painting deduction upon vacating apartment."</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-3 border-amber-300 dark:border-amber-700/60">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">2</div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Click "SHOW SOURCE"</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Viewer auto-scrolls to Page 2, Clause 7.2 and flashes yellow highlight overlay.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">3</div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Verify Evidence</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Read exact clause wording side-by-side with plain language explanation and questions to ask.</p>
            </div>
          </div>
        </div>
      </section>

      {/* India-First Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Built for Realistic Indian Use Cases</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Supporting Indian document terminology, INR currency, date formats, and statutory legal aid frameworks.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-3 hover:shadow-md transition-all">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Rental / Lease Agreements</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Understand 11-month lock-in periods, security deposits, maintenance fees, painting deductions, and notice periods.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-3 hover:shadow-md transition-all">
            <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Employment Contracts & NDAs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Extract notice periods, non-compete restrictions, IP transfer clauses, and probation terms.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-3 hover:shadow-md transition-all">
            <GitCompare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Service & Vendor Agreements</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Compare revised vendor terms, payment milestones, penalties, and dispute jurisdiction.</p>
          </div>
        </div>
      </section>

      {/* Safety & Legal Assistance Boundary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="font-bold text-base">Informational Assistance & Safety Boundary</h3>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              NyaySetu provides informational document intelligence and preparation checklists. NyaySetu is <strong>NOT a lawyer</strong>, is NOT a law firm, and does NOT provide formal legal representation or legal advice. If you require formal representation or advice, NyaySetu connects you to official Indian legal aid bodies including NALSA and eCourts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
