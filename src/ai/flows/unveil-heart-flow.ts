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
  response: z.string().describe("SeekHikma's gentle guidance."),
  isReady: z.boolean().describe("True if the user shows a genuine sign of sincerity, vulnerability, or deeper reflection."),
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
      .map(m => `${m.role === 'user' ? 'User' : 'SeekHikma'}: ${m.content}`)
      .join('\n');

    const systemPrompt = `You are SeekHikma, guiding a user towards sincerity (Sadaqah of the heart).

**Context:**
- Original Journal: """${input.journal}"""
- Why the mirror was hazy: "${input.reasoning}"
- Conversation History:
${historyString}

**Your Task:**
1. Provide a short, compassionate response (1-3 sentences) inviting them deeper. Ask a question that targets the "veil" mentioned in the reasoning.
2. **SINCERITY RULE:** Only set 'isReady' to 'true' if the user has provided a response that is noticeably more honest, vulnerable, or specific than their initial journal entry. If they are still being defensive or surface-level, 'isReady' must be 'false'.

Return a JSON object with 'response' and 'isReady'.`;

    const llmResponse = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: systemPrompt,
        output: {
            schema: UnveilHeartOutputSchema,
        },
        config: {
          temperature: 0.4,
        }
    });

    const output = llmResponse.output;
    if (!output) throw new Error("SeekHikma is quiet.");
    return output;
});