import React from 'react';
import { currentUser } from '../../data/mockData';

export default function TopHeader({
  user = currentUser,
  isAdmin = false,
  onNotificationClick,
  onProfileClick,
  onEmergencyClick
}) {
  return (
    <header className="fixed top-0 left-72 right-0 z-40 bg-white/95 backdrop-blur border-b border-brand-border h-16">
      <div className="h-full px-8 flex items-center justify-between gap-4">
        {/* Left: Org & Accreditation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-brand-sage-light border border-brand-sage/30 px-3 py-1 rounded-full text-brand-walnut">
            <span className="material-symbols-outlined text-[16px] text-brand-sage">
              {isAdmin ? 'admin_panel_settings' : 'verified'}
            </span>
            <span className="text-[12px] font-semibold">{user.accreditation}</span>
          </div>

          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 bg-white border border-brand-border px-3.5 py-1.5 rounded-lg shadow-sm hover:border-brand-walnut/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-brand-walnut">
              {isAdmin ? 'account_balance' : 'business'}
            </span>
            <span className="font-display font-semibold text-[13px] text-brand-walnut">
              {user.organization}
            </span>
            <span className="material-symbols-outlined text-[16px] text-brand-walnut/60">
              unfold_more
            </span>
          </button>
        </div>

        {/* Right: Status, Alerts & Profile */}
        <div className="flex items-center gap-3">
          {/* Amber emergency chip in header */}
          <button
            onClick={onEmergencyClick}
            className="flex items-center gap-1.5 bg-brand-amber-light border border-brand-amber/40 px-3 py-1 rounded-full text-brand-amber font-semibold text-[12px] hover:bg-brand-amber/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>Historical alert context</span>
          </button>

          {/* Notifications button */}
          <button
            onClick={onNotificationClick}
            aria-label="Notifications"
            className="relative p-2 text-brand-walnut/80 hover:bg-brand-ivory rounded-full transition-colors border border-transparent hover:border-brand-border"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-amber rounded-full ring-2 ring-white"></span>
          </button>

          {/* Profile Section */}
          <div
            onClick={onProfileClick}
            className="flex items-center gap-3 pl-3 border-l border-brand-border cursor-pointer select-none"
          >
            <div className="flex flex-col text-right leading-tight">
              <span className="font-display font-semibold text-[13px] text-brand-walnut">
                {user.name}
              </span>
              <span className="text-[11px] text-brand-walnut/70">{user.role}</span>
            </div>
            <div
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-sage-light font-display text-[11px] font-bold text-brand-walnut-dark ring-2 ring-brand-sage/30"
            >
              {(user.name || 'U').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
