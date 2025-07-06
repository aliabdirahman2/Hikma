
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navLinkClasses = (path: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      pathname === path ? "text-primary" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold font-headline text-lg text-primary">
              Hikma
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className={navLinkClasses("/")}>
              Dashboard
            </Link>
            <Link href="/reflect" className={navLinkClasses("/reflect")}>
              Reflect
            </Link>
            <Link href="/archive" className={navLinkClasses("/archive")}>
              Archive
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
