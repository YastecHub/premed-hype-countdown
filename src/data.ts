export interface Exam {
  id: number;
  course: string;
  date: string;
  time: string;
  timestamp: string;
  venue: string;
}

export const EXAMS: Exam[] = [
  {
    id: 1,
    course: "GST",
    date: "Tuesday, March 3",
    time: "9am - 12pm",
    timestamp: "2026-03-03T09:00:00",
    venue: "DLI BLK 1 & BLK 2"
  },
  {
    id: 2,
    course: "BIO 101",
    date: "Monday, March 9",
    time: "9am - 3pm",
    timestamp: "2026-03-09T09:00:00",
    venue: "DLI BLK 1 & BLK 2"
  },
  {
    id: 3,
    course: "PHY 103",
    date: "Wednesday, March 11",
    time: "9am - 12pm",
    timestamp: "2026-03-11T09:00:00",
    venue: "DLI BLK 1 & BLK 2"
  },
  {
    id: 5,
    course: "PHY 101",
    date: "Monday, March 16",
    time: "9am - 3pm",
    timestamp: "2026-03-16T09:00:00",
    venue: "DLI BLK 1 & BLK 2"
  },
  {
    id: 6,
    course: "COS 101/FSC 113",
    date: "Tuesday, March 17",
    time: "9am - 3pm",
    timestamp: "2026-03-17T09:00:00",
    venue: "DLI BLK 1 & BLK 2"
  },
  {
    id: 8,
    course: "MTH 101",
    date: "Tuesday, March 24",
    time: "9am - 3pm",
    timestamp: "2026-03-24T09:00:00",
    venue: "DLI BLK 1 & BLK 2"
  },
  {
    id: 9,
    course: "CHM 101",
    date: "Wednesday, March 25",
    time: "9am - 3pm",
    timestamp: "2026-03-25T09:00:00",
    venue: "DLI BLK 1 & BLK 2"
  },
  {
    id: 4,
    course: "ZOO 101",
    date: "Friday, March 27",
    time: "9am - 3pm",
    timestamp: "2026-03-27T09:00:00",
    venue: "LT009 & LT018 & LT026"
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
