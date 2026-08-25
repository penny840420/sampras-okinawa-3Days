import { useState } from 'react';
import { motion } from 'motion/react';
import { TRIP_DATA } from '../data/tripData';
import { MapPin, Navigation, Car, ParkingCircle, Fuel, Search, Layers } from 'lucide-react';

export const MapTab = ({ activeDay }: { activeDay: number }) => {
  const [layers, setLayers] = useState({ spots: true, parking: false, fuel: false });
  const day = TRIP_DATA.find(d => d.day === activeDay);

  if (!day) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-4 h-full flex flex-col pt-2"
    >
      {/* Map Control Bar */}
      <div className="flex gap-2 shrink-0">
         <div className="flex-1 bg-white rounded-2xl p-2 sketch-border flex items-center gap-2">
            <Search size={16} className="opacity-30" />
            <input type="text" placeholder="搜尋景點..." className="bg-transparent text-xs font-bold w-full outline-none" />
         </div>
         <button className="bg-white rounded-2xl p-2 sketch-border">
            <Layers size={16} />
         </button>
      </div>

      {/* Simulated Map Area */}
      <div className="flex-1 bg-brand-bg rounded-[32px] sketch-border relative overflow-hidden bg-grid-paper">
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-brand-black/5 text-xl font-black rotate-[-15deg] select-none uppercase tracking-[1em] whitespace-nowrap">
               KYUSHU ROAD TRIP
            </div>
         </div>

         {/* Map Pins */}
         {day.spots.map((spot, idx) => (
           <motion.div
             key={spot.id}
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: idx * 0.1 }}
             style={{ 
               top: `${20 + (idx * 12)}%`, 
               left: `${15 + (idx * 15)}%` 
             }}
             className="absolute cursor-pointer flex flex-col items-center group"
           >
              <div className="bg-white px-2 py-1 sketch-border rounded-lg text-[8px] font-black mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hard-shadow-black">
                  {spot.name}
              </div>
              <div className="bg-brand-black text-white w-6 h-6 rounded-full flex items-center justify-center sketch-border border-white shadow-sm scale-100 active:scale-90 transition-transform">
                 <MapPin size={12} strokeWidth={3} />
              </div>
           </motion.div>
         ))}

         {/* Current Position Marker */}
         <div className="absolute bottom-1/3 right-1/4">
            <div className="relative">
               <div className="absolute inset-0 bg-brand-sage rounded-full animate-ping opacity-25" />
               <div className="relative bg-brand-sage w-3 h-3 rounded-full border border-white shadow-sm" />
            </div>
         </div>

         {/* Layer Controls */}
         <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <button 
              onClick={() => setLayers(l => ({...l, parking: !l.parking}))}
              className={`flex-1 p-2 rounded-xl text-[8px] font-black border transition-all ${layers.parking ? 'bg-brand-black text-white border-brand-black' : 'bg-white text-brand-black border-brand-black/10 shadow-sm'}`}
            >
              🅿️ 停車場
            </button>
            <button 
              onClick={() => setLayers(l => ({...l, fuel: !l.fuel}))}
              className={`flex-1 p-2 rounded-xl text-[8px] font-black border transition-all ${layers.fuel ? 'bg-brand-black text-white border-brand-black' : 'bg-white text-brand-black border-brand-black/10 shadow-sm'}`}
            >
              ⛽ 加油站
            </button>
         </div>
      </div>

      {/* Navigation Info Card */}
      <div className="bg-white rounded-3xl p-4 sketch-border flex items-center gap-3 relative mb-2">
         <div className="absolute -top-1 -left-1 w-6 h-6 bg-brand-yellow/30 sketch-border rotate-[-10deg] -z-10" />
         <div className="bg-brand-peach w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-brand-black/10 stamp-skew-left">
            <Car size={24} className="text-brand-black" />
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-[8px] font-black text-brand-black/40 uppercase tracking-widest mb-1">正在前往</p>
            <h4 className="font-bold text-xs truncate leading-tight">{day.spots[1]?.name || '目的地'}</h4>
         </div>
         <button className="bg-brand-black text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md active:translate-y-0.5 transition-all">
            <Navigation size={18} />
         </button>
      </div>
    </motion.div>
  );
};
