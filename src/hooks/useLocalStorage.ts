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
      
      // If the initial value is an array, we expect the stored value to be an array.
      if (Array.isArray(initialValueRef.current)) {
        return Array.isArray(parsed) ? parsed : initialValueRef.current;
      }

      // If it's an object, we merge to handle schema updates
      if (typeof parsed === 'object' && parsed !== null && typeof initialValueRef.current === 'object' && initialValueRef.current !== null) {
        return { ...initialValueRef.current, ...parsed };
      }
      
      return parsed;
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
          
          if (Array.isArray(initialValueRef.current)) {
            setStoredValue(Array.isArray(parsed) ? (parsed as any) : initialValueRef.current);
          } else if (typeof parsed === 'object' && parsed !== null && typeof initialValueRef.current === 'object' && initialValueRef.current !== null) {
            setStoredValue({ ...initialValueRef.current, ...parsed } as any);
          } else {
            setStoredValue(parsed);
          }
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
