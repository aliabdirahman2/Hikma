"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

function useLocalStorage<T>(baseKey: string, initialValue: T): [T, (value: T | ((prevState: T) => T)) => void] {
  const { user, loading } = useAuth();
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const key = user ? `${baseKey}-${user.uid}` : null;

  useEffect(() => {
    if (loading || !key || typeof window === "undefined") {
      // Wait until authentication is resolved and we have a user-specific key
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(initialValue);
    }
  }, [key, loading, initialValue]);

  const setValue = (value: T | ((prevState: T) => T)) => {
    if (loading || !key || typeof window === "undefined") {
      // Do not attempt to set value if auth is loading or user is not logged in.
      return;
    }

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
