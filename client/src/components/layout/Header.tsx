// ⁘[ HEADER ]⁘

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth";

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-brand-500 text-xl">◈</span>
          <span className="font-display text-lg text-text-primary group-hover:text-brand-300 transition-colors">
            BrewScore
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/explore" className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium">
            Explore
          </Link>
          <Link to="/feed" className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium">
            Feed
          </Link>
          {isAuthenticated() ? (
            <div className="flex items-center gap-4">
              {user?.role === "ADMIN" && (
                <Link to="/admin" className="text-error hover:text-error/80 transition-colors text-sm font-medium">Admin</Link>
              )}
              <Link to={`/profile/${user?.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button onClick={handleLogout} className="text-text-muted hover:text-text-primary transition-colors text-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">Sign In</Link>
          )}
        </nav>

        {/* mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-text-muted hover:text-text-primary p-2"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg animate-fade-in">
          <nav className="flex flex-col p-4 gap-3">
            <Link to="/explore" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-text-primary text-sm font-medium py-2">
              Explore
            </Link>
            <Link to="/feed" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-text-primary text-sm font-medium py-2">
              Feed
            </Link>
            {isAuthenticated() ? (
              <>
                {user?.role === "ADMIN" && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-error text-sm font-medium py-2">Admin</Link>
                )}
                <Link to={`/profile/${user?.id}`} onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-text-primary text-sm font-medium py-2">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-text-muted hover:text-text-primary text-sm font-medium py-2 text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2 px-4 text-center">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
