// ⁘[ REVIEW CARD ]⁘

import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import type { Review } from "@/types";

interface Props {
  review: Review;
  showEstablishment?: boolean;
}

export function ReviewCard({ review, showEstablishment = false }: Props) {
  const timeAgo = getTimeAgo(review.createdAt);

  return (
    <div className="card space-y-3 animate-fade-in">
      {/* header ~ usuario */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-sm font-medium shrink-0">
          {review.user?.name.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${review.user?.id}`}
              className="font-medium text-text-primary hover:text-brand-300 transition-colors text-sm truncate"
            >
              {review.user?.name}
            </Link>
            {review.user?.role === "CONNOISSEUR" && (
              <span className="badge-accent text-[10px]">Connoisseur</span>
            )}
          </div>
          <p className="text-text-muted text-xs">{timeAgo}</p>
        </div>
      </div>

      {/* establecimiento si aplica */}
      {showEstablishment && review.establishment && (
        <Link
          to={`/establishment/${review.establishment.id}`}
          className="text-brand-500 hover:text-brand-300 text-sm transition-colors"
        >
          {review.establishment.name} — {review.establishment.city}
        </Link>
      )}

      {/* ratings */}
      <div className="flex items-center gap-3">
        <Rating value={review.ratingOverall} size="sm" />
        {review.drinkOrdered && (
          <span className="text-text-muted text-xs italic">"{review.drinkOrdered}"</span>
        )}
      </div>

      {/* texto */}
      {review.text && <p className="text-text-primary text-sm leading-relaxed">{review.text}</p>}

      {/* sub-ratings */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
        <span>Bean {review.ratingBean}/5</span>
        <span>Prep {review.ratingPrep}/5</span>
        <span>Equipment {review.ratingEquipment}/5</span>
        <span>Consistency {review.ratingConsist}/5</span>
      </div>

      {/* owner reply */}
      {review.ownerReply && (
        <div className="ml-4 pl-4 border-l-2 border-brand-500/30 mt-2">
          <p className="text-xs text-text-muted mb-1">Owner reply</p>
          <p className="text-sm text-text-primary">{review.ownerReply}</p>
        </div>
      )}
    </div>
  );
}

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
