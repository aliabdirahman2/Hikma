"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

function useLocalStorage<T>(
  baseKey: string,
  initialValue: T
): [T, (value: T | ((prevState: T) => T)) => void] {
  const { user } = useAuth();
  const key = user ? `${baseKey}-${user.uid}` : null;
  const initialValueRef = useRef(initialValue);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined" || !key) {
      return initialValueRef.current;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValueRef.current;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValueRef.current;
    }
  });
  
  // This effect runs when the user logs in or out (key changes)
  // to load their specific data.
  useEffect(() => {
    if (key) {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        } else {
          // If no data is found for this user, set it to the initial value.
          setStoredValue(initialValueRef.current);
        }
      } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        setStoredValue(initialValueRef.current);
      }
    }
  }, [key]);

  const setValue = (value: T | ((prevState: T) => T)) => {
    if (!key || typeof window === "undefined") {
      console.warn("Could not save to localStorage: no user or window not present.");
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
