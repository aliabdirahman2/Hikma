"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Waves, Flame, Wind, Mountain, GitCommit, Heart, Sparkles, BookOpenCheck } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const onboardingSteps = [
  {
    icon: <Leaf className="size-16 text-primary" />,
    title: "The soul’s journey is inward, not outward.",
    body: "You’re not here to be fixed. You’re here to listen more deeply—to the quiet voice within. Hikma is your sacred companion. Through symbol, reflection, and guided insight, you’ll begin to understand yourself in new ways.",
    buttonText: "Begin the Journey",
  },
  {
    icon: <GitCommit className="size-16 text-primary" />,
    title: "Every soul has a climate.",
    body: "Before you speak, you must attune. Choose the element that best matches your current inner state. This is not a test. It’s a way to tune your reflection to your inner atmosphere.",
    buttonText: "Continue",
  },
  {
    icon: <BookOpenCheck className="size-16 text-primary" />,
    title: "Within you are opposites.",
    body: "Fire may hide fear. Water may hold anger. Earth may ache to move. Hikma will now show you the contradictions living within your current state. These are not mistakes—they are openings.",
    buttonText: "Reveal My Contradictions",
  },
  {
    icon: <Heart className="size-16 text-primary" />,
    title: "This is your moment of unveiling.",
    body: "In the quiet of reflection, the heart speaks what the tongue cannot. You will be guided by a simple prompt. Write, speak, or feel your way through it. There’s no right answer—only truth and presence. As you open, Hikma listens—not to judge, but to understand.",
    buttonText: "Begin My Reflection",
  },
  {
    icon: <Sparkles className="size-16 text-primary" />,
    title: "When the heart opens, the mirror speaks.",
    body: "Once you’ve unveiled your inner world with sincerity, Hikma will offer you a sacred reflection: insights into your soul’s stage, symbolic meanings, and a gentle invitation to deepen your path. You don’t have to strive. Just show up honestly—and the reflection will meet you.",
    buttonText: "Let's Begin the Work",
  },
];

const elementChoices = [
    { icon: <Flame className="size-10" />, label: "Fire", description: "driven, restless, angry, passionate"},
    { icon: <Waves className="size-10" />, label: "Water", description: "emotional, grieving, intuitive, soft"},
    { icon: <Wind className="size-10" />, label: "Air", description: "scattered, detached, visionary, light"},
    { icon: <Mountain className="size-10" />, label: "Earth", description: "grounded, stuck, burdened, patient"},
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 1 && !selectedElement) return;

    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = onboardingSteps[step];

  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -30 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.7,
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="flex w-full max-w-2xl flex-col items-center justify-center p-8 text-center"
        >
          <div className="mb-8">{currentStep.icon}</div>
          <h1 className="mb-4 font-headline text-4xl text-primary">
            {currentStep.title}
          </h1>
          <p className="mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {currentStep.body}
          </p>

          {step === 1 && (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {elementChoices.map(el => (
                    <button key={el.label} onClick={() => setSelectedElement(el.label)}
                        className={cn("group p-4 border-2 rounded-lg transition-all duration-300", 
                            selectedElement === el.label ? 'border-primary bg-accent' : 'border-muted hover:border-primary/50'
                        )}
                    >
                        <div className="text-primary transition-transform duration-300 group-hover:scale-110">{el.icon}</div>
                        <p className="font-headline text-lg mt-2 text-muted-foreground group-hover:text-primary">{el.label}</p>
                        <p className="text-xs text-muted-foreground/80 hidden">{el.description}</p>
                    </button>
                ))}
            </div>
          )}

          <Button 
            size="lg" 
            onClick={handleNext} 
            className="font-headline text-xl py-7 px-10"
            disabled={step === 1 && !selectedElement}
          >
            {currentStep.buttonText}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
