export interface RegisterRequest {
    email: string;
    clubName: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
}

export interface ClubResponse {
    id: number;
    name: string;
    description: string;
    tags: string[];
    profilePicture: string | null;
    banner: string | null;
}

export interface ClubUpdateRequest {
    name?: string;
    description?: string;
    tags?: string[];
}

export interface APPaged<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
