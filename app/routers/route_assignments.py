from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.route_assignment import RouteAssignmentCreate
from app.services.route_assignment_service import (
    create_assignment,
    get_all_route_assignments,
    get_assignment_by_id,
    update_assignment,
    delete_assignment
)

router = APIRouter(
    prefix="/route-assignments",
    tags=["Route Assignments"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def create_route_assignment(
    assignment: RouteAssignmentCreate,
    db: Session = Depends(get_db)
):
    return create_assignment(db, assignment)


@router.get("/")
def get_route_assignments(db: Session = Depends(get_db)):
    assignments = get_all_route_assignments(db)

    return {
        "count": len(assignments),
        "data": assignments
    }


@router.get("/{assignment_id}")
def get_route_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    return get_assignment_by_id(db, assignment_id)


@router.put("/{assignment_id}")
def update_route_assignment(
    assignment_id: int,
    assignment: RouteAssignmentCreate,
    db: Session = Depends(get_db)
):
    return update_assignment(db, assignment_id, assignment)


@router.delete("/{assignment_id}")
def delete_route_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    deleted_assignment = delete_assignment(db, assignment_id)

    return {
        "message": "Route assignment deleted successfully",
        "data": deleted_assignment
    }