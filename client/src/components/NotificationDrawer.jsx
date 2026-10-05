import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Bell,
  X,
  MessageSquare,
  Smartphone,
  Mail,
  Send,
  Radio,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function NotificationDrawer() {
  const { notifDrawerOpen, setNotifDrawerOpen, showToast } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterChannel, setFilterChannel] = useState('ALL');

  useEffect(() => {
    if (notifDrawerOpen) {
      loadNotifications();
    }
  }, [notifDrawerOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!notifDrawerOpen) return null;

  const filteredNotifs = filterChannel === 'ALL'
    ? notifications
    : notifications.filter(n => n.channel.toUpperCase().includes(filterChannel));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-600 text-white">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Multi-Channel Dispatch Logs
            </h3>
          </div>
          <button
            onClick={() => setNotifDrawerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-1.5 py-3 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar text-xs">
          {['ALL', 'SMS', 'WHATSAPP', 'PUSH', 'EMAIL'].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer whitespace-nowrap ${
                filterChannel === ch
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
          {loading ? (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Fetching dispatch feeds...</span>
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No alerts found for this filter.</div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 space-y-1.5 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.message}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50 text-slate-500">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Channel: {n.channel}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{n.status}</span>
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 truncate">
                  Recipient: {n.recipient}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 text-center">
          Active Carrier Relays: SMS Gateway, Twilio, WhatsApp Business API, Firebase Cloud Messaging
        </div>
      </div>
    </div>
  );
}
