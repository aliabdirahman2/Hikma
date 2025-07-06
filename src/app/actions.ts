"use server";

import {
  chat,
  type ChatInput,
  type ChatOutput,
} from "@/ai/flows/generate-reflection";

export async function chatAction(
  input: ChatInput
): Promise<ChatOutput> {
  try {
    const output = await chat(input);
    return output;
  } catch (error) {
    console.error("Error in chat action:", error);
    throw new Error("Failed to get a response. Please try again.");
  }
}
