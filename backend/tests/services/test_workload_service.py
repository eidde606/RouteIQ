from datetime import date

from app.models.route_assignment import RouteAssignment
from app.services.workload_service import WorkloadService


def create_assignment(
    id: int,
    dps: int,
    parcels: int,
    accountables: int,
):
    return RouteAssignment(
        id=id,
        date=date.today(),
        route_id=id,
        carrier_name=f"Carrier {id}",
        office="Hopewell",
        dps=dps,
        parcels=parcels,
        accountables=accountables,
    )


def test_calculate_score():
    assignment = create_assignment(
        id=1,
        dps=1800,
        parcels=280,
        accountables=2,
    )

    expected_score = (
        1800 * 0.35
        + 280 * 0.60
        + 2 * 5
    )

    score = WorkloadService.calculate_score(assignment)

    assert score == expected_score


def test_score_routes():
    assignments = [
        create_assignment(1, 1200, 100, 1),
        create_assignment(2, 1800, 280, 2),
    ]

    scored_routes = WorkloadService.score_routes(assignments)

    assert len(scored_routes) == 2
    assert scored_routes[0].assignment.id == 1
    assert scored_routes[1].assignment.id == 2

    assert scored_routes[0].score == WorkloadService.calculate_score(assignments[0])
    assert scored_routes[1].score == WorkloadService.calculate_score(assignments[1])


def test_get_overloaded_route():
    assignments = [
        create_assignment(1, 1200, 100, 1),
        create_assignment(2, 2000, 300, 3),
        create_assignment(3, 1500, 150, 1),
    ]

    scored_routes = WorkloadService.score_routes(assignments)

    overloaded = WorkloadService.get_overloaded_route(scored_routes)

    assert overloaded.assignment.id == 2


def test_get_best_helper():
    assignments = [
        create_assignment(1, 1200, 100, 1),
        create_assignment(2, 2000, 300, 3),
        create_assignment(3, 1500, 150, 1),
    ]

    scored_routes = WorkloadService.score_routes(assignments)

    overloaded = WorkloadService.get_overloaded_route(scored_routes)

    helper = WorkloadService.get_best_helper(
        scored_routes,
        overloaded,
    )

    assert helper.assignment.id == 1