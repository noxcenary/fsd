import React from 'react';

export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  className = '',
  disabled = false,
  helperText = null,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[13px] font-semibold text-brand-walnut"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-white text-brand-walnut text-[13px] border border-brand-border rounded-lg py-2.5 px-3.5 focus:outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 disabled:bg-brand-ivory disabled:cursor-not-allowed transition-colors appearance-none pr-9"
          {...props}
        >
          {options.map((opt, idx) => {
            const isObj = typeof opt === 'object';
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={idx} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-brand-walnut/60">
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </div>
      </div>
      {helperText && <p className="text-[11px] text-brand-walnut/60">{helperText}</p>}
    </div>
  );
}
