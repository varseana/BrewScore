// ⁘[ HOVER CARD ~ PREVIEW EN EL MAPA ]⁘

import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import { TransparencyBadge } from "@/components/ui/TransparencyBadge";
import type { Establishment } from "@/types";

interface Props {
  establishment: Establishment;
  userLat?: number | null;
  userLng?: number | null;
}

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

export function HoverCard({ establishment: est, userLat, userLng }: Props) {
  const methods = est.coffeeProgram?.brewingMethods?.slice(0, 2) ?? [];
  const distance = userLat && userLng ? calcDistance(userLat, userLng, est.lat, est.lng) : null;

  return (
    <div className="glass rounded-md p-4 w-64 shadow-glass-hover animate-fade-in">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display text-base text-text-primary leading-tight">{est.name}</h3>
        <TransparencyBadge score={est.transparencyScore} size="sm" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Rating value={Math.round(est.avgRating)} size="sm" />
        <span className="text-text-muted text-xs">{est.avgRating.toFixed(1)}</span>
        {distance && <span className="text-text-muted text-xs ml-auto">{distance}</span>}
      </div>

      {methods.length > 0 && (
        <div className="flex gap-1.5 mb-3">
          {methods.map((m) => (
            <span key={m} className="badge-brand text-[10px]">{m}</span>
          ))}
        </div>
      )}

      <Link
        to={`/establishment/${est.id}`}
        className="text-brand-500 hover:text-brand-300 text-xs font-medium transition-colors"
      >
        View Profile →
      </Link>
    </div>
  );
}
