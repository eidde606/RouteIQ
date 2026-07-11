import math
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundException
from app.models.route_assignment import RouteAssignment, RouteAssignmentCreate
from app.repositories import route_assignment_repository


def create_assignment(db: Session, assignment: RouteAssignmentCreate):
    return route_assignment_repository.save(db, assignment)

    return route_assignment_repository.save(db, new_assignment)


def get_all_route_assignments(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        office: str | None = None,
        carrier_name: str | None = None,
        sort_by: str = "id",
        order: str = "asc",
):
    skip = (page - 1) * page_size

    assignments = route_assignment_repository.find_all(
        db=db,
        skip=skip,
        limit=page_size,
        office=office,
        carrier_name=carrier_name,
        sort_by=sort_by,
        order=order,
    )

    total_items = route_assignment_repository.count(
        db=db,
        office=office,
        carrier_name=carrier_name
    )

    total_pages = math.ceil(total_items / page_size) if total_items else 1

    return {
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1,
        "data": assignments,
    }


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
        date=existing_assignment.date,
        route_id=updated_assignment.route_id,
        carrier_name=updated_assignment.carrier_name,
        office=updated_assignment.office,
        dps=updated_assignment.dps,
        parcels=updated_assignment.parcels,
        accountables=updated_assignment.accountables,
    )

    return route_assignment_repository.update(db, id, new_assignment)


def delete_assignment(db: Session, id: int):
    assignment = route_assignment_repository.delete(db, id)

    if assignment is None:
        raise NotFoundException("Route assignment not found")

    return assignment
