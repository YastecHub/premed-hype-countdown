import { motion } from "motion/react";
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { Exam } from "../data";
import { isPast, isToday } from "date-fns";

interface ExamCardProps {
  exam: Exam;
  status: "completed" | "next" | "upcoming";
  index: number;
}

export function ExamCard({ exam, status, index }: ExamCardProps) {
  const isNext = status === "next";
  const isCompleted = status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl p-5 border transition-all duration-300",
        isNext
          ? "bg-white/5 border-cyan-500/50 shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)]"
          : isCompleted
          ? "bg-black/20 border-white/5 opacity-60 grayscale-[0.5]"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      )}
    >
      {isNext && (
        <div className="absolute -top-3 right-4">
          <span className="relative flex h-6 w-24">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-6 w-24 bg-cyan-500/20 border border-cyan-500/50 items-center justify-center">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Next Up
              </span>
            </span>
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={cn(
            "text-2xl font-bold tracking-tight",
            isNext ? "text-white" : "text-white/80"
          )}>
            {exam.course}
          </h3>
          <p className="text-sm text-white/40 font-medium">First Semester Exam</p>
        </div>
        {isCompleted && <CheckCircle2 className="text-emerald-500 w-6 h-6" />}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className={cn("p-2 rounded-lg", isNext ? "bg-cyan-500/10" : "bg-white/5")}>
            <Calendar className={cn("w-4 h-4", isNext ? "text-cyan-400" : "text-white/60")} />
          </div>
          <span className="text-white/80">{exam.date}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className={cn("p-2 rounded-lg", isNext ? "bg-cyan-500/10" : "bg-white/5")}>
            <Clock className={cn("w-4 h-4", isNext ? "text-cyan-400" : "text-white/60")} />
          </div>
          <span className="text-white/80">{exam.time}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className={cn("p-2 rounded-lg", isNext ? "bg-cyan-500/10" : "bg-white/5")}>
            <MapPin className={cn("w-4 h-4", isNext ? "text-cyan-400" : "text-white/60")} />
          </div>
          <span className="text-white/80">{exam.venue}</span>
        </div>
      </div>
    </motion.div>
  );
}
