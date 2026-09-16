from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import LegalKnowledgeItem, Source
from app.schemas import LegalKnowledgeResponse
from app.services.seed_data import get_authoritative_legal_knowledge, get_official_legal_sources

router = APIRouter(tags=["General Legal Knowledge"])

@router.get("/legal-information/search", response_model=List[LegalKnowledgeResponse])
def search_legal_knowledge(q: Optional[str] = Query(None)):
    """
    Returns authoritative Indian legal knowledge concepts (Registration Act, Legal Notice, Indemnity, NALSA, etc.).
    """
    items = get_authoritative_legal_knowledge()
    if q and q.strip():
        q_lower = q.lower()
        items = [i for i in items if q_lower in i["topic"].lower() or q_lower in i["title"].lower() or q_lower in i["summary"].lower()]
    return [LegalKnowledgeResponse(**item) for item in items]

@router.get("/sources")
def get_official_sources():
    """
    Returns directory of official Indian legal aid and judicial portals (India Code, NALSA, eCourts, DoJ).
    """
    return get_official_legal_sources()
