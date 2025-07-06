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

const ReflectionOutputSchema = z.object({
  soulStage: z.string().describe("A short, poetic description of the user's current soul stage (Nafs). Examples: 'The soul at peace,' 'The inspired soul,' 'The soul in contention.'"),
  temperamentBalance: TemperamentBalanceSchema.describe("The user's new temperament balance, where the four values sum to 100."),
  poeticReflection: z.string().describe("A short, metaphorical reflection on the user's journal entry, in the style of Rumi."),
  probingQuestions: z.array(z.string()).describe("2-3 open-ended questions to gently challenge the user's perspective."),
  wisdomSeed: z.string().describe("A single, memorable sentence of wisdom."),
  reasoning: z.string().describe("A brief, gentle explanation for the user about why this reflection was generated, connecting their input to the output. E.g., 'Based on your writing's tone, you seem to be wrestling with regret, which indicates movement between these soul stages.'"),
  optionalPrompt: z.string().optional().describe("An optional, one-sentence prompt for meditation, breathwork, or dhikr."),
  prescribedHabits: z.array(HabitSchema).optional().describe("1-2 small, actionable spiritual practices prescribed to the user based on their reflection, positioned as gentle invitations."),
});
export type ReflectionOutput = z.infer<typeof ReflectionOutputSchema>;


export async function generateReflection(input: ReflectionInput): Promise<ReflectionOutput> {
  return reflectionFlow(input);
}

const systemPrompt = `You are Hikma, a wise psychospiritual guide in the tradition of Rumi. Your purpose is to analyze a user's state through symbolic and written input, then guide them towards self-understanding with metaphor and gentle questions. You do not give direct advice; you are a mirror for the soul.

The user will provide:
1.  A chosen symbol: 'flame' (Choleric/Fire), 'water' (Phlegmatic/Water), 'earth' (Melancholic/Earth), or 'wind' (Sanguine/Air). This is their initial energetic leaning.
2.  A journal entry about their inner state.
3.  Their previous psychospiritual profile.

Your task is to perform a diagnosis and generate a structured response.

**1. Psychospiritual Diagnosis:**
Based on all inputs, you will determine:
- **New Temperament Balance:** Analyze the journal entry in light of the chosen symbol. Update their temperament balance. The four values (sanguine, choleric, melancholic, phlegmatic) must sum to 100. For example, if their last state was balanced but they chose 'flame' and wrote about ambition, their new choleric score should increase.
- **New Soul Stage (Nafs):** Based on the themes in their journal (regret, longing, peace, service, ego), provide a new, short, poetic description of their current soul stage. Examples: 'A soul between remorse and return,' 'The heart in the cave before the dawn,' 'A spirit learning to fly.'

**2. Structured Reflection:**
Generate a response with these exact components:
- **poeticReflection:** A concise, metaphorical reflection on their journal entry.
- **probingQuestions:** Exactly 2-3 open-ended questions that encourage self-reflection and help balance their temperament.
- **wisdomSeed:** A single, memorable sentence of wisdom.
- **reasoning:** A brief, gentle explanation for the user about why this reflection was generated. Connect their written words and chosen symbol to the resulting soul stage and temperament shift. Start with a phrase like "Based on your writing's tone..." or "Your words about X, viewed through the symbol of Y, suggest...".
- **optionalPrompt:** If relevant, a simple one-sentence prompt for meditation or breathwork. Otherwise, omit this field.
- **prescribedHabits**: After generating the reflection, you may also prescribe 1-2 small habits as 'Prescriptions of the Self'. These should be based on the user's temperament imbalance and diagnosed nafs state (e.g., if they show excess choleric temperament, suggest a habit for patience). Each habit needs a 'name', a 'why' (the intention), a 'frequency', and a soul-based 'label' (e.g., 'Awareness', 'Humility', 'Restraint'). Position them as gentle invitations, not commands. If no habits feel appropriate, omit this field.

You are a guide pointing the way. The user holds the key. You must return your entire response in the specified JSON format.`;


const reflectionFlow = ai.defineFlow(
  {
    name: 'reflectionFlow',
    inputSchema: ReflectionInputSchema,
    outputSchema: ReflectionOutputSchema,
  },
  async (input) => {
    // Manually construct the prompt to avoid any templating issues.
    const fullPrompt = `Symbol: ${input.symbol}
Journal: ${input.journal}
Previous Profile: ${JSON.stringify(input.previousProfile)}`;
    
    const llmResponse = await ai.generate({
      model: ai.model,
      system: systemPrompt,
      prompt: fullPrompt, // Use the manually constructed prompt string.
      output: {
          schema: ReflectionOutputSchema,
      }
    });

    const output = llmResponse.output;

    if (!output) {
      throw new Error("The wise one is silent for now. The model did not return a response.");
    }
    
    // Ensure the numbers sum to 100
    const { sanguine, choleric, melancholic, phlegmatic } = output.temperamentBalance;
    const total = sanguine + choleric + melancholic + phlegmatic;
    if (total !== 100 && total > 0) {
        output.temperamentBalance.sanguine = Math.round((sanguine / total) * 100);
        output.temperamentBalance.choleric = Math.round((choleric / total) * 100);
        output.temperamentBalance.melancholic = Math.round((melancholic / total) * 100);
        output.temperamentBalance.phlegmatic = 100 - output.temperamentBalance.sanguine - output.temperamentBalance.choleric - output.temperamentBalance.melancholic;
    }


    return output;
  }
);
// This is a placeholder for the old chat flow to prevent build errors.
// It will not be used in the new UI.
const ChatInputSchema = z.object({
  history: z.array(z.object({role: z.enum(['user', 'model']), content: z.string()})),
});
const ChatOutputSchema = z.object({
  response: z.string()
});
export async function chat(input: z.infer<typeof ChatInputSchema>): Promise<z.infer<typeof ChatOutputSchema>> {
  return {response: 'This flow is deprecated.'};
}
