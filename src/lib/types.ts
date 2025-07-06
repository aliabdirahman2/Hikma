import { z } from 'zod';

export type Message = {
  role: "user" | "model";
  content: string;
};

const TemperamentBalanceSchema = z.object({
    sanguine: z.number(),
    choleric: z.number(),
    melancholic: z.number(),
    phlegmatic: z.number(),
});

export type PsychospiritualProfile = {
  soulStage: string;
  veiledCount: number;
  temperamentBalance: z.infer<typeof TemperamentBalanceSchema>;
};

export const HabitSchema = z.object({
  name: z.string(),
  why: z.string(),
  frequency: z.string(),
  label: z.string(),
});
export type PrescribedHabit = z.infer<typeof HabitSchema>;

export type TrackedHabit = PrescribedHabit & {
  id: string;
  createdAt: string; // ISO date string
  completedDates: string[]; // array of ISO date strings 'YYYY-MM-DD'
};

export const ReflectionInputSchema = z.object({
  symbol: z.enum(['flame', 'water', 'wind', 'earth']),
  journal: z.string(),
  previousProfile: z.object({
    soulStage: z.string(),
    veiledCount: z.number(),
    temperamentBalance: TemperamentBalanceSchema,
  }),
  unveilingHistory: z.custom<Message[]>().optional(),
});
export type ReflectionInput = z.infer<typeof ReflectionInputSchema>;


export const ReflectionOutputSchema = z.object({
  isVeiled: z.boolean(),
  reasoning: z.string(),
  soulStage: z.string().optional(),
  temperamentBalance: TemperamentBalanceSchema.optional(),
  poeticReflection: z.string().optional(),
  probingQuestions: z.array(z.string()).optional(),
  wisdomSeed: z.string().optional(),
  optionalPrompt: z.string().optional(),
  prescribedHabits: z.array(HabitSchema).optional(),
});
export type ReflectionOutput = z.infer<typeof ReflectionOutputSchema>;

export type FullReflection = ReflectionOutput;

export type ArchivedReflection = {
  date: string; // ISO date string
  reflection: FullReflection;
  journal: string;
  symbol: "wind" | "flame" | "water" | "earth";
};
