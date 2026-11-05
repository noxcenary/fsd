import React from 'react';

/**
 * Institutional brand mark aligned to the Alexandria editorial governance system.
 */
export default function BrandLogo({ variant = 'sidebar', showTagline = true, className = '' }) {
  const isDark = variant === 'sidebar' || variant === 'dark';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0">
          <span className="material-symbols-outlined text-[24px]">hub</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-bold text-[20px] tracking-tight ${isDark ? 'text-white' : 'text-brand-walnut'}`}>
              NGO ResourceLink
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0"></span>
          </div>
          <span className="text-[11px] font-medium tracking-wide text-brand-primary uppercase">
            Resource Sharing & Coordination
          </span>
        </div>
      </div>
      {showTagline && (
        <p className={`mt-3 text-[12px] leading-relaxed ${isDark ? 'text-[#C8BFB5]' : 'text-brand-walnut/70'}`}>
          Connecting Resources. Strengthening Communities.
        </p>
      )}
    </div>
  );
}
