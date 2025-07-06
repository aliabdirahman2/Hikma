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
import type { ReflectionInput, ReflectionOutput } from "@/lib/types";


export async function reflectionAction(
  input: ReflectionInput
): Promise<ReflectionOutput> {
  try {
    const output = await generateReflection(input);
    return output;
  } catch (error) {
    console.error("Error in reflection action:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("Failed to get a reflection. Please try again.");
  }
}

export async function generateSymbolicPromptAction(
  input: SymbolicPromptInput
): Promise<SymbolicPromptOutput> {
  try {
    const output = await generateSymbolicPrompt(input);
    return output;
  } catch (error) {
    console.error("Error in generateSymbolicPromptAction:", error);
    throw new Error("Failed to get a symbolic prompt. Please try again.");
  }
}

export async function continueChatAction(
  input: ChatInput
): Promise<ChatOutput> {
  try {
    const output = await continueChat(input);
    return output;
  } catch (error) {
    console.error("Error in continueChatAction:", error);
    throw new Error("Failed to get a chat response. Please try again.");
  }
}
