import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Clock,
  Navigation,
  Camera,
  Car,
  Utensils,
  Star,
  ShoppingBag,
  Home,
  Sun,
  CloudRain,
  Cloud,
  Sparkles,
  Receipt,
  Store,
  ChevronRight,
} from 'lucide-react';
import { SpotCategory } from '../types';
import { TRIP_DATA as days } from '../data/tripData';
import { AmericanVillageModal } from './AmericanVillageModal';

const categoryIcons: Record<SpotCategory, any> = {
  food: Utensils,
  activity: Star,
  shopping: ShoppingBag,
  scenery: Camera,
  hotel: Home,
  transport: Car,
};

const categoryBadgeStyle: Record<SpotCategory, { bg: string; text: string; label: string }> = {
  food: { bg: 'bg-amber-100', text: 'text-amber-700', label: '美食饗宴' },
  activity: { bg: 'bg-sky-100', text: 'text-sky-700', label: '活動體驗' },
  shopping: { bg: 'bg-purple-100', text: 'text-purple-700', label: '購物採買' },
  scenery: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '自然景觀' },
  hotel: { bg: 'bg-blue-100', text: 'text-blue-700', label: '住宿飯店' },
  transport: { bg: 'bg-slate-100', text: 'text-slate-700', label: '交通移動' },
};

export const ItineraryTab = ({
  activeDay,
}: {
  activeDay: number;
  onSelectDay?: (d: number) => void;
}) => {
  const [isAVModalOpen, setIsAVModalOpen] = useState(false);
  const day = days.find((d) => d.day === activeDay) || days[0];

  return (
    <div className="space-y-6 pb-6">
      {/* American Village Shop List Popup Modal */}
      <AmericanVillageModal
        isOpen={isAVModalOpen}
        onClose={() => setIsAVModalOpen(false)}
      />

      {/* Day Overview Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-sky-100 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
              <span className="text-[10px] opacity-80 leading-none">DAY</span>
              <span className="text-lg leading-none notranslate" translate="no">{day.day}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-sky-600 tracking-wider">
                {day.date}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-snug">
                {day.city}
              </h2>
            </div>
          </div>
        </div>

        {/* Hourly weather bar */}
        {day.weather.hourly && (
          <div className="mb-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-3 px-1">
              {day.weather.hourly.map((wh, idx) => (
                <div key={idx} className="flex flex-col items-center shrink-0">
                  <span className="text-xs text-slate-500 font-bold mb-1">{wh.hour}</span>
                  {wh.condition === '晴' && <Sun size={16} className="text-amber-500" />}
                  {wh.condition === '雨' && <CloudRain size={16} className="text-sky-500" />}
                  {wh.condition === '陰' && <Cloud size={16} className="text-slate-500" />}
                  <span className="text-xs font-black text-slate-800 mt-1 notranslate" translate="no">
                    {wh.temp}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick summary stats */}
        <div className="flex items-center justify-between text-sm font-normal text-slate-600 bg-slate-50 p-3 rounded-2xl">
          <span className="flex items-center gap-1.5 font-normal">
            <MapPin size={15} className="text-sky-500" />
            <span>總景點：{day.spots.length}</span>
          </span>
          <span className="flex items-center gap-1.5 font-normal">
            <Car size={15} className="text-sky-500" />
            <span>預估移動：{day.summary.travelTime.replace('自駕 / ', '')}</span>
          </span>
        </div>
      </div>

      {/* Timeline Spots List */}
      <div className="space-y-4">
        {day.spots.map((spot, idx) => {
          const Icon = categoryIcons[spot.category] || Star;
          const badge = categoryBadgeStyle[spot.category] || categoryBadgeStyle.activity;
          const isAmericanVillage = spot.id === 'd1-5' || spot.name.includes('美國村');

          return (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={isAmericanVillage ? () => setIsAVModalOpen(true) : undefined}
              className={`bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all group ${
                isAmericanVillage ? 'cursor-pointer hover:border-sky-200' : ''
              }`}
            >
              {/* Header: Time, Category Badge, Title */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {spot.time && (
                    <span className="text-[#0090d3] text-sm font-bold font-['Noto_Sans_TC',sans-serif] flex items-center gap-1.5">
                      <Clock size={13} className="text-[#0090d3]" />
                      <span>{spot.time}</span>
                    </span>
                  )}
                  <span
                    className={`text-[12px] font-black px-2.5 py-0.5 rounded-md ${badge.bg} ${badge.text}`}
                  >
                    {badge.label}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-sky-50 flex items-center justify-center text-slate-600 group-hover:text-sky-600 transition-colors shrink-0">
                  <Icon size={14} />
                </div>
              </div>

              {/* Title, Description & Side Photo */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-slate-800 leading-snug mb-1.5">
                    {spot.name}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {spot.description}
                  </p>
                </div>
                {spot.image && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-xs border border-slate-100 shrink-0 group/img relative">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                    />
                  </div>
                )}
              </div>

              {/* Budget / Cost Badge */}
              {spot.budget && (
                <div className="mb-3 inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 shadow-xs flex-wrap">
                  <span className="flex items-center gap-1 text-amber-700 font-black shrink-0 text-xs">
                    <Receipt size={14} />
                    <span>預算：</span>
                  </span>
                  {typeof spot.budget === 'object' ? (
                    <div className="flex items-center gap-2 flex-wrap font-mono">
                      {spot.budget.unitPriceTwd && (
                        <span className="text-slate-700 bg-white/95 px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs text-xs font-bold whitespace-nowrap">
                          單價 NT$ {typeof spot.budget.unitPriceTwd === 'number' ? spot.budget.unitPriceTwd.toLocaleString() : spot.budget.unitPriceTwd}/人 (¥{typeof spot.budget.unitPriceJpy === 'number' ? spot.budget.unitPriceJpy.toLocaleString() : spot.budget.unitPriceJpy}/人)
                        </span>
                      )}
                      <div className="inline-flex items-center gap-2 bg-white/95 px-2.5 py-1 rounded-md border border-amber-200/90 shadow-2xs text-xs whitespace-nowrap">
                        <span className="text-[#973c00] font-bold text-xs">
                          總計台幣 NT$ {typeof spot.budget.twd === 'number' ? spot.budget.twd.toLocaleString() : spot.budget.twd}
                        </span>
                        <span className="text-slate-300 font-normal">|</span>
                        <span className="text-[#973c00] font-bold text-xs">
                          總計日幣 ¥{typeof spot.budget.jpy === 'number' ? spot.budget.jpy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : spot.budget.jpy}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-bold">{spot.budget}</span>
                  )}
                </div>
              )}

              {/* Tips */}
              {spot.tips && spot.tips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {spot.tips.map((tip, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[12px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100/60"
                    >
                      {tip}
                    </span>
                  ))}
                </div>
              )}

              {/* Navigation Action Button & American Village Custom Shops */}
              <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between gap-2 flex-wrap">
                {spot.googleMapsUrl && (
                  <a
                    href={spot.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <Navigation size={13} />
                    <span>Google 導航</span>
                  </a>
                )}

                {isAmericanVillage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAVModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#ef652d] hover:bg-[#de561f] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <Store size={13} />
                    <span>查看 / 新增想逛店家</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Outfit Advice Card */}
      {day.outfitAdvice && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <Sparkles size={18} />
            <h4 className="text-base font-black text-slate-700">
              穿搭與出行建議
            </h4>
          </div>
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {day.outfitAdvice}
          </p>
        </div>
      )}
    </div>
  );
};
