
export type AnnouncementSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export type Announcement = {
    id: number;
    title: string;
    content: string;
    date: string;
    severity: AnnouncementSeverity;
}