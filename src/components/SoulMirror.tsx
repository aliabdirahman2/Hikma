
"use client";

import { cn } from "@/lib/utils";
import type { PsychospiritualProfile } from "@/lib/types";

interface SoulMirrorProps {
  temperamentBalance: PsychospiritualProfile["temperamentBalance"];
}

// A base icon for the mirror itself. A simple grey circle.
const MirrorIcon = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2" />
    </svg>
);


export function SoulMirror({ temperamentBalance }: SoulMirrorProps) {
  const { sanguine, choleric, melancholic, phlegmatic } = temperamentBalance;

  // Calculate imbalance score. Max possible score is 150.
  const imbalanceScore =
    Math.abs(sanguine - 25) +
    Math.abs(choleric - 25) +
    Math.abs(melancholic - 25) +
    Math.abs(phlegmatic - 25);

  // Normalize score to a 0-1 range for opacity. Let's cap max fog at 80% opacity.
  const fogOpacity = Math.min(0.8, (imbalanceScore / 150) * 1.2);

  // Determine if the light 'nur' should pulse. Let's say if imbalance is low.
  const showNur = imbalanceScore < 40; // less than ~25% imbalance

  return (
    <div className="relative w-48 h-48 mx-auto my-4" aria-label="A metaphorical mirror reflecting your soul's current state.">
        <MirrorIcon />

        {/* Fog/Dust Overlay */}
        <div
            className="absolute inset-0 w-full h-full rounded-full transition-opacity duration-1000"
            style={{
                background: 'radial-gradient(circle, rgba(245,245,220,0.1) 0%, rgba(245,245,220,0.8) 70%)',
                opacity: fogOpacity,
            }}
            aria-hidden="true"
        />

        {/* Nur (Light) Animation */}
        {showNur && (
            <div
                className="absolute inset-0 w-full h-full rounded-full nur-pulse"
                style={{
                    boxShadow: '0 0 20px 5px hsl(var(--accent)), 0 0 40px 15px hsl(var(--primary) / 0.5)',
                    opacity: 1 - (imbalanceScore / 40) * 0.7, // light is stronger when more balanced
                }}
                aria-hidden="true"
            />
        )}
    </div>
  );
}
