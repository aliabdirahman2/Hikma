// A new file created for the Unveiling Heart Animation
"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface UnveilingHeartAnimationProps {
  progress: number; // A value from 0 to 1
}

export function UnveilingHeartAnimation({ progress }: UnveilingHeartAnimationProps) {
  const glowOpacity = progress;
  const crackOpacity = 1 - progress;
  
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      {/* Base Heart */}
      <Heart
        className="w-full h-full text-primary/20"
        fill="hsl(var(--primary) / 0.1)"
      />

      {/* Cracks Overlay */}
      <motion.svg
        viewBox="0 0 24 24"
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 1 }}
        animate={{ opacity: crackOpacity }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <path d="M12.35 8.65 L15 6" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" />
        <path d="M11.65 8.65 L9 6" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" />
        <path d="M10 12 l-2 3" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" />
        <path d="M14 12 l2 3" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" />
        <path d="M12 14 l0 3" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" />
      </motion.svg>
      
      {/* Unveiled Heart with Glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: glowOpacity }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Heart
          className="w-full h-full text-primary"
          fill="hsl(var(--primary))"
          style={{
            filter: `drop-shadow(0 0 ${progress * 15}px hsl(var(--primary) / 0.7))`,
          }}
        />
      </motion.div>
    </div>
  );
}
