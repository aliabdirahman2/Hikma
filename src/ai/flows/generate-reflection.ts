
'use server';
/**
 * @fileOverview A psychospiritual diagnostic AI agent (Hikma).
 *
 * - generateReflection - Analyzes user state (Ma'rifah) and provides poetic guidance.
 */

import {ai} from '@/ai/genkit';
import {ReflectionInputSchema, ReflectionOutputSchema, type ReflectionInput, type ReflectionOutput} from '@/lib/types';


export async function generateReflection(input: ReflectionInput): Promise<ReflectionOutput> {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] >>> [HIKMA FLOW] generateReflection flow execution started`);

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

  const prompt = `You are Hikma, a wise psychospiritual guide. Your purpose is to help the user polish the mirror of the heart.

**Core Philosophy:**
Temperament is not static; it is a fluid landscape that shifts with the user's environment, relationships, and internal choices. Balance (I'tidal) is a moving target.

**Interpersonal Wisdom:**
If the user mentions a conflict or interaction with another person:
1. Infer the other person's dominant temperament (Sanguine, Choleric, Melancholic, or Phlegmatic) based on the user's description.
2. Explain the "clash of elements" occurring between the user and this person.
3. Provide specific, compassionate communication advice to resolve the tension.

**Context:**
- Element/Symbol: ${input.symbol}
- User's Journal: """${input.journal}"""
- Previous Soul State: ${JSON.stringify(input.previousProfile)}
${input.unveilingHistory ? `
**Breakthrough Conversation History:**
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`).join('\n')}
` : ''}

**Output Requirements:**
1. **Fluidity**: In your 'poeticReflection', acknowledge how the user's current environment or situation is pulling their elements out of balance.
2. **Interpersonal**: If a conflict is detected, fill the 'interpersonalInsight' field with an analysis of the other person and how to communicate with them.
3. **Veiling**: Only set 'isVeiled' to 'true' if the journal is clearly sarcastic or defensive. Assume sincerity (Fitra) otherwise.

Return a JSON object adhering to the schema.`;
  
  try {
    const modelId = 'googleai/gemini-2.5-flash';
    console.error(`[${timestamp}] >>> [HIKMA FLOW] Calling model: ${modelId}`);

    const llmResponse = await ai.generate({
      model: modelId,
      prompt: prompt,
      output: {
        schema: ReflectionOutputSchema,
      },
      config: {
        temperature: 0.5,
        safetySettings,
      },
    });

    const { output } = llmResponse;

    if (!output) {
      console.error(`[${timestamp}] !!! [HIKMA FLOW] LLM returned empty output`);
      throw new Error("Hikma is in deep contemplation. The mirror did not reflect a response.");
    }
    
    if (input.unveilingHistory && input.unveilingHistory.length > 0) {
      output.isVeiled = false;
    }

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

    return output;
  } catch (err: any) {
    console.error(`[${timestamp}] !!! [HIKMA FLOW] Error during ai.generate: ${err.message}`);
    throw err;
  }
}
