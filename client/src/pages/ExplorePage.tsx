// ⁘[ EXPLORE PAGE ]⁘
// busqueda con filtros ~ redirige al home con query params eventualmente
// por ahora es un wrapper del home con filtros visibles

import { useState } from "react";
import { useEstablishments } from "@/api/hooks";
import { EstablishmentCard } from "@/components/cards/EstablishmentCard";
import { CardSkeleton } from "@/components/ui/Skeleton";

const METHODS = ["espresso", "pour-over", "cold brew", "French press", "AeroPress", "siphon"];

export function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [roastsInHouse, setRoastsInHouse] = useState(false);
  const [sort, setSort] = useState("rating");

  const { data, isLoading } = useEstablishments({
    q: search || undefined,
    methods: selectedMethods.length > 0 ? selectedMethods.join(",") : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    roastsInHouse: roastsInHouse || undefined,
    sort,
    limit: 30,
  });

  const toggleMethod = (m: string) => {
    setSelectedMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const establishments = data?.items ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-display text-3xl">Explore</h1>

      {/* search + filters */}
      <div className="card space-y-4">
        <input
          type="text"
          placeholder="Search by name, city, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />

        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Brewing Methods</p>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => toggleMethod(m)}
                className={`text-xs py-1.5 px-3 rounded-full border transition-colors ${
                  selectedMethods.includes(m)
                    ? "bg-brand-500/20 border-brand-500/40 text-brand-300"
                    : "bg-surface-alt border-border text-text-muted hover:border-brand-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-text-muted">
            Min rating:
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="input w-20 text-sm py-1.5 bg-surface"
            >
              <option value={0}>Any</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
              <option value={4.5}>4.5+</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={roastsInHouse}
              onChange={(e) => setRoastsInHouse(e.target.checked)}
              className="accent-brand-500"
            />
            Roasts in-house
          </label>

          <label className="flex items-center gap-2 text-sm text-text-muted ml-auto">
            Sort:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input w-32 text-sm py-1.5 bg-surface"
            >
              <option value="rating">Top Rated</option>
              <option value="score">Transparency</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        </div>
      </div>

      {/* results */}
      <p className="text-text-muted text-sm">
        {isLoading ? "Searching..." : `${establishments.length} results`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)
          : establishments.map((est) => (
              <EstablishmentCard key={est.id} establishment={est} />
            ))}
      </div>

      {!isLoading && establishments.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p className="text-lg mb-2">No spots match your filters</p>
          <p className="text-sm">Try broadening your search</p>
        </div>
      )}
    </div>
  );
}
