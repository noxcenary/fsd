import React from 'react';

/**
 * Reusable Status & Urgency Badge component
 * Styled according to Stitch DESIGN.md
 */
export default function Badge({
  children,
  variant = 'neutral', // 'critical' | 'sage' | 'amber' | 'neutral'
  size = 'sm', // 'sm' | 'md'
  icon = null,
  pulse = false,
  className = ''
}) {
  const variantStyles = {
    critical: 'bg-brand-amber-light text-brand-amber border border-brand-amber/40',
    amber: 'bg-brand-amber-light text-brand-amber border border-brand-amber/40',
    sage: 'bg-brand-sage-light text-brand-walnut border border-brand-sage/30',
    neutral: 'bg-brand-ivory text-brand-walnut border border-brand-border',
    outline: 'bg-transparent text-brand-walnut border border-brand-border'
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-[12px]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse shrink-0"></span>
      )}
      {icon && (
        <span className="material-symbols-outlined text-[13px] shrink-0 leading-none">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
