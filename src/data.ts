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

export interface PremedCourse {
  name: string;
  faculty: string;
  gstDate: string;
  gstTimestamp: string;
  gstTime: string;
  gstVenue: string;
}

export const PREMED_COURSES: PremedCourse[] = [
  {
    name: "MBBS (Medicine & Surgery)",
    faculty: "Clinical Science (CMUL)",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Anatomy",
    faculty: "Basic Medical Science (CMUL)",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Physiology",
    faculty: "Basic Medical Science (CMUL)",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Pharmacology",
    faculty: "Basic Medical Science (CMUL)",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Dentistry",
    faculty: "Dental Science",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Nursing",
    faculty: "Health Professions (CMUL)",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Radiography",
    faculty: "Health Professions (CMUL)",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Medical Laboratory Science (MLS)",
    faculty: "Health Professions (CMUL)",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Physiotherapy",
    faculty: "Health Professions (CMUL)",
    gstDate: "Friday, August 7",
    gstTimestamp: "2026-08-07T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "Engineering"
  },
  {
    name: "Pharmacy",
    faculty: "Pharmacy",
    gstDate: "Saturday, August 8",
    gstTimestamp: "2026-08-08T08:00:00",
    gstTime: "8:00 AM - 12:00 PM",
    gstVenue: "CITS"
  }
];

export function getSelectedCourse(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user-premed-course") || "MBBS (Medicine & Surgery)";
  }
  return "MBBS (Medicine & Surgery)";
}

export function getExamsForCourse(courseName: string): Exam[] {
  const premedCourse = PREMED_COURSES.find(c => c.name === courseName) || PREMED_COURSES[0];
  
  return EXAMS.map(exam => {
    if (exam.course === "GST 112") {
      return {
        ...exam,
        date: premedCourse.gstDate,
        time: premedCourse.gstTime,
        timestamp: premedCourse.gstTimestamp,
        venue: premedCourse.gstVenue
      };
    }
    return exam;
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function getExams(): Exam[] {
  return getExamsForCourse(getSelectedCourse());
}

export const QUOTES = [
  "That 5.0 CGPA is 100% achievable. Keep pushing!",
  "Future Healthcare Hero, the world is waiting.",
  "Pain is temporary, but your Degree is forever.",
  "One exam at a time. You've got this!",
  "Pharmacy, Nursing, Med, Radiography... We all win together.",
  "Excellence is the standard. Don't settle.",
  "Sleep is good, but crushing this semester is better."
];
