/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

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

function getRandomMotivation(): string {
  return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
}

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

// Handle messages from client
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SEND_NOTIFICATION') {
    const { title, body, tag } = event.data;
    self.registration.showNotification(title, {
      body: body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23000' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='%2306b6d4'>📚</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>!</text></svg>",
      tag: tag || 'exam-notification',
      requireInteraction: false
    });
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync for notifications (every ~30 minutes)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'exam-reminder') {
    console.log('Periodic sync triggered - sending exam reminder');
    event.waitUntil(
      self.registration.showNotification('📚 UNILAG PreMed - Study Time!', {
        body: 'Time to focus on your upcoming exams. Keep crushing it! 💪',
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23000' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='%2306b6d4'>📚</text></svg>",
        badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>!</text></svg>",
        tag: 'periodic-reminder',
        requireInteraction: false
      })
    );
  }
});

export {};
