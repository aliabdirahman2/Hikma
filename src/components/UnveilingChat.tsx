"use client";

import React, { useState, useRef, useEffect } from "react";
import { unveilHeartAction } from "@/app/actions";
import type { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UnveilingChatProps {
  journal: string;
  reasoning: string;
  onReady: () => void;
}

export function UnveilingChat({ journal, reasoning, onReady }: UnveilingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "It seems there's a veil over the heart's mirror. That is okay. Sometimes we protect ourselves without knowing. Shall we gently explore what might be hiding?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

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
            setTimeout(() => {
              toast({
                title: "The Veil Lifts",
                description: "Your heart is opening. Let's try reflecting again.",
              });
              onReady();
            }, 2000);
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

  return (
    <Card className="w-full">
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
  );
}
