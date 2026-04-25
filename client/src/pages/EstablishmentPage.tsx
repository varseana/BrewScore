// ⁘[ ESTABLISHMENT DETAIL PAGE ]⁘

import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEstablishment, useEstablishmentReviews, useToggleFavorite, useCreateReview, useCreateReport } from "@/api/hooks";
import { useAuthStore } from "@/stores/auth";
import { Rating } from "@/components/ui/Rating";
import { TransparencyBadge } from "@/components/ui/TransparencyBadge";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { Modal } from "@/components/ui/Modal";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { useT } from "@/stores/lang";
import { useLangStore } from "@/stores/lang";
import { translateTerm } from "@/utils/i18n";

export function EstablishmentPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const t = useT();
  const { lang } = useLangStore();
  const { data: est, isLoading } = useEstablishment(id!);
  const { data: reviewPages, fetchNextPage, hasNextPage } = useEstablishmentReviews(id!);
  const toggleFav = useToggleFavorite();
  const createReview = useCreateReview();
  const createReport = useCreateReport();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ ratingBean: 0, ratingPrep: 0, ratingEquipment: 0, ratingConsist: 0, ratingOverall: 0, text: "", drinkOrdered: "" });
  const [reportForm, setReportForm] = useState({ reason: "MISLEADING_INFO" as const, description: "" });

  const reviews = reviewPages?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><ProfileSkeleton /></div>;
  if (!est) return <div className="text-center py-20 text-text-muted">{t.pageNotFound}</div>;

  const cp = est.coffeeProgram;
  const ratingLabels = { ratingOverall: t.overall, ratingBean: t.bean, ratingPrep: t.prep, ratingEquipment: t.equipmentRating, ratingConsist: t.consistency } as const;

  const handleReviewSubmit = async () => {
    if (!id || reviewForm.ratingOverall === 0) return;
    await createReview.mutateAsync({ establishmentId: id, ...reviewForm });
    setShowReviewModal(false);
    setReviewForm({ ratingBean: 0, ratingPrep: 0, ratingEquipment: 0, ratingConsist: 0, ratingOverall: 0, text: "", drinkOrdered: "" });
  };

  const handleReportSubmit = async () => {
    if (!id || !reportForm.description) return;
    await createReport.mutateAsync({ establishmentId: id, ...reportForm });
    setShowReportModal(false);
    setReportForm({ reason: "MISLEADING_INFO", description: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        {est.status === "FLAGGED" && (
          <div className="bg-warning/10 border border-warning/20 rounded-sm px-4 py-2 mb-4 text-sm text-warning">{t.underReview}</div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl mb-1">{est.name}</h1>
            <p className="text-text-muted">{est.address}, {est.city}, {est.country}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <TransparencyBadge score={est.transparencyScore} />
            {est.verified && <span className="badge-success">{t.verified}</span>}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <Rating value={Math.round(est.avgRating)} />
          <span className="text-text-muted">{est.avgRating.toFixed(1)} ({est.reviewCount} {t.reviews.toLowerCase()})</span>
          {user && (
            <div className="flex gap-2 ml-auto">
              <button onClick={() => toggleFav.mutate(est.id)} className={`btn-secondary text-sm py-2 px-3 ${est.isFavorited ? "border-brand-500 text-brand-500" : ""}`}>
                {est.isFavorited ? t.saved : t.save}
              </button>
              <button onClick={() => setShowReviewModal(true)} className="btn-primary text-sm py-2 px-3">{t.writeReview}</button>
              <button onClick={() => setShowReportModal(true)} className="btn-danger text-sm py-2 px-3">{t.report}</button>
            </div>
          )}
        </div>
      </div>

      {cp && (
        <div className="card space-y-5">
          <h2 className="font-display text-xl">{t.coffeeProgram}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cp.beanOrigins.length > 0 && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.beanOrigins}</h3>
                <div className="flex flex-wrap gap-1.5">{cp.beanOrigins.map((o) => <span key={o} className="badge-brand">{o}</span>)}</div>
              </div>
            )}
            {cp.brewingMethods.length > 0 && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.brewingMethods}</h3>
                <div className="flex flex-wrap gap-1.5">{cp.brewingMethods.map((m) => <span key={m} className="badge-brand">{translateTerm(m, lang as "en"|"es")}</span>)}</div>
              </div>
            )}
            {cp.equipment.length > 0 && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.equipment}</h3>
                {cp.equipment.map((e) => (
                  <div key={e.name} className="text-sm mb-1">
                    <span className="text-text-primary">{e.name}</span>
                    <span className="text-text-muted ml-2">({translateTerm(e.type, lang as "en"|"es")})</span>
                  </div>
                ))}
              </div>
            )}
            {cp.milkOptions.length > 0 && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.milkOptions}</h3>
                <div className="flex flex-wrap gap-1.5">{cp.milkOptions.map((m) => <span key={m} className="badge-brand">{translateTerm(m, lang as "en"|"es")}</span>)}</div>
              </div>
            )}
            {cp.waterFiltration && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.waterFiltration}</h3>
                <p className="text-sm">{translateTerm(cp.waterFiltration, lang as "en"|"es")}</p>
              </div>
            )}
            {cp.roastPolicy && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.roastPolicy}</h3>
                <p className="text-sm">{translateTerm(cp.roastPolicy, lang as "en"|"es")}</p>
                {cp.daysFromRoast && <p className="text-text-muted text-xs mt-1">~{cp.daysFromRoast} {t.daysFromRoast}</p>}
              </div>
            )}
          </div>
          {cp.signatureDrinks.length > 0 && (
            <div>
              <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.signatureDrinks}</h3>
              {cp.signatureDrinks.map((d) => (
                <div key={d.name} className="mb-2">
                  <span className="text-brand-300 font-medium text-sm">{d.name}</span>
                  <p className="text-text-muted text-xs">{translateTerm(d.description, lang as "en"|"es")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="font-display text-xl mb-4">{t.reviews}</h2>
        <div className="space-y-3">
          {reviews.length === 0 && !isLoading && <p className="text-text-muted text-sm">{t.noReviews}</p>}
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          {hasNextPage && <button onClick={() => fetchNextPage()} className="btn-secondary w-full text-sm">{t.loadMore}</button>}
        </div>
      </div>

      <Modal open={showReviewModal} onClose={() => setShowReviewModal(false)} title={t.writeAReview}>
        <div className="space-y-4">
          {(Object.keys(ratingLabels) as (keyof typeof ratingLabels)[]).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{ratingLabels[key]}</span>
              <Rating value={reviewForm[key]} onChange={(v) => setReviewForm((f) => ({ ...f, [key]: v }))} />
            </div>
          ))}
          <input placeholder={t.whatDidYouOrder} value={reviewForm.drinkOrdered} onChange={(e) => setReviewForm((f) => ({ ...f, drinkOrdered: e.target.value }))} className="input text-sm" />
          <textarea placeholder={t.tellUsExperience} value={reviewForm.text} onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))} className="input text-sm min-h-[100px] resize-y" rows={4} />
          <button onClick={handleReviewSubmit} disabled={reviewForm.ratingOverall === 0 || createReview.isPending} className="btn-primary w-full">
            {createReview.isPending ? t.submitting : t.submitReview}
          </button>
        </div>
      </Modal>

      <Modal open={showReportModal} onClose={() => setShowReportModal(false)} title={t.reportEstablishment}>
        <div className="space-y-4">
          <select value={reportForm.reason} onChange={(e) => setReportForm((f) => ({ ...f, reason: e.target.value as typeof f.reason }))} className="input text-sm bg-surface">
            <option value="MISLEADING_INFO">{t.misleadingInfo}</option>
            <option value="FALSE_PROCEDURES">{t.falseProcedures}</option>
            <option value="FAKE_EQUIPMENT">{t.fakeEquipment}</option>
            <option value="OTHER">{t.other}</option>
          </select>
          <textarea placeholder={t.describeIssue} value={reportForm.description} onChange={(e) => setReportForm((f) => ({ ...f, description: e.target.value }))} className="input text-sm min-h-[100px] resize-y" rows={4} required minLength={10} />
          <p className="text-text-muted text-xs">{t.anonymousNote}</p>
          <button onClick={handleReportSubmit} disabled={!reportForm.description || createReport.isPending} className="btn-danger w-full">
            {createReport.isPending ? t.submitting : t.submitReport}
          </button>
        </div>
      </Modal>
    </div>
  );
}
