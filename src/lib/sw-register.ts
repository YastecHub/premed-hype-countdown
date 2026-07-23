interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval?: number }): Promise<void>;
}

export async function registerServiceWorker(): Promise<void> {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported in this browser');
    return;
  }

  // Skip service worker in development mode to avoid 404/MIME errors since sw.js is only built in production
  if (import.meta.env.DEV) {
    console.log('Development mode detected: Skipping Service Worker registration. Client-side notifications fallback will be used.');
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
  const showFallbackNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          tag: tag,
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23000' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='%2306b6d4'>📚</text></svg>"
        });
        console.log('Fallback client-side notification sent');
      } catch (e) {
        console.error('Failed to send fallback notification:', e);
      }
    }
  };

  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported - trying fallback');
    showFallbackNotification();
    return;
  }

  try {
    let resolved = false;
    const fallbackTimeout = setTimeout(() => {
      if (!resolved) {
        console.log('Service worker ready timeout - using fallback notification');
        showFallbackNotification();
      }
    }, 1000);

    const registration = await navigator.serviceWorker.ready;
    resolved = true;
    clearTimeout(fallbackTimeout);

    if (registration.active) {
      registration.active.postMessage({
        type: 'SEND_NOTIFICATION',
        title,
        body,
        tag,
      });
      console.log('Notification message sent to Service Worker');
    } else {
      console.log('Service worker not active - using fallback notification');
      showFallbackNotification();
    }
  } catch (error) {
    console.error('Failed to send notification via Service Worker, using fallback:', error);
    showFallbackNotification();
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
