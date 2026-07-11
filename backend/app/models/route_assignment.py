from pydantic import BaseModel
from datetime import date

class RouteAssignmentCreate(BaseModel):
    route_id: int
    carrier_name: str
    office: str
    dps: int
    parcels: int
    accountables: int


class RouteAssignment(BaseModel):
    id: int
    date: date
    route_id: int
    carrier_name: str
    office: str
    dps: int
    parcels: int
    accountables: int