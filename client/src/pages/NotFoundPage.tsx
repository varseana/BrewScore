// ⁘[ NOT FOUND ]⁘

import { Link } from "react-router-dom";
import { useT } from "@/stores/lang";

export function NotFoundPage() {
  const t = useT();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-display text-brand-500 mb-4">404</p>
        <h1 className="font-display text-2xl mb-2">{t.pageNotFound}</h1>
        <p className="text-text-muted mb-6">{t.pageNotFoundDesc}</p>
        <Link to="/" className="btn-primary">{t.backToMap}</Link>
      </div>
    </div>
  );
}
