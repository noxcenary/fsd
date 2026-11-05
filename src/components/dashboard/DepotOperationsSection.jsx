import React from 'react';
import { depotOperations } from '../../data/mockData';

export default function DepotOperationsSection({ operations = depotOperations, onOpenRadar }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-sm p-6 space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-wider text-brand-walnut/70 font-bold">
          Field Proximity
        </span>
        <h3 className="font-display font-bold text-[18px] text-brand-walnut">
          Depot Operations
        </h3>
      </div>

      {/* Field Logistics Visual Area */}
      <div
        className="relative w-full h-44 rounded-xl overflow-hidden border border-brand-border bg-brand-ivory"
        data-location="Goma Regional Hub"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="material-symbols-outlined text-brand-walnut/60 text-[36px] mb-1">
            map
          </span>
          <span className="font-display font-bold text-[14px] text-brand-walnut">
            {operations.activeCorridor}
          </span>
          <span className="text-[12px] text-brand-walnut/70">
            {operations.distributionHubs}
          </span>
        </div>

        <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg border border-brand-border flex items-center justify-between text-[11px]">
          <span className="text-brand-sage-dark font-bold">{operations.routeClearance}</span>
          <span className="text-brand-walnut/70">{operations.weatherCondition}</span>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        {operations.depotStatuses.map((depot, idx) => (
          <div key={idx} className="flex items-center justify-between text-[13px]">
            <span className="text-brand-walnut font-medium">{depot.name}</span>
            <span className={`${depot.color} font-bold`}>{depot.status}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onOpenRadar}
        className="w-full py-2.5 rounded-lg bg-brand-ivory hover:bg-brand-border/40 border border-brand-border text-brand-walnut font-display font-semibold text-[13px] transition-colors"
      >
        Open Live Logistics Radar
      </button>
    </div>
  );
}
