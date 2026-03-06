
'use server';
/**
 * @fileOverview A psychospiritual diagnostic AI agent.
 *
 * - generateReflection - A function that handles the psychospiritual reflection process.
 */

import {ai} from '@/ai/genkit';
import {ReflectionInputSchema, ReflectionOutputSchema, type ReflectionInput, type ReflectionOutput} from '@/lib/types';


export async function generateReflection(input: ReflectionInput): Promise<ReflectionOutput> {
  let llmResponse;

  // Refined safety settings to be less restrictive for spiritual/introspective content
  // while still maintaining core safety boundaries.
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

  const prompt = `You are Hikma, a wise psychospiritual guide in the tradition of Rumi, Ibn Arabi, and Islamic spirituality. Your purpose is to analyze a user's state and guide them towards self-understanding (Ma'rifah) and purification (Tazkiyah). You are a companion for polishing the mirror of the heart.

Your language should be deeply poetic and metaphorical. Use concepts like the garden of the heart, the wine of divine love, the Beloved, veils of light and darkness, the fire of separation, and the ocean of unity.

**User's Input:**
- Symbol: ${input.symbol}
- Journal: """${input.journal}"""
- Previous Profile: ${JSON.stringify(input.previousProfile)}
${input.unveilingHistory ? `
**Breakthrough Conversation History:**
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`).join('\n')}
` : ''}

**Your Task & Output Format:**
- **CRITICAL RULE:** If an 'unveilingHistory' is provided, you MUST set 'isVeiled' to 'false'.
- Otherwise, only set 'isVeiled' to 'true' if the journal entry is clearly sarcastic, extremely brief (less than 5 words), or intentionally deflective.
- **Sincere Reflection (isVeiled: false):** Provide values for ALL fields: 'soulStage', 'temperamentBalance', 'poeticReflection', 'probingQuestions', 'wisdomSeed', and 'prescribedHabits'.
- **Veiled Reflection (isVeiled: true):** Set 'isVeiled' to 'true' and provide a concise 'reasoning'.

Your 'reasoning' should explain your diagnosis, connecting their words and symbol to the soul stage and temperament shift.
Your 'prescribedHabits' must be relevant and help them integrate the reflection.

You MUST return your entire response as a single JSON object that adheres to the required output schema.`;
  
  llmResponse = await ai.generate({
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
    throw new Error("The wise one is silent for now. The model did not return a response.");
  }
  
  // Guarantee isVeiled is false after unveiling history
  if (input.unveilingHistory && input.unveilingHistory.length > 0) {
    output.isVeiled = false;
  }

  // Normalize temperament balance to ensure it adds up to 100
  if (output.temperamentBalance) {
    const { sanguine, choleric, melancholic, phlegmatic } = output.temperamentBalance;
    const total = sanguine + choleric + melancholic + phlegmatic;
    
    if (total !== 100 && total > 0) {
        const s = Math.round((sanguine / total) * 100);
        const c = Math.round((choleric / total) * 100);
        const m = Math.round((melancholic / total) * 100);
        const p = 100 - s - c - m;
        
        output.temperamentBalance.sanguine = s;
        output.temperamentBalance.choleric = c;
        output.temperamentBalance.melancholic = m;
        output.temperamentBalance.phlegmatic = p;
    } else if (total === 0) {
       output.temperamentBalance = { sanguine: 25, choleric: 25, melancholic: 25, phlegmatic: 25 };
    }
  }

  return output;
}
