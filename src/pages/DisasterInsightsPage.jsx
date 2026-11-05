import React, { useEffect, useMemo, useState } from 'react';
import { disasterInsightsData, mockStore } from '../data/mockStore';
import Button from '../components/common/Button';
import { api } from '../services/api';

const crisisCoordinates = {
  DIS001: { latitude: 11.6854, longitude: 76.132, place: 'Meppadi, Wayanad' },
  DIS002: { latitude: 31.4493, longitude: 77.6309, place: 'Rampur, Himachal Pradesh' },
  DIS003: { latitude: 21.67, longitude: 88.05, place: 'Sagar Island, West Bengal' },
  DIS004: { latitude: 20.5, longitude: 86.8, place: 'Kendrapara, Odisha' },
  DIS005: { latitude: 11.94, longitude: 79.83, place: 'Puducherry' }
};

const inventoryCategoriesByDisasterCategory = {
  'Food & Water': ['Food & Nutrition', 'Water & Sanitation'],
  'Medical': ['Medicines & First Aid', 'Medical Equipment'],
  'Rescue equipment': ['Medical Equipment'],
  'Shelter': ['Shelter Materials'],
  'Shelter & Household items': ['Shelter Materials'],
  'Clothing & Bedding': ['Clothing & Blankets']
};

function getMapUrl(crisis) {
  const point = crisisCoordinates[crisis.id];
  if (!point) return null;
  const radius = 1.1;
  const bounds = [
    point.longitude - radius,
    point.latitude - radius,
    point.longitude + radius,
    point.latitude + radius
  ].join(',');

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${point.latitude},${point.longitude}`;
}

export default function DisasterInsightsPage({ onShowToast, onNavigateToFindResources, onNavigateToTransfers }) {
  const [activeCrisisIndex, setActiveCrisisIndex] = useState(0);
  const [resources, setResources] = useState(mockStore.getState().resources);
  const [aiAdvisory, setAiAdvisory] = useState(null);
  const [aiError, setAiError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const crises = disasterInsightsData.activeCrises;
  const currentCrisis = crises[activeCrisisIndex];

  useEffect(() => mockStore.subscribe((state) => setResources(state.resources)), []);

  const recurringCategories = useMemo(() => {
    const counts = new Map();
    crises
      .filter((crisis) => crisis.isResearched)
      .forEach((crisis) => {
        crisis.resourceCategories.forEach((category) => {
          counts.set(category, (counts.get(category) || 0) + 1);
        });
      });

    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [crises]);

  if (!currentCrisis) {
    return (
      <section className="rounded-xl bg-white p-6 text-left">
        <h1 className="font-display text-xl font-bold text-brand-walnut">Disaster insights unavailable</h1>
        <p className="mt-2 text-sm text-brand-walnut/70">
          No disaster records are currently available to analyse.
        </p>
      </section>
    );
  }

  const mapUrl = getMapUrl(currentCrisis);
  const mapPoint = crisisCoordinates[currentCrisis.id];
  const inventorySignals = [...new Set(
    currentCrisis.resourceCategories.flatMap((category) =>
      inventoryCategoriesByDisasterCategory[category] || [category]
    )
  )].map((category) => ({
    category,
    count: resources.filter((resource) =>
      resource.category === category && ['Available', 'Surplus Available'].includes(resource.status)
    ).length
  }));

  const handleAiAnalysis = async () => {
    setAiError('');
    setAiAdvisory(null);
    setIsAnalyzing(true);
    try {
      const { advisory } = await api.analyzeShortage({
        event: {
          title: currentCrisis.title,
          year: currentCrisis.year,
          state: currentCrisis.state,
          reportedImpact: currentCrisis.reportedImpact || '',
          reportedNeeds: currentCrisis.shortageIsInferred
            ? []
            : currentCrisis.criticalShortages.map((need) => need.item),
          inferredNeeds: currentCrisis.shortageIsInferred
            ? currentCrisis.criticalShortages.map((need) => need.item)
            : []
        },
        inventory: resources
          .filter((resource) => ['Available', 'Surplus Available'].includes(resource.status))
          .slice(0, 100)
          .map((resource) => ({
          category: resource.category || 'Uncategorized',
          itemName: resource.name || resource.item || 'Unnamed listing',
          listingStatus: resource.status || 'Status not provided'
          }))
      });
      setAiAdvisory(advisory);
    } catch (error) {
      setAiError(error.message || 'The local shortage check could not be generated.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <header className="flex flex-col gap-4 rounded-xl border border-brand-border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-brand-sage/40 bg-brand-sage-light px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-walnut">
              Historical disaster analysis
            </span>
            <span className="text-[12px] text-brand-walnut/70">India · Source-labelled records</span>
          </div>
          <h1 className="mt-2 font-display text-[24px] font-bold tracking-tight text-brand-walnut">
            Disaster Insights &amp; Resource Readiness
          </h1>
          <p className="mt-1 max-w-3xl text-[14px] leading-relaxed text-brand-walnut/80">
            Review reported impacts, resource gaps, and recurring needs to support preparedness and coordination.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://mausam.imd.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-border bg-white px-4 text-[13px] font-semibold text-brand-walnut hover:bg-brand-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/40"
          >
            <span className="material-symbols-outlined text-[18px]">cloud</span>
            Official IMD weather
          </a>
          <a
            href="https://ndma.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-border bg-white px-4 text-[13px] font-semibold text-brand-walnut hover:bg-brand-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/40"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            NDMA alerts
          </a>
        </div>
      </header>

      <section className="rounded-xl border border-brand-border bg-brand-secondary p-4 text-[12px] leading-relaxed text-brand-walnut/80">
        <strong className="text-brand-walnut">Decision-support notice:</strong> this screen analyses the historical records bundled with the prototype. Its recurrence signals are not live observations, official forecasts, or AI-generated predictions. Check IMD and NDMA for current official warnings.
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5" aria-label="Historical disaster events">
        {crises.map((crisis, index) => (
          <button
            key={crisis.id}
            type="button"
            onClick={() => {
              setActiveCrisisIndex(index);
              setAiAdvisory(null);
              setAiError('');
            }}
            aria-pressed={index === activeCrisisIndex}
            className={`min-h-[112px] rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/50 ${
              index === activeCrisisIndex
                ? 'border-brand-sage bg-brand-sage-light'
                : 'border-brand-border bg-white hover:bg-brand-ivory'
            }`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-walnut/60">
              {crisis.state} · {crisis.year}
            </span>
            <span className="mt-2 block font-display text-[14px] font-bold leading-snug text-brand-walnut">
              {crisis.title}
            </span>
            <span className="mt-2 inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-brand-walnut/70">
              {crisis.severity}
            </span>
          </button>
        ))}
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        <section className="space-y-5 xl:col-span-7">
          <article className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-border p-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Event record</span>
                <h2 className="mt-1 font-display text-[19px] font-bold text-brand-walnut">{currentCrisis.title}</h2>
                <p className="mt-1 text-[12px] text-brand-walnut/70">
                  {currentCrisis.state} {currentCrisis.districts.length > 0 && `· ${currentCrisis.districts.join(', ')}`}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                currentCrisis.shortageIsInferred
                  ? 'bg-brand-amber-light text-brand-walnut'
                  : 'bg-brand-sage-light text-brand-walnut'
              }`}>
                {currentCrisis.shortageIsInferred ? 'Some needs inferred' : 'Reported needs'}
              </span>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Reported impact</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-brand-walnut/80">
                  {currentCrisis.reportedImpact || 'Impact details are not available in this record.'}
                </p>
              </div>
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Shortage context</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-brand-walnut/80">
                  {currentCrisis.shortageCause || 'A shortage cause was not recorded.'}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Needs identified in record</span>
                <h2 className="mt-1 font-display text-[18px] font-bold text-brand-walnut">Resource planning watchlist</h2>
              </div>
              <span className="rounded-full bg-brand-secondary px-2.5 py-1 text-[11px] font-semibold text-brand-walnut">
                {currentCrisis.criticalShortages.length} listed needs
              </span>
            </div>
            <ul className="mt-4 divide-y divide-brand-border">
              {currentCrisis.criticalShortages.map((need, index) => (
                <li key={`${need.item}-${index}`} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-brand-walnut">{need.item}</p>
                    <p className="mt-1 text-[11px] text-brand-walnut/65">{need.evidence}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToFindResources) onNavigateToFindResources(need.item);
                      if (onShowToast) onShowToast(`Searching network listings related to ${need.item}.`);
                    }}
                    className="min-h-11 shrink-0 rounded-lg px-3 text-left text-[12px] font-semibold text-brand-walnut underline decoration-brand-sage decoration-2 underline-offset-4 hover:text-brand-sage-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/40"
                  >
                    Find related resources
                  </button>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <aside className="space-y-5 xl:col-span-5">
          <article className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Regional locator</span>
                <h2 className="mt-1 font-display text-[17px] font-bold text-brand-walnut">{mapPoint?.place || currentCrisis.state}</h2>
              </div>
              {mapPoint && (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${mapPoint.latitude}&mlon=${mapPoint.longitude}#map=9/${mapPoint.latitude}/${mapPoint.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-brand-walnut underline decoration-brand-sage underline-offset-4"
                >
                  Open full map
                </a>
              )}
            </div>
            {mapUrl ? (
              <iframe
                title={`OpenStreetMap location for ${currentCrisis.title}`}
                src={mapUrl}
                loading="lazy"
                className="h-[270px] w-full border-0 bg-brand-secondary"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-[270px] items-center justify-center bg-brand-secondary p-6 text-center text-sm text-brand-walnut/70">
                Geographic coordinates are not available for this event.
              </div>
            )}
            <p className="p-3 text-[11px] text-brand-walnut/60">
              Approximate district/event marker for historical context, not a live incident or field-team tracker. Map data © OpenStreetMap contributors.
            </p>
          </article>

          <article className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Early planning signals</span>
            <h2 className="mt-1 font-display text-[18px] font-bold text-brand-walnut">Historical needs vs. available listings</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-brand-walnut/70">
              A transparent rule-based check compares this event's historical resource categories with currently listed available resources. It does not predict a live shortage.
            </p>
            <div className="mt-4 space-y-2">
              {inventorySignals.length > 0 ? inventorySignals.map(({ category, count }) => (
                <div key={category} className="flex items-center justify-between gap-3 rounded-lg bg-brand-ivory px-3 py-2.5">
                  <span className="text-[12px] font-medium text-brand-walnut">{category}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    count > 0 ? 'bg-brand-sage-light text-brand-walnut' : 'bg-brand-amber-light text-brand-walnut'
                  }`}>
                    {count > 0 ? `${count} available ${count === 1 ? 'listing' : 'listings'}` : 'No available listing'}
                  </span>
                </div>
              )) : (
                <p className="rounded-lg bg-brand-ivory p-3 text-[12px] text-brand-walnut/70">
                  No resource categories were recorded for this event.
                </p>
              )}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-brand-walnut/60">
              Listings are prototype data and may not represent actual stock. Confirm quantity and availability directly with the provider.
            </p>
            <div className="mt-4 border-t border-brand-border pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-[15px] font-bold text-brand-walnut">AI-assisted shortage &amp; transfer planning</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-brand-walnut/65">
                    Local rules compare historical needs with sample listings; this is not a live forecast or trained AI model.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon="auto_awesome"
                  disabled={isAnalyzing}
                  onClick={handleAiAnalysis}
                >
                  {isAnalyzing ? 'Analyzing…' : 'Generate advisory'}
                </Button>
              </div>
              {aiError && (
                <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-800">
                  {aiError}
                </p>
              )}
              {aiAdvisory && (
                <div className="mt-4 space-y-3 rounded-lg border border-brand-sage/30 bg-brand-sage-light/50 p-3" aria-live="polite">
                  <p className="text-[12px] leading-relaxed text-brand-walnut">{aiAdvisory.summary}</p>
                  {aiAdvisory.planningSignals.length > 0 && (
                    <ul className="space-y-2">
                      {aiAdvisory.planningSignals.map((signal, index) => (
                        <li key={`${signal.need}-${index}`} className="rounded-lg bg-white/80 p-2.5 text-[11px]">
                          <div className="font-semibold text-brand-walnut">{signal.need}</div>
                          <p className="mt-1 text-brand-walnut/75">{signal.evidence}</p>
                          {signal.listedMatches.length > 0 && (
                            <p className="mt-1 text-brand-walnut/65">Related listings: {signal.listedMatches.join(', ')}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const matchingListing = resources.find((resource) => signal.listedMatches.includes(resource.name));
                              const transfer = mockStore.initiateTransfer({
                                title: signal.need,
                                destination: mapPoint?.place || currentCrisis.state,
                                quantity: 'Quantity to confirm',
                                partnerOrg: matchingListing?.owner || 'Verified NGO network'
                              });
                              onShowToast?.(`Transfer request ${transfer.id} created for ${signal.need}; awaiting allocation.`);
                              onNavigateToTransfers?.();
                            }}
                            className="mt-2 min-h-11 rounded-lg bg-brand-primary px-3 text-[11px] font-semibold text-brand-walnut-dark transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/50"
                          >
                            Request transfer
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {aiAdvisory.followUpQuestions.length > 0 && (
                    <div className="text-[11px] text-brand-walnut/75">
                      <strong>Confirm before acting:</strong>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {aiAdvisory.followUpQuestions.map((question, index) => <li key={`${question}-${index}`}>{question}</li>)}
                      </ul>
                    </div>
                  )}
                  <p className="text-[10px] text-brand-walnut/60">Generated by {aiAdvisory.model}. Advisory only; verify availability and need directly.</p>
                </div>
              )}
            </div>
          </article>

          <article className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Historical pattern review</span>
            <h2 className="mt-1 font-display text-[18px] font-bold text-brand-walnut">Recurring resource categories</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-brand-walnut/70">
              Count of researched event records that list each category. This is a preparedness signal, not a forecast.
            </p>
            <div className="mt-4 space-y-3">
              {recurringCategories.map(([category, eventCount]) => (
                <div key={category}>
                  <div className="flex items-center justify-between gap-3 text-[12px]">
                    <span className="font-medium text-brand-walnut">{category}</span>
                    <span className="font-mono text-brand-walnut/70">{eventCount} {eventCount === 1 ? 'event' : 'events'}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-ivory">
                    <div
                      className="h-full rounded-full bg-brand-sage"
                      style={{ width: `${(eventCount / Math.max(crises.filter((crisis) => crisis.isResearched).length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-brand-secondary p-3 text-[11px] leading-relaxed text-brand-walnut/75">
              <strong className="text-brand-walnut">How to use:</strong> compare these recurring needs with verified inventory and current official alerts before prioritising procurement or dispatch.
            </div>
          </article>

          <article className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Evidence &amp; provenance</span>
            <p className="mt-2 text-[12px] leading-relaxed text-brand-walnut/75">{currentCrisis.dataBasis}</p>
            <p className="mt-2 break-words text-[11px] leading-relaxed text-brand-walnut/60">
              Event sources: {currentCrisis.dataSource || 'Not recorded'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon="search"
                onClick={() => {
                  if (onShowToast) onShowToast('Use official IMD and NDMA links above for current warnings.');
                }}
              >
                Review current advisories
              </Button>
            </div>
          </article>

          {currentCrisis.contributingAgencies.length > 0 && (
            <article className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/60">Organisations named in source</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentCrisis.contributingAgencies.map((agency) => (
                  <span key={agency} className="rounded-full bg-brand-secondary px-2.5 py-1 text-[11px] font-medium text-brand-walnut">
                    {agency}
                  </span>
                ))}
              </div>
            </article>
          )}
        </aside>
      </div>
    </div>
  );
}
