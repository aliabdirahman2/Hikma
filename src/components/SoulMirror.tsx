"use client";

import { cn } from "@/lib/utils";
import type { PsychospiritualProfile } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";

interface SoulMirrorProps {
  temperamentBalance: PsychospiritualProfile["temperamentBalance"];
  veiledCount: number;
}

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


export function SoulMirror({ temperamentBalance, veiledCount }: SoulMirrorProps) {
  const { sanguine, choleric, melancholic, phlegmatic } = temperamentBalance || INITIAL_PROFILE.temperamentBalance;

  // Calculate imbalance score. A perfectly balanced score is 0. Max possible score is 150.
  const temperamentImbalance =
    Math.abs((sanguine ?? 25) - 25) +
    Math.abs((choleric ?? 25) - 25) +
    Math.abs((melancholic ?? 25) - 25) +
    Math.abs((phlegmatic ?? 25) - 25);
  
  // Normalize score to a 0-1 range for opacity. Capped at 90% opacity for heavy fog.
  const temperamentFog = Math.min(0.9, temperamentImbalance / 150);

  // Moral fog is binary for now. If there's any veiling, the fog is thick.
  const moralFog = (veiledCount ?? 0) > 0 ? 0.75 : 0;

  // The total fog is the greater of the two fogs.
  const fogOpacity = Math.max(temperamentFog, moralFog);

  // The divine light (nur) should only appear when the soul is nearing balance AND is not veiled.
  const isBalanced = temperamentImbalance < 25;
  const isUnveiled = (veiledCount ?? 0) === 0;
  const showNur = isBalanced && isUnveiled;

  // The opacity of the nur should be strongest when perfectly balanced (score of 0)
  // and fade out completely as it approaches the threshold of 25.
  const nurOpacity = showNur ? 1 - (temperamentImbalance / 25) : 0;

  return (
    <div className="relative w-48 h-48 mx-auto my-4" aria-label="A metaphorical mirror reflecting your soul's current state.">
        <MirrorIcon />

        {/* Fog/Dust Overlay */}
        <div
            className="absolute inset-0 w-full h-full rounded-full transition-opacity duration-1000"
            style={{
                background: 'radial-gradient(circle, rgba(200, 200, 190, 0.2) 0%, rgba(150, 150, 140, 0.9) 80%)',
                opacity: fogOpacity,
            }}
            aria-hidden="true"
        />

        {/* Nur (Light) Animation */}
        <div
            className={cn(
                "absolute inset-0 w-full h-full rounded-full transition-opacity duration-1000",
                showNur && 'nur-pulse'
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
