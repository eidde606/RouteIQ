from sqlalchemy.orm import Session

from app.services.route_assignment_service import get_all_route_assignments
from app.services.openai_service import get_ai_recommendation


def build_prompt(assignments):
    prompt = """
You are an AI assistant helping USPS supervisors.

Analyze today's route assignments.

Determine which carrier is most likely to work over 8 hours.

Recommend which carrier should assist the overloaded route.

Each route contains:
- DPS = letter volume
- Parcels = package volume
- Accountables = certified mail and signatures

Higher values generally indicate a heavier workload and a greater chance of exceeding an 8-hour workday.

Return:
- The route predicted to exceed 8 hours
- The recommended helper carrier
- A brief explanation of your reasoning

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
