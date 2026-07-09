import { useState, useEffect } from 'react';
import { BusVehicle, BusRoute, Language, BusStop } from '../types';
import { t } from '../data';
import { 
  Clock, 
  MapPin, 
  PhoneCall, 
  User, 
  Gauge, 
  Users, 
  Bell, 
  BellOff, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

interface BusDetailsComponentProps {
  vehicle: BusVehicle;
  route: BusRoute | null;
  language: Language;
  onToggleSubscribe: (routeCode: string) => void;
  isSubscribed: boolean;
}

export default function BusDetailsComponent({
  vehicle,
  route,
  language,
  onToggleSubscribe,
  isSubscribed,
}: BusDetailsComponentProps) {
  const [activeTab, setActiveTab] = useState<'departures' | 'crew'>('departures');
  const [sosActive, setSosActive] = useState(false);

  if (!route) return null;

  // Find the index of the next stop to render progress
  const nextStopIndex = route.stops.findIndex((s) => s.id === vehicle.nextStopId);
  const currentStopIndex = nextStopIndex > 0 ? nextStopIndex - 1 : 0;

  // Simple ETA calculation based on average bus speed & delays
  const calculateETAForStop = (stopIndex: number): string => {
    if (stopIndex < nextStopIndex) {
      return language === Language.ENGLISH ? 'Departed' : 'கடந்துவிட்டது';
    }
    
    // Estimate mins: approx 4 mins per segment + delay
    const segmentsLeft = stopIndex - currentStopIndex;
    let mins = segmentsLeft * 5 + vehicle.delayMinutes;
    if (mins < 1) mins = 2; // Minimum floor for oncoming stop

    return `${mins} ${language === Language.ENGLISH ? 'mins' : 'நிமி'}`;
  };

  return (
    <div id="bus_details_panel" className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Header section with vehicle profile & subscribe button */}
      <div className="bg-[#006400] text-white p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-white/15 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wide font-mono">
                Route {vehicle.routeCode}
              </span>
              <span className="text-xs text-emerald-200/90 font-mono font-semibold">
                {vehicle.vehicleNumber}
              </span>
            </div>
            <h3 className="text-base font-bold mt-1.5 text-white">
              {language === Language.ENGLISH ? route.originEn : route.originTa}
              <ArrowRight className="inline-block h-3.5 w-3.5 mx-1.5 text-emerald-200" />
              {language === Language.ENGLISH ? route.destinationEn : route.destinationTa}
            </h3>
          </div>

          <button
            onClick={() => onToggleSubscribe(vehicle.routeCode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isSubscribed
                ? 'bg-yellow-400 text-slate-900 shadow-sm hover:bg-yellow-300'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
            }`}
          >
            {isSubscribed ? (
              <>
                <Bell className="h-3.5 w-3.5" />
                <span>{language === Language.ENGLISH ? 'Subscribed' : 'பதிவுசெய்யப்பட்டது'}</span>
              </>
            ) : (
              <>
                <BellOff className="h-3.5 w-3.5 text-emerald-200" />
                <span>{language === Language.ENGLISH ? 'Notify Me' : 'அறிவிப்பு பெறுக'}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Telemetry grid */}
        <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-white/15 text-center">
          <div className="bg-white/5 p-2 rounded-xl">
            <div className="flex justify-center text-emerald-200 mb-1">
              <Gauge className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] text-emerald-100 block">{t('speed', language)}</span>
            <span className="text-xs font-bold text-white font-mono mt-0.5 block">{vehicle.speed} km/h</span>
          </div>

          <div className="bg-white/5 p-2 rounded-xl">
            <div className="flex justify-center text-emerald-200 mb-1">
              <Users className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] text-emerald-100 block">{language === Language.ENGLISH ? 'Occupancy' : 'இடவசதி'}</span>
            <span className="text-xs font-bold text-white leading-none block mt-1 font-mono uppercase">
              {vehicle.occupancy === 'low' && (
                <span className="text-emerald-300">{t('low', language)}</span>
              )}
              {vehicle.occupancy === 'medium' && (
                <span className="text-yellow-300">{t('medium', language)}</span>
              )}
              {vehicle.occupancy === 'high' && (
                <span className="text-red-300">{t('high', language)}</span>
              )}
            </span>
          </div>

          <div className="bg-white/5 p-2 rounded-xl">
            <div className="flex justify-center text-emerald-200 mb-1">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] text-emerald-100 block">{language === Language.ENGLISH ? 'Delay' : 'தாமதம்'}</span>
            <span className="text-xs font-bold leading-none block mt-1 font-mono uppercase">
              {vehicle.delayMinutes === 0 ? (
                <span className="text-emerald-300">{t('onTime', language)}</span>
              ) : vehicle.delayMinutes > 0 ? (
                <span className="text-amber-300">
                  +{vehicle.delayMinutes} {language === Language.ENGLISH ? 'Min' : 'நிமி'}
                </span>
              ) : (
                <span className="text-sky-300">
                  {Math.abs(vehicle.delayMinutes)} {language === Language.ENGLISH ? 'Early' : 'முன்'}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-150 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('departures')}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'departures'
              ? 'border-[#006400] text-[#006400]'
              : 'border-transparent text-slate-500 hover:text-slate-900 bg-slate-50/50'
          }`}
        >
          {t('departures', language)}
        </button>
        <button
          onClick={() => setActiveTab('crew')}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'crew'
              ? 'border-transparent text-slate-500 hover:text-slate-900 bg-slate-50/50'
              : 'border-[#006400] text-[#006400]'
          }`}
        >
          {t('driverInfo', language)}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 flex-1">
        {activeTab === 'departures' ? (
          <div className="space-y-4">
            {/* Live Progress timeline */}
            <div className="relative pl-6 space-y-4 border-l border-slate-200 ml-2 pt-1">
              {route.stops.map((stop, index) => {
                const isPassed = index < nextStopIndex;
                const isApproaching = index === nextStopIndex;
                const stopName = language === Language.ENGLISH ? stop.nameEn : stop.nameTa;

                return (
                  <div key={stop.id} className="relative group">
                    {/* Progress node dot */}
                    <span
                      className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-2 transition-all flex items-center justify-center ${
                        isPassed
                          ? 'bg-[#006400] border-[#006400] text-white shadow-xs'
                          : isApproaching
                          ? 'bg-yellow-400 border-yellow-400 animate-pulse text-slate-950 scale-110 z-10'
                          : 'bg-white border-slate-300 text-slate-300'
                      }`}
                    >
                      {isPassed && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </span>

                    {/* Stop Details */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4
                          className={`text-xs font-bold transition-colors ${
                            isPassed
                              ? 'text-slate-400'
                              : isApproaching
                              ? 'text-[#006400] font-black text-sm'
                              : 'text-slate-700'
                          }`}
                        >
                          {stopName}
                        </h4>
                        {isApproaching && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider mt-0.5">
                            {language === Language.ENGLISH ? 'Approaching Next' : 'அடுத்து வருகிறது'}
                          </span>
                        )}
                      </div>

                      {/* ETA column */}
                      <span
                        className={`text-xs font-mono font-bold shrink-0 ${
                          isPassed
                            ? 'text-slate-400'
                            : isApproaching
                            ? 'text-[#006400] font-black bg-emerald-50 px-2 py-0.5 rounded-md'
                            : 'text-slate-500'
                        }`}
                      >
                        {calculateETAForStop(index)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Crew details tab */
          <div className="space-y-4">
            <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="w-11 h-11 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Assigned Driver
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5">{vehicle.driverName}</h4>
                <p className="text-[11px] text-slate-500">TNSTC Chennai Division • badge #44102</p>
              </div>
            </div>

            {sosActive && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-2 text-red-700 animate-pulse">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p className="text-xs font-bold leading-snug">
                  {language === Language.ENGLISH 
                    ? 'SOS Signal Broadcasted to TNSTC Dispatch Desk!' 
                    : 'SOS சிக்னல் போக்குவரத்து மேசைக்கு அனுப்பப்பட்டது!'}
                </p>
              </div>
            )}

            <div className="flex space-x-2.5">
              <a
                href={`tel:${vehicle.driverPhone}`}
                className="flex-1 bg-[#006400] hover:bg-emerald-800 text-white text-xs font-semibold py-3 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>{t('contactDriver', language)}</span>
              </a>
              <button
                onClick={() => {
                  setSosActive(true);
                  setTimeout(() => setSosActive(false), 8000);
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold py-3 px-4.5 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>SOS</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
