from sqlalchemy.orm import Session

from app.models.route_assignment import RouteAssignment
from app.models.route_assignment_db import RouteAssignment as RouteAssignmentDB


def save(db: Session, assignment: RouteAssignment):
    db_assignment = RouteAssignmentDB(
        date=assignment.date,
        route_id=assignment.route_id,
        carrier_name=assignment.carrier_name,
        office=assignment.office
    )

    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)

    return db_assignment


def find_all(db: Session):
    return db.query(RouteAssignmentDB).all()


def find_by_id(db: Session, id: int):
    return db.query(RouteAssignmentDB).filter(RouteAssignmentDB.id == id).first()


def update(db: Session, id: int, updated_assignment: RouteAssignment):
    assignment = find_by_id(db, id)

    if assignment is None:
        return None

    assignment.date = updated_assignment.date
    assignment.route_id = updated_assignment.route_id
    assignment.carrier_name = updated_assignment.carrier_name
    assignment.office = updated_assignment.office

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