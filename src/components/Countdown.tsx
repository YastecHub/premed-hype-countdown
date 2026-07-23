import { useEffect, useState } from "react";
import { differenceInSeconds, intervalToDuration } from "date-fns";
import { motion } from "motion/react";

interface CountdownProps {
  targetDate: string;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const target = new Date(targetDate);
  const diffSeconds = Math.max(0, differenceInSeconds(target, now));
  
  const totalDays = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  const timeUnits = [
    { label: "DAYS", value: pad(totalDays) },
    { label: "HRS", value: pad(hours) },
    { label: "MINS", value: pad(minutes) },
    { label: "SECS", value: pad(seconds) },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-2xl mx-auto my-6">
      {timeUnits.map((unit, i) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, type: "spring" }}
          className="flex flex-col items-center"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-3 md:p-6 w-full flex items-center justify-center">
              <span className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 font-mono tracking-tighter">
                {unit.value}
              </span>
            </div>
          </div>
          <span className="text-[10px] md:text-xs font-bold text-cyan-400/80 mt-2 tracking-[0.2em]">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
