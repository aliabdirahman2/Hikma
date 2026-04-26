import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, Waves, Wind, Mountain, Flame, Compass, Edit, Heart, Sparkles, Users, User } from "lucide-react";

const steps = [
  {
    icon: <Compass className="size-8 text-primary" />,
    title: "1. Attune to the Elemental Climate",
    description: "Every soul has an inner climate. Before you can understand the landscape, you must feel the weather. By choosing an element—Fire, Water, Air, or Earth—you are acknowledging the energy that is most active for you today.",
    details: [
      "🔥 Fire: The principle of action and will. Vital for creativity, dangerous if uncontrolled in a peaceful environment.",
      "🌊 Water: The principle of emotion and flow. Vital for empathy, heavy if it turns to stagnation.",
      "🌬️ Air: The principle of intellect and vision. Vital for clarity, scattered if it loses its grounding.",
      "🪨 Earth: The principle of stability and form. Vital for endurance, stubborn if it refuses to shift.",
    ]
  },
  {
    icon: <Edit className="size-8 text-primary" />,
    title: "2. The Intrapersonal Tension",
    description: "The soul is not static; it is a space of fluid temperament. A state of high Fire is perfect for a passion project but causes friction in a family setting. SeekHikma analyzes your journal to see if your current element serves your environment or causes internal imbalance (I'tidal).",
    details: [
        "We track how your temperament shifts between work, home, and solitude.",
        "Balance is defined by your context, not a single rigid ideal.",
        "Identifying these tensions is the first step to polishing the mirror."
    ]
  },
  {
    icon: <Heart className="size-8 text-primary" />,
    title: "3. Unveiling the Heart Mirror",
    description: "Rarely do we start by telling the whole truth. If SeekHikma senses the mirror is veiled by sarcasm, deflection, or surface-level words, she will pause. Through a brief Heart Mirror dialogue (max 3 questions), you are invited to move from performance to presence.",
    details: [
        "Honesty is the only requirement for the veil to lift.",
        "The mirror only reflects clearly when the heart is sincere.",
        "This dialogue helps you move from 'what happened' to 'what I felt'."
    ]
  },
  {
    icon: <Users className="size-8 text-primary" />,
    title: "4. Interpersonal Alchemy",
    description: "Often, our imbalance is triggered by others. If conflict is detected, SeekHikma initiates a 'Diagnostic Unveiling' about the other person. By understanding their elemental dominant, we can map the 'clash of elements' and provide strategies for a bridge.",
    details: [
        "Identify if your Fire is meeting their Stone.",
        "Receive specific communication insights to resolve the element clash.",
        "Visualize the temperament gap between you and the other."
    ]
  },
  {
    icon: <Sparkles className="size-8 text-primary" />,
    title: "5. Integration & Practice",
    description: "The journey ends with a Wisdom Seed—a single poetic anchor for your day—and prescribed practices to tend your inner garden. These are not tasks, but invitations to return to your center.",
    details: [
        "Accepted practices are tracked in your personal 'Garden'.",
        "Reflections are archived to trace the evolution of your soul.",
        "The goal is Ma'rifah—the deep, experiential knowledge of the self."
    ]
  },
];

export default function ProcessPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">
          The Path of SeekHikma
        </h1>
        <p className="text-lg text-muted-foreground">
          Understanding the Alchemy of the Self and the Other
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step) => (
          <Card key={step.title} className="overflow-hidden border-primary/10">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">{step.icon}</div>
              <div className="flex-1">
                <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed">{step.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pl-16">
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                {step.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
