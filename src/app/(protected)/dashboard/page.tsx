"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert, Sparkles, Info, Sun, RotateCw } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { PsychospiritualProfile } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { TemperamentWheel } from "@/components/TemperamentWheel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PRIMARY_ITEMS = [
  { 
    id: 'sanguine', 
    name: 'Sanguine (Air)', 
    key: 'sanguine' as const,
    desc: "Air in balance grants clarity, social warmth, and creative vision. You inspire movement in others and see patterns others miss." 
  },
  { 
    id: 'choleric', 
    name: 'Choleric (Fire)', 
    key: 'choleric' as const,
    desc: "Fire in balance becomes courageous leadership and transformative warmth. You channel passion into purposeful action and protect those you care for." 
  },
  { 
    id: 'melancholic', 
    name: 'Melancholic (Earth)', 
    key: 'melancholic' as const,
    desc: "Earth in balance provides deep introspection, patience, and structural wisdom. You offer grounding presence and see the long arc of things." 
  },
  { 
    id: 'phlegmatic', 
    name: 'Phlegmatic (Water)', 
    key: 'phlegmatic' as const,
    desc: "Water in balance flows as genuine empathy, adaptability, and healing calm. You absorb the storms of others and reflect back their own peace." 
  },
];

const SHADOW_ITEMS = [
  { 
    id: 'sanguine', 
    name: 'Sanguine (Scattered)', 
    key: 'sanguine' as const,
    desc: "High Air in shadow leads to a loss of focus. You become a 'floating leaf,' easily distracted and unable to ground your vision into reality." 
  },
  { 
    id: 'choleric', 
    name: 'Choleric (Aggressive)', 
    key: 'choleric' as const,
    desc: "Excessive Fire turns to anger. You may find yourself burning bridges or using force where gentle heat was required." 
  },
  { 
    id: 'melancholic', 
    name: 'Melancholic (Withdrawn)', 
    key: 'melancholic' as const,
    desc: "Dense Earth turns to stubbornness or despair. You may feel stuck in the past, unable to shift your perspective even when it causes you pain." 
  },
  { 
    id: 'phlegmatic', 
    name: 'Phlegmatic (Passive)', 
    key: 'phlegmatic' as const,
    desc: "Stagnant Water leads to suppression. You become 'too easy to mess with,' allowing others to override your will. This causes you to suppress your true desires, which later resurfaces as deep-seated resentment or physical fatigue." 
  },
];

export default function DashboardPage() {
  const [profile] = useLocalStorage<PsychospiritualProfile>(
    "hikma-profile",
    INITIAL_PROFILE
  );
  const [isFlipped, setIsFlipped] = useState(false);

  const dominantPrimary = useMemo(() => {
    const t = profile?.temperamentBalance || INITIAL_PROFILE.temperamentBalance;
    return PRIMARY_ITEMS.map(item => ({ ...item, val: t[item.key] ?? 0 }))
      .reduce((a, b) => a.val > b.val ? a : b);
  }, [profile]);

  const dominantShadow = useMemo(() => {
    const s = profile?.shadowBalance || INITIAL_PROFILE.shadowBalance;
    return SHADOW_ITEMS.map(item => ({ ...item, val: s[item.key] ?? 0 }))
      .reduce((a, b) => a.val > b.val ? a : b);
  }, [profile]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">
          The Inner Horizon
        </h1>
        <p className="text-lg text-muted-foreground italic">
          &ldquo;{profile?.soulStage || "Seeker of Wisdom"}&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">Soul Mapping</CardTitle>
                <CardDescription>Visualizing your Primary and Shadow temperaments.</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p><strong>Primary (Color)</strong>: Your active energetic focus. When balanced (I'tidal), these traits serve your purpose.</p>
                    <p className="mt-2"><strong>Shadow (Grey)</strong>: The Nafs (egoic) distortion. These represent where energy is excessive or stagnant.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0">
            <TemperamentWheel 
              data={profile?.temperamentBalance || INITIAL_PROFILE.temperamentBalance} 
              shadowData={profile?.shadowBalance || INITIAL_PROFILE.shadowBalance}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Flippable Primary / Shadow Card */}
          <div 
            className="flip-card cursor-pointer group"
            style={{ perspective: '1000px' }}
            onClick={() => setIsFlipped(prev => !prev)}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? "Showing Shadow state. Click to show Primary state." : "Showing Primary state. Click to show Shadow state."}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(prev => !prev); }}}
          >
            <div 
              className="flip-card-inner w-full transition-transform duration-700"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                display: 'grid',
              }}
            >
              {/* FRONT — Primary State */}
              <div style={{ backfaceVisibility: 'hidden', gridArea: '1 / 1' }}>
                <Card className="h-full border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <Sun className="size-5 text-primary" /> Primary State
                      </CardTitle>
                      <RotateCw className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium">Dominant: <span className="text-primary">{dominantPrimary.name}</span></p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">
                      {dominantPrimary.desc}
                    </p>
                    <p className="text-xs text-muted-foreground mt-4 border-t border-primary/15 pt-2 flex items-center gap-1">
                      <RotateCw className="size-3 inline" /> Tap to reveal the Shadow
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* BACK — Shadow State */}
              <div 
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', gridArea: '1 / 1' }}
              >
                <Card className="h-full border-destructive/20 bg-gradient-to-br from-muted/80 to-muted/40 hover:border-destructive/40 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <ShieldAlert className="size-5 text-destructive" /> The Shadow
                      </CardTitle>
                      <RotateCw className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium">Dominant Shadow: <span className="text-destructive">{dominantShadow.name}</span></p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">
                      {dominantShadow.desc}
                    </p>
                    <p className="text-xs text-muted-foreground mt-4 border-t border-destructive/15 pt-2 flex items-center gap-1">
                      <RotateCw className="size-3 inline" /> Tap to return to Primary
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Sparkles className="size-5 text-primary" /> SeekHikma Depth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span>Current Depth</span>
                <span className="font-bold text-primary">{profile?.hikmaDepth ?? 50}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${profile?.hikmaDepth ?? 50}%` }} 
                />
              </div>
            </CardContent>
          </Card>

          <Button asChild className="w-full font-headline text-xl h-16">
            <Link href="/reflect">
              Begin Reflection <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
