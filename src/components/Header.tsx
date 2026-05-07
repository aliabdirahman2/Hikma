"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { Button, buttonVariants } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Settings } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Failed" });
    }
  };

  const navLinkClasses = (path: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      pathname === path ? "text-primary" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="mr-6 flex items-center">
                  <div className="flex items-center font-headline text-lg overflow-hidden rounded-md border border-primary/20">
                    <span className="bg-primary text-[#D4A27A] px-2 py-0.5">Seek</span>
                    <span className="bg-[#D4A27A] text-primary px-2 py-0.5 font-bold">Hikma</span>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-headline italic">Hikma (حكمة): Arabic for Wisdom, Insight, and Discernment.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {mounted && user && (
              <>
                <Link href="/dashboard" className={navLinkClasses("/dashboard")}>Dashboard</Link>
                <Link href="/reflect" className={navLinkClasses("/reflect")}>Reflect</Link>
                <Link href="/practices" className={navLinkClasses("/practices")}>Practices</Link>
                <Link href="/archive" className={navLinkClasses("/archive")}>Archive</Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {mounted && user && (
            <Link href="/settings" className="text-muted-foreground hover:text-primary transition-colors">
              <Settings className="size-5" />
            </Link>
          )}
          {mounted && (
            user ? (
              <Button onClick={handleLogout} variant="ghost" size="sm">Logout</Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>Login</Link>
                <Link href="/signup" className={cn(buttonVariants({ size: 'sm' }))}>Sign Up</Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
