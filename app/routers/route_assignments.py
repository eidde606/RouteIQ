from fastapi import APIRouter, Depends, HTTPException, status
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
    assignment = get_assignment_by_id(db, assignment_id)

    if assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route assignment not found"
        )

    return assignment


@router.put("/{assignment_id}")
def update_route_assignment(
    assignment_id: int,
    assignment: RouteAssignmentCreate,
    db: Session = Depends(get_db)
):
    updated_assignment = update_assignment(db, assignment_id, assignment)

    if updated_assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route assignment not found"
        )

    return updated_assignment


@router.delete("/{assignment_id}")
def delete_route_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    deleted_assignment = delete_assignment(db, assignment_id)

    if deleted_assignment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route assignment not found"
        )

    return {
        "message": "Route assignment deleted successfully",
        "data": deleted_assignment
    }