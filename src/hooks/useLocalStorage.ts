
"use client";

import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prevState: T) => T)) => void] {
  // We initialize the state with the initialValue. This ensures that the first render on both the server
  // and the client is identical, preventing a hydration mismatch.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // This effect runs only on the client, after the component has mounted.
  useEffect(() => {
    try {
      // Try to get the item from localStorage.
      const item = window.localStorage.getItem(key);
      // If the item exists, parse it and update our state.
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
    // The dependency array with `key` ensures this effect runs if the key changes,
    // though typically it won't. This is safer than an empty array.
  }, [key]);

  const setValue = (value: T | ((prevState: T) => T)) => {
    try {
      // This allows the new value to be a value, or a function that receives the previous state.
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Update our React state.
      setStoredValue(valueToStore);
      // Persist the new value to localStorage.
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
