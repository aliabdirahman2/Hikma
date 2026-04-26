"use client";

import React, { useState, useRef, useEffect } from "react";
import { unveilHeartAction } from "@/app/actions";
import type { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send, Sparkles, Wand2, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UnveilingHeartAnimation } from "./UnveilingHeartAnimation";
import { motion } from "framer-motion";
import { BreathAnimation } from "./BreathAnimation";

type Symbol = "wind" | "flame" | "water" | "earth";

interface UnveilingChatProps {
  journal: string;
  reasoning: string;
  onReady: (chatHistory: Message[]) => void;
  symbol: Symbol;
}

const nudges = [
    "What are you hiding from yourself here?",
    "What do you wish someone else could say for you?",
    "What’s behind that anger?",
    "If your heart could speak, what would it whisper?"
];

export function UnveilingChat({ journal, reasoning, onReady, symbol }: UnveilingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "It seems there's a veil over the heart's mirror. That is okay. Sometimes we protect ourselves without knowing. Shall we gently explore what might be hiding?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [breakthroughProgress, setBreakthroughProgress] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isTransitioning) return;

    const newUserMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
        const result = await unveilHeartAction({
            history: newMessages,
            journal,
            reasoning,
        });

        setMessages(prev => [...prev, { role: "model", content: result.response }]);
        const nextCount = questionCount + 1;
        setQuestionCount(nextCount);

        // Transition if AI says ready OR we hit 3 questions
        if (result.isReady || nextCount >= 3) {
            setIsTransitioning(true);
            setBreakthroughProgress(1);
            setTimeout(() => onReady(newMessages), 3000); 
        } else {
            setBreakthroughProgress(prev => Math.min(0.9, prev + 0.3));
        }

    } catch (error) {
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Could not get a response. Please try again.",
        });
        setMessages(prev => prev.slice(0, -1));
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isTransitioning) {
    return (
        <div className="w-full text-center p-8 flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <UnveilingHeartAnimation progress={1} />
                <h2 className="font-headline text-2xl text-primary mt-6">The Heart Opens</h2>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                    Feel this openness. Breathe into this space. The mirror is being cleared.
                </p>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 p-4">
            <UnveilingHeartAnimation progress={breakthroughProgress} />
            <div className="text-center">
                <h3 className="font-headline text-lg text-primary">The Heart Mirror</h3>
                <p className="text-sm text-muted-foreground">Question {questionCount + 1} of 3</p>
                <div className="mt-4 flex justify-center">
                    <BreathAnimation symbol={symbol} />
                </div>
            </div>
        </div>

        <div className="w-full max-w-2xl">
            <Card className="w-full border-primary/20 bg-muted/20">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-2">
                        <Sparkles /> Unveiling
                    </CardTitle>
                    <CardDescription>Speak with sincerity to clear the path.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-64 pr-4">
                        <div className="space-y-4" ref={scrollAreaRef}>
                            {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                "flex w-fit max-w-xs flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                message.role === "user"
                                    ? "ml-auto bg-primary text-primary-foreground"
                                    : "bg-muted"
                                )}
                            >
                                {message.content}
                            </div>
                            ))}
                            {isLoading && <div className="flex justify-start"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleSendMessage} className="mt-4 flex w-full items-center space-x-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Speak honestly..."
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
