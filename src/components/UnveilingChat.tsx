"use client";

import React, { useState, useRef, useEffect } from "react";
import { unveilHeartAction } from "@/app/actions";
import type { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send, Sparkles, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UnveilingHeartAnimation } from "./UnveilingHeartAnimation";
import { AnimatePresence, motion } from "framer-motion";


interface UnveilingChatProps {
  journal: string;
  reasoning: string;
  onReady: (chatHistory: Message[]) => void;
}

export function UnveilingChat({ journal, reasoning, onReady }: UnveilingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "It seems there's a veil over the heart's mirror. That is okay. Sometimes we protect ourselves without knowing. Shall we gently explore what might be hiding?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [breakthroughProgress, setBreakthroughProgress] = useState(0);
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

        if (result.isReady) {
            setIsTransitioning(true);
            setBreakthroughProgress(1); // Signal full breakthrough for animation
            // The parent component will handle the transition and any toasts.
            // We just signal that we're ready and pass the conversation history.
            // Wait for animation before calling onReady
            setTimeout(() => onReady(newMessages), 3000); // Wait 3s for user to read message
        } else {
            // Increment progress slightly with each turn.
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
    <div className="flex flex-col md:flex-row gap-8 items-center w-full">
        <div className="w-full md:w-1/3 flex items-center justify-center p-4">
            <UnveilingHeartAnimation progress={breakthroughProgress} />
        </div>
        <Card className="w-full md:w-2/3">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl text-amber-600">
            <Sparkles /> Unveiling the Heart
            </CardTitle>
            <CardDescription>A gentle conversation to clear the mirror within.</CardDescription>
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
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  );
}
