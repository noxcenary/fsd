import React, { useState } from 'react';

export default function EmergencyAlertBanner({ alert, onRespond }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !alert) return null;

  return (
    <div
      className="relative overflow-hidden bg-white border border-brand-border border-l-4 border-l-brand-amber rounded-xl shadow-sm p-6 transition-all duration-300"
      id="emergencyAlertCard"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-brand-amber-light border border-brand-amber/30 flex items-center justify-center text-brand-amber shrink-0">
            <span className="material-symbols-outlined text-[24px]">flood</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-amber-light text-brand-amber border border-brand-amber/40 text-[11px] font-bold uppercase tracking-wider">
                {alert.priority}
              </span>
              <span className="text-[12px] text-brand-walnut/70">
                Cluster Alert Ref: #{alert.ref}
              </span>
            </div>
            <h2 className="font-display font-bold text-[18px] text-brand-walnut">
              {alert.title}
            </h2>
            <p className="text-[14px] text-brand-walnut/80 max-w-4xl leading-relaxed">
              {alert.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
          <button
            onClick={() => setIsDismissed(true)}
            className="px-4 py-2 rounded-lg bg-brand-ivory border border-brand-border font-medium text-[13px] text-brand-walnut hover:bg-brand-border/40 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => onRespond && onRespond(alert)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-amber hover:bg-brand-amber/90 text-white font-semibold text-[13px] shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Respond to Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
}
