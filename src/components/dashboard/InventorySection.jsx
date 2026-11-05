import React from 'react';
import { inventoryAllocations } from '../../data/mockData';

export default function InventorySection({ allocations = inventoryAllocations }) {
  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between pb-1 border-b border-brand-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-brand-walnut/70 font-bold">
            Warehouse Reserves
          </span>
          <h3 className="font-display font-bold text-[18px] text-brand-walnut">
            Resource Overview &amp; Inventory Allocation
          </h3>
        </div>
        <span className="px-3 py-1 bg-brand-ivory border border-brand-border rounded-lg text-[12px] font-semibold text-brand-walnut">
          19,395 Units Active
        </span>
      </div>

      <div className="space-y-4 pt-1">
        {allocations.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2 font-semibold text-brand-walnut">
                <span className="material-symbols-outlined text-[18px] text-brand-walnut">
                  {item.icon}
                </span>
                {item.name}
              </span>
              <span className="text-brand-walnut/80">
                <strong className="text-brand-walnut font-semibold">{item.quantity}</strong>{' '}
                {item.unit} •{' '}
                <span className="text-brand-sage-dark font-bold">
                  {item.allocatedPercentage}% allocated
                </span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-brand-ivory border border-brand-border/40 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-brand-sage h-full rounded-full transition-all duration-500"
                style={{ width: `${item.allocatedPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-[11px] text-brand-walnut/70">
              <span>{item.reservedNote}</span>
              <span>{item.location}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between bg-brand-ivory border border-brand-border p-3.5 rounded-lg">
        <div className="flex items-center gap-2 text-brand-walnut/80 text-[12px]">
          <span className="material-symbols-outlined text-brand-sage text-[18px]">info</span>
          <span>Inventory updated across verified storage locations</span>
        </div>
        <button
          onClick={() => alert('Downloading official inventory manifest CSV...')}
          className="font-display font-semibold text-[13px] text-brand-walnut hover:text-brand-sage transition-colors underline"
        >
          Download Manifest (CSV)
        </button>
      </div>
    </div>
  );
}
