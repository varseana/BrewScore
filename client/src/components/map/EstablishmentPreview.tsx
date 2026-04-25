// ⁘[ ESTABLISHMENT PREVIEW PANEL ]⁘
// panel lateral (desktop) o top sheet (mobile) con scroll

import { Link } from "react-router-dom";
import { Rating } from "@/components/ui/Rating";
import { TransparencyBadge } from "@/components/ui/TransparencyBadge";
import { useT } from "@/stores/lang";
import { useLangStore } from "@/stores/lang";
import { translateTerm } from "@/utils/i18n";
import type { Establishment } from "@/types";

interface Props {
  establishment: Establishment;
  onClose: () => void;
}

export function EstablishmentPreview({ establishment: est, onClose }: Props) {
  const t = useT();
  const { lang } = useLangStore();
  const cp = est.coffeeProgram;
  const methods = cp?.brewingMethods ?? [];
  const origins = cp?.beanOrigins ?? [];
  const equipment = cp?.equipment ?? [];
  const drinks = cp?.signatureDrinks ?? [];

  return (
    <>
      {/* ⁘[ MOBILE ~ top sheet ]⁘ */}
      <div className="lg:hidden absolute top-14 left-0 right-0 z-[1001] max-h-[55vh] overflow-y-auto bg-bg/95 backdrop-blur-sm border-b border-border animate-slide-up">
        <PreviewContent est={est} cp={cp} methods={methods} origins={origins} equipment={equipment} drinks={drinks} onClose={onClose} t={t} lang={lang} />
      </div>

      {/* ⁘[ DESKTOP ~ right panel ]⁘ */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-96 z-[1001] overflow-y-auto bg-bg/95 backdrop-blur-sm border-l border-border animate-fade-in">
        <PreviewContent est={est} cp={cp} methods={methods} origins={origins} equipment={equipment} drinks={drinks} onClose={onClose} t={t} lang={lang} />
      </div>
    </>
  );
}

interface ContentProps {
  est: Establishment;
  cp: Establishment["coffeeProgram"];
  methods: string[];
  origins: string[];
  equipment: { name: string; type: string }[];
  drinks: { name: string; description: string }[];
  onClose: () => void;
  t: ReturnType<typeof useT>;
  lang: string;
}

function PreviewContent({ est, cp, methods, origins, equipment, drinks, onClose, t, lang }: ContentProps) {
  return (
    <div className="p-5 space-y-4">
      {/* header + close */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl leading-tight">{est.name}</h2>
          <p className="text-text-muted text-sm">{est.city}, {est.country}</p>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary text-xl leading-none shrink-0 mt-1"
          aria-label="Close preview"
        >
          &times;
        </button>
      </div>

      {/* rating + score */}
      <div className="flex items-center gap-3 flex-wrap">
        <Rating value={Math.round(est.avgRating)} size="sm" />
        <span className="text-text-muted text-sm">{est.avgRating.toFixed(1)} ({est.reviewCount})</span>
        <TransparencyBadge score={est.transparencyScore} size="sm" />
        {est.verified && <span className="badge-success text-[10px]">{t.verified}</span>}
      </div>

      {/* description */}
      {est.description && (
        <p className="text-text-primary text-sm leading-relaxed">{translateTerm(est.description, lang as "en" | "es")}</p>
      )}

      {/* status warning */}
      {est.status === "FLAGGED" && (
        <div className="bg-warning/10 border border-warning/20 rounded-sm px-3 py-2 text-xs text-warning">
          {t.underReview}
        </div>
      )}

      {/* coffee program */}
      {cp && (
        <div className="space-y-3">
          <h3 className="text-text-muted text-xs uppercase tracking-wider font-medium">{t.coffeeProgram}</h3>

          {methods.length > 0 && (
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5">{t.brewingMethods}</p>
              <div className="flex flex-wrap gap-1.5">
                {methods.map((m) => <span key={m} className="badge-brand text-[10px]">{translateTerm(m, lang as "en" | "es")}</span>)}
              </div>
            </div>
          )}

          {origins.length > 0 && (
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5">{t.beanOrigins}</p>
              <div className="flex flex-wrap gap-1.5">
                {origins.map((o) => <span key={o} className="badge-brand text-[10px]">{o}</span>)}
              </div>
            </div>
          )}

          {equipment.length > 0 && (
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5">{t.equipment}</p>
              {equipment.map((e) => (
                <p key={e.name} className="text-sm">
                  <span className="text-text-primary">{e.name}</span>
                  <span className="text-text-muted ml-1.5 text-xs">({translateTerm(e.type, lang as "en" | "es")})</span>
                </p>
              ))}
            </div>
          )}

          {drinks.length > 0 && (
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5">{t.signatureDrinks}</p>
              {drinks.map((d) => (
                <div key={d.name} className="mb-1.5">
                  <span className="text-brand-300 text-sm font-medium">{d.name}</span>
                  <p className="text-text-muted text-xs">{translateTerm(d.description, lang as "en" | "es")}</p>
                </div>
              ))}
            </div>
          )}

          {cp.waterFiltration && (
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">{t.waterFiltration}</p>
              <p className="text-sm text-text-primary">{translateTerm(cp.waterFiltration, lang as "en" | "es")}</p>
            </div>
          )}

          {cp.roastPolicy && (
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">{t.roastPolicy}</p>
              <p className="text-sm text-text-primary">{translateTerm(cp.roastPolicy, lang as "en" | "es")}</p>
              {cp.daysFromRoast && <p className="text-text-muted text-xs mt-1">~{cp.daysFromRoast} {t.daysFromRoast}</p>}
            </div>
          )}

          {cp.milkOptions && cp.milkOptions.length > 0 && (
            <div>
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5">{t.milkOptions}</p>
              <div className="flex flex-wrap gap-1.5">
                {cp.milkOptions.map((m) => <span key={m} className="badge-brand text-[10px]">{translateTerm(m, lang as "en" | "es")}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* link al perfil completo */}
      <Link
        to={`/establishment/${est.id}`}
        className="btn-primary w-full text-center text-sm block"
      >
        {t.viewFullProfile}
      </Link>
    </div>
  );
}
