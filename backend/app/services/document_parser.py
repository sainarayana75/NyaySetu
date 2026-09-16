import os
import re
from typing import Dict, List, Any, Tuple

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

try:
    import docx
except ImportError:
    docx = None

class DocumentParserService:
    @staticmethod
    def parse_document(file_path: str, file_type: str) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Parses document file and returns (full_text, pages_data)
        pages_data = [{"page_number": int, "text": str, "clauses": List[Dict]}]
        """
        file_ext = file_type.lower().replace(".", "")
        
        if file_ext == "pdf":
            return DocumentParserService._parse_pdf(file_path)
        elif file_ext in ["docx", "doc"]:
            return DocumentParserService._parse_docx(file_path)
        elif file_ext == "txt":
            return DocumentParserService._parse_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

    @staticmethod
    def _parse_pdf(file_path: str) -> Tuple[str, List[Dict[str, Any]]]:
        full_text_parts = []
        pages_data = []

        if PyPDF2:
            try:
                with open(file_path, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    for i, page in enumerate(reader.pages):
                        page_text = page.extract_text() or ""
                        page_num = i + 1
                        full_text_parts.append(page_text)
                        pages_data.append({
                            "page_number": page_num,
                            "text": page_text,
                            "clauses": DocumentParserService._extract_clauses_from_text(page_text, page_num)
                        })
            except Exception as e:
                pass

        if not full_text_parts or not "".join(full_text_parts).strip():
            # Fallback for empty/scanned PDFs
            with open(file_path, "r", errors="ignore") as f:
                raw_content = f.read()
                full_text_parts.append(raw_content)
                pages_data.append({
                    "page_number": 1,
                    "text": raw_content,
                    "clauses": DocumentParserService._extract_clauses_from_text(raw_content, 1)
                })

        full_text = "\n\n".join(full_text_parts)
        return full_text, pages_data

    @staticmethod
    def _parse_docx(file_path: str) -> Tuple[str, List[Dict[str, Any]]]:
        full_text_parts = []
        if docx:
            doc = docx.Document(file_path)
            for p in doc.paragraphs:
                if p.text.strip():
                    full_text_parts.append(p.text)
        else:
            with open(file_path, "r", errors="ignore") as f:
                full_text_parts.append(f.read())
                
        full_text = "\n".join(full_text_parts)
        pages_data = [{
            "page_number": 1,
            "text": full_text,
            "clauses": DocumentParserService._extract_clauses_from_text(full_text, 1)
        }]
        return full_text, pages_data

    @staticmethod
    def _parse_txt(file_path: str) -> Tuple[str, List[Dict[str, Any]]]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            full_text = f.read()
        pages_data = [{
            "page_number": 1,
            "text": full_text,
            "clauses": DocumentParserService._extract_clauses_from_text(full_text, 1)
        }]
        return full_text, pages_data

    @staticmethod
    def _extract_clauses_from_text(text: str, page_number: int) -> List[Dict[str, Any]]:
        """
        Detects numbered clauses (e.g., '1. RENT AND PAYMENT', 'Clause 4.1', etc.)
        """
        clauses = []
        # Pattern for Clause X or X. Y Title
        pattern = re.compile(r'(?:(\d+\.\d+|\d+\.|\bClause\s+\d+(?:\.\d+)?)\s*([A-Z\s\-,]{3,50}))', re.MULTILINE)
        matches = pattern.finditer(text)
        
        for m in matches:
            clause_num = m.group(1).strip()
            clause_title = m.group(2).strip()
            clauses.append({
                "clause_number": clause_num,
                "title": clause_title,
                "page_number": page_number,
                "start_char": m.start(),
                "end_char": m.end()
            })
        return clauses
