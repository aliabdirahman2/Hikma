import { z } from 'zod';

export type Message = {
  role: "user" | "model";
  content: string;
};

const TemperamentBalanceSchema = z.object({
    sanguine: z.number().describe("Air - Social, creative, scattered."),
    choleric: z.number().describe("Fire - Ambitious, passionate, angry."),
    melancholic: z.number().describe("Earth - Analytical, introspective, stubborn."),
    phlegmatic: z.number().describe("Water - Calm, empathetic, passive."),
});

export type TemperamentBalance = z.infer<typeof TemperamentBalanceSchema>;

export type PsychospiritualProfile = {
  soulStage: string;
  veiledCount: number;
  temperamentBalance: TemperamentBalance;
  shadowBalance: TemperamentBalance; // Shadow traits (excess/imbalance)
  hikmaDepth: number; // 1-100
};

export const HabitSchema = z.object({
  name: z.string(),
  why: z.string(),
  frequency: z.string(),
  label: z.string(),
  visualGuide: z.enum(['box-breathing', 'journaling', 'silence', 'action']).optional(),
});
export type PrescribedHabit = z.infer<typeof HabitSchema>;

export type TrackedHabit = PrescribedHabit & {
  id: string;
  createdAt: string;
  completedDates: string[];
};

export const ReflectionInputSchema = z.object({
  symbol: z.enum(['flame', 'water', 'wind', 'earth']),
  journal: z.string(),
  previousProfile: z.custom<PsychospiritualProfile>(),
  unveilingHistory: z.array(z.custom<Message>()).optional(),
  conflictDiagnosticAnswers: z.string().optional(),
});
export type ReflectionInput = z.infer<typeof ReflectionInputSchema>;

export const ReflectionOutputSchema = z.object({
  isVeiled: z.boolean(),
  reasoning: z.string(),
  soulStage: z.string().optional(),
  temperamentBalance: TemperamentBalanceSchema.optional(),
  shadowBalance: TemperamentBalanceSchema.optional(),
  poeticReflection: z.string().optional(),
  probingQuestions: z.array(z.string()).optional(),
  wisdomSeed: z.string().optional(),
  prescribedHabits: z.array(HabitSchema).optional(),
  isConflictDetected: z.boolean().optional(),
  diagnosticQuestions: z.array(z.string()).optional(),
  interpersonalInsight: z.string().optional(),
  otherPersonTemperament: TemperamentBalanceSchema.optional(),
});
export type ReflectionOutput = z.infer<typeof ReflectionOutputSchema>;

export type FullReflection = ReflectionOutput;

export type ArchivedReflection = {
  date: string;
  reflection: FullReflection;
  journal: string;
  symbol: "wind" | "flame" | "water" | "earth";
};
