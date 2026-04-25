// ⁘[ NOT FOUND ]⁘

import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-display text-brand-500 mb-4">404</p>
        <h1 className="font-display text-2xl mb-2">Page not found</h1>
        <p className="text-text-muted mb-6">This page doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Back to Map</Link>
      </div>
    </div>
  );
}
