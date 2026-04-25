// ⁘[ SKELETON LOADERS ]⁘

export function CardSkeleton() {
  return (
    <div className="card space-y-4 animate-pulse">
      <div className="skeleton h-40 w-full rounded-sm" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="card space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-6">
        <div className="skeleton h-24 w-24 rounded-full" />
        <div className="space-y-3 flex-1">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-4 w-64" />
        </div>
      </div>
    </div>
  );
}
