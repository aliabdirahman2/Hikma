
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);


  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
      }
    };
    
    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleVoiceClick = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setError(null);
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };


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

        if (result.isReady) {
            setIsTransitioning(true);
            setBreakthroughProgress(1); // Signal full breakthrough for animation
            setTimeout(() => onReady(newMessages), 3000); // Wait 3s for user to read message
        } else {
            setBreakthroughProgress(prev => Math.min(0.8, prev + 0.15));
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
  
  const handleNudgeClick = (nudge: string) => {
    setInput(prev => prev ? `${prev}\n${nudge}` : nudge);
  }

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
                    Feel this openness. Breathe into this space. A new reflection is being prepared for you in this light.
                </p>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
        <div className="lg:col-span-1 flex flex-col items-center gap-8">
             <div className="flex flex-col items-center justify-center p-4">
                <UnveilingHeartAnimation progress={breakthroughProgress} />
                <p className="text-sm font-semibold text-primary mt-4">
                  {Math.round(breakthroughProgress * 100)}% Unveiled
                </p>
            </div>
            <div className="hidden lg:flex flex-col items-center gap-4">
                <h3 className="font-headline text-lg text-primary">Center Yourself</h3>
                <BreathAnimation symbol={symbol} />
            </div>
        </div>
        <Card className="w-full lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl text-amber-600">
                    <Sparkles /> Unveiling the Heart
                </CardTitle>
                <CardDescription>A gentle conversation to clear the mirror within.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    <div className="flex-1">
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

                        <form
                            onSubmit={handleSendMessage}
                            className="mt-4 flex w-full items-center space-x-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Speak from your heart..."
                                disabled={isLoading}
                            />
                             <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={handleVoiceClick} disabled={isLoading}>
                                <Mic className="h-4 w-4" />
                                <span className="sr-only">Use Microphone</span>
                            </Button>
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                         {error && <p className="text-xs text-destructive mt-2">{error}</p>}
                    </div>
                    <div className="w-full md:w-48 flex-shrink-0">
                        <h4 className="font-headline text-md text-primary mb-2 flex items-center gap-2"><Wand2 size={16}/> Nudges of Sincerity</h4>
                        <div className="space-y-2">
                            {nudges.map(nudge => (
                                <button key={nudge} onClick={() => handleNudgeClick(nudge)} className="w-full text-left text-sm p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                                    {nudge}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
