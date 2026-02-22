import { EXAMS } from "../data";
import { differenceInCalendarDays, differenceInSeconds, intervalToDuration } from "date-fns";

export interface NotificationPreferences {
  enabled: boolean;
  time: string;
}

const NOTIFICATION_PREFERENCES_KEY = "premed-notification-prefs";
const NOTIFICATION_SHOWN_TODAY_KEY = "premed-notification-shown-today";
const LAST_3HOUR_NOTIFICATION_KEY = "premed-last-3hour-notification";
const RETURNING_USER_NOTIFIED_KEY = "premed-returning-user-notified";

const MOTIVATIONS = [
  "🔥 You're crushing it! Keep that momentum going!",
  "💪 Every study hour brings you closer to success!",
  "🎯 Stay focused. Your future self will thank you!",
  "⚡ This is your moment. Don't let it slip away!",
  "🌟 You're a future healthcare legend. Act like it!",
  "📚 Knowledge is power. Keep leveling up!",
  "🚀 From student to doctor/nurse/pharmacist - you're on the way!",
  "💯 Excellence isn't a destination, it's a habit. Build it!",
  "🧠 Your brain is a supercomputer. Feed it knowledge!",
  "✨ Radiology legend in the making? Keep going!",
  "🏆 All-nighters are overrated. Smart study wins!",
  "🎓 Future Radiographer, Pharmacist, Nurse - you got this!",
  "⏰ Time invested now = Freedom later. Remember that!",
  "🌈 Bad grades are temporary, but your effort is permanent!",
  "💎 You're not just studying, you're becoming unstoppable!"
];

export function getNotificationPreferences(): NotificationPreferences {
  const stored = localStorage.getItem(NOTIFICATION_PREFERENCES_KEY);
  return stored
    ? JSON.parse(stored)
    : {
        enabled: false,
        time: "08:00"
      };
}

export function setNotificationPreferences(prefs: NotificationPreferences): void {
  localStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(prefs));
}

export function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return Promise.resolve(false);
  }

  if (Notification.permission === "granted") {
    return Promise.resolve(true);
  }

  if (Notification.permission !== "denied") {
    return Notification.requestPermission().then(permission => {
      return permission === "granted";
    });
  }

  return Promise.resolve(false);
}

export function hasNotificationPermission(): boolean {
  return "Notification" in window && Notification.permission === "granted";
}

function getRandomMotivation(): string {
  return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
}

function getUpcomingExamMessage(): string {
  const now = new Date();
  const upcomingExams = EXAMS.filter(exam => new Date(exam.timestamp) > now);

  if (upcomingExams.length === 0) {
    return "All exams completed! Time to celebrate! 🎉";
  }

  const nextExam = upcomingExams[0];
  const daysUntil = differenceInCalendarDays(new Date(nextExam.timestamp), now);

  if (daysUntil === 0) {
    return `${nextExam.course} is TODAY! Final push incoming! 🚀`;
  } else if (daysUntil === 1) {
    return `${nextExam.course} is TOMORROW! Give it your all! 💪`;
  } else if (daysUntil <= 7) {
    return `${daysUntil} days until ${nextExam.course}. Time to focus! 📚`;
  } else {
    return `${daysUntil} days until your next exam. Keep grinding! ⚡`;
  }
}

export function sendDailyReminder(): void {
  if (!hasNotificationPermission()) {
    return;
  }

  // Check if we already sent a notification today
  const today = new Date().toDateString();
  const lastShown = localStorage.getItem(NOTIFICATION_SHOWN_TODAY_KEY);

  if (lastShown === today) {
    return; // Already sent today
  }

  const examMessage = getUpcomingExamMessage();
  const motivation = getRandomMotivation();

  const title = "Study Reminder 📖";
  const body = `${examMessage}\n\n${motivation}`;

  const notification = new Notification(title, {
    body: body,
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23000' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='%2306b6d4'>📚</text></svg>",
    badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>X</text></svg>",
    dir: "auto" as const,
    tag: "daily-reminder",
    requireInteraction: false
  });

  // Mark as shown today
  localStorage.setItem(NOTIFICATION_SHOWN_TODAY_KEY, today);

  // Click to focus window
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

export function sendImmediateTestNotification(): void {
  if (!hasNotificationPermission()) {
    return;
  }

  const now = new Date();
  const upcomingExams = EXAMS.filter(exam => new Date(exam.timestamp) > now);

  if (upcomingExams.length === 0) {
    const title = "🎉 UNILAG PreMed - All Done!";
    const body = "Congratulations! All your exams are complete. You crushed it!";
    
    new Notification(title, {
      body: body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23000' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='%2306b6d4'>🎉</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>✓</text></svg>",
      tag: "test-notification",
      requireInteraction: true
    });
    return;
  }

  const nextExam = upcomingExams[0];
  const target = new Date(nextExam.timestamp);
  const diffSeconds = differenceInSeconds(target, now);
  const duration = intervalToDuration({
    start: now,
    end: diffSeconds > 0 ? target : now,
  });

  let countdownText = "";
  const days = duration.days || 0;
  const hours = duration.hours || 0;

  if (days === 0 && hours === 0) {
    countdownText = "NOW! 🚀";
  } else if (days === 0) {
    countdownText = `${hours}h remaining 💪`;
  } else if (days === 1) {
    countdownText = `${days}d ${hours}h - TOMORROW! 💪`;
  } else {
    countdownText = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h`;
  }

  const examDate = new Date(nextExam.timestamp);
  const dateStr = examDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const title = `📚 UNILAG PreMed Exam Countdown`;
  const body = `${nextExam.course}\n${countdownText}\n\n📅 ${dateStr}\n🕐 ${timeStr}\n\nYou'll get daily reminders at 8am. Stay focused! ✨`;

  const notification = new Notification(title, {
    body: body,
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23000' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='%2306b6d4'>📚</text></svg>",
    badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>X</text></svg>",
    dir: "auto" as const,
    tag: "test-notification",
    requireInteraction: true
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

export function setupDailyNotificationScheduler(preferredTime: string = "08:00"): (() => void) {
  // Parse time
  const [hours, minutes] = preferredTime.split(":").map(Number);

  function scheduleNextNotification() {
    const now = new Date();
    const nextNotification = new Date();
    nextNotification.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (nextNotification <= now) {
      nextNotification.setDate(nextNotification.getDate() + 1);
    }

    const timeUntilNotification = differenceInSeconds(
      nextNotification,
      now
    ) * 1000;

    const timeoutId = setTimeout(() => {
      sendDailyReminder();
      // Reschedule for next day
      scheduleNextNotification();
    }, timeUntilNotification);

    return () => clearTimeout(timeoutId);
  }

  return scheduleNextNotification();
}

export function send3HourIntervalNotification(): void {
  if (!hasNotificationPermission()) {
    return;
  }

  const now = new Date();
  const last3HourNotif = localStorage.getItem(LAST_3HOUR_NOTIFICATION_KEY);
  const lastTimestamp = last3HourNotif ? parseInt(last3HourNotif) : 0;
  const timeSinceLastNotif = now.getTime() - lastTimestamp;
  const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

  // Only send if 3 hours have passed since last notification
  if (timeSinceLastNotif < THREE_HOURS_MS) {
    return;
  }

  const upcomingExams = EXAMS.filter(exam => new Date(exam.timestamp) > now);

  if (upcomingExams.length === 0) {
    return; // No exams, don't send
  }

  const nextExam = upcomingExams[0];
  const target = new Date(nextExam.timestamp);
  const diffSeconds = differenceInSeconds(target, now);
  const duration = intervalToDuration({
    start: now,
    end: diffSeconds > 0 ? target : now,
  });

  const days = duration.days || 0;
  const hours = duration.hours || 0;

  let countdownText = "";
  if (days === 0 && hours === 0) {
    countdownText = "NOW! 🚀";
  } else if (days === 0) {
    countdownText = `${hours}h remaining 💪`;
  } else if (days === 1) {
    countdownText = `${days}d ${hours}h - TOMORROW! 💪`;
  } else {
    countdownText = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h`;
  }

  const examMessage = getUpcomingExamMessage();
  const motivation = getRandomMotivation();

  const title = `Study Check-In 📖`;
  const body = `${nextExam.course}\n${countdownText}\n\n${examMessage}\n\n${motivation}`;

  const notification = new Notification(title, {
    body: body,
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23000' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='%2306b6d4'>📚</text></svg>",
    badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>!</text></svg>",
    dir: "auto" as const,
    tag: "interval-reminder",
    requireInteraction: false
  });

  // Mark when this notification was sent
  localStorage.setItem(LAST_3HOUR_NOTIFICATION_KEY, now.getTime().toString());

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

export function setup3HourNotificationScheduler(): (() => void) {
  // Send immediately if eligible
  send3HourIntervalNotification();

  // Then schedule every 3 hours
  const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
  const intervalId = setInterval(() => {
    send3HourIntervalNotification();
  }, THREE_HOURS_MS);

  return () => clearInterval(intervalId);
}

export function sendNotificationToReturningUser(): void {
  if (!hasNotificationPermission()) {
    return;
  }

  // Check if we already sent a notification to this returning user
  const alreadyNotified = localStorage.getItem(RETURNING_USER_NOTIFIED_KEY);
  if (alreadyNotified) {
    return;
  }

  // Mark that we've notified this returning user
  localStorage.setItem(RETURNING_USER_NOTIFIED_KEY, "true");

  const now = new Date();
  const upcomingExams = EXAMS.filter(exam => new Date(exam.timestamp) > now);

  if (upcomingExams.length === 0) {
    return;
  }

  const nextExam = upcomingExams[0];
  const target = new Date(nextExam.timestamp);
  const diffSeconds = differenceInSeconds(target, now);
  const duration = intervalToDuration({
    start: now,
    end: diffSeconds > 0 ? target : now,
  });

  const days = duration.days || 0;
  const hours = duration.hours || 0;

  let countdownText = "";
  if (days === 0 && hours === 0) {
    countdownText = "NOW! 🚀";
  } else if (days === 0) {
    countdownText = `${hours}h remaining`;
  } else if (days === 1) {
    countdownText = `${days}d ${hours}h - TOMORROW!`;
  } else {
    countdownText = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h remaining`;
  }

  const examDate = new Date(nextExam.timestamp);
  const dateStr = examDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const motivation = getRandomMotivation();

  const title = `📚 UNILAG PreMed - Welcome Back!`;
  const body = `${nextExam.course} • ${countdownText}\n\n📅 ${dateStr} | 🕐 ${timeStr}\n\n${motivation}`;

  const notification = new Notification(title, {
    body: body,
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23000' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='%2306b6d4'>📚</text></svg>",
    badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>X</text></svg>",
    dir: "auto" as const,
    tag: "returning-user-notification",
    requireInteraction: false
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}
