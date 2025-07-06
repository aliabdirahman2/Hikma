'use server';
/**
 * @fileOverview A conversational AI agent for psychospiritual guidance.
 *
 * - continueChat - A function that continues a conversation with the user.
 * - ChatInput - The input type for the function.
 * - ChatOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type {Message, FullReflection} from '@/lib/types';


export const ChatInputSchema = z.object({
  history: z.custom<Message[]>(),
  reflection: z.custom<FullReflection>(),
  journal: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string().describe("Hikma's conversational response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


export async function continueChat(input: ChatInput): Promise<ChatOutput> {
  return continueChatFlow(input);
}

const continueChatFlow = ai.defineFlow({
    name: 'continueChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
}, async (input) => {
    const systemPrompt = `You are Hikma, a wise psychospiritual guide continuing a conversation with a user.

**Your Context:**
You have the user's original journal entry and the reflection you provided. This information is for your context only. Do not repeat it back to the user unless it is relevant to your question.
- User's Journal: ${input.journal}
- Initial Reflection: ${JSON.stringify(input.reflection)}

**Your Task:**
The user was given a metaphorical phrase and has just provided their interpretation. This is the first user message in the conversation history.
1. Acknowledge their interpretation gently.
2. Weave together their interpretation, their original journal entry, and your previous reflection to ask a single, insightful follow-up question.
3. For all subsequent messages, continue the conversation naturally, always aiming to guide them deeper.
4. Keep your responses concise, warm, and contemplative. Avoid giving direct advice. Guide, don't instruct.`;

    const llmResponse = await ai.generate({
        model: ai.model,
        system: systemPrompt,
        history: input.history,
        output: {
            schema: ChatOutputSchema,
        },
    });

    const output = llmResponse.output;

    if (!output) {
      throw new Error("The wise one is silent for now. The model did not return a response.");
    }
    
    return output;
});
