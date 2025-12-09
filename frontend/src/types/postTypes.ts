import { ClubResponse } from './authTypes';

export interface PostResponse {
    id: number;
    title: string;
    content: string;
    club: ClubResponse;
    creationDate: string;
}

export interface CreatePostRequest {
    title: string;
    content: string;
}

export interface APPagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
