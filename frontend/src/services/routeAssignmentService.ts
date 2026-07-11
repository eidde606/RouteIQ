import api from "../api/axios";
import type {RouteAssignmentCreate} from "../types/routeAssignment";

export async function getRouteAssignments() {
    const response = await api.get("/route-assignments");

    return response.data;
}

export async function createRouteAssignment(formData: RouteAssignmentCreate) {
    const response = await api.post(
        "/route-assignments",
        formData
    );

    return response.data;
}

export const deleteRouteAssignment = async (id: number) => {
    const response = await api.delete(`/route-assignments/${id}`);

    return response.data;
}