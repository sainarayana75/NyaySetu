"""
Pre-seeded high-fidelity Indian demo legal documents and authoritative Indian legal knowledge base.
Supports 100% reliable competition demo & full-stack evidence linking.
"""
from typing import Dict, Any, List
from app.models import Document, Clause, Finding, Obligation, Deadline, LegalKnowledgeItem, Source

DEMO_RENTAL_V1_ID = "demo-rental-v1"
DEMO_RENTAL_V2_ID = "demo-rental-v2"
DEMO_EMPLOYMENT_ID = "demo-employment-v1"

DEMO_RENTAL_V1_TEXT = """RESIDENTIAL LEASE AGREEMENT (DEMO DOCUMENT - NOT A REAL LEGAL AGREEMENT)

This Residential Lease Agreement ("Agreement") is executed on 1st day of April 2025 at Bengaluru, Karnataka, India.

BY AND BETWEEN:
1. Mr. Ramesh Kumar, residing at H.No. 42, Indiranagar 100ft Road, Bengaluru - 560038, Karnataka (hereinafter referred to as the "LESSOR / LANDLORD", which expression shall unless repugnant to the context include his legal heirs, executors, and assigns).

AND

2. Ms. Priya Sharma, holding Aadhaar No. XXXX-XXXX-1234, currently residing at Koramangala 4th Block, Bengaluru - 560034, Karnataka (hereinafter referred to as the "LESSEE / TENANT", which expression shall unless repugnant to the context include her legal heirs, executors, and assigns).

NOW THIS AGREEMENT WITNESSETH AND IT IS HEREBY AGREED BY AND BETWEEN THE PARTIES AS FOLLOWS:

1. RENT AND PAYMENT TERMS
1.1 The Lessee agrees to pay a monthly rent of INR 35,000/- (Rupees Thirty Five Thousand Only) payable in advance on or before the 5th calendar day of each English calendar month.
1.2 The rent shall be transferred directly via NEFT/UPI to the Lessor's designated bank account at State Bank of India, Indiranagar Branch.
1.3 In the event of delay in payment of rent beyond the 5th of the month, a late fee penalty of INR 500/- per day of delay shall be applicable and payable by the Lessee.

2. INTEREST-FREE REFUNDABLE SECURITY DEPOSIT
2.1 The Lessee has paid an interest-free refundable security deposit of INR 2,00,000/- (Rupees Two Lakhs Only) to the Lessor upon execution of this Agreement.
2.2 The security deposit shall be refunded by the Lessor to the Lessee at the time of vacating the premises, after deducting any arrears of rent, utility bills, or valid damages beyond normal wear and tear.

3. TENURE AND LOCK-IN PERIOD
3.1 This Agreement is valid for a total duration of 11 (Eleven) months commencing from April 1, 2025 to February 28, 2026.
3.2 Lock-in Period: Both parties agree to a mandatory Lock-in Period of 6 (Six) months. Neither party can terminate the agreement during this lock-in period. If the Lessee vacates during the lock-in period, the security deposit shall be forfeited.

4. NOTICE PERIOD AND TERMINATION
4.1 Post completion of the 6-month lock-in period, either party may terminate this Agreement by serving a 30 (Thirty) days prior written notice to the other party or by paying 1 month's rent in lieu of notice.
4.2 Upon termination or expiry, the Lessee shall hand over vacant and peaceful possession of the premises to the Lessor in good condition.

5. MAINTENANCE AND UTILITY CHARGES
5.1 The Lessee shall pay the monthly apartment association maintenance charges of INR 3,500/- directly to the Resident Welfare Association (RWA).
5.2 Electricity, water, and internet charges shall be paid directly by the Lessee according to actual meter readings and bills.

6. RESTRICTIONS AND SUBLETTING
6.1 The Lessee shall use the demised premises strictly for residential purposes only and shall not engage in commercial operations or illegal activities.
6.2 Subletting: The Lessee shall NOT sublet, assign, or transfer the premises or any part thereof to any third party without prior written consent of the Lessor.
6.3 Structural Alterations: The Lessee shall not make any major structural changes, drilling, or alterations without written permission.

7. REPAIRS AND DEDUCTIONS
7.1 Minor repairs up to INR 1,500/- per occurrence shall be borne by the Lessee. Major structural or plumbing repairs shall be borne by the Lessor.
7.2 Painting Charges: Upon vacating the premises, the Lessor shall deduct 1 month's rent (INR 35,000/-) towards painting and cleaning of the apartment.

8. DISPUTE RESOLUTION AND GOVERNING LAW
8.1 This Agreement shall be governed by and construed in accordance with the laws of India and subject to the exclusive jurisdiction of the Courts at Bengaluru, Karnataka.
8.2 In case of any dispute, the parties shall first attempt resolution through mutual discussion or mediation before initiating formal legal proceedings.

IN WITNESS WHEREOF, the parties hereto have set their hands on the day and year first written above.

LESSOR: Ramesh Kumar
LESSEE: Priya Sharma
WITNESS 1: Anand Verma
WITNESS 2: Sunita Rao
"""

DEMO_RENTAL_V2_TEXT = """REVISED RESIDENTIAL LEASE AGREEMENT (V2) (DEMO DOCUMENT - NOT A REAL LEGAL AGREEMENT)

This Revised Residential Lease Agreement ("Agreement V2") is executed on 1st day of April 2025 at Bengaluru, Karnataka, India.

BY AND BETWEEN:
1. Mr. Ramesh Kumar (LESSOR / LANDLORD)
AND
2. Ms. Priya Sharma (LESSEE / TENANT)

NOW THIS AGREEMENT WITNESSETH AND IT IS HEREBY AGREED BY AND BETWEEN THE PARTIES AS FOLLOWS:

1. RENT AND PAYMENT TERMS
1.1 The Lessee agrees to pay a revised monthly rent of INR 42,000/- (Rupees Forty Two Thousand Only) payable in advance on or before the 1st calendar day of each English calendar month.
1.2 Late Payment Penalty: If rent is delayed past the 1st of the month, a penalty of INR 1,000/- per day of delay shall be charged.

2. REFUNDABLE SECURITY DEPOSIT
2.1 The Lessee has paid a security deposit of INR 3,00,000/- (Rupees Three Lakhs Only).
2.2 The security deposit refund shall be processed within 90 days after vacating the premises.

3. TENURE AND LOCK-IN PERIOD
3.1 Duration: 11 (Eleven) months commencing from April 1, 2025.
3.2 Extended Lock-in Period: Both parties agree to a Lock-in Period of 11 (Eleven) months. Early termination is strictly prohibited.

4. NOTICE PERIOD AND TERMINATION
4.1 Post completion of the 11-month tenure, either party may terminate by giving 60 (Sixty) days prior written notice (Increased from 30 days in V1).
4.2 Notice must be sent via registered post with acknowledgment due.

5. MAINTENANCE, PAINTING AND UTILITY CHARGES
5.1 Maintenance: INR 4,500/- monthly RWA maintenance charge.
5.2 Painting Deduction: Upon vacating, 1.5 months rent (INR 63,000/-) will be mandatorily deducted from the deposit.

6. RESTRICTIONS
6.1 Premises strictly residential. No pets allowed on premises. Subletting strictly prohibited under penalty of immediate eviction.

7. DISPUTE RESOLUTION
7.1 Governing Law: Laws of Karnataka, India. Jurisdiction: Courts of Bengaluru.
"""

def get_demo_documents_data() -> List[Dict[str, Any]]:
    return [
        {
            "id": DEMO_RENTAL_V1_ID,
            "title": "Residential Lease Agreement (Bengaluru)",
            "original_filename": "Residential_Lease_Agreement_Bengaluru.pdf",
            "file_type": "pdf",
            "doc_type": "Rental / Lease Agreement",
            "language": "en",
            "page_count": 3,
            "status": "READY",
            "clarity_score": 88.5,
            "is_demo": True,
            "summary": "Standard 11-month residential rental agreement between Mr. Ramesh Kumar (Lessor) and Ms. Priya Sharma (Lessee) for a flat in Indiranagar, Bengaluru. Specifies monthly rent of ₹35,000, deposit of ₹2,00,000, 6-month lock-in period, 30-day notice period, and 1 month painting deduction.",
            "text": DEMO_RENTAL_V1_TEXT,
            "clauses": [
                {
                    "id": "cl-1",
                    "category": "Payment",
                    "title": "Monthly Rent & Late Payment Penalty",
                    "clause_number": "Clause 1.1 & 1.3",
                    "page_number": 1,
                    "original_text": "1.1 The Lessee agrees to pay a monthly rent of INR 35,000/- (Rupees Thirty Five Thousand Only) payable in advance on or before the 5th calendar day of each English calendar month.\n1.3 In the event of delay in payment of rent beyond the 5th of the month, a late fee penalty of INR 500/- per day of delay shall be applicable.",
                    "explanation_en": "You must pay ₹35,000 rent by the 5th of every month. If you pay late, you will be charged an extra ₹500 for every single day of delay.",
                    "explanation_hi": "आपको हर महीने की 5 तारीख तक ₹35,000 किराया देना होगा। देर करने पर ₹500 प्रति दिन का जुर्माना लगेगा।",
                    "explanation_te": "మీరు ప్రతీ నెల 5వ తేదీ లోపు ₹35,000 అద్దె చెల్లించాలి. ఆలస్యం అయితే రోజుకు ₹500 జరిమానా పడుతుంది.",
                    "affected_party": "Lessee / Tenant",
                    "requires_action": "Pay ₹35,000 via NEFT/UPI before the 5th of every month.",
                    "why_it_matters": "Late payment adds up quickly at ₹500/day. Ensure bank transfer is scheduled before the 5th.",
                    "attention_category": "IMPORTANT OBLIGATION",
                    "suggested_questions": ["Is there a grace period for bank holidays?", "What bank account details are provided?"]
                },
                {
                    "id": "cl-2",
                    "category": "Security Deposit",
                    "title": "Refundable Security Deposit & Deduction",
                    "clause_number": "Clause 2.1 & 7.2",
                    "page_number": 1,
                    "original_text": "2.1 The Lessee has paid an interest-free refundable security deposit of INR 2,00,000/- upon execution.\n7.2 Upon vacating the premises, the Lessor shall deduct 1 month's rent (INR 35,000/-) towards painting and cleaning.",
                    "explanation_en": "You pay ₹2,00,000 upfront deposit. When you leave, the landlord automatically keeps ₹35,000 (1 month rent) for repainting regardless of apartment condition.",
                    "explanation_hi": "आपने ₹2,00,000 डिपॉजिट दिया है। खाली करते समय मकान मालिक ₹35,000 (1 महीने का किराया) पुताई के नाम पर काटेगा।",
                    "explanation_te": "మీరు ₹2,00,000 డిపాజిట్ ఇచ్చారు. ఖాళీ చేసేటప్పుడు పెయింటింగ్ కోసం ₹35,000 తగ్గిస్తారు.",
                    "affected_party": "Lessee / Tenant",
                    "requires_action": "Accept non-negotiable ₹35,000 deduction upon move-out.",
                    "why_it_matters": "A full 1-month rent deduction for painting is common in Bengaluru but means you get ₹1,65,000 back instead of ₹2,00,000.",
                    "attention_category": "POTENTIALLY UNFAVORABLE",
                    "suggested_questions": ["Can the painting deduction be capped if tenant repaints before leaving?", "When exactly is the remaining ₹1,65,000 refunded?"]
                },
                {
                    "id": "cl-3",
                    "category": "Lock-in Period",
                    "title": "Mandatory 6-Month Lock-in Period",
                    "clause_number": "Clause 3.2",
                    "page_number": 2,
                    "original_text": "3.2 Lock-in Period: Both parties agree to a mandatory Lock-in Period of 6 (Six) months. Neither party can terminate the agreement during this lock-in period. If the Lessee vacates during the lock-in period, the security deposit shall be forfeited.",
                    "explanation_en": "You cannot leave or terminate the rent agreement for the first 6 months. If you move out early, you forfeit your entire ₹2,00,000 deposit.",
                    "explanation_hi": "शुरुआती 6 महीने (लॉक-इन) में आप घर खाली नहीं कर सकते। यदि आप खाली करते हैं तो आपका पूरा ₹2 लाख का डिपॉजिट जब्त कर लिया जाएगा।",
                    "explanation_te": "మొదటి 6 నెలల లాక్-ఇన్ పీరియడ్ సమయంలో మీరు ఖాళీ చేస్తే, మీ ₹2,00,000 డిపాజిట్ పోతుంది.",
                    "affected_party": "Lessee / Tenant",
                    "requires_action": "Commit to residing for at least 6 full months.",
                    "why_it_matters": "Severe financial penalty (deposit forfeiture) if job transfer or emergency requires moving before 6 months.",
                    "attention_category": "NEEDS ATTENTION",
                    "suggested_questions": ["Is there an exception clause for sudden job relocation?", "Does the lock-in apply equally to landlord?"]
                },
                {
                    "id": "cl-4",
                    "category": "Notice Period",
                    "title": "30 Days Termination Notice",
                    "clause_number": "Clause 4.1",
                    "page_number": 2,
                    "original_text": "4.1 Post completion of the 6-month lock-in period, either party may terminate this Agreement by serving a 30 (Thirty) days prior written notice to the other party or by paying 1 month's rent in lieu of notice.",
                    "explanation_en": "After 6 months, either party can end the agreement by giving 30 days written notice or paying 1 month rent.",
                    "explanation_hi": "6 महीने के बाद, दोनों में से कोई भी 30 दिन का लिखित नोटिस देकर एग्रीमेंट समाप्त कर सकता है।",
                    "explanation_te": "6 నెలల తర్వాత, 30 రోజుల రాతపూర్వక నోటీసు ఇచ్చి అగ్రిమెంట్‌ను ముగించవచ్చు.",
                    "affected_party": "Both Parties",
                    "requires_action": "Provide 30 days written notice prior to vacate date.",
                    "why_it_matters": "Fair standard notice clause.",
                    "attention_category": "IMPORTANT OBLIGATION",
                    "suggested_questions": ["Is email or WhatsApp notice acceptable?"]
                }
            ],
            "findings": [
                {
                    "id": "find-1",
                    "category": "POTENTIALLY UNFAVORABLE",
                    "title": "Mandatory Deposit Forfeiture During Lock-In",
                    "explanation": "If the tenant vacates within the first 6 months, the entire security deposit of ₹2,00,000 is forfeited. This is a steep penalty.",
                    "source_text": "If the Lessee vacates during the lock-in period, the security deposit shall be forfeited.",
                    "page_number": 2,
                    "clause_ref": "Clause 3.2",
                    "why_review": "Consider asking for a replacement clause (e.g. finding a replacement tenant) instead of total deposit loss.",
                    "question_to_ask": "Could we amend Clause 3.2 to allow early exit if a replacement tenant is arranged?"
                },
                {
                    "id": "find-2",
                    "category": "NEEDS ATTENTION",
                    "title": "Automatic 1-Month Painting Deduction",
                    "explanation": "Clause 7.2 specifies a mandatory deduction of ₹35,000 for painting upon vacating regardless of wear and tear or duration stayed.",
                    "source_text": "Lessor shall deduct 1 month's rent (INR 35,000/-) towards painting and cleaning of the apartment.",
                    "page_number": 2,
                    "clause_ref": "Clause 7.2",
                    "why_review": "If stay is short (e.g., 6-11 months), paying full painting cost may be negotiated down to a pro-rata rate.",
                    "question_to_ask": "Can painting deduction be reduced if tenant maintains walls cleanly?"
                }
            ],
            "obligations": [
                {
                    "id": "ob-1",
                    "responsible_party": "Tenant (Priya Sharma)",
                    "action": "Pay Monthly Rent",
                    "condition_trigger": "Every English Calendar Month",
                    "deadline_text": "On or before 5th of each month",
                    "frequency": "Monthly",
                    "amount_inr": "₹35,000",
                    "source_clause": "Clause 1.1",
                    "page_number": 1,
                    "is_completed": False
                },
                {
                    "id": "ob-2",
                    "responsible_party": "Tenant (Priya Sharma)",
                    "action": "Pay RWA Maintenance Charges",
                    "condition_trigger": "Monthly",
                    "deadline_text": "Per RWA Due Date",
                    "frequency": "Monthly",
                    "amount_inr": "₹3,500",
                    "source_clause": "Clause 5.1",
                    "page_number": 2,
                    "is_completed": False
                },
                {
                    "id": "ob-3",
                    "responsible_party": "Landlord (Ramesh Kumar)",
                    "action": "Refund Security Deposit Balance",
                    "condition_trigger": "At time of vacating after deductions",
                    "deadline_text": "Vacating Date",
                    "frequency": "One-time",
                    "amount_inr": "₹1,65,000 (₹2L - ₹35k)",
                    "source_clause": "Clause 2.2 & 7.2",
                    "page_number": 1,
                    "is_completed": False
                }
            ],
            "deadlines": [
                {"id": "dl-1", "title": "Agreement Commencement", "date_str": "2025-04-01", "deadline_type": "Start Date", "responsible_party": "Both", "source_clause": "Preamble", "page_number": 1},
                {"id": "dl-2", "title": "First Rent Due Date", "date_str": "2025-04-05", "deadline_type": "Payment", "responsible_party": "Tenant", "source_clause": "Clause 1.1", "page_number": 1},
                {"id": "dl-3", "title": "Lock-in Expiry Date", "date_str": "2025-09-30", "deadline_type": "Lock-in", "responsible_party": "Both", "source_clause": "Clause 3.2", "page_number": 2},
                {"id": "dl-4", "title": "Earliest Notice Date for 11-Month End", "date_str": "2026-01-29", "deadline_type": "Notice", "responsible_party": "Tenant", "source_clause": "Clause 4.1", "page_number": 2},
                {"id": "dl-5", "title": "Agreement Expiry", "date_str": "2026-02-28", "deadline_type": "Expiry", "responsible_party": "Both", "source_clause": "Clause 3.1", "page_number": 2}
            ]
        },
        {
            "id": DEMO_RENTAL_V2_ID,
            "title": "Revised Lease Agreement V2 (Comparison)",
            "original_filename": "Revised_Lease_Agreement_V2.pdf",
            "file_type": "pdf",
            "doc_type": "Rental / Lease Agreement",
            "language": "en",
            "page_count": 2,
            "status": "READY",
            "clarity_score": 82.0,
            "is_demo": True,
            "summary": "Revised version V2 of the rental agreement. Rent increased to ₹42,000, deposit increased to ₹3,00,000, lock-in increased to 11 months, notice period increased to 60 days, and deposit refund window extended to 90 days post-vacate.",
            "text": DEMO_RENTAL_V2_TEXT,
            "clauses": [],
            "findings": [],
            "obligations": [],
            "deadlines": []
        }
    ]

def get_authoritative_legal_knowledge() -> List[Dict[str, Any]]:
    return [
        {
            "id": "lk-1",
            "topic": "Rental Agreements & Rent Control Acts in India",
            "category": "Agreements",
            "title": "Understanding 11-Month Rental Agreements in India",
            "summary": "In India, rental agreements are commonly executed for 11 months to avoid mandatory registration under the Registration Act, 1908 (Section 17), which applies to leases exceeding 12 months.",
            "detailed_explanation": "Under Section 17 of the Registration Act, 1908, lease agreements exceeding 11 months require mandatory registration with the Sub-Registrar of Assurances and stamp duty payment. 11-month agreements are legally valid contracts under the Indian Contract Act, 1872 when executed on appropriate non-judicial stamp paper (e.g. ₹100 or ₹500 depending on the state).",
            "authoritative_source": "India Code - Registration Act, 1908 & Indian Stamp Act, 1899",
            "source_url": "https://www.indiacode.nic.in",
            "questions": [
                "Is an unregistered 11-month agreement valid in court?",
                "What is the required stamp duty value in Karnataka/Maharashtra/Delhi?",
                "What is the difference between Leave & License and Lease?"
            ]
        },
        {
            "id": "lk-2",
            "topic": "Legal Notice under Indian Law",
            "category": "Notices",
            "title": "What is a Legal Notice and How Does It Work?",
            "summary": "A Legal Notice is a formal written communication sent by an aggrieved party to another before initiating civil litigation, giving a statutory timeframe (usually 15 to 30 days) to resolve the matter.",
            "detailed_explanation": "In Indian civil procedure (Section 80 of CPC for government, and standard practice for private disputes), a legal notice serves as formal notice of intent to sue. It outlines the facts, legal grounds, remedies sought, and a deadline for compliance.",
            "authoritative_source": "Code of Civil Procedure, 1908 (CPC)",
            "source_url": "https://www.indiacode.nic.in",
            "questions": [
                "Must a legal notice be drafted by an advocate?",
                "How many days must be given to respond?",
                "What happens if I ignore a legal notice?"
            ]
        },
        {
            "id": "lk-3",
            "topic": "Indemnity Clauses",
            "category": "Contractual Terms",
            "title": "Indemnity under Indian Contract Act, 1872",
            "summary": "Section 124 of the Indian Contract Act defines a contract of indemnity as a contract by which one party promises to save the other from loss caused to him by the conduct of the promisor or any other person.",
            "detailed_explanation": "An indemnity clause transfers risk between parties. If Party A indemnifies Party B, Party A promises to reimburse Party B for legal costs, penalties, or damages incurred due to specified events or breaches.",
            "authoritative_source": "Indian Contract Act, 1872 (Section 124)",
            "source_url": "https://www.indiacode.nic.in",
            "questions": [
                "Does an indemnity clause have a financial limit?",
                "Is third-party liability covered under standard indemnity?"
            ]
        },
        {
            "id": "lk-4",
            "topic": "Free Legal Aid in India (NALSA)",
            "category": "Legal Rights",
            "title": "Free Legal Assistance under Legal Services Authorities Act, 1987",
            "summary": "Under the Legal Services Authorities Act, 1987, eligible individuals in India (women, children, SC/ST, low-income citizens) are entitled to free legal representation and advice through NALSA and DLSA.",
            "detailed_explanation": "The National Legal Services Authority (NALSA) along with State (SLSA) and District (DLSA) authorities provide free legal services, panel lawyers, Lok Adalat resolution, and court fee waivers to eligible citizens.",
            "authoritative_source": "National Legal Services Authority (NALSA) / Ministry of Law and Justice",
            "source_url": "https://nalsa.gov.in",
            "questions": [
                "Who qualifies for free legal aid in India?",
                "How can I apply for a DLSA panel lawyer?"
            ]
        }
    ]

def get_official_legal_sources() -> List[Dict[str, Any]]:
    return [
        {
            "id": "src-1",
            "name": "India Code (Repository of All Central & State Acts)",
            "authority": "Legislative Department, Ministry of Law and Justice, Govt of India",
            "url": "https://www.indiacode.nic.in",
            "description": "Official digital repository of all Central and State legislation in India."
        },
        {
            "id": "src-2",
            "name": "National Legal Services Authority (NALSA)",
            "authority": "Statutory Body under Legal Services Authorities Act, 1987",
            "url": "https://nalsa.gov.in",
            "description": "Official authority offering free legal services and Lok Adalat dispute resolution."
        },
        {
            "id": "src-3",
            "name": "eCourts Services Portal",
            "authority": "eCommittee, Supreme Court of India",
            "url": "https://ecourts.gov.in",
            "description": "Official portal for case status, court orders, cause lists across District and High Courts in India."
        },
        {
            "id": "src-4",
            "name": "Department of Justice",
            "authority": "Ministry of Law and Justice, Govt of India",
            "url": "https://doj.gov.in",
            "description": "Government department overseeing judicial reforms, legal aid, and access to justice."
        }
    ]
