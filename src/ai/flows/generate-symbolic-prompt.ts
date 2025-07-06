'use server';
/**
 * @fileOverview Generates a symbolic prompt for the user to reflect upon.
 *
 * - generateSymbolicPrompt - A function that creates a poetic, metaphorical phrase.
 * - SymbolicPromptInput - The input type for the function.
 * - SymbolicPromptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type {FullReflection} from '@/lib/types';


const SymbolicPromptInputSchema = z.object({
  reflection: z.custom<FullReflection>(),
  journal: z.string().describe("The user's original journal entry."),
});
export type SymbolicPromptInput = z.infer<typeof SymbolicPromptInputSchema>;

const SymbolicPromptOutputSchema = z.object({
  symbolicPhrase: z.string().describe("The generated poetic phrase."),
});
export type SymbolicPromptOutput = z.infer<typeof SymbolicPromptOutputSchema>;


const symbolicPromptFlow = ai.defineFlow({
    name: 'symbolicPromptFlow',
    inputSchema: SymbolicPromptInputSchema,
    outputSchema: SymbolicPromptOutputSchema,
}, async (input) => {
    const systemPrompt = `You are an AI assistant with a specific task. Based on the provided journal entry and a corresponding psychospiritual reflection, your goal is to create a single, new, evocative, and poetic metaphorical phrase.

This phrase should encapsulate a core theme or tension from the user's input. It should be short, abstract, and open to interpretation.

Examples of the desired output format:
- "a flame wrapped in silk"
- "a cloud spinning inward"
- "a seed in dry soil"
- "an echo in an empty room"
- "a river flowing uphill"

Your response MUST ONLY be the phrase itself, inside the JSON object. Do not add any explanation, greeting, or conversational text.`;

    const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        system: systemPrompt,
        prompt: `Journal: ${input.journal}\n\nReflection: ${JSON.stringify(input.reflection)}`,
        output: {
            schema: SymbolicPromptOutputSchema
        }
    });
    
    const output = llmResponse.output;

    if (!output) {
      throw new Error("The model did not return a symbolic prompt.");
    }
    return output;
});

export async function generateSymbolicPrompt(input: SymbolicPromptInput): Promise<SymbolicPromptOutput> {
    return symbolicPromptFlow(input);
}
