import { API_URL } from "./service";
import type { RegisterRequest, LoginRequest, ApiResponse, ClubResponse, ClubUpdateRequest, APPaged } from '../types/authTypes';

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
    localStorage.setItem('user_role', 'club');

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
        throw new Error(data.message || 'Kullanıcı bilgileri alınamadı.');
    }

    localStorage.setItem('user_data', JSON.stringify(data));
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
        throw new Error(data.message || 'Güncelleme başarısız.');
    }

    localStorage.setItem('user_data', JSON.stringify(data));
    return data;
};

export const uploadProfilePicture = async (file: File): Promise<ClubResponse> => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await fetch(`${API_URL}/clubs/profile-picture`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Profil resmi yüklenemedi.');
    }

    localStorage.setItem('user_data', JSON.stringify(data));
    return data;
};

export const uploadBanner = async (file: File): Promise<ClubResponse> => {
    const formData = new FormData();
    formData.append('banner', file);

    const response = await fetch(`${API_URL}/clubs/banner`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Banner yüklenemedi.');
    }

    localStorage.setItem('user_data', JSON.stringify(data));
    return data;
};

export const logout = () => {
    // Clear client-side session flag
    localStorage.removeItem('user_session');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');

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

export const getCachedUser = (): ClubResponse | UserResponse | null => {
    const data = localStorage.getItem('user_data');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }
    return null;
};

export const getClubs = async (page: number = 0, size: number = 30): Promise<APPaged<ClubResponse>> => {
    const response = await fetch(`${API_URL}/clubs?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch clubs');
    }

    return response.json();
};

export const getClubById = async (id: number): Promise<ClubResponse> => {
    const response = await fetch(`${API_URL}/clubs/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch club');
    }

    return response.json();
};

// ==========================================
// Student / User Authentication
// ==========================================

import type { UserRegisterRequest, UserLoginRequest, UserResponse, UserUpdateRequest } from '../types/authTypes';

export const registerUser = async (request: UserRegisterRequest): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/auth/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Kayıt başarısız.');
    }

    return data;
};

export const verifyUser = async (email: string, code: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/auth/user/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Doğrulama başarısız.');
    }

    return data;
};

export const loginUser = async (request: UserLoginRequest): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/auth/user/login`, {
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

    // Set client-side session flag and role
    localStorage.setItem('user_session', 'active');
    localStorage.setItem('user_role', 'student');

    return data;
};

export const getMeUser = async (): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/auth/user/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Kullanıcı bilgileri alınamadı.');
    }

    localStorage.setItem('user_data', JSON.stringify(data));
    return data;
};

export const updateUser = async (request: UserUpdateRequest): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/auth/user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Güncelleme başarısız.');
    }

    localStorage.setItem('user_data', JSON.stringify(data));
    return data;
};

export const toggleMembership = async (clubId: number): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/clubs/${clubId}/membership`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Üyelik işlemi başarısız.');
    }

    return data;
};

export const getClubMembers = async (clubId: number, page: number = 0, size: number = 10): Promise<APPaged<UserResponse>> => {
    const response = await fetch(`${API_URL}/clubs/${clubId}/members?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Üyeler getirilemedi');
    }

    return response.json();
};

export const getUserRole = (): 'club' | 'student' | null => {
    return localStorage.getItem('user_role') as 'club' | 'student' | null;
};



