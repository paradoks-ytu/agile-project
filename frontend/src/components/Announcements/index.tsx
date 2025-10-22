import React from "react";
import type { Announcement } from "@/types/announcementsTypes";
import { fetchAnnouncements } from "@/service/announcementsService";

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "System Maintenance",
    content: "The system will be down for maintenance at 10 PM.",
    date: "2025-10-22T10:00:00Z",
    severity: "INFO",
  },
  {
    id: 2,
    title: "Password Expiry",
    content: "Your password will expire in 3 days.",
    date: "2025-10-21T08:30:00Z",
    severity: "WARNING",
  },
  {
    id: 3,
    title: "Data Breach Alert",
    content: "Critical vulnerability detected, immediate action required.",
    date: "2025-10-20T14:45:00Z",
    severity: "CRITICAL",
  },
  {
    id: 4,
    title: "New Feature Release",
    content: "A new feature has been released. Check it out!",
    date: "2025-10-19T12:00:00Z",
    severity: "INFO",
  },
  {
    id: 5,
    title: "Server Load High",
    content: "Server load is unusually high. Monitoring closely.",
    date: "2025-10-22T09:15:00Z",
    severity: "WARNING",
  },
];

export default function Announcement() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchAnnouncementsEffect = async () => {
      try {
        let pageNum = 0;
        let done = false;
        let allData: Announcement[] = [];

        while (!done) {
          const data = await fetchAnnouncements(pageNum);
          allData = [...allData, ...data.data];
          done = data.lastPage;
          pageNum++;
        }

        setAnnouncements(allData);
      } catch (err) {
        setError(new Error("Error fetching Announcements: " + err));
      } finally {
        setLoading(false);
      }
    };

    // fetchAnnouncementsEffect();
    setAnnouncements(mockAnnouncements);
    setLoading(false);
  }, []);

  if (loading) return null;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <p className="text-lg font-semibold text-red-600">Error</p>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (announcements.length === 0) return null;

  const critical = announcements.filter(
    (a) => a.severity === "CRITICAL"
  ).length;
  const warning = announcements.filter((a) => a.severity === "WARNING").length;
  const info = announcements.filter((a) => a.severity === "INFO").length;

  return (
    <div className="p-4 bg-gray-800 text-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-white"
      >
        <svg
          style={{
            width: 24,
            height: 24,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span>
          {critical > 0 && `${critical} Critical, `}
          {warning > 0 && `${warning} Warning, `}
          {info > 0 && `${info} Info`}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[1000px] mt-2" : "max-h-0"
        }`}
      >
        {announcements.map((a) => (
          <div key={a.id} className="p-2 border-b border-gray-400/50">
            <div className="font-bold">
              {a.title}{" "}
              <span
                className={`text-sm ${
                  a.severity === "CRITICAL"
                    ? "text-red-400"
                    : a.severity === "WARNING"
                    ? "text-yellow-400"
                    : "text-blue-400"
                }`}
              >
                {a.severity}
              </span>
            </div>
            <div>{a.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
