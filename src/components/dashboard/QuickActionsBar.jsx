import React from 'react';

export default function QuickActionsBar({ onAction }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        onClick={() => onAction && onAction('add-resource')}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-sage hover:bg-brand-primary-hover text-brand-walnut-dark rounded-xl font-sans font-semibold text-[13px] shadow-sm transition-all duration-150 active:translate-y-px text-center"
      >
        <span className="material-symbols-outlined text-[19px]">add_circle</span>
        <span>Add Available Resource</span>
      </button>

      <button
        onClick={() => onAction && onAction('create-request')}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-brand-secondary text-brand-walnut border border-brand-border rounded-xl font-sans font-semibold text-[13px] shadow-sm transition-colors text-center"
      >
        <span className="material-symbols-outlined text-[19px] text-brand-walnut/80">post_add</span>
        <span>Create Resource Request</span>
      </button>

      <button
        onClick={() => onAction && onAction('find-partner')}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-brand-secondary text-brand-walnut border border-brand-border rounded-xl font-sans font-semibold text-[13px] shadow-sm transition-colors text-center"
      >
        <span className="material-symbols-outlined text-[19px] text-brand-walnut/80">travel_explore</span>
        <span>Find an NGO Partner</span>
      </button>

      <button
        onClick={() => onAction && onAction('ai-recommendations')}
        className="relative flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary-light hover:bg-brand-primary-light/90 text-brand-walnut border border-brand-primary/25 rounded-xl font-sans font-semibold text-[13px] shadow-sm transition-colors text-center"
      >
        <span className="material-symbols-outlined text-brand-primary text-[19px]">auto_awesome</span>
        <span>View AI Recommendations</span>
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-brand-primary border border-brand-primary/20 text-[11px] font-bold">
          6 New
        </span>
      </button>
    </div>
  );
}
