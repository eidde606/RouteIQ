export interface RouteAssignmentCreate {
    carrier_name: string;
    route_id: string;
    office: string;
    dps: number;
    parcels: number;
    accountables: number;
}