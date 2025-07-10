"use client";

import Link from "next/link";
import { ArrowRight, Leaf, CheckCircle2 } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { PsychospiritualProfile, TrackedHabit } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { TemperamentWheel } from "@/components/TemperamentWheel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { startOfToday, formatISO } from "date-fns";
import { useMemo } from "react";

function getTemperamentSuggestion(balance: PsychospiritualProfile['temperamentBalance']) {
    const temperaments = [
        { name: 'Sanguine (Air)', value: balance.sanguine, ideal: 25, suggestion: "Your social, optimistic nature is a gift. To find deeper balance, consider practices of quiet contemplation to temper scattered energy with focus." },
        { name: 'Choleric (Fire)', value: balance.choleric, ideal: 25, suggestion: "Your drive and passion are powerful forces. To find deeper balance, consider practices of patience and compassion to temper ambition with mercy." },
        { name: 'Melancholic (Earth)', value: balance.melancholic, ideal: 25, suggestion: "Your depth and thoughtfulness are profound. To find deeper balance, consider practices of gratitude and joyful action to temper introspection with lightness." },
        { name: 'Phlegmatic (Water)', value: balance.phlegmatic, ideal: 25, suggestion: "Your peaceful nature is a balm. To find deeper balance, consider practices of intentional action and new challenges to temper passivity with gentle resolve." },
    ];

    const mostDominant = temperaments.reduce((max, t) => t.value > max.value ? t : max);
    
    // Only show a suggestion if one temperament is significantly higher than the others.
    if(mostDominant.value > 35) {
        return mostDominant;
    }
    return null;
}


export default function DashboardPage() {
  const { user } = useAuth();
  const [profile] = useLocalStorage<PsychospiritualProfile>(
    "hikma-profile",
    INITIAL_PROFILE
  );
  const [habits] = useLocalStorage<TrackedHabit[]>("hikma-habits", []);

  const today = formatISO(startOfToday(), { representation: 'date' });
  const allHabitsCompletedToday = useMemo(() => {
    if (habits.length === 0) return true; // No habits to complete
    return habits.every(h => h.completedDates.includes(today));
  }, [habits, today]);

  const temperamentSuggestion = useMemo(() => getTemperamentSuggestion(profile.temperamentBalance), [profile.temperamentBalance]);


  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">
          The Inner Horizon
        </h1>
        <p className="text-lg text-muted-foreground">
          Observe the landscape of your soul.
        </p>
      </div>

       {!allHabitsCompletedToday && (
         <Card className="mb-8 bg-accent/50 border-accent-foreground/30">
            <CardHeader className="flex-row items-center gap-4">
                <Leaf className="size-8 text-primary" />
                <div>
                    <CardTitle className="font-headline text-xl">Tend to Your Garden</CardTitle>
                    <CardDescription>Your daily practices await. A small step today cultivates the soul of tomorrow.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                 <Button asChild>
                    <Link href="/practices">Complete Your Practices <ArrowRight className="ml-2"/></Link>
                </Button>
            </CardContent>
         </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-1 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Current Soul Stage
            </CardTitle>
            <CardDescription>
              A poetic sense of your place.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center text-center">
            <p className="text-2xl italic text-primary">
              &ldquo;{profile.soulStage}&rdquo;
            </p>
          </CardContent>
           {temperamentSuggestion && (
             <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
                <p className="font-bold text-primary">An Invitation to Balance</p>
                <p className="text-muted-foreground">{temperamentSuggestion.suggestion}</p>
             </CardFooter>
           )}
        </Card>

        <Card className="md:col-span-2 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Temperament Balance
            </CardTitle>
            <CardDescription>
              Your unique blend of inner elements.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center min-h-[250px] md:min-h-[300px]">
            <TemperamentWheel data={profile.temperamentBalance} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 flex justify-center">
        <Button asChild size="lg" className="font-headline text-xl py-8 px-10">
          <Link href="/reflect">
            Begin Reflection <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
