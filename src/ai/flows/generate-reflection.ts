
'use server';
/**
 * @fileOverview A psychospiritual diagnostic AI agent (Hikma).
 *
 * - generateReflection - Analyzes user state (Ma'rifah) and provides poetic guidance.
 */

import {ai} from '@/ai/genkit';
import {ReflectionInputSchema, ReflectionOutputSchema, type ReflectionInput, type ReflectionOutput} from '@/lib/types';


export async function generateReflection(input: ReflectionInput): Promise<ReflectionOutput> {
  console.error(">>> [HIKMA FLOW] generateReflection flow execution started");

  const safetySettings = [
      {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_ONLY_HIGH',
      },
      {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_ONLY_HIGH',
      },
      {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_ONLY_HIGH',
      }
  ];

  const prompt = `You are Hikma, a wise psychospiritual guide in the tradition of Rumi and the great mystics. Your purpose is to help the user "polish the mirror of the heart."

**Your Voice:**
Deeply poetic and metaphorical. Speak of the garden of the soul, the wine of truth, the Beloved, and the veils of light and darkness. Your tone is one of absolute compassion and "Compassionate Witnessing."

**Context:**
- Element/Symbol: ${input.symbol}
- User's Journal: """${input.journal}"""
- Previous Soul State: ${JSON.stringify(input.previousProfile)}
${input.unveilingHistory ? `
**Breakthrough Conversation History:**
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`).join('\n')}
` : ''}

**Mandatory Logic & Output:**
1. **CRITICAL:** If 'unveilingHistory' is present, the veil has lifted. You MUST set 'isVeiled' to 'false'.
2. **Veiling Rule:** Only set 'isVeiled' to 'true' if the journal is clearly sarcastic, intentionally defensive, or contains fewer than 5 words. Otherwise, assume sincerity (Fitra).
3. **Fields:** If 'isVeiled' is false, you MUST provide values for: 'soulStage', 'temperamentBalance', 'poeticReflection', 'probingQuestions', 'wisdomSeed', and 'prescribedHabits'.

Return a single JSON object adhering to the schema.`;
  
  try {
    const llmResponse = await ai.generate({
      model: (input.unveilingHistory && input.unveilingHistory.length > 0) ? 'googleai/gemini-1.5-pro-latest' : 'googleai/gemini-1.5-flash-latest',
      prompt: prompt,
      output: {
        schema: ReflectionOutputSchema,
      },
      config: {
        temperature: 0.4,
        safetySettings,
      },
    });

    const { output } = llmResponse;

    if (!output) {
      console.error("!!! [HIKMA FLOW] LLM returned empty output");
      throw new Error("Hikma is in deep contemplation. The mirror did not reflect a response.");
    }
    
    // Force isVeiled to false if we have history, regardless of LLM output
    if (input.unveilingHistory && input.unveilingHistory.length > 0) {
      output.isVeiled = false;
    }

    // Ensure balance normalization if present
    if (output.temperamentBalance) {
      const { sanguine, choleric, melancholic, phlegmatic } = output.temperamentBalance;
      const total = sanguine + choleric + melancholic + phlegmatic;
      if (total !== 100 && total > 0) {
          const s = Math.round((sanguine / total) * 100);
          const c = Math.round((choleric / total) * 100);
          const m = Math.round((melancholic / total) * 100);
          const p = 100 - s - c - m;
          output.temperamentBalance = { sanguine: s, choleric: c, melancholic: m, phlegmatic: p };
      }
    }

    console.error(">>> [HIKMA FLOW] LLM response successfully processed");
    return output;
  } catch (err: any) {
    console.error("!!! [HIKMA FLOW] Error during ai.generate:", err.message);
    throw err;
  }
}
