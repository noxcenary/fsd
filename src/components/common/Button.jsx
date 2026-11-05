import React from 'react';

/**
 * Reusable Button component aligned with Stitch design tokens
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'amber' | 'ivory' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  iconRight = null,
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[12px] rounded-lg gap-1.5',
    md: 'px-4 py-2 text-[13px] rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-[14px] rounded-xl gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-brand-walnut-dark shadow-sm ring-1 ring-brand-primary/20 active:translate-y-px',
    secondary: 'bg-white hover:bg-brand-secondary text-brand-walnut border border-brand-border shadow-sm',
    amber: 'bg-brand-amber hover:bg-brand-amber/90 text-brand-walnut-dark shadow-sm ring-1 ring-brand-amber/20 active:translate-y-px',
    ivory: 'bg-brand-ivory hover:bg-brand-border/40 text-brand-walnut border border-brand-border',
    ghost: 'bg-transparent hover:bg-brand-primary-light text-brand-walnut'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[18px] shrink-0 leading-none">
          {icon}
        </span>
      )}
      {children}
      {iconRight && (
        <span className="material-symbols-outlined text-[18px] shrink-0 leading-none">
          {iconRight}
        </span>
      )}
    </button>
  );
}
