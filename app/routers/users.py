from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import UserCreate, UserResponse, UserLogin
from app.services.user_service import create_user
from app.services.user_service import (
    create_user,
    login_user,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    return create_user(db, user)

@router.post("/login")
def login(
    login: UserLogin,
    db: Session = Depends(get_db)
):
    return login_user(db, login)