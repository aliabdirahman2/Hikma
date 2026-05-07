"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
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
import { useMemo } from "react";

export default function DashboardPage() {
  const [profile] = useLocalStorage<PsychospiritualProfile>(
    "hikma-profile",
    INITIAL_PROFILE
  );

  const dominantShadow = useMemo(() => {
    const s = profile?.shadowBalance || INITIAL_PROFILE.shadowBalance;
    const items = [
      { name: 'Sanguine (Scattered)', val: s.sanguine ?? 0 },
      { name: 'Choleric (Aggressive)', val: s.choleric ?? 0 },
      { name: 'Melancholic (Withdrawn)', val: s.melancholic ?? 0 },
      { name: 'Phlegmatic (Passive)', val: s.phlegmatic ?? 0 },
    ];
    return items.reduce((a, b) => a.val > b.val ? a : b);
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
            <CardTitle className="font-headline text-2xl">Soul Mapping</CardTitle>
            <CardDescription>Visualizing your Primary and Shadow temperaments.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0">
            <TemperamentWheel 
              data={profile?.temperamentBalance || INITIAL_PROFILE.temperamentBalance} 
              shadowData={profile?.shadowBalance || INITIAL_PROFILE.shadowBalance}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <ShieldAlert className="size-5 text-primary" /> The Shadow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">Dominant Shadow: <span className="text-primary">{dominantShadow.name}</span></p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                When you are out of balance, your {dominantShadow.name.split(' ')[0]} element takes over, causing friction in your heart and relationships.
              </p>
            </CardContent>
          </Card>

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
