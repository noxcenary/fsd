import React from 'react';

export default function PendingApplicationPage({ user, onSignOut }) {
  const statusLabels = {
    pending_review: 'Pending administrator review',
    clarification_requested: 'Additional clarification requested',
    rejected: 'Application not approved'
  };
  const status = statusLabels[user?.verificationStatus] || 'Pending administrator review';

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-ivory px-4 py-10 text-left text-brand-walnut">
      <section className="w-full max-w-xl rounded-2xl border border-brand-border bg-white p-7 shadow-sm sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-amber/30 bg-brand-amber-light px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">hourglass_top</span>
          Application status
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">{status}</h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-walnut/75">
          {user?.organization} is not yet enabled for resource coordination. An administrator reviews the submitted documents; platform approval is not government verification.
        </p>
        <div className="mt-6 rounded-xl bg-brand-ivory p-4 text-[13px]">
          <div className="font-semibold">{user?.name}</div>
          <div className="mt-1 break-all text-brand-walnut/70">{user?.email}</div>
          <div className="mt-2 font-mono text-[11px] text-brand-walnut/65">Registration: {user?.regNumber || 'Not listed'}</div>
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-brand-walnut/65">
          Sign in again to check for an updated review status. Email notifications are not configured.
        </p>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-6 min-h-11 rounded-lg bg-brand-walnut px-4 text-sm font-semibold text-white hover:bg-brand-walnut-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/50"
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
