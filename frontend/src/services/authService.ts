import api from "../api/axios"

export const login = async (username: string, password: string) => {
    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const response = await api.post("/users/login", formData);
    return response.data;
}