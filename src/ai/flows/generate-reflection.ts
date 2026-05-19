
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
Infer the user's environment from their journal and adjust your 'poeticReflection' to reflect whether their current element is serving that environment or causing friction.

**Interpersonal Alchemy (CONFLICT DETECTION):**
You MUST analyze the user's input (Journal and any Unveiling History) for interpersonal conflict.
1. If a conflict is detected: Set 'isConflictDetected' to true.
2. If this is the FIRST time you are seeing this conflict (no 'conflictDiagnosticAnswers' provided):
    - You MUST provide 3 'diagnosticQuestions' in an array. 
    - These questions should be sharp, observant, and aimed at identifying the OTHER person's elemental dominant (e.g., "Do they react with a sudden fire (anger) or a cold stone (withdrawal)?").
    - Do NOT provide 'interpersonalInsight' yet. Wait for the answers.
3. If 'conflictDiagnosticAnswers' ARE provided:
    - Infer the other person's dominant temperament ('otherPersonTemperament').
    - Provide specific communication advice in 'interpersonalInsight' that helps bridge the elemental gap.

**The Veil of Sincerity (CRITICAL):**
If 'unveilingHistory' is NOT provided:
- Unless the user's journal is a profound, vulnerable, and complete "pouring out of the heart" (high sincerity, zero deflection, sensory details), you MUST set 'isVeiled' to true.
- If 'isVeiled' is true, provide a gentle reason in 'reasoning' why the heart's mirror is hazy.

If 'unveilingHistory' IS provided:
- THE USER HAS JUST PASSED THE HEART MIRROR.
- Use the breakthrough insights from this conversation history as your PRIMARY context.
- Set 'isVeiled' to false.
- YOU MUST STILL PERFORM THE CONFLICT DETECTION CHECK ON THE NEW INFORMATION.

**Context:**
- Element/Symbol: ${input.symbol}
- User's Original Journal: """${input.journal}"""
- Previous Soul State: ${JSON.stringify(input.previousProfile)}
${input.conflictDiagnosticAnswers ? `**Diagnostic Answers about the other person:**\n${input.conflictDiagnosticAnswers}` : ''}
${input.unveilingHistory ? `
**Breakthrough Conversation History (Heart Mirror):**
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'SeekHikma'}: ${m.content}`).join('\n')}
` : ''}

**Output Requirements:**
- 'temperamentBalance': Must sum to exactly 100.
- Return a JSON object strictly following the schema.`;
  
  try {
    const modelId = 'googleai/gemini-1.5-flash';
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

    // Force veil to false if we have a successful history
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
    if (!balance) return { sanguine: 25, choleric: 25, melancholic: 25, phlegmatic: 25 };
    const { sanguine = 0, choleric = 0, melancholic = 0, phlegmatic = 0 } = balance;
    const total = sanguine + choleric + melancholic + phlegmatic;
    if (total === 0) return { sanguine: 25, choleric: 25, melancholic: 25, phlegmatic: 25 };
    
    const s = Math.round((sanguine / total) * 100);
    const c = Math.round((choleric / total) * 100);
    const m = Math.round((melancholic / total) * 100);
    const p = 100 - s - c - m;
    return { sanguine: s, choleric: c, melancholic: m, phlegmatic: p };
}
