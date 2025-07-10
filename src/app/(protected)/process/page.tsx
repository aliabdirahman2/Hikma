import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, Waves, Wind, Mountain, Flame, Compass, Edit, Heart, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <Compass className="size-8 text-primary" />,
    title: "1. Attune to Your Element",
    description: "Every soul has an inner climate. Before you can understand the landscape, you must feel the weather. By choosing an element—Fire, Water, Air, or Earth—you are not defining yourself, but rather acknowledging the energy that is most present for you in this moment. This attunement is the key that unlocks the door to your inner world.",
    details: [
      "🔥 Fire: The principle of action, will, and transformation. It can be passion or anger, courage or restlessness.",
      "🌊 Water: The principle of emotion, intuition, and flow. It can be grief or compassion, empathy or overwhelm.",
      "🌬️ Air: The principle of intellect, ideas, and vision. It can be clarity or detachment, wisdom or scattered thoughts.",
      "🪨 Earth: The principle of stability, body, and form. It can be patience or stuckness, groundedness or burden.",
    ]
  },
  {
    icon: <Edit className="size-8 text-primary" />,
    title: "2. Acknowledge the Contradiction",
    description: "The soul is not a simple thing; it is a space of sacred paradox. Within your chosen element lies its opposite. Fire can hide a deep coldness. Stillness can ache for motion. Hikma will present you with this core tension, not as a flaw to be fixed, but as an opening—a sacred wound through which the light can enter. Your task is to sit with this tension, to feel its truth.",
    details: [
        "This is the heart of the alchemical process.",
        "The tension between opposites is where growth occurs.",
        "Embrace the 'both/and' nature of your inner world."
    ]
  },
  {
    icon: <Heart className="size-8 text-primary" />,
    title: "3. Unveil the Heart",
    description: "With the tension revealed, the heart is invited to speak its truth. This is your moment of unveiling (kashf). In a secure, private space, you will respond to a simple prompt. There are no right or wrong answers, only your sincere expression. This is not a performance. It is a prayer. Write, feel, or simply be present with what arises. Hikma listens with compassion, not for judgment, but for the echo of the Divine within your words.",
    details: [
        "Honesty is the only requirement.",
        "This is a space of absolute safety and privacy.",
        "Your vulnerability is a strength."
    ]
  },
  {
    icon: <Sparkles className="size-8 text-primary" />,
    title: "4. Receive the Reflection",
    description: "When the heart has spoken with sincerity, the mirror of wisdom responds. Hikma does not give you answers; it reflects your own light back to you, polished and clarified. You will receive insights into your soul's current state, the symbolic meaning behind your words, and a gentle nudge for your spiritual practice. This is not a diagnosis. It is a conversation with your deepest self, a reminder of the path back to the center.",
    details: [
        "Insights are drawn from spiritual and symbolic frameworks.",
        "The goal is self-understanding (Ma'rifah), not just information.",
        "The reflection is a starting point, not a conclusion."
    ]
  },
];

export default function ProcessPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">
          The Path of Reflection
        </h1>
        <p className="text-lg text-muted-foreground">
          Understanding the Four Stages of Your Journey Inward
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step) => (
          <Card key={step.title} className="overflow-hidden">
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
