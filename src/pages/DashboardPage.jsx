import React, { useState, useEffect } from 'react';
import EmergencyAlertBanner from '../components/dashboard/EmergencyAlertBanner';
import QuickActionsBar from '../components/dashboard/QuickActionsBar';
import StatCard from '../components/dashboard/StatCard';
import AiMatchesSection from '../components/dashboard/AiMatchesSection';
import ResourceRequestsTable from '../components/dashboard/ResourceRequestsTable';
import RecentTransfersSection from '../components/dashboard/RecentTransfersSection';
import AddResourceModal from '../components/resources/AddResourceModal';
import RequestResourceModal from '../components/resources/RequestResourceModal';
import { mockStore } from '../data/mockStore';

export default function DashboardPage({ onNavigate, onShowToast }) {
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    return mockStore.subscribe((newState) => setStoreState({ ...newState }));
  }, []);

  const { currentUser, emergencyAlert, dashboardStats, requests, aiMatches, transfers, datasetDisastersList } = storeState;

  const activeDisaster = datasetDisastersList && datasetDisastersList.length > 0 ? datasetDisastersList[0] : null;

  const handleQuickAction = (action) => {
    if (action === 'add-resource') {
      setIsAddResourceOpen(true);
    } else if (action === 'create-request') {
      setIsRequestModalOpen(true);
    } else if (action === 'find-partner') {
      onNavigate('find-resources');
    } else if (action === 'ai-recommendations') {
      onNavigate('ai-recommendations');
    }
  };

  const handleResourceAdded = (resource) => {
    mockStore.addResource(resource);
    if (onShowToast) onShowToast(`${resource.name} added to your available resources.`);
  };

  const handleRequestCreated = (request) => {
    mockStore.createRequest(request);
    if (onShowToast) onShowToast(`Resource request published: ${request.title}`);
  };

  const handleAlertResponse = () => {
    onNavigate('disaster-insights');
    if (onShowToast) onShowToast('Opening Disaster Resource Analysis...');
  };

  const handleSelectMatch = (match, action) => {
    if (action && (action.includes('Transfer') || action.includes('View') || action.includes('Offer'))) {
      onNavigate('ai-recommendations');
    } else if (action && action.includes('Contact')) {
      onNavigate('messages');
    }
  };

  const handleRequestAction = (req) => {
    if (req.status === 'In Transit') {
      onNavigate('transfers');
    } else {
      onNavigate('find-resources');
    }
    if (onShowToast) onShowToast(`Inspecting ${req.id}: ${req.title}`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Clean Greeting & Organization Identity Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-6 rounded-xl shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/40 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-sage"></span>
              {currentUser.verificationLevel}
            </span>
            <span className="font-mono text-[12px] text-brand-walnut/70 bg-brand-ivory border border-brand-border px-2.5 py-0.5 rounded-md">
              Darpan ID: {currentUser.regNumber}
            </span>
            <span className="text-[12px] text-brand-walnut/60">
              • {currentUser.district}, {currentUser.state}
            </span>
          </div>

          <h1 className="font-display font-bold text-[26px] sm:text-[28px] text-brand-walnut tracking-tight">
            {currentUser.organization}
          </h1>
          <p className="text-[14px] text-brand-walnut/80 max-w-3xl leading-relaxed">
            Coordinating surplus resources with partner NGOs experiencing shortages. Review emergency requests, examine AI-assisted matches, and coordinate verified transfers.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-brand-ivory border border-brand-border px-4 py-3 rounded-xl shrink-0 self-start md:self-auto">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-brand-sage border border-brand-border shadow-xs">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-walnut/60">
              Active network
            </span>
            <span className="font-display font-semibold text-[13px] text-brand-walnut">
              {currentUser.organization}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner (Historical Disaster Relief Coordination) */}
      {emergencyAlert && (
        <EmergencyAlertBanner
          alert={emergencyAlert}
          onRespond={handleAlertResponse}
        />
      )}

      {/* Quick Action Navigation Bar */}
      <QuickActionsBar onAction={handleQuickAction} />
      <AddResourceModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        onResourceAdded={handleResourceAdded}
      />
      <RequestResourceModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequestCreated={handleRequestCreated}
      />

      {/* Primary 4-Grid Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Core Operational Section: Requests (7 cols) + AI Matches (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Resource Requests Table */}
        <div className="lg:col-span-7">
          <ResourceRequestsTable
            requests={requests}
            onActionClick={handleRequestAction}
          />
        </div>

        {/* Right: AI-Assisted Smart Matches */}
        <div className="lg:col-span-5">
          <AiMatchesSection
            matches={aiMatches}
            onSelectMatch={handleSelectMatch}
          />
        </div>
      </div>

      {/* Bottom Section: Recent Transfers Ledger (8 cols) + Disaster Context (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RecentTransfersSection
            transfers={transfers}
            onViewAll={() => onNavigate('transfers')}
          />
        </div>

        {/* Disaster Resource Intelligence Card (Replacing Fictional Depot Card) */}
        <div className="lg:col-span-4 bg-white border border-brand-border rounded-xl shadow-sm p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-brand-walnut/70 font-bold">
                Disaster Analysis
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[10px] font-bold">
                Historical Data
              </span>
            </div>

            <h3 className="font-display font-bold text-[17px] text-brand-walnut">
              {activeDisaster ? activeDisaster.name : 'Disaster Relief Analysis'}
            </h3>

            <p className="text-[12px] text-brand-walnut/80 leading-relaxed">
              {activeDisaster && activeDisaster.reportedImpact
                ? activeDisaster.reportedImpact.slice(0, 160) + '...'
                : 'Examine documented resource shortage patterns and historical NGO contributions from official reports.'}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-brand-border/60 text-[12px]">
            <div className="flex items-center justify-between text-brand-walnut/80">
              <span>Shortage Cause:</span>
              <span className="font-semibold text-brand-walnut">Coordination / Access cut</span>
            </div>
            <div className="flex items-center justify-between text-brand-walnut/80">
              <span>Shortage Items Logged:</span>
              <span className="font-semibold text-brand-amber font-mono">
                {activeDisaster ? activeDisaster.shortageItems.length : 11} documented
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('disaster-insights')}
            className="w-full py-2.5 rounded-lg bg-brand-ivory hover:bg-brand-sage-light hover:text-brand-walnut border border-brand-border text-brand-walnut font-display font-semibold text-[13px] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore Disaster Analysis</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
