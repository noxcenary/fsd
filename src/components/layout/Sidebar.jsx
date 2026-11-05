import React from 'react';
import BrandLogo from '../common/BrandLogo';

export default function Sidebar({ activePath = 'dashboard', onNavigate, onLogout }) {
  const operationsNav = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'find-resources', label: 'Find Resources', icon: 'search' },
    { id: 'my-resources', label: 'My Resources', icon: 'inventory_2' },
    { id: 'ai-recommendations', label: 'AI Matching', icon: 'auto_awesome', highlightIcon: true },
    { id: 'transfers', label: 'Transfers', icon: 'local_shipping' }
  ];

  const coordinationNav = [
    { id: 'ngo-directory', label: 'NGO Directory', icon: 'groups' },
    { id: 'messages', label: 'Messages', icon: 'forum' },
    { id: 'disaster-insights', label: 'Disaster Insights', icon: 'insights' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' }
  ];

  const bottomNav = [
    { id: 'organisation-profile', label: 'Organisation Profile', icon: 'corporate_fare' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-brand-walnut text-[#F7F5EF] z-50 flex flex-col justify-between shadow-xl">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <BrandLogo variant="sidebar" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-[#C8BFB5]/80">
            Operations
          </div>
          {operationsNav.map((item) => {
            const isActive = activePath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] transition-all text-left ${
                  isActive
                    ? 'font-semibold bg-brand-sage text-brand-walnut-dark shadow-sm'
                    : 'text-[#EAE6DE] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive
                      ? 'text-brand-walnut'
                      : item.highlightIcon
                      ? 'text-brand-sage'
                      : 'text-[#C8BFB5]'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="px-3 pb-2 pt-5 text-[11px] font-bold uppercase tracking-wider text-[#C8BFB5]/80">
            Coordination
          </div>
          {coordinationNav.map((item) => {
            const isActive = activePath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] transition-colors text-left ${
                  isActive
                    ? 'font-semibold bg-brand-sage text-brand-walnut-dark shadow-sm'
                    : 'text-[#EAE6DE] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#C8BFB5]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom */}
      <div className="p-3 border-t border-white/10 space-y-1.5 bg-brand-walnut-dark/40">
        {bottomNav.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate && onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-[13px] transition-colors text-left ${
              activePath === item.id
                ? 'font-semibold bg-brand-sage text-brand-walnut-dark shadow-sm'
                : 'text-[#EAE6DE] hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px] text-[#C8BFB5]">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-1.5 rounded-lg text-[13px] text-[#EAE6DE] hover:bg-red-500/20 hover:text-red-200 transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[19px] text-red-300">logout</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
