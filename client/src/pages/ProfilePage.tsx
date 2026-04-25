// ⁘[ PROFILE PAGE ]⁘

import { useParams } from "react-router-dom";
import { useUser, useToggleFollow, useUserReviews } from "@/api/hooks";
import { useAuthStore } from "@/stores/auth";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { useT } from "@/stores/lang";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useAuthStore();
  const { data: user, isLoading } = useUser(id!);
  const { data: reviewPages, fetchNextPage, hasNextPage } = useUserReviews(id!);
  const toggleFollow = useToggleFollow();
  const t = useT();

  const reviews = reviewPages?.pages.flatMap((p) => p.items) ?? [];
  const isMe = me?.id === id;

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-8"><ProfileSkeleton /></div>;
  if (!user) return <div className="text-center py-20 text-text-muted">{t.pageNotFound}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-brand-500/20 border-2 border-brand-500/30 flex items-center justify-center text-brand-300 text-2xl font-display shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl">{user.name}</h1>
            {user.role === "CONNOISSEUR" && <span className="badge-accent">Connoisseur</span>}
            {user.role === "OWNER" && <span className="badge-brand">Owner</span>}
            {user.role === "ADMIN" && <span className="badge-error">Admin</span>}
          </div>
          {user.bio && <p className="text-text-muted text-sm mb-3">{user.bio}</p>}
          <div className="flex items-center gap-6 text-sm">
            <span><strong className="text-text-primary">{user.reviewCount}</strong> <span className="text-text-muted">{t.reviews.toLowerCase()}</span></span>
            <span><strong className="text-text-primary">{user.followerCount}</strong> <span className="text-text-muted">{t.followers}</span></span>
            <span><strong className="text-text-primary">{user.followingCount}</strong> <span className="text-text-muted">{t.following}</span></span>
          </div>
          {user.tastePreferences.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {user.tastePreferences.map((p) => <span key={p} className="badge-brand text-[10px]">{p}</span>)}
            </div>
          )}
          {!isMe && me && (
            <button onClick={() => toggleFollow.mutate(user.id)} className={`mt-4 text-sm py-2 px-4 ${user.isFollowing ? "btn-secondary" : "btn-primary"}`}>
              {user.isFollowing ? t.unfollow : t.follow}
            </button>
          )}
        </div>
      </div>
      <div>
        <h2 className="font-display text-xl mb-4">{t.reviews}</h2>
        <div className="space-y-3">
          {reviews.length === 0 && <p className="text-text-muted text-sm">{t.noReviews}</p>}
          {reviews.map((r) => <ReviewCard key={r.id} review={r} showEstablishment />)}
          {hasNextPage && <button onClick={() => fetchNextPage()} className="btn-secondary w-full text-sm">{t.loadMore}</button>}
        </div>
      </div>
    </div>
  );
}
