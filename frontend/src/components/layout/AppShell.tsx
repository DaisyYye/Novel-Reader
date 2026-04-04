import { UserButton } from "@clerk/clerk-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppAuth } from "../../auth/AuthContext";

export function AppShell() {
  const location = useLocation();
  const isLibraryPage = location.pathname === "/";
  const { user, isAdmin } = useAppAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="font-display text-[2rem] font-semibold tracking-[0.01em] text-ink-900"
            >
              Novel Reader
            </Link>
            {isAdmin ? (
              <span className="chip bg-amber-100 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-amber-900">
                Admin
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {isLibraryPage ? null : (
              <nav className="flex items-center gap-1 rounded-full border border-black/5 bg-white/85 p-1 text-sm shadow-panel">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    [
                      "rounded-full px-3 py-1.5 transition",
                      isActive ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100",
                    ].join(" ")
                  }
                >
                  Library
                </NavLink>
              </nav>
            )}
            <div className="flex items-center gap-3 rounded-full border border-black/5 bg-white/85 px-3 py-1.5 shadow-panel">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-ink-900">{user?.email}</p>
                <p className="text-[0.72rem] uppercase tracking-[0.18em] text-ink-500">{user?.role}</p>
              </div>
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
