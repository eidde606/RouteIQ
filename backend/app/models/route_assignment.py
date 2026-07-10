from pydantic import BaseModel
from datetime import date

class RouteAssignmentCreate(BaseModel):
    date: date
    route_id: int
    carrier_name: str
    office: str

class RouteAssignment(BaseModel):
    id: int
    date: date
    route_id: int
    carrier_name: str
    office: str