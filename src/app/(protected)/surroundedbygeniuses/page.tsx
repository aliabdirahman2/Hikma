"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ArrowRight, RefreshCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Temperament = "sanguine" | "choleric" | "melancholic" | "phlegmatic";

const questions = [
  {
    q: "In a group setting, which behavior drains your energy the fastest?",
    options: [
      { text: "Endless brainstorming with no execution", trait: "sanguine" as Temperament },
      { text: "Aggressive demands and impatience", trait: "choleric" as Temperament },
      { text: "Constant complaining and pointing out flaws", trait: "melancholic" as Temperament },
      { text: "Refusal to take a stance or share an opinion", trait: "phlegmatic" as Temperament },
    ]
  },
  {
    q: "When communicating via text or email, what annoys you most?",
    options: [
      { text: "Long, disorganized messages with emojis and tangents", trait: "sanguine" as Temperament },
      { text: "Blunt, one-word demands without a 'hello'", trait: "choleric" as Temperament },
      { text: "Overly detailed essays analyzing every minor point", trait: "melancholic" as Temperament },
      { text: "Taking days to reply to a simple question", trait: "phlegmatic" as Temperament },
    ]
  },
  {
    q: "Under stress, you find it hardest to collaborate with someone who:",
    options: [
      { text: "Makes inappropriate jokes to lighten the mood", trait: "sanguine" as Temperament },
      { text: "Tries to take over and dictate everyone's tasks", trait: "choleric" as Temperament },
      { text: "Freezes up because things aren't perfect", trait: "melancholic" as Temperament },
      { text: "Retreats and expects someone else to fix it", trait: "phlegmatic" as Temperament },
    ]
  },
  {
    q: "If you have to give feedback, who is the hardest to talk to?",
    options: [
      { text: "Someone who gets distracted and doesn't take it seriously", trait: "sanguine" as Temperament },
      { text: "Someone who immediately argues back and gets defensive", trait: "choleric" as Temperament },
      { text: "Someone who takes it as a crushing personal failure", trait: "melancholic" as Temperament },
      { text: "Someone who nods along but never changes their behavior", trait: "phlegmatic" as Temperament },
    ]
  },
  {
    q: "Which of these social scenarios makes you want to leave the room?",
    options: [
      { text: "Being trapped in a loud, chaotic conversation with no point", trait: "sanguine" as Temperament },
      { text: "Being caught in the middle of a heated, competitive debate", trait: "choleric" as Temperament },
      { text: "Listening to someone endlessly dissect a past mistake", trait: "melancholic" as Temperament },
      { text: "Sitting in awkward silence where no one will speak up", trait: "phlegmatic" as Temperament },
    ]
  },
  {
    q: "When planning a trip or event, what type of co-planner drives you crazy?",
    options: [
      { text: "The one who wants to wing it and refuses to stick to a schedule", trait: "sanguine" as Temperament },
      { text: "The one who builds a rigid itinerary and snaps if you deviate", trait: "choleric" as Temperament },
      { text: "The one who researches every catastrophic possibility", trait: "melancholic" as Temperament },
      { text: "The one who just says 'whatever you want' to everything", trait: "phlegmatic" as Temperament },
    ]
  },
  {
    q: "Ultimately, what is the biggest roadblock to harmony for you?",
    options: [
      { text: "People who lack discipline and focus", trait: "sanguine" as Temperament },
      { text: "People who lack empathy and bulldoze others", trait: "choleric" as Temperament },
      { text: "People who lack optimism and drag the mood down", trait: "melancholic" as Temperament },
      { text: "People who lack drive and won't take initiative", trait: "phlegmatic" as Temperament },
    ]
  }
];

const resultsContent = {
  sanguine: {
    title: "You Struggle with Air (The Sanguine Genius)",
    description: "You find it difficult to interact with people who are highly expressive, spontaneous, and socially scattered.",
    advice: "Sanguines are idea-generators and social glue. Their genius is in their enthusiasm. When communicating with them, don't demand rigid structure right away. Give them space to verbalize their thoughts, use positive reinforcement, and gently guide them back to the point rather than shutting them down."
  },
  choleric: {
    title: "You Struggle with Fire (The Choleric Genius)",
    description: "You find it difficult to interact with people who are intense, demanding, and overly direct.",
    advice: "Cholerics are drivers and executioners. Their genius is in getting things done. When communicating with them, be direct, focus on results rather than feelings, and stand your ground without being defensive. They respect competence and brevity."
  },
  melancholic: {
    title: "You Struggle with Earth (The Melancholic Genius)",
    description: "You find it difficult to interact with people who are highly analytical, critical, or perfectionistic.",
    advice: "Melancholics are the architects and quality controllers. Their genius is in their attention to detail. When communicating with them, give them time to process, provide facts and data rather than just emotional appeals, and validate their desire for accuracy before trying to push for action."
  },
  phlegmatic: {
    title: "You Struggle with Water (The Phlegmatic Genius)",
    description: "You find it difficult to interact with people who are passive, slow-moving, or overly accommodating.",
    advice: "Phlegmatics are the peacemakers and stabilizers. Their genius is in their calm consistency. When communicating with them, don't push them for immediate emotional reactions. Create a safe, low-pressure environment, ask direct but gentle questions, and give them time to articulate their boundaries."
  }
};

export default function SurroundedByGeniusesPage() {
  const [step, setStep] = useState<"intro" | "test" | "result">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Temperament, number>>({
    sanguine: 0,
    choleric: 0,
    melancholic: 0,
    phlegmatic: 0,
  });

  const handleStart = () => {
    setScores({ sanguine: 0, choleric: 0, melancholic: 0, phlegmatic: 0 });
    setCurrentQuestion(0);
    setStep("test");
  };

  const handleAnswer = (trait: Temperament) => {
    setScores(prev => ({ ...prev, [trait]: prev[trait] + 1 }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep("result");
    }
  };

  const getPrimaryStruggle = (): Temperament => {
    let max = 0;
    let primary: Temperament = "sanguine";
    for (const [trait, score] of Object.entries(scores)) {
      if (score > max) {
        max = score;
        primary = trait as Temperament;
      }
    }
    return primary;
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 min-h-[calc(100vh-150px)] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        
        {step === "intro" && (
          <motion.div 
            key="intro" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <div className="mx-auto bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl text-primary">Surrounded by Geniuses</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              True Hikma (wisdom) is not just understanding yourself, but understanding the geniuses that surround you. 
              We often clash with people whose temperaments oppose our own. 
            </p>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Take this 7-question test to discover which temperament you struggle with the most, and learn the key to communicating with them.
            </p>
            <Button size="lg" onClick={handleStart} className="font-headline text-lg mt-8">
              Begin Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {step === "test" && (
          <motion.div 
            key="test" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2 font-headline uppercase tracking-widest">
                    <span>Question {currentQuestion + 1}</span>
                    <span>{questions.length}</span>
                </div>
                <Progress value={((currentQuestion) / questions.length) * 100} className="h-2" />
            </div>

            <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline leading-normal">
                        {questions[currentQuestion].q}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {questions[currentQuestion].options.map((opt, i) => (
                        <Button 
                            key={i} 
                            variant="outline" 
                            className="w-full justify-start text-left h-auto py-4 px-6 text-base font-normal whitespace-normal hover:bg-primary/5 hover:border-primary/30"
                            onClick={() => handleAnswer(opt.trait)}
                        >
                            {opt.text}
                        </Button>
                    ))}
                </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div 
            key="result" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Card className="border-primary/30 shadow-2xl overflow-hidden">
                <div className="bg-primary/5 p-8 text-center border-b border-primary/10">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="font-headline text-3xl text-primary mb-2">
                        {resultsContent[getPrimaryStruggle()].title}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {resultsContent[getPrimaryStruggle()].description}
                    </p>
                </div>
                <CardContent className="p-8">
                    <h3 className="font-headline text-xl mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" /> How to Harmonize
                    </h3>
                    <p className="text-lg leading-relaxed text-foreground/90 bg-muted/30 p-6 rounded-lg italic">
                        "{resultsContent[getPrimaryStruggle()].advice}"
                    </p>
                </CardContent>
                <CardFooter className="bg-muted/10 p-6 flex justify-center border-t border-border/50">
                    <Button variant="outline" onClick={handleStart}>
                        <RefreshCcw className="w-4 h-4 mr-2" /> Retake Test
                    </Button>
                </CardFooter>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
