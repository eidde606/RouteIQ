from sqlalchemy.orm import Session

from app.models.user_db import User


def save(
        db: Session,
        username: str,
        email: str,
        hashed_password: str,
        role: str
):
    db_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        role=role,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def find_by_username(db: Session, username: str):
    return (
        db.query(User)
        .filter(User.username == username)
        .first()
    )


def find_by_email(db: Session, email: str):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
