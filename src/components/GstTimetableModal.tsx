import { motion } from "motion/react";
import { X, Calendar, GraduationCap, CheckCircle2 } from "lucide-react";
import { PREMED_COURSES } from "../data";
import { cn } from "../lib/utils";

interface GstTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: string;
  onSelectCourse: (course: string) => void;
}

export function GstTimetableModal({
  isOpen,
  onClose,
  selectedCourse,
  onSelectCourse
}: GstTimetableModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-xl z-10 overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Glow Elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">GST 112 Exam Timetable</h2>
              <p className="text-xs text-white/50">Official Timetable • Second Semester Exam</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1 relative z-10 flex-1 space-y-4">
          <p className="text-xs text-white/60 leading-relaxed">
            Select your department/course below to automatically update your exam card dates, times, venues, countdowns, and notifications schedule.
          </p>

          <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/25">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/45">
                    <th className="px-4 py-3">Dept / Course</th>
                    <th className="px-4 py-3">Exam Date & Time</th>
                    <th className="px-4 py-3">Venue</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {PREMED_COURSES.map((course) => {
                    const isSelected = course.name === selectedCourse;
                    return (
                      <tr
                        key={course.name}
                        onClick={() => onSelectCourse(course.name)}
                        className={cn(
                          "group cursor-pointer transition-colors duration-150 hover:bg-white/5",
                          isSelected ? "bg-cyan-500/10" : ""
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <GraduationCap className={cn("w-4 h-4 shrink-0", isSelected ? "text-cyan-400" : "text-white/40")} />
                              <span className={cn("text-xs font-bold", isSelected ? "text-cyan-300" : "text-white/80 group-hover:text-white")}>
                                {course.name}
                              </span>
                            </div>
                            <span className="text-[9px] text-white/30 ml-6 italic">{course.faculty}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className={cn("text-xs font-semibold", isSelected ? "text-white" : "text-white/70")}>
                              {course.gstDate}, 2026
                            </span>
                            <span className="text-[10px] text-white/40">{course.gstTime}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-medium", isSelected ? "text-cyan-400" : "text-white/60")}>
                            {course.gstVenue}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-white/40 group-hover:text-cyan-400 transition-colors uppercase tracking-wider">
                              Select
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-end gap-2 relative z-10 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
