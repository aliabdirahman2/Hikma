
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { PsychospiritualProfile } from "@/lib/types";
import { INITIAL_PROFILE } from "@/lib/constants";
import { TemperamentWheel } from "@/components/TemperamentWheel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const [profile] = useLocalStorage<PsychospiritualProfile>(
    "hikma-profile",
    INITIAL_PROFILE
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">
          The Inner Horizon
        </h1>
        <p className="text-lg text-muted-foreground">
          Observe the landscape of your soul.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-1 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Current Soul Stage
            </CardTitle>
            <CardDescription>A poetic sense of your place.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-lg italic text-center py-4 text-primary">
              &ldquo;{profile.soulStage}&rdquo;
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Temperament Balance
            </CardTitle>
            <CardDescription>
              Your unique blend of inner elements.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center min-h-[250px] md:min-h-[300px]">
            <TemperamentWheel data={profile.temperamentBalance} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 flex justify-center">
        <Button asChild size="lg" className="font-headline text-xl py-8 px-10">
          <Link href="/reflect">
            Begin Reflection <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
