"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { TrackedHabit } from "@/lib/types";
import { formatISO, startOfToday } from 'date-fns';
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function HabitTracker() {
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
     <div className="p-4 h-full">
        <div className="flex items-center gap-2 mb-6 p-2">
            <Leaf className="text-primary"/>
            <h2 className="font-headline text-2xl text-primary">Your Practices</h2>
        </div>
        {habits.length === 0 ? (
          <div className="text-center text-muted-foreground mt-20 px-4">
            <p className="text-lg">This is your garden.</p>
            <p>Once you accept a practice from your reflections, it will be planted here to be tended daily.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map(habit => (
              <Card key={habit.id} className={cn("transition-colors", isCompletedToday(habit) ? 'bg-accent/50 border-primary/50' : '')}>
                <CardContent className="p-4 flex items-center space-x-4">
                  <Checkbox 
                    id={`habit-${habit.id}`} 
                    checked={isCompletedToday(habit)}
                    onCheckedChange={(checked) => handleHabitCheck(habit.id, !!checked)}
                    className="size-6"
                  />
                  <div className="grid gap-0.5">
                      <label htmlFor={`habit-${habit.id}`} className="font-semibold leading-none cursor-pointer">{habit.name}</label>
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
