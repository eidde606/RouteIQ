from sqlalchemy.orm import Session

from app.models.route_assignment import RouteAssignment
from app.models.route_assignment_db import RouteAssignment as RouteAssignmentDB
from app.models.route_assignment import RouteAssignmentCreate
from datetime import date


def count(
        db: Session,
        office: str | None = None,
        carrier_name: str | None = None,
):
    query = db.query(RouteAssignmentDB)

    if office:
        query = query.filter(
            RouteAssignmentDB.office.ilike(f"%{office}%"))

    if carrier_name:
        query = query.filter(
            RouteAssignmentDB.carrier_name.ilike(f"%{carrier_name}%")
        )

    return query.count()


def save(db: Session, assignment: RouteAssignmentCreate):
    db_assignment = RouteAssignmentDB(
        date=date.today(),
        route_id=assignment.route_id,
        carrier_name=assignment.carrier_name,
        office=assignment.office,
        dps=assignment.dps,
        parcels=assignment.parcels,
        accountables=assignment.accountables,
    )

    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)

    return db_assignment


def find_all(
        db: Session,
        skip: int = 0,
        limit: int = 10,
        office: str | None = None,
        carrier_name: str | None = None,
        sort_by: str = "id",
        order: str = "asc",
):
    query = db.query(RouteAssignmentDB)

    if office:
        query = query.filter(
            RouteAssignmentDB.office.ilike(f"%{office}%")
        )

    if carrier_name:
        query = query.filter(
            RouteAssignmentDB.carrier_name.ilike(f"%{carrier_name}%")
        )
    allowed_sort_fields = {
        "id": RouteAssignmentDB.id,
        "date": RouteAssignmentDB.date,
        "route_id": RouteAssignmentDB.route_id,
        "carrier_name": RouteAssignmentDB.carrier_name,
        "office": RouteAssignmentDB.office,
        "dps": RouteAssignmentDB.dps,
        "parcels": RouteAssignmentDB.parcels,
        "accountables": RouteAssignmentDB.accountables,
    }

    sort_column = allowed_sort_fields.get(sort_by, RouteAssignmentDB.id)

    if order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )


def find_by_id(db: Session, id: int):
    return db.query(RouteAssignmentDB).filter(RouteAssignmentDB.id == id).first()


def update(db: Session, id: int, updated_assignment: RouteAssignmentCreate):
    assignment = find_by_id(db, id)

    if assignment is None:
        return None

    assignment.date = updated_assignment.date
    assignment.route_id = updated_assignment.route_id
    assignment.carrier_name = updated_assignment.carrier_name
    assignment.office = updated_assignment.office
    assignment.dps = updated_assignment.dps
    assignment.parcels = updated_assignment.parcels
    assignment.accountables = updated_assignment.accountables

    db.commit()
    db.refresh(assignment)

    return assignment


def delete(db: Session, id: int):
    assignment = find_by_id(db, id)

    if assignment is None:
        return None

    db.delete(assignment)
    db.commit()

    return assignment
