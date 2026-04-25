// ⁘[ HEADER ]⁘

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useLangStore, useT } from "@/stores/lang";

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { lang, setLang } = useLangStore();
  const t = useT();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); };
  const toggleLang = () => setLang(lang === "en" ? "es" : "en");

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-brand-500 text-xl">◈</span>
          <span className="font-display text-lg text-text-primary group-hover:text-brand-300 transition-colors">BrewScore</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          <Link to="/explore" className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium">{t.explore}</Link>
          <Link to="/feed" className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium">{t.feed}</Link>
          <Link to="/add-place" className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium">{t.addPlace}</Link>
          <button onClick={toggleLang} className="text-text-muted hover:text-text-primary transition-colors text-xs font-medium border border-border rounded-sm px-2 py-1 uppercase">
            {lang}
          </button>
          {isAuthenticated() ? (
            <div className="flex items-center gap-3">
              {user?.role === "ADMIN" && <Link to="/admin" className="text-error hover:text-error/80 transition-colors text-sm font-medium">{t.admin}</Link>}
              {user?.role === "OWNER" && <Link to="/owner" className="text-brand-500 hover:text-brand-300 transition-colors text-sm font-medium">{t.ownerDashboard}</Link>}
              <Link to={`/profile/${user?.id}`} className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-sm font-medium hover:opacity-80 transition-opacity">
                {user?.name.charAt(0).toUpperCase()}
              </Link>
              <button onClick={handleLogout} className="text-text-muted hover:text-text-primary transition-colors text-sm">{t.logout}</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">{t.signIn}</Link>
          )}
        </nav>

        {/* mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleLang} className="text-text-muted text-xs font-medium border border-border rounded-sm px-2 py-1 uppercase">{lang}</button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-text-muted hover:text-text-primary p-2" aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg animate-fade-in">
          <nav className="flex flex-col p-4 gap-3">
            <Link to="/explore" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-text-primary text-sm font-medium py-2">{t.explore}</Link>
            <Link to="/feed" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-text-primary text-sm font-medium py-2">{t.feed}</Link>
            <Link to="/add-place" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-text-primary text-sm font-medium py-2">{t.addPlace}</Link>
            {isAuthenticated() ? (
              <>
                {user?.role === "ADMIN" && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-error text-sm font-medium py-2">{t.admin}</Link>}
                {user?.role === "OWNER" && <Link to="/owner" onClick={() => setMenuOpen(false)} className="text-brand-500 text-sm font-medium py-2">{t.ownerDashboard}</Link>}
                <Link to={`/profile/${user?.id}`} onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-text-primary text-sm font-medium py-2">{t.profile}</Link>
                <button onClick={handleLogout} className="text-text-muted hover:text-text-primary text-sm font-medium py-2 text-left">{t.logout}</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2 px-4 text-center">{t.signIn}</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
