import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Copy, Check, MessageCircle, Sparkles } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { Exam } from "../data";

interface ShareCountdownProps {
  nextExam: Exam | null;
}

export function ShareCountdown({ nextExam }: ShareCountdownProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const getShareMessage = () => {
    const appUrl = "https://premed-exam-countdown.vercel.app/";
    
    if (!nextExam) {
      return `🎉 *WE MADE IT!* 🎉\nSemester is complete! Check out our exams wrap-up and study helper:\n👉 ${appUrl}\n\nWe all won together! 🩺💊🦷🧪`;
    }

    const daysLeft = differenceInCalendarDays(new Date(nextExam.timestamp), new Date());
    const daysText = daysLeft <= 0 ? "today!" : `in *${daysLeft} day${daysLeft > 1 ? "s" : ""}*!`;

    return `🚨 *ATTENTION UNILAG PREMEDS!* 🚨
The second semester battle is here! Let's keep our eyes on that 5.0 CGPA and crush these exams together! 🎓💪🩺

Track all our upcoming exams (GST 112, PHY, CHM, ZOO, BIO, MTH) in real-time and get daily study reminders on your phone:
👉 ${appUrl}

🗓️ *Next Exam:* ${nextExam.course} (${nextExam.title})
⏱️ *Countdown:* Only ${daysText} (${nextExam.date} at ${nextExam.time})
📍 *Venue:* ${nextExam.venue}

Share this with the group. We all win together! 🩺💊🦷🧪
#PremedUnilag #CrushTheSemester`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "Premed Exam Countdown",
        text: getShareMessage(),
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Error sharing: ", err);
        // Fallback to copy if share fails
        handleCopy();
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getShareMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl mb-8"
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-base text-white/90">Invite the Pre-Med Crew</h3>
          </div>
          <p className="text-xs text-white/50 max-w-md">
            Help your friends stay on top of the schedule and daily study reminders. Share the countdown directly to your groups!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* WhatsApp Direct Share */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>

          {/* Native Web Share or Copy */}
          {canShare ? (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-cyan-950/20"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          ) : (
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg ${
                copied
                  ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                  : "bg-white/10 hover:bg-white/15 border border-white/10 text-white"
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Invite"}
            </button>
          )}
        </div>
      </div>

      {/* Copy notification popup */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-500/90 text-white rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xl backdrop-blur-sm flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            Message copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
