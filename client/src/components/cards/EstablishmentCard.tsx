// ⁘[ ESTABLISHMENT CARD ]⁘

import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import { TransparencyBadge } from "@/components/ui/TransparencyBadge";
import type { Establishment } from "@/types";

interface Props {
  establishment: Establishment;
}

export function EstablishmentCard({ establishment: est }: Props) {
  const methods = est.coffeeProgram?.brewingMethods?.slice(0, 3) ?? [];

  return (
    <Link to={`/establishment/${est.id}`} className="card-interactive block group">
      {/* status banner si esta flagged */}
      {est.status === "FLAGGED" && (
        <div className="bg-warning/10 border border-warning/20 rounded-sm px-3 py-1.5 mb-4 text-xs text-warning">
          Under review — some information may be inaccurate
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-display text-lg text-text-primary group-hover:text-brand-300 transition-colors">
            {est.name}
          </h3>
          <p className="text-text-muted text-sm">{est.city}, {est.country}</p>
        </div>
        <TransparencyBadge score={est.transparencyScore} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Rating value={Math.round(est.avgRating)} size="sm" />
        <span className="text-text-muted text-sm">{est.avgRating.toFixed(1)}</span>
        <span className="text-text-muted/50 text-xs">({est.reviewCount})</span>
        {est.verified && <span className="badge-success text-[10px] ml-auto">Verified</span>}
      </div>

      {methods.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {methods.map((m) => (
            <span key={m} className="badge-brand text-[10px]">{m}</span>
          ))}
          {est.coffeeProgram?.roastsInHouse && (
            <span className="badge-accent text-[10px]">Roasts in-house</span>
          )}
        </div>
      )}
    </Link>
  );
}
