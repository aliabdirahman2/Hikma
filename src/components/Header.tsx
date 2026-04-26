"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { Button, buttonVariants } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (!auth) {
      toast({ variant: "destructive", title: "Logout Failed", description: "Firebase is not configured." });
      return;
    }
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/");
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
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
          <Link href="/" className="mr-6 flex items-center">
            <div className="flex items-center font-headline text-lg overflow-hidden rounded-md border border-primary/20">
                <span className="bg-primary text-background px-2 py-0.5">Seek</span>
                <span className="bg-background text-primary px-2 py-0.5">Hikma</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {user && (
              <>
                <Link href="/dashboard" className={navLinkClasses("/dashboard")}>
                  Dashboard
                </Link>
                <Link href="/reflect" className={navLinkClasses("/reflect")}>
                  Reflect
                </Link>
                 <Link href="/process" className={navLinkClasses("/process")}>
                  Process
                </Link>
                <Link href="/practices" className={navLinkClasses("/practices")}>
                  Practices
                </Link>
                <Link href="/archive" className={navLinkClasses("/archive")}>
                  Archive
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
          ) : (
            <div className="flex items-center gap-2">
                <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                Login
                </Link>
                <Link href="/signup" className={cn(buttonVariants({ size: 'sm' }))}>
                Sign Up
                </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
