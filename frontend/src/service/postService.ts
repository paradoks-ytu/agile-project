import { API_URL } from "./service";
import type { PostResponse, CreatePostRequest, APPagedResponse } from '../types/postTypes';

export const createPost = async (request: CreatePostRequest): Promise<PostResponse> => {
    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Gönderi oluşturulamadı.');
    }

    return response.json();
};

export const getClubPosts = async (clubId: number, page: number = 0, size: number = 10): Promise<APPagedResponse<PostResponse>> => {
    // Using the endpoint provided by user: /clubs/{id}/posts
    const response = await fetch(`${API_URL}/clubs/${clubId}/posts?page=${page}&size=${size}&sort=creationDate,desc`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Gönderiler alınamadı.');
    }

    return response.json();
};

export const deletePost = async (postId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Gönderi silinemedi.');
    }
};
