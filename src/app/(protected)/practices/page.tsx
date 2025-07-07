
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { TrackedHabit } from "@/lib/types";
import { formatISO, startOfToday } from 'date-fns';
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PracticesPage() {
  const [habits, setHabits] = useLocalStorage<TrackedHabit[]>("hikma-habits", []);
  const today = formatISO(startOfToday(), { representation: 'date' }); // 'YYYY-MM-DD'

  const handleHabitCheck = (habitId: string, checked: boolean) => {
    setHabits(currentHabits =>
      currentHabits.map(habit => {
        if (habit.id === habitId) {
          const completedToday = habit.completedDates.includes(today);
          let newCompletedDates;
          if (checked && !completedToday) {
            newCompletedDates = [...habit.completedDates, today];
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
              <CardContent className="p-5 flex items-center space-x-4">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
