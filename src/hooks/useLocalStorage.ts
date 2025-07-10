"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

function useLocalStorage<T>(baseKey: string, initialValue: T): [T, (value: T | ((prevState: T) => T)) => void] {
  const { user } = useAuth();
  
  // The key is now user-specific, or a fallback if the user is not logged in.
  const key = user ? `${baseKey}-${user.uid}` : baseKey;

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Effect to read from localStorage and sync state
  useEffect(() => {
    // Only run this effect if we're on the client and the user is available.
    if (typeof window === "undefined" || !user) {
      return;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // If no item is found, set the initial value to both state and localStorage
        setStoredValue(initialValue);
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      setStoredValue(initialValue);
    }
  }, [key, user]); // Rerun effect if key changes (i.e., user logs in/out)

  const setValue = (value: T | ((prevState: T) => T)) => {
    // This check is important. Only allow setting value if the user is logged in.
    if (!user) {
        console.warn("Cannot set localStorage value: no user is logged in.");
        return;
    }

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
         window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
