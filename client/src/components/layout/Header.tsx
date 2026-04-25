// ⁘[ HEADER ]⁘

import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-brand-500 text-2xl">◈</span>
          <span className="font-display text-xl text-text-primary group-hover:text-brand-300 transition-colors">
            BrewScore
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/explore"
            className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
          >
            Explore
          </Link>
          <Link
            to="/feed"
            className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
          >
            Feed
          </Link>

          {isAuthenticated() ? (
            <div className="flex items-center gap-4">
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-error hover:text-error/80 transition-colors text-sm font-medium"
                >
                  Admin
                </Link>
              )}
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-text-muted hover:text-text-primary transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
