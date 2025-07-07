
import { LayoutDashboard, BookOpen, Heart, MessageCircle, Archive, Leaf } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: <LayoutDashboard className="size-8 text-primary" />,
    title: "The Inner Horizon",
    description:
      "Your personal dashboard provides an at-a-glance view of your current soul stage and temperament balance, offering a snapshot of your inner world.",
  },
  {
    icon: <BookOpen className="size-8 text-primary" />,
    title: "Sacred Reflection",
    description:
      "Engage in a guided reflection process. By choosing a symbol and journaling your thoughts, you invite Hikma to offer a deep, psychospiritual analysis of your state.",
  },
  {
    icon: <Heart className="size-8 text-primary" />,
    title: "Unveiling the Heart",
    description:
      "If your reflection is 'veiled' by defensiveness, Hikma initiates a gentle, supportive chat to help you find the honesty needed for a true breakthrough.",
  },
  {
    icon: <MessageCircle className="size-8 text-primary" />,
    title: "Deeper Conversation",
    description:
      "After receiving a reflection, go deeper. Hikma provides a unique symbolic phrase to interpret, opening a conversational space to explore the nuances of your journey.",
  },
  {
    icon: <Archive className="size-8 text-primary" />,
    title: "The Reflection Ledger",
    description:
      "Revisit your entire journey. The archive stores every reflection, allowing you to trace your progress, identify patterns, and witness your growth over time.",
  },
    {
    icon: <Leaf className="size-8 text-primary" />,
    title: "Daily Practices",
    description:
      "Cultivate inner balance by tending to your daily practices. Based on your reflections, you can accept and track habits that support your spiritual well-being.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">
          The Path of Hikma
        </h1>
        <p className="text-lg text-muted-foreground">
          A suite of tools for sacred soul work and self-discovery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    {feature.icon}
                </div>
                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
