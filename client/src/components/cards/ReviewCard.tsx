// ⁘[ REVIEW CARD ]⁘
// con auto-traduccion de texto y boton "ver original"

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Rating } from "@/components/ui/Rating";
import { useT } from "@/stores/lang";
import { useLangStore } from "@/stores/lang";
import type { Review } from "@/types";

interface Props {
  review: Review;
  showEstablishment?: boolean;
}

export function ReviewCard({ review, showEstablishment = false }: Props) {
  const timeAgo = getTimeAgo(review.createdAt);
  const t = useT();
  const { lang } = useLangStore();
  const [translated, setTranslated] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  // auto-traducir si el idioma es diferente al del texto
  useEffect(() => {
    if (!review.text || lang === "en") {
      setTranslated(null);
      return;
    }
    // si el texto parece estar en ingles y el usuario quiere espanol, traducir
    if (lang === "es" && looksEnglish(review.text)) {
      translateText(review.text, "en", "es").then(setTranslated).catch(() => setTranslated(null));
    } else {
      setTranslated(null);
    }
  }, [review.text, lang]);

  const displayText = showOriginal ? review.text : (translated ?? review.text);
  const hasTranslation = translated !== null && translated !== review.text;

  return (
    <div className="card space-y-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-sm font-medium shrink-0">
          {review.user?.name.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${review.user?.id}`} className="font-medium text-text-primary hover:text-brand-300 transition-colors text-sm truncate">
              {review.user?.name}
            </Link>
            {review.user?.role === "CONNOISSEUR" && <span className="badge-accent text-[10px]">Connoisseur</span>}
          </div>
          <p className="text-text-muted text-xs">{timeAgo}</p>
        </div>
      </div>

      {showEstablishment && review.establishment && (
        <Link to={`/establishment/${review.establishment.id}`} className="text-brand-500 hover:text-brand-300 text-sm transition-colors">
          {review.establishment.name} — {review.establishment.city}
        </Link>
      )}

      <div className="flex items-center gap-3">
        <Rating value={review.ratingOverall} size="sm" />
        {review.drinkOrdered && <span className="text-text-muted text-xs italic">"{review.drinkOrdered}"</span>}
      </div>

      {displayText && (
        <div>
          <p className="text-text-primary text-sm leading-relaxed">{displayText}</p>
          {hasTranslation && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-brand-500 hover:text-brand-300 text-xs mt-1 transition-colors"
            >
              {showOriginal
                ? (lang === "es" ? "Ver traduccion" : "See translation")
                : (lang === "es" ? "Ver original" : "See original")}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
        <span>{t.bean} {review.ratingBean}/5</span>
        <span>{t.prep} {review.ratingPrep}/5</span>
        <span>{t.equipmentRating} {review.ratingEquipment}/5</span>
        <span>{t.consistency} {review.ratingConsist}/5</span>
      </div>

      {review.ownerReply && (
        <div className="ml-4 pl-4 border-l-2 border-brand-500/30 mt-2">
          <p className="text-xs text-text-muted mb-1">Owner reply</p>
          <p className="text-sm text-text-primary">{review.ownerReply}</p>
        </div>
      )}
    </div>
  );
}

// ⁘[ HELPERS ]⁘

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// detectar si el texto parece ingles (heuristica simple)
function looksEnglish(text: string): boolean {
  const englishWords = ["the", "and", "is", "was", "but", "for", "not", "with", "this", "that", "from", "best", "great", "good", "coffee", "amazing", "excellent"];
  const words = text.toLowerCase().split(/\s+/);
  const matches = words.filter((w) => englishWords.includes(w)).length;
  return matches >= 2 || (matches >= 1 && words.length <= 10);
}

// traducir usando mymemory api (gratis, sin key, 5000 chars/dia)
const translationCache = new Map<string, string>();

async function translateText(text: string, from: string, to: string): Promise<string> {
  const cacheKey = `${from}:${to}:${text}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!;

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${from}|${to}`
    );
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (translated && translated !== text) {
      translationCache.set(cacheKey, translated);
      return translated;
    }
    return text;
  } catch {
    return text;
  }
}
