"use client";

import React, { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { PsychospiritualProfile } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Info, BrainCircuit, UserCheck, RefreshCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const baselineQuestions = [
  { id: "sanguine", q: "When I am in a new social group, I am:", options: ["Excited & talkative", "Quietly observing"] },
  { id: "choleric", q: "When things go wrong, my first reaction is:", options: ["Frustration/Action", "Acceptance/Wait"] },
  { id: "melancholic", q: "I spend a lot of time thinking about:", options: ["Past mistakes/Details", "Current possibilities"] },
  { id: "phlegmatic", q: "In a group conflict, I usually:", options: ["Seek peace at all costs", "Stand my ground"] },
];

export default function SettingsPage() {
  const [profile, setProfile] = useLocalStorage<PsychospiritualProfile>("hikma-profile", INITIAL_PROFILE);
  const [isAssessing, setIsAssessing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showSaved, setShowSaved] = useState(false);

  const handleDepthChange = (val: number[]) => {
    setProfile(prev => ({ ...prev, hikmaDepth: val[0] }));
  };

  const handleAssessmentComplete = () => {
    const finalProfile: PsychospiritualProfile = {
      ...profile,
      temperamentBalance: {
        sanguine: answers.sanguine === 0 ? 40 : 20,
        choleric: answers.choleric === 0 ? 40 : 20,
        melancholic: answers.melancholic === 0 ? 40 : 20,
        phlegmatic: answers.phlegmatic === 0 ? 40 : 20,
      },
      shadowBalance: {
        sanguine: answers.sanguine === 0 ? 25 : 10,
        choleric: answers.choleric === 0 ? 25 : 10,
        melancholic: answers.melancholic === 0 ? 25 : 10,
        phlegmatic: answers.phlegmatic === 0 ? 25 : 10,
      }
    };
    setProfile(finalProfile);
    setIsAssessing(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-headline text-4xl text-primary mb-8">Settings</h1>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-primary size-6" />
              <CardTitle className="font-headline text-2xl">Hikma Depth</CardTitle>
            </div>
            <CardDescription>Adjust how rigorously the AI challenges your shadows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
            <div className="space-y-6">
              <div className="flex justify-between text-sm font-medium">
                <span>Supportive & Affirming</span>
                <span>Rigorous & Unveiling</span>
              </div>
              <Slider 
                value={[profile.hikmaDepth]} 
                onValueChange={handleDepthChange} 
                max={100} 
                step={1} 
                className="py-4"
              />
              <div className="text-center font-headline text-xl text-primary">
                Current Depth: {profile.hikmaDepth}%
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg flex gap-3 text-sm italic">
              <Info className="size-5 shrink-0 text-primary" />
              <p>
                {profile.hikmaDepth < 30 && "Hikma will focus on affirmation and gentle encouragement."}
                {profile.hikmaDepth >= 30 && profile.hikmaDepth < 70 && "Hikma will balance support with occasional probing questions."}
                {profile.hikmaDepth >= 70 && "Hikma will actively hunt for veils and challenge surface-level sincerity."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-primary size-6" />
              <CardTitle className="font-headline text-2xl">Soul Assessment</CardTitle>
            </div>
            <CardDescription>Recalibrate your baseline temperament assessment.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <AnimatePresence mode="wait">
              {!isAssessing ? (
                <motion.div 
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-6"
                >
                  <Button onClick={() => setIsAssessing(true)} variant="outline">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retake Soul Assessment
                  </Button>
                  {showSaved && (
                    <p className="mt-4 text-green-600 flex items-center gap-2">
                      <Check className="h-4 w-4" /> Soul Balance updated.
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="questions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {baselineQuestions.map((bq) => (
                    <div key={bq.id} className="space-y-2">
                      <p className="font-semibold text-sm">{bq.q}</p>
                      <div className="flex gap-2">
                        {bq.options.map((opt, i) => (
                          <Button
                            key={opt}
                            variant={answers[bq.id] === i ? "default" : "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={() => setAnswers(prev => ({ ...prev, [bq.id]: i }))}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 flex gap-4">
                    <Button 
                      className="flex-1" 
                      onClick={handleAssessmentComplete}
                      disabled={Object.keys(answers).length < baselineQuestions.length}
                    >
                      Save New Assessment
                    </Button>
                    <Button variant="ghost" onClick={() => setIsAssessing(false)}>Cancel</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
