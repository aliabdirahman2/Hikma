// A new file created for the Breath Animation
"use client";

import { Flame, Droplets, Wind, Mountain } from "lucide-react";
import { motion } from "framer-motion";

type Symbol = "wind" | "flame" | "water" | "earth";

interface BreathAnimationProps {
  symbol: Symbol;
}

const symbolMap = {
  flame: <Flame className="w-12 h-12 text-primary" />,
  water: <Droplets className="w-12 h-12 text-primary" />,
  wind: <Wind className="w-12 h-12 text-primary" />,
  earth: <Mountain className="w-12 h-12 text-primary" />,
};

export function BreathAnimation({ symbol }: BreathAnimationProps) {
  return (
    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-muted/50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {symbolMap[symbol]}
      </motion.div>
    </div>
  );
}
