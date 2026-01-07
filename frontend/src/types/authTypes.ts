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

export interface UserRegisterRequest {
    firstName: string;
    secondName: string;
    email: string;
    password: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateCreated: string;
    // roles: string[]; // Might not be returned by backend explicitly
}

export interface UserUpdateRequest {
    firstName: string;
    secondName: string; // Backend uses secondName for lastName
    tags?: string[];
}
