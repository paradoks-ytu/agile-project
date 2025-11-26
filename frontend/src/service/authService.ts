import { API_URL } from "./service";
import type { RegisterRequest, LoginRequest, ApiResponse } from "@/types/authTypes";

export const register = async (request: RegisterRequest): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu.');
    }

    return data;
};

export const login = async (request: LoginRequest): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Giriş başarısız.');
    }

    return data;
};
