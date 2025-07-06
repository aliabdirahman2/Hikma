"use client";
import React, { useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Wind, Droplets, Mountain, Flame, Loader2, MessageCircle, AlertTriangle, BookOpen, Heart } from "lucide-react";
import { reflectionAction } from "@/app/actions";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { FullReflection, PsychospiritualProfile, ArchivedReflection } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { toast } = useToast();

  const handleSymbolSelect = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    setStep("journal");
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

      if (result.isVeiled) {
        setProfile(p => ({ ...p, veiledCount: p.veiledCount + 1 }));
        setStep("veiled");
      } else {
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
  
  const handleRerunReflection = () => {
    setVeiledChat(false);
    setReflection(null);
    setStep('journal');
    setTimeout(() => {
        handleSubmit();
    }, 100);
  }

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
          <motion.div key="veiled" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }} className="w-full">
             {veiledChat ? (
                <UnveilingChat 
                    journal={journalText} 
                    reasoning={reflection.reasoning}
                    onReady={handleRerunReflection}
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
