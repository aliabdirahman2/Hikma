"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { chatAction } from "@/app/actions";
import type { Message } from "@/lib/types";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Peace be upon you. What is stirring in the ocean of your heart today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (data: FormValues) => {
    const userInput: Message = { role: "user", content: data.message };
    const newMessages = [...messages, userInput];
    setMessages(newMessages);
    form.reset();
    setIsLoading(true);

    try {
      const result = await chatAction({ history: newMessages });
      const botResponse: Message = { role: "model", content: result.response };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not get a response. Please try again later.",
      });
      // remove the user message if the bot fails
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-[calc(100vh-57px)] flex flex-col max-w-3xl bg-card border-x p-0">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex items-start gap-4 animate-in fade-in", {
                "justify-end": message.role === "user",
              })}
            >
              {message.role === "model" && (
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-primary text-primary-foreground font-headline">
                    H
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn("max-w-md rounded-lg p-3 text-base shadow-sm", {
                  "bg-primary text-primary-foreground": message.role === "user",
                  "bg-muted text-card-foreground": message.role === "model",
                })}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
              {message.role === "user" && (
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-foreground text-background">
                    N
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-primary text-primary-foreground font-headline">
                  H
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex items-center gap-4"
        >
          <Avatar className="h-10 w-10 border hidden sm:flex">
            <AvatarFallback className="bg-foreground text-background">
              N
            </AvatarFallback>
          </Avatar>
          <Input
            {...form.register("message")}
            placeholder="Speak your heart..."
            autoComplete="off"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
