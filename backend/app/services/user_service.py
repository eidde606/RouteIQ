from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.auth import create_access_token
from app.core.security import verify_password
from app.repositories.user_repository import find_by_email

from app.core.exceptions import BadRequestException
from app.core.security import hash_password
from app.models.user import UserCreate, UserLogin
from app.repositories import user_repository
from fastapi.security import OAuth2PasswordRequestForm


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

    hashed_password = hash_password(user.password)

    return user_repository.save(
        db=db,
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
    )



def login_user(
    db: Session,
    form_data: OAuth2PasswordRequestForm
):
    print("Email entered:", form_data.username)

    user = find_by_email(
        db,
        form_data.username
    )

    print("User found:", user)

    if user:
        print("Stored hash:", user.hashed_password)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    print("Password entered:", form_data.password)

    password_valid = verify_password(
        form_data.password,
        user.hashed_password
    )

    print("Password valid:", password_valid)

    if not password_valid:
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