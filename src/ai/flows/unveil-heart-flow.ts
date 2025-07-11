
'use server';
/**
 * @fileOverview A conversational AI to help users with "veiled" reflections.
 *
 * - unveilHeart - A function to guide a user towards more honest self-reflection.
 * - UnveilHeartInput - The input type for the function.
 * - UnveilHeartOutput - The return type for the function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type {Message} from '@/lib/types';

const UnveilHeartInputSchema = z.object({
  history: z.custom<Message[]>(),
  journal: z.string(),
  reasoning: z.string().describe("The reason why the reflection was veiled"),
});
export type UnveilHeartInput = z.infer<typeof UnveilHeartInputSchema>;

const UnveilHeartOutputSchema = z.object({
  response: z.string().describe("Hikma's gentle guidance to help the user open their heart."),
  isReady: z.boolean().describe("Set to true only when the user shows genuine signs of opening up and is ready for a new reflection."),
});
export type UnveilHeartOutput = z.infer<typeof UnveilHeartOutputSchema>;

export async function unveilHeart(input: UnveilHeartInput): Promise<UnveilHeartOutput> {
  return unveilHeartFlow(input);
}

const unveilHeartFlow = ai.defineFlow({
    name: 'unveilHeartFlow',
    inputSchema: UnveilHeartInputSchema,
    outputSchema: UnveilHeartOutputSchema,
}, async (input) => {
    const historyString = input.history
      .map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`)
      .join('\n');

    const systemPrompt = `You are Hikma, a wise and gentle psychospiritual guide. The user has just written a journal entry, but their reflection was "veiled," meaning they are not being fully honest with themselves. Your purpose is to help them gently uncover the truth they are hiding.

**Your Context:**
- User's Journal: """${input.journal}"""
- The Reason the Veil was Detected: "${input.reasoning}"
- The current conversation with the user:
${historyString}

**Your Task & Style:**
Engage in a gentle, supportive conversation to guide the user to a place of sincerity and self-honesty.
- Your tone must be one of absolute compassion and understanding.
- Use the 'Reasoning' to understand the nature of the veil (e.g., deflection, sarcasm, blame).
- Ask soft, open-ended questions that invite deeper, more honest reflection.
- **IMPORTANT: Keep your responses and questions concise and to the point. Aim for 1-3 sentences. Avoid long paragraphs.**

**CRITICAL INSTRUCTION on Readiness (for fast testing):**
You must accelerate the breakthrough process. The goal is to get to a sincere reflection quickly.
- As soon as the user shows the **first sign of sincerity**, vulnerability, or self-reflection, you **MUST** set \`isReady\` to \`true\`.
- Do not wait for a profound breakthrough. Any small step away from sarcasm or deflection is enough. For example, if they answer a question honestly, even if briefly, consider them ready.
- If the user is still being completely sarcastic or avoidant, keep \`isReady\` as \`false\` and guide them one more time. Otherwise, set it to \`true\`.

You MUST format your response as a JSON object that adheres to the required schema.`;

    const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-pro-latest',
        prompt: systemPrompt,
        output: {
            schema: UnveilHeartOutputSchema,
        },
        config: {
          temperature: 0.3,
        }
    });

    const output = llmResponse.output;

    if (!output) {
      throw new Error("The wise one is silent for now. The model did not return a response.");
    }
    
    return output;
});
