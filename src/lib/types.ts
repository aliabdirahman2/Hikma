import type { GenerateReflectionOutput } from "@/ai/flows/generate-reflection";

export type Temperament = "Sanguine" | "Choleric" | "Melancholic" | "Phlegmatic";
export type SoulStage = "nafs al-ammarah" | "lawwamah" | "mutma’innah";

export interface ReflectionEntry {
  id: string;
  date: string;
  temperament: Temperament;
  soulStage: SoulStage;
  reflection: GenerateReflectionOutput;
  journal: string;
}
