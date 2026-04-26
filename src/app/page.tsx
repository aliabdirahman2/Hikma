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
    title: "Inner Horizon",
    description: "See your soul state at a glance—spiritual temperament, energetic imbalances, and areas of growth.",
  },
  {
    icon: <Edit className="size-8 text-primary" />,
    title: "Sacred Reflection",
    description: "Choose a symbol. Journal with intention. Let SeekHikma decode your inner landscape.",
  },
  {
    icon: <Heart className="size-8 text-primary" />,
    title: "Heart Mirror",
    description: "AI-guided questions that challenge your shadows and reflect your truths like a wise mentor.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative flex items-center justify-center h-[calc(100vh-4rem)] min-h-[600px] text-center text-white overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-sunrise-gradient -z-10" />
          <div className="absolute inset-0 w-full h-full bg-black/20 -z-10" />

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10 p-4"
          >
              <div className="flex items-center justify-center font-headline text-3xl md:text-5xl mb-6 overflow-hidden rounded-lg shadow-2xl border-2 border-white/20">
                <span className="bg-primary text-background px-4 py-2">Seek</span>
                <span className="bg-background text-primary px-4 py-2">Hikma</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-headline tracking-tight mb-4">
                  Reclaim Your Inner Compass.
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-8">
                  A sacred companion for soul work, reflection, and self-discovery.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="font-headline text-lg bg-white text-primary hover:bg-white/90">
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
