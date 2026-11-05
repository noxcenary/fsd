import React, { useEffect, useMemo, useState } from 'react';
import { datasetNgos } from '../data/datasetNgos';
import { api } from '../services/api';

export default function NgoDirectoryPage() {
  const [query, setQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All states');
  const [selectedFocus, setSelectedFocus] = useState('All focus areas');
  const [selectedStatus, setSelectedStatus] = useState('All statuses');
  const [platformNgos, setPlatformNgos] = useState([]);
  const [directoryError, setDirectoryError] = useState('');

  useEffect(() => {
    let active = true;
    api.getApprovedNgos()
      .then(({ organizations }) => {
        if (active) setPlatformNgos(organizations);
      })
      .catch((error) => {
        if (active) setDirectoryError(error.message || 'Live platform organizations could not be loaded.');
      });
    return () => { active = false; };
  }, []);

  const directoryNgos = useMemo(() => [
    ...datasetNgos.map((ngo) => ({ ...ngo, verificationStatus: 'Verified' })),
    ...platformNgos
  ], [platformNgos]);
  const stateOptions = useMemo(
    () => [...new Set(directoryNgos.map((ngo) => ngo.state).filter(Boolean))].sort(),
    [directoryNgos]
  );
  const focusOptions = useMemo(
    () => [...new Set(directoryNgos.flatMap((ngo) => ngo.fieldsOfWork || []))].sort(),
    [directoryNgos]
  );
  const filteredNgos = directoryNgos.filter((ngo) => {
    const searchable = [
      ngo.name,
      ngo.darpanId,
      ngo.regNumber,
      ngo.state,
      ngo.district,
      ngo.email,
      ...(ngo.fieldsOfWork || []),
      ...(ngo.resourceCategories || []),
      ...(ngo.serviceAreas || [])
    ].join(' ').toLowerCase();
    const matchesQuery = searchable.includes(query.trim().toLowerCase());
    const matchesState = selectedState === 'All states' || ngo.state === selectedState;
    const matchesFocus = selectedFocus === 'All focus areas' || ngo.fieldsOfWork?.includes(selectedFocus);
    const matchesStatus = selectedStatus === 'All statuses' || ngo.verificationStatus === selectedStatus;
    return matchesQuery && matchesState && matchesFocus && matchesStatus;
  });

  const statusOptions = [...new Set(directoryNgos.map((ngo) => ngo.verificationStatus).filter(Boolean))];

  return (
    <div className="space-y-6 text-left">
      <header className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="rounded-full border border-brand-sage/30 bg-brand-sage-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-walnut">
              Organization directory
            </span>
            <h1 className="mt-2 font-display text-[24px] font-bold tracking-tight text-brand-walnut">
              Find NGO Partners
            </h1>
            <p className="mt-1 max-w-3xl text-[14px] leading-relaxed text-brand-walnut/75">
              Explore organizations in the included Indian NGO dataset by name, location, focus area, and listed resource interests.
            </p>
          </div>
          <div className="rounded-lg bg-brand-ivory px-4 py-3 text-left">
            <div className="font-display text-[22px] font-bold text-brand-walnut">{filteredNgos.length}</div>
            <div className="text-[11px] text-brand-walnut/65">of {directoryNgos.length} listed organizations</div>
          </div>
        </div>
      </header>

      {directoryError && (
        <p role="status" className="rounded-lg border border-brand-amber/30 bg-brand-amber-light p-3 text-[12px] text-brand-walnut">
          Live platform organizations could not be refreshed. Showing the included dataset only.
        </p>
      )}

      <section className="space-y-4 rounded-xl border border-brand-border bg-white p-4 shadow-sm" aria-label="Directory filters">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-semibold text-brand-walnut">Search organizations</span>
          <span className="relative block">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[19px] text-brand-walnut/50" aria-hidden="true">search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, location, activity, resource, registration ID…"
              className="min-h-11 w-full rounded-lg border border-brand-border bg-brand-ivory py-2.5 pl-10 pr-3 text-[13px] text-brand-walnut placeholder:text-brand-walnut/45 focus:border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-sage/20"
            />
          </span>
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="text-[12px] font-semibold text-brand-walnut">
            State
            <select
              value={selectedState}
              onChange={(event) => setSelectedState(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-lg border border-brand-border bg-white px-3 text-[13px] font-normal text-brand-walnut focus:border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-sage/20"
            >
              <option>All states</option>
              {stateOptions.map((state) => <option key={state}>{state}</option>)}
            </select>
          </label>
          <label className="text-[12px] font-semibold text-brand-walnut">
            Focus area
            <select
              value={selectedFocus}
              onChange={(event) => setSelectedFocus(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-lg border border-brand-border bg-white px-3 text-[13px] font-normal text-brand-walnut focus:border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-sage/20"
            >
              <option>All focus areas</option>
              {focusOptions.map((focus) => <option key={focus}>{focus}</option>)}
            </select>
          </label>
          <label className="text-[12px] font-semibold text-brand-walnut">
            Verification status
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-lg border border-brand-border bg-white px-3 text-[13px] font-normal text-brand-walnut focus:border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-sage/20"
            >
              <option>All statuses</option>
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
        </div>
      </section>

      {filteredNgos.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="NGO search results">
          {filteredNgos.map((ngo) => {
            const initials = ngo.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
            return (
              <article key={ngo.id} className="flex min-h-[275px] flex-col rounded-xl border border-brand-border bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light font-display text-[15px] font-bold text-brand-walnut" aria-hidden="true">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-[16px] font-bold leading-snug text-brand-walnut">{ngo.name}</h2>
                    <p className="mt-1 text-[12px] text-brand-walnut/70">
                      {[ngo.district, ngo.state].filter(Boolean).join(', ') || 'Location not listed'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    ['verified', 'approved'].some((status) => ngo.verificationStatus?.toLowerCase().includes(status))
                      ? 'bg-brand-sage-light text-brand-walnut'
                      : 'bg-brand-amber-light text-brand-walnut'
                  }`}>
                    {ngo.verificationStatus || 'Status not provided'}
                  </span>
                  {ngo.ngoType && (
                    <span className="rounded-full bg-brand-ivory px-2.5 py-1 text-[10px] font-semibold text-brand-walnut/75">
                      {ngo.ngoType}
                    </span>
                  )}
                </div>

                <dl className="mt-4 space-y-2 text-[12px]">
                  {ngo.darpanId && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-brand-walnut/60">Registry ID</dt>
                      <dd className="break-all font-mono text-[11px] text-brand-walnut">{ngo.darpanId}</dd>
                    </div>
                  )}
                  {ngo.regNumber && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-brand-walnut/60">Registration</dt>
                      <dd className="break-all text-brand-walnut">{ngo.regNumber}</dd>
                    </div>
                  )}
                  {ngo.fieldsOfWork?.length > 0 && (
                    <div>
                      <dt className="text-brand-walnut/60">Focus areas</dt>
                      <dd className="mt-1 line-clamp-2 text-brand-walnut">{ngo.fieldsOfWork.slice(0, 4).join(' · ')}</dd>
                    </div>
                  )}
                  {ngo.resourceCategories?.length > 0 && (
                    <div>
                      <dt className="text-brand-walnut/60">Resource interests</dt>
                      <dd className="mt-1 line-clamp-2 text-brand-walnut">{ngo.resourceCategories.join(' · ')}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-auto border-t border-brand-border pt-4">
                  {ngo.source === 'platform' && ngo.email ? (
                    <a
                      href={`mailto:${encodeURIComponent(ngo.email)}?subject=${encodeURIComponent('ReliefNet resource coordination')}`}
                      className="inline-flex min-h-11 items-center gap-2 text-[12px] font-semibold text-brand-walnut underline decoration-brand-sage decoration-2 underline-offset-4 hover:text-brand-sage-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/40"
                    >
                      <span className="material-symbols-outlined text-[17px]" aria-hidden="true">mail</span>
                      Contact organization
                    </a>
                  ) : (
                    <span className="text-[11px] text-brand-walnut/55">Open Messages to coordinate with this verified partner</span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-xl border border-brand-border bg-white p-8 text-center">
          <span className="material-symbols-outlined text-[28px] text-brand-walnut/40" aria-hidden="true">search_off</span>
          <h2 className="mt-2 font-display text-[17px] font-bold text-brand-walnut">No organizations match these filters</h2>
          <p className="mt-1 text-[13px] text-brand-walnut/65">Try a broader search or choose a different state, focus area, or verification status.</p>
        </section>
      )}

      <p className="text-[11px] leading-relaxed text-brand-walnut/60">
        The included {datasetNgos.length} organizations are shown as verified, as requested. Verify current credentials, contact details, and resource availability directly before coordinating. Platform approval is a separate review status, not government endorsement.
      </p>
    </div>
  );
}
