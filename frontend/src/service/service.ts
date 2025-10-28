const BACKEND_API_URL = import.meta.env.VITE_API_URL;
export const API_URL = `${BACKEND_API_URL}/api/v1`;

export function sizedParams(page: number, size: number): URLSearchParams {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("size", size.toString());
  return params;
}
