import React, { useState } from 'react';
import BrandLogo from '../components/common/BrandLogo';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { mockStore } from '../data/mockStore';
import ngoReliefPhoto from '../assets/ngo-relief.jpg';

export default function LoginPage({ onLoginSuccess, onGoToRegister, serverError = '' }) {
  const { resources, requests, transfers } = mockStore.getState();
  const [selectedRole, setSelectedRole] = useState('ngo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLoginSuccess({
        email,
        password,
        role: selectedRole,
        rememberMe
      });
    } catch (submitError) {
      setError(submitError.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalPreview = async () => {
    setError('');
    setIsLoading(true);
    try {
      await onLoginSuccess({
        email,
        role: selectedRole,
        rememberMe,
        localPreview: true
      });
    } catch (submitError) {
      setError(submitError.message || 'Local preview could not be opened.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100svh] flex-col bg-brand-ivory px-4 py-5 text-brand-walnut sm:px-6 sm:py-6 lg:px-8">
      {/* Top Bar */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-brand-border/60 pb-4">
        <BrandLogo variant="light" showTagline={false} />
        <div className="hidden sm:flex items-center gap-2 bg-brand-sage-light border border-brand-sage/30 px-3 py-1 rounded-full text-brand-walnut text-[12px] font-semibold">
          <span className="material-symbols-outlined text-[16px] text-brand-sage">verified</span>
          <span>Resource coordination network</span>
        </div>
      </div>

      {/* Main Form Container */}
      <main className="flex w-full flex-1 items-center py-5 sm:py-7">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-8">
        {/* Left Side: Platform Context */}
        <div className="text-left lg:col-span-5">
          <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-brand-border bg-brand-walnut shadow-sm sm:min-h-[380px] lg:min-h-[540px]">
            <img
              src={ngoReliefPhoto}
              alt="Community volunteers working together to prepare relief supplies"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-walnut-dark/95 via-brand-walnut-dark/35 to-brand-walnut-dark/5" aria-hidden="true" />
            <div className="relative flex min-h-[320px] flex-col justify-between p-5 text-white sm:min-h-[380px] sm:p-7 lg:min-h-[540px] lg:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/35 bg-brand-walnut-dark/40 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">volunteer_activism</span>
                NGO coordination network
              </span>
              <div>
                <h1 className="max-w-lg font-display text-[30px] font-bold leading-tight tracking-tight text-white sm:text-[36px]">
                  Resources should reach where they are needed.
                </h1>
                <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-white/90">
                  RELINK brings organizations together to coordinate supplies, urgent needs, and relief transfers.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/25 bg-brand-walnut-dark/45 p-3 text-center backdrop-blur-sm sm:gap-3 sm:p-4">
                  {[
                    { value: resources.length, label: 'Listings' },
                    { value: requests.length, label: 'Requests' },
                    { value: transfers.length, label: 'Transfers' }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display text-[20px] font-bold text-white">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-white/80">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-white/75">Sample network data · India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="text-left lg:col-span-7">
        <div className="h-full rounded-xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-2 pb-5 border-b border-brand-border">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-[22px] text-brand-walnut">
                Sign in
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-ivory border border-brand-border text-[11px] font-semibold text-brand-walnut/70">
                {selectedRole === 'admin' ? 'Platform Administrator' : 'NGO'}
              </span>
            </div>
            <p className="text-[13px] text-brand-walnut/70">
              Access the shared NGO resource coordination platform.
            </p>
          </div>

          <div className="pt-5">
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-brand-border bg-brand-ivory p-1">
              {['ngo', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    setError('');
                  }}
                  className={`rounded-lg px-3 py-2 text-[12px] font-semibold transition-all duration-150 ${
                    selectedRole === role
                      ? 'bg-brand-primary text-brand-walnut-dark shadow-sm'
                      : 'text-brand-walnut/70 hover:bg-white'
                  }`}
                >
                  {role === 'ngo' ? 'NGO' : 'Platform Administrator'}
                </button>
              ))}
            </div>
          </div>

          {(serverError || error) && (
            <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-800">
              {error || serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-5">
            <Input
              label="Registered NGO Email"
              type="email"
              icon="mail"
              placeholder="e.g. contact@organisation.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[13px] font-semibold text-brand-walnut">
                  Password <span className="text-red-500">*</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setForgotNotice('Password reset is not configured yet. Contact the platform administrator for help.');
                  }}
                  className="text-[12px] font-medium text-brand-sage hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-walnut/50">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  aria-label="Password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-white text-brand-walnut text-[13px] placeholder:text-brand-walnut/40 border border-brand-border rounded-lg py-2.5 pl-9 pr-10 focus:outline-none focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-walnut/50 hover:text-brand-walnut"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            {forgotNotice && (
              <p role="status" className="text-[12px] text-brand-walnut/75">{forgotNotice}</p>
            )}

            <div className="flex items-center justify-between text-[13px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-sage focus:ring-brand-sage/30 border-brand-border"
                />
                <span className="text-brand-walnut/80 text-[12px]">
                  Keep me signed in for 30 days
                </span>
              </label>
            </div>

            <div className="pt-2 space-y-2.5">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={isLoading}
                icon="login"
              >
                {isLoading ? 'Signing In...' : selectedRole === 'admin' ? 'Enter admin dashboard' : 'Sign in'}
              </Button>
              <button
                type="button"
                onClick={handleLocalPreview}
                disabled={isLoading}
                className="min-h-11 w-full rounded-lg border border-brand-sage/50 bg-brand-sage-light px-4 text-[13px] font-semibold text-brand-walnut transition-colors hover:bg-brand-sage/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Opening preview…' : `Continue with local ${selectedRole === 'admin' ? 'admin' : 'NGO'} preview`}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-brand-walnut/65">
                Frontend demo only. Preview changes stay in this app session and are not submitted for real verification.
              </p>
            </div>
          </form>

          {/* Switch to Registration */}
          <div className="pt-6 mt-6 border-t border-brand-border text-center space-y-2">
            <p className="text-[13px] text-brand-walnut/70">
              New to NGO ResourceLink? Register your organisation.
            </p>
            <button
              type="button"
              onClick={onGoToRegister}
              className="font-display font-semibold text-[13px] text-brand-walnut hover:text-brand-sage transition-colors underline"
            >
              Register your Organisation →
            </button>
          </div>
        </div>
        </div>
      </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 border-t border-brand-border/60 pt-4 text-center text-[12px] text-brand-walnut/60 sm:flex-row sm:text-left">
        <div>NGO ResourceLink • AI-Assisted NGO Resource Sharing &amp; Management Platform</div>
        <div className="flex items-center gap-4">
          <span>Frontend preview</span>
          <span>•</span>
          <span>India</span>
        </div>
      </footer>
    </div>
  );
}
