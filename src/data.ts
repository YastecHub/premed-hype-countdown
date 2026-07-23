export interface Exam {
  id: number;
  course: string;
  title: string;
  date: string;
  time: string;
  timestamp: string;
  venue: string;
}

export const EXAMS: Exam[] = [
  {
    id: 1,
    course: "GST 112",
    title: "Nigerian Peoples and Culture",
    date: "Saturday, August 8",
    time: "10:00 AM",
    timestamp: "2026-08-08T10:00:00",
    venue: "DLI Centre"
  },
  {
    id: 2,
    course: "PHY-CM 102",
    title: "General Physics II",
    date: "Wednesday, August 19",
    time: "9:00 AM",
    timestamp: "2026-08-19T09:00:00",
    venue: "DLI Centre"
  },
  {
    id: 3,
    course: "PHY-CM 104",
    title: "General Physics IV",
    date: "Friday, August 21",
    time: "9:00 AM",
    timestamp: "2026-08-21T09:00:00",
    venue: "DLI Centre"
  },
  {
    id: 4,
    course: "MTH 102",
    title: "Elementary Mathematics II",
    date: "Monday, August 24",
    time: "7:24 AM",
    timestamp: "2026-08-24T07:24:00",
    venue: "DLI Centre"
  },
  {
    id: 5,
    course: "ZOO 102",
    title: "Animal Diversity",
    date: "Tuesday, August 25",
    time: "7:17 AM",
    timestamp: "2026-08-25T07:17:00",
    venue: "DLI Centre"
  },
  {
    id: 6,
    course: "CHM-CM 102",
    title: "General Chemistry II",
    date: "Wednesday, August 26",
    time: "9:00 AM",
    timestamp: "2026-08-26T09:00:00",
    venue: "DLI Centre"
  },
  {
    id: 7,
    course: "BIO 102",
    title: "General Biology II",
    date: "Thursday, August 27",
    time: "7:19 AM",
    timestamp: "2026-08-27T07:19:00",
    venue: "DLI Centre"
  }
];

export const QUOTES = [
  "That 5.0 CGPA is 100% achievable. Keep pushing!",
  "Future Healthcare Hero, the world is waiting.",
  "Pain is temporary, but your Degree is forever.",
  "One exam at a time. You've got this!",
  "Pharmacy, Nursing, Med, Radiography... We all win together.",
  "Excellence is the standard. Don't settle.",
  "Sleep is good, but crushing this semester is better."
];
