
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
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.error(`[HIKMA RETRY] Attempt ${i + 1} failed:`, error instanceof Error ? error.message : error);
      
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export async function reflectionAction(input: ReflectionInput): Promise<ReflectionOutput> {
  // LOUD logging to ensure it appears in the terminal instance
  console.error(">>> [HIKMA ACTION] reflectionAction TRIGGERED");
  console.error(">>> [HIKMA ACTION] Input Symbol:", input.symbol);
  console.error(">>> [HIKMA ACTION] Journal Length:", input.journal.length);

  // Explicit check for the API Key
  if (!process.env.GOOGLE_GENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    console.error("!!! [HIKMA CONFIG ERROR] No Google/Gemini API key found in process.env");
  }
  
  try {
    const result = await withRetry(() => generateReflection(input));
    console.error(">>> [HIKMA ACTION] SUCCESS: Reflection generated.");
    console.error(">>> [HIKMA ACTION] Result Veiled:", result.isVeiled);
    return result;
  } catch (error: any) {
    console.error("!!! [HIKMA ACTION] CRITICAL FAILURE:", error.message);
    if (error.stack) console.error(error.stack);
    
    throw new Error("The mirror of the heart is currently obscured by heavy clouds. Please take a deep breath and try again in a moment.");
  }
}

export async function generateSymbolicPromptAction(input: SymbolicPromptInput): Promise<SymbolicPromptOutput> {
  console.error(">>> [HIKMA ACTION] generateSymbolicPromptAction TRIGGERED");
  try {
    const result = await withRetry(() => generateSymbolicPrompt(input));
    return result;
  } catch (error: any) {
    console.error("!!! [HIKMA ACTION] Symbolic Prompt Failed:", error.message);
    throw new Error("The symbolic realm is quiet for now. Let's try to listen again in a moment.");
  }
}

export async function continueChatAction(input: ChatInput): Promise<ChatOutput> {
  console.error(">>> [HIKMA ACTION] continueChatAction TRIGGERED");
  try {
    const result = await withRetry(() => continueChat(input));
    return result;
  } catch (error: any) {
    console.error("!!! [HIKMA ACTION] Chat Failed:", error.message);
    throw new Error("Hikma is in deep contemplation. Please wait a moment before speaking again.");
  }
}

export async function unveilHeartAction(input: UnveilHeartInput): Promise<UnveilHeartOutput> {
  console.error(">>> [HIKMA ACTION] unveilHeartAction TRIGGERED");
  try {
    const result = await withRetry(() => unveilHeart(input));
    console.error(">>> [HIKMA ACTION] Unveiling Result Ready:", result.isReady);
    return result;
  } catch (error: any) {
    console.error("!!! [HIKMA ACTION] Unveiling Failed:", error.message);
    throw new Error("The veil is heavy right now. Let us breathe together and try again.");
  }
}
