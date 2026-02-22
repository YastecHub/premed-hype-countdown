import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  hasNotificationPermission,
  requestNotificationPermission,
  setupDailyNotificationScheduler,
  getNotificationPreferences,
  setNotificationPreferences,
  sendImmediateTestNotification,
} from "../lib/notifications";

export function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(true);

  useEffect(() => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      setNotificationsSupported(false);
      return;
    }

    // Check if already enabled
    const hasPermission = hasNotificationPermission();
    const prefs = getNotificationPreferences();

    if (hasPermission && prefs.enabled) {
      setIsEnabled(true);
    } else if (!hasPermission && !prefs.enabled) {
      // Show prompt if not already dismissed
      const dismissed = localStorage.getItem("premed-notification-dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPreferences({
        enabled: true,
        time: "08:00",
      });
      setIsEnabled(true);
      setIsVisible(false);
      
      // Clear the returning user flag so they get the returning user notification
      localStorage.removeItem("premed-returning-user-notified");
      
      // Setup the scheduler
      setupDailyNotificationScheduler("08:00");
      // Send immediate test notification so user knows it's working
      setTimeout(() => {
        sendImmediateTestNotification();
      }, 500);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("premed-notification-dismissed", "true");
  };

  if (!notificationsSupported || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 rounded-lg p-4 backdrop-blur-md shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Bell className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">
                  Daily Study Reminders
                </h3>
                <p className="text-sm text-white/80 mb-3">
                  Get daily motivational reminders for your upcoming exams.
                  Stay focused and crush your goals! 💪
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleEnable}
                    className="flex-1 px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Enable Reminders
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Close notification"
                className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
