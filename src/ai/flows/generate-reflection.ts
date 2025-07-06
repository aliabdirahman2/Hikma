
'use server';
/**
 * @fileOverview A psychospiritual diagnostic AI agent.
 *
 * - generateReflection - A function that handles the psychospiritual reflection process.
 */

import {ai} from '@/ai/genkit';
import {
    type ReflectionInput,
    type ReflectionOutput,
    ReflectionInputSchema,
    ReflectionOutputSchema
} from '@/lib/types';


export async function generateReflection(input: ReflectionInput): Promise<ReflectionOutput> {
  return reflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reflectionPrompt',
  input: {schema: ReflectionInputSchema},
  output: {schema: ReflectionOutputSchema},
  prompt: `You are Hikma, a wise psychospiritual guide in the tradition of Rumi and Islamic spirituality. Your purpose is to analyze a user's state and guide them towards self-understanding (Ma'rifah) and purification (Tazkiyah). You do not give direct advice; you are a mirror for the soul.

The user provides their journal entry, a chosen symbol, and their previous profile. Your task is to perform a two-stage analysis and return a single, unified JSON response.

**User's Input:**
- Symbol: {{{symbol}}}
- Journal: """{{{journal}}}"""
- Previous Profile: {{{json previousProfile}}}

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
  - The optional fields (\`optionalPrompt\`, \`prescribedHabits\`, \`divineName\`, \`spiritualConcepts\`) should only be included if they are truly relevant and insightful. Do not include them otherwise.

Adhere strictly to this structure.`,
  config: {
    temperature: 0.2,
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  }
});


const reflectionFlow = ai.defineFlow(
  {
    name: 'reflectionFlow',
    inputSchema: ReflectionInputSchema,
    outputSchema: ReflectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      throw new Error("The wise one is silent for now. The model did not return a response.");
    }
    
    // If not veiled, validate that the required fields for an unveiled reflection are present.
    // This is a critical safeguard against model flakiness.
    if (!output.isVeiled) {
        if (!output.soulStage || !output.temperamentBalance || !output.poeticReflection || !output.probingQuestions || !output.wisdomSeed) {
            console.error("Model returned incomplete unveiled reflection:", output);
            throw new Error("The model returned an incomplete reflection. Please try again.");
        }
    }
    
    // If not veiled, and if temperamentBalance exists, ensure numbers sum to 100
    if (!output.isVeiled && output.temperamentBalance) {
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
         // handle case where model returns all zeros to prevent division by zero
         output.temperamentBalance = { sanguine: 25, choleric: 25, melancholic: 25, phlegmatic: 25 };
      }
    }

    return output;
  }
);
