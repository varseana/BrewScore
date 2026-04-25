// ⁘[ LAYOUT WRAPPER ]⁘

import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-8 text-center text-text-muted text-sm">
        <p>BrewScore — Coffee transparency for everyone</p>
      </footer>
    </div>
  );
}
