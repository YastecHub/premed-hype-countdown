interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval?: number }): Promise<void>;
}

export async function registerServiceWorker(): Promise<void> {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported in this browser');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker registered successfully:', registration);

    // Try to set up periodic background sync
    if ('periodicSync' in registration) {
      try {
        await (registration.periodicSync as PeriodicSyncManager).register('exam-reminder', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours
        });
        console.log('Periodic sync registered');
      } catch (error) {
        console.log('Periodic sync not available:', error);
      }
    }

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New Service Worker version available');
          }
        });
      }
    });
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

// Send message to Service Worker to show notification
export async function sendNotificationViaServiceWorker(
  title: string,
  body: string,
  tag: string = 'exam-notification'
): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: 'SEND_NOTIFICATION',
        title,
        body,
        tag,
      });
      console.log('Notification message sent to Service Worker');
    }
  } catch (error) {
    console.error('Failed to send notification via Service Worker:', error);
  }
}

// Unregister service worker if needed
export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('All Service Workers unregistered');
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
  }
}
