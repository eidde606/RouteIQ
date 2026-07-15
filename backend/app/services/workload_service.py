from dataclasses import dataclass

from app.models.route_assignment import RouteAssignment
from typing import List


@dataclass
class ScoredRoute:
    assignment: RouteAssignment
    score: float


class WorkloadService:
    @staticmethod
    def calculate_score(assignment: RouteAssignment) -> float:
        return (
                assignment.dps * 0.35
                + assignment.parcels * 0.60
                + assignment.accountables * 5
        )

    @staticmethod
    def score_routes(assignments: List[RouteAssignment]) -> List[ScoredRoute]:
        scored_routes = []

        for assignment in assignments:
            scored_routes.append(
                ScoredRoute(
                    assignment=assignment,
                    score=WorkloadService.calculate_score(assignment)
                )
            )

        return scored_routes

    @staticmethod
    def get_overloaded_route(scored_routes: List[ScoredRoute]) -> ScoredRoute:
        return max(scored_routes, key=lambda route: route.score)

    @staticmethod
    def get_best_helper(
            scored_routes: List[ScoredRoute],
            overloaded_route: ScoredRoute
    ) -> ScoredRoute:
        available_helpers = []

        for route in scored_routes:
            if route.assignment.id != overloaded_route.assignment.id:
                available_helpers.append(route)

        return min(available_helpers, key=lambda route: route.score)