export interface Exam {
  id: number;
  course: string;
  date: string; // Display string
  time: string; // Display string
  timestamp: string; // ISO string for logic
  venue: string;
}

export const EXAMS: Exam[] = [
  { 
    id: 1, 
    course: "GST", 
    date: "Monday, March 2", 
    time: "9am - 12pm", 
    timestamp: "2026-03-02T09:00:00", 
    venue: "DLI, BK2, GFLR" 
  },
  { 
    id: 2, 
    course: "BIO 101", 
    date: "Monday, March 9", 
    time: "9am - 12pm / 12pm - 3pm", 
    timestamp: "2026-03-09T09:00:00", 
    venue: "DLI, BK2, GFLR" 
  },
  { 
    id: 3, 
    course: "PHY 103", 
    date: "Wed, March 11", 
    time: "9am - 12pm", 
    timestamp: "2026-03-11T09:00:00", 
    venue: "DLI, BK2, GFLR" 
  },
  { 
    id: 4, 
    course: "ZOO 101", 
    date: "Thursday, March 12", 
    time: "12pm - 3pm", 
    timestamp: "2026-03-12T12:00:00", 
    venue: "DLI, BK2, GFLR" 
  },
  { 
    id: 5, 
    course: "PHY 101", 
    date: "Monday, March 16", 
    time: "9am - 12pm / 12pm - 3pm", 
    timestamp: "2026-03-16T09:00:00", 
    venue: "DLI, BK2, GFLR" 
  },
  { 
    id: 6, 
    course: "COS 101", 
    date: "Tue, March 17", 
    time: "9am - 12pm", 
    timestamp: "2026-03-17T09:00:00", 
    venue: "DLI, BK2, GFLR" 
  },
  { 
    id: 7, 
    course: "CHM 101", 
    date: "Wed, March 18", 
    time: "9am - 12pm / 12pm - 3pm", 
    timestamp: "2026-03-18T09:00:00", 
    venue: "DLI, BK2, GFLR" 
  },
  { 
    id: 8, 
    course: "MTH 101", 
    date: "Tue, March 24", 
    time: "9am - 12pm / 12pm - 3pm", 
    timestamp: "2026-03-24T09:00:00", 
    venue: "DLI, BK2, GFLR" 
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
