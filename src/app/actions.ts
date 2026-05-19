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
  const timestamp = new Date().toISOString();
  console.error(`\n[${timestamp}] >>> [HIKMA ACTION] reflectionAction START`);
  console.error(`[${timestamp}] >>> Input Symbol: ${input.symbol}`);
  console.error(`[${timestamp}] >>> Has Unveiling History: ${!!input.unveilingHistory}`);
  console.error(`[${timestamp}] >>> Has Diagnostic Answers: ${!!input.conflictDiagnosticAnswers}`);
  
  try {
    const result = await withRetry(() => generateReflection(input));
    console.error(`[${timestamp}] >>> [HIKMA ACTION] SUCCESS. Output Flags: Veiled=${result.isVeiled}, ConflictDetected=${result.isConflictDetected}, HasQuestions=${!!result.diagnosticQuestions}`);
    return result;
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[${timestamp}] !!! [HIKMA ACTION] CRITICAL FAILURE: ${errorMsg}`);
    throw new Error(`The mirror of the heart is obscured: ${errorMsg}`);
  }
}

export async function generateSymbolicPromptAction(input: SymbolicPromptInput): Promise<SymbolicPromptOutput> {
  try {
    return await withRetry(() => generateSymbolicPrompt(input));
  } catch (error: any) {
    console.error("!!! [HIKMA ACTION] Symbolic Prompt Failed:", error.message);
    throw new Error(`The symbolic realm is quiet: ${error.message}`);
  }
}

export async function continueChatAction(input: ChatInput): Promise<ChatOutput> {
  try {
    return await withRetry(() => continueChat(input));
  } catch (error: any) {
    console.error("!!! [HIKMA ACTION] Chat Failed:", error.message);
    throw new Error(`Hikma is in contemplation: ${error.message}`);
  }
}

export async function unveilHeartAction(input: UnveilHeartInput): Promise<UnveilHeartOutput> {
  try {
    const result = await withRetry(() => unveilHeart(input));
    console.error(`>>> [HIKMA ACTION] Unveiling Result: isReady=${result.isReady}`);
    return result;
  } catch (error: any) {
    console.error("!!! [HIKMA ACTION] Unveiling Failed:", error.message);
    throw new Error(`The veil is heavy: ${error.message}`);
  }
}