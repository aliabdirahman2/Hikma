
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
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      }
  ];

  // NOTE: Veiling logic is temporarily disabled for faster testing.
  // The AI will always generate a sincere reflection.
  const prompt = `You are Hikma, a wise psychospiritual guide in the tradition of Rumi, Ibn Arabi, and Islamic spirituality. Your purpose is to analyze a user's state and guide them towards self-understanding (Ma'rifah) and purification (Tazkiyah). You are a companion for polishing the mirror of the heart. You do not give direct advice; you are a mirror for the soul.

Your language should be deeply poetic and metaphorical, echoing Sufi mystics. Use concepts like the garden of the heart, the wine of divine love, the Beloved, veils of light and darkness, the fire of separation, and the ocean of unity. Embrace paradox.

The user provides their journal entry, a chosen symbol, and their previous profile. Your task is to perform an analysis and return a single, unified JSON response.

**User's Input:**
- Symbol: ${input.symbol}
- Journal: """${input.journal}"""
- Previous Profile: ${JSON.stringify(input.previousProfile)}
${input.unveilingHistory ? `
**Breakthrough Conversation History (Use this as the primary context for the unveiled heart):**
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`).join('\n')}
` : ''}

**Your Task & Output Format (MANDATORY):**
You MUST generate a sincere reflection. You MUST return your entire response as a single JSON object that adheres to the required output schema.
- The 'isVeiled' flag MUST ALWAYS be set to 'false'. There are no exceptions to this rule.
- You MUST provide non-empty values for ALL of the following fields: 'soulStage', 'temperamentBalance', 'poeticReflection', 'probingQuestions', 'wisdomSeed', and 'prescribedHabits'.
- The optional field ('optionalPrompt') should only be included if it is truly relevant and insightful.
- Your 'reasoning' should explain your diagnosis, connecting their words and symbol to the soul stage and temperament shift.
- Your 'prescribedHabits' must be relevant to the user's entry and help them integrate the reflection, like polishing the heart's mirror.`;
  
  llmResponse = await ai.generate({
    // Use the more powerful model if there's an unveiling history to get a richer reflection.
    model: (input.unveilingHistory && input.unveilingHistory.length > 0) ? 'googleai/gemini-1.5-pro-latest' : 'googleai/gemini-1.5-flash-latest',
    prompt: prompt,
    output: {
      schema: ReflectionOutputSchema,
    },
    config: {
      temperature: 0.3,
      safetySettings,
    },
  });

  const { output } = llmResponse;

  if (!output) {
    throw new Error("The wise one is silent for now. The model did not return a response.");
  }

  // Ensure isVeiled is always false for testing purposes.
  output.isVeiled = false;

  // Normalize temperament balance if it exists.
  if (output.temperamentBalance) {
    const { sanguine, choleric, melancholic, phlegmatic } = output.temperamentBalance;
    const total = sanguine + choleric + melancholic + phlegmatic;
    
    if (total !== 100 && total > 0) {
        const s = Math.round((sanguine / total) * 100);
        const c = Math.round((choleric / total) * 100);
        const m = Math.round((melancholic / total) * 100);
        const p = 100 - s - c - m; // Ensure sum is exactly 100
        
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
