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
