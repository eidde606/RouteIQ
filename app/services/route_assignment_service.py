from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.models.route_assignment import RouteAssignment, RouteAssignmentCreate
from app.repositories import route_assignment_repository


def create_assignment(db: Session, assignment: RouteAssignmentCreate):
    new_assignment = RouteAssignment(
        id=0,
        date=assignment.date,
        route_id=assignment.route_id,
        carrier_name=assignment.carrier_name,
        office=assignment.office,
    )

    return route_assignment_repository.save(db, new_assignment)


def get_all_route_assignments(db: Session):
    return route_assignment_repository.find_all(db)


def get_assignment_by_id(db: Session, id: int):
    assignment = route_assignment_repository.find_by_id(db, id)

    if assignment is None:
        raise NotFoundException("Route assignment not found")

    return assignment


def update_assignment(db: Session, id: int, updated_assignment: RouteAssignmentCreate):
    existing_assignment = route_assignment_repository.find_by_id(db, id)

    if existing_assignment is None:
        raise NotFoundException("Route assignment not found")

    new_assignment = RouteAssignment(
        id=id,
        date=updated_assignment.date,
        route_id=updated_assignment.route_id,
        carrier_name=updated_assignment.carrier_name,
        office=updated_assignment.office,
    )

    return route_assignment_repository.update(db, id, new_assignment)


def delete_assignment(db: Session, id: int):
    assignment = route_assignment_repository.delete(db, id)

    if assignment is None:
        raise NotFoundException("Route assignment not found")

    return assignment