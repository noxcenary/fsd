import React, { useState } from 'react';
import BrandLogo from '../components/common/BrandLogo';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function RegistrationPage({ onRegisterSuccess, onGoToLogin }) {
  const [formData, setFormData] = useState({
    orgName: '',
    ngoType: 'Trust',
    registrationNumber: '',
    darpanId: '',
    state: 'Tamil Nadu',
    city: '',
    leadName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    acceptTerms: false,
    shareContact: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleDocumentsChange = (event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > 5) {
      setError('Upload no more than 5 documents.');
      event.target.value = '';
      return;
    }
    const invalidFile = selected.find((file) => (
      file.size > 10 * 1024 * 1024 ||
      !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
    ));
    if (invalidFile) {
      setError(`${invalidFile.name} must be a PDF, JPG, or PNG no larger than 10 MB.`);
      event.target.value = '';
      return;
    }
    setDocuments((current) => [...current, ...selected].slice(0, 5));
    setError('');
    event.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.orgName.trim()) {
      setError('Please provide the official organisation name.');
      return;
    }
    if (!formData.registrationNumber.trim()) {
      setError('Government Registration Number is required.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please provide the city or district of registration.');
      return;
    }
    if (!formData.leadName.trim()) {
      setError('Please provide the contact person\'s name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Official NGO email address is required.');
      return;
    }
    if (formData.password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.acceptTerms) {
      setError('You must accept the Platform Terms of Use and Data Sharing Policy.');
      return;
    }
    if (documents.length === 0) {
      setError('Upload at least one registration document for administrator review.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onRegisterSuccess({
        application: {
          organizationName: formData.orgName,
          ngoType: formData.ngoType,
          registrationNumber: formData.registrationNumber,
          darpanId: formData.darpanId,
          state: formData.state,
          district: formData.city,
          leadName: formData.leadName,
          email: formData.email,
          password: formData.password,
          referralCode: formData.referralCode,
          acceptTerms: formData.acceptTerms,
          shareContact: formData.shareContact
        },
        documents
      });
      setSubmissionMessage(result.message);
    } catch (submitError) {
      setError(submitError.message || 'Registration could not be submitted. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-walnut flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-brand-border/60">
        <BrandLogo variant="light" showTagline={false} />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-[13px] font-semibold text-brand-walnut hover:text-brand-sage transition-colors"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>

      {/* Main Registration Container */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 bg-white border border-brand-border p-6 sm:p-8 rounded-xl shadow-sm text-left">
          <div className="space-y-2 pb-5 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[11px] font-bold uppercase tracking-wider">
                NGO Registration
              </span>
            </div>
            <h1 className="font-display font-bold text-[24px] text-brand-walnut">
              Register Your Organisation
            </h1>
            <p className="text-[13px] text-brand-walnut/70">
              Submit your organisation details and supporting documents for human administrator review. Platform approval is not government verification.
            </p>
          </div>

          {submissionMessage && (
            <div role="status" className="my-4 space-y-3 rounded-lg border border-brand-sage/40 bg-brand-sage-light p-4 text-[13px] text-brand-walnut">
              <p className="font-semibold">{submissionMessage}</p>
              <p className="text-[12px]">You can sign in to check the application status. Resource coordination stays locked until approval.</p>
              <button
                type="button"
                onClick={onGoToLogin}
                className="min-h-11 rounded-lg border border-brand-border bg-white px-4 font-semibold hover:bg-brand-ivory"
              >
                Go to sign in
              </button>
            </div>
          )}

          {error && (
            <div role="alert" className="my-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 pt-5">
            {/* Section 1: Organisation Details */}
            <div className="space-y-3.5">
              <h3 className="font-display font-bold text-[14px] text-brand-walnut uppercase tracking-wide text-brand-walnut/80 border-b border-brand-border/40 pb-1">
                1. Organisation Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Organisation Legal Name"
                  name="orgName"
                  placeholder="e.g. Oliyagam Trust"
                  value={formData.orgName}
                  onChange={handleChange}
                  required
                />
                <div className="space-y-1.5 text-left">
                  <label className="block text-[13px] font-semibold text-brand-walnut">
                    Type of NGO
                  </label>
                  <select
                    name="ngoType"
                    value={formData.ngoType}
                    onChange={handleChange}
                    className="w-full bg-white text-brand-walnut text-[13px] border border-brand-border rounded-lg py-2.5 px-3 focus:outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 transition-colors"
                  >
                    <option>Trust</option>
                    <option>Society</option>
                    <option>Section 8 Company</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Government Registration Number"
                  name="registrationNumber"
                  placeholder="e.g. TN/2009/0015152"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="NGO Darpan Unique ID (if registered)"
                  name="darpanId"
                  placeholder="e.g. TN/2009/0015152"
                  value={formData.darpanId}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[13px] font-semibold text-brand-walnut">
                    State of Registration
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-white text-brand-walnut text-[13px] border border-brand-border rounded-lg py-2.5 px-3 focus:outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 transition-colors"
                  >
                    <option>Andhra Pradesh</option>
                    <option>Assam</option>
                    <option>Bihar</option>
                    <option>Gujarat</option>
                    <option>Karnataka</option>
                    <option>Kerala</option>
                    <option>Madhya Pradesh</option>
                    <option>Maharashtra</option>
                    <option>Odisha</option>
                    <option>Rajasthan</option>
                    <option>Tamil Nadu</option>
                    <option>Telangana</option>
                    <option>Uttar Pradesh</option>
                    <option>West Bengal</option>
                    <option>Other</option>
                  </select>
                </div>
                <Input
                  label="City / District"
                  name="city"
                  placeholder="e.g. Madurai"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 2: Contact & Account */}
            <div className="space-y-3.5 pt-2">
              <h3 className="font-display font-bold text-[14px] text-brand-walnut uppercase tracking-wide text-brand-walnut/80 border-b border-brand-border/40 pb-1">
                2. Contact Person &amp; Account
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Contact Person Full Name"
                  name="leadName"
                  placeholder="e.g. A. Selvaraj"
                  value={formData.leadName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Official NGO Email"
                  name="email"
                  type="email"
                  placeholder="e.g. info@organisation.org"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="At least 12 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                label="Referral code (optional)"
                name="referralCode"
                placeholder="Code shared by an approved platform NGO"
                value={formData.referralCode}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2.5 pt-2">
              <h3 className="font-display font-bold text-[14px] text-brand-walnut uppercase tracking-wide border-b border-brand-border/40 pb-1">
                3. Registration documents
              </h3>
              <p className="text-[12px] text-brand-walnut/70">
                Upload PDF, JPG, or PNG files (up to 10 MB each, 5 files maximum). Files are stored privately for administrator review.
              </p>
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-brand-border bg-white px-4 text-[12px] font-semibold text-brand-walnut hover:bg-brand-ivory focus-within:ring-2 focus-within:ring-brand-sage/40">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">upload_file</span>
                Choose documents
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  multiple
                  onChange={handleDocumentsChange}
                  className="sr-only"
                />
              </label>
              {documents.length > 0 && (
                <ul className="space-y-1.5" aria-label="Selected documents">
                  {documents.map((file, index) => (
                    <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-3 rounded-lg bg-brand-ivory px-3 py-2 text-[12px]">
                      <span className="min-w-0 truncate text-brand-walnut">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setDocuments((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                        aria-label={`Remove ${file.name}`}
                        className="min-h-9 shrink-0 rounded px-2 font-semibold text-brand-walnut underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Section 4: Declarations */}
            <div className="space-y-2.5 pt-2 border-t border-brand-border/40">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded text-brand-sage focus:ring-brand-sage/30 border-brand-border"
                />
                <span className="text-[12px] text-brand-walnut/80 leading-snug">
                  I confirm this information is accurate and accept the platform terms for processing this application.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="shareContact"
                  checked={formData.shareContact}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded text-brand-sage focus:ring-brand-sage/30 border-brand-border"
                />
                <span className="text-[12px] text-brand-walnut/80 leading-snug">
                  If approved, allow my organisation's contact email to appear in the platform NGO directory. This is optional.
                </span>
              </label>
            </div>

            <div className="pt-3 space-y-2.5">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={isLoading || Boolean(submissionMessage)}
                icon="verified"
              >
                {submissionMessage ? 'Application submitted' : isLoading ? 'Submitting Registration...' : 'Submit for Review'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5 text-left sticky top-6">
          <div className="bg-white border border-brand-border p-6 rounded-xl shadow-sm space-y-4">
            <span className="text-[11px] uppercase tracking-wider text-brand-walnut/70 font-bold">
              Registration Preview
            </span>
            <div className="p-4 rounded-xl bg-brand-ivory border border-brand-border space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-sage/20 border border-brand-sage/40 flex items-center justify-center text-brand-sage font-bold text-[18px]">
                  {formData.orgName ? formData.orgName.charAt(0).toUpperCase() : 'N'}
                </div>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-brand-walnut">
                    {formData.orgName || 'Organisation Name'}
                  </h3>
                  <div className="text-[11px] text-brand-walnut/70">
                    {formData.city ? `${formData.city}, ` : ''}{formData.state}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-amber-light text-brand-amber border border-brand-amber/30 text-[11px] font-semibold">
                  Pending Verification
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-ivory text-brand-walnut border border-brand-border text-[11px] font-mono">
                  {formData.darpanId || formData.registrationNumber || 'ID: Pending'}
                </span>
              </div>

              <div className="pt-2 border-t border-brand-border/60 text-[12px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-brand-walnut/60">Type:</span>
                  <span className="font-semibold text-brand-walnut">{formData.ngoType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-walnut/60">Contact:</span>
                  <span className="font-semibold text-brand-walnut">
                    {formData.leadName || 'Contact Name'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-brand-sage-light/60 border border-brand-sage/30 rounded-lg flex items-start gap-2.5 text-[12px] text-brand-walnut">
              <span className="material-symbols-outlined text-brand-sage text-[18px] shrink-0 mt-0.5">
                info
              </span>
              <p className="leading-relaxed">
                An administrator will review the uploaded documents. No government registry lookup or email notification is connected; sign in to check your application status.
              </p>
            </div>
          </div>

          <div className="bg-brand-ivory border border-brand-border p-5 rounded-xl text-[12px] text-brand-walnut/70 space-y-2">
            <div className="font-semibold text-brand-walnut flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-brand-walnut">help</span>
              Registration Requirements
            </div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Must be a registered NGO, Trust or Section 8 Company in India.</li>
              <li>Darpan ID (NGO-PS Portal) is preferred but not mandatory at submission.</li>
              <li>Upload of registration certificate and other documents will be requested during review.</li>
              <li>Final verification is done by a human platform administrator.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-6 border-t border-brand-border/60 flex items-center justify-between text-[12px] text-brand-walnut/60">
        <div>NGO ResourceLink • Organisation Registration</div>
        <div>India-focused NGO Resource Sharing Platform</div>
      </footer>
    </div>
  );
}
