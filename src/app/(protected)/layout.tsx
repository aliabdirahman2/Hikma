"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { OnboardingFlow } from "@/components/OnboardingFlow";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // This state is now managed inside the layout to control the onboarding flow
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    user ? `hikma-onboarding-completed-${user.uid}` : 'hikma-onboarding-completed', 
    false
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };
  
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is logged in but hasn't completed onboarding, show the flow.
  if (user && !hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Otherwise, show the main app content.
  return <>{children}</>;
}
