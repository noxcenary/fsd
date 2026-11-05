import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { mockStore } from '../data/mockStore';

export default function MessagesPage({ onShowToast }) {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState('CONV-1');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const update = (state) => setConversations(state.messages);
    update(mockStore.getState());
    return mockStore.subscribe(update);
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    mockStore.sendMessage(activeConv.id, inputText.trim());
    setInputText('');
    if (onShowToast) onShowToast(`Message dispatched to ${activeConv.partnerOrg}`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-border p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[11px] font-bold uppercase tracking-wider">
              NGO Communications
            </span>
            <span className="text-[12px] text-brand-walnut/70">
              Verified Organization Channel
            </span>
          </div>
          <h1 className="font-display font-bold text-[24px] text-brand-walnut tracking-tight mt-1">
            Inter-Agency Messages
          </h1>
          <p className="text-[14px] text-brand-walnut/80">
            Coordinate resource quantities, vehicle schedules, and handover acknowledgements directly with verified peer NGOs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-brand-walnut/70">
          <span className="w-2 h-2 rounded-full bg-brand-sage"></span>
          <span>Platform Messaging Channel Active</span>
        </div>
      </div>

      {/* Split Chat Layout */}
      <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left: Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-brand-border flex flex-col bg-brand-ivory/40">
          <div className="p-3.5 border-b border-brand-border bg-white">
            <span className="text-[11px] uppercase tracking-wider font-bold text-brand-walnut/70">
              Partner NGO Conversations ({conversations.length})
            </span>
          </div>

          <div className="divide-y divide-brand-border/60 overflow-y-auto flex-1">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-white shadow-sm border-l-4 border-brand-sage' : 'hover:bg-brand-ivory/80'
                  }`}
                >
                  <img
                    src={conv.avatar}
                    alt={conv.partnerOrg}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-brand-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-[13px] text-brand-walnut truncate">
                        {conv.partnerOrg}
                      </span>
                      <span className="text-[10px] text-brand-walnut/60 whitespace-nowrap ml-1">
                        {conv.lastUpdated}
                      </span>
                    </div>
                    <div className="text-[11px] text-brand-walnut/70 truncate">
                      {conv.partnerLead}
                    </div>
                    {lastMsg && (
                      <p className="text-[12px] text-brand-walnut/80 truncate mt-1">
                        {lastMsg.text}
                      </p>
                    )}
                    <span className="inline-block mt-1 font-mono text-[10px] text-brand-walnut/60 bg-brand-ivory px-1.5 py-0.5 rounded border border-brand-border">
                      {conv.linkedRequestId}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-brand-border flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConv.avatar}
                    alt={activeConv.partnerOrg}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-sage/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-[15px] text-brand-walnut">
                        {activeConv.partnerOrg}
                      </h3>
                      <span className="px-2 py-0.2 rounded-full bg-brand-sage-light text-brand-walnut border border-brand-sage/30 text-[10px] font-bold">
                        Verified Partner
                      </span>
                    </div>
                    <div className="text-[11px] text-brand-walnut/70">
                      Lead: {activeConv.partnerLead} • Ref: {activeConv.linkedRequestId}
                    </div>
                  </div>
                </div>

                <div className="text-[12px] text-brand-walnut/60 hidden sm:block">
                  Topic: {activeConv.topic}
                </div>
              </div>

              {/* Thread Messages */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-brand-ivory/20">
                {activeConv.messages.length === 0 && (
                  <p className="rounded-lg border border-brand-border bg-white p-4 text-[12px] leading-relaxed text-brand-walnut/70">
                    Start a coordination conversation with {activeConv.partnerOrg}. Messages are kept in this app session.
                  </p>
                )}
                {activeConv.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isOwn ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-brand-walnut/70">
                        {m.sender}
                      </span>
                      <span className="text-[10px] text-brand-walnut/50">{m.time}</span>
                    </div>
                    <div
                      className={`max-w-lg p-3.5 rounded-xl text-[13px] leading-relaxed shadow-sm ${
                        m.isOwn
                          ? 'bg-brand-sage text-brand-walnut-dark rounded-br-none'
                          : 'bg-white border border-brand-border text-brand-walnut rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-4 border-t border-brand-border bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Send coordination message to ${activeConv.partnerOrg}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-brand-ivory border border-brand-border rounded-lg px-4 py-2.5 text-[13px] text-brand-walnut placeholder:text-brand-walnut/50 focus:outline-none focus:border-brand-sage transition-colors"
                />
                <Button type="submit" variant="primary" size="md" icon="send">
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-brand-walnut/60">
              Select a conversation to coordinate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
