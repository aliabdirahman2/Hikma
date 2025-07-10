
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    user ? `hikma-onboarding-completed-${user.uid}` : 'hikma-onboarding-completed', 
    false
  );
  
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Check for the session flag on component mount
    const newUserFlag = sessionStorage.getItem('isNewUser');
    if (newUserFlag === 'true') {
      setIsNewUser(true);
      // Clean up the flag so it's not used again on refresh
      sessionStorage.removeItem('isNewUser');
    }
  }, []);


  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setIsNewUser(false); // Onboarding is done, exit the onboarding view
  };
  
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show onboarding if it's a new user and they haven't somehow already completed it.
  if (isNewUser && !hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Otherwise, show the main app content.
  return <>{children}</>;
}
