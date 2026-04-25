// ⁘[ HOME PAGE ~ MAPA + LISTA ]⁘

import { useState, useCallback } from "react";
import { MapView } from "@/components/map/MapView";
import { EstablishmentCard } from "@/components/cards/EstablishmentCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useEstablishments } from "@/api/hooks";
import { useGeolocation } from "@/hooks/useGeolocation";

export function HomePage() {
  const { lat, lng } = useGeolocation();
  const [bounds, setBounds] = useState<string>("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"map" | "list">("map");

  const { data, isLoading } = useEstablishments({
    bounds: view === "map" ? bounds : undefined,
    q: search || undefined,
    limit: 50,
  });

  const handleBoundsChange = useCallback((b: string) => setBounds(b), []);
  const establishments = data?.items ?? [];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* sidebar ~ busqueda + lista */}
      <div className="lg:w-96 flex flex-col border-r border-border bg-bg z-10">
        {/* search bar */}
        <div className="p-4 border-b border-border space-y-3">
          <input
            type="text"
            placeholder="Search coffee shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setView("map")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                view === "map" ? "bg-brand-500 text-bg" : "bg-surface-alt text-text-muted"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                view === "list" ? "bg-brand-500 text-bg" : "bg-surface-alt text-text-muted"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* results list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-text-muted text-xs">
            {isLoading ? "Loading..." : `${establishments.length} spots found`}
          </p>
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
            : establishments.map((est) => (
                <EstablishmentCard key={est.id} establishment={est} />
              ))}
          {!isLoading && establishments.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-lg mb-2">No spots found</p>
              <p className="text-sm">Try zooming out or changing your search</p>
            </div>
          )}
        </div>
      </div>

      {/* mapa ~ ocupa el resto */}
      <div className={`flex-1 ${view === "list" ? "hidden lg:block" : ""}`}>
        <MapView
          establishments={establishments}
          userLat={lat}
          userLng={lng}
          onBoundsChange={handleBoundsChange}
        />
      </div>
    </div>
  );
}
