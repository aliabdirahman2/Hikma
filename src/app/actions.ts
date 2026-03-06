
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
      // Log each retry attempt to help track intermittent issues
      console.warn(`[Hikma Loop] Attempt ${i + 1} failed. Retrying...`, error instanceof Error ? error.message : error);
      
      if (i < retries - 1) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export async function reflectionAction(input: ReflectionInput): Promise<ReflectionOutput> {
  console.log("--- [Hikma Loop: Reflection Started] ---");
  console.log("Input Symbol:", input.symbol);
  console.log("Journal Length:", input.journal.length, "characters");
  
  try {
    const result = await withRetry(() => generateReflection(input));
    console.log("--- [Hikma Loop: Reflection Success] ---");
    console.log("Is Veiled:", result.isVeiled);
    return result;
  } catch (error: any) {
    // Detailed logging for the developer console/terminal
    console.error("--- [CRITICAL AI ERROR: Reflection Failed] ---");
    console.error("Message:", error.message);
    if (error.stack) console.error("Stack Trace Snippet:", error.stack.split('\n').slice(0, 3).join('\n'));
    
    throw new Error("The mirror of the heart is currently obscured by heavy clouds. Please take a deep breath and try again in a moment.");
  }
}

export async function generateSymbolicPromptAction(input: SymbolicPromptInput): Promise<SymbolicPromptOutput> {
  console.log("--- [Hikma Loop: Symbolic Prompt Started] ---");
  try {
    const result = await withRetry(() => generateSymbolicPrompt(input));
    console.log("--- [Hikma Loop: Symbolic Prompt Success] ---");
    return result;
  } catch (error: any) {
    console.error("--- [CRITICAL AI ERROR: Symbolic Prompt Failed] ---");
    console.error("Message:", error.message);
    throw new Error("The symbolic realm is quiet for now. Let's try to listen again in a moment.");
  }
}

export async function continueChatAction(input: ChatInput): Promise<ChatOutput> {
  console.log("--- [Hikma Loop: Chat Continued] ---");
  try {
    const result = await withRetry(() => continueChat(input));
    console.log("--- [Hikma Loop: Chat Success] ---");
    return result;
  } catch (error: any) {
    console.error("--- [CRITICAL AI ERROR: Chat Failed] ---");
    console.error("Message:", error.message);
    throw new Error("Hikma is in deep contemplation. Please wait a moment before speaking again.");
  }
}

export async function unveilHeartAction(input: UnveilHeartInput): Promise<UnveilHeartOutput> {
  console.log("--- [Hikma Loop: Unveiling Started] ---");
  try {
    const result = await withRetry(() => unveilHeart(input));
    console.log("--- [Hikma Loop: Unveiling Success] ---");
    console.log("User is Ready:", result.isReady);
    return result;
  } catch (error: any) {
    console.error("--- [CRITICAL AI ERROR: Unveiling Failed] ---");
    console.error("Message:", error.message);
    throw new Error("The veil is heavy right now. Let us breathe together and try again.");
  }
}
