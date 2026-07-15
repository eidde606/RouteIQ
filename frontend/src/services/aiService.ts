import api from "../api/axios"

export interface RouteRecommendation {
    route_id: number;
    carrier_name: string;
    score: number;
}

export interface AIRecommendationResponse {
    overloaded_route: RouteRecommendation;
    recommended_helper: RouteRecommendation;
    recommendation: string;
}

export async function analyzeRoutes(): Promise<AIRecommendationResponse> {
    const response = await api.post<AIRecommendationResponse>("/ai/analyze");

    return response.data;
}
