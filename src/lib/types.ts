import type { ReflectionOutput } from "@/ai/flows/generate-reflection";

export type Message = {
  role: "user" | "model";
  content: string;
};

export type PsychospiritualProfile = {
  soulStage: string;
  temperamentBalance: {
    sanguine: number;
    choleric: number;
    melancholic: number;
    phlegmatic: number;
  };
};

export type FullReflection = ReflectionOutput;

export type PrescribedHabit = {
  name: string;
  why: string;
  frequency: string;
  label: string;
};

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
