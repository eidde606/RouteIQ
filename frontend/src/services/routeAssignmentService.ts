import api from "../api/axios";

export async function getRouteAssignments() {
    const response = await api.get("/route-assignments");

    return response.data;
}