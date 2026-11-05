import React from 'react';

export default function StatCard({ stat }) {
  const {
    title,
    value,
    unit,
    icon,
    iconColor = 'text-brand-sage',
    footerText,
    trend,
    trendIcon,
    pulse,
    badgeType = 'sage'
  } = stat;

  const badgeStyles = {
    sage: 'bg-brand-sage-light text-brand-walnut border-brand-sage/30',
    amber: 'bg-brand-amber-light text-brand-amber border-brand-amber/30',
    ivory: 'bg-brand-ivory text-brand-walnut border-brand-border'
  };

  return (
    <div className="bg-white border border-brand-border p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-brand-walnut/70">
            {title}
          </span>
          <div className="font-display font-bold text-[28px] text-brand-walnut tracking-tight leading-none pt-1">
            {value}{' '}
            <span className="font-sans text-[13px] text-brand-walnut/60 font-normal">
              {unit}
            </span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-brand-border/40 text-[12px]">
        <span className="text-brand-walnut/70">{footerText}</span>
        <span
          className={`inline-flex items-center gap-1 font-bold border px-2 py-0.5 rounded-full text-[11px] ${
            badgeStyles[badgeType] || badgeStyles.ivory
          }`}
        >
          {pulse && <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-ping"></span>}
          {trendIcon && (
            <span className="material-symbols-outlined text-[13px]">{trendIcon}</span>
          )}
          {trend}
        </span>
      </div>
    </div>
  );
}
