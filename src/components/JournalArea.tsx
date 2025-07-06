"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface JournalAreaProps {
  onSave: (journalText: string) => void;
  onNewReflection: () => void;
}

export function JournalArea({ onSave, onNewReflection }: JournalAreaProps) {
  const [journalText, setJournalText] = useState("");

  const handleSaveClick = () => {
    onSave(journalText);
  };

  return (
    <div className="w-full max-w-2xl mt-12 mb-8 text-left animate-in fade-in duration-1000">
      <Label htmlFor="journal" className="text-lg font-headline text-primary mb-4 block text-center">
        Record Your Response
      </Label>
      <p className="text-center text-muted-foreground mb-6">
        What thoughts, feelings, or awareness arose? This space is private and
        sacred.
      </p>
      <Textarea
        id="journal"
        placeholder="Your thoughts here..."
        className="resize-none"
        rows={8}
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
      />
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleSaveClick}
          size="lg"
          className="w-full font-headline tracking-wider flex-1"
          disabled={!journalText.trim()}
        >
          Save to Ledger
        </Button>
         <Button
          onClick={onNewReflection}
          size="lg"
          variant="outline"
          className="w-full font-headline tracking-wider flex-1"
        >
          Start Anew
        </Button>
      </div>
    </div>
  );
}
