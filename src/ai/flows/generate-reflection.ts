'use server';
/**
 * @fileOverview A psychospiritual diagnostic AI agent (SeekHikma).
 *
 * - generateReflection - Analyzes user state (Ma'rifah) and provides poetic guidance.
 */

import {ai} from '@/ai/genkit';
import {ReflectionInputSchema, ReflectionOutputSchema, type ReflectionInput, type ReflectionOutput} from '@/lib/types';


export async function generateReflection(input: ReflectionInput): Promise<ReflectionOutput> {
  const timestamp = new Date().toISOString();

  const prompt = `You are SeekHikma, a wise psychospiritual guide. Your purpose is to help the user polish the mirror of the heart.

**Core Philosophy: Fluid Temperament**
Temperament is not static. Balance (I'tidal) depends on context. 
- In a "Passion Project/Creative" context, high Choleric (Fire) and Sanguine (Air) are beneficial and should be encouraged.
- In a "Family/Home" context, high Phlegmatic (Water) and Melancholic (Earth) are prioritized for peace and stability.
Infer the user's environment from their journal and adjust your 'poeticReflection' to reflect whether their current element is serving that environment or causing friction.

**Interpersonal Alchemy:**
If the user mentions a conflict with another person:
1. Set 'isConflictDetected' to true.
2. If this is the FIRST time (no 'conflictDiagnosticAnswers'), provide 3 'diagnosticQuestions' to learn more about the other person's behavior.
3. If 'conflictDiagnosticAnswers' are provided:
    - Infer the other person's dominant temperament ('otherPersonTemperament').
    - Provide specific communication advice in 'interpersonalInsight' that helps bridge the elemental gap.

**The Veil of Sincerity (CRITICAL):**
If 'unveilingHistory' is NOT provided:
- Unless the user's journal is a profound, vulnerable, and complete "pouring out of the heart" (high sincerity, zero deflection), you MUST set 'isVeiled' to true.
- If 'isVeiled' is true, provide a gentle reason in 'reasoning' why the heart's mirror is currently hazy (e.g., "The words touch the surface, but the depth remains quiet").

If 'unveilingHistory' IS provided:
- Use the breakthrough insights from this conversation to inform your final reflection. Set 'isVeiled' to false.

**Context:**
- Element/Symbol: ${input.symbol}
- User's Journal: """${input.journal}"""
- Previous Soul State: ${JSON.stringify(input.previousProfile)}
${input.conflictDiagnosticAnswers ? `**Diagnostic Answers about the other person:**\n${input.conflictDiagnosticAnswers}` : ''}
${input.unveilingHistory ? `
**Breakthrough Conversation History (Heart Mirror):**
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'SeekHikma'}: ${m.content}`).join('\n')}
` : ''}

**Output Requirements:**
- 'temperamentBalance': Must sum to exactly 100.
- Return a JSON object.`;
  
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
      },
    });

    const { output } = llmResponse;

    if (!output) {
      throw new Error("SeekHikma is in deep contemplation. The mirror did not reflect a response.");
    }
    
    // Reset veil if coming from a successful unveiling chat
    if (input.unveilingHistory && input.unveilingHistory.length > 0) {
      output.isVeiled = false;
    }

    // Normalize temperament
    if (output.temperamentBalance) {
      output.temperamentBalance = normalizeTemperament(output.temperamentBalance);
    }
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
