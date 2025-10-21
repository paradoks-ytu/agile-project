export const API_URL = "http://api.ytuagile.com/api/v1";

export function sizedParams(page: number, size: number): URLSearchParams {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("size", size.toString());
  return params;
}
