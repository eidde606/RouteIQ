from fastapi import FastAPI, APIRouter
from app.models.route_assignment import RouteAssignment
from app.services.route_assignment_service import (
    create_assignment,
    get_all_route_assignments
)

router = APIRouter(
    prefix="/route-assignments",
    tags=["Route Assignments"],
)


@router.post("/")
def create_route_assignment(assignment: RouteAssignment):
    create_assignment = create_assignment(assignment)

    return {"message": "Route assignment created",
            "data": assignment}


@router.get("/")
def get_route_assignment():
    assignments = get_all_route_assignments()
    return {
        "count": len(route_assignments),
        "data": route_assignments
    }
