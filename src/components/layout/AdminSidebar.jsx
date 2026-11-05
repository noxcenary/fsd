import React from 'react';
import BrandLogo from '../common/BrandLogo';

export default function AdminSidebar({ activePath = 'admin-dashboard', onNavigate, onLogout }) {
  const adminNav = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: 'admin_panel_settings' },
    { id: 'admin-verifications', label: 'NGO Application Review', icon: 'fact_check' },
    { id: 'admin-emergency', label: 'Emergency Priority Manager', icon: 'crisis_alert' },
    { id: 'admin-audit', label: 'Chain of Custody Audit', icon: 'policy' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-brand-walnut text-[#F7F5EF] z-50 flex flex-col justify-between shadow-xl">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <BrandLogo variant="sidebar" />
          <div className="mt-2.5 px-2.5 py-1 rounded bg-brand-sage/20 border border-brand-sage/40 text-brand-sage text-[11px] font-bold uppercase tracking-wider text-center">
            Platform Administrator Terminal
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-[#C8BFB5]/80">
            Compliance &amp; Governance
          </div>
          {adminNav.map((item) => {
            const isActive = activePath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[14px] transition-all text-left ${
                  isActive
                    ? 'font-semibold bg-brand-sage text-brand-walnut-dark shadow-sm'
                    : 'text-[#EAE6DE] hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-brand-walnut' : 'text-[#C8BFB5]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-brand-walnut text-brand-sage' : 'bg-brand-amber text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Bottom Actions */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-brand-walnut-dark/40">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-1.5 rounded-lg text-[13px] text-[#EAE6DE] hover:bg-red-500/20 hover:text-red-200 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[18px] text-red-300">logout</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
