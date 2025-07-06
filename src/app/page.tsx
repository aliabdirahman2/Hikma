
"use client";

import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
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
import { SoulMirror } from "@/components/SoulMirror";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
            <CardDescription className="flex items-center gap-1">
              A poetic sense of your place.
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-center p-3">
                            <p>Your soul is like a mirror. When it is clear, it reflects qualities like mercy, patience, and justice—the Names of the Divine.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between text-center">
            <p className="text-lg italic text-primary">
              &ldquo;{profile.soulStage}&rdquo;
            </p>
            <SoulMirror 
                temperamentBalance={profile.temperamentBalance} 
                veiledCount={profile.veiledCount}
            />
             {profile.veiledCount > 0 && (
                <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                    <p className="font-semibold">The Mirror is Veiled</p>
                    <p className="italic">&ldquo;Balance without truth is equilibrium in illusion. Peace comes through unveiling.&rdquo;</p>
                </div>
             )}
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
