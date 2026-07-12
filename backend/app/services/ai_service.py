from sqlalchemy.orm import Session

from app.services.route_assignment_service import get_all_route_assignments


def analyze_routes(db: Session):
    assignments_response = get_all_route_assignments(
        db=db,
        page=1,
        page_size=1000,
    )

    assignments = assignments_response["data"]

    return {
        "routes_found": len(assignments),
        "total_items": assignments_response["total_items"],
    }