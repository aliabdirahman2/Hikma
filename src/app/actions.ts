
"use server";

import { generateReflection } from "@/ai/flows/generate-reflection";
import { generateSymbolicPrompt } from "@/ai/flows/generate-symbolic-prompt";
import type { SymbolicPromptInput, SymbolicPromptOutput } from "@/ai/flows/generate-symbolic-prompt";
import { continueChat } from "@/ai/flows/continue-chat";
import type { ChatInput, ChatOutput } from "@/ai/flows/continue-chat";
import { unveilHeart } from "@/ai/flows/unveil-heart-flow";
import type { UnveilHeartInput, UnveilHeartOutput } from "@/ai/flows/unveil-heart-flow";
import type { ReflectionInput, ReflectionOutput } from "@/lib/types";

/**
 * Robust retry mechanism for AI stability.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 800): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export async function reflectionAction(input: ReflectionInput): Promise<ReflectionOutput> {
  try {
    return await withRetry(() => generateReflection(input));
  } catch (error) {
    console.error("AI Reflection Error:", error);
    throw new Error("The mirror of the heart is currently obscured by heavy clouds. Please take a deep breath and try again in a moment.");
  }
}

export async function generateSymbolicPromptAction(input: SymbolicPromptInput): Promise<SymbolicPromptOutput> {
  try {
    return await withRetry(() => generateSymbolicPrompt(input));
  } catch (error) {
    throw new Error("The symbolic realm is quiet for now. Let's try to listen again in a moment.");
  }
}

export async function continueChatAction(input: ChatInput): Promise<ChatOutput> {
  try {
    return await withRetry(() => continueChat(input));
  } catch (error) {
    throw new Error("Hikma is in deep contemplation. Please wait a moment before speaking again.");
  }
}

export async function unveilHeartAction(input: UnveilHeartInput): Promise<UnveilHeartOutput> {
  try {
    return await withRetry(() => unveilHeart(input));
  } catch (error) {
    throw new Error("The veil is heavy right now. Let us breathe together and try again.");
  }
}
