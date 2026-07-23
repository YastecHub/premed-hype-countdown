import { useEffect, useState } from "react";
import { EXAMS } from "./data";
import { Countdown } from "./components/Countdown";
import { QuoteTicker } from "./components/QuoteTicker";
import { ExamCard } from "./components/ExamCard";
import { NotificationPrompt } from "./components/NotificationPrompt";
import { differenceInCalendarDays } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, GraduationCap, ArrowDown, Bell, BellOff } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import {
  setupDailyNotificationScheduler,
  hasNotificationPermission,
  getNotificationPreferences,
  setNotificationPreferences,
  setup3HourNotificationScheduler,
  sendNotificationToReturningUser,
  sendImmediateTestNotification,
  requestNotificationPermission
} from "./lib/notifications";

export default function App() {
  const [now, setNow] = useState(new Date());
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Synchronize notification preferences state
  useEffect(() => {
    const checkPrefs = () => {
      const hasPermission = hasNotificationPermission();
      const prefs = getNotificationPreferences();
      setIsNotificationEnabled(hasPermission && prefs.enabled);
      setNotificationTime(prefs.time || "08:00");
    };
    checkPrefs();
    window.addEventListener("focus", checkPrefs);
    return () => window.removeEventListener("focus", checkPrefs);
  }, []);

  // Setup/Tear down notifications on state change
  useEffect(() => {
    if (isNotificationEnabled) {
      const dailyCleanup = setupDailyNotificationScheduler(notificationTime);
      const intervalCleanup = setup3HourNotificationScheduler();
      sendNotificationToReturningUser();
      
      return () => {
        dailyCleanup?.();
        intervalCleanup?.();
      };
    }
  }, [isNotificationEnabled, notificationTime]);

  const handleToggleNotifications = async () => {
    if (isNotificationEnabled) {
      setNotificationPreferences({ enabled: false, time: notificationTime });
      setIsNotificationEnabled(false);
    } else {
      const granted = hasNotificationPermission();
      if (granted) {
        setNotificationPreferences({ enabled: true, time: notificationTime });
        setIsNotificationEnabled(true);
      } else {
        const isGranted = await requestNotificationPermission();
        if (isGranted) {
          setNotificationPreferences({ enabled: true, time: notificationTime });
          setIsNotificationEnabled(true);
        } else {
          alert("Notification permission denied by browser. Please enable them in browser settings.");
        }
      }
    }
  };

  const handleTimeChange = (newTime: string) => {
    setNotificationTime(newTime);
    setNotificationPreferences({ enabled: isNotificationEnabled, time: newTime });
  };

  // Find the next upcoming exam
  const upcomingExams = EXAMS.filter((exam) => new Date(exam.timestamp) > now);
  const nextExam = upcomingExams.length > 0 ? upcomingExams[0] : null;
  const allCompleted = upcomingExams.length === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
      </div>

      <Analytics />
      <NotificationPrompt onEnabled={() => setIsNotificationEnabled(true)} />
      <div className="relative z-10 max-w-md mx-auto md:max-w-3xl px-4 py-8 md:py-12 flex flex-col min-h-screen">
        
        {/* Top Control Bar */}
        <div className="flex justify-end mb-2 relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all backdrop-blur-sm cursor-pointer relative z-50 flex items-center gap-2"
            title="Notification Settings"
          >
            {isNotificationEnabled ? (
              <Bell className="w-4 h-4 text-cyan-400 animate-swing" />
            ) : (
              <BellOff className="w-4 h-4 text-white/40" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">Reminders</span>
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-12 w-72 bg-slate-900/95 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-4 text-left"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    Study Reminders
                  </h4>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-white/40 hover:text-white text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Reminder Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/70">Enable Reminders</span>
                  <button
                    onClick={handleToggleNotifications}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isNotificationEnabled ? "bg-cyan-500" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isNotificationEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {isNotificationEnabled && (
                  <>
                    {/* Time Input */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/70">Daily Reminder Time</span>
                      <input
                        type="time"
                        value={notificationTime}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Test Button */}
                    <button
                      onClick={() => sendImmediateTestNotification()}
                      className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors text-cyan-300 cursor-pointer"
                    >
                      Send Test Notification
                    </button>
                  </>
                )}

                {!isNotificationEnabled && (
                  <p className="text-[10px] text-white/40 leading-relaxed italic">
                    Enable reminders to get daily alerts at your preferred study times and keep your momentum up!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">UNILAG • Premed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">
            Exam <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Countdown</span>
          </h1>
          <div className="overflow-hidden relative w-full max-w-sm mx-auto h-6 mb-2">
             <div className="animate-marquee whitespace-nowrap text-xs font-medium text-white/40 uppercase tracking-wider">
                MBBS • Pharmacy • Nursing • Radiography • Dentistry • MLS • Physiotherapy • Anatomy • Pharmacology • Physiology •
                MBBS • Pharmacy • Nursing • Radiography • Dentistry • MLS • Physiotherapy • Anatomy • Pharmacology • Physiology •
             </div>
          </div>
          <p className="text-white/50 text-sm md:text-base">
            Stay focused. Stay hungry. Crush it.
          </p>
        </motion.header>

        {/* Hero Section: Countdown or Celebration */}
        <div className="mb-12">
          {allCompleted ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 px-6 bg-gradient-to-b from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-3xl backdrop-blur-md"
            >
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 mb-6">
                <GraduationCap className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Semester Complete!</h2>
              <p className="text-emerald-200/80">You've officially survived. Go celebrate!</p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400/80">
                  Next Up: <span className="text-white">{nextExam?.course}</span>
                </span>
              </div>
              {nextExam && <Countdown targetDate={nextExam.timestamp} />}
              <QuoteTicker />
            </>
          )}
        </div>

        {/* Exam Timeline */}
        <div className="space-y-2 pb-12">
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-lg font-bold text-white/90">Schedule</h3>
            <span className="text-xs font-medium text-white/40">{EXAMS.length} Exams Total</span>
          </div>
          
          <div className="flex flex-col">
            {EXAMS.map((exam, index) => {
              // Determine status
              let status: "completed" | "next" | "upcoming" = "upcoming";
              
              if (new Date(exam.timestamp) < now) {
                status = "completed";
              } else if (exam.id === nextExam?.id) {
                status = "next";
              }

              // Calculate gap to next exam
              const nextExamItem = EXAMS[index + 1];
              const daysUntilNext = nextExamItem 
                ? differenceInCalendarDays(new Date(nextExamItem.timestamp), new Date(exam.timestamp))
                : 0;

              return (
                <div key={exam.id} className="flex flex-col">
                  <ExamCard 
                    exam={exam} 
                    status={status} 
                    index={index} 
                  />
                  
                  {/* Gap Indicator */}
                  {nextExamItem && daysUntilNext > 0 && (
                    <div className="flex items-center justify-center py-4 relative">
                      <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-white/5 via-white/10 to-white/5" />
                      <div className="relative z-10 bg-slate-950 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                        <ArrowDown className="w-3 h-3 text-white/40" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          {daysUntilNext} Day{daysUntilNext > 1 ? 's' : ''} Break
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Spacer if no gap but not last item (e.g. same day exams) */}
                  {nextExamItem && daysUntilNext === 0 && (
                    <div className="h-4 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-white/5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto text-center pt-8 border-t border-white/5">
          <p className="text-xs text-white/20">
            © 2026 YastecHub • Exam Prep Made with <span className="text-red-400">❤️</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
