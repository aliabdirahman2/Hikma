"use client";
import React, { useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Wind, Droplets, Mountain, Flame, Loader2, PlusCircle, Leaf } from "lucide-react";
import { reflectionAction } from "@/app/actions";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { FullReflection, PsychospiritualProfile, TrackedHabit, PrescribedHabit } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Symbol = "wind" | "flame" | "water" | "earth";

const symbolMap: Record<Symbol, { icon: ReactElement; label: string }> = {
  wind: { icon: <Wind className="w-10 h-10" />, label: "Wind (Air)" },
  flame: { icon: <Flame className="w-10 h-10" />, label: "Flame (Fire)" },
  water: { icon: <Droplets className="w-10 h-10" />, label: "Water (Water)" },
  earth: { icon: <Mountain className="w-10 h-10" />, label: "Earth (Earth)" },
};

export default function ReflectionPage() {
  const [step, setStep] = useState<"symbol" | "journal" | "reflection">("symbol");
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);
  const [journalText, setJournalText] = useState("");
  const [reflection, setReflection] = useState<FullReflection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useLocalStorage<PsychospiritualProfile>("hikma-profile", INITIAL_PROFILE);
  const [habits, setHabits] = useLocalStorage<TrackedHabit[]>("hikma-habits", []);
  const { toast } = useToast();

  const handleSymbolSelect = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    setStep("journal");
  };

  const handleAcceptHabit = (habit: PrescribedHabit) => {
    if (habits.some(h => h.name === habit.name)) {
        toast({
            variant: "default",
            title: "Practice Already Accepted",
            description: `You are already tracking "${habit.name}".`,
        });
        return;
    }

    const newHabit: TrackedHabit = {
        ...habit,
        id: new Date().toISOString() + Math.random(),
        createdAt: new Date().toISOString(),
        completedDates: [],
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
    toast({
        title: "Practice Accepted",
        description: `"${habit.name}" has been added to your journey.`,
    });
  };

  const handleSubmit = async () => {
    if (!selectedSymbol || !journalText) return;
    setIsLoading(true);

    try {
      const result = await reflectionAction({
        symbol: selectedSymbol,
        journal: journalText,
        previousProfile: profile,
      });
      setReflection(result);
      setProfile({
        soulStage: result.soulStage,
        temperamentBalance: result.temperamentBalance,
      });
      setStep("reflection");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not get a reflection. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 min-h-[calc(100vh-150px)] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === "symbol" && (
          <motion.div key="symbol" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }}>
            <h1 className="font-headline text-3xl md:text-4xl text-center mb-4 text-primary">A Symbolic Prompt</h1>
            <p className="text-muted-foreground text-center text-lg mb-10">Choose the image that feels closest to your state today.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(Object.keys(symbolMap) as Symbol[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSymbolSelect(key)}
                  className="group aspect-square flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg border-2 border-transparent hover:border-primary hover:bg-accent transition-all duration-300"
                >
                  <div className="text-primary transition-transform duration-300 group-hover:scale-110">{symbolMap[key].icon}</div>
                  <p className="font-headline text-lg mt-4 text-muted-foreground group-hover:text-primary transition-colors">{symbolMap[key].label}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "journal" && (
          <motion.div key="journal" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }}>
            <h1 className="font-headline text-3xl md:text-4xl text-center mb-4 text-primary">Speak Your Heart</h1>
            <p className="text-muted-foreground text-center text-lg mb-8">What tension, regret, or contradiction is present for you?</p>
            <Textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="The truth of your heart is a sacred text..."
              rows={8}
              className="text-lg"
              disabled={isLoading}
            />
            <div className="mt-8 flex justify-center">
              <Button onClick={handleSubmit} size="lg" disabled={isLoading || !journalText.trim()}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Receive Reflection
              </Button>
            </div>
          </motion.div>
        )}
        
        {step === "reflection" && reflection && (
          <motion.div key="reflection" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }}>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary"><Wand2/>Poetic Reflection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg italic whitespace-pre-wrap leading-relaxed">&ldquo;{reflection.poeticReflection}&rdquo;</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Probing Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-base">
                    {reflection.probingQuestions.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                   <CardHeader>
                    <CardTitle className="font-headline text-xl">Wisdom Seed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{reflection.wisdomSeed}</p>
                  </CardContent>
                </Card>
                {reflection.optionalPrompt && (
                  <Card>
                     <CardHeader>
                      <CardTitle className="font-headline text-xl">Inner Practice</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{reflection.optionalPrompt}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {reflection.prescribedHabits && reflection.prescribedHabits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary"><Leaf />Prescriptions of the Self</CardTitle>
                    <CardDescription>Gentle invitations to practice, based on your reflection.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reflection.prescribedHabits.map((habit, i) => (
                      <div key={i} className="p-4 rounded-lg border bg-muted/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-semibold">{habit.name} <span className="ml-2 text-xs font-normal text-muted-foreground bg-accent px-2 py-0.5 rounded-full">{habit.label}</span></h4>
                          <p className="text-sm text-muted-foreground italic mt-1">&ldquo;{habit.why}&rdquo;</p>
                          <p className="text-sm font-medium mt-2">Practice: {habit.frequency}</p>
                        </div>
                        <Button onClick={() => handleAcceptHabit(habit)} className="sm:ml-4 flex-shrink-0">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Accept Practice
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

               <div className="mt-8 flex justify-center">
                 <Button onClick={() => setStep('symbol')} size="lg" variant="outline">
                   Begin a New Reflection <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
