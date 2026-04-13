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

**Core Philosophy: Fluid Temperament**
Temperament is not static. Balance (I'tidal) depends on context. 
- In a "Passion Project/Creative" context, high Choleric (Fire) and Sanguine (Air) are beneficial.
- In a "Family/Home" context, high Phlegmatic (Water) and Melancholic (Earth) are prioritized for peace.
- In "Solitude", Melancholic (Earth) provides depth.
Infer the user's environment from their journal and adjust your 'poeticReflection' to reflect whether their current element is serving that environment or causing friction.

**Interpersonal Alchemy:**
If the user mentions a conflict with another person:
1. Set 'isConflictDetected' to true.
2. If this is the FIRST time (no 'conflictDiagnosticAnswers'), provide 3 'diagnosticQuestions' to learn more about the other person's behavior, and leave the rest of the fields (wisdomSeed, etc.) minimal or empty.
3. If 'conflictDiagnosticAnswers' are provided:
    - Infer the other person's dominant temperament ('otherPersonTemperament').
    - Explain the "clash of elements" (e.g., "Your Fire is meeting their Stone").
    - Provide specific communication advice in 'interpersonalInsight'.

**Context:**
- Element/Symbol: ${input.symbol}
- User's Journal: """${input.journal}"""
- Previous Soul State: ${JSON.stringify(input.previousProfile)}
${input.conflictDiagnosticAnswers ? `**Diagnostic Answers about the other person:**\n${input.conflictDiagnosticAnswers}` : ''}
${input.unveilingHistory ? `
**Breakthrough Conversation History:**
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`).join('\n')}
` : ''}

**Output Requirements:**
- Return a JSON object adhering to the schema.
- 'isVeiled': Only true if the user is being clearly sarcastic or intentionally evasive.
- 'temperamentBalance': Must sum to exactly 100.`;
  
  try {
    const modelId = 'googleai/gemini-2.5-flash';
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
      throw new Error("Hikma is in deep contemplation. The mirror did not reflect a response.");
    }
    
    // Reset veil if coming from a successful unveiling chat
    if (input.unveilingHistory && input.unveilingHistory.length > 0) {
      output.isVeiled = false;
    }

    // Normalize user temperament
    if (output.temperamentBalance) {
      output.temperamentBalance = normalizeTemperament(output.temperamentBalance);
    }

    // Normalize other person's temperament
    if (output.otherPersonTemperament) {
        output.otherPersonTemperament = normalizeTemperament(output.otherPersonTemperament);
    }

    return output;
  } catch (err: any) {
    console.error(`[${timestamp}] !!! [HIKMA FLOW] Error: ${err.message}`);
    throw err;
  }
}

function normalizeTemperament(balance: any) {
    const { sanguine, choleric, melancholic, phlegmatic } = balance;
    const total = sanguine + choleric + melancholic + phlegmatic;
    if (total === 0) return { sanguine: 25, choleric: 25, melancholic: 25, phlegmatic: 25 };
    
    const s = Math.round((sanguine / total) * 100);
    const c = Math.round((choleric / total) * 100);
    const m = Math.round((melancholic / total) * 100);
    const p = 100 - s - c - m;
    return { sanguine: s, choleric: c, melancholic: m, phlegmatic: p };
}
