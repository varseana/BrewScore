// ⁘[ HOME PAGE ~ MAPA + LISTA ]⁘
// mobile: mapa fullscreen + bottom sheet
// desktop: split view sidebar + mapa

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
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isLoading } = useEstablishments({
    bounds: view === "map" ? bounds : undefined,
    q: search || undefined,
    limit: 50,
  });

  const handleBoundsChange = useCallback((b: string) => setBounds(b), []);
  const establishments = data?.items ?? [];

  return (
    <div className="h-[calc(100vh-3.5rem)] relative flex flex-col lg:flex-row overflow-hidden">
      {/* ⁘[ DESKTOP SIDEBAR ]⁘ ~ solo visible en lg+ */}
      <div className="hidden lg:flex lg:w-96 flex-col border-r border-border bg-bg z-10">
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

      {/* ⁘[ MAPA ]⁘ ~ fullscreen en mobile, flex-1 en desktop */}
      <div className={`flex-1 min-h-0 ${view === "list" ? "hidden lg:block" : ""}`}>
        <MapView
          establishments={establishments}
          userLat={lat}
          userLng={lng}
          onBoundsChange={handleBoundsChange}
        />
      </div>

      {/* ⁘[ MOBILE SEARCH BAR ]⁘ ~ floating en top del mapa */}
      <div className="lg:hidden absolute top-3 left-3 right-3 z-[1000]">
        <input
          type="text"
          placeholder="Search coffee shops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface/95 backdrop-blur-sm border border-border rounded-md px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 shadow-glass"
        />
      </div>

      {/* ⁘[ MOBILE BOTTOM SHEET ]⁘ */}
      <div
        className={`lg:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-bg border-t border-border rounded-t-lg transition-transform duration-300 ease-smooth ${
          sheetOpen ? "translate-y-0" : "translate-y-[calc(100%-3.5rem)]"
        }`}
        style={{ maxHeight: "60vh" }}
      >
        {/* handle + toggle */}
        <button
          onClick={() => setSheetOpen(!sheetOpen)}
          className="w-full flex flex-col items-center py-2 px-4"
          aria-label={sheetOpen ? "Collapse results" : "Expand results"}
        >
          <div className="w-10 h-1 bg-text-muted/30 rounded-full mb-2" />
          <p className="text-text-muted text-xs font-medium">
            {isLoading ? "Loading..." : `${establishments.length} spots found`}
          </p>
        </button>

        {/* scrollable list */}
        <div className="overflow-y-auto px-4 pb-4 space-y-3" style={{ maxHeight: "calc(60vh - 3.5rem)" }}>
          {isLoading
            ? Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)
            : establishments.map((est) => (
                <EstablishmentCard key={est.id} establishment={est} />
              ))}
        </div>
      </div>
    </div>
  );
}
