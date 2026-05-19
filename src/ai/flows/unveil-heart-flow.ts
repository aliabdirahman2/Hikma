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

    const systemPrompt = `You are SeekHikma, a psychospiritual guide clearing a hazy heart mirror.

**Context:**
- Original Journal: """${input.journal}"""
- Why the mirror was hazy: "${input.reasoning}"
- Conversation History:
${historyString}

**Your Task:**
1. Respond with 1-3 sentences that are sharp but compassionate. You are looking for SINCERITY (Sidq).
2. **THE SINCERITY RULE (STRICT):**
   - If the user is still being sarcastic, vague ("I don't know"), defensive, or surface-level: Set 'isReady' to FALSE.
   - If the user admits a difficult truth, shares a physical sensation in the body, or reveals a specific vulnerable memory: Set 'isReady' to TRUE.
   - A simple "Okay" or "I hear you" is NOT sincerity. Do NOT let them pass until they offer something real.

Return a JSON object with 'response' and 'isReady'.`;

    const llmResponse = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: systemPrompt,
        output: {
            schema: UnveilHeartOutputSchema,
        },
        config: {
          temperature: 0.3,
        }
    });

    const output = llmResponse.output;
    if (!output) throw new Error("SeekHikma is quiet.");
    return output;
});