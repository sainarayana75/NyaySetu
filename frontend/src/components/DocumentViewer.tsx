import React, { useRef, useEffect } from 'react';
import type { DocumentOverview } from '../types';
import { BookOpen, AlertTriangle } from 'lucide-react';

const DEMO_RENTAL_V1_TEXT = `RESIDENTIAL LEASE AGREEMENT (DEMO DOCUMENT - NOT A REAL LEGAL AGREEMENT)

This Residential Lease Agreement ("Agreement") is executed on 1st day of April 2025 at Bengaluru, Karnataka, India.

BY AND BETWEEN:
1. Mr. Ramesh Kumar, residing at H.No. 42, Indiranagar 100ft Road, Bengaluru - 560038, Karnataka (hereinafter referred to as the "LESSOR / LANDLORD").
2. Ms. Priya Sharma, holding Aadhaar No. XXXX-XXXX-1234, currently residing at Koramangala 4th Block, Bengaluru - 560034, Karnataka (hereinafter referred to as the "LESSEE / TENANT").

1. RENT AND PAYMENT TERMS
1.1 The Lessee agrees to pay a monthly rent of INR 35,000/- (Rupees Thirty Five Thousand Only) payable in advance on or before the 5th calendar day of each English calendar month.
1.2 The rent shall be transferred directly via NEFT/UPI to the Lessor's designated bank account at State Bank of India.
1.3 In the event of delay in payment of rent beyond the 5th of the month, a late fee penalty of INR 500/- per day of delay shall be applicable and payable by the Lessee.

2. INTEREST-FREE REFUNDABLE SECURITY DEPOSIT
2.1 The Lessee has paid an interest-free refundable security deposit of INR 2,00,000/- (Rupees Two Lakhs Only) to the Lessor upon execution of this Agreement.
2.2 The security deposit shall be refunded by the Lessor to the Lessee at the time of vacating the premises, after deducting any arrears of rent, utility bills, or valid damages beyond normal wear and tear.

3. TENURE AND LOCK-IN PERIOD
3.1 This Agreement is valid for a total duration of 11 (Eleven) months commencing from April 1, 2025 to February 28, 2026.
3.2 Lock-in Period: Both parties agree to a mandatory Lock-in Period of 6 (Six) months. Neither party can terminate the agreement during this lock-in period. If the Lessee vacates during the lock-in period, the security deposit shall be forfeited.

4. NOTICE PERIOD AND TERMINATION
4.1 Post completion of the 6-month lock-in period, either party may terminate this Agreement by serving a 30 (Thirty) days prior written notice to the other party or by paying 1 month's rent in lieu of notice.

5. MAINTENANCE AND UTILITY CHARGES
5.1 The Lessee shall pay the monthly apartment association maintenance charges of INR 3,500/- directly to the Resident Welfare Association (RWA).

6. RESTRICTIONS AND SUBLETTING
6.1 The Lessee shall use the demised premises strictly for residential purposes only.
6.2 Subletting: The Lessee shall NOT sublet, assign, or transfer the premises or any part thereof without prior written consent.

7. REPAIRS AND DEDUCTIONS
7.1 Minor repairs up to INR 1,500/- shall be borne by the Lessee.
7.2 Painting Charges: Upon vacating the premises, the Lessor shall deduct 1 month's rent (INR 35,000/-) towards painting and cleaning of the apartment.

8. DISPUTE RESOLUTION AND GOVERNING LAW
8.1 Governed by laws of India and subject to exclusive jurisdiction of Courts at Bengaluru, Karnataka.`;

const DEMO_RENTAL_V2_TEXT = `REVISED RESIDENTIAL LEASE AGREEMENT (V2) (DEMO DOCUMENT - NOT A REAL LEGAL AGREEMENT)

This Revised Residential Lease Agreement ("Agreement V2") is executed on 1st day of April 2025 at Bengaluru, Karnataka, India.

BY AND BETWEEN:
1. Mr. Ramesh Kumar (LESSOR / LANDLORD)
2. Ms. Priya Sharma (LESSEE / TENANT)

1. RENT AND PAYMENT TERMS
1.1 The Lessee agrees to pay a revised monthly rent of INR 42,000/- (Rupees Forty Two Thousand Only) payable in advance on or before the 1st calendar day of each month.
1.2 Late Payment Penalty: If rent is delayed past the 1st of the month, a penalty of INR 1,000/- per day of delay shall be charged.

2. REFUNDABLE SECURITY DEPOSIT
2.1 Security deposit of INR 3,00,000/- (Rupees Three Lakhs Only).
2.2 The security deposit refund shall be processed within 90 days after vacating the premises.

3. TENURE AND LOCK-IN PERIOD
3.1 Lock-in Period of 11 (Eleven) months. Early termination strictly prohibited.

4. NOTICE PERIOD AND TERMINATION
4.1 Notice period of 60 (Sixty) days prior written notice via registered post.

5. DEDUCTIONS
5.1 Mandatory deduction of 1.5 months rent (INR 63,000/-) for painting.`;

interface DocumentViewerProps {
  document: DocumentOverview | null;
  activeSourceHighlight: { page_number: number; source_text: string } | null;
  onClearHighlight: () => void;
  children: React.ReactNode;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  activeSourceHighlight,
  onClearHighlight,
  children,
}) => {
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSourceHighlight && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSourceHighlight]);

  const docText = document?.id === 'demo-rental-v2' ? DEMO_RENTAL_V2_TEXT : DEMO_RENTAL_V1_TEXT;
  const paragraphs = docText.split('\n\n');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-130px)] min-h-[650px] p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* LEFT PANE: Original Document Workspace */}
      <div className="lg:col-span-5 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
        
        {/* Left Pane Header */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Original Document Text
            </span>
          </div>
          {activeSourceHighlight && (
            <div className="flex items-center space-x-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold animate-pulse">
              <span>Page {activeSourceHighlight.page_number} Highlighted</span>
              <button onClick={onClearHighlight} className="text-amber-900 dark:text-amber-200 hover:font-extrabold ml-1">×</button>
            </div>
          )}
        </div>

        {/* Document Content Scroll Area */}
        <div ref={leftPaneRef} className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950/40">
          
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 text-[11px] font-sans font-medium mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>DEMO DOCUMENT — NOT A REAL LEGAL AGREEMENT</span>
          </div>

          {paragraphs.map((para: string, idx: number) => {
            const isMatch = activeSourceHighlight && (
              para.toLowerCase().includes(activeSourceHighlight.source_text.toLowerCase().slice(0, 30)) ||
              activeSourceHighlight.source_text.toLowerCase().includes(para.toLowerCase().slice(0, 30))
            );

            return (
              <div
                key={idx}
                ref={isMatch ? highlightRef : null}
                className={`p-3 rounded-lg transition-all ${
                  isMatch
                    ? 'source-highlight-active bg-amber-200/90 dark:bg-amber-900/60 text-slate-950 dark:text-amber-100 font-sans shadow-md'
                    : 'bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800'
                }`}
              >
                {para}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-slate-100 dark:bg-slate-800/50 px-4 py-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 flex justify-between">
          <span>Source Evidence Linked</span>
          <span>Click any finding to inspect</span>
        </div>
      </div>

      {/* RIGHT PANE: NyaySetu Intelligence Workspace */}
      <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {children}
        </div>
      </div>

    </div>
  );
};
