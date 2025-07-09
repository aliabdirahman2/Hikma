"use client";

import Link from "next/link";
import { ArrowRight, Compass, Edit, Heart, Leaf, Quote, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
    description: "Choose a symbol. Journal with intention. Let Hikma decode your inner landscape with AI-assisted interpretation.",
  },
  {
    icon: <Heart className="size-8 text-primary" />,
    title: "Heart Mirror",
    description: "AI-guided questions that challenge your shadows and reflect your truths—like a wise friend or mentor.",
  },
  {
    icon: <Leaf className="size-8 text-primary" />,
    title: "Soul Practices",
    description: "Personalized practices—breath, dhikr, meditation prompts—rooted in spiritual traditions.",
  },
  {
    icon: <Wind className="size-8 text-primary" />,
    title: "Seasonal Alignment",
    description: "Track your psycho-spiritual rhythms through the elements and sacred cycles. Live in harmony with your nature.",
  },
];

const howItWorksSteps = [
    {
        step: 1,
        title: "Reflect with a symbol.",
        description: "Choose from archetypal symbols or words (e.g., “mirror,” “flame,” “gate”). These act as keys to unconscious material."
    },
    {
        step: 2,
        title: "Write what comes up.",
        description: "Free-write in a secure, private journal space. Hikma doesn't analyze for optimization—it listens for truth."
    },
    {
        step: 3,
        title: "Receive deep insight.",
        description: "Hikma uses psychospiritual and symbolic frameworks to offer insights. Not therapy. Not diagnosis. Just sacred reflection."
    }
];

const testimonials = [
    {
        quote: "It felt like I wasn’t just writing to myself… it was like something wiser was writing back.",
        author: "Layla, Artist & Teacher"
    },
    {
        quote: "I’ve done years of journaling. Nothing helped me make sense of my heart like Hikma.",
        author: "Yusuf, Med Student"
    },
    {
        quote: "It was like sitting with a shaykh, a therapist, and a mystic at the same time.",
        author: "Aaliyah, Product Manager"
    }
]

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-[calc(100vh-4rem)] min-h-[600px] text-center text-white overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-sunrise-gradient -z-10" />
          <div className="absolute inset-0 w-full h-full bg-black/20 -z-10" />

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10 p-4"
          >
              <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-lg nur-pulse">
                 <Heart className="w-8 h-8 text-white"/>
              </div>
              <h1 className="text-4xl md:text-6xl font-headline tracking-tight mb-4" style={{textShadow: '0 2px 10px rgba(0,0,0,0.3)'}}>
                  Reclaim Your Inner Compass.
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-8" style={{textShadow: '0 1px 5px rgba(0,0,0,0.2)'}}>
                  A sacred companion for soul work, reflection, and self-discovery.
                  <br/>
                  Guided by tradition. Empowered by AI. Rooted in your fitra.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="font-headline text-lg bg-white text-primary hover:bg-white/90">
                      <Link href="/signup">
                          Begin the Journey <ArrowRight className="ml-2"/>
                      </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="font-headline text-lg text-white border-white/50 bg-transparent hover:bg-white/10 hover:text-white">
                      <a href="#features">
                          Explore How It Works
                      </a>
                  </Button>
              </div>
          </motion.div>
      </section>

      {/* Why Hikma? Section */}
      <section id="why" className="py-20 bg-background text-center">
          <div className="container max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-headline text-primary mb-6">
                  Why do we feel so lost in an age of infinite information?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  Because we’ve forgotten how to listen to what matters.
              </p>
              <div className="max-w-2xl mx-auto space-y-4 text-base">
                  <p>Hikma helps you pause, reflect, and return to what is essential.</p>
                  <p>Whether you’re overwhelmed by noise, craving meaning, or trying to live with presence — this is your inner sanctuary.</p>
                  <p>Inspired by spiritual traditions and guided by psychospiritual frameworks, Hikma is your tazkiyah companion in the digital age.</p>
              </div>
          </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-muted/40">
          <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.slice(0, 3).map((feature) => (
                      <Card key={feature.title} className="flex flex-col text-center items-center hover:shadow-lg transition-shadow duration-300">
                          <CardHeader>
                              <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                                  {feature.icon}
                              </div>
                              <CardTitle className="font-headline text-2xl pt-4">{feature.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <CardDescription>{feature.description}</CardDescription>
                          </CardContent>
                      </Card>
                  ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 justify-center lg:max-w-[67%] lg:mx-auto">
                  {features.slice(3, 5).map((feature) => (
                      <Card key={feature.title} className="flex flex-col text-center items-center hover:shadow-lg transition-shadow duration-300">
                          <CardHeader>
                              <div className="p-4 bg-primary/10 rounded-full mx-auto w-fit">
                                  {feature.icon}
                              </div>
                              <CardTitle className="font-headline text-2xl pt-4">{feature.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <CardDescription>{feature.description}</CardDescription>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
          <div className="container max-w-5xl text-center">
              <h2 className="text-3xl md:text-4xl font-headline text-primary mb-12">
                  Trust Through Transparency
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {howItWorksSteps.map((step) => (
                      <div key={step.step} className="flex flex-col items-center">
                          <div className="flex items-center justify-center w-16 h-16 mb-4 font-headline text-2xl bg-accent text-accent-foreground rounded-full border-2 border-primary/20">
                              {step.step}
                          </div>
                          <h3 className="text-xl font-headline mb-2">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/40">
          <div className="container max-w-4xl">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {testimonials.map(testimonial => (
                       <Card key={testimonial.author} className="flex flex-col justify-between">
                          <CardContent className="pt-6">
                              <blockquote className="italic text-muted-foreground leading-relaxed">
                                  <Quote className="w-8 h-8 text-accent mb-2" />
                                  “{testimonial.quote}”
                              </blockquote>
                          </CardContent>
                          <CardFooter>
                              <p className="font-semibold text-sm">{testimonial.author}</p>
                          </CardFooter>
                       </Card>
                   ))}
               </div>
          </div>
      </section>
      
      {/* Deeper Invitation Section */}
      <section id="invitation" className="py-20 bg-background text-center">
          <div className="container max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-headline text-primary mb-6">
                  Hikma is not for everyone.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  But if you’ve ever longed for a deeper why, this may be your sign.
              </p>
              <div className="max-w-2xl mx-auto space-y-4 text-base">
                  <p>There’s no gamification, no likes, no hacks. Just you, your soul, and a quiet companion to guide you.</p>
                  <p>If you're ready to do the work—of remembrance, of integration, of becoming—Hikma will meet you there.</p>
              </div>
          </div>
      </section>
      
      {/* Final CTA Section */}
      <section id="final-cta" className="py-24 bg-primary text-white text-center">
           <div className="container max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-headline mb-4">
                  Begin your path of hikma.
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
                  The work starts when you return to your heart.
              </p>
              <Button asChild size="lg" className="font-headline text-xl py-8 px-10 bg-white text-primary hover:bg-white/90">
                  <Link href="/signup">
                      Create Your Journal
                  </Link>
              </Button>
              <p className="text-sm mt-4 text-primary-foreground/70">
                  free to start – your data is sacred and private
              </p>
           </div>
      </section>
    </>
  );
}
