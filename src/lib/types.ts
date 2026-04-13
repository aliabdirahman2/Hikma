import { z } from 'zod';

export type Message = {
  role: "user" | "model";
  content: string;
};

const TemperamentBalanceSchema = z.object({
    sanguine: z.number().describe("A value from 0-100 representing the Sanguine (Air) temperament. Associated with being social, optimistic, and creative."),
    choleric: z.number().describe("A value from 0-100 representing the Choleric (Fire) temperament. Associated with being ambitious, decisive, and passionate."),
    melancholic: z.number().describe("A value from 0-100 representing the Melancholic (Earth) temperament. Associated with being thoughtful, introspective, and analytical."),
    phlegmatic: z.number().describe("A value from 0-100 representing the Phlegmatic (Water) temperament. Associated with being calm, agreeable, and patient."),
});

export type TemperamentBalance = z.infer<typeof TemperamentBalanceSchema>;

export type PsychospiritualProfile = {
  soulStage: string;
  veiledCount: number;
  temperamentBalance: TemperamentBalance;
};

export const HabitSchema = z.object({
  name: z.string().describe("The name of the spiritual practice or habit."),
  why: z.string().describe("A concise, compassionate explanation of why this practice is beneficial for the user's current state."),
  frequency: z.string().describe("A suggested frequency for the practice (e.g., 'Daily', 'Once a week')."),
  label: z.string().describe("A short category for the habit, e.g., 'Self-Reflection', 'Grounding', 'Devotion', 'Action', 'Compassion'."),
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
  conflictDiagnosticAnswers: z.string().optional().describe("Answers to the diagnostic questions if a conflict was detected."),
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
  
  // Conflict / Interpersonal Logic
  isConflictDetected: z.boolean().optional().describe("Set to true if the journal describes a conflict with another person."),
  diagnosticQuestions: z.array(z.string()).optional().describe("Three questions to ask about the other person if a conflict is detected."),
  interpersonalInsight: z.string().optional().describe("Detailed analysis of the element clash and communication advice."),
  otherPersonTemperament: TemperamentBalanceSchema.optional().describe("Inferred temperament of the person the user is in conflict with."),
});
export type ReflectionOutput = z.infer<typeof ReflectionOutputSchema>;

export type FullReflection = ReflectionOutput;

export type ArchivedReflection = {
  date: string; // ISO date string
  reflection: FullReflection;
  journal: string;
  symbol: "wind" | "flame" | "water" | "earth";
};
