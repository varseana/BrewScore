// ⁘[ LANGUAGE STORE ]⁘

import { create } from "zustand";
import { persist } from "zustand/middleware";
import translations, { type Lang, type TranslationKey } from "@/utils/i18n";

interface LangState {
  lang: Lang;
  hasChosen: boolean;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string | ((...args: unknown[]) => string);
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "en",
      hasChosen: false,
      setLang: (lang) => set({ lang, hasChosen: true }),
      t: (key) => {
        const val = translations[get().lang][key];
        return val as string | ((...args: unknown[]) => string);
      },
    }),
    { name: "brewscore-lang" }
  )
);

// helper tipado para usar en componentes
export function useT() {
  const { lang } = useLangStore();
  const dict = translations[lang];
  return dict;
}
