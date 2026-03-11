import { EXAMS } from "../data";
import { differenceInCalendarDays, differenceInSeconds, intervalToDuration } from "date-fns";
import { sendNotificationViaServiceWorker } from "./sw-register";

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

  const now = new Date();
  const upcomingExams = EXAMS.filter(exam => new Date(exam.timestamp) > now);

  if (upcomingExams.length === 0) {
    const title = "🎉 All Exams Complete!";
    const body = "You crushed it! Celebrate your success! 🚀";
    localStorage.setItem(NOTIFICATION_SHOWN_TODAY_KEY, today);
    sendNotificationViaServiceWorker(title, body, 'daily-reminder');
    return;
  }

  const nextExam = upcomingExams[0];
  const examDate = new Date(nextExam.timestamp);
  const timeStr = examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const daysUntil = differenceInCalendarDays(examDate, now);

  let countdownText = "";
  if (daysUntil === 0) {
    countdownText = "TODAY!";
  } else if (daysUntil === 1) {
    countdownText = "TOMORROW";
  } else {
    countdownText = `${daysUntil}d away`;
  }

  const title = `${nextExam.course} • ${countdownText} • ${timeStr}`;
  const body = getRandomMotivation();

  // Mark as shown today
  localStorage.setItem(NOTIFICATION_SHOWN_TODAY_KEY, today);

  sendNotificationViaServiceWorker(title, body, 'daily-reminder');
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

    sendNotificationViaServiceWorker(title, body, 'test-notification');
    return;
  }

  const nextExam = upcomingExams[0];
  const examDate = new Date(nextExam.timestamp);
  const timeStr = examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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
    countdownText = "NOW!";
  } else if (days === 0) {
    countdownText = `${hours}h`;
  } else if (days === 1) {
    countdownText = `${days}d ${hours}h`;
  } else {
    countdownText = `${days}d ${hours}h`;
  }

  const title = `${nextExam.course} • ${dateStr} ${timeStr} • ${countdownText}`;
  const body = "You got this! 💪";

  sendNotificationViaServiceWorker(title, body, 'test-notification');
}

export function setupDailyNotificationScheduler(preferredTime: string = "08:00"): (() => void) {
  // Parse time
  const [hours, minutes] = preferredTime.split(":").map(Number);

  // If the scheduled time has already passed today, send now (catches missed notifications)
  const now = new Date();
  const scheduledToday = new Date();
  scheduledToday.setHours(hours, minutes, 0, 0);
  if (now >= scheduledToday) {
    sendDailyReminder(); // internally checks if already sent today
  }

  // Use a closure-level variable so we can always cancel the latest timeout
  let currentTimeoutId: ReturnType<typeof setTimeout> | null = null;

  function scheduleNextNotification() {
    const now = new Date();
    const nextNotification = new Date();
    nextNotification.setHours(hours, minutes, 0, 0);

    // Always push to tomorrow since we either just sent or it's still ahead
    if (nextNotification <= now) {
      nextNotification.setDate(nextNotification.getDate() + 1);
    }

    const timeUntilNotification = differenceInSeconds(nextNotification, now) * 1000;

    currentTimeoutId = setTimeout(() => {
      sendDailyReminder();
      scheduleNextNotification();
    }, timeUntilNotification);
  }

  scheduleNextNotification();

  return () => {
    if (currentTimeoutId !== null) clearTimeout(currentTimeoutId);
  };
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
  const examDate = new Date(nextExam.timestamp);
  const timeStr = examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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
    countdownText = "NOW!";
  } else if (days === 0) {
    countdownText = `${hours}h`;
  } else if (days === 1) {
    countdownText = `${days}d ${hours}h`;
  } else {
    countdownText = `${days}d ${hours}h`;
  }

  const title = `${nextExam.course} • ${dateStr} ${timeStr} • ${countdownText}`;
  const body = getRandomMotivation();

  // Mark when this notification was sent
  localStorage.setItem(LAST_3HOUR_NOTIFICATION_KEY, now.getTime().toString());

  sendNotificationViaServiceWorker(title, body, 'interval-reminder');
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
  const examDate = new Date(nextExam.timestamp);
  const timeStr = examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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
    countdownText = "NOW!";
  } else if (days === 0) {
    countdownText = `${hours}h remaining`;
  } else if (days === 1) {
    countdownText = `${days}d ${hours}h - TOMORROW!`;
  } else {
    countdownText = `${days}d ${hours}h remaining`;
  }

  const title = `${nextExam.course} • ${dateStr} ${timeStr} • ${countdownText}`;
  const body = getRandomMotivation();

  sendNotificationViaServiceWorker(title, body, 'returning-user-notification');
}
