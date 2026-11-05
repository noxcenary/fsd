import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { mockStore } from '../data/mockStore';

export default function AiRecommendationsPage({ onShowToast, onNavigateToTransfers, onNavigateToMessages }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const update = (state) => setMatches(state.aiMatches);
    update(mockStore.getState());
    return mockStore.subscribe(update);
  }, []);

  const handleInitiateTransfer = (match) => {
    mockStore.initiateTransfer({
      title: match.highlight,
      destination: match.hub,
      quantity: match.highlight.split(' ')[0] || '1',
      partnerOrg: match.orgName
    });
    if (onShowToast) onShowToast(`Sample transfer proposal created for ${match.orgName} in this session.`);
    if (onNavigateToTransfers) onNavigateToTransfers();
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-sage animate-pulse"></span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[11px] font-bold uppercase tracking-wider">
              Prototype match examples
            </span>
            <span className="text-[12px] text-brand-walnut/70">
              Multi-Factor Ranking
            </span>
          </div>
          <h1 className="font-display font-bold text-[24px] text-brand-walnut tracking-tight mt-1">
            Resource Matching Preview
          </h1>
          <p className="text-[14px] text-brand-walnut/80">
            These example cards use in-memory prototype records. They are not live AI recommendations, verified matches, or guaranteed available inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg bg-brand-ivory border border-brand-border text-center">
            <div className="text-[10px] uppercase font-bold text-brand-walnut/60">Data source</div>
            <div className="font-display font-semibold text-[13px] text-brand-walnut">Sample records</div>
          </div>
        </div>
      </div>

      {/* Honest AI Limitation Alert Box */}
      <div className="bg-brand-ivory border border-brand-border rounded-xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-brand-amber text-[20px] shrink-0 mt-0.5">
          verified_user
        </span>
        <div className="text-[12px] text-brand-walnut/80 leading-relaxed">
          <strong className="text-brand-walnut font-semibold">Prototype notice:</strong> Disaster Insights provides a local rules-based shortage check. The matches below are examples; transfers and messages stay in this app session.
        </div>
      </div>

      {/* Matching Factors Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-brand-border p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-walnut/60 tracking-wider">Factor 1</span>
          <div className="font-display font-bold text-[13px] text-brand-walnut">Resource Compatibility</div>
          <p className="text-[11px] text-brand-walnut/70">Category &amp; specifications</p>
        </div>
        <div className="bg-white border border-brand-border p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-walnut/60 tracking-wider">Factor 2</span>
          <div className="font-display font-bold text-[13px] text-brand-walnut">Geographic Proximity</div>
          <p className="text-[11px] text-brand-walnut/70">Distance &amp; transit feasibility</p>
        </div>
        <div className="bg-white border border-brand-border p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-walnut/60 tracking-wider">Factor 3</span>
          <div className="font-display font-bold text-[13px] text-brand-walnut">Request Urgency</div>
          <p className="text-[11px] text-brand-walnut/70">Emergency prioritization</p>
        </div>
        <div className="bg-white border border-brand-border p-3.5 rounded-xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-walnut/60 tracking-wider">Factor 4</span>
          <div className="font-display font-bold text-[13px] text-brand-walnut">Trust Indicators</div>
          <p className="text-[11px] text-brand-walnut/70">Verification &amp; audit history</p>
        </div>
      </div>

      {/* AI Matches List */}
      <div className="space-y-4">
        {matches.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-brand-border rounded-xl p-6 shadow-sm hover:border-brand-sage/60 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-sage/20 border border-brand-sage/40 flex items-center justify-center text-brand-sage shrink-0">
                  <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-[16px] text-brand-walnut">
                      {item.orgName}
                    </span>
                    <span className="text-[12px] text-brand-walnut/60">• {item.hub}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-brand-sage-dark font-bold">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Verified organization
                    </span>
                  </div>
                  {item.darpanId && (
                    <div className="font-mono text-[11px] text-brand-walnut/60">
                      Darpan ID: {item.darpanId}
                    </div>
                  )}
                  <div className="text-[13px] text-brand-sage-dark font-semibold mt-0.5">
                    {item.type}: {item.highlight}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-3 py-1 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/40 font-display font-bold text-[13px]">
                  Sample score {item.matchRate}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-brand-ivory text-brand-walnut/80 border border-brand-border text-[11px] font-medium">
                  Rank #{index + 1}
                </span>
              </div>
            </div>

            <p className="text-[13px] text-brand-walnut/80 leading-relaxed max-w-4xl">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-border/40">
              <div className="flex items-center gap-4 text-[12px] text-brand-walnut/70">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-brand-sage">pin_drop</span>
                  Nearby District
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-brand-sage">verified</span>
                  Sample listing
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="secondary"
                  size="sm"
                  icon="forum"
                  onClick={() => {
                    if (onNavigateToMessages) onNavigateToMessages();
                    if (onShowToast) onShowToast(`Initiating coordination chat with ${item.orgName}`);
                  }}
                >
                  Contact NGO
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon="local_shipping"
                  onClick={() => handleInitiateTransfer(item)}
                >
                  Coordinate Transfer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
