import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const statusLabels = {
  pending_review: 'Pending platform review',
  approved: 'Platform approved',
  rejected: 'Application rejected',
  clarification_requested: 'Clarification requested'
};

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProfileVerificationPage({ onShowToast }) {
  const [application, setApplication] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const refreshApplication = async () => {
    const result = await api.getNgoApplication();
    setApplication(result.application);
  };

  useEffect(() => {
    let active = true;
    api.getNgoApplication()
      .then(({ application: result }) => {
        if (active) setApplication(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Could not load the application.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    const invalid = files.find((file) => (
      file.size > 10 * 1024 * 1024 ||
      !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
    ));
    if (files.length > 5 || invalid) {
      setError(invalid
        ? `${invalid.name} must be a PDF, JPG, or PNG no larger than 10 MB.`
        : 'Upload no more than 5 documents at once.');
      event.target.value = '';
      return;
    }
    setSelectedFiles(files);
    setError('');
    event.target.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      setError('Choose at least one document to upload.');
      return;
    }
    setIsUploading(true);
    setError('');
    try {
      const result = await api.uploadNgoDocuments(selectedFiles);
      await refreshApplication();
      setSelectedFiles([]);
      onShowToast?.(result.message);
    } catch (uploadError) {
      setError(uploadError.message || 'The documents could not be uploaded.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <p className="p-6 text-sm text-brand-walnut/70" role="status">Loading organisation profile…</p>;
  }

  if (!application) {
    return (
      <section className="rounded-xl border border-red-200 bg-white p-6 text-left">
        <h1 className="font-display text-xl font-bold text-brand-walnut">Profile unavailable</h1>
        <p role="alert" className="mt-2 text-sm text-red-800">{error || 'No organisation application was found.'}</p>
      </section>
    );
  }

  const isGovernmentVerified = application.verificationLevel === 'Government-Verified';
  const status = isGovernmentVerified
    ? 'Government-verified NGO'
    : statusLabels[application.status] || 'Status unavailable';
  const profileDetails = [
    application.establishedYear && {
      label: 'Established',
      value: String(application.establishedYear),
      icon: 'calendar_month'
    },
    application.district && application.state && {
      label: 'Registered base',
      value: `${application.district}, ${application.state}`,
      icon: 'location_on'
    },
    application.serviceAreas?.length > 0 && {
      label: 'Service areas',
      value: application.serviceAreas.join(' · '),
      icon: 'map'
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6 text-left">
      <header className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
        <span className="rounded-full border border-brand-sage/30 bg-brand-sage-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-walnut">
          Organisation profile
        </span>
        <h1 className="mt-2 font-display text-[24px] font-bold text-brand-walnut">{application.organizationName}</h1>
        <p className="mt-1 text-[13px] text-brand-walnut/70">
          {application.isLocalPreviewSample
            ? `${application.leadName}${application.role ? ` · ${application.role}` : ''}${application.district && application.state ? ` · ${application.district}, ${application.state}` : ''}`
            : 'Registration details and documents saved in this local preview session.'}
        </p>
        <div className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
          isGovernmentVerified
            ? 'border-brand-sage/40 bg-brand-sage-light text-brand-walnut'
            : 'border-brand-border bg-brand-ivory text-brand-walnut'
        }`}>
          {isGovernmentVerified && <span className="material-symbols-outlined text-[16px]" aria-hidden="true">verified</span>}
          {status}
        </div>
        {application.reviewNotes && (
          <div className="mt-4 rounded-lg border border-brand-amber/30 bg-brand-amber-light p-3 text-[13px] text-brand-walnut">
            <strong>Administrator review note:</strong> {application.reviewNotes}
          </div>
        )}
      </header>

      {profileDetails.length > 0 && (
        <section className="rounded-xl border border-brand-border bg-white p-6 shadow-sm" aria-label="Organization profile facts">
          <div className="flex flex-col gap-1 border-b border-brand-border/70 pb-4">
            <h2 className="font-display text-lg font-bold text-brand-walnut">Organization at a glance</h2>
            <p className="text-[12px] text-brand-walnut/65">Key details from the organization profile record.</p>
          </div>
          <dl className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            {profileDetails.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3 rounded-lg bg-brand-ivory p-4">
                <span className="material-symbols-outlined text-[20px] text-brand-sage" aria-hidden="true">{detail.icon}</span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-brand-walnut/60">{detail.label}</dt>
                  <dd className="mt-1 break-words text-[13px] font-semibold leading-relaxed text-brand-walnut">{detail.value}</dd>
                </div>
              </div>
            ))}
          </dl>
          {application.resourceCategories?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-brand-walnut/60">Resource focus</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {application.resourceCategories.map((category) => (
                  <span key={category} className="rounded-full border border-brand-sage/30 bg-brand-sage-light px-3 py-1.5 text-[11px] font-medium text-brand-walnut">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(application.contactPhone || application.contactEmail) && (
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-brand-border/70 pt-4 text-[12px]">
              {application.contactPhone && (
                <a className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-walnut underline decoration-brand-sage underline-offset-4" href={`tel:${application.contactPhone.replace(/[^\d+]/g, '')}`}>
                  <span className="material-symbols-outlined text-[17px]" aria-hidden="true">call</span>
                  {application.contactPhone}
                </a>
              )}
              {application.contactEmail && (
                <a className="inline-flex min-h-11 items-center gap-2 break-all font-semibold text-brand-walnut underline decoration-brand-sage underline-offset-4" href={`mailto:${application.contactEmail}`}>
                  <span className="material-symbols-outlined text-[17px]" aria-hidden="true">mail</span>
                  {application.contactEmail}
                </a>
              )}
            </div>
          )}
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-brand-walnut">Organisation details</h2>
          <dl className="space-y-3 text-[13px]">
            {[
              ['Legal name', application.organizationName],
              ['Registration type', application.ngoType],
              ...(application.registrationNumber ? [['Government registration number', application.registrationNumber]] : []),
              ...(application.darpanId ? [['NGO Darpan ID', application.darpanId]] : []),
              ['Registered location', [application.district, application.state].filter(Boolean).join(', ')],
              ['Contact person', application.leadName],
              ['Account email', application.email]
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 gap-3 border-b border-brand-border/60 pb-2">
                <dt className="text-brand-walnut/65">{label}</dt>
                <dd className="break-words text-right font-medium text-brand-walnut">{value || 'Not listed'}</dd>
              </div>
            ))}
          </dl>
          {application.referralCode && application.status === 'approved' && (
            <div className="rounded-lg bg-brand-sage-light p-3 text-[13px]">
              <div className="font-semibold text-brand-walnut">Your referral code</div>
              <code className="mt-1 block font-mono text-sm">{application.referralCode}</code>
            </div>
          )}
          <p className="text-[11px] leading-relaxed text-brand-walnut/60">
            Platform approval reflects administrator review only; it is not a government registry verification.
          </p>
        </section>

        <section className="space-y-4 rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-display text-lg font-bold text-brand-walnut">Submitted documents</h2>
            <p className="mt-1 text-[12px] text-brand-walnut/65">Selected files stay in browser memory during this app session.</p>
          </div>

          {application.documents.length ? (
            <ul className="space-y-2">
              {application.documents.map((document) => (
                <li key={document.id} className="rounded-lg border border-brand-border bg-brand-ivory p-3">
                  <div className="break-all text-[12px] font-semibold text-brand-walnut">{document.name}</div>
                  <div className="mt-1 flex flex-wrap justify-between gap-2 text-[11px] text-brand-walnut/65">
                    <span>{formatBytes(document.byteSize)}</span>
                    <span>{document.status === 'accepted' ? 'Accepted in platform review' : document.status === 'rejected' ? 'Rejected in platform review' : 'Pending platform review'}</span>
                  </div>
                  {document.notes && <p className="mt-1 text-[11px] text-brand-walnut/70">{document.notes}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg bg-brand-ivory p-3 text-[12px] text-brand-walnut/70">No documents have been uploaded.</p>
          )}

          {application.status !== 'rejected' && (
            <div className="space-y-3 border-t border-brand-border pt-4">
              <label className="block text-[12px] font-semibold text-brand-walnut">
                Add documents
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={handleFilesChange}
                  className="mt-1.5 block min-h-11 w-full rounded-lg border border-brand-border bg-white p-2 text-[12px]"
                />
              </label>
              {selectedFiles.length > 0 && (
                <p className="text-[11px] text-brand-walnut/70">
                  {selectedFiles.map((file) => file.name).join(', ')}
                </p>
              )}
              {error && <p role="alert" className="text-[12px] text-red-700">{error}</p>}
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
                className="min-h-11 rounded-lg bg-brand-primary px-4 text-[12px] font-semibold text-brand-walnut-dark hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? 'Uploading…' : 'Upload for review'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
