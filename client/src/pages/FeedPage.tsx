// ⁘[ FEED PAGE ]⁘

import { useState } from "react";
import { useGlobalFeed, useFollowingFeed, useTopConnoisseurs } from "@/api/hooks";
import { useAuthStore } from "@/stores/auth";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { ReviewSkeleton } from "@/components/ui/Skeleton";
import { Link } from "react-router-dom";
import { useT } from "@/stores/lang";

export function FeedPage() {
  const { isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState<"global" | "following">("global");
  const t = useT();

  const global = useGlobalFeed();
  const following = useFollowingFeed();
  const { data: topConnoisseurs } = useTopConnoisseurs();

  const feed = tab === "global" ? global : following;
  const reviews = feed.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="font-display text-2xl">{t.feed}</h1>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setTab("global")} className={`text-sm py-1.5 px-3 rounded-sm transition-colors ${tab === "global" ? "bg-brand-500 text-bg" : "bg-surface-alt text-text-muted"}`}>
                {t.global}
              </button>
              {isAuthenticated() && (
                <button onClick={() => setTab("following")} className={`text-sm py-1.5 px-3 rounded-sm transition-colors ${tab === "following" ? "bg-brand-500 text-bg" : "bg-surface-alt text-text-muted"}`}>
                  {t.following}
                </button>
              )}
            </div>
          </div>
          {feed.isLoading
            ? Array.from({ length: 3 }, (_, i) => <ReviewSkeleton key={i} />)
            : reviews.map((r) => <ReviewCard key={r.id} review={r} showEstablishment />)}
          {reviews.length === 0 && !feed.isLoading && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-lg mb-2">{tab === "following" ? t.noFeedFollowing : t.noFeedGlobal}</p>
              {tab === "following" && <p className="text-sm">{t.followSuggestion}</p>}
            </div>
          )}
          {feed.hasNextPage && <button onClick={() => feed.fetchNextPage()} className="btn-secondary w-full text-sm">{t.loadMore}</button>}
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-lg">{t.topConnoisseurs}</h2>
          {topConnoisseurs?.map((c) => (
            <Link key={c.id} to={`/profile/${c.id}`} className="card-interactive flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-[#c46b82] text-sm font-medium shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{c.name}</p>
                <p className="text-xs text-text-muted">{c.reviewCount} {t.reviews.toLowerCase()} · {c.followerCount} {t.followers}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
