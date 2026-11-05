import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { mockStore, adminUser } from '../data/mockStore';

export default function AdminDashboardPage({ onNavigateToVerifications, onShowToast }) {
  const [queue, setQueue] = useState([]);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState('Critical Priority');

  useEffect(() => {
    const update = (state) => setQueue(state.verificationQueue);
    update(mockStore.getState());
    return mockStore.subscribe(update);
  }, []);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;
    mockStore.broadcastEmergencyPriority({
      title: broadcastTitle,
      priority: broadcastPriority,
      description: "Platform emergency alert issued by Administrator. All verified NGOs notified."
    });
    setIsBroadcastModalOpen(false);
    setBroadcastTitle('');
    if (onShowToast) onShowToast('Emergency alert broadcast sent to all verified NGO dashboards.');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-walnut text-white border border-brand-walnut text-[11px] font-bold uppercase tracking-wider">
              {adminUser.accessLevel}
            </span>
            <span className="text-[12px] text-brand-walnut/70">
              Platform Administration
            </span>
          </div>
          <h1 className="font-display font-bold text-[24px] text-brand-walnut tracking-tight mt-1">
            Platform Governance &amp; Verification Center
          </h1>
          <p className="text-[14px] text-brand-walnut/80">
            Review incoming NGO registration requests, examine AI document risk flags, and approve or reject verification applications.
          </p>
        </div>

        <Button
          variant="amber"
          size="lg"
          icon="crisis_alert"
          onClick={() => setIsBroadcastModalOpen(true)}
        >
          Broadcast Emergency Alert
        </Button>
      </div>

      {/* Admin 4-Grid Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-border p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-brand-walnut/70">
                Verified Active NGOs
              </span>
              <div className="font-display font-bold text-[28px] text-brand-walnut tracking-tight">
                18 <span className="text-[13px] font-normal text-brand-walnut/60">entities</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center text-brand-sage">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
          </div>
          <div className="pt-1 border-t border-brand-border/40 text-[12px] text-brand-walnut/70">
            Across verified Indian states
          </div>
        </div>

        <div className="bg-white border border-brand-border p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-brand-walnut/70">
                Pending Verifications
              </span>
              <div className="font-display font-bold text-[28px] text-brand-amber tracking-tight">
                {queue.filter((q) => q.status !== 'Approved').length}{' '}
                <span className="text-[13px] font-normal text-brand-walnut/60">in queue</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-brand-amber-light border border-brand-amber/30 flex items-center justify-center text-brand-amber">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>
          <div className="pt-1 border-t border-brand-border/40 text-[12px] text-brand-amber font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-ping"></span>
            1 AI Flagged for Review
          </div>
        </div>

        <div className="bg-white border border-brand-border p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-brand-walnut/70">
                Total Units Transferred
              </span>
              <div className="font-display font-bold text-[28px] text-brand-walnut tracking-tight">
                19,395 <span className="text-[13px] font-normal text-brand-walnut/60">units</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center text-brand-walnut">
              <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
            </div>
          </div>
          <div className="pt-1 border-t border-brand-border/40 text-[12px] text-brand-walnut/70">
            Resource units coordinated on platform
          </div>
        </div>

        <div className="bg-white border border-brand-border p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-brand-walnut/70">
                Custody Chain Reliability
              </span>
              <div className="font-display font-bold text-[28px] text-brand-walnut tracking-tight">
                No data yet
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-brand-ivory border border-brand-border flex items-center justify-center text-brand-sage">
              <span className="material-symbols-outlined text-[22px]">task_alt</span>
            </div>
          </div>
          <div className="pt-1 border-t border-brand-border/40 text-[12px] text-brand-sage-dark font-semibold">
            Awaiting verified transfer records
          </div>
        </div>
      </div>

      {/* Pending NGO Verification Terminal Queue */}
      <div className="bg-white border border-brand-border rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-brand-border">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-brand-walnut/70 font-bold">
              Review Stream
            </span>
            <h3 className="font-display font-bold text-[18px] text-brand-walnut">
              Pending NGO Verification Queue
            </h3>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigateToVerifications}
            icon="fact_check"
          >
            Open Verification Review
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-brand-ivory text-brand-walnut font-display font-bold uppercase tracking-wider text-[11px] border-b border-brand-border">
                <th className="py-3 px-4">Verification ID</th>
                <th className="py-3 px-4">Organisation Name</th>
                <th className="py-3 px-4">Cluster Sector</th>
                <th className="py-3 px-4">AI Risk Indicator</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Human Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-brand-ivory/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-walnut">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-brand-walnut">{item.orgName}</div>
                    <div className="text-[11px] text-brand-walnut/60 font-mono">
                      {item.regNumber} • {item.state || item.country || 'India'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-brand-walnut/80 text-[12px]">
                    {item.sector}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.aiRiskAnalysis.riskLevel === 'safe'
                          ? 'bg-brand-sage-light text-brand-walnut border border-brand-sage/40'
                          : 'bg-brand-amber-light text-brand-amber border border-brand-amber/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      {item.aiRiskAnalysis.overallRisk}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.status === 'Approved'
                          ? 'bg-brand-sage-light text-brand-walnut border border-brand-sage/40'
                          : item.status === 'Flagged for Review'
                          ? 'bg-brand-amber-light text-brand-amber border border-brand-amber/40'
                          : 'bg-brand-ivory text-brand-walnut border border-brand-border'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={onNavigateToVerifications}
                      className="px-3 py-1.5 rounded-lg bg-brand-sage hover:bg-brand-sage-dark text-brand-walnut-dark font-display font-semibold text-[12px] transition-colors shadow-sm"
                    >
                      Inspect &amp; Decide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-walnut/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl border border-brand-border p-6 max-w-lg w-full space-y-4 text-left shadow-2xl">
            <h3 className="font-display font-bold text-[18px] text-brand-walnut">
              Broadcast Emergency Cluster Priority
            </h3>
            <p className="text-[13px] text-brand-walnut/70">
              This notice will immediately appear as an emergency alert across all verified NGO dashboards on the platform.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-brand-walnut">
                  Emergency Title &amp; Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flash Flooding Alert: Southern Basin Sector 3"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  required
                  className="w-full bg-brand-ivory border border-brand-border rounded-lg p-2.5 text-[13px] text-brand-walnut focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-semibold text-brand-walnut">
                  Priority Urgency
                </label>
                <select
                  value={broadcastPriority}
                  onChange={(e) => setBroadcastPriority(e.target.value)}
                  className="w-full bg-brand-ivory border border-brand-border rounded-lg p-2.5 text-[13px] text-brand-walnut focus:outline-none focus:border-brand-sage"
                >
                  <option>Critical Priority (Immediate Response Needed)</option>
                  <option>High Priority (Anticipated Shortage)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-brand-border">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsBroadcastModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="amber" size="md" type="submit" icon="send">
                  Broadcast Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
