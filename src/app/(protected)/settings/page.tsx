"use client";

import React from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { PsychospiritualProfile } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SlidersHorizontal, Info } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useLocalStorage<PsychospiritualProfile>("hikma-profile", INITIAL_PROFILE);

  const handleDepthChange = (val: number[]) => {
    setProfile(prev => ({ ...prev, hikmaDepth: val[0] }));
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-headline text-4xl text-primary mb-8">Settings</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="text-primary size-6" />
            <CardTitle className="font-headline text-2xl">Hikma Depth</CardTitle>
          </div>
          <CardDescription>Adjust how rigorously the AI challenges your shadows.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-4">
          <div className="space-y-6">
            <div className="flex justify-between text-sm font-medium">
              <span>Supportive & Affirming</span>
              <span>Rigorous & Unveiling</span>
            </div>
            <Slider 
              value={[profile.hikmaDepth]} 
              onValueChange={handleDepthChange} 
              max={100} 
              step={1} 
              className="py-4"
            />
            <div className="text-center font-headline text-xl text-primary">
              Current Depth: {profile.hikmaDepth}%
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg flex gap-3 text-sm italic">
            <Info className="size-5 shrink-0 text-primary" />
            <p>
              {profile.hikmaDepth < 30 && "Hikma will focus on affirmation and gentle encouragement."}
              {profile.hikmaDepth >= 30 && profile.hikmaDepth < 70 && "Hikma will balance support with occasional probing questions."}
              {profile.hikmaDepth >= 70 && "Hikma will actively hunt for veils and challenge surface-level sincerity."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
