
"use server";

import { generateReflection } from "@/ai/flows/generate-reflection";
import {
  generateSymbolicPrompt,
} from "@/ai/flows/generate-symbolic-prompt";
import type { SymbolicPromptInput, SymbolicPromptOutput } from "@/ai/flows/generate-symbolic-prompt";
import {
  continueChat,
} from "@/ai/flows/continue-chat";
import type { ChatInput, ChatOutput } from "@/ai/flows/continue-chat";
import { unveilHeart } from "@/ai/flows/unveil-heart-flow";
import type { UnveilHeartInput, UnveilHeartOutput } from "@/ai/flows/unveil-heart-flow";
import type { ReflectionInput, ReflectionOutput } from "@/lib/types";

/**
 * Helper to retry an async function a specified number of times.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}

export async function reflectionAction(
  input: ReflectionInput
): Promise<ReflectionOutput> {
  try {
    return await withRetry(() => generateReflection(input));
  } catch (error) {
    console.error("Error in reflection action:", error);
    throw new Error("The mirror of the heart is currently obscured by heavy clouds. Please wait a moment and try again.");
  }
}

export async function generateSymbolicPromptAction(
  input: SymbolicPromptInput
): Promise<SymbolicPromptOutput> {
  try {
    return await withRetry(() => generateSymbolicPrompt(input));
  } catch (error) {
    console.error("Error in generateSymbolicPromptAction:", error);
    throw new Error("The symbolic realm is quiet for now. Please try again in a moment.");
  }
}

export async function continueChatAction(
  input: ChatInput
): Promise<ChatOutput> {
  try {
    return await withRetry(() => continueChat(input));
  } catch (error) {
    console.error("Error in continueChatAction:", error);
    throw new Error("Hikma is in deep contemplation. Please wait a moment before speaking again.");
  }
}

export async function unveilHeartAction(
  input: UnveilHeartInput
): Promise<UnveilHeartOutput> {
  try {
    return await withRetry(() => unveilHeart(input));
  } catch (error) {
    console.error("Error in unveilHeartAction:", error);
    throw new Error("The veil is heavy right now. Let's try to unveil again in a moment.");
  }
}
