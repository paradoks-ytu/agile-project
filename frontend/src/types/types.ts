export type PagedResponse<T> = {
    content: T[];
    totalElements: number;
    page: number;
    totalPages: number;
    last: boolean;
}