import React from 'react';
import { aiMatches } from '../../data/mockData';

export default function AiMatchesSection({ matches = aiMatches, onSelectMatch }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-sm p-6 space-y-4 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-sage text-[20px]">auto_awesome</span>
          <h3 className="font-display font-bold text-[18px] text-brand-walnut">
            AI-Assisted Matches
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/40 text-[11px] font-bold">
          {matches.length} Recommended
        </span>
      </div>

      <p className="text-[12px] text-brand-walnut/70 leading-relaxed">
        Ranked recommendations based on geographical distance, resource compatibility, urgency, and trust indicators.
      </p>

      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="p-4 rounded-xl bg-brand-ivory border border-brand-border hover:border-brand-sage/50 transition-colors space-y-2 text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-display font-bold text-[14px] text-brand-walnut">
                    {match.orgName}
                  </span>
                  <span className="text-[11px] text-brand-walnut/60">• {match.hub}</span>
                </div>
                {match.darpanId && (
                  <span className="font-mono text-[10px] text-brand-walnut/60 bg-white border border-brand-border/60 px-1.5 py-0.2 rounded">
                    {match.darpanId}
                  </span>
                )}
                <div className="text-[12px] text-brand-sage-dark font-semibold mt-1">
                  {match.type}: {match.highlight}
                </div>
              </div>
              <div className="px-2 py-0.5 rounded bg-brand-sage-light border border-brand-sage/40 text-brand-walnut text-[11px] font-bold shrink-0">
                {match.matchRate}
              </div>
            </div>

            <p className="text-[12px] text-brand-walnut/80 leading-relaxed">
              {match.description}
            </p>

            <div className="flex items-center gap-2 pt-1">
              {match.primaryAction && (
                <button
                  onClick={() => onSelectMatch && onSelectMatch(match, match.primaryAction)}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-sage hover:bg-brand-primary-hover text-brand-walnut-dark font-display font-semibold text-[12px] transition-colors"
                >
                  {match.primaryAction}
                </button>
              )}
              {match.secondaryAction && (
                <button
                  onClick={() => onSelectMatch && onSelectMatch(match, match.secondaryAction)}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-brand-border text-brand-walnut hover:bg-brand-border/30 font-display font-semibold text-[12px] transition-colors"
                >
                  {match.secondaryAction}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1 text-[11px] text-brand-walnut/60 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px] text-brand-walnut/50">info</span>
        <span>AI assists ranking. Mutual agreement is required to coordinate any transfer.</span>
      </div>
    </div>
  );
}
