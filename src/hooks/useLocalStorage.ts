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
      if (!item) return initialValueRef.current;
      
      const parsed = JSON.parse(item);
      // Merge with initial value to handle schema updates/missing fields
      return typeof parsed === 'object' && parsed !== null 
        ? { ...initialValueRef.current, ...parsed } 
        : parsed;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValueRef.current;
    }
  });
  
  useEffect(() => {
    if (key) {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          setStoredValue(typeof parsed === 'object' && parsed !== null 
            ? { ...initialValueRef.current, ...parsed } 
            : parsed
          );
        } else {
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
