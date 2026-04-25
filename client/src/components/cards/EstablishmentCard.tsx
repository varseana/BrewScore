// ⁘[ ESTABLISHMENT CARD ]⁘

import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import { TransparencyBadge } from "@/components/ui/TransparencyBadge";
import { useT } from "@/stores/lang";
import { useLangStore } from "@/stores/lang";
import { translateTerm } from "@/utils/i18n";
import type { Establishment } from "@/types";

interface Props {
  establishment: Establishment;
}

export function EstablishmentCard({ establishment: est }: Props) {
  const methods = est.coffeeProgram?.brewingMethods?.slice(0, 3) ?? [];
  const t = useT();
  const { lang } = useLangStore();

  return (
    <Link to={`/establishment/${est.id}`} className="card-interactive block group">
      {est.status === "FLAGGED" && (
        <div className="bg-warning/10 border border-warning/20 rounded-sm px-3 py-1.5 mb-4 text-xs text-warning">
          {t.underReview}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-display text-lg text-text-primary group-hover:text-brand-300 transition-colors">{est.name}</h3>
          <p className="text-text-muted text-sm">{est.city}, {est.country}</p>
        </div>
        <TransparencyBadge score={est.transparencyScore} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Rating value={Math.round(est.avgRating)} size="sm" />
        <span className="text-text-muted text-sm">{est.avgRating.toFixed(1)}</span>
        <span className="text-text-muted/50 text-xs">({est.reviewCount})</span>
        {est.verified && <span className="badge-success text-[10px] ml-auto">{t.verified}</span>}
      </div>

      {methods.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {methods.map((m) => (
            <span key={m} className="badge-brand text-[10px]">{translateTerm(m, lang as "en" | "es")}</span>
          ))}
          {est.coffeeProgram?.roastsInHouse && (
            <span className="badge-accent text-[10px]">{t.roastsInHouse}</span>
          )}
        </div>
      )}
    </Link>
  );
}
