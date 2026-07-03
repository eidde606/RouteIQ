from pydantic import BaseModel

class RouteAssignment(BaseModel):
    date: str
    route_id: int
    carrier_name: str
    office: str