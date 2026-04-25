// ⁘[ LANGUAGE PICKER MODAL ]⁘
// aparece la primera vez que abres la app

import { useLangStore } from "@/stores/lang";
import { useState } from "react";
import type { Lang } from "@/utils/i18n";

export function LanguagePicker() {
  const { hasChosen, setLang } = useLangStore();
  const [selected, setSelected] = useState<Lang>("en");

  if (hasChosen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="glass rounded-md p-8 max-w-sm w-full animate-scale-in text-center space-y-6">
        <div>
          <span className="text-brand-500 text-3xl">◈</span>
          <h2 className="font-display text-2xl mt-2">BrewScore</h2>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setSelected("en")}
            className={`w-full py-3 px-4 rounded-sm border text-sm font-medium transition-all ${
              selected === "en"
                ? "border-brand-500 bg-brand-500/15 text-brand-300"
                : "border-border bg-surface text-text-muted hover:border-brand-700"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelected("es")}
            className={`w-full py-3 px-4 rounded-sm border text-sm font-medium transition-all ${
              selected === "es"
                ? "border-brand-500 bg-brand-500/15 text-brand-300"
                : "border-border bg-surface text-text-muted hover:border-brand-700"
            }`}
          >
            Espanol
          </button>
        </div>

        <button
          onClick={() => setLang(selected)}
          className="btn-primary w-full"
        >
          {selected === "en" ? "Continue" : "Continuar"}
        </button>
      </div>
    </div>
  );
}
