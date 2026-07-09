import { useState, useEffect, useRef } from 'react';
import { Language, User, BusVehicle, BusRoute, AlertNotification } from './types';
import { 
  TNSTC_ROUTES, 
  INITIAL_VEHICLES, 
  INITIAL_ALERTS, 
  getPositionAlongRoute, 
  t, 
  CHENNAI_STOPS 
} from './data';

import LoginComponent from './components/LoginComponent';
import MapViewComponent from './components/MapViewComponent';
import BusDetailsComponent from './components/BusDetailsComponent';
import NotificationsPanel from './components/NotificationsPanel';
import DashboardComponent from './components/DashboardComponent';

import { 
  Landmark, 
  LogOut, 
  Languages, 
  Bell, 
  Bus, 
  TrendingUp, 
  Users, 
  Activity,
  AlertCircle,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Soft audio chime synthesizer to alert passengers when a bus departs!
function playDepartureChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Low tone then high tone
    const osc1 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    
    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    
    osc1.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start();
    osc1.stop(ctx.currentTime + 0.65);
  } catch (e) {
    console.warn('Audio chime could not be played', e);
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [vehicles, setVehicles] = useState<BusVehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<BusVehicle | null>(null);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [subscribedRoutes, setSubscribedRoutes] = useState<string[]>([]);
  const [liveToast, setLiveToast] = useState<AlertNotification | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Maintain separate progress float [0.0 - 1.0] for each simulated bus
  const vehicleProgressRef = useRef<{ [id: string]: number }>({
    v_102_1: 0.02,
    v_570_1: 0.28,
    v_21g_1: 0.52,
    v_m51_1: 0.78,
  });

  // Load user session on mount
  useEffect(() => {
    const stored = localStorage.getItem('tnstc_user_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
        if (parsed.language) setLanguage(parsed.language);
      } catch (e) {
        localStorage.removeItem('tnstc_user_session');
      }
    }

    // Let the map show the entire state of Tamil Nadu initially.
    // The user can select a route or vehicle to zoom in on it.
  }, []);

  // Real-time GPS movement simulation and live stop-departures notification engine
  useEffect(() => {
    // Only run simulation when user is logged in
    if (!user) return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) => {
        return prevVehicles.map((vehicle) => {
          const route = TNSTC_ROUTES.find((r) => r.id === vehicle.routeId);
          if (!route) return vehicle;

          // Increment progress along route stops
          let nextProgress = vehicleProgressRef.current[vehicle.id] + 0.012;
          
          // Loop back to start if finished
          if (nextProgress > 1.0) {
            nextProgress = 0.0;
          }
          vehicleProgressRef.current[vehicle.id] = nextProgress;

          // Calculate brand new GPS coordinates and directional angle
          const loc = getPositionAlongRoute(route, nextProgress);

          // Detect stop departures to trigger real-time departure notifications!
          if (loc.lastStopId !== vehicle.nextStopId && vehicle.nextStopId !== loc.nextStopId) {
            // Find names of stops
            const departedStop = route.stops.find((s) => s.id === vehicle.nextStopId) || route.stops[0];
            const headingStop = route.stops.find((s) => s.id === loc.nextStopId) || route.stops[route.stops.length - 1];

            const lastStopNameEn = departedStop.nameEn;
            const lastStopNameTa = departedStop.nameTa;
            const nextStopNameEn = headingStop.nameEn;
            const nextStopNameTa = headingStop.nameTa;

            // Generate official dispatch alert object
            const newAlert: AlertNotification = {
              id: `alert_dispatch_${Date.now()}_${vehicle.id}`,
              titleEn: `Route ${vehicle.routeCode} Departed stop`,
              titleTa: `தடம் ${vehicle.routeCode} புறப்பட்டது`,
              messageEn: `Bus ${vehicle.vehicleNumber} has departed ${lastStopNameEn} and is en-route to ${nextStopNameEn}.`,
              messageTa: `பேருந்து ${vehicle.vehicleNumber} ${lastStopNameTa}-லிருந்து புறப்பட்டு ${nextStopNameTa} நோக்கிச் செல்கிறது.`,
              timestamp: new Date().toISOString(),
              type: 'info',
              routeCode: vehicle.routeCode,
            };

            // Prepend alert to notification log
            setAlerts((prev) => [newAlert, ...prev].slice(0, 30)); // Cap at 30 logs

            // Check if user is subscribed to this route code for popups
            if (subscribedRoutes.includes(vehicle.routeCode)) {
              setLiveToast(newAlert);
              if (soundEnabled) playDepartureChime();

              // Auto-dismiss popup after 5.5 seconds
              setTimeout(() => {
                setLiveToast((current) => (current?.id === newAlert.id ? null : current));
              }, 5500);
            }
          }

          // Randomize speed slightly to look organic
          const speedVariance = Math.floor(Math.random() * 9) - 4; // -4 to +4
          let finalSpeed = Math.max(15, Math.min(55, vehicle.speed + speedVariance));

          return {
            ...vehicle,
            lat: loc.lat,
            lng: loc.lng,
            heading: loc.heading,
            nextStopId: loc.nextStopId,
            speed: finalSpeed,
            lastUpdated: new Date().toISOString(),
          };
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [user, subscribedRoutes, soundEnabled]);

  // Synchronize selection
  useEffect(() => {
    if (selectedVehicle) {
      const updated = vehicles.find((v) => v.id === selectedVehicle.id);
      if (updated) setSelectedVehicle(updated);
    }
  }, [vehicles]);

  // Handle Select Bus Route from panel
  const handleSelectRoute = (route: BusRoute) => {
    setSelectedRoute(route);
    // Auto-select first active vehicle on that route
    const associatedVehicle = vehicles.find((v) => v.routeId === route.id);
    if (associatedVehicle) {
      setSelectedVehicle(associatedVehicle);
    }
  };

  // Toggle saving route to local storage
  const handleToggleSaveRoute = (routeId: string) => {
    if (!user) return;
    const isSaved = user.savedRoutes.includes(routeId);
    let nextSaved: string[];
    
    if (isSaved) {
      nextSaved = user.savedRoutes.filter((id) => id !== routeId);
    } else {
      nextSaved = [...user.savedRoutes, routeId];
    }

    const updatedUser = { ...user, savedRoutes: nextSaved };
    setUser(updatedUser);
    localStorage.setItem('tnstc_user_session', JSON.stringify(updatedUser));
  };

  // Toggle subscribing to live popups
  const handleToggleSubscribe = (routeCode: string) => {
    setSubscribedRoutes((prev) => {
      const active = prev.includes(routeCode);
      if (active) {
        return prev.filter((code) => code !== routeCode);
      } else {
        return [...prev, routeCode];
      }
    });
  };

  // Clear single alert log
  const handleClearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('tnstc_user_session');
    setUser(null);
  };

  // Render Login state if not authenticated
  if (!user) {
    return (
      <LoginComponent 
        onLogin={(loggedInUser) => setUser(loggedInUser)} 
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Main Navigation Header */}
      <header className="bg-[#006400] text-white shadow-md sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
          
          {/* Logo & Seals */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-1.5 rounded-xl border border-white/10 hidden sm:flex shrink-0">
              <svg className="w-8 h-8 text-yellow-300" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 15 L62 40 L60 40 L50 20 L40 40 L38 40 Z" />
                <path d="M50 30 L67 60 L65 60 L50 35 L35 60 L33 60 Z" />
                <path d="M50 45 L72 80 L28 80 Z" />
                <rect x="44" y="80" width="12" height="10" fill="white" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight">{t('appName', language)}</h1>
                <span className="bg-emerald-800 text-yellow-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-700/30 uppercase leading-none">
                  Live
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-emerald-100/85 font-medium">
                {language === Language.ENGLISH ? 'State Transport Department • Tamil Nadu' : 'மாநில போக்குவரத்துத் துறை • தமிழ்நாடு'}
              </p>
            </div>
          </div>

          {/* User Controls & Language selectors */}
          <div className="flex items-center space-x-3">
            
            {/* Audio Toggle button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Disable Chime" : "Enable Chime"}
              className="p-2 rounded-full hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5 opacity-60" />}
            </button>

            {/* Bilingual Translation Toggle */}
            <button
              onClick={() => setLanguage(language === Language.ENGLISH ? Language.TAMIL : Language.ENGLISH)}
              className="text-xs font-bold bg-emerald-800 hover:bg-emerald-700 px-3.5 py-2 rounded-xl border border-emerald-700/60 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Languages className="h-3.5 w-3.5 text-emerald-300" />
              <span className="hidden xs:inline">{t('languageToggle', language)}</span>
            </button>

            {/* User details badge */}
            <div className="hidden md:flex items-center space-x-2 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40 text-left">
              <div className="w-7 h-7 bg-emerald-700 rounded-full flex items-center justify-center font-bold text-xs text-yellow-200">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] text-emerald-200/80 font-medium uppercase leading-none block">
                  {user.role === 'passenger' ? t('welcomeBack', language) : 'TNSTC Crew'}
                </span>
                <span className="text-xs font-bold truncate block max-w-[110px]">{user.name}</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-emerald-200 hover:text-red-300 hover:bg-emerald-800 rounded-xl transition-all cursor-pointer"
              title={t('logout', language)}
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Floating live toast alerts wrapper */}
        <AnimatePresence>
          {liveToast && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-18 left-1/2 -translate-x-1/2 z-[3000] w-full max-w-md px-4"
            >
              <div className="bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-emerald-500/30 flex items-start space-x-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg shrink-0 mt-0.5">
                  <Bell className="h-5 w-5 text-emerald-400 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 block font-mono">
                    Live Departure Notification
                  </span>
                  <h4 className="text-xs font-bold mt-0.5">
                    {language === Language.ENGLISH ? liveToast.titleEn : liveToast.titleTa}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {language === Language.ENGLISH ? liveToast.messageEn : liveToast.messageTa}
                  </p>
                </div>
                <button
                  onClick={() => setLiveToast(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Column 1: Map View & Live telemetry (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Main Leaflet Tracker Map */}
          <div className="flex-1 min-h-[420px] lg:min-h-[520px] flex flex-col">
            <MapViewComponent
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={(v) => {
                setSelectedVehicle(v);
                const r = TNSTC_ROUTES.find((route) => route.id === v.routeId) || null;
                setSelectedRoute(r);
              }}
              selectedRoute={selectedRoute}
              language={language}
            />
          </div>

          {/* Quick Saved Commute Shortcuts */}
          {user.savedRoutes.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                <span>{language === Language.ENGLISH ? 'Your Saved Commutes' : 'சேமித்த வழித்தடங்கள்'}</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {user.savedRoutes.map((routeId) => {
                  const r = TNSTC_ROUTES.find((route) => route.id === routeId);
                  if (!r) return null;
                  const isSelected = selectedRoute?.id === r.id;

                  return (
                    <button
                      key={r.id}
                      onClick={() => handleSelectRoute(r)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Bus className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        {r.routeCode}
                      </span>
                      <span className="truncate max-w-[120px]">
                        {language === Language.ENGLISH ? r.destinationEn : r.destinationTa}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Dashboard controls & Alert logs (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Search, Filter, Class selects */}
          <DashboardComponent
            routes={TNSTC_ROUTES}
            selectedRoute={selectedRoute}
            onSelectRoute={handleSelectRoute}
            savedRoutes={user.savedRoutes}
            onToggleSaveRoute={handleToggleSaveRoute}
            language={language}
          />

          {/* Active Bus detailed information & departures timeline */}
          {selectedVehicle ? (
            <BusDetailsComponent
              vehicle={selectedVehicle}
              route={selectedRoute}
              language={language}
              onToggleSubscribe={handleToggleSubscribe}
              isSubscribed={subscribedRoutes.includes(selectedVehicle.routeCode)}
            />
          ) : (
            <div className="bg-white border border-slate-200 p-8 text-center rounded-3xl text-slate-400 shadow-xs flex flex-col items-center justify-center">
              <Bus className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-xs font-semibold">{t('selectBusToTrack', language)}</p>
            </div>
          )}

          {/* Alerts panel & live logs */}
          <NotificationsPanel
            notifications={alerts}
            onClear={handleClearAlert}
            language={language}
          />
        </div>
      </main>

      {/* Platform Disclaimer Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-5 px-4 text-center border-t border-slate-850">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-left">
            <div className="flex items-center space-x-1.5 justify-center md:justify-start">
              <Landmark className="h-4 w-4 text-emerald-500" />
              <span className="font-bold text-slate-200">Tamil Nadu State Transport Corporation (TNSTC)</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Powered by real-time GPS fleet transponders. Authorized for civilian commutation tracking.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 bg-slate-850 px-3 py-1.5 rounded border border-slate-800">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <span>GPS API STREAM STATUS: ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
