export const API_URL = "http://127.0.0.1:8080/api/v1";

export function sizedParams(page: number, size: number): URLSearchParams {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("size", size.toString());
  return params;
}
