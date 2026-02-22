import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { QUOTES } from "../data";

export function QuoteTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-16 flex items-center justify-center overflow-hidden relative w-full max-w-lg mx-auto px-4">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center text-cyan-200/90 font-medium text-sm md:text-base italic tracking-wide absolute w-full"
        >
          "{QUOTES[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
