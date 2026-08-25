/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  ClipboardList,
  Compass,
  Wallet,
  ArrowRightLeft,
} from 'lucide-react';
import { ItineraryTab } from './components/ItineraryTab';
import { PrepTab } from './components/PrepTab';
import { SplitTab } from './components/SplitTab';
import { CurrencyConverterTab } from './components/CurrencyConverterTab';
import { TRIP_DATA as days } from './data/tripData';
import okinawaHeroCoverImg from './assets/images/okinawa_sky_sea_full_1787144751862.jpg';

type MainTab = 'prep' | 'itinerary' | 'budget' | 'currency';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('prep');
  const [activeDay, setActiveDay] = useState(1);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-[#F4F9FD] flex justify-center selection:bg-sky-200">
      {/* App Container */}
      <div
        id="main-scroll-container"
        className="w-full max-w-lg min-h-screen bg-[#F4F9FD] overflow-y-auto no-scrollbar flex flex-col relative pb-28"
      >
        {/* Top Japanese Magazine Aesthetic Header Area (Only on Itinerary tab) */}
        {activeTab === 'itinerary' && (
          <header className="relative w-full overflow-hidden shrink-0 pt-7 pb-4 px-4 sm:px-5 min-h-[350px] sm:min-h-[380px] flex flex-col justify-between">
            {/* Full Panorama of Sky, Ocean Waves & Cape Cliffs */}
            <div className="absolute inset-0 z-0">
              <img
                src={okinawaHeroCoverImg}
                alt="Okinawa Sky and Sea View"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_32%]"
              />
              {/* Gentle bottom transition to page body without dimming the sky */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F4F9FD] to-transparent" />
            </div>

            {/* Top Magazine Typography Masthead */}
            <div className="relative z-10 text-center mb-6 pt-1">
              {/* Top Eyebrow Guide Tagline */}
              <p className="text-[11px] sm:text-[12px] font-['Arial',sans-serif] leading-[24px] tracking-[0.18em] text-[#ffe61b] font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] mb-0.5 uppercase">
                SAMPRAS OKINAWA TRAVEL GUIDE
              </p>

              {/* Editorial Serif Display Masthead */}
              <h1 className="text-[36px] leading-[54px] font-extrabold tracking-[0.06em] text-white font-['Georgia',serif] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] my-0.5">
                OKINAWA
              </h1>

              {/* Subtitle */}
              <p className="text-[16px] tracking-[0.3em] text-[#fff3f3] font-bold text-center font-['Noto_Serif_TC',serif] my-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                沖 繩　三 天 兩 夜
              </p>

              {/* Date line */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/90 font-medium font-serif tracking-[0.18em] mt-1">
                <span className="w-6 h-[1px] bg-white/60" />
                <span className="text-[16px] text-white font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">10.01 — 10.03</span>
                <span className="w-6 h-[1px] bg-white/60" />
              </div>
            </div>

            {/* Bottom elements of header: Weather & Day Selector */}
            <div className="relative z-10">
              {/* Real-time Destination Weather Strip */}
              <div className="bg-white/90 backdrop-blur-md text-slate-800 rounded-2xl p-3 shadow-sm border border-white/80 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500">
                    <Sun size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">沖繩即時天氣</p>
                    <p className="text-base font-black text-slate-800">那霸市 晴朗陽光</p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 leading-tight">現在氣溫</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Sun size={15} className="text-amber-500 shrink-0" />
                    <span className="text-base font-black text-slate-800 notranslate leading-none" translate="no">
                      {days.find((d) => d.day === activeDay)?.weather.temp.max ?? 28}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Day Quick Selector Pills */}
              <div className="relative z-10 flex gap-2.5 overflow-x-auto no-scrollbar py-1 px-1">
                {days.map((day) => {
                  const isSelected = activeDay === day.day && activeTab === 'itinerary';
                  return (
                    <button
                      key={day.day}
                      onClick={() => {
                        setActiveDay(day.day);
                        setActiveTab('itinerary');
                      }}
                      className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-black transition-all border notranslate shadow-xs ${
                        isSelected
                          ? 'bg-[#ef652d] text-white border-[#ef652d] shadow-md shadow-[#ef652d]/30 scale-105'
                          : 'bg-white/85 text-slate-700 border-white/60 hover:bg-white'
                      }`}
                      translate="no"
                    >
                      <span className="notranslate" translate="no">
                        {day.day === 1 ? '10/1 Day1' : day.day === 2 ? '10/2 Day2' : '10/3 Day3'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </header>
        )}

        {/* Main Content Body */}
        <main className={`flex-1 px-4 sm:px-5 ${activeTab === 'itinerary' ? 'pt-2' : 'pt-5'}`}>
          <AnimatePresence mode="wait">
            {/* 1. ITINERARY TAB */}
            {activeTab === 'itinerary' && (
              <motion.div
                key={`itinerary-${activeDay}`}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                <ItineraryTab activeDay={activeDay} onSelectDay={(d) => setActiveDay(d)} />
              </motion.div>
            )}

            {/* 2. PRE-TRIP PREPARATION TAB */}
            {activeTab === 'prep' && (
              <motion.div
                key="prep"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <PrepTab />
              </motion.div>
            )}

            {/* 3. BUDGET & EXPENSES TAB */}
            {activeTab === 'budget' && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <SplitTab />
              </motion.div>
            )}

            {/* 4. CURRENCY CONVERTER TAB */}
            {activeTab === 'currency' && (
              <motion.div
                key="currency"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <CurrencyConverterTab />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Floating Bottom Circular Dock Menu */}
        <div className="fixed sm:absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[430px] bg-white/95 backdrop-blur-xl border border-sky-100/80 rounded-full shadow-2xl p-1.5 flex items-center justify-around z-50">
          <DockButton
            active={activeTab === 'prep'}
            onClick={() => handleTabChange('prep')}
            icon={<ClipboardList size={18} />}
            label="行前準備"
          />
          <DockButton
            active={activeTab === 'itinerary'}
            onClick={() => handleTabChange('itinerary')}
            icon={<Compass size={18} />}
            label="每日行程"
          />
          <DockButton
            active={activeTab === 'budget'}
            onClick={() => handleTabChange('budget')}
            icon={<Wallet size={18} />}
            label="預算追蹤"
          />
          <DockButton
            active={activeTab === 'currency'}
            onClick={() => handleTabChange('currency')}
            icon={<ArrowRightLeft size={18} />}
            label="匯率換算"
          />
        </div>
      </div>
    </div>
  );
}

function DockButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-1 px-1.5 sm:px-2 rounded-2xl transition-all duration-300 ${
        active ? 'scale-105' : 'opacity-60 hover:opacity-100'
      }`}
    >
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shadow-xs ${
          active
            ? 'bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-sky-500/30'
            : 'bg-slate-100 text-slate-700'
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-[10px] font-black mt-1 leading-none whitespace-nowrap ${
          active ? 'text-sky-700 font-black' : 'text-slate-500'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
