import React from 'react';

export default function TabNav({ tabs = [], activeTab, onSelectTab, className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 ${className}`}>
      {tabs.map((tab) => {
        const tabId = typeof tab === 'object' ? tab.id : tab;
        const tabLabel = typeof tab === 'object' ? tab.label : tab;
        const tabCount = typeof tab === 'object' ? tab.count : undefined;
        const isActive = activeTab === tabId;

        return (
          <button
            key={tabId}
            onClick={() => onSelectTab(tabId)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              isActive
                ? 'bg-brand-walnut text-white font-semibold shadow-sm'
                : 'bg-white border border-brand-border text-brand-walnut/80 hover:bg-brand-ivory hover:text-brand-walnut'
            }`}
          >
            <span>{tabLabel}</span>
            {tabCount !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-brand-sage text-brand-walnut-dark'
                    : 'bg-brand-ivory text-brand-walnut/70'
                }`}
              >
                {tabCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
