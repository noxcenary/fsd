import React, { useState, useEffect } from 'react';
import TabNav from '../components/common/TabNav';
import Button from '../components/common/Button';
import RequestResourceModal from '../components/resources/RequestResourceModal';
import { mockStore } from '../data/mockStore';

export default function FindResourcesPage({ onShowToast, onNavigateToMessages, initialSearch = '' }) {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCluster, setSelectedCluster] = useState('All');
  const [selectedItemForRequest, setSelectedItemForRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const update = (state) => {
      // Find Resources includes all peer listings
      setResources(state.resources.filter((r) => !r.isOwn));
    };
    update(mockStore.getState());
    return mockStore.subscribe(update);
  }, []);

  const clusterTabs = [
    { id: 'All', label: 'All Categories' },
    { id: 'Food & Nutrition', label: 'Food & Nutrition' },
    { id: 'Medicines & First Aid', label: 'Medicines & First Aid' },
    { id: 'Medical Equipment', label: 'Medical Equipment' },
    { id: 'Clothing & Blankets', label: 'Clothing & Blankets' },
    { id: 'Shelter Materials', label: 'Shelter Materials' },
    { id: 'Water & Sanitation', label: 'Water & Sanitation' },
    { id: 'Education Supplies', label: 'Education Supplies' }
  ];

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.depot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.district && item.district.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCluster =
      selectedCluster === 'All' || item.category === selectedCluster;
    return matchesSearch && matchesCluster;
  });

  const handleRequestCreated = (req) => {
    mockStore.createRequest(req);
    if (onShowToast) onShowToast(`Published request: ${req.title}`);
  };

  const handleOpenRequestModal = (item = null) => {
    setSelectedItemForRequest(item);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[11px] font-bold uppercase tracking-wider">
              Resource Discovery
            </span>
          </div>
          <h1 className="font-display font-bold text-[24px] text-brand-walnut tracking-tight mt-1">
            Find Available Resources
          </h1>
          <p className="text-[14px] text-brand-walnut/80">
            Discover verified surplus declared by partner NGOs across essential categories, or publish targeted shortage requests.
          </p>
        </div>

        <Button
          variant="amber"
          size="lg"
          icon="post_add"
          onClick={() => handleOpenRequestModal(null)}
        >
          Create Resource Request
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-brand-border p-4 rounded-xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-brand-walnut/50 text-[19px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search surplus by keyword, NGO name, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-ivory border border-brand-border rounded-lg pl-9 pr-4 py-2 text-[13px] text-brand-walnut placeholder:text-brand-walnut/40 focus:outline-none focus:border-brand-sage"
            />
          </div>

          <div className="text-[12px] text-brand-walnut/70">
            Showing <strong className="text-brand-walnut">{filteredResources.length}</strong> available listings
          </div>
        </div>

        <TabNav
          tabs={clusterTabs}
          activeTab={selectedCluster}
          onSelectTab={setSelectedCluster}
        />
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-brand-border rounded-xl shadow-sm p-5 flex flex-col justify-between space-y-4 hover:border-brand-sage/50 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-brand-sage-light text-brand-walnut border border-brand-sage/40 text-[11px] font-bold">
                  {item.category}
                </span>
                <span className="text-[11px] text-brand-walnut/60 font-mono">
                  {item.id}
                </span>
              </div>

              <h3 className="font-display font-bold text-[16px] text-brand-walnut leading-snug">
                {item.name}
              </h3>

              <div className="space-y-1 pt-1 text-[12px] text-brand-walnut/80">
                <div className="flex items-center gap-1.5 font-semibold text-brand-walnut">
                  <span className="material-symbols-outlined text-[16px] text-brand-sage">
                    verified
                  </span>
                  <span>{item.owner}</span>
                </div>

                {item.darpanId && (
                  <div className="font-mono text-[11px] text-brand-walnut/60 pl-5">
                    Darpan: {item.darpanId}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-brand-walnut/70 pl-5">
                  <span>{item.depot}</span>
                </div>
              </div>

              {item.notes && (
                <p className="text-[12px] text-brand-walnut/70 italic pt-1 border-t border-brand-border/40">
                  "{item.notes}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-brand-border/60 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase font-bold text-brand-walnut/60">
                  Surplus Available
                </span>
                <span className="font-display font-bold text-[18px] text-brand-walnut">
                  {item.quantity.toLocaleString()}{' '}
                  <span className="text-[12px] font-normal text-brand-walnut/70">
                    {item.unit}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenRequestModal(item)}
                  className="flex-1 py-2 px-3 rounded-lg bg-brand-sage hover:bg-brand-primary-hover text-brand-walnut-dark font-display font-semibold text-[12px] transition-colors shadow-sm text-center"
                >
                  Request Allocation
                </button>
                <button
                  onClick={() => {
                    if (onNavigateToMessages) onNavigateToMessages();
                    if (onShowToast) onShowToast(`Opening message channel with ${item.owner}`);
                  }}
                  className="p-2 rounded-lg bg-brand-ivory border border-brand-border text-brand-walnut hover:bg-brand-border/40 transition-colors"
                  title="Message Organization"
                >
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RequestResourceModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequestCreated={handleRequestCreated}
        prefillData={selectedItemForRequest}
      />
    </div>
  );
}
