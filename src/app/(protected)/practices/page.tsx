"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { TrackedHabit, PsychospiritualProfile } from "@/lib/types";
import { formatISO, startOfToday } from 'date-fns';
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { INITIAL_PROFILE } from "@/lib/constants";

// This function simulates the temperament adjustment.
// It's a placeholder for more complex logic.
const adjustTemperament = (balance: PsychospiritualProfile['temperamentBalance'], habitLabel: string) => {
    let { sanguine, choleric, melancholic, phlegmatic } = balance;
    
    // Define how labels affect temperaments
    const adjustments: Record<string, Partial<typeof balance>> = {
        'Self-Reflection': { sanguine: -2, melancholic: +2 },
        'Grounding': { phlegmatic: +2, choleric: -2 },
        'Devotion': { melancholic: +1, phlegmatic: +1, sanguine: -1, choleric: -1 },
        'Action': { choleric: +2, phlegmatic: -2 },
        'Compassion': { sanguine: +1, phlegmatic: +1, choleric: -2 },
    };

    const adjustment = adjustments[habitLabel] || {};

    sanguine = Math.max(0, sanguine + (adjustment.sanguine || 0));
    choleric = Math.max(0, choleric + (adjustment.choleric || 0));
    melancholic = Math.max(0, melancholic + (adjustment.melancholic || 0));
    phlegmatic = Math.max(0, phlegmatic + (adjustment.phlegmatic || 0));
    
    // Normalize to 100
    const total = sanguine + choleric + melancholic + phlegmatic;
    const s = Math.round((sanguine / total) * 100);
    const c = Math.round((choleric / total) * 100);
    const m = Math.round((melancholic / total) * 100);
    const p = 100 - s - c - m;

    return { sanguine: s, choleric: c, melancholic: m, phlegmatic: p };
};


export default function PracticesPage() {
  const [habits, setHabits] = useLocalStorage<TrackedHabit[]>("hikma-habits", []);
  const [profile, setProfile] = useLocalStorage<PsychospiritualProfile>("hikma-profile", INITIAL_PROFILE);
  const { toast } = useToast();
  const today = formatISO(startOfToday(), { representation: 'date' }); // 'YYYY-MM-DD'

  const handleHabitCheck = (habitId: string, checked: boolean) => {
    setHabits(currentHabits =>
      currentHabits.map(habit => {
        if (habit.id === habitId) {
          const completedToday = habit.completedDates.includes(today);
          let newCompletedDates;
          
          if (checked && !completedToday) {
            newCompletedDates = [...habit.completedDates, today];
            // On completion, adjust temperament and notify user
            const newBalance = adjustTemperament(profile.temperamentBalance, habit.label);
            setProfile(p => ({ ...p, temperamentBalance: newBalance }));
            toast({
              title: "Practice Completed!",
              description: `You've tended to your inner garden. Your temperament has shifted slightly towards greater balance.`,
            });
          } else if (!checked && completedToday) {
            newCompletedDates = habit.completedDates.filter(date => date !== today);
          } else {
            return habit; // No change needed
          }
          return { ...habit, completedDates: newCompletedDates };
        }
        return habit;
      })
    );
  };

  const isCompletedToday = (habit: TrackedHabit) => {
    return habit.completedDates.includes(today);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Leaf className="text-primary size-10" />
        <h1 className="font-headline text-4xl md:text-5xl text-primary">Your Practices</h1>
      </div>
      {habits.length === 0 ? (
        <div className="text-center text-muted-foreground mt-16 px-4 py-12 rounded-lg border-2 border-dashed border-muted-foreground/30">
          <Leaf className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-xl font-headline text-foreground mb-2">Your garden awaits.</p>
          <p>Once you accept a practice from your reflections, it will be planted here to be tended daily.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map(habit => (
            <Card key={habit.id} className={cn("transition-colors duration-300", isCompletedToday(habit) ? 'bg-accent/70 border-primary/60' : 'bg-card')}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                    <Checkbox
                      id={`habit-${habit.id}`}
                      checked={isCompletedToday(habit)}
                      onCheckedChange={(checked) => handleHabitCheck(habit.id, !!checked)}
                      className="size-7"
                    />
                    <div className="grid gap-1 flex-1">
                      <label htmlFor={`habit-${habit.id}`} className="font-semibold text-lg leading-none cursor-pointer">{habit.name}</label>
                      <p className="text-sm text-muted-foreground">{habit.frequency}</p>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="border-l-2 pl-3 italic">
                    {habit.why}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
