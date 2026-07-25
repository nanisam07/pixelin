import { useLanguage } from "../translations/LanguageProvider";

export function useTranslation() {
  const { language, setLanguage, t } = useLanguage();
  return {
    t,
    language,
    setLanguage
  };
}
