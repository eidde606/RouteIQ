from sqlalchemy.orm import Session

from app.services.route_assignment_service import get_all_route_assignments
from app.services.openai_service import get_ai_recommendation


def build_prompt(assignments):
    prompt = """
You are an AI assistant helping USPS supervisors balance carrier workloads.

Analyze today's route assignments.

Your goal is to identify:

1. The carrier most likely to exceed an 8-hour workday.
2. The best available carrier to provide assistance.

Evaluate the overall workload using ALL available information.

Do NOT assume DPS alone determines workload.

Consider all of the following together:
- DPS (letter volume)
- Parcels (package volume)
- Accountables (certified mail and signatures)

When comparing routes, explain why one workload is heavier or lighter than another.

If two carriers have similar workloads, explain why you selected one over the other.

Return your response using exactly this format:

Route Predicted to Exceed 8 Hours:
<route number and carrier>

Recommended Helper:
<route number and carrier>

Reasoning:
<2-4 concise sentences explaining your recommendation based on the workload data>

Today's route assignments:

"""
    for assignment in assignments:
        prompt += f"""
    Route: {assignment.route_id}
    Carrier: {assignment.carrier_name}
    Office: {assignment.office}
    DPS: {assignment.dps}
    Parcels: {assignment.parcels}
    Accountables: {assignment.accountables}
"""

    return prompt


def analyze_routes(db: Session):
    assignments_response = get_all_route_assignments(
        db=db,
        page=1,
        page_size=1000,
    )

    assignments = assignments_response["data"]

    prompt = build_prompt(assignments)

    recommendation = get_ai_recommendation(prompt)

    return {
        "recommendation": recommendation,
    }
