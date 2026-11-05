import React, { useState, useEffect } from 'react';
import TabNav from '../components/common/TabNav';
import Button from '../components/common/Button';
import AddResourceModal from '../components/resources/AddResourceModal';
import { mockStore } from '../data/mockStore';

export default function MyResourcesPage({ onShowToast }) {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const update = (state) => {
      setResources(state.resources.filter((r) => r.isOwn));
    };
    update(mockStore.getState());
    return mockStore.subscribe(update);
  }, []);

  const clusterTabs = [
    { id: 'All', label: 'All Resources' },
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
      item.depot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCluster =
      selectedCluster === 'All' || item.category === selectedCluster;
    return matchesSearch && matchesCluster;
  });

  const handleResourceAdded = (newRes) => {
    mockStore.addResource(newRes);
    if (onShowToast) onShowToast(`Listed ${newRes.name} in surplus catalog.`);
  };

  const handleResourceStatusToggle = (item) => {
    const nextStatus = item.status === 'Available' ? 'Reserved' : 'Available';
    const updatedItem = mockStore.updateResource(item.id, { status: nextStatus });

    if (updatedItem && onShowToast) {
      onShowToast(`${updatedItem.name} marked as ${nextStatus}.`);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[11px] font-bold uppercase tracking-wider">
              Surplus Catalog
            </span>
            <span className="text-[12px] text-brand-walnut/70">
              {resources.length} Surplus Items Registered
            </span>
          </div>
          <h1 className="font-display font-bold text-[24px] text-brand-walnut tracking-tight mt-1">
            My Available Resources
          </h1>
          <p className="text-[14px] text-brand-walnut/80">
            Manage your organization's surplus inventory and declare essential resources ready for inter-agency coordination.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon="add_circle"
          onClick={() => setIsAddModalOpen(true)}
        >
          List Available Resource
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
              placeholder="Search by resource title, location, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-ivory border border-brand-border rounded-lg pl-9 pr-4 py-2 text-[13px] text-brand-walnut placeholder:text-brand-walnut/40 focus:outline-none focus:border-brand-sage"
            />
          </div>

          <div className="text-[12px] text-brand-walnut/70">
            Showing <strong className="text-brand-walnut">{filteredResources.length}</strong> of{' '}
            {resources.length} active listings
          </div>
        </div>

        <TabNav
          tabs={clusterTabs}
          activeTab={selectedCluster}
          onSelectTab={setSelectedCluster}
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-brand-ivory text-brand-walnut font-display font-bold uppercase tracking-wider text-[11px] border-b border-brand-border">
                <th className="py-3 px-4">Item ID</th>
                <th className="py-3 px-4">Resource Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Available Stock</th>
                <th className="py-3 px-4">Storage Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {filteredResources.map((item) => (
                <tr key={item.id} className="hover:bg-brand-ivory/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-walnut text-[12px]">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-brand-walnut">{item.name}</div>
                    <div className="text-[11px] text-brand-walnut/70">{item.condition}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[12px] text-brand-walnut/80">{item.category}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-brand-walnut">
                    {item.quantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-brand-walnut/80 text-[12px]">
                    {item.depot}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.status === 'Available'
                          ? 'bg-brand-sage-light text-brand-walnut border border-brand-sage/40'
                          : 'bg-brand-amber-light text-brand-amber border border-brand-amber/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleResourceStatusToggle(item)}
                      className="px-2.5 py-1 rounded bg-brand-ivory hover:bg-brand-border/40 border border-brand-border text-[11px] font-semibold text-brand-walnut transition-colors"
                    >
                      {item.status === 'Available' ? 'Mark Reserved' : 'Mark Available'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onResourceAdded={handleResourceAdded}
      />
    </div>
  );
}
