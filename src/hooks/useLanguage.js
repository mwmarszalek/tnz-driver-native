import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { translations, formatTranslation } from "../locales/translations";

const LANGUAGE_STORAGE_KEY = "@tnz_driver_language";

// Simple storage wrapper for both web and native
const storage = {
  getItem: async (key) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    // For native, we'll use AsyncStorage when available
    // For now, keep in state only
    return null;
  },
  setItem: async (key, value) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    }
    // For native, AsyncStorage will be added later
  },
};

export const useLanguage = () => {
  const [language, setLanguage] = useState("pl");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await storage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === "pl" || savedLanguage === "uk")) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await storage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const t = (key, params) => {
    const text = translations[language]?.[key] || translations.pl[key] || key;
    return params ? formatTranslation(text, params) : text;
  };

  const toggleLanguage = () => {
    const newLanguage = language === "pl" ? "uk" : "pl";
    changeLanguage(newLanguage);
  };

  return {
    language,
    setLanguage: changeLanguage,
    toggleLanguage,
    t,
    isLoading,
  };
};
