import type { Announcement } from "../types/announcementsTypes";
import type { PagedResponse } from "../types/types";
import { API_URL, sizedParams } from "./service";


export const fetchAnnouncements = async (
  page: number = 0,
  size: number = 10
): Promise<PagedResponse<Announcement>> => {
  const params = sizedParams(page, size);
  
  return await fetch(`${API_URL}/announcements${params.toString()}`)
    .then((res) => res.json());
};
