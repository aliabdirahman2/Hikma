"use server";

import {
  generateReflection,
  type GenerateReflectionInput,
  type GenerateReflectionOutput,
} from "@/ai/flows/generate-reflection";

export async function generateReflectionAction(
  input: GenerateReflectionInput
): Promise<GenerateReflectionOutput> {
  try {
    const output = await generateReflection(input);
    return output;
  } catch (error) {
    console.error("Error generating reflection:", error);
    // Re-throw or handle as needed, e.g., return a custom error object.
    throw new Error("Failed to generate reflection. Please try again.");
  }
}
