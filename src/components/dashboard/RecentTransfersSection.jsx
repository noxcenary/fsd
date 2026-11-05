import React from 'react';
import { recentTransfers } from '../../data/mockData';

export default function RecentTransfersSection({ transfers = recentTransfers, onViewAll }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-sm p-6 space-y-5 flex flex-col justify-between text-left">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-brand-walnut/70 font-bold">
            Transfer Tracking
          </span>
          <span className="text-[12px] text-brand-walnut/60">
            {transfers.length} Recorded Transfers
          </span>
        </div>
        <h3 className="font-display font-bold text-[18px] text-brand-walnut">
          Recent Resource Transfers
        </h3>
      </div>

      <div className="space-y-3.5">
        {transfers.map((item) => (
          <div
            key={item.id}
            className="bg-brand-ivory border border-brand-border p-4 rounded-xl space-y-3 text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg bg-white border border-brand-border flex items-center justify-center shrink-0 ${
                    item.statusType === 'sage' ? 'text-brand-sage' : 'text-brand-walnut'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div>
                  <div className="font-display font-bold text-[14px] text-brand-walnut">
                    Transfer {item.id}
                  </div>
                  <div className="text-[12px] text-brand-walnut/70">{item.summary}</div>
                </div>
              </div>

              {item.statusType === 'amber' ? (
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-amber-light text-brand-amber border border-brand-amber/40 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse"></span>
                  {item.status}
                </span>
              ) : (
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/40 text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[14px] text-brand-sage">check_circle</span>
                  {item.status}
                </span>
              )}
            </div>

            {(item.startLocation || item.endLocation) && (
              <div className="pt-1">
                <p className="text-[11px] text-brand-walnut/70">
                  <span>{item.startLocation || 'Origin not recorded'}</span>
                  <span className="mx-1.5 text-brand-sage-dark" aria-hidden="true">→</span>
                  <span>{item.endLocation || 'Destination not recorded'}</span>
                </p>
                <p className="mt-1 text-[10px] text-brand-walnut/60">
                  {item.currentLocation || 'Live vehicle location unavailable'}
                </p>
              </div>
            )}

            {/* Receipt confirmation stamp if delivered */}
            {item.signature && (
              <div className="pt-1 flex flex-wrap items-center justify-between text-brand-walnut/70 text-[11px] border-t border-brand-border/40 gap-1">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-brand-sage">
                    verified
                  </span>
                  {item.signature}
                </span>
                <span className="font-mono text-brand-walnut font-medium">{item.podCode}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-1 flex flex-wrap items-center justify-between text-[12px] gap-2">
        <span className="text-brand-walnut/70">
          Transfers require mutual delivery confirmation and receipt acknowledgement.
        </span>
        <button
          onClick={onViewAll}
          className="font-display font-semibold text-brand-walnut hover:text-brand-sage transition-colors flex items-center gap-1"
        >
          <span>View All Transfer Records</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
