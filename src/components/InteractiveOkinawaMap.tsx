import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Eye, Phone, Clock, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { MAP_POINTS } from '../data/tripData';
import { MapPoint } from '../types';

export const InteractiveOkinawaMap = () => {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint>(MAP_POINTS[0]);
  const [selectedArea, setSelectedArea] = useState<'ALL' | '北部' | '中部' | '南部' | '那霸'>('ALL');

  const filteredPoints =
    selectedArea === 'ALL'
      ? MAP_POINTS
      : MAP_POINTS.filter((p) => p.area === selectedArea);

  return (
    <section className="mb-8">
      {/* Header (생생VR style) */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-black mb-1.5 shadow-sm">
          <Eye size={12} className="text-emerald-600" />
          <span>沖繩全島・互動探險地圖</span>
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          沖繩景點生動導覽 <span className="text-base">🗺️</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          點選地圖地標，即刻預覽北中南部核心景點、營業時間與導航路線
        </p>
      </div>

      {/* Area Filter Tabs */}
      <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
        {(['ALL', '北部', '中部', '南部', '那霸'] as const).map((area) => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
              selectedArea === area
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white text-slate-600 hover:bg-emerald-50'
            }`}
          >
            {area === 'ALL' ? '🌴 全島' : area}
          </button>
        ))}
      </div>

      {/* Map + Card Container */}
      <div className="relative bg-gradient-to-b from-sky-50 via-teal-50/40 to-emerald-50/60 rounded-[32px] p-4 sm:p-6 border-2 border-white shadow-lg overflow-hidden">
        {/* Background Island Contour Illustration */}
        <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#dcfce7]/30 border border-emerald-200/50 flex flex-col justify-between p-3">
          {/* Watermark & Ocean Details */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <span className="text-4xl sm:text-5xl font-black tracking-widest text-emerald-900 rotate-[-25deg]">
              OKINAWA ISLAND
            </span>
          </div>

          {/* Stylized Island SVG Backdrop */}
          <svg
            className="absolute inset-0 w-full h-full text-emerald-200/70"
            viewBox="0 0 300 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* North peninsula */}
            <path
              d="M120 40 C140 20, 190 30, 180 70 C175 90, 150 95, 140 120 C130 145, 145 180, 120 220 C100 250, 90 280, 80 320 C70 350, 95 380, 70 380 C50 380, 45 340, 55 300 C65 260, 85 220, 95 180 C105 140, 90 100, 100 70 Z"
              fill="currentColor"
              opacity="0.6"
            />
            {/* Motobu Peninsula */}
            <path
              d="M100 65 C80 50, 60 70, 70 95 C80 110, 110 105, 120 90 Z"
              fill="currentColor"
              opacity="0.8"
            />
            {/* Kouri Island */}
            <circle cx="165" cy="45" r="12" fill="currentColor" opacity="0.9" />
          </svg>

          {/* Area Labels on Map */}
          <div className="absolute top-8 right-6 text-[11px] font-black text-emerald-800 bg-white/80 px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
            【北部】名護・美麗海
          </div>
          <div className="absolute top-44 right-8 text-[11px] font-black text-teal-800 bg-white/80 px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
            【中部】恩納・美國村
          </div>
          <div className="absolute bottom-20 left-4 text-[11px] font-black text-sky-800 bg-white/80 px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
            【南部/那霸】國際通・波上宮
          </div>

          {/* Pin Markers */}
          {filteredPoints.map((point) => {
            const isSelected = selectedPoint.id === point.id;
            return (
              <div
                key={point.id}
                style={{
                  top: `${point.coords.y}%`,
                  left: `${point.coords.x}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                onClick={() => setSelectedPoint(point)}
              >
                {/* Ripple Animation */}
                {isSelected && (
                  <div className="absolute -inset-2 rounded-full bg-emerald-500/40 map-pin-ripple" />
                )}

                {/* Pin Circle */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg transition-all border-2 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-white scale-110'
                      : 'bg-white text-emerald-700 border-emerald-500 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  <MapPin size={14} strokeWidth={2.5} />
                </motion.div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md z-30 pointer-events-none">
                  {point.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Destination Detail Card (Matching image.png live popup preview) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPoint.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-4 bg-white rounded-2xl p-4 shadow-md border border-slate-100 flex flex-col sm:flex-row gap-4 items-center"
          >
            {/* Thumbnail */}
            <div className="w-full sm:w-28 h-28 sm:h-28 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
              <img
                src={selectedPoint.image}
                alt={selectedPoint.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                {selectedPoint.area}
              </span>
            </div>

            {/* Info details */}
            <div className="flex-1 min-w-0 w-full text-left">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-black text-slate-800 text-base truncate">
                  {selectedPoint.name}
                </h4>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                  {selectedPoint.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mb-1.5">
                {selectedPoint.japaneseName}
              </p>

              <div className="space-y-1 text-xs text-slate-600 font-medium">
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin size={12} className="text-emerald-600 shrink-0" />
                  <span className="truncate">{selectedPoint.address}</span>
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <Clock size={12} className="text-amber-500 shrink-0" />
                  <span>{selectedPoint.openHours}</span>
                </p>
                {selectedPoint.mapCode && (
                  <p className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                    MapCode: {selectedPoint.mapCode}
                  </p>
                )}
              </div>

              {/* Action Buttons: 導航 + 360°/景點官網 (Matching image.png VR button) */}
              <div className="mt-3 flex gap-2">
                <a
                  href={selectedPoint.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Navigation size={13} />
                  <span>Google 地圖導航</span>
                </a>

                {selectedPoint.vrUrl && (
                  <a
                    href={selectedPoint.vrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-teal-500 hover:bg-teal-600 text-white font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Eye size={13} />
                    <span>360° 景觀</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
