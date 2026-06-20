import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Hikma",
  description: "A space for sacred soul work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Belleza&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          "font-body"
        )}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSf0AUsZ1G0TwuamgY7vOuAy8uMrokmA1bLgUtgiYd33ZaeHAQ/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Feedback</span>
            </a>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
