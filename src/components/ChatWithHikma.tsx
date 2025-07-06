"use client";

import React, { useState, useRef, useEffect } from "react";
import { continueChatAction, generateSymbolicPromptAction } from "@/app/actions";
import type { FullReflection, Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatWithHikmaProps {
  reflection: FullReflection;
  journal: string;
}

export function ChatWithHikma({ reflection, journal }: ChatWithHikmaProps) {
  const [chatState, setChatState] = useState<"idle" | "prompting" | "chatting">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [symbolicPrompt, setSymbolicPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartChat = async () => {
    setIsLoading(true);
    try {
      const result = await generateSymbolicPromptAction({ reflection, journal });
      setSymbolicPrompt(result.symbolicPhrase);
      setChatState("prompting");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not start the conversation. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
        const result = await continueChatAction({
            history: newMessages,
            reflection,
            journal
        });
        setMessages(prev => [...prev, { role: "model", content: result.response }]);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Could not get a response. Please try again.",
        });
        setMessages(prev => prev.slice(0, -1)); // remove user message if AI fails
    } finally {
        setIsLoading(false);
    }
  };

  const handleSendInterpretation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([userMessage]);
    setInput("");
    setIsLoading(true);
    setChatState("chatting");

    try {
        const result = await continueChatAction({
            history: [userMessage],
            reflection,
            journal
        });
        setMessages(prev => [...prev, { role: "model", content: result.response }]);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Could not get a response. Please try again.",
        });
        setChatState("prompting"); // Revert state
        setMessages([]);
    } finally {
        setIsLoading(false);
    }
  };


  if (chatState === "idle") {
    return (
      <div className="text-center">
        <Button onClick={handleStartChat} disabled={isLoading} size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <MessageCircle className="mr-2 h-5 w-5" />
          )}
          Go Deeper with Hikma
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
          <MessageCircle /> A Deeper Conversation
        </CardTitle>
        {chatState === "prompting" && (
            <CardDescription>Hikma offers a new reflection. What does it mean in your inner world?</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {chatState === "prompting" && (
            <div className="text-center p-6 bg-muted rounded-lg">
                <p className="text-2xl font-headline text-primary">&ldquo;{symbolicPrompt}&rdquo;</p>
            </div>
        )}
        
        {chatState === "chatting" && (
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
        )}

        <form
          onSubmit={chatState === "prompting" ? handleSendInterpretation : handleSendMessage}
          className="mt-4 flex w-full items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={chatState === 'prompting' ? 'Speak your interpretation...' : "Say something..."}
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
