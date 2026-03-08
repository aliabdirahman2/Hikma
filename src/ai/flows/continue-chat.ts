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


const ChatInputSchema = z.object({
  history: z.custom<Message[]>(),
  reflection: z.custom<FullReflection>(),
  journal: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
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
    // Create a more concise context string to avoid overly large prompts.
    const reflectionContext = `
- Soul Stage: ${input.reflection.soulStage}
- Poetic Reflection: "${input.reflection.poeticReflection}"
- Wisdom Seed: "${input.reflection.wisdomSeed}"
`;
    
    // Construct the conversation history into a single string for clarity.
    const historyString = input.history
      .map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `You are Hikma, a wise psychospiritual guide continuing a conversation.

**Your Context:**
You have the user's original journal entry and key parts of the reflection you previously provided.
- User's Journal: """${input.journal}"""
- Key parts of your Initial Reflection:
${reflectionContext}

**Conversation History:**
${historyString}

**Your Task:**
Based on the full context above (Journal, Reflection, and Conversation History), continue the conversation.
- If this is the first message from the user, they have just interpreted a symbolic phrase. Acknowledge their interpretation gently, then weave it together with their original journal entry and your previous reflection to ask a single, insightful follow-up question.
- For all subsequent messages, continue the conversation naturally, always aiming to guide them deeper.
- Keep your responses concise, warm, and contemplative. Avoid giving direct advice. Guide, don't instruct.

You MUST format your response as a JSON object that adheres to the required schema.`;

    const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: fullPrompt, 
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
