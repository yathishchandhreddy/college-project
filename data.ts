import { BusRoute, BusVehicle, BusStop, AlertNotification } from './types';

// Coordinates for key landmarks in Chennai, Tamil Nadu
export const TAMIL_NADU_BOUNDS = {
  center: { lat: 11.1271, lng: 78.6569 }, // Entire Tamil Nadu focus
  zoom: 7.2,
};

// Raw stops data with coordinates
export const CHENNAI_STOPS: { [id: string]: BusStop } = {
  broadway: { id: 'broadway', nameEn: 'Broadway Terminus', nameTa: 'பிராட்வே முனையம்', lat: 13.0900, lng: 80.2880 },
  central: { id: 'central', nameEn: 'Chennai Central Railway Station', nameTa: 'சென்னை சென்ட்ரல் இரயில் நிலையம்', lat: 13.0827, lng: 80.2707 },
  express_ave: { id: 'express_ave', nameEn: 'Express Avenue (Royapettah)', nameTa: 'எக்ஸ்பிரஸ் அவென்யூ (ராயப்பேட்டை)', lat: 13.0583, lng: 80.2641 },
  mylapore: { id: 'mylapore', nameEn: 'Mylapore Tank', nameTa: 'மயிலாப்பூர் குளம்', lat: 13.0333, lng: 80.2694 },
  adyar: { id: 'adyar', nameEn: 'Adyar Bus Depot', nameTa: 'அடையார் பனிமனை', lat: 13.0063, lng: 80.2574 },
  thiruvanmiyur: { id: 'thiruvanmiyur', nameEn: 'Thiruvanmiyur Bus Stand', nameTa: 'திருவான்மியூர் பேருந்து நிலையம்', lat: 12.9830, lng: 80.2594 },
  sholinganallur: { id: 'sholinganallur', nameEn: 'Sholinganallur Junction', nameTa: 'சோழிங்கநல்லூர் சந்திப்பு', lat: 12.9010, lng: 80.2279 },
  kelambakkam: { id: 'kelambakkam', nameEn: 'Kelambakkam Terminus', nameTa: 'கேளம்பாக்கம் முனையம்', lat: 12.7850, lng: 80.2220 },
  
  cmbt: { id: 'cmbt', nameEn: 'Koyambedu CMBT', nameTa: 'கோயம்பேடு சி.எம்.பி.டி', lat: 13.0674, lng: 80.2057 },
  vadapalani: { id: 'vadapalani', nameEn: 'Vadapalani Temple', nameTa: 'வடபழனி கோவில்', lat: 13.0513, lng: 80.2104 },
  ashok_nagar: { id: 'ashok_nagar', nameEn: 'Ashok Nagar Pillar', nameTa: 'அசோக் நகர் பில்லர்', lat: 13.0354, lng: 80.2124 },
  guindy: { id: 'guindy', nameEn: 'Guindy Kathipara Junction', nameTa: 'கிண்டி கத்திப்பாரா சந்திப்பு', lat: 13.0067, lng: 80.2206 },
  velachery: { id: 'velachery', nameEn: 'Velachery MRTS Station', nameTa: 'வேளச்சேரி பறக்கும் இரயில் நிலையம்', lat: 12.9796, lng: 80.2196 },
  navalur: { id: 'navalur', nameEn: 'Navalur (OMR Toll)', nameTa: 'நாவலூர் (ஓ.எம்.ஆர் சுங்கச்சாவடி)', lat: 12.8465, lng: 80.2255 },
  siruseri: { id: 'siruseri', nameEn: 'Siruseri IT Park', nameTa: 'சிறுசேரி ஐ.டி பூங்கா', lat: 12.8250, lng: 80.2185 },
  
  lic: { id: 'lic', nameEn: 'LIC / Mount Road', nameTa: 'எல்.ஐ.சி / மவுண்ட் ரோடு', lat: 13.0633, lng: 80.2612 },
  teynampet: { id: 'teynampet', nameEn: 'Teynampet DMS', nameTa: 'தேனாம்பேட்டை டி.எம்.எஸ்', lat: 13.0411, lng: 80.2505 },
  saidapet: { id: 'saidapet', nameEn: 'Saidapet Metro', nameTa: 'சைதாப்பேட்டை மெட்ரோ', lat: 13.0203, lng: 80.2286 },
  chromepet: { id: 'chromepet', nameEn: 'Chromepet Bus Stop', nameTa: 'குரோம்பேட்டை பேருந்து நிறுத்தம்', lat: 12.9516, lng: 80.1411 },
  tambaram: { id: 'tambaram', nameEn: 'Tambaram Terminus', nameTa: 'தாம்பரம் முனையம்', lat: 12.9229, lng: 80.1275 }
};

// Defined Routes with stops
export const TNSTC_ROUTES: BusRoute[] = [
  {
    id: 'route_102',
    routeCode: '102',
    originEn: 'Broadway',
    originTa: 'பிராட்வே',
    destinationEn: 'Kelambakkam',
    destinationTa: 'கேளம்பாக்கம்',
    stops: [
      CHENNAI_STOPS.broadway,
      CHENNAI_STOPS.central,
      CHENNAI_STOPS.express_ave,
      CHENNAI_STOPS.mylapore,
      CHENNAI_STOPS.adyar,
      CHENNAI_STOPS.thiruvanmiyur,
      CHENNAI_STOPS.sholinganallur,
      CHENNAI_STOPS.kelambakkam,
    ],
    color: '#0284c7', // Sky Blue - Express / ordinary
    type: 'deluxe',
    fare: 28,
  },
  {
    id: 'route_570',
    routeCode: '570',
    originEn: 'Koyambedu CMBT',
    originTa: 'கோயம்பேடு சி.எம்.பி.டி',
    destinationEn: 'Siruseri IT Park',
    destinationTa: 'சிறுசேரி ஐ.டி பூங்கா',
    stops: [
      CHENNAI_STOPS.cmbt,
      CHENNAI_STOPS.vadapalani,
      CHENNAI_STOPS.ashok_nagar,
      CHENNAI_STOPS.guindy,
      CHENNAI_STOPS.velachery,
      CHENNAI_STOPS.sholinganallur,
      CHENNAI_STOPS.navalur,
      CHENNAI_STOPS.siruseri,
    ],
    color: '#16a34a', // Tamil Nadu green (standard mofussil / green buses)
    type: 'ordinary',
    fare: 15,
  },
  {
    id: 'route_21g',
    routeCode: '21G',
    originEn: 'Broadway',
    originTa: 'பிராட்வே',
    destinationEn: 'Tambaram',
    destinationTa: 'தாம்பரம்',
    stops: [
      CHENNAI_STOPS.broadway,
      CHENNAI_STOPS.central,
      CHENNAI_STOPS.lic,
      CHENNAI_STOPS.teynampet,
      CHENNAI_STOPS.saidapet,
      CHENNAI_STOPS.guindy,
      CHENNAI_STOPS.chromepet,
      CHENNAI_STOPS.tambaram,
    ],
    color: '#dc2626', // Red - Deluxe Deluxe Express
    type: 'air_conditioned',
    fare: 45,
  },
  {
    id: 'route_m51',
    routeCode: 'M51',
    originEn: 'Adyar depot',
    originTa: 'அடையார் பனிமனை',
    destinationEn: 'Tambaram',
    destinationTa: 'தாம்பரம்',
    stops: [
      CHENNAI_STOPS.adyar,
      CHENNAI_STOPS.thiruvanmiyur,
      CHENNAI_STOPS.sholinganallur,
      CHENNAI_STOPS.velachery,
      CHENNAI_STOPS.guindy,
      CHENNAI_STOPS.chromepet,
      CHENNAI_STOPS.tambaram,
    ],
    color: '#d97706', // Yellow/Gold Setc Sleeper
    type: 'sleeper',
    fare: 120,
  }
];

// Initial active vehicles
export const INITIAL_VEHICLES: BusVehicle[] = [
  {
    id: 'v_102_1',
    routeId: 'route_102',
    routeCode: '102',
    vehicleNumber: 'TN-01-N-9821',
    lat: CHENNAI_STOPS.broadway.lat,
    lng: CHENNAI_STOPS.broadway.lng,
    speed: 35,
    heading: 180,
    occupancy: 'medium',
    delayMinutes: 3,
    nextStopId: 'central',
    lastUpdated: new Date().toISOString(),
    driverName: 'K. Muthupandian',
    driverPhone: '98401XXXXX',
    status: 'running',
  },
  {
    id: 'v_570_1',
    routeId: 'route_570',
    routeCode: '570',
    vehicleNumber: 'TN-01-AN-4421',
    lat: CHENNAI_STOPS.cmbt.lat,
    lng: CHENNAI_STOPS.cmbt.lng,
    speed: 40,
    heading: 120,
    occupancy: 'high',
    delayMinutes: -1,
    nextStopId: 'vadapalani',
    lastUpdated: new Date().toISOString(),
    driverName: 'S. Rajendran',
    driverPhone: '94442XXXXX',
    status: 'running',
  },
  {
    id: 'v_21g_1',
    routeId: 'route_21g',
    routeCode: '21G',
    vehicleNumber: 'TN-21-E-0922',
    lat: CHENNAI_STOPS.broadway.lat,
    lng: CHENNAI_STOPS.broadway.lng,
    speed: 25,
    heading: 200,
    occupancy: 'low',
    delayMinutes: 0,
    nextStopId: 'central',
    lastUpdated: new Date().toISOString(),
    driverName: 'M. Selvam',
    driverPhone: '98412XXXXX',
    status: 'running',
  },
  {
    id: 'v_m51_1',
    routeId: 'route_m51',
    routeCode: 'M51',
    vehicleNumber: 'TN-01-B-3331',
    lat: CHENNAI_STOPS.adyar.lat,
    lng: CHENNAI_STOPS.adyar.lng,
    speed: 48,
    heading: 250,
    occupancy: 'medium',
    delayMinutes: 12,
    nextStopId: 'thiruvanmiyur',
    lastUpdated: new Date().toISOString(),
    driverName: 'G. Elango',
    driverPhone: '96001XXXXX',
    status: 'delayed',
  }
];

// Alert Notifications representing actual State updates
export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alert_1',
    titleEn: 'Route Diversion for Purattasi Festival',
    titleTa: 'புரட்டாசி திருவிழாவை முன்னிட்டு வழித்தடம் மாற்றம்',
    messageEn: 'Buses heading towards Mylapore are diverted via Luz Church Road due to local temple festival traffic.',
    messageTa: 'உள்ளூர் கோவில் திருவிழா போக்குவரத்து காரணமாக மயிலாப்பூர் செல்லும் பேருந்துகள் லஸ் சர்ச் ரோடு வழியாக திருப்பி விடப்படுகின்றன.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    type: 'warning',
  },
  {
    id: 'alert_2',
    titleEn: 'New Deluxe AC Bus Service Launched',
    titleTa: 'புதிய சொகுசு ஏசி பேருந்து சேவை அறிமுகம்',
    messageEn: 'TNSTC has launched 15 new modern air-conditioned buses on route 21G with phone charging ports.',
    messageTa: 'அலைபேசி சார்ஜிங் போர்டுகளுடன் கூடிய 15 புதிய அதிநவீன குளிரூட்டப்பட்ட பேருந்துகளை தடம் 21G-இல் அரசு விரைவு போக்குவரத்து கழகம் அறிமுகப்படுத்தியுள்ளது.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    type: 'success',
  }
];

/**
 * Calculates a point along the path of route stops based on a progress decimal [0 - 1]
 * This allows us to animate buses gliding smoothly along their route stops.
 */
export function getPositionAlongRoute(route: BusRoute, progress: number): { lat: number; lng: number; heading: number; nextStopId: string; lastStopId: string } {
  const stops = route.stops;
  if (stops.length < 2) {
    return { lat: stops[0]?.lat || 0, lng: stops[0]?.lng || 0, heading: 0, nextStopId: '', lastStopId: '' };
  }

  // Find segment index
  const numSegments = stops.length - 1;
  const scaledProgress = progress * numSegments;
  const segmentIndex = Math.min(Math.floor(scaledProgress), numSegments - 1);
  const segmentProgress = scaledProgress - segmentIndex;

  const startStop = stops[segmentIndex];
  const endStop = stops[segmentIndex + 1];

  // Interpolate lat/lng
  const lat = startStop.lat + (endStop.lat - startStop.lat) * segmentProgress;
  const lng = startStop.lng + (endStop.lng - startStop.lng) * segmentProgress;

  // Calculate direction (bearing angle in degrees)
  const dy = endStop.lat - startStop.lat;
  const dx = Math.cos((Math.PI * startStop.lat) / 180) * (endStop.lng - startStop.lng);
  let heading = (Math.atan2(dx, dy) * 180) / Math.PI;
  if (heading < 0) heading += 360;

  return {
    lat,
    lng,
    heading,
    nextStopId: endStop.id,
    lastStopId: startStop.id
  };
}

// Translate utility helper
export function t(key: string, lang: 'en' | 'ta'): string {
  const dictionary: { [key: string]: { en: string; ta: string } } = {
    appName: { en: 'TNSTC Bus Tracker', ta: 'TNSTC பேருந்து கண்காணிப்பு' },
    tagline: { en: 'Government of Tamil Nadu • Live Passenger Information System', ta: 'தமிழ்நாடு அரசு • நேரடி பயணிகள் தகவல் சேவை' },
    loginTitle: { en: 'Secure Passenger Portal Login', ta: 'பாதுகாப்பான பயணிகள் உள்நுழைவு' },
    loginDesc: { en: 'Access real-time tracking, live departures, and official TNSTC announcements.', ta: 'நேரடி கண்காணிப்பு, புறப்படும் நேரம் மற்றும் அதிகாரப்பூர்வ அறிவிப்புகளை அணுகவும்.' },
    phoneLabel: { en: 'Mobile Number', ta: 'கைபேசி எண்' },
    phonePlaceholder: { en: 'Enter 10-digit mobile number', ta: '10 இலக்க கைபேசி எண்ணை உள்ளிடவும்' },
    otpLabel: { en: 'One-Time Password (OTP)', ta: 'ஒருமுறை கடவுச்சொல் (OTP)' },
    otpPlaceholder: { en: 'Enter 4-digit OTP code', ta: '4 இலக்க OTP குறியீட்டை உள்ளிடவும்' },
    sendOtp: { en: 'Get OTP via SMS', ta: 'எஸ்எம்எஸ் மூலம் OTP பெறவும்' },
    verifyLogin: { en: 'Verify & Sign In', ta: 'சரிபார்த்து உள்நுழையவும்' },
    otpSentSuccess: { en: 'OTP sent successfully to your mobile number!', ta: 'உங்கள் கைபேசி எண்ணிற்கு OTP வெற்றிகரமாக அனுப்பப்பட்டது!' },
    demoNotice: { en: 'Demo Access: Enter any mobile number. OTP code is "1956" (TNSTC foundation year).', ta: 'மாதிரி அணுகல்: ஏதேனும் கைபேசி எண்ணை உள்ளிடவும். OTP குறியீடு "1956".' },
    welcomeBack: { en: 'Vanakkam, Passenger!', ta: 'வணக்கம், பயணியரே!' },
    dashboard: { en: 'Passenger Dashboard', ta: 'பயணிகள் முகப்பு' },
    mapView: { en: 'Live GPS Fleet Map', ta: 'நேரடி ஜிபிஎஸ் வரைபடம்' },
    searchRoutePlaceholder: { en: 'Search Bus No. (e.g. 102, 570, 21G)...', ta: 'பேருந்து எண் தேடுக (எ.கா. 102, 570, 21G)...' },
    liveBuses: { en: 'Active Fleet Tracking', ta: 'செயலில் உள்ள பேருந்துகள்' },
    routeSchedule: { en: 'Route Schedulers', ta: 'வழித்தட கால அட்டவணை' },
    stopsOnRoute: { en: 'Stops Along This Route', ta: 'இந்த வழித்தடத்திலுள்ள நிறுத்தங்கள்' },
    alerts: { en: 'Live Service Alerts', ta: 'நேரடி சேவை எச்சரிக்கைகள்' },
    occupancy: { en: 'Bus Load / Occupancy', ta: 'பேருந்து இடவசதி அளவு' },
    low: { en: 'Low (Seats Available)', ta: 'குறைவு (இருக்கைகள் உள்ளன)' },
    medium: { en: 'Medium (Standing Space Only)', ta: 'நடுத்தரம் (நின்று செல்லலாம்)' },
    high: { en: 'High (Crowded)', ta: 'அதிகம் (நெருக்கடி)' },
    speed: { en: 'Current Speed', ta: 'தற்போதைய வேகம்' },
    delay: { en: 'Status / Delay', ta: 'நிலைமை / தாமதம்' },
    onTime: { en: 'On Time', ta: 'சரியான நேரம்' },
    minsLate: { en: 'mins late', ta: 'நிமிடங்கள் தாமதம்' },
    minsEarly: { en: 'mins early', ta: 'நிமிடங்கள் முன்னதாக' },
    fare: { en: 'Standard Fare', ta: 'சாதாரண கட்டணம்' },
    busType: { en: 'Bus Type', ta: 'பேருந்து வகை' },
    ordinaryType: { en: 'Ordinary Service (Town Bus)', ta: 'சாதாரண பேருந்து சேவை' },
    deluxeType: { en: 'Deluxe Express', ta: 'டீலக்ஸ் எக்ஸ்பிரஸ்' },
    air_conditionedType: { en: 'Air Conditioned (A/C)', ta: 'குளிரூட்டப்பட்ட சொகுசு பேருந்து' },
    sleeperType: { en: 'SETC AC Sleeper', ta: 'விரைவு படுக்கை வசதி பேருந்து' },
    saveRoute: { en: 'Save Route', ta: 'வழித்தடம் சேமி' },
    savedSuccess: { en: 'Saved to your profile', ta: 'உங்கள் சுயவிவரத்தில் சேமிக்கப்பட்டது' },
    logout: { en: 'Log Out', ta: 'வெளியேறு' },
    departures: { en: 'Live Departure Notifications', ta: 'புறப்படும் நேர நேரடி அறிவிப்புகள்' },
    simulateTitle: { en: 'Live GPS Feeds Simulator', ta: 'நேரடி ஜிபிஎஸ் சிமுலேட்டர்' },
    simulationActive: { en: 'GPS Tracking Active (Simulating real-time transit movement along Chennai OMR & Mount Road routes)', ta: 'ஜிபிஎஸ் கண்காணிப்பு செயலில் உள்ளது (OMR மற்றும் மவுண்ட் ரோடு வழிகளில் இயக்கத்தை சிமுலேட் செய்கிறது)' },
    driverInfo: { en: 'Driver Information', ta: 'ஓட்டுநர் விவரம்' },
    contactDriver: { en: 'SOS Call Crew', ta: 'ஓட்டுநரை அழைக்கவும்' },
    busDetails: { en: 'Bus Details', ta: 'பேருந்து விவரங்கள்' },
    languageToggle: { en: 'தமிழ்', ta: 'English' },
    allRoutes: { en: 'All Available Routes', ta: 'அனைத்து வழித்தடங்கள்' },
    selectBusToTrack: { en: 'Select a bus to center on the map & view departure times', ta: 'வரைபடத்தில் பார்க்கவும் புறப்பாடுகளை கண்காணிக்கவும் பேருந்தைத் தேர்வுசெய்க' },
  };

  return dictionary[key] ? dictionary[key][lang] : key;
}
