from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.auth import create_access_token
from app.core.security import verify_password
from app.repositories.user_repository import get_user_by_email

from app.core.exceptions import BadRequestException
from app.core.security import hash_password
from app.models.user import UserCreate, UserLogin
from app.repositories import user_repository


def create_user(db: Session, user: UserCreate):
    existing_username = user_repository.find_by_username(
        db,
        user.username
    )

    if existing_username:
        raise BadRequestException("Username already exists")

    existing_email = user_repository.find_by_email(
        db,
        user.email
    )

    if existing_email:
        raise BadRequestException("Email already exists")

    hashed_user = UserCreate(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
    )

    return user_repository.save(db, hashed_user)


def login_user(
        db: Session,
        login: UserLogin
):
    user = get_user_by_email(
        db,
        login.email
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(
            login.password,
            user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
