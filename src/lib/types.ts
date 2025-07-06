
import type { ReflectionOutput } from "@/ai/flows/generate-reflection";

export type Message = {
  role: "user" | "model";
  content: string;
}

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
