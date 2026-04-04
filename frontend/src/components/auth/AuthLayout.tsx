import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(153,123,80,0.22),_transparent_30%),linear-gradient(180deg,_#f8f2ea_0%,_#efe4d4_100%)] px-4 py-5 text-ink-900 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[72rem] gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
        <section className="surface-card max-w-3xl bg-white/62">
          <p className="section-eyebrow">Novel Reader</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,1.5rem+1.2vw,3.5rem)] leading-[1.02] text-ink-900">
            Sign in to keep every book, chapter, and reading preference attached to your account.
          </h1>
          <p className="mt-3 max-w-xl text-[0.98rem] leading-6 text-ink-600">
            Clerk handles authentication, while the app keeps roles, progress, and reader settings
            in the backend.
          </p>
        </section>

        <div className="flex justify-center lg:justify-end">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
