"use client";

import { useState, useEffect } from "react";
import type { ReflectionEntry } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
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
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

export function ArchiveClient() {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ReflectionEntry[]>([]);
  const [temperamentFilter, setTemperamentFilter] = useState("all");
  const [soulStageFilter, setSoulStageFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedEntries: ReflectionEntry[] = JSON.parse(
      localStorage.getItem("reflectionLedger") || "[]"
    );
    setEntries(savedEntries);
    setFilteredEntries(savedEntries);
  }, []);

  useEffect(() => {
    let newFilteredEntries = [...entries];
    if (temperamentFilter !== "all") {
      newFilteredEntries = newFilteredEntries.filter(
        (e) => e.temperament === temperamentFilter
      );
    }
    if (soulStageFilter !== "all") {
      newFilteredEntries = newFilteredEntries.filter(
        (e) => e.soulStage === soulStageFilter
      );
    }
    setFilteredEntries(newFilteredEntries);
  }, [temperamentFilter, soulStageFilter, entries]);

  if (!isClient) {
    return null; // Or a loading skeleton
  }
  
  const resetFilters = () => {
    setTemperamentFilter('all');
    setSoulStageFilter('all');
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-lg border">
        <Select value={temperamentFilter} onValueChange={setTemperamentFilter}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Filter by Temperament" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Temperaments</SelectItem>
            <SelectItem value="Sanguine">Sanguine</SelectItem>
            <SelectItem value="Choleric">Choleric</SelectItem>
            <SelectItem value="Melancholic">Melancholic</SelectItem>
            <SelectItem value="Phlegmatic">Phlegmatic</SelectItem>
          </SelectContent>
        </Select>
        <Select value={soulStageFilter} onValueChange={setSoulStageFilter}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Filter by Soul Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Soul Stages</SelectItem>
            <SelectItem value="nafs al-ammarah">Nafs al-Ammarah</SelectItem>
            <SelectItem value="lawwamah">Nafs al-Lawwamah</SelectItem>
            <SelectItem value="mutma’innah">Nafs al-Mutma’innah</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={resetFilters}>Reset</Button>
      </div>

      {filteredEntries.length > 0 ? (
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value={entry.id} className="border-b-0">
                  <AccordionTrigger className="p-6 hover:no-underline">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left">
                       <div className="flex-1">
                        <p className="font-headline text-primary text-lg">
                          {format(new Date(entry.date), "MMMM d, yyyy")}
                        </p>
                         <p className="text-sm text-muted-foreground">
                          {entry.reflection.wisdomSeed}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Badge variant="secondary">{entry.temperament}</Badge>
                        <Badge variant="outline">{entry.soulStage.replace('nafs al-', '')}</Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 pt-0">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-headline text-sm tracking-widest text-muted-foreground uppercase mb-2">
                          Hikma's Reflection
                        </h4>
                        <p className="whitespace-pre-wrap text-base leading-relaxed">
                          {entry.reflection.reflection}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-headline text-sm tracking-widest text-muted-foreground uppercase mb-2">
                          Your Journal
                        </h4>
                        <p className="whitespace-pre-wrap text-base leading-relaxed bg-muted/40 p-4 rounded-md">
                          {entry.journal}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <p className="text-muted-foreground">Your reflection ledger is empty.</p>
          <p className="text-sm text-muted-foreground/80">Begin your journey on the Reflect page.</p>
        </div>
      )}
    </div>
  );
}
