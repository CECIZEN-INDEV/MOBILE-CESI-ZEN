import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    (async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading AsyncStorage key "${key}":`, error);
      }
    })();
  }, [key]);

  const setValue = async (value: T) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
      const savedItem = await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error setting AsyncStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
