
'use server';
/**
 * @fileOverview A psychospiritual diagnostic AI agent.
 *
 * - generateReflection - A function that handles the psychospiritual reflection process.
 * - ReflectionInput - The input type for the generateReflection function.
 * - ReflectionOutput - The return type for the generateReflection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TemperamentBalanceSchema = z.object({
  sanguine: z.number().describe('Air element. Associated with optimism, and sociality. A number between 0-100.'),
  choleric: z.number().describe('Fire element. Associated with ambition, and leadership. A number between 0-100.'),
  melancholic: z.number().describe('Earth element. Associated with thoughtfulness, and sensitivity. A number between 0-100.'),
  phlegmatic: z.number().describe('Water element. Associated with calmness, and peace. A number between 0-100.'),
});

const ReflectionInputSchema = z.object({
  symbol: z.enum(['flame', 'water', 'wind', 'earth']).describe("The symbolic image the user chose, representing their current state."),
  journal: z.string().describe("The user's journal entry about their tensions, regrets, or contradictions."),
  previousProfile: z.object({
    soulStage: z.string(),
    veiledCount: z.number(),
    temperamentBalance: TemperamentBalanceSchema,
  }).describe("The user's profile from the previous session.")
});
export type ReflectionInput = z.infer<typeof ReflectionInputSchema>;

const HabitSchema = z.object({
  name: z.string().describe("A short, actionable name for the habit. e.g. 'Morning Stillness'"),
  why: z.string().describe("The reason or spiritual intention behind this habit. e.g. 'To calm the restless waters of the mind.'"),
  frequency: z.string().describe("The suggested frequency for the practice. e.g., 'Every dawn', '3x per week'"),
  label: z.string().describe("A single, soul-based label for the habit. e.g., 'Awareness', 'Humility', 'Restraint'"),
});

const DivineNameSchema = z.object({
    name: z.string().describe("The Divine Name identified from the reflection (e.g., Al-Sabur, Al-Hakeem)."),
    prompt: z.string().describe("A one-sentence prompt inviting the user to embody this Name."),
});

const SpiritualConceptSchema = z.object({
    name: z.string().describe("The name of the classical Islamic concept (e.g., Tawbah, Kibr, Ghaflah)."),
    description: z.string().describe("A 1-2 sentence description of the concept."),
    quote: z.string().describe("A relevant quote from the Qur'an or an Islamic scholar."),
});


const VeiledOutputSchema = z.object({
  isVeiled: z.literal(true).describe("The journal entry seems evasive, dishonest, or low-effort."),
  reasoning: z.string().describe("The reasoning for why the reflection is considered veiled."),
});

const FullReflectionOutputSchema = z.object({
    isVeiled: z.literal(false),
    reasoning: z.string().describe("The reasoning for the diagnosis, connecting journal, symbol, and soul stage."),
    soulStage: z.string().describe("A short, poetic description of the user's current soul stage (Nafs)."),
    temperamentBalance: TemperamentBalanceSchema.describe("The user's new temperament balance, where the four values sum to 100."),
    poeticReflection: z.string().describe("A short, metaphorical reflection on the user's journal entry, in the style of Rumi."),
    probingQuestions: z.array(z.string()).min(2).max(3).describe("2-3 open-ended questions to gently challenge the user's perspective."),
    wisdomSeed: z.string().describe("A single, memorable sentence of wisdom."),
    optionalPrompt: z.string().optional().describe("An optional, one-sentence prompt for meditation, breathwork, or dhikr."),
    prescribedHabits: z.array(HabitSchema).max(2).optional().describe("0 to 2 small, actionable spiritual practices prescribed to the user based on their reflection."),
    divineName: DivineNameSchema.optional().describe("A Divine Name to contemplate, based on the user's reflection."),
    spiritualConcepts: z.array(SpiritualConceptSchema).max(3).optional().describe("0 to 3 classical Islamic spiritual concepts identified in the journal entry."),
});

const ReflectionOutputSchema = z.union([VeiledOutputSchema, FullReflectionOutputSchema]);
export type ReflectionOutput = z.infer<typeof ReflectionOutputSchema>;


export async function generateReflection(input: ReflectionInput): Promise<ReflectionOutput> {
  return reflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reflectionPrompt',
  input: {schema: ReflectionInputSchema},
  output: {schema: ReflectionOutputSchema},
  prompt: `You are Hikma, a wise psychospiritual guide in the tradition of Rumi and Islamic spirituality. Your purpose is to analyze a user's state and guide them towards self-understanding (Ma'rifah) and purification (Tazkiyah). You do not give direct advice; you are a mirror for the soul.

The user provides their journal entry, a chosen symbol, and their previous profile. Your task is to perform a two-stage analysis and return a JSON response that matches one of two types based on your findings.

**User's Input:**
- Symbol: {{{symbol}}}
- Journal: """{{{journal}}}"""
- Previous Profile: {{{json previousProfile}}}

---

**Your Analysis Task & Output Format:**

You MUST return your entire response as a single JSON object that adheres to the required output schema.

**1. Veiled Reflection Analysis:**
First, analyze the journal entry for its honesty and depth. The soul's mirror can be fogged by two things: temperament imbalance and spiritual veils (hijab). A veil is an act of self-deception, avoidance, or insincerity.
- **Signs of Veiling:** Look for vagueness, sarcasm, deflection, blaming others without self-reflection, contradictions (e.g., "I don't care but I'm angry"), or a tone suggesting the user is not being honest with themselves.
- **Output if Veiled:** If you detect veiling, your entire output MUST be a JSON object with 'isVeiled' set to true, and 'reasoning' explaining why.

**2. Full Reflection Analysis:**
If the entry is sincere, your entire output MUST be a JSON object with \`isVeiled\` set to \`false\` and ALL other required fields from the schema populated.
- **Diagnosis:** Determine the user's new Temperament Balance and Soul Stage (Nafs).
- **Reasoning:** Explain your diagnosis in the 'reasoning' field. Connect their words and symbol to the soul stage and temperament shift.
- **Reflection Components:** Generate all the required components: a poetic reflection, probing questions, and a wisdom seed.
- **Optional Components:** Only include the optional fields (\`optionalPrompt\`, \`prescribedHabits\`, \`divineName\`, \`spiritualConcepts\`) if they are truly relevant and insightful. Do not include them otherwise. Adhere strictly to the output schema.`,
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
    
    // If not veiled, ensure temperament numbers sum to 100
    if (!output.isVeiled) {
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

