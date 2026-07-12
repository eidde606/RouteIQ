import api from "../api/axios"


export interface AIRecommendationResponse {
    recommendation: string;
}

export async function analyzeRoutes(): Promise<AIRecommendationResponse> {
    const response = await api.post<AIRecommendationResponse>("/ai/analyze");

    return response.data;
}
