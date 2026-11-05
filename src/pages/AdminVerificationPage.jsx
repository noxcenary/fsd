import React, { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import { api } from '../services/api';

const statuses = [
  ['pending_review', 'Pending review'],
  ['clarification_requested', 'Clarification requested'],
  ['approved', 'Platform approved'],
  ['rejected', 'Rejected'],
  ['all', 'All applications']
];

const statusLabel = (status) => statuses.find(([value]) => value === status)?.[1] || status;
const documentStatusLabel = (status) => ({
  pending: 'Pending platform review',
  accepted: 'Accepted in platform review',
  rejected: 'Rejected in platform review'
}[status] || status);

export default function AdminVerificationPage({ onShowToast }) {
  const [filter, setFilter] = useState('pending_review');
  const [registrations, setRegistrations] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selected, setSelected] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.getRegistrations(filter)
      .then(({ registrations: result }) => {
        if (!active) return;
        setError('');
        setRegistrations(result);
        setSelectedId((current) => (
          result.some((registration) => registration.id === current)
            ? current
            : result[0]?.id || ''
        ));
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Could not load registration applications.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [filter]);

  useEffect(() => {
    if (!selectedId) return undefined;
    let active = true;
    api.getRegistration(selectedId)
      .then(({ registration }) => {
        if (active) {
          setSelected(registration);
          setDecisionNotes('');
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Could not load this application.');
      });
    return () => { active = false; };
  }, [selectedId]);

  const handleDecision = async (status) => {
    if (!selected) return;
    if (decisionNotes.trim().length < 8) {
      setError('Add at least 8 characters of review notes before recording a decision.');
      return;
    }
    setIsReviewing(true);
    setError('');
    try {
      const result = await api.reviewRegistration(selected.id, {
        status,
        notes: decisionNotes.trim()
      });
      onShowToast?.(result.referralCode
        ? `Platform approval saved. Referral code: ${result.referralCode}`
        : `Review decision saved: ${statusLabel(result.status)}.`);
      setDecisionNotes('');
      const { registrations: updatedList } = await api.getRegistrations(filter);
      setRegistrations(updatedList);
      const nextId = updatedList.some((registration) => registration.id === selected.id)
        ? selected.id
        : updatedList[0]?.id || '';
      setSelectedId(nextId);
      if (nextId === selected.id) {
        const updated = await api.getRegistration(selected.id);
        setSelected(updated.registration);
      } else {
        setSelected(null);
      }
    } catch (reviewError) {
      setError(reviewError.message || 'The review decision could not be saved.');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <header className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="rounded-full bg-brand-walnut px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              Human administrator review
            </span>
            <h1 className="mt-2 font-display text-[24px] font-bold text-brand-walnut">NGO registration applications</h1>
            <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-brand-walnut/75">
              Review applicant-submitted records and private documents. Platform decisions are not government registry verification; no AI risk score or external registry lookup is used here.
            </p>
          </div>
          <label className="text-[12px] font-semibold text-brand-walnut">
            Application status
            <select
              value={filter}
              onChange={(event) => {
                setError('');
                setIsLoading(true);
                setSelectedId('');
                setFilter(event.target.value);
              }}
              className="mt-1.5 min-h-11 w-full rounded-lg border border-brand-border bg-white px-3 text-[13px] font-normal text-brand-walnut"
            >
              {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
      </header>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-800">{error}</p>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <section className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm lg:col-span-4" aria-label="Registration applications">
          <div className="border-b border-brand-border bg-brand-ivory/70 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-walnut/70">
              Applications ({registrations.length})
            </div>
          </div>
          {isLoading ? (
            <p className="p-5 text-[13px] text-brand-walnut/65" role="status">Loading applications…</p>
          ) : registrations.length ? (
            <div className="divide-y divide-brand-border/70">
              {registrations.map((registration) => (
                <button
                  type="button"
                  key={registration.id}
                  onClick={() => setSelectedId(registration.id)}
                  aria-pressed={registration.id === selectedId}
                  className={`w-full p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-sage/50 ${
                    registration.id === selectedId ? 'border-l-4 border-brand-sage bg-brand-sage-light/50' : 'hover:bg-brand-ivory'
                  }`}
                >
                  <span className="block font-display text-[14px] font-bold text-brand-walnut">{registration.organizationName}</span>
                  <span className="mt-1 block text-[11px] text-brand-walnut/65">
                    {[registration.district, registration.state].filter(Boolean).join(', ')}
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                    <span className="rounded-full bg-brand-ivory px-2 py-1 text-brand-walnut">{statusLabel(registration.status)}</span>
                    <span className="text-brand-walnut/60">{registration.documentCount} docs</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="p-5 text-[13px] text-brand-walnut/65">No applications match this status.</p>
          )}
        </section>

        <section className="space-y-5 lg:col-span-8" aria-label="Selected application">
          {selected && selected.id === selectedId ? (
            <>
              <article className="space-y-4 rounded-xl border border-brand-border bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-border pb-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-brand-walnut">{selected.organizationName}</h2>
                    <p className="mt-1 break-all text-[12px] text-brand-walnut/70">{selected.email}</p>
                  </div>
                  <span className="rounded-full border border-brand-border bg-brand-ivory px-3 py-1 text-[12px] font-semibold text-brand-walnut">
                    {statusLabel(selected.status)}
                  </span>
                </div>
                <dl className="grid grid-cols-1 gap-3 text-[12px] sm:grid-cols-2">
                  {[
                    ['Organisation type', selected.ngoType],
                    ['Registration number', selected.registrationNumber],
                    ['NGO Darpan ID', selected.darpanId || 'Not provided'],
                    ['Location', [selected.district, selected.state].filter(Boolean).join(', ')],
                    ['Contact person', selected.leadName],
                    ['Referral code provided', selected.referralCodeSubmitted || 'No']
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-brand-ivory p-3">
                      <dt className="text-brand-walnut/60">{label}</dt>
                      <dd className="mt-1 break-words font-semibold text-brand-walnut">{value || 'Not listed'}</dd>
                    </div>
                  ))}
                </dl>
                {selected.reviewNotes && (
                  <p className="rounded-lg border border-brand-amber/30 bg-brand-amber-light p-3 text-[12px] text-brand-walnut">
                    <strong>Previous review note:</strong> {selected.reviewNotes}
                  </p>
                )}
              </article>

              <article className="space-y-3 rounded-xl border border-brand-border bg-white p-6 shadow-sm">
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-walnut">Applicant documents ({selected.documents.length})</h3>
                  <p className="mt-1 text-[12px] text-brand-walnut/65">Downloads are private and available only to signed-in administrators.</p>
                </div>
                {selected.documents.length ? (
                  <ul className="space-y-2">
                    {selected.documents.map((document) => (
                      <li key={document.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-border bg-brand-ivory p-3">
                        <div>
                          <div className="break-all text-[12px] font-semibold text-brand-walnut">{document.name}</div>
                          <div className="mt-1 text-[11px] text-brand-walnut/65">
                            {formatDocumentSize(document.byteSize)} · {documentStatusLabel(document.status)}
                          </div>
                        </div>
                        <a
                          href={api.getDocumentDownloadUrl(document.id)}
                          className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-brand-border bg-white px-3 text-[12px] font-semibold text-brand-walnut hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/50"
                        >
                          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">download</span>
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-lg bg-brand-ivory p-3 text-[12px] text-brand-walnut/65">No documents were submitted.</p>
                )}
              </article>

              {selected.status !== 'approved' && selected.status !== 'rejected' && (
                <article className="space-y-4 rounded-xl border border-brand-border bg-white p-6 shadow-sm">
                  <div>
                    <h3 className="font-display text-lg font-bold text-brand-walnut">Record a human review decision</h3>
                    <p className="mt-1 text-[12px] text-brand-walnut/65">Review notes are stored in the application audit trail. Approval creates a referral code.</p>
                  </div>
                  <label className="block text-[12px] font-semibold text-brand-walnut">
                    Review notes (required)
                    <textarea
                      rows={3}
                      value={decisionNotes}
                      onChange={(event) => setDecisionNotes(event.target.value)}
                      maxLength={2000}
                      placeholder="Record the documents reviewed and any follow-up required."
                      className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-ivory p-3 text-[13px] font-normal text-brand-walnut focus:border-brand-sage focus:outline-none focus:ring-2 focus:ring-brand-sage/20"
                    />
                  </label>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button disabled={isReviewing} variant="ivory" onClick={() => handleDecision('clarification_requested')}>
                      Request clarification
                    </Button>
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => handleDecision('rejected')}
                      className="min-h-11 rounded-lg border border-red-200 bg-red-50 px-4 text-[13px] font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50"
                    >
                      Reject application
                    </button>
                    <Button disabled={isReviewing} variant="primary" icon="verified" onClick={() => handleDecision('approved')}>
                      {isReviewing ? 'Saving…' : 'Approve on platform'}
                    </Button>
                  </div>
                </article>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-brand-border bg-white p-8 text-center text-[13px] text-brand-walnut/65">
              {isLoading ? 'Loading selected application…' : 'Select an application to review.'}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function formatDocumentSize(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
