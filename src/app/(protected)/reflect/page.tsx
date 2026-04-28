"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Wind, Droplets, Mountain, Flame, Loader2, MessageCircle, AlertTriangle, BookOpen, Heart, BookHeart, Check, Plus, Users, Send } from "lucide-react";
import { reflectionAction } from "@/app/actions";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { FullReflection, PsychospiritualProfile, ArchivedReflection, Message, TrackedHabit, PrescribedHabit, TemperamentBalance } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ChatWithHikma } from "@/components/ChatWithHikma";
import { UnveilingChat } from "@/components/UnveilingChat";
import { TemperamentWheel } from "@/components/TemperamentWheel";

const symbols = [
  { id: 'wind', icon: <Wind className="w-10 h-10" />, label: 'Wind (Air)' },
  { id: 'flame', icon: <Flame className="w-10 h-10" />, label: 'Flame (Fire)' },
  { id: 'water', icon: <Droplets className="w-10 h-10" />, label: 'Water (Water)' },
  { id: 'earth', icon: <Mountain className="w-10 h-10" />, label: 'Earth (Earth)' },
] as const;

type Symbol = typeof symbols[number]['id'];

export default function ReflectionPage() {
  const [step, setStep] = useState<"symbol" | "journal" | "diagnostic" | "reflection" | "veiled">("symbol");
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);
  const [journalText, setJournalText] = useState("");
  const [diagnosticAnswers, setDiagnosticAnswers] = useState("");
  const [reflection, setReflection] = useState<FullReflection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnveilingTransition, setIsUnveilingTransition] = useState(false);
  const [veiledChat, setVeiledChat] = useState(false);
  const [profile, setProfile] = useLocalStorage<PsychospiritualProfile>("hikma-profile", INITIAL_PROFILE);
  const [archive, setArchive] = useLocalStorage<ArchivedReflection[]>("hikma-archive", []);
  const [habits, setHabits] = useLocalStorage<TrackedHabit[]>("hikma-habits", []);
  const { toast } = useToast();

  const handleSymbolSelect = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    setStep("journal");
  };

  const handleAddHabit = (habit: PrescribedHabit) => {
    const newHabit: TrackedHabit = {
        ...habit,
        id: `${Date.now()}-${habit.name.replace(/\s/g, '')}`,
        createdAt: new Date().toISOString(),
        completedDates: [],
    };
    setHabits(currentHabits => [...currentHabits, newHabit]);
    toast({ title: "Practice Added", description: `"${habit.name}" has been added to your daily practices.` });
  };

  const isHabitTracked = (habitName: string) => habits.some(h => h.name === habitName);

  const handleSubmit = async (diagAnswers?: string, unveilingHistory?: Message[]) => {
    if (!selectedSymbol || !journalText) return;
    setIsLoading(true);

    try {
      const result = await reflectionAction({
        symbol: selectedSymbol,
        journal: journalText,
        previousProfile: profile,
        conflictDiagnosticAnswers: diagAnswers,
        unveilingHistory: unveilingHistory,
      });

      if (result.isVeiled && !unveilingHistory) {
        setReflection(result);
        setProfile(p => ({ ...p, veiledCount: p.veiledCount + 1 }));
        setStep("veiled");
      } else if (result.isConflictDetected && result.diagnosticQuestions && !diagAnswers) {
        setReflection(result);
        setStep("diagnostic");
      } else {
        setReflection(result);
        if (result.soulStage && result.temperamentBalance) {
            setProfile({
                soulStage: result.soulStage,
                temperamentBalance: result.temperamentBalance,
                veiledCount: 0,
            });
            const newArchiveEntry: ArchivedReflection = {
                date: new Date().toISOString(),
                reflection: result,
                journal: journalText,
                symbol: selectedSymbol,
            };
            setArchive(prevArchive => [...prevArchive, newArchiveEntry]);
            setIsUnveilingTransition(false);
            setStep("reflection");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error instanceof Error ? error.message : "Could not get a reflection.",
      });
      setIsUnveilingTransition(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosticSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(diagnosticAnswers);
  };

  const resetFlow = () => {
    setStep('symbol');
    setReflection(null);
    setJournalText("");
    setSelectedSymbol(null);
    setVeiledChat(false);
    setIsUnveilingTransition(false);
    setDiagnosticAnswers("");
  };

  const handleUnveilingReady = (history: Message[]) => {
    setIsUnveilingTransition(true);
    handleSubmit(undefined, history);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 min-h-[calc(100vh-150px)] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === "symbol" && (
          <motion.div key="symbol" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h1 className="font-headline text-3xl md:text-4xl text-center mb-4 text-primary">A Symbolic Prompt</h1>
            <p className="text-muted-foreground text-center text-lg mb-10">Choose the image that feels closest to your state today.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {symbols.map((symbol) => (
                <button
                  key={symbol.id}
                  onClick={() => handleSymbolSelect(symbol.id)}
                  className="group aspect-square flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg border-2 border-transparent hover:border-primary hover:bg-accent transition-all duration-300"
                >
                  <div className="text-primary group-hover:scale-110 transition-transform">{symbol.icon}</div>
                  <p className="font-headline text-lg mt-4 text-muted-foreground group-hover:text-primary">{symbol.label}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "journal" && (
          <motion.div key="journal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h1 className="font-headline text-3xl md:text-4xl text-center mb-4 text-primary">Speak Your Heart</h1>
            <p className="text-muted-foreground text-center text-lg mb-8">What tension, conflict, or environment is present for you?</p>
            <Textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Describe your current landscape, or a conflict you are facing..."
              rows={8}
              className="text-lg"
              disabled={isLoading}
            />
            <div className="mt-8 flex justify-center">
              <Button onClick={() => handleSubmit()} size="lg" disabled={isLoading || !journalText.trim()}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Receive Reflection
              </Button>
            </div>
          </motion.div>
        )}

        {step === "diagnostic" && reflection?.diagnosticQuestions && (
          <motion.div key="diagnostic" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="max-w-xl mx-auto border-primary/20">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                        <Users /> Diagnostic Unveiling
                    </CardTitle>
                    <CardDescription>SeekHikma senses a shadow between you and another. To find the bridge, please reflect on these:</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {reflection.diagnosticQuestions.map((q, i) => (
                            <div key={i} className="p-3 bg-muted/50 rounded-md italic text-sm border-l-2 border-primary">
                                {q}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleDiagnosticSubmit}>
                        <Textarea 
                            value={diagnosticAnswers}
                            onChange={(e) => setDiagnosticAnswers(e.target.value)}
                            placeholder="Share your observations of their behavior and the interaction..."
                            rows={6}
                            required
                        />
                        <Button type="submit" className="w-full mt-6" disabled={isLoading || !diagnosticAnswers.trim()}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                            Unveil the Bridge
                        </Button>
                    </form>
                </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "reflection" && reflection && (
          <motion.div key="reflection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="sufi-mihrab">
                <div className="p-8">
                    <h2 className="text-center font-headline text-2xl text-primary mb-4">Poetic Reflection</h2>
                    <p className="text-lg italic whitespace-pre-wrap leading-relaxed text-center">&ldquo;{reflection.poeticReflection}&rdquo;</p>
                </div>
            </div>

            {reflection.interpersonalInsight && (
                <Card className="border-accent bg-accent/5">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2 text-accent-foreground">
                            <Users className="text-primary" /> Interpersonal Bridge
                        </CardTitle>
                        <CardDescription>Analysis of the elements clashing in your relationships.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-base leading-relaxed italic">{reflection.interpersonalInsight}</p>
                        
                        {reflection.otherPersonTemperament && reflection.temperamentBalance && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-accent/20">
                                <div>
                                    <p className="text-xs font-bold text-center uppercase mb-2">Your State</p>
                                    <TemperamentWheel data={reflection.temperamentBalance} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-center uppercase mb-2">Their State</p>
                                    <TemperamentWheel data={reflection.otherPersonTemperament} />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Card>
              <CardHeader><CardTitle className="font-headline text-2xl">Inner Practices</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                  {reflection.prescribedHabits?.map((habit, i) => (
                      <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/50">
                          <div className="flex-1">
                              <p className="font-bold">{habit.name}</p>
                              <p className="text-sm text-muted-foreground mt-1 italic">{habit.why}</p>
                          </div>
                          <Button size="sm" onClick={() => handleAddHabit(habit)} disabled={isHabitTracked(habit.name)} variant={isHabitTracked(habit.name) ? "outline" : "default"}>
                              {isHabitTracked(habit.name) ? <Check className="mr-2"/> : <Plus className="mr-2"/>}
                              {isHabitTracked(habit.name) ? 'Accepted' : 'Accept'}
                          </Button>
                      </div>
                  ))}
              </CardContent>
              <CardFooter className="bg-muted/30 text-center py-4 flex flex-col gap-2">
                <p className="text-sm font-headline text-primary">Wisdom Seed</p>
                <p className="font-medium">{reflection.wisdomSeed}</p>
              </CardFooter>
            </Card>

            <div className="flex justify-center pt-8">
                <Button onClick={resetFlow} variant="outline" size="lg">Begin a New Reflection</Button>
            </div>
          </motion.div>
        )}
        
        {step === "veiled" && reflection && (
            <motion.div key="veiled" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                {isUnveilingTransition ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <div className="space-y-2">
                            <h2 className="font-headline text-3xl text-primary">Unveiling the Mirror</h2>
                            <p className="text-muted-foreground max-w-sm">SeekHikma is integrating your honesty into your final reflection...</p>
                        </div>
                    </div>
                ) : !veiledChat ? (
                    <Card className="max-w-md mx-auto text-center border-amber-200">
                        <CardHeader>
                            <AlertTriangle className="mx-auto size-12 text-amber-500 mb-4" />
                            <CardTitle className="font-headline text-2xl text-primary">The Mirror is Veiled</CardTitle>
                            <CardDescription>&ldquo;{reflection.reasoning}&rdquo;</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => setStep('journal')}>Try Again</Button>
                            <Button variant="secondary" onClick={() => setVeiledChat(true)}>Talk to Unveil</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="mt-4">
                         <UnveilingChat 
                            journal={journalText} 
                            reasoning={reflection.reasoning} 
                            onReady={handleUnveilingReady}
                            symbol={selectedSymbol!}
                         />
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}