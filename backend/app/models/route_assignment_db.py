from datetime import date

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Date
from app.database.base import Base



class RouteAssignment(Base):
    __tablename__ = "route_assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[date] = mapped_column(Date)
    route_id: Mapped[int] = mapped_column(Integer)
    carrier_name: Mapped[str] = mapped_column(String(100))
    office: Mapped[str] = mapped_column(String(100))
