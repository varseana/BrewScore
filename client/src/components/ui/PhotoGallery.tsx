// ⁘[ PHOTO GALLERY ]⁘
// galeria con lightbox ~ click para ver grande, grid para preview

import { useState } from "react";
import { useT } from "@/stores/lang";

interface Props {
  photos: string[];
  maxPreview?: number;
}

export function PhotoGallery({ photos, maxPreview = 3 }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const t = useT();

  if (photos.length === 0) return null;

  const visible = showAll ? photos : photos.slice(0, maxPreview);
  const remaining = photos.length - maxPreview;

  return (
    <>
      {/* grid */}
      <div className="grid grid-cols-3 gap-2 rounded-md overflow-hidden">
        {visible.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightboxIdx(i)}
            className="relative aspect-[4/3] overflow-hidden group"
          >
            <img
              src={url}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            {/* overlay "ver todas" en la ultima foto si hay mas */}
            {!showAll && i === maxPreview - 1 && remaining > 0 && (
              <div
                onClick={(e) => { e.stopPropagation(); setShowAll(true); }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
              >
                <span className="text-text-primary text-sm font-medium">+{remaining} {t.photos}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {showAll && photos.length > maxPreview && (
        <button
          onClick={() => setShowAll(false)}
          className="text-brand-500 hover:text-brand-300 text-xs mt-1 transition-colors"
        >
          {t.showLess}
        </button>
      )}

      {/* lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxIdx(null)}
        >
          {/* close */}
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-10"
            aria-label="Close"
          >
            &times;
          </button>

          {/* prev */}
          {lightboxIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
              className="absolute left-4 text-white/70 hover:text-white text-3xl z-10"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* image */}
          <img
            src={photos[lightboxIdx]}
            alt={`Photo ${lightboxIdx + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />

          {/* next */}
          {lightboxIdx < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
              className="absolute right-4 text-white/70 hover:text-white text-3xl z-10"
              aria-label="Next"
            >
              ›
            </button>
          )}

          {/* counter */}
          <div className="absolute bottom-4 text-white/50 text-sm">
            {lightboxIdx + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
