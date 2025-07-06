"use client";

import { useState } from "react";
import { ReflectionForm } from "@/components/ReflectionForm";
import { ReflectionDisplay } from "@/components/ReflectionDisplay";
import { JournalArea } from "@/components/JournalArea";
import type { GenerateReflectionOutput } from "@/ai/flows/generate-reflection";
import type { Temperament, SoulStage, ReflectionEntry } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Home() {
  const [reflection, setReflection] = useState<GenerateReflectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [temperament, setTemperament] = useState<Temperament | null>(null);
  const [soulStage, setSoulStage] = useState<SoulStage | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleReflectionGenerated = (
    data: GenerateReflectionOutput,
    temp: Temperament,
    stage: SoulStage
  ) => {
    setReflection(data);
    setTemperament(temp);
    setSoulStage(stage);
    setIsLoading(false);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleSave = (journalText: string) => {
    if (!reflection || !temperament || !soulStage) return;

    const newEntry: ReflectionEntry = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      temperament,
      soulStage,
      reflection,
      journal: journalText,
    };

    const existingEntries: ReflectionEntry[] = JSON.parse(
      localStorage.getItem("reflectionLedger") || "[]"
    );
    localStorage.setItem(
      "reflectionLedger",
      JSON.stringify([newEntry, ...existingEntries])
    );

    toast({
      title: "Reflection Saved",
      description: "Your entry has been added to the ledger.",
    });

    // Reset state for a new reflection
    setReflection(null);
    setTemperament(null);
    setSoulStage(null);

    // Optional: navigate to archive after saving
    router.push('/archive');
  };
  
  const handleNewReflection = () => {
    setReflection(null);
    setTemperament(null);
    setSoulStage(null);
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-col items-center text-center">
        {!reflection && (
          <h1 className="font-headline text-4xl md:text-5xl text-primary mb-4">
            Peace be upon you.
          </h1>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 my-16">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
            <p className="font-headline text-muted-foreground">
              Hikma is contemplating...
            </p>
          </div>
        )}

        {!isLoading && !reflection && (
          <ReflectionForm
            onReflectionGenerated={handleReflectionGenerated}
            onLoading={handleLoading}
          />
        )}

        {!isLoading && reflection && temperament && soulStage && (
          <>
            <ReflectionDisplay
              reflection={reflection}
              temperament={temperament}
              soulStage={soulStage}
            />
            <JournalArea onSave={handleSave} onNewReflection={handleNewReflection} />
          </>
        )}
      </div>
    </div>
  );
}
