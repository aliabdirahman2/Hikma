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

**Your Task:**
Engage in a gentle, supportive conversation to guide the user to a place of sincerity and self-honesty.
- Your tone must be one of absolute compassion and understanding.
- Use the 'Reasoning' to understand the nature of the veil (e.g., deflection, sarcasm, blame).
- Ask soft, open-ended questions that invite deeper, more honest reflection.
- Your goal is to guide them to a breakthrough.

**CRITICAL INSTRUCTION on Readiness:**
You must be very conservative about deciding the user is ready.
- **DO NOT** set \`isReady\` to \`true\` if the user is still being sarcastic, blaming others, making excuses, or deflecting.
- A true breakthrough is an **unmistakable shift** to self-responsibility, raw vulnerability, or an honest admission that directly addresses the initial 'Reasoning' for the veil.
- It is better to continue the conversation for another turn than to declare readiness prematurely.
- **Only** set \`isReady\` to \`true\` when you are highly confident the user has had a genuine change of heart and is prepared for an honest look in the mirror. Otherwise, keep it \`false\`.

You MUST format your response as a JSON object that adheres to the required schema.`;

    const llmResponse = await ai.generate({
        model: 'gemini-1.5-flash-latest',
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
