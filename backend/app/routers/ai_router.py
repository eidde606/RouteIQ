from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.ai_service import analyze_routes

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post("/analyze")
def ai_analyze(db: Session = Depends(get_db)):
    return analyze_routes(db)
