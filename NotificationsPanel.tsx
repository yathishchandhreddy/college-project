import { AlertNotification, Language } from '../types';
import { Bell, AlertTriangle, ShieldCheck, Info, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsPanelProps {
  notifications: AlertNotification[];
  onClear: (id: string) => void;
  language: Language;
}

export default function NotificationsPanel({
  notifications,
  onClear,
  language,
}: NotificationsPanelProps) {
  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl p-5 lg:p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Bell className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span>{language === Language.ENGLISH ? 'Live Alerts & Dispatch Logs' : 'நேரடி அறிவிப்புகள் மற்றும் தாள்கள்'}</span>
        </h3>
        {notifications.length > 0 && (
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
            {notifications.length} {language === Language.ENGLISH ? 'active' : 'செயலில்'}
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <ShieldCheck className="h-8 w-8 mx-auto text-emerald-500/30 mb-2" />
              <p className="text-xs">
                {language === Language.ENGLISH 
                  ? 'All transit systems green. No active delay warnings.' 
                  : 'அனைத்து சேவைகளும் சீராக உள்ளன. தாமதங்கள் ஏதும் இல்லை.'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, height: 0, y: 15 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className={`p-3.5 rounded-2xl border flex items-start space-x-2.5 relative overflow-hidden ${
                  notif.type === 'warning'
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-100'
                    : notif.type === 'delay'
                    ? 'bg-red-950/40 border-red-500/30 text-red-100'
                    : notif.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                    : 'bg-slate-800/60 border-slate-750 text-slate-100'
                }`}
              >
                {/* Visual Icon Badge */}
                <span className="shrink-0 mt-0.5">
                  {notif.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                  {notif.type === 'delay' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                  {notif.type === 'success' && <Check className="h-4 w-4 text-emerald-400" />}
                  {notif.type === 'info' && <Info className="h-4 w-4 text-slate-400" />}
                </span>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    {notif.routeCode && (
                      <span className="bg-[#006400] text-emerald-100 font-mono text-[8px] font-extrabold px-1.5 py-0.5 rounded leading-none">
                        T-{notif.routeCode}
                      </span>
                    )}
                    <h4 className="text-xs font-bold truncate">
                      {language === Language.ENGLISH ? notif.titleEn : notif.titleTa}
                    </h4>
                  </div>
                  <p className="text-[11px] mt-1 leading-relaxed text-slate-300">
                    {language === Language.ENGLISH ? notif.messageEn : notif.messageTa}
                  </p>
                  <span className="text-[9px] text-slate-500 mt-1.5 block font-mono">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => onClear(notif.id)}
                  className="text-slate-400 hover:text-white transition-colors p-1 shrink-0 hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
