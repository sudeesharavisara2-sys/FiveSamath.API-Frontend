import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import en from "../locales/en";
import si from "../locales/si";
import ta from "../locales/ta";
import type { Language } from "../types";

const dictionaries = { en, si, ta };
type Dict = typeof en;

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "fivesamath_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(
    () => (localStorage.getItem(STORAGE_KEY) as Language) || "en"
  );

  const setLang = (next: Language) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const t = useMemo(() => dictionaries[lang], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div lang={lang} className={lang === "si" ? "lang-si" : undefined}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
