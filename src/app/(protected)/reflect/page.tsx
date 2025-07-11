"use client";
import React, { useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Wind, Droplets, Mountain, Flame, Loader2, MessageCircle, AlertTriangle, BookOpen, Heart, BookHeart, Check, Plus } from "lucide-react";
import { reflectionAction } from "@/app/actions";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { FullReflection, PsychospiritualProfile, ArchivedReflection, Message, TrackedHabit, PrescribedHabit } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ChatWithHikma } from "@/components/ChatWithHikma";
import { UnveilingChat } from "@/components/UnveilingChat";

const symbols = [
  { id: 'wind', icon: <Wind className="w-10 h-10" />, label: 'Wind (Air)' },
  { id: 'flame', icon: <Flame className="w-10 h-10" />, label: 'Flame (Fire)' },
  { id: 'water', icon: <Droplets className="w-10 h-10" />, label: 'Water (Water)' },
  { id: 'earth', icon: <Mountain className="w-10 h-10" />, label: 'Earth (Earth)' },
] as const;

type Symbol = typeof symbols[number]['id'];

export default function ReflectionPage() {
  const [step, setStep] = useState<"symbol" | "journal" | "reflection" | "veiled">("symbol");
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol | null>(null);
  const [journalText, setJournalText] = useState("");
  const [reflection, setReflection] = useState<FullReflection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    toast({
        title: "Practice Added",
        description: `"${habit.name}" has been added to your daily practices.`
    });
  };

  const isHabitTracked = (habitName: string) => {
    return habits.some(h => h.name === habitName);
  }

  const handleIncompleteReflection = (result: FullReflection) => {
    // Graceful failure: if reflection is incomplete, treat it as veiled.
    toast({
      variant: "default",
      title: "The Mirror is Hazy",
      description: "Hikma's words were not clear. Perhaps there is more to unveil.",
    });
    setReflection({
      ...result,
      isVeiled: true,
      reasoning: result.reasoning || "The reflection was unclear, suggesting a need for deeper honesty.",
    });
    setProfile(p => ({ ...p, veiledCount: p.veiledCount + 1 }));
    setStep("veiled");
  }

  const handleSubmit = async () => {
    if (!selectedSymbol || !journalText) return;
    setIsLoading(true);

    try {
      const result = await reflectionAction({
        symbol: selectedSymbol,
        journal: journalText,
        previousProfile: profile,
      });

      if (result.isVeiled) {
        setReflection(result);
        setProfile(p => ({ ...p, veiledCount: p.veiledCount + 1 }));
        setStep("veiled");
      } else {
        if (!result.soulStage || !result.temperamentBalance || !result.poeticReflection || !result.probingQuestions || !result.wisdomSeed) {
            handleIncompleteReflection(result);
        } else {
            setReflection(result);
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
            setStep("reflection");
        }
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Could not get a reflection. Please try again.";
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: errorMessage,
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

  const resetFlow = () => {
    setStep('symbol');
    setReflection(null);
    setJournalText("");
    setSelectedSymbol(null);
    setVeiledChat(false);
  }

  const handleTryAgain = () => {
    setVeiledChat(false);
    setReflection(null);
    setStep('journal');
  }
  
  const handleStartVeiledChat = () => {
    setVeiledChat(true);
  }
  
  const handleReadyForSincereReflection = async (chatHistory: Message[]) => {
    if (!selectedSymbol || !journalText) return;
    
    try {
        const result = await reflectionAction({
            symbol: selectedSymbol,
            journal: journalText,
            previousProfile: profile,
            unveilingHistory: chatHistory,
        });

        if (result.isVeiled) {
            toast({
                variant: "destructive",
                title: "The Mirror Remains Veiled",
                description: "Hikma's words are still scattered. The reflection is incomplete. Please try again.",
            });
            setVeiledChat(false);
            setReflection(null);
            setStep('journal');
        } else {
            // Safeguard against incomplete data from the AI
            if (!result.soulStage || !result.temperamentBalance || !result.poeticReflection || !result.probingQuestions || !result.wisdomSeed) {
                handleIncompleteReflection(result);
                setVeiledChat(false); // Make sure we exit chat view
                return;
            }
            
            toast({
                title: "The Veil Lifts",
                description: "Your heart has opened. Here is your reflection.",
            });
            setReflection(result);
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
            setStep("reflection");
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Could not get a reflection. Please try again.";
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: errorMessage,
        });
        setVeiledChat(false);
        setReflection(null);
        setStep('journal');
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 min-h-[calc(100vh-150px)] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === "symbol" && (
          <motion.div key="symbol" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }}>
            <h1 className="font-headline text-3xl md:text-4xl text-center mb-4 text-primary">A Symbolic Prompt</h1>
            <p className="text-muted-foreground text-center text-lg mb-10">Choose the image that feels closest to your state today.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {symbols.map((symbol) => (
                <button
                  key={symbol.id}
                  onClick={() => handleSymbolSelect(symbol.id)}
                  className="group aspect-square flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg border-2 border-transparent hover:border-primary hover:bg-accent transition-all duration-300"
                >
                  <div className="text-primary transition-transform duration-300 group-hover:scale-110">{symbol.icon}</div>
                  <p className="font-headline text-lg mt-4 text-muted-foreground group-hover:text-primary transition-colors">{symbol.label}</p>
                </button>
              ))}
            </div>
             <div className="mt-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                            <BookHeart /> Learn About the Temperaments
                        </CardTitle>
                        <CardDescription>Understand the elements within you to find your balance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="sanguine">
                                <AccordionTrigger>Sanguine (Air)</AccordionTrigger>
                                <AccordionContent>
                                    <p className="mb-2">The sanguine temperament is associated with the element of Air. It is social, optimistic, and pleasure-seeking. Those with a sanguine nature are often charismatic, creative, and lively.</p>
                                    <p><b>Virtues:</b> Joyful, charismatic, compassionate, creative.</p>
                                    <p><b>Vices when imbalanced:</b> Fickle, lustful, scattered, prone to distraction.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="choleric">
                                <AccordionTrigger>Choleric (Fire)</AccordionTrigger>
                                <AccordionContent>
                                    <p className="mb-2">The choleric temperament corresponds to the element of Fire. It is ambitious, decisive, and passionate. Cholerics are natural leaders, driven and focused on their goals.</p>
                                    <p><b>Virtues:</b> Courageous, decisive, passionate, strong-willed.</p>
                                    <p><b>Vices when imbalanced:</b> Angry, prideful, domineering, ruthless.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="melancholic">
                                <AccordionTrigger>Melancholic (Earth)</AccordionTrigger>
                                <AccordionContent>
                                    <p className="mb-2">The melancholic temperament is linked to the element of Earth. It is thoughtful, introspective, and detail-oriented. Melancholics are often deeply feeling, analytical, and appreciate of truth and beauty.</p>
                                    <p><b>Virtues:</b> Contemplative, analytical, empathetic, meticulous.</p>
                                    <p><b>Vices when imbalanced:</b> Sad, anxious, rigid, overly critical.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="phlegmatic">
                                <AccordionTrigger>Phlegmatic (Water)</AccordionTrigger>
                                <AccordionContent>
                                    <p className="mb-2">The phlegmatic temperament is associated with the element of Water. It is calm, agreeable, and consistent. Phlegmatics are peaceful, patient, and value stability and harmony.</p>
                                    <p><b>Virtues:</b> Peaceful, patient, reliable, diplomatic.</p>
                                    <p><b>Vices when imbalanced:</b> Apathetic, lazy, passive, resistant to change.</p>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="balance">
                                <AccordionTrigger>The Prophetic Balance</AccordionTrigger>
                                <AccordionContent>
                                    <p className="mb-2">The goal of spiritual work (tazkiyah) is not to eliminate any temperament, but to achieve a state of perfect balance (i'tidāl). The Prophet Muhammad (peace be upon him) is the ultimate example of this equilibrium. He embodied the best qualities of all four temperaments without any of their flaws.</p>
                                    <p className="mb-2">He possessed the courage of the Choleric without the anger, the joy of the Sanguine without the fickleness, the empathy of the Melancholic without the sadness, and the peace of the Phlegmatic without the apathy. </p>
                                    <p>As we get closer to the prophetic model, our own temperaments become refined and perfected. We learn to use our innate disposition in service of the good, the beautiful, and the true, bringing our inner landscape into harmony.</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
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
        
        {step === "veiled" && reflection && (
          <motion.div key="veiled" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="w-full max-w-4xl mx-auto">
             {veiledChat ? (
                <UnveilingChat 
                    journal={journalText} 
                    reasoning={reflection.reasoning}
                    onReady={handleReadyForSincereReflection}
                    symbol={selectedSymbol!}
                />
            ) : (
                <Card className="max-w-md mx-auto text-center">
                    <CardHeader>
                        <div className="mx-auto bg-amber-100 dark:bg-amber-900 p-3 rounded-full w-fit">
                            <AlertTriangle className="size-8 text-amber-500" />
                        </div>
                        <CardTitle className="font-headline text-2xl text-primary mt-4">The Mirror is Veiled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg italic text-muted-foreground">&ldquo;{reflection.reasoning}&rdquo;</p>
                        <p className="mt-4 text-sm">Honesty is the first step on any true path. The mirror cannot reflect what is hidden.</p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={handleTryAgain}>
                                <BookOpen className="mr-2" /> Try Again
                            </Button>
                            <Button onClick={handleStartVeiledChat} variant="secondary">
                                <Heart className="mr-2"/> Talk to Unveil
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
          </motion.div>
        )}

        {step === "reflection" && reflection && (
          <motion.div key="reflection" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="w-full">
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
                    {reflection.probingQuestions?.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </CardContent>
              </Card>
              
              {reflection.prescribedHabits && reflection.prescribedHabits.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Inner Practices</CardTitle>
                        <CardDescription>Hikma suggests these practices to help cultivate balance and integrate your reflection.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {reflection.prescribedHabits.map((habit, i) => (
                            <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/50">
                                <div className="flex-1">
                                    <p className="font-bold">{habit.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1 italic">&ldquo;{habit.why}&rdquo;</p>
                                    <p className="text-xs font-semibold uppercase text-primary mt-2">{habit.frequency} &bull; {habit.label}</p>
                                </div>
                                <Button 
                                    size="sm" 
                                    onClick={() => handleAddHabit(habit)}
                                    disabled={isHabitTracked(habit.name)}
                                    variant={isHabitTracked(habit.name) ? "outline" : "default"}
                                >
                                    {isHabitTracked(habit.name) ? <Check className="mr-2"/> : <Plus className="mr-2"/>}
                                    {isHabitTracked(habit.name) ? 'Accepted' : 'Accept'}
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
              )}

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
                      <CardTitle className="font-headline text-xl">Deeper Contemplation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{reflection.optionalPrompt}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
               <div className="mt-8 border-t pt-8">
                 <ChatWithHikma reflection={reflection} journal={journalText} />
               </div>

               <div className="mt-8 flex justify-center border-t pt-8">
                 <Button onClick={resetFlow} size="lg" variant="outline">
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
