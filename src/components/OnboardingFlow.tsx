"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Flame, Waves, Wind, Mountain, BrainCircuit, Heart, Sparkles, SlidersHorizontal, UserCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { INITIAL_PROFILE } from "@/lib/constants";
import type { PsychospiritualProfile } from "@/lib/types";

const onboardingSteps = [
  {
    id: "welcome",
    icon: <Leaf className="size-16 text-primary" />,
    title: "The soul’s journey is inward.",
    body: "SeekHikma is your sacred companion. We use ancient temperament models and modern AI to help you polish the mirror of your heart.",
    buttonText: "Begin the Journey",
  },
  {
    id: "depth",
    icon: <SlidersHorizontal className="size-16 text-primary" />,
    title: "How deep should we go?",
    body: "Set the rigor of SeekHikma's guidance. Higher depth means more challenging questions and less surface-level comfort.",
    buttonText: "Set Intention",
  },
  {
    id: "baseline",
    icon: <BrainCircuit className="size-16 text-primary" />,
    title: "The Baseline Assessment",
    body: "Tell us a bit about how you usually react to the world. This helps us map your initial Temperament and Shadow balances.",
    buttonText: "Complete Assessment",
  },
  {
    id: "finish",
    icon: <Sparkles className="size-16 text-primary" />,
    title: "The path is clear.",
    body: "You are ready to begin. Remember: honesty is the only requirement for clarity.",
    buttonText: "Enter the Garden",
  },
];

const baselineQuestions = [
  { id: "sanguine", q: "When I am in a new social group, I am:", options: ["Excited & talkative", "Quietly observing"] },
  { id: "choleric", q: "When things go wrong, my first reaction is:", options: ["Frustration/Action", "Acceptance/Wait"] },
  { id: "melancholic", q: "I spend a lot of time thinking about:", options: ["Past mistakes/Details", "Current possibilities"] },
  { id: "phlegmatic", q: "In a group conflict, I usually:", options: ["Seek peace at all costs", "Stand my ground"] },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [depth, setDepth] = useState(50);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [profile, setProfile] = useLocalStorage<PsychospiritualProfile>("hikma-profile", INITIAL_PROFILE);

  const handleNext = () => {
    if (stepIndex < onboardingSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Calculate final profile
      const finalProfile: PsychospiritualProfile = {
        ...INITIAL_PROFILE,
        hikmaDepth: depth,
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
      onComplete();
    }
  };

  const currentStep = onboardingSteps[stepIndex];

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-foreground overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex w-full max-w-2xl flex-col items-center p-8 text-center"
        >
          <div className="mb-8">{currentStep.icon}</div>
          <h1 className="mb-4 font-headline text-4xl text-primary">{currentStep.title}</h1>
          <p className="mb-8 text-lg text-muted-foreground">{currentStep.body}</p>

          {currentStep.id === "depth" && (
            <div className="w-full max-w-sm mb-12 space-y-4">
              <div className="flex justify-between text-sm font-headline">
                <span>Gentle Mirror</span>
                <span>Deep Abyss</span>
              </div>
              <Slider value={[depth]} onValueChange={([v]) => setDepth(v)} max={100} step={1} className="py-4" />
              <p className="italic text-primary">Depth: {depth}%</p>
            </div>
          )}

          {currentStep.id === "baseline" && (
            <div className="w-full space-y-6 mb-10 text-left">
              {baselineQuestions.map((bq) => (
                <div key={bq.id} className="space-y-2">
                  <p className="font-semibold">{bq.q}</p>
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
            </div>
          )}

          <Button 
            size="lg" 
            onClick={handleNext} 
            className="font-headline text-xl py-7 px-10"
            disabled={currentStep.id === "baseline" && Object.keys(answers).length < baselineQuestions.length}
          >
            {currentStep.buttonText}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
