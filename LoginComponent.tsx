import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, KeyRound, Languages, ArrowRight, Bus, Landmark } from 'lucide-react';
import { Language, User } from '../types';
import { t } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface LoginComponentProps {
  onLogin: (user: User) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LoginComponent({ onLogin, language, setLanguage }: LoginComponentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [role, setRole] = useState<'passenger' | 'driver' | 'admin'>('passenger');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Validate inputs
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phoneNumber.length < 10 || !/^\d+$/.test(phoneNumber)) {
      setError(language === Language.ENGLISH ? 'Please enter a valid 10-digit mobile number' : 'தயவுசெய்து சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setSuccessMsg(t('otpSentSuccess', language));
      // Auto-clear success message
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== '1956') {
      setError(language === Language.ENGLISH ? 'Invalid OTP. For demo purposes, use OTP code: 1956' : 'தவறான OTP. டெமோ பயன்பாட்டிற்கு "1956" குறியீட்டை பயன்படுத்தவும்');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const generatedUser: User = {
        id: `usr_${Date.now()}`,
        phoneNumber,
        name: name.trim() || (language === Language.ENGLISH ? 'Passenger' : 'பயணி'),
        role,
        savedRoutes: [],
        savedStops: [],
        language,
      };
      
      // Save user login session to local storage
      localStorage.setItem('tnstc_user_session', JSON.stringify(generatedUser));
      onLogin(generatedUser);
    }, 1200);
  };

  return (
    <div id="login_container" className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Top Bar with Language Selector */}
      <header className="w-full max-w-7xl mx-auto px-4 py-3 flex justify-between items-center bg-transparent">
        <div className="flex items-center space-x-2">
          <Landmark className="h-6 w-6 text-emerald-700" />
          <span className="text-xs font-semibold tracking-wider text-slate-500 font-mono uppercase">
            Govt. of Tamil Nadu • போக்குவரத்துத் துறை
          </span>
        </div>
        <button
          onClick={() => setLanguage(language === Language.ENGLISH ? Language.TAMIL : Language.ENGLISH)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-emerald-200 bg-white hover:bg-emerald-50 text-xs font-medium text-emerald-800 transition-colors shadow-xs cursor-pointer"
        >
          <Languages className="h-3.5 w-3.5 text-emerald-600" />
          <span>{t('languageToggle', language)}</span>
        </button>
      </header>

      {/* Main Login Card Wrapper */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header Section with TN Gov Logo Emblem Representation */}
          <div className="bg-[#006400] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/40 via-emerald-850/80 to-[#004D00] opacity-95"></div>
            
            {/* Srivilliputhur Temple Tower Emblem Representation */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 mb-3 shadow-inner">
                {/* Visual depiction of Tamil Nadu logo / bus tracker */}
                <svg className="w-12 h-12 text-yellow-300" viewBox="0 0 100 100" fill="currentColor">
                  {/* Temple Tower (Gopuram) Outline */}
                  <path d="M50 15 L62 40 L60 40 L50 20 L40 40 L38 40 Z" />
                  <path d="M50 30 L67 60 L65 60 L50 35 L35 60 L33 60 Z" />
                  <path d="M50 45 L72 80 L28 80 Z" />
                  <rect x="44" y="80" width="12" height="10" fill="white" />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">{t('appName', language)}</h1>
              <p className="text-[11px] text-emerald-100/90 font-medium tracking-wide mt-1 uppercase">
                {t('tagline', language)}
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6">
            <div className="flex justify-center space-x-1 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                onClick={() => setRole('passenger')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  role === 'passenger'
                    ? 'bg-white text-[#006400] shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === Language.ENGLISH ? 'Passenger / commuter' : 'பயணிகள் / பொது மக்கள்'}
              </button>
              <button
                onClick={() => setRole('driver')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  role === 'driver'
                    ? 'bg-white text-[#006400] shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === Language.ENGLISH ? 'Driver / Crew' : 'ஓட்டுநர் / நடத்துனர்'}
              </button>
            </div>

            <div className="mb-4 text-center">
              <h2 className="text-base font-semibold text-slate-900">{t('loginTitle', language)}</h2>
              <p className="text-xs text-slate-500 mt-1">{t('loginDesc', language)}</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100"
                >
                  {error}
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 mb-4 rounded-xl bg-emerald-50 text-[#006400] text-xs font-medium border border-emerald-100"
                >
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!isOtpSent ? (
                /* STEP 1: MOBILE NUMBER ENTRY */
                <motion.form
                  key="phone-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {language === Language.ENGLISH ? 'Full Name (Optional)' : 'முழு பெயர் (விருப்பத்திற்குரியது)'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === Language.ENGLISH ? 'Enter your name' : 'உங்கள் பெயரை உள்ளிடவும்'}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('phoneLabel', language)} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder={t('phonePlaceholder', language)}
                        required
                        className="w-full pl-12 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] text-sm tracking-wide"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#006400] hover:bg-[#005000] text-white font-semibold text-sm py-3 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>{t('sendOtp', language)}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                /* STEP 2: OTP VERIFICATION */
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 font-mono">
                      {t('phoneLabel', language)}: <span className="text-slate-800 font-bold">+91 {phoneNumber}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="text-xs text-[#006400] hover:underline font-semibold"
                    >
                      {language === Language.ENGLISH ? 'Edit mobile number' : 'கைபேசி எண்ணை மாற்றுக'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('otpLabel', language)} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="password"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder={t('otpPlaceholder', language)}
                        required
                        className="w-full pl-11 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006400]/20 focus:border-[#006400] text-sm tracking-widest font-mono text-center font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#006400] hover:bg-[#005000] text-white font-semibold text-sm py-3 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>{t('verifyLogin', language)}</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Demo Notice footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-start space-x-2.5 text-[11px] text-slate-600 bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-50">
              <ShieldCheck className="h-4.5 w-4.5 text-[#006400] shrink-0 mt-0.5" />
              <span>
                <strong>{t('demoNotice', language)}</strong>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Government Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        <p>© 2026 Tamil Nadu State Transport Corporation (TNSTC) Ltd. All Rights Reserved.</p>
        <p className="mt-0.5 text-[10px]">Ministry of Transport, Government of Tamil Nadu, India.</p>
      </footer>
    </div>
  );
}
