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
}

export interface ClubUpdateRequest {
    name?: string;
    description?: string;
    tags?: string[];
}
