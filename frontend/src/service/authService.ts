import { API_URL } from "./service";
import type { RegisterRequest, LoginRequest, ApiResponse, ClubResponse, ClubUpdateRequest } from '@/types/authTypes';

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

    // Set client-side session flag
    localStorage.setItem('user_session', 'active');

    return data;
};

export const getMe = async (): Promise<ClubResponse> => {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı.');
    }

    return data;
};

export const updateClub = async (request: ClubUpdateRequest): Promise<ClubResponse> => {
    const response = await fetch(`${API_URL}/clubs`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Güncelleme başarısız.');
    }

    return data;
};

export const logout = () => {
    // Clear client-side session flag
    localStorage.removeItem('user_session');

    // Optional: Call backend logout if it exists (ignoring error for now)
    try {
        fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        }).catch(() => { });
    } catch (e) {
        // Ignore
    }
};

export const isAuthenticated = (): boolean => {
    return localStorage.getItem('user_session') === 'active';
};
