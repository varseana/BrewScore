// ⁘[ LAYOUT WRAPPER ]⁘

import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useT } from "@/stores/lang";

export function Layout() {
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-8 text-center text-text-muted text-sm">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}
