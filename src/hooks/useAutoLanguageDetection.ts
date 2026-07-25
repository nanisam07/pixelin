import { useEffect } from "react";
import { useLanguage } from "../translations/LanguageProvider";

export function useAutoLanguageDetection() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred-language");
      if (!saved) {
        const supported = ["en", "te", "hi", "kn", "ml"];
        const browserLanguages = navigator.languages || [navigator.language];
        let matched = "en";

        for (const lang of browserLanguages) {
          const code = lang.split("-")[0].toLowerCase();
          if (supported.includes(code)) {
            matched = code;
            break;
          }
        }

        setLanguage(matched);
      }
    }
  }, [setLanguage]);
}
