from app.models.route_assignment import RouteAssignment

route_assignments = []


def create_assignment(assignment: RouteAssignment):
    route_assignments.append(assignment)
    return assignment


def get_all_route_assignments():
    return route_assignments
