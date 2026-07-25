"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./en.json";
import te from "./te.json";
import hi from "./hi.json";
import kn from "./kn.json";
import ml from "./ml.json";

const translations: Record<string, any> = { en, te, hi, kn, ml };

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (keyPath: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred-language");
      if (saved && translations[saved]) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem("preferred-language", lang);
    }
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current = translations[language] || translations["en"];
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations["en"];
        let found = true;
        for (const fkey of keys) {
          if (fallback && typeof fallback === "object" && fkey in fallback) {
            fallback = fallback[fkey];
          } else {
            found = false;
            break;
          }
        }
        return found && typeof fallback === "string" ? fallback : keyPath;
      }
    }
    return typeof current === "string" ? current : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
export { translations };
