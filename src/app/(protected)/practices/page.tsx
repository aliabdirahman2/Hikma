"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { TrackedHabit, PsychospiritualProfile } from "@/lib/types";
import { formatISO, startOfToday } from 'date-fns';
import { Leaf, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { INITIAL_PROFILE } from "@/lib/constants";
import { motion } from "framer-motion";

export default function PracticesPage() {
  const [habits, setHabits] = useLocalStorage<TrackedHabit[]>("hikma-habits", []);
  const [profile, setProfile] = useLocalStorage<PsychospiritualProfile>("hikma-profile", INITIAL_PROFILE);
  const { toast } = useToast();
  const today = formatISO(startOfToday(), { representation: 'date' });

  const handleHabitCheck = (habitId: string, checked: boolean) => {
    setHabits(currentHabits =>
      currentHabits.map(habit => {
        if (habit.id === habitId) {
          const completedToday = habit.completedDates.includes(today);
          let newCompletedDates;
          
          if (checked && !completedToday) {
            newCompletedDates = [...habit.completedDates, today];
            toast({ title: "Practice Completed", description: "You've tended to your inner garden." });
          } else if (!checked && completedToday) {
            newCompletedDates = habit.completedDates.filter(date => date !== today);
          } else {
            return habit;
          }
          return { ...habit, completedDates: newCompletedDates };
        }
        return habit;
      })
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Leaf className="text-primary size-10" />
        <h1 className="font-headline text-4xl text-primary">Sacred Practices</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl mb-4">Daily Garden</h2>
          {habits.length === 0 ? (
            <p className="text-muted-foreground italic">Your garden is empty. Complete a reflection to plant a practice.</p>
          ) : (
            habits.map(habit => (
              <Card key={habit.id} className={cn("transition-all", habit.completedDates.includes(today) ? 'bg-primary/5' : '')}>
                <CardHeader className="p-4 flex-row items-center gap-4 space-y-0">
                  <Checkbox 
                    checked={habit.completedDates.includes(today)}
                    onCheckedChange={(c) => handleHabitCheck(habit.id, !!c)}
                    className="size-6"
                  />
                  <div>
                    <CardTitle className="text-lg">{habit.name}</CardTitle>
                    <CardDescription>{habit.frequency}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <h2 className="font-headline text-2xl mb-4">Methodology</h2>
          <Card className="border-accent/40 overflow-hidden">
            <CardHeader className="bg-accent/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="size-5" /> Visual Guide: Box Breathing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-8">
                <div className="relative size-32 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1.2, 1, 1],
                      x: [0, 0, 40, 40, 0],
                      y: [0, -40, -40, 0, 0]
                    }}
                    transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                    className="size-4 bg-primary rounded-full absolute"
                  />
                  <div className="text-[10px] text-center font-bold text-muted-foreground p-2 leading-tight">
                    In (4s)<br/>Hold (4s)<br/>Out (4s)<br/>Hold (4s)
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Box breathing is a powerful tool to reset the Phlegmatic (Water) element when the Choleric (Fire) becomes excessive. Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The Sincere Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To move from "veiled" to "unveiled," focus on sensory details. Instead of "I am angry," try "My chest feels hot and I am clenching my jaw." SeekHikma responds to physical presence.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
