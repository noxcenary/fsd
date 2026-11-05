import React, { useState, useEffect } from 'react';
import TabNav from '../components/common/TabNav';
import { mockStore } from '../data/mockStore';

const destinationCoordinates = [
  { match: /meppadi|wayanad/i, latitude: 11.6854, longitude: 76.132, label: 'Meppadi, Wayanad' },
  { match: /cuddalore/i, latitude: 11.748, longitude: 79.7714, label: 'Cuddalore' },
  { match: /nagapattinam/i, latitude: 10.7672, longitude: 79.8449, label: 'Nagapattinam' }
];

function getDestinationMapUrl(destination) {
  const place = destinationCoordinates.find((entry) => entry.match.test(destination || ''));
  if (!place) return null;

  const radius = 0.6;
  const bounds = [
    place.longitude - radius,
    place.latitude - radius,
    place.longitude + radius,
    place.latitude + radius
  ].join(',');

  return {
    label: place.label,
    url: `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${place.latitude},${place.longitude}`,
    link: `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=11/${place.latitude}/${place.longitude}`
  };
}

function getTransferProgress(status) {
  if (/delivered|confirmed/i.test(status)) return 4;
  if (/transit/i.test(status)) return 3;
  if (/dispatched/i.test(status)) return 2;
  if (/allocated/i.test(status)) return 1;
  return 0;
}

function getNextTransferStatus(status) {
  return {
    0: { status: 'Allocated', label: 'Allocate resources' },
    1: { status: 'Dispatched', label: 'Mark dispatched' },
    2: { status: 'In Transit', label: 'Mark in transit' },
    3: { status: 'Delivered & Confirmed', label: 'Mark delivered' }
  }[getTransferProgress(status)];
}

export default function TransfersPage({ onShowToast }) {
  const [transfers, setTransfers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedManifest, setSelectedManifest] = useState(null);

  useEffect(() => {
    const update = (state) => setTransfers(state.transfers);
    update(mockStore.getState());
    return mockStore.subscribe(update);
  }, []);

  const filterTabs = [
    { id: 'All', label: 'All Transfers' },
    { id: 'Pending Allocation', label: 'Pending Allocation' },
    { id: 'In Transit', label: 'In Transit' },
    { id: 'Delivered', label: 'Delivered & Confirmed' }
  ];

  const filteredTransfers = transfers.filter((t) => {
    if (selectedFilter === 'Pending Allocation') return getTransferProgress(t.status) === 0;
    if (selectedFilter === 'In Transit') return ['Dispatched', 'In Transit'].includes(t.status);
    if (selectedFilter === 'Delivered') return getTransferProgress(t.status) === 4;
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[11px] font-bold uppercase tracking-wider">
              Transfer Coordination
            </span>
            <span className="text-[12px] text-brand-walnut/70">
              Inter-Agency Transfer Ledger
            </span>
          </div>
          <h1 className="font-display font-bold text-[24px] text-brand-walnut tracking-tight mt-1">
            Resource Transfer Tracking
          </h1>
          <p className="text-[14px] text-brand-walnut/80">
            Track resource dispatches, inspect transfer manifests, and record verified handover acknowledgements between organizations.
          </p>
          <p className="mt-1 text-[11px] text-brand-walnut/60">
            Sample records show milestone status only. Live vehicle GPS and route tracking are not connected.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-ivory border border-brand-border text-[12px] font-semibold text-brand-walnut">
            <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
            {transfers.length} Active Records
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-brand-border p-4 rounded-xl shadow-sm">
        <TabNav
          tabs={filterTabs}
          activeTab={selectedFilter}
          onSelectTab={setSelectedFilter}
        />
      </div>

      {/* Transfers List */}
      <div className="space-y-4">
        {filteredTransfers.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-brand-border rounded-xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-border/60">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-brand-ivory border border-brand-border flex items-center justify-center shrink-0 ${
                    item.statusType === 'sage' ? 'text-brand-sage' : 'text-brand-walnut'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {item.icon || 'local_shipping'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-[16px] text-brand-walnut">
                      Transfer {item.id}
                    </span>
                    {item.dispatchedDate && (
                      <span className="text-[12px] text-brand-walnut/60 font-mono">
                        • {item.dispatchedDate}
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-brand-walnut/80 font-medium">
                    {item.summary}
                  </div>
                </div>
              </div>

              {item.statusType === 'amber' ? (
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-amber-light text-brand-amber border border-brand-amber/40 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse"></span>
                  {item.status}
                </span>
              ) : (
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/40 text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[14px] text-brand-sage">
                    check_circle
                  </span>
                  {item.status}
                </span>
              )}
            </div>

            <div className="rounded-xl bg-brand-ivory p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label={`Milestone status for transfer ${item.id}`}>
                {[
                  { label: 'Agreement', icon: 'handshake' },
                  { label: 'Dispatched', icon: 'outbox' },
                  { label: 'In transit', icon: 'local_shipping' },
                  { label: 'Delivered', icon: 'task_alt' }
                ].map((stage, index) => {
                  const progress = getTransferProgress(item.status);
                  const complete = progress > index;
                  const active = progress === index;
                  return (
                    <div key={stage.label} className="flex items-center gap-2">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        complete ? 'bg-brand-sage text-brand-walnut-dark' : active ? 'bg-brand-amber-light text-brand-dark' : 'bg-white text-brand-walnut/45'
                      }`}>
                        <span className="material-symbols-outlined text-[17px]">{stage.icon}</span>
                      </span>
                      <span className={`text-[10px] font-semibold ${active || complete ? 'text-brand-walnut' : 'text-brand-walnut/50'}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 border-t border-brand-border pt-3 text-[11px] text-brand-walnut/70">
                <strong className="text-brand-walnut">Last recorded status:</strong> {item.currentLocation || item.status}
                <span className="block mt-1">Origin: {item.startLocation || 'Not recorded'} · Destination: {item.endLocation || 'Not recorded'}</span>
              </p>
            </div>

            {/* Receipt Confirmation Stamp if delivered */}
            {item.signature ? (
              <div className="p-3.5 bg-brand-ivory rounded-lg border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
                <div className="flex items-center gap-2 text-brand-walnut">
                  <span className="material-symbols-outlined text-brand-sage text-[18px]">
                    check_circle
                  </span>
                  <span>{item.signature}</span>
                </div>
                <span className="font-mono text-brand-walnut font-bold text-[11px]">
                  {item.podCode}
                </span>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between pt-2 text-[12px] gap-2">
              <span className="text-brand-walnut/70">
                Partner Organization: {item.recipientOrg || 'Coordinating NGO'}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {getNextTransferStatus(item.status) && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = getNextTransferStatus(item.status);
                      mockStore.updateTransferStatus(item.id, next.status);
                      onShowToast?.(`${item.id}: ${next.status} recorded in this session.`);
                    }}
                    className="min-h-11 rounded-lg bg-brand-primary px-3 font-semibold text-brand-walnut-dark transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/50"
                  >
                    {getNextTransferStatus(item.status).label}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedManifest(item);
                    if (onShowToast) onShowToast(`Inspecting manifest for ${item.id}`);
                  }}
                  className="font-display font-semibold text-brand-walnut hover:text-brand-sage transition-colors underline"
                >
                  Inspect Transfer Manifest
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedManifest && (
        <div className="p-4 bg-brand-sage-light border border-brand-sage/40 rounded-xl text-[13px] text-brand-walnut space-y-1">
          <div className="font-bold flex items-center justify-between">
            <span>Transfer Manifest #{selectedManifest.id}</span>
            <button
              onClick={() => setSelectedManifest(null)}
              className="text-[11px] underline"
            >
              Close
            </button>
          </div>
          <p className="text-[12px]">
            <strong>Authorized Allocation:</strong> {selectedManifest.summary}. Coordinated through NGO ResourceLink inter-agency exchange protocol.
          </p>
          {(() => {
            const destinationMap = getDestinationMapUrl(selectedManifest.endLocation || selectedManifest.summary);
            return (
              <div className="mt-4 overflow-hidden rounded-xl border border-brand-border bg-white">
                <div className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-walnut/60">Destination area</span>
                    <h3 className="mt-1 font-display text-[15px] font-bold text-brand-walnut">
                      {destinationMap?.label || selectedManifest.endLocation || 'Location not recorded'}
                    </h3>
                  </div>
                  {destinationMap && (
                    <a
                      href={destinationMap.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-brand-walnut underline decoration-brand-sage underline-offset-4"
                    >
                      Open map
                    </a>
                  )}
                </div>
                {destinationMap ? (
                  <iframe
                    title={`Map of transfer destination ${destinationMap.label}`}
                    src={destinationMap.url}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-56 w-full border-0 bg-brand-secondary"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-brand-secondary p-6 text-center text-[12px] text-brand-walnut/70">
                    No mapped destination is available for this manifest.
                  </div>
                )}
                <p className="p-3 text-[11px] text-brand-walnut/60">
                  Map marker identifies the destination area only. Live vehicle GPS, route geometry, and current position are not connected in this prototype. © OpenStreetMap contributors.
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
