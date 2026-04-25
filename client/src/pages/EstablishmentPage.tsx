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

export function EstablishmentPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { data: est, isLoading } = useEstablishment(id!);
  const { data: reviewPages, fetchNextPage, hasNextPage } = useEstablishmentReviews(id!);
  const toggleFav = useToggleFavorite();
  const createReview = useCreateReview();
  const createReport = useCreateReport();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    ratingBean: 0, ratingPrep: 0, ratingEquipment: 0, ratingConsist: 0, ratingOverall: 0,
    text: "", drinkOrdered: "",
  });
  const [reportForm, setReportForm] = useState({ reason: "MISLEADING_INFO" as const, description: "" });

  const reviews = reviewPages?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><ProfileSkeleton /></div>;
  if (!est) return <div className="text-center py-20 text-text-muted">Establishment not found</div>;

  const cp = est.coffeeProgram;

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
      {/* header */}
      <div>
        {est.status === "FLAGGED" && (
          <div className="bg-warning/10 border border-warning/20 rounded-sm px-4 py-2 mb-4 text-sm text-warning">
            This establishment is under review. Some information may be inaccurate.
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl mb-1">{est.name}</h1>
            <p className="text-text-muted">{est.address}, {est.city}, {est.country}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <TransparencyBadge score={est.transparencyScore} />
            {est.verified && <span className="badge-success">Verified</span>}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Rating value={Math.round(est.avgRating)} />
          <span className="text-text-muted">{est.avgRating.toFixed(1)} ({est.reviewCount} reviews)</span>

          {user && (
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => toggleFav.mutate(est.id)}
                className={`btn-secondary text-sm py-2 px-3 ${est.isFavorited ? "border-brand-500 text-brand-500" : ""}`}
              >
                {est.isFavorited ? "Saved" : "Save"}
              </button>
              <button onClick={() => setShowReviewModal(true)} className="btn-primary text-sm py-2 px-3">
                Write Review
              </button>
              <button onClick={() => setShowReportModal(true)} className="btn-danger text-sm py-2 px-3">
                Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* coffee program */}
      {cp && (
        <div className="card space-y-5">
          <h2 className="font-display text-xl">Coffee Program</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cp.beanOrigins.length > 0 && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">Bean Origins</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cp.beanOrigins.map((o) => <span key={o} className="badge-brand">{o}</span>)}
                </div>
              </div>
            )}

            {cp.brewingMethods.length > 0 && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">Brewing Methods</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cp.brewingMethods.map((m) => <span key={m} className="badge-brand">{m}</span>)}
                </div>
              </div>
            )}

            {cp.equipment.length > 0 && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">Equipment</h3>
                {cp.equipment.map((e) => (
                  <div key={e.name} className="text-sm mb-1">
                    <span className="text-text-primary">{e.name}</span>
                    <span className="text-text-muted ml-2">({e.type})</span>
                  </div>
                ))}
              </div>
            )}

            {cp.milkOptions.length > 0 && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">Milk Options</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cp.milkOptions.map((m) => <span key={m} className="badge-brand">{m}</span>)}
                </div>
              </div>
            )}

            {cp.waterFiltration && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">Water Filtration</h3>
                <p className="text-sm">{cp.waterFiltration}</p>
              </div>
            )}

            {cp.roastPolicy && (
              <div>
                <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">Roast Policy</h3>
                <p className="text-sm">{cp.roastPolicy}</p>
                {cp.daysFromRoast && (
                  <p className="text-text-muted text-xs mt-1">~{cp.daysFromRoast} days from roast</p>
                )}
              </div>
            )}
          </div>

          {cp.signatureDrinks.length > 0 && (
            <div>
              <h3 className="text-text-muted text-xs uppercase tracking-wider mb-2">Signature Drinks</h3>
              {cp.signatureDrinks.map((d) => (
                <div key={d.name} className="mb-2">
                  <span className="text-brand-300 font-medium text-sm">{d.name}</span>
                  <p className="text-text-muted text-xs">{d.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* reviews */}
      <div>
        <h2 className="font-display text-xl mb-4">Reviews</h2>
        <div className="space-y-3">
          {reviews.length === 0 && !isLoading && (
            <p className="text-text-muted text-sm">No reviews yet. Be the first!</p>
          )}
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          {hasNextPage && (
            <button onClick={() => fetchNextPage()} className="btn-secondary w-full text-sm">
              Load more reviews
            </button>
          )}
        </div>
      </div>

      {/* review modal */}
      <Modal open={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a Review">
        <div className="space-y-4">
          {(["ratingOverall", "ratingBean", "ratingPrep", "ratingEquipment", "ratingConsist"] as const).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-text-muted capitalize">{key.replace("rating", "")}</span>
              <Rating value={reviewForm[key]} onChange={(v) => setReviewForm((f) => ({ ...f, [key]: v }))} />
            </div>
          ))}
          <input
            placeholder="What did you order?"
            value={reviewForm.drinkOrdered}
            onChange={(e) => setReviewForm((f) => ({ ...f, drinkOrdered: e.target.value }))}
            className="input text-sm"
          />
          <textarea
            placeholder="Tell us about your experience..."
            value={reviewForm.text}
            onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))}
            className="input text-sm min-h-[100px] resize-y"
            rows={4}
          />
          <button
            onClick={handleReviewSubmit}
            disabled={reviewForm.ratingOverall === 0 || createReview.isPending}
            className="btn-primary w-full"
          >
            {createReview.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </Modal>

      {/* report modal */}
      <Modal open={showReportModal} onClose={() => setShowReportModal(false)} title="Report Establishment">
        <div className="space-y-4">
          <select
            value={reportForm.reason}
            onChange={(e) => setReportForm((f) => ({ ...f, reason: e.target.value as typeof f.reason }))}
            className="input text-sm bg-surface"
          >
            <option value="MISLEADING_INFO">Misleading Information</option>
            <option value="FALSE_PROCEDURES">False Procedures</option>
            <option value="FAKE_EQUIPMENT">Fake Equipment Claims</option>
            <option value="OTHER">Other</option>
          </select>
          <textarea
            placeholder="Describe the issue in detail..."
            value={reportForm.description}
            onChange={(e) => setReportForm((f) => ({ ...f, description: e.target.value }))}
            className="input text-sm min-h-[100px] resize-y"
            rows={4}
            required
            minLength={10}
          />
          <p className="text-text-muted text-xs">Your identity will remain anonymous to the establishment owner.</p>
          <button
            onClick={handleReportSubmit}
            disabled={!reportForm.description || createReport.isPending}
            className="btn-danger w-full"
          >
            {createReport.isPending ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
