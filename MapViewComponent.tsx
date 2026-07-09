import { useEffect, useRef } from 'react';
import { BusVehicle, BusRoute, BusStop, Language } from '../types';
import { Landmark, Compass, Eye } from 'lucide-react';
import { t } from '../data';

// Import Leaflet dynamically to avoid server-side render issues if any,
// but since we are client-only React SPA, we can import standard Leaflet
import L from 'leaflet';

interface MapViewComponentProps {
  vehicles: BusVehicle[];
  selectedVehicle: BusVehicle | null;
  onSelectVehicle: (v: BusVehicle) => void;
  selectedRoute: BusRoute | null;
  language: Language;
}

export default function MapViewComponent({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  selectedRoute,
  language,
}: MapViewComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  
  // Keep track of markers to update them instead of redrawing the map entirely
  const stopMarkersRef = useRef<{ [id: string]: L.Marker }>({});
  const busMarkersRef = useRef<{ [id: string]: L.Marker }>({});

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center map around Tamil Nadu state initially
    const map = L.map(mapContainerRef.current, {
      center: [11.1271, 78.6569],
      zoom: 7.2,
      zoomControl: false, // We'll put custom zoom controls or standard position
    });

    // Add clean tiles (OpenStreetMap Positron style / standard OSM)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 20,
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Center/Fly-to Selected Bus
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedVehicle) return;

    map.flyTo([selectedVehicle.lat, selectedVehicle.lng], 13, {
      animate: true,
      duration: 1.2,
    });
  }, [selectedVehicle]);

  // 3. Draw Route Polylines and Stop Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous stops
    Object.keys(stopMarkersRef.current).forEach((key) => {
      stopMarkersRef.current[key]?.remove();
    });
    stopMarkersRef.current = {};

    // Clear previous polyline
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (!selectedRoute) return;

    // Draw Polyline
    const points = selectedRoute.stops.map((stop) => [stop.lat, stop.lng] as L.LatLngTuple);
    const polyline = L.polyline(points, {
      color: selectedRoute.color || '#10b981',
      weight: 5,
      opacity: 0.8,
      dashArray: selectedRoute.type === 'air_conditioned' ? '1, 10' : undefined,
    }).addTo(map);

    routePolylineRef.current = polyline;

    // Fit map bounds to show whole route if no vehicle is selected
    if (!selectedVehicle) {
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }

    // Add Stop Markers using elegant HTML DivIcon
    selectedRoute.stops.forEach((stop, index) => {
      const isOrigin = index === 0;
      const isDestination = index === selectedRoute.stops.length - 1;
      const label = isOrigin ? 'A' : isDestination ? 'B' : `${index + 1}`;
      const name = language === Language.ENGLISH ? stop.nameEn : stop.nameTa;

      const stopHtml = `
        <div class="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-md text-[10px] font-bold ${
          isOrigin ? 'bg-emerald-600 text-white' : isDestination ? 'bg-red-600 text-white' : 'bg-white text-slate-800'
        }">
          ${label}
        </div>
      `;

      const stopIcon = L.divIcon({
        html: stopHtml,
        className: 'custom-stop-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans">
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              ${isOrigin ? 'Origin' : isDestination ? 'Destination' : 'Bus Stop ' + index}
            </div>
            <div class="text-xs font-bold text-slate-800 mt-0.5">${name}</div>
          </div>
        `, { closeButton: false });

      stopMarkersRef.current[stop.id] = marker;
    });

  }, [selectedRoute, language]);

  // 4. Draw & Update Real-time Bus Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Track active vehicles IDs in this tick
    const activeVehicleIds = new Set(vehicles.map((v) => v.id));

    // Clear removed vehicles
    Object.keys(busMarkersRef.current).forEach((id) => {
      if (!activeVehicleIds.has(id)) {
        busMarkersRef.current[id].remove();
        delete busMarkersRef.current[id];
      }
    });

    // Add or update bus markers
    vehicles.forEach((vehicle) => {
      const isSelected = selectedVehicle?.id === vehicle.id;
      const route = selectedRoute?.id === vehicle.routeId;
      const heading = vehicle.heading || 0;

      // HTML template for the rotating live bus marker using Tailwind
      const busHtml = `
        <div class="relative flex items-center justify-center">
          <!-- Pulse Wave for active GPS signal -->
          <span class="absolute w-10 h-10 rounded-full bg-emerald-500/30 animate-ping -z-10 ${isSelected ? 'opacity-100' : 'opacity-0'}"></span>
          
          <!-- Outer Container -->
          <div class="w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${
            isSelected 
              ? 'bg-emerald-600 text-white border-yellow-400 scale-110 z-[1000]' 
              : 'bg-white text-emerald-800 border-emerald-500 hover:scale-105 z-[900]'
          }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" style="transform: rotate(${heading}deg); transition: transform 0.3s ease;">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h1" />
              <circle cx="16" cy="18" r="2" />
              <circle cx="8" cy="18" r="2" />
            </svg>
            
            <!-- Small badge showing Route Code -->
            <span class="absolute -top-2 bg-slate-900 text-white font-mono text-[9px] font-extrabold px-1 py-0.25 rounded border border-slate-700 shadow-sm leading-none">
              ${vehicle.routeCode}
            </span>
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        html: busHtml,
        className: 'custom-bus-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      if (busMarkersRef.current[vehicle.id]) {
        // Update position and icon
        const existingMarker = busMarkersRef.current[vehicle.id];
        existingMarker.setLatLng([vehicle.lat, vehicle.lng]);
        existingMarker.setIcon(busIcon);
      } else {
        // Create new marker
        const marker = L.marker([vehicle.lat, vehicle.lng], { icon: busIcon })
          .addTo(map)
          .on('click', () => {
            onSelectVehicle(vehicle);
          });
        busMarkersRef.current[vehicle.id] = marker;
      }
    });

  }, [vehicles, selectedVehicle, selectedRoute]);

  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-[480px] rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
      {/* Absolute Header Overlay showing map status */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xs border border-slate-100 flex items-center space-x-2">
        <span className="w-2.5 h-2.5 bg-[#006400] rounded-full animate-pulse shrink-0"></span>
        <span className="text-xs font-bold text-slate-700">
          {t('simulationActive', language)}
        </span>
      </div>

      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ height: '100%', minHeight: '400px' }}></div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xs border border-slate-100 text-[10px] space-y-1.5 text-slate-700 font-bold">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-emerald-600 rounded-full border border-white shadow-xs"></span>
          <span>{language === Language.ENGLISH ? 'Origin Stop' : 'தொடக்க நிறுத்தம்'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-600 rounded-full border border-white shadow-xs"></span>
          <span>{language === Language.ENGLISH ? 'Destination Stop' : 'இறுதி நிறுத்தம்'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-white rounded-full border-2 border-slate-400 shadow-xs"></span>
          <span>{language === Language.ENGLISH ? 'Intermediary Stop' : 'இடை நிறுத்தம்'}</span>
        </div>
      </div>
    </div>
  );
}
