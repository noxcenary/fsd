import React from 'react';

/**
 * Reusable Form Input aligned with Stitch DESIGN.md
 */
export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error = null,
  helperText = null,
  icon = null,
  className = '',
  disabled = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-semibold text-brand-walnut"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-walnut/50">
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full bg-white text-brand-walnut text-[13px] placeholder:text-brand-walnut/40 
            border rounded-lg py-2.5 transition-colors
            focus:outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20
            disabled:bg-brand-ivory disabled:cursor-not-allowed
            ${icon ? 'pl-9 pr-3' : 'px-3.5'}
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-brand-border'}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-brand-walnut/60">{helperText}</p>}
    </div>
  );
}
