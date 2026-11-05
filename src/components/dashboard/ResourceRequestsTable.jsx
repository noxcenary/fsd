import React, { useState } from 'react';
import { resourceRequests } from '../../data/mockData';

export default function ResourceRequestsTable({ requests = resourceRequests, onActionClick }) {
  const [filterUrgency, setFilterUrgency] = useState('All');

  const emergencyCount = requests.filter((r) => r.urgency === 'Emergency' || r.urgency === 'Critical').length;
  const highCount = requests.filter((r) => r.urgency === 'High').length;

  const filteredRequests = requests.filter((req) => {
    if (filterUrgency === 'All') return true;
    if (filterUrgency === 'Emergency') return req.urgency === 'Emergency' || req.urgency === 'Critical';
    if (filterUrgency === 'High') return req.urgency === 'High';
    return true;
  });

  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-sm p-6 space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-brand-border">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-brand-walnut/70 font-bold">
            Coordination Stream
          </span>
          <h3 className="font-display font-bold text-[18px] text-brand-walnut">
            Active Resource Requests
          </h3>
        </div>

        {/* Urgency Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] text-brand-walnut/70">Urgency:</span>
          <button
            onClick={() => setFilterUrgency('All')}
            className={`px-3 py-1 rounded-lg text-[12px] transition-colors ${
              filterUrgency === 'All'
                ? 'bg-brand-walnut text-white font-bold'
                : 'bg-brand-ivory border border-brand-border text-brand-walnut font-medium hover:border-brand-walnut/40'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilterUrgency('Emergency')}
            className={`px-3 py-1 rounded-lg text-[12px] transition-colors ${
              filterUrgency === 'Emergency'
                ? 'bg-brand-amber text-white font-bold'
                : 'bg-brand-amber-light border border-brand-amber/40 text-brand-amber font-bold'
            }`}
          >
            Emergency ({emergencyCount})
          </button>
          <button
            onClick={() => setFilterUrgency('High')}
            className={`px-3 py-1 rounded-lg text-[12px] transition-colors ${
              filterUrgency === 'High'
                ? 'bg-brand-walnut text-white font-bold'
                : 'bg-brand-ivory border border-brand-border text-brand-walnut font-medium hover:border-brand-walnut/40'
            }`}
          >
            High ({highCount})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-brand-ivory text-brand-walnut font-display font-bold uppercase tracking-wider text-[11px] border-b border-brand-border">
              <th className="py-3 px-4 rounded-l-lg">Request ID</th>
              <th className="py-3 px-4">Resource Needed</th>
              <th className="py-3 px-4 text-right">Quantity</th>
              <th className="py-3 px-4">Urgency</th>
              <th className="py-3 px-4">Requesting NGO / Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-brand-ivory/60 transition-colors">
                <td className="py-4 px-4 font-mono font-semibold text-brand-walnut">
                  {req.id}
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-brand-walnut">{req.title}</div>
                  <div className="text-[12px] text-brand-walnut/70">{req.subtitle}</div>
                </td>
                <td className="py-4 px-4 text-right font-mono font-semibold text-brand-walnut whitespace-nowrap">
                  {req.quantity}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {req.urgency === 'Emergency' || req.urgency === 'Critical' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-amber-light text-brand-amber border border-brand-amber/40 text-[11px] font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse"></span>
                      Emergency
                    </span>
                  ) : req.urgency === 'High' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/40 text-[11px] font-bold uppercase">
                      High
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-ivory text-brand-walnut border border-brand-border text-[11px] font-medium uppercase">
                      Normal
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-brand-walnut">{req.partner}</div>
                  <div className="text-[11px] text-brand-walnut/70">{req.location}</div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      req.status === 'AI Match Found' || req.status === 'Matching Found'
                        ? 'bg-brand-sage-light text-brand-walnut border border-brand-sage/40'
                        : req.status === 'In Transit'
                        ? 'bg-brand-amber-light text-brand-amber border border-brand-amber/40'
                        : 'bg-brand-ivory text-brand-walnut border border-brand-border font-medium'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {req.statusIcon || 'info'}
                    </span>
                    {req.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => onActionClick && onActionClick(req)}
                    className={`px-3.5 py-1.5 rounded-lg font-display font-semibold text-[12px] transition-colors ${
                      req.isPrimaryAction
                        ? 'bg-brand-sage hover:bg-brand-primary-hover text-brand-walnut-dark shadow-sm'
                        : 'bg-white border border-brand-border text-brand-walnut hover:bg-brand-border/30'
                    }`}
                  >
                    {req.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
