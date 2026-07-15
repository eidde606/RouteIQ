from sqlalchemy.orm import Session

from app.services.route_assignment_service import get_all_route_assignments
from app.services.openai_service import get_ai_recommendation
from app.services.workload_service import WorkloadService


def build_prompt(
    overloaded_route,
    best_helper,
):
    return f"""
You are an AI assistant for RouteIQ, a USPS workload balancing application.

A deterministic Python workload engine has already completed today's workload analysis.

The recommendation below is FINAL.

Your responsibility is ONLY to explain the recommendation in clear, professional language.

RULES

- Do NOT recalculate workloads.
- Do NOT recommend different routes.
- Do NOT question the workload engine.
- Do NOT compare against routes that are not shown.
- Do NOT speculate or invent reasoning.
- Use ONLY the information provided below.

------------------------------------------------------------
WORKLOAD ENGINE RESULTS
------------------------------------------------------------

OVERLOADED ROUTE

Route: {overloaded_route.assignment.route_id}
Carrier: {overloaded_route.assignment.carrier_name}

Workload Metrics:
- DPS: {overloaded_route.assignment.dps}
- Parcels: {overloaded_route.assignment.parcels}
- Accountables: {overloaded_route.assignment.accountables}

Calculated Workload Score:
{overloaded_route.score:.2f}

------------------------------------------------------------

RECOMMENDED HELPER

Route: {best_helper.assignment.route_id}
Carrier: {best_helper.assignment.carrier_name}

Workload Metrics:
- DPS: {best_helper.assignment.dps}
- Parcels: {best_helper.assignment.parcels}
- Accountables: {best_helper.assignment.accountables}

Calculated Workload Score:
{best_helper.score:.2f}

------------------------------------------------------------
TASK
------------------------------------------------------------

------------------------------------------------------------
TASK
------------------------------------------------------------

Write exactly 2 or 3 concise, professional sentences.

The explanation should:

1. State that the workload engine identified the route as the one most likely to exceed an 8-hour workday because it produced the highest calculated workload based on its workload metrics.

2. State that the recommended helper was selected because it has the lowest calculated workload among the remaining available routes and is therefore the best available option to assist.

3. Optionally conclude by stating that this recommendation helps balance workload across carriers.

Do NOT repeat the numerical workload scores.

Do NOT compare individual workload metrics between the two routes.

Do NOT mention routes that are not listed above.

Respond ONLY with the explanation.
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