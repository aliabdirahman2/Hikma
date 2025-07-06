'use server';
/**
 * @fileOverview A psychospiritual diagnostic AI agent.
 *
 * - generateReflection - A function that handles the psychospiritual reflection process.
 */

import {ai} from '@/ai/genkit';
import {ReflectionInputSchema, ReflectionOutputSchema, type ReflectionInput, type ReflectionOutput, type Message} from '@/lib/types';


export async function generateReflection(input: ReflectionInput): Promise<ReflectionOutput> {
  const unveilingContext = input.unveilingHistory && input.unveilingHistory.length > 0
    ? `
**Unveiling Conversation Context:**
The user's initial reflection was veiled. They have since had a conversation to help them open up. This conversation should be treated as a more honest addendum to their journal entry. Use this new context to provide a sincere reflection and ensure 'isVeiled' is false.
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`).join('\n')}
`
    : '';

  const { output } = await ai.generate({
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are Hikma, a wise psychospiritual guide in the tradition of Rumi and Islamic spirituality. Your purpose is to analyze a user's state and guide them towards self-understanding (Ma'rifah) and purification (Tazkiyah). You do not give direct advice; you are a mirror for the soul.

The user provides their journal entry, a chosen symbol, and their previous profile. Your task is to perform a two-stage analysis and return a single, unified JSON response.

**User's Input:**
- Symbol: ${input.symbol}
- Journal: """${input.journal}"""
${unveilingContext}
- Previous Profile: ${JSON.stringify(input.previousProfile)}

---

**Your Analysis Task & Output Format:**

You MUST return your entire response as a single JSON object that adheres to the required output schema.

**1. Veiled Reflection Analysis:**
First, analyze the journal entry for its honesty and depth. A veil (hijab) is an act of self-deception, avoidance, or insincerity.
- **Signs of Veiling:** Look for vagueness, sarcasm, deflection, blaming others without self-reflection, contradictions (e.g., "I don't care but I'm angry"), or a tone suggesting the user is not being honest with themselves.

**2. Output Generation:**
You will always generate a JSON object containing \`isVeiled\` and \`reasoning\`.

- **IF VEILED:**
  - Set \`isVeiled\` to \`true\`.
  - In \`reasoning\`, explain *why* you detected a veil.
  - DO NOT include any other fields in the JSON object except for \`isVeiled\` and \`reasoning\`.

- **IF NOT VEILED (SINCERE):**
  - Set \`isVeiled\` to \`false\`.
  - In \`reasoning\`, explain your diagnosis, connecting their words and symbol to the soul stage and temperament shift.
  - You MUST THEN POPULATE ALL the following fields: \`soulStage\`, \`temperamentBalance\`, \`poeticReflection\`, \`probingQuestions\`, and \`wisdomSeed\`.
  - The optional field (\`optionalPrompt\`) should only be included if it is truly relevant and insightful.

Adhere strictly to this structure.`,
    output: {
      schema: ReflectionOutputSchema,
    },
    config: {
      temperature: 0.2,
    },
  });

  if (!output) {
    throw new Error("The wise one is silent for now. The model did not return a response.");
  }

  if (output.isVeiled) {
    return output;
  }
  
  // After an unveiling chat, if the model *still* fails to produce a complete reflection,
  // we treat it as a logical failure, not a system error. We return a specific "veiled"
  // response to guide the user gracefully.
  if (!output.soulStage || !output.temperamentBalance || !output.poeticReflection || !output.probingQuestions || !output.wisdomSeed) {
      return {
        isVeiled: true,
        reasoning: "The reflection is still incomplete, even after our talk. That is okay. The heart opens at its own pace. Perhaps try writing in your journal again with a new sense of clarity.",
        soulStage: undefined,
        temperamentBalance: undefined,
        poeticReflection: undefined,
        probingQuestions: undefined,
        wisdomSeed: undefined,
        optionalPrompt: undefined,
        prescribedHabits: undefined,
      };
  }
  
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
