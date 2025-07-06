"use client";

import type { GenerateReflectionOutput } from "@/ai/flows/generate-reflection";
import type { SoulStage, Temperament } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";
import {
  FlameIcon,
  MoonIcon,
  TreeIcon,
  WindIcon,
  WaterIcon,
  EarthIcon,
} from "./icons";

interface ReflectionDisplayProps {
  reflection: GenerateReflectionOutput;
  soulStage: SoulStage;
  temperament: Temperament;
}

const soulStageIcons: Record<SoulStage, React.ElementType> = {
  "nafs al-ammarah": FlameIcon,
  lawwamah: MoonIcon,
  "mutma’innah": TreeIcon,
};

const temperamentIcons: Record<Temperament, React.ElementType> = {
  Sanguine: WindIcon,
  Choleric: FlameIcon,
  Melancholic: EarthIcon,
  Phlegmatic: WaterIcon,
};

export function ReflectionDisplay({
  reflection,
  soulStage,
  temperament,
}: ReflectionDisplayProps) {
  const SoulStageIcon = soulStageIcons[soulStage];
  const TemperamentIcon = temperamentIcons[temperament];

  return (
    <div className="w-full text-center my-8 animate-in fade-in duration-1000">
      <h1 className="font-headline text-4xl md:text-5xl text-primary mb-4">
        A Mirror for Your Soul
      </h1>
      <div className="flex justify-center items-center gap-4 text-muted-foreground my-6">
        <div className="flex items-center gap-2" title={`Soul Stage: ${soulStage}`}>
          <SoulStageIcon className="w-5 h-5 text-accent" />
          <span className="text-sm capitalize font-headline">{soulStage.replace('nafs al-', '')}</span>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2" title={`Temperament: ${temperament}`}>
          <TemperamentIcon className="w-5 h-5 text-accent" />
          <span className="text-sm font-headline">{temperament}</span>
        </div>
      </div>
      <Card className="mt-6 text-left bg-card/50 border-accent/20 shadow-lg">
        <CardContent className="p-8 md:p-12">
          <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
            {reflection.reflection}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-6 p-8 md:p-12 pt-0 bg-muted/30 rounded-b-lg">
          <div>
            <h3 className="font-headline text-sm tracking-widest text-muted-foreground uppercase mb-2">
              Wisdom Seed
            </h3>
            <p className="text-lg italic text-accent-foreground">
              {reflection.wisdomSeed}
            </p>
          </div>
          {reflection.dhikr && (
            <div>
              <h3 className="font-headline text-sm tracking-widest text-muted-foreground uppercase mb-2">
                Dhikr (Remembrance)
              </h3>
              <p className="text-lg font-medium text-accent-foreground">
                {reflection.dhikr}
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
