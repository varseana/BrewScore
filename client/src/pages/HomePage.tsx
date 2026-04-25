// ⁘[ HOME PAGE ~ MAPA + LISTA ]⁘
// mobile: mapa fullscreen + bottom sheet + preview top sheet
// desktop: split view sidebar + mapa + preview right panel

import { useState, useCallback } from "react";
import { MapView } from "@/components/map/MapView";
import { EstablishmentPreview } from "@/components/map/EstablishmentPreview";
import { EstablishmentCard } from "@/components/cards/EstablishmentCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useEstablishments, useEstablishment } from "@/api/hooks";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { Establishment } from "@/types";
import { useT } from "@/stores/lang";

export function HomePage() {
  const { lat, lng } = useGeolocation();
  const [bounds, setBounds] = useState<string>("");
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useEstablishments({
    bounds: bounds || undefined,
    q: search || undefined,
    limit: 50,
  });

  // cargar datos completos del seleccionado (con coffee program)
  const { data: selectedEst } = useEstablishment(selectedId ?? "");

  const handleBoundsChange = useCallback((b: string) => setBounds(b), []);
  const handleSelect = useCallback((est: Establishment) => {
    setSelectedId(est.id);
    setSheetOpen(false); // cerrar bottom sheet si esta abierto
  }, []);

  const establishments = data?.items ?? [];
  const t = useT();

  return (
    <div className="h-[calc(100vh-3.5rem)] relative flex flex-col lg:flex-row overflow-hidden">
      {/* ⁘[ DESKTOP SIDEBAR ]⁘ */}
      <div className="hidden lg:flex lg:w-96 flex-col border-r border-border bg-bg z-10">
        <div className="p-4 border-b border-border">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input text-sm"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-text-muted text-xs">
            {isLoading ? t.loading : t.spotsFound(establishments.length)}
          </p>
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
            : establishments.map((est) => (
                <div
                  key={est.id}
                  onClick={() => handleSelect(est)}
                  className="cursor-pointer"
                >
                  <EstablishmentCard establishment={est} />
                </div>
              ))}
          {!isLoading && establishments.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-lg mb-2">{t.noSpotsTitle}</p>
              <p className="text-sm">Try zooming out or changing your search</p>
            </div>
          )}
        </div>
      </div>

      {/* ⁘[ MAPA ]⁘ */}
      <div className="absolute inset-0 lg:relative lg:flex-1">
        <MapView
          establishments={establishments}
          userLat={lat}
          userLng={lng}
          onBoundsChange={handleBoundsChange}
          onSelectEstablishment={handleSelect}
        />
      </div>

      {/* ⁘[ PREVIEW PANEL ]⁘ ~ aparece al clickear marker o card */}
      {selectedEst && selectedId && (
        <EstablishmentPreview
          establishment={selectedEst}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* ⁘[ MOBILE SEARCH BAR ]⁘ */}
      {!selectedId && (
        <div className="lg:hidden absolute top-3 left-3 right-3 z-[1000]">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface/95 backdrop-blur-sm border border-border rounded-md px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 shadow-glass"
          />
        </div>
      )}

      {/* ⁘[ MOBILE BOTTOM SHEET ]⁘ */}
      {!selectedId && (
        <div
          className={`lg:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-bg border-t border-border rounded-t-lg transition-transform duration-300 ease-smooth ${
            sheetOpen ? "translate-y-0" : "translate-y-[calc(100%-3.5rem)]"
          }`}
          style={{ maxHeight: "60vh" }}
        >
          <button
            onClick={() => setSheetOpen(!sheetOpen)}
            className="w-full flex flex-col items-center py-2 px-4"
            aria-label={sheetOpen ? "Collapse results" : "Expand results"}
          >
            <div className="w-10 h-1 bg-text-muted/30 rounded-full mb-2" />
            <p className="text-text-muted text-xs font-medium">
              {isLoading ? t.loading : t.spotsFound(establishments.length)}
            </p>
          </button>
          <div className="overflow-y-auto px-4 pb-4 space-y-3" style={{ maxHeight: "calc(60vh - 3.5rem)" }}>
            {isLoading
              ? Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)
              : establishments.map((est) => (
                  <div key={est.id} onClick={() => handleSelect(est)} className="cursor-pointer">
                    <EstablishmentCard establishment={est} />
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
