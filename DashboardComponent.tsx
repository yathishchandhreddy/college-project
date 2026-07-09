import { useState } from 'react';
import { BusRoute, Language } from '../types';
import { t } from '../data';
import { Search, Star, Bus, MapPin, BadgePercent, ArrowRight, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface DashboardComponentProps {
  routes: BusRoute[];
  selectedRoute: BusRoute | null;
  onSelectRoute: (route: BusRoute) => void;
  savedRoutes: string[];
  onToggleSaveRoute: (routeId: string) => void;
  language: Language;
}

export default function DashboardComponent({
  routes,
  selectedRoute,
  onSelectRoute,
  savedRoutes,
  onToggleSaveRoute,
  language,
}: DashboardComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter routes based on query & type
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = 
      route.routeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.originEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.originTa.includes(searchQuery) ||
      route.destinationEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destinationTa.includes(searchQuery);
    
    const matchesType = selectedType === 'all' || route.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 lg:p-6 space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          {language === Language.ENGLISH ? 'Search Bus Route or Stop' : 'பேருந்து வழி அல்லது நிறுத்தம் தேடுக'}
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchRoutePlaceholder', language)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] text-sm font-medium transition-all"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span>{language === Language.ENGLISH ? 'Filter Bus Class' : 'பேருந்து வகுப்பு வடித்தல்'}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', labelEn: 'All Classes', labelTa: 'அனைத்து வகுப்புகளும்' },
            { id: 'ordinary', labelEn: 'Ordinary', labelTa: 'சாதாரண' },
            { id: 'deluxe', labelEn: 'Deluxe', labelTa: 'டீலக்ஸ்' },
            { id: 'air_conditioned', labelEn: 'A/C Deluxe', labelTa: 'ஏசி சொகுசு' },
            { id: 'sleeper', labelEn: 'AC Sleeper', labelTa: 'AC படுக்கை' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedType === type.id
                  ? 'bg-[#006400] text-white shadow-sm scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {language === Language.ENGLISH ? type.labelEn : type.labelTa}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Stats Banner */}
      <div className="grid grid-cols-2 gap-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/40 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === Language.ENGLISH ? 'Operational Routes' : 'செயலில் உள்ள தடங்கள்'}
          </span>
          <span className="text-xl font-black text-[#006400] font-mono block mt-1">
            {routes.length} / 4
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === Language.ENGLISH ? 'Fleet Status' : 'விமானத் தொகுதி நிலை'}
          </span>
          <span className="text-xs font-bold text-white bg-[#006400] px-3 py-1 rounded-full inline-block mt-1.5 font-sans leading-none">
            ● {language === Language.ENGLISH ? '100% Online' : '100% ஆன்லைன்'}
          </span>
        </div>
      </div>

      {/* Routes List */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          {t('allRoutes', language)} ({filteredRoutes.length})
        </h3>
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <Bus className="h-6 w-6 mx-auto mb-1 opacity-40 text-slate-500" />
              <p className="text-xs">
                {language === Language.ENGLISH ? 'No matching routes found.' : 'பொருத்தமான வழித்தடங்கள் இல்லை.'}
              </p>
            </div>
          ) : (
            filteredRoutes.map((route) => {
              const isSelected = selectedRoute?.id === route.id;
              const isSaved = savedRoutes.includes(route.id);

              return (
                <div
                  key={route.id}
                  className={`p-4 rounded-2xl border transition-all flex justify-between items-center relative overflow-hidden ${
                    isSelected
                      ? 'border-[#006400] bg-emerald-50/20 shadow-xs'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Left segment - details */}
                  <div className="flex-1 min-w-0 pr-2 cursor-pointer" onClick={() => onSelectRoute(route)}>
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-950 text-white font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg leading-none shadow-xs">
                        {route.routeCode}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {route.stops.length} {language === Language.ENGLISH ? 'stops' : 'நிறுத்தங்கள்'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 mt-2 flex items-center flex-wrap leading-tight">
                      <span>{language === Language.ENGLISH ? route.originEn : route.originTa}</span>
                      <ArrowRight className="h-3 w-3 mx-1 text-slate-400 shrink-0" />
                      <span>{language === Language.ENGLISH ? route.destinationEn : route.destinationTa}</span>
                    </h4>

                    {/* Fare and Bus Class tags */}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase leading-none font-sans">
                        {route.type === 'ordinary' && t('ordinaryType', language).split(' ')[0]}
                        {route.type === 'deluxe' && t('deluxeType', language).split(' ')[0]}
                        {route.type === 'air_conditioned' && 'AC Deluxe'}
                        {route.type === 'sleeper' && 'AC Sleeper'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#006400] bg-emerald-50 px-1.5 py-0.5 rounded leading-none">
                        ₹{route.fare}
                      </span>
                    </div>
                  </div>

                  {/* Right segment - Save star */}
                  <button
                    onClick={() => onToggleSaveRoute(route.id)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-300 hover:text-yellow-500 transition-colors shrink-0 cursor-pointer animate-none"
                  >
                    <Star
                      className={`h-4.5 w-4.5 ${
                        isSaved ? 'fill-yellow-400 text-yellow-500 scale-105' : 'text-slate-300'
                      }`}
                    />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
