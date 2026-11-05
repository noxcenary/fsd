import React, { useState, useEffect } from 'react';
import TabNav from '../components/common/TabNav';
import Button from '../components/common/Button';
import { mockStore } from '../data/mockStore';

export default function NotificationsPage({ onShowToast, onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const update = (state) => setNotifications(state.notifications);
    update(mockStore.getState());
    return mockStore.subscribe(update);
  }, []);

  const tabs = [
    { id: 'All', label: 'All Notifications' },
    { id: 'emergency', label: 'Emergency Alerts' },
    { id: 'match', label: 'AI Matches' },
    { id: 'transfer', label: 'Transfers' },
    { id: 'verification', label: 'Verification' }
  ];

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    return n.type === activeTab;
  });

  const handleMarkRead = (id) => {
    mockStore.markNotificationAsRead(id);
  };

  const handleMarkAllRead = () => {
    mockStore.markAllNotificationsRead();
    if (onShowToast) onShowToast('All notifications marked as read.');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[11px] font-bold uppercase tracking-wider">
              Alert Stream
            </span>
            <span className="text-[12px] text-brand-walnut/70">
              Platform Notifications &amp; Alerts
            </span>
          </div>
          <h1 className="font-display font-bold text-[24px] text-brand-walnut tracking-tight mt-1">
            Notifications &amp; Alerts
          </h1>
          <p className="text-[14px] text-brand-walnut/80">
            Emergency alerts, AI-assisted matching results, transfer status updates and verification notifications.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon="done_all"
          onClick={handleMarkAllRead}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-brand-border p-4 rounded-xl shadow-sm">
        <TabNav tabs={tabs} activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white border border-brand-border rounded-xl p-10 text-center space-y-2">
            <span className="material-symbols-outlined text-[36px] text-brand-walnut/30">notifications_off</span>
            <p className="text-[14px] font-semibold text-brand-walnut/70">No notifications in this category</p>
            <p className="text-[12px] text-brand-walnut/50">Check back later for updates on your resources, requests and transfers.</p>
          </div>
        ) : (
          filteredNotifs.map((item) => (
          <div
            key={item.id}
            onClick={() => handleMarkRead(item.id)}
            className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
              item.read
                ? 'bg-white border-brand-border hover:bg-brand-ivory/40'
                : 'bg-white border-brand-border border-l-4 border-l-brand-amber shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === 'emergency'
                    ? 'bg-brand-amber-light text-brand-amber border border-brand-amber/30'
                    : item.type === 'match'
                    ? 'bg-brand-sage-light text-brand-sage border border-brand-sage/30'
                    : 'bg-brand-ivory text-brand-walnut border border-brand-border'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.type === 'emergency'
                    ? 'warning'
                    : item.type === 'match'
                    ? 'auto_awesome'
                    : item.type === 'transfer'
                    ? 'local_shipping'
                    : 'verified'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-[14px] text-brand-walnut">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-amber"></span>
                  )}
                </div>
                <p className="text-[13px] text-brand-walnut/80 leading-relaxed">
                  {item.message}
                </p>
                <span className="text-[11px] text-brand-walnut/50 font-mono block">
                  {item.time}
                </span>
              </div>
            </div>

            {item.actionPath && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onNavigate) onNavigate(item.actionPath);
                }}
                className="self-end sm:self-auto px-3.5 py-1.5 rounded-lg bg-brand-ivory hover:bg-brand-border/40 border border-brand-border font-display font-semibold text-[12px] text-brand-walnut transition-colors shrink-0"
              >
                View Details →
              </button>
            )}
          </div>
        ))
        )}
      </div>
    </div>
  );
}
