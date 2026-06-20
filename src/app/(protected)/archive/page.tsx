"use client";

import React, { useState, useCallback } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { ArchivedReflection, PsychospiritualProfile } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { TemperamentWheel } from "@/components/TemperamentWheel";
import { format } from "date-fns";
import { ArchiveRestore, BookOpen, ChevronLeft, ChevronRight, Quote, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Book State Machine ─────────────────────────────────────────────
type BookView = "closed" | "toc" | "page";

export default function ArchivePage() {
  const [archive] = useLocalStorage<ArchivedReflection[]>("hikma-archive", []);
  const [profile] = useLocalStorage<PsychospiritualProfile>("hikma-profile", INITIAL_PROFILE);
  const [bookView, setBookView] = useState<BookView>("closed");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const sortedArchive = [...archive].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const openBook = useCallback(() => setBookView("toc"), []);
  const closeBook = useCallback(() => {
    setBookView("closed");
    setCurrentPageIndex(0);
  }, []);
  const goToPage = useCallback((index: number) => {
    setCurrentPageIndex(index);
    setBookView("page");
  }, []);
  const nextPage = useCallback(() => {
    setCurrentPageIndex(prev => Math.min(prev + 1, sortedArchive.length - 1));
  }, [sortedArchive.length]);
  const prevPage = useCallback(() => {
    setCurrentPageIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // ─── Empty State ────────────────────────────────────────────
  if (sortedArchive.length === 0) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12 min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
        <div className="text-center text-muted-foreground px-4 py-12 rounded-lg border-2 border-dashed border-muted-foreground/30">
          <ArchiveRestore className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-xl font-headline text-foreground mb-2">
            Your story is yet to be written.
          </p>
          <p>Complete a reflection to begin your ledger.</p>
        </div>
      </div>
    );
  }

  // ─── Closed Book (Cover) ────────────────────────────────────
  if (bookView === "closed") {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12 min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="book-perspective"
        >
          {/* The Book Cover */}
          <div
            onClick={openBook}
            className="relative cursor-pointer group w-[340px] sm:w-[400px] md:w-[480px] aspect-[3/4] rounded-r-lg rounded-l-sm shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(128,0,128,0.3)]"
            style={{
              background: "linear-gradient(135deg, hsl(300 100% 15%) 0%, hsl(300 100% 25%) 40%, hsl(300 80% 30%) 100%)",
            }}
          >
            {/* Decorative Border */}
            <div className="absolute inset-3 border border-[hsl(var(--accent))]/40 rounded-sm" />
            <div className="absolute inset-5 border border-[hsl(var(--accent))]/20 rounded-sm" />

            {/* Spine Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
              {/* Diamond Ornament */}
              <div className="w-16 h-16 border border-[hsl(var(--accent))]/60 rotate-45 mb-8 flex items-center justify-center">
                <div className="w-8 h-8 border border-[hsl(var(--accent))]/40 rotate-0" />
              </div>

              <h2 className="gold-foil font-headline text-4xl md:text-5xl mb-3 tracking-wider">
                The Reflection
              </h2>
              <h2 className="gold-foil font-headline text-4xl md:text-5xl mb-8 tracking-wider">
                Ledger
              </h2>

              {/* Mini Temperament Chart on Cover */}
              <div className="w-40 h-40 opacity-80 mb-8">
                <TemperamentWheel data={profile.temperamentBalance} />
              </div>

              <p className="text-[hsl(var(--accent))]/70 text-sm tracking-[0.3em] uppercase font-mono">
                {sortedArchive.length} Reflection{sortedArchive.length !== 1 ? "s" : ""} Recorded
              </p>

              {/* Diamond Ornament Bottom */}
              <div className="w-8 h-8 border border-[hsl(var(--accent))]/40 rotate-45 mt-8" />
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <p className="text-center text-muted-foreground mt-6 text-sm animate-pulse">
            Click to open
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Open Book (TOC + Pages) ────────────────────────────────
  const entry = sortedArchive[currentPageIndex];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 min-h-[calc(100vh-10rem)]">
      {/* Close Button */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={closeBook} className="gap-2">
          <X className="w-4 h-4" /> Close Book
        </Button>
        {bookView === "page" && (
          <Button variant="ghost" onClick={() => setBookView("toc")} className="gap-2">
            <BookOpen className="w-4 h-4" /> Table of Contents
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── Table of Contents ─── */}
        {bookView === "toc" && (
          <motion.div
            key="toc"
            initial={{ opacity: 0, rotateY: -20 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 20 }}
            transition={{ duration: 0.5 }}
            className="book-perspective"
          >
            <div className="max-w-3xl mx-auto bg-[hsl(40,30%,95%)] dark:bg-[hsl(300,10%,14%)] rounded-r-lg rounded-l-sm shadow-2xl overflow-hidden">
              {/* Spine */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/15 to-transparent z-10" />

                <div className="p-8 sm:p-12 page-texture book-spine">
                  {/* Header */}
                  <div className="text-center mb-10 pb-8 border-b border-primary/20">
                    <p className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.4em] uppercase mb-2">Table of Contents</p>
                    <h2 className="font-headline text-3xl text-primary">Your Reflections</h2>
                  </div>

                  {/* TOC Entries */}
                  <div className="space-y-1">
                    {sortedArchive.map((entry, index) => (
                      <button
                        key={entry.date + index}
                        onClick={() => goToPage(index)}
                        className="w-full group flex items-baseline gap-3 py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors text-left"
                      >
                        {/* Page Number */}
                        <span className="font-mono text-xs text-primary/60 w-6 shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Entry Title */}
                        <span className="font-headline text-lg text-foreground group-hover:text-primary transition-colors truncate">
                          {entry.reflection.isVeiled
                            ? "A Veiled Reflection"
                            : entry.reflection.soulStage || "Untitled Reflection"}
                        </span>

                        {/* Dotted line */}
                        <span className="flex-1 border-b border-dotted border-muted-foreground/30 mb-1 min-w-[20px]" />

                        {/* Date */}
                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                          {format(new Date(entry.date), "MMM d, yyyy")}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Footer ornament */}
                  <div className="flex items-center justify-center gap-3 mt-10 pt-8 border-t border-primary/10">
                    <div className="w-3 h-3 border border-primary/30 rotate-45" />
                    <p className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.3em] uppercase">
                      {sortedArchive.length} entries
                    </p>
                    <div className="w-3 h-3 border border-primary/30 rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Reflection Page ─── */}
        {bookView === "page" && entry && (
          <motion.div
            key={`page-${currentPageIndex}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="book-perspective"
          >
            <div className="max-w-3xl mx-auto bg-[hsl(40,30%,95%)] dark:bg-[hsl(300,10%,14%)] rounded-r-lg rounded-l-sm shadow-2xl overflow-hidden">
              {/* Spine */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/15 to-transparent z-10" />

                <div className="p-8 sm:p-12 page-texture book-spine">
                  {/* Page Header */}
                  <div className="flex justify-between items-start mb-8 pb-6 border-b border-primary/15">
                    <div>
                      <p className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.4em] uppercase mb-1">
                        Reflection {String(currentPageIndex + 1).padStart(2, "0")}
                      </p>
                      <h2 className="font-headline text-3xl text-primary">
                        {entry.reflection.isVeiled
                          ? "A Veiled Reflection"
                          : entry.reflection.soulStage || "Untitled"}
                      </h2>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs text-muted-foreground">
                        {format(new Date(entry.date), "MMMM d, yyyy")}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground/50">
                        {format(new Date(entry.date), "h:mm a")}
                      </p>
                    </div>
                  </div>

                  {/* Journal Entry */}
                  <div className="mb-8">
                    <h4 className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase mb-3">
                      Your Words
                    </h4>
                    <blockquote className="border-l-2 border-primary/30 pl-6 italic text-foreground/80 leading-relaxed text-lg">
                      {entry.journal}
                    </blockquote>
                  </div>

                  {entry.reflection.isVeiled ? (
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-6 border border-amber-200/50 dark:border-amber-800/30">
                      <h4 className="font-headline text-lg text-amber-700 dark:text-amber-400 mb-2">
                        The Mirror Was Veiled
                      </h4>
                      <p className="italic text-amber-600/80 dark:text-amber-300/70 leading-relaxed">
                        {entry.reflection.reasoning}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Temperament Chart */}
                      <div>
                        <h4 className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase mb-3">
                          Temperament Balance
                        </h4>
                        <div className="bg-card/50 rounded-lg p-4 border border-primary/10 min-h-[280px]">
                          <TemperamentWheel data={entry.reflection.temperamentBalance!} />
                        </div>
                      </div>

                      {/* Poetic Reflection */}
                      {entry.reflection.poeticReflection && (
                        <div>
                          <h4 className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase mb-3">
                            Hikma&apos;s Reflection
                          </h4>
                          <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                            <p className="italic whitespace-pre-wrap leading-relaxed text-foreground/85 text-lg">
                              &ldquo;{entry.reflection.poeticReflection}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Probing Questions */}
                      {entry.reflection.probingQuestions && entry.reflection.probingQuestions.length > 0 && (
                        <div>
                          <h4 className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase mb-3">
                            Questions to Ponder
                          </h4>
                          <ul className="space-y-3">
                            {entry.reflection.probingQuestions.map((q, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="text-primary/40 font-mono text-sm mt-0.5">{i + 1}.</span>
                                <span className="text-foreground/80 leading-relaxed">{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Wisdom Seed */}
                      {entry.reflection.wisdomSeed && (
                        <div className="flex items-start gap-3 bg-[hsl(var(--accent))]/10 rounded-lg p-5 border border-[hsl(var(--accent))]/20">
                          <Quote className="w-5 h-5 text-[hsl(var(--accent))] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-mono text-[10px] text-[hsl(var(--accent))]/70 tracking-[0.3em] uppercase mb-1">
                              Wisdom Seed
                            </p>
                            <p className="text-foreground/80 italic leading-relaxed">
                              {entry.reflection.wisdomSeed}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Page Footer / Navigation */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-primary/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevPage}
                      disabled={currentPageIndex === 0}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>

                    <span className="font-mono text-xs text-muted-foreground/50">
                      {currentPageIndex + 1} / {sortedArchive.length}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPageIndex === sortedArchive.length - 1}
                      className="gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
