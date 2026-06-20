"use client";

import Link from "next/link";
import { ArrowRight, Compass, Edit, Heart, Leaf, Quote, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Compass className="size-8 text-primary" />,
    title: "Psychological Horizon",
    description: "See your cognitive and emotional state at a glance—temperamental traits, psychological imbalances, and areas of growth.",
  },
  {
    icon: <Edit className="size-8 text-primary" />,
    title: "Guided Reflection",
    description: "Choose a symbol. Journal with intention. Let SeekHikma decode the structural elements of your inner landscape.",
  },
  {
    icon: <Heart className="size-8 text-primary" />,
    title: "The Mirror of Insight",
    description: "AI-guided inquiries that challenge your psychological blind spots and reflect your underlying truths.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative flex items-center justify-center h-[calc(100vh-4rem)] min-h-[700px] text-center text-white overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-sunrise-gradient -z-20" />
          <div className="absolute inset-0 w-full h-full bg-black/40 -z-20" />

          {/* Scientific Grid/Diamond Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 opacity-70">
              {/* The Diamond Container */}
              <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px]">
                  {/* Grid Lines */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20" />
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/20" />
                  
                  {/* Diamond Shapes */}
                  <div className="absolute inset-10 border border-white/20 rotate-45" />
                  <div className="absolute inset-[15%] border border-white/10 rotate-45" />
                  <div className="absolute inset-[25%] border border-white/5 rotate-45" />

                  {/* Scientific Ticks/Markers */}
                  <div className="absolute top-[25%] left-1/2 w-4 h-[1px] bg-white/50 -translate-x-2" />
                  <div className="absolute top-[75%] left-1/2 w-4 h-[1px] bg-white/50 -translate-x-2" />
                  <div className="absolute left-[25%] top-1/2 h-4 w-[1px] bg-white/50 -translate-y-2" />
                  <div className="absolute left-[75%] top-1/2 h-4 w-[1px] bg-white/50 -translate-y-2" />

                  {/* Corner Labels */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="font-mono text-[10px] text-white/60 tracking-widest uppercase mb-1">Air / Active</span>
                      <span className="font-headline text-xl text-white tracking-wide">Sanguine</span>
                  </div>
                  
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="font-headline text-xl text-white tracking-wide mb-1">Melancholic</span>
                      <span className="font-mono text-[10px] text-white/60 tracking-widest uppercase">Earth / Passive</span>
                  </div>

                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-24 flex flex-col items-end">
                      <span className="font-mono text-[10px] text-white/60 tracking-widest uppercase mb-1">Fire / Active</span>
                      <span className="font-headline text-xl text-white tracking-wide">Choleric</span>
                  </div>

                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-24 flex flex-col items-start">
                      <span className="font-mono text-[10px] text-white/60 tracking-widest uppercase mb-1">Water / Passive</span>
                      <span className="font-headline text-xl text-white tracking-wide">Phlegmatic</span>
                  </div>
              </div>
          </div>

          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="z-10 p-8 max-w-2xl bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl"
          >
              <div className="flex items-center justify-center font-headline text-3xl md:text-5xl mb-6 overflow-hidden rounded border border-white/20 w-fit mx-auto">
                <span className="bg-primary text-background px-4 py-2">Seek</span>
                <span className="bg-background text-primary px-4 py-2">Hikma</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline tracking-tight mb-4">
                  Find Inner Balance. Connect With Others.
              </h1>
              <p className="max-w-xl mx-auto text-lg text-white/80 mb-8">
                  An AI-guided space that blends temperament theory with modern psychology to map your inner landscape, foster self-understanding, and help you harmoniously navigate your relationships.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="font-headline text-lg bg-white text-primary hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      <Link href="/signup">
                          Begin the Journey <ArrowRight className="ml-2"/>
                      </Link>
                  </Button>
              </div>
          </motion.div>
      </section>

      <section id="features" className="py-20 bg-muted/40">
          <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature) => (
                      <div key={feature.title} className="bg-card p-6 text-center flex flex-col items-center hover:shadow-lg transition-shadow duration-300 sufi-octagon">
                          <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                              {feature.icon}
                          </div>
                          <h3 className="font-headline text-2xl pt-4 text-card-foreground">{feature.title}</h3>
                          <p className="flex-grow mt-2 text-muted-foreground">{feature.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>
      
      <section className="py-24 bg-primary text-white text-center">
           <div className="container max-w-3xl flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-headline mb-4">
                  Begin your path.
              </h2>
              <Button asChild size="lg" className="font-headline text-xl h-24 w-24 rounded-full bg-white text-primary hover:bg-white/90 flex-col gap-0 mt-8">
                  <Link href="/signup">
                      <span>Begin</span>
                      <ArrowRight className="h-5 w-5 mt-1"/>
                  </Link>
              </Button>
           </div>
      </section>
    </>
  );
}
