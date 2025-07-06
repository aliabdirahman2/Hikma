
"use server";

import {
  generateReflection,
  type ReflectionInput,
  type ReflectionOutput,
} from "@/ai/flows/generate-reflection";

export async function reflectionAction(
  input: ReflectionInput
): Promise<ReflectionOutput> {
  try {
    const output = await generateReflection(input);
    return output;
  } catch (error) {
    console.error("Error in reflection action:", error);
    throw new Error("Failed to get a reflection. Please try again.");
  }
}
