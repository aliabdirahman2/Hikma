
"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import type { ArchivedReflection } from "@/lib/types";
import { TemperamentWheel } from "@/components/TemperamentWheel";
import { format } from "date-fns";
import { ArchiveRestore, Quote, BookOpen, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function ArchivePage() {
  const [archive] = useLocalStorage<ArchivedReflection[]>("hikma-archive", []);

  // Show the newest reflections first
  const sortedArchive = [...archive].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">
          The Reflection Ledger
        </h1>
        <p className="text-lg text-muted-foreground">
          Trace your journey and witness the unfolding of your inner landscape.
        </p>
      </div>

      {sortedArchive.length === 0 ? (
        <div className="text-center text-muted-foreground mt-16 px-4 py-12 rounded-lg border-2 border-dashed border-muted-foreground/30">
          <ArchiveRestore className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-xl font-headline text-foreground mb-2">
            Your story is yet to be written.
          </p>
          <p>Complete a reflection to begin your ledger.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedArchive.map((entry) => (
            <Card key={entry.date} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      {format(new Date(entry.date), "MMMM d, yyyy")}
                    </CardTitle>
                    <CardDescription className="italic text-primary mt-1">
                      {entry.reflection.isVeiled 
                        ? <span className="text-amber-600">A Veiled Reflection</span> 
                        : `“${entry.reflection.soulStage!}”`
                      }
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), "h:mm a")}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold">
                      View Full Reflection
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-headline text-lg text-primary mb-2">
                            Your Words
                          </h4>
                          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                            {entry.journal}
                          </blockquote>
                        </div>
                        
                        {entry.reflection.isVeiled ? (
                            <div>
                                <h4 className="font-headline text-lg text-amber-600 mb-2">Reasoning for Veil</h4>
                                <p className="italic text-muted-foreground">{entry.reflection.reasoning}</p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <h4 className="font-headline text-lg text-primary mb-2">
                                        Temperament Balance
                                    </h4>
                                    <div className="min-h-[250px]">
                                        <TemperamentWheel
                                        data={entry.reflection.temperamentBalance!}
                                        />
                                    </div>
                                </div>
                                {entry.reflection.divineName && (
                                  <div>
                                    <h4 className="font-headline text-lg text-primary mb-2 flex items-center gap-2"><Sparkles className="size-5"/>Divine Name of the Day</h4>
                                    <p><span className="font-semibold">{entry.reflection.divineName.name}:</span> <span className="italic">{entry.reflection.divineName.prompt}</span></p>
                                  </div>
                                )}
                                {entry.reflection.spiritualConcepts && entry.reflection.spiritualConcepts.length > 0 && (
                                  <div>
                                    <h4 className="font-headline text-lg text-primary mb-2 flex items-center gap-2"><BookOpen className="size-5"/>Spiritual Themes</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {entry.reflection.spiritualConcepts.map(concept => (
                                        <Badge key={concept.name} variant="secondary">{concept.name}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-headline text-lg text-primary mb-2">
                                    Hikma's Reflection
                                  </h4>
                                  <p className="italic whitespace-pre-wrap leading-relaxed">
                                    “{entry.reflection.poeticReflection!}”
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-headline text-lg text-primary mb-2">
                                    Probing Questions
                                  </h4>
                                  <ul className="list-disc pl-5 space-y-2 text-sm">
                                    {entry.reflection.probingQuestions!.map((q, i) => (
                                      <li key={i}>{q}</li>
                                    ))}
                                  </ul>
                                </div>
                            </>
                        )}

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              {!entry.reflection.isVeiled && (
                <CardFooter className="bg-muted/50 p-4">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Quote className="w-4 h-4 text-primary" />
                    <span className="font-bold mr-1">Wisdom Seed:</span>
                    {entry.reflection.wisdomSeed!}
                    </p>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
