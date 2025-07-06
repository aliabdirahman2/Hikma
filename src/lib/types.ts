import { z } from 'zod';

// Schemas moved from generate-reflection.ts
export const TemperamentBalanceSchema = z.object({
  sanguine: z.number().describe('Air element. Associated with optimism, and sociality. A number between 0-100.'),
  choleric: z.number().describe('Fire element. Associated with ambition, and leadership. A number between 0-100.'),
  melancholic: z.number().describe('Earth element. Associated with thoughtfulness, and sensitivity. A number between 0-100.'),
  phlegmatic: z.number().describe('Water element. Associated with calmness, and peace. A number between 0-100.'),
});

export const HabitSchema = z.object({
  name: z.string().describe("A short, actionable name for the habit. e.g. 'Morning Stillness'"),
  why: z.string().describe("The reason or spiritual intention behind this habit. e.g. 'To calm the restless waters of the mind.'"),
  frequency: z.string().describe("The suggested frequency for the practice. e.g., 'Every dawn', '3x per week'"),
  label: z.string().describe("A single, soul-based label for the habit. e.g., 'Awareness', 'Humility', 'Restraint'"),
});
export type PrescribedHabit = z.infer<typeof HabitSchema>;

export const DivineNameSchema = z.object({
    name: z.string().describe("The Divine Name identified from the reflection (e.g., Al-Sabur, Al-Hakeem)."),
    prompt: z.string().describe("A one-sentence prompt inviting the user to embody this Name."),
});
export type DivineName = z.infer<typeof DivineNameSchema>;


export const SpiritualConceptSchema = z.object({
    name: z.string().describe("The name of the classical Islamic concept (e.g., Tawbah, Kibr, Ghaflah)."),
    description: z.string().describe("A 1-2 sentence description of the concept."),
    quote: z.string().describe("A relevant quote from the Qur'an or an Islamic scholar."),
});
export type SpiritualConcept = z.infer<typeof SpiritualConceptSchema>;


export const ReflectionInputSchema = z.object({
  symbol: z.enum(['flame', 'water', 'wind', 'earth']).describe("The symbolic image the user chose, representing their current state."),
  journal: z.string().describe("The user's journal entry about their tensions, regrets, or contradictions."),
  previousProfile: z.object({
    soulStage: z.string(),
    veiledCount: z.number(),
    temperamentBalance: TemperamentBalanceSchema,
  }).describe("The user's profile from the previous session.")
});
export type ReflectionInput = z.infer<typeof ReflectionInputSchema>;

export const ReflectionOutputSchema = z.object({
  isVeiled: z.boolean().describe("This field is ALWAYS required. Set to true if the journal entry seems evasive, dishonest, or low-effort. Otherwise, set to false."),
  reasoning: z.string().describe("This field is ALWAYS required. If veiled, explain the reasoning. If not veiled, explain the diagnosis, connecting journal, symbol, and soul stage."),
  
  soulStage: z.string().optional().describe("A short, poetic description of the user's current soul stage (Nafs)."),
  temperamentBalance: TemperamentBalanceSchema.optional().describe("The user's new temperament balance, where the four values sum to 100."),
  poeticReflection: z.string().optional().describe("A short, metaphorical reflection on the user's journal entry, in the style of Rumi."),
  probingQuestions: z.array(z.string()).min(2).max(3).optional().describe("2-3 open-ended questions to gently challenge the user's perspective."),
  wisdomSeed: z.string().optional().describe("A single, memorable sentence of wisdom."),
  
  optionalPrompt: z.string().optional().describe("An optional, one-sentence prompt for meditation, breathwork, or dhikr."),
  prescribedHabits: z.array(HabitSchema).max(2).optional().describe("0 to 2 small, actionable spiritual practices prescribed to the user based on their reflection."),
  divineName: DivineNameSchema.optional().describe("A Divine Name to contemplate, based on the user's reflection."),
  spiritualConcepts: z.array(SpiritualConceptSchema).max(3).optional().describe("0 to 3 classical Islamic spiritual concepts identified in the journal entry."),
});
export type ReflectionOutput = z.infer<typeof ReflectionOutputSchema>;

// Original types from types.ts, adapted
export type Message = {
  role: "user" | "model";
  content: string;
};

export type PsychospiritualProfile = {
  soulStage: string;
  veiledCount: number;
  temperamentBalance: z.infer<typeof TemperamentBalanceSchema>;
};

export type FullReflection = ReflectionOutput;

export type TrackedHabit = PrescribedHabit & {
  id: string;
  createdAt: string; // ISO date string
  completedDates: string[]; // array of ISO date strings 'YYYY-MM-DD'
};

export type ArchivedReflection = {
  date: string; // ISO date string
  reflection: FullReflection;
  journal: string;
  symbol: "wind" | "flame" | "water" | "earth";
};
