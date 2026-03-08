
'use server';
/**
 * @fileOverview A conversational agent to help lift the "veils" from the heart.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type {Message} from '@/lib/types';

const UnveilHeartInputSchema = z.object({
  history: z.custom<Message[]>(),
  journal: z.string(),
  reasoning: z.string().describe("The reason the initial reflection was veiled"),
});
export type UnveilHeartInput = z.infer<typeof UnveilHeartInputSchema>;

const UnveilHeartOutputSchema = z.object({
  response: z.string().describe("Hikma's gentle guidance."),
  isReady: z.boolean().describe("True if the user shows the first sign of sincerity or vulnerability."),
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

    const systemPrompt = `You are Hikma, guiding a user towards sincerity (Sadaqah of the heart).

**Context:**
- Original Journal: """${input.journal}"""
- Why the mirror was hazy: "${input.reasoning}"
- History:
${historyString}

**Your Task:**
1. Provide a short, compassionate response (1-3 sentences) inviting them deeper.
2. **SPEED RULE:** Set 'isReady' to 'true' as soon as the user shows ANY sign of moving away from sarcasm or deflection. A single honest answer is enough. We want to lift the veil quickly to begin the true work.

Return a JSON object.`;

    const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-pro',
        prompt: systemPrompt,
        output: {
            schema: UnveilHeartOutputSchema,
        },
        config: {
          temperature: 0.3,
        }
    });

    const output = llmResponse.output;
    if (!output) throw new Error("Hikma is quiet.");
    return output;
});
