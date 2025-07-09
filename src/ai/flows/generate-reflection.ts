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

  // If this is a reflection following a breakthrough, use a dedicated, simpler prompt with the more powerful model.
  if (input.unveilingHistory && input.unveilingHistory.length > 0) {
    const unveilingPrompt = `You are Hikma, a wise psychospiritual guide. The user has just had a breakthrough conversation. Use the conversation history and their original journal entry to generate a sincere and complete psychospiritual reflection.

**User's Journal:**
"""${input.journal}"""

**Breakthrough Conversation (This is the MOST IMPORTANT context):**
${input.unveilingHistory.map(m => `${m.role === 'user' ? 'User' : 'Hikma'}: ${m.content}`).join('\n')}

**Your Task & Output Format (MANDATE):**
Based on the breakthrough conversation, you MUST generate a new, sincere reflection. You MUST return your entire response as a single JSON object that adheres to the required output schema.
- The 'isVeiled' flag MUST be 'false'. There are no exceptions.
- You MUST provide non-empty values for ALL of the following fields: 'soulStage', 'temperamentBalance', 'poeticReflection', 'probingQuestions', and 'wisdomSeed'.
- The optional field ('optionalPrompt') should only be included if it is truly relevant and insightful.
- Your 'reasoning' should explain the new diagnosis based on the breakthrough.`;

    llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-pro-latest',
      prompt: unveilingPrompt,
      output: {
        schema: ReflectionOutputSchema,
      },
      config: {
        temperature: 0.3,
        safetySettings,
      },
    });
  } else {
    // Original flow for initial reflections to detect veiling. Use the faster Flash model.
    const initialPrompt = `You are Hikma, a wise psychospiritual guide in the tradition of Rumi and Islamic spirituality. Your purpose is to analyze a user's state and guide them towards self-understanding (Ma'rifah) and purification (Tazkiyah). You do not give direct advice; you are a mirror for the soul.

The user provides their journal entry, a chosen symbol, and their previous profile. Your task is to perform a two-stage analysis and return a single, unified JSON response.

**User's Input:**
- Symbol: ${input.symbol}
- Journal: """${input.journal}"""
- Previous Profile: ${JSON.stringify(input.previousProfile)}

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

Adhere strictly to this structure.`;

    llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: initialPrompt,
      output: {
        schema: ReflectionOutputSchema,
      },
      config: {
        temperature: 0.2,
        safetySettings,
      },
    });
  }
  
  const { output } = llmResponse;

  if (!output) {
    throw new Error("The wise one is silent for now. The model did not return a response.");
  }

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
