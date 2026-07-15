from sqlalchemy.orm import Session

from app.services.route_assignment_service import get_all_route_assignments
from app.services.openai_service import get_ai_recommendation
from app.services.workload_service import WorkloadService


def build_prompt(
    overloaded_route,
    best_helper,
):
    return f"""
You are an AI assistant helping USPS supervisors explain workload balancing decisions.

IMPORTANT:

A deterministic Python workload engine has ALREADY analyzed today's workload.

Your job is NOT to make a decision.

Do NOT change the recommendation.

Do NOT suggest different routes.

Simply explain WHY the recommendation below makes sense.

------------------------------------------------------------
OVERLOADED ROUTE
------------------------------------------------------------

Route: {overloaded_route.assignment.route_id}
Carrier: {overloaded_route.assignment.carrier_name}

Workload:
- DPS: {overloaded_route.assignment.dps}
- Parcels: {overloaded_route.assignment.parcels}
- Accountables: {overloaded_route.assignment.accountables}

Calculated Score:
{overloaded_route.score:.2f}

------------------------------------------------------------
RECOMMENDED HELPER
------------------------------------------------------------

Route: {best_helper.assignment.route_id}
Carrier: {best_helper.assignment.carrier_name}

Workload:
- DPS: {best_helper.assignment.dps}
- Parcels: {best_helper.assignment.parcels}
- Accountables: {best_helper.assignment.accountables}

Calculated Score:
{best_helper.score:.2f}

------------------------------------------------------------
TASK
------------------------------------------------------------

Write 2–3 concise sentences explaining why the overloaded route is expected to require assistance and why the selected helper is the best available option based on the workload information above.
"""

    return prompt


def analyze_routes(db: Session):
    assignments_response = get_all_route_assignments(
        db=db,
        page=1,
        page_size=1000,
    )

    assignments = assignments_response["data"]

    scored_routes = WorkloadService.score_routes(assignments)

    overloaded_route = WorkloadService.get_overloaded_route(scored_routes)

    best_helper = WorkloadService.get_best_helper(
        scored_routes,
        overloaded_route,
    )

    prompt = build_prompt(overloaded_route, best_helper)

    recommendation = get_ai_recommendation(prompt)

    return {
        "overloaded_route": {
            "route_id": overloaded_route.assignment.route_id,
            "carrier_name": overloaded_route.assignment.carrier_name,
            "score": round(overloaded_route.score, 2),
        },
        "recommended_helper": {
            "route_id": best_helper.assignment.route_id,
            "carrier_name": best_helper.assignment.carrier_name,
            "score": round(best_helper.score, 2),
        },
        "recommendation": recommendation,
    }