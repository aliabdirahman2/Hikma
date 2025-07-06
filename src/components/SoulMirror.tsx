"use client";

import { cn } from "@/lib/utils";
import type { PsychospiritualProfile } from "@/lib/types";

interface SoulMirrorProps {
  temperamentBalance: PsychospiritualProfile["temperamentBalance"];
}

// A base icon for the mirror itself. A darker, more polished stone look.
const MirrorIcon = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
         <defs>
            <radialGradient id="mirrorGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#4A5568', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#2D3748', stopOpacity: 1}} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#mirrorGradient)" stroke="#1A202C" strokeWidth="2" />
    </svg>
);


export function SoulMirror({ temperamentBalance }: SoulMirrorProps) {
  const { sanguine, choleric, melancholic, phlegmatic } = temperamentBalance;

  // Calculate imbalance score. A perfectly balanced score is 0. Max possible score is 150.
  const imbalanceScore =
    Math.abs(sanguine - 25) +
    Math.abs(choleric - 25) +
    Math.abs(melancholic - 25) +
    Math.abs(phlegmatic - 25);

  // Normalize score to a 0-1 range for opacity. Capped at 90% opacity for heavy fog.
  const fogOpacity = Math.min(0.9, imbalanceScore / 150);

  // The divine light (nur) should only appear when the soul is nearing balance.
  // We'll set a much stricter threshold of 25.
  const showNur = imbalanceScore < 25;

  // The opacity of the nur should be strongest when perfectly balanced (score of 0)
  // and fade out completely as it approaches the threshold of 25.
  const nurOpacity = showNur ? 1 - (imbalanceScore / 25) : 0;

  return (
    <div className="relative w-48 h-48 mx-auto my-4" aria-label="A metaphorical mirror reflecting your soul's current state.">
        <MirrorIcon />

        {/* Fog/Dust Overlay */}
        <div
            className="absolute inset-0 w-full h-full rounded-full transition-opacity duration-1000"
            style={{
                // A neutral, dusty fog
                background: 'radial-gradient(circle, rgba(200, 200, 190, 0.2) 0%, rgba(150, 150, 140, 0.9) 80%)',
                opacity: fogOpacity,
            }}
            aria-hidden="true"
        />

        {/* Nur (Light) Animation */}
        <div
            className={cn(
                "absolute inset-0 w-full h-full rounded-full transition-opacity duration-1000",
                showNur && 'nur-pulse' // Apply pulse animation only when light is visible
            )}
            style={{
                boxShadow: '0 0 25px 8px hsl(var(--accent)), 0 0 50px 20px hsl(var(--primary) / 0.6)',
                opacity: nurOpacity,
            }}
            aria-hidden="true"
        />
    </div>
  );
}
