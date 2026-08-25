import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, ExternalLink, Star, Sparkles, UtensilsCrossed } from 'lucide-react';
import { OKINAWA_SOUVENIRS } from '../data/tripData';
import { SouvenirCategory } from '../types';

type CategoryFilter = 'ALL' | SouvenirCategory;

const CATEGORY_TABS: { key: CategoryFilter; label: string; icon: string }[] = [
  { key: 'ALL', label: '全部精選', icon: '✨' },
  { key: '熱門伴手禮', label: '伴手禮', icon: '🎁' },
  { key: '在地小吃', label: '在地小吃・甜點', icon: '🍢' },
  { key: '在地飲品', label: '特色飲品', icon: '🍹' },
  { key: '美妝保養', label: '美妝保養', icon: '💄' },
];

export const SouvenirsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');

  const filtered = OKINAWA_SOUVENIRS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.japaneseName && item.japaneseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tag && item.tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.mustTry && item.mustTry.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCat =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} />
              網路熱門激推
            </span>
            <span className="text-[10px] font-bold bg-amber-400/30 text-amber-100 px-2 py-0.5 rounded-full">
              共 {OKINAWA_SOUVENIRS.length} 項精選
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-1">
            沖繩必買伴手禮・小吃・甜點・美妝 🎁🍧
          </h2>
          <p className="text-xs text-pink-100 font-medium leading-relaxed">
            嚴選沖繩熱門伴手禮、在地傳統小吃、海景舒芙蕾甜點、Orion 生啤與必囤藥妝清單！
          </p>
        </div>

        {/* Decorative Graphic circles */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-2 right-4 text-5xl opacity-20 select-none">
          🌺
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋伴手禮、沙翁小吃、舒芙蕾、冰淇淋、藥妝或地點..."
            className="w-full bg-white rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 border border-slate-200/80 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none shadow-sm transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_TABS.map((cat) => {
            const count =
              cat.key === 'ALL'
                ? OKINAWA_SOUVENIRS.length
                : OKINAWA_SOUVENIRS.filter((i) => i.category === cat.key).length;

            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 border shadow-xs ${
                  selectedCategory === cat.key
                    ? 'bg-pink-600 text-white border-pink-600 shadow-pink-500/20 scale-102'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-pink-50/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCategory === cat.key
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-black text-slate-500">
          顯示 <span className="text-pink-600 font-black">{filtered.length}</span> 項推薦
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-[11px] font-bold text-pink-600 hover:underline"
          >
            清除搜尋
          </button>
        )}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.04, 0.4) }}
            className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md border border-slate-100 flex flex-col justify-between group transition-all"
          >
            <div>
              {/* Image & Overlay Badges */}
              <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Pill */}
                {item.category && (
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {item.category}
                  </span>
                )}

                {/* Rating Badge */}
                {item.rating && (
                  <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Star size={12} className="fill-white" />
                    {item.rating.toFixed(1)}
                  </span>
                )}

                {/* Price Estimate */}
                {item.priceEstimate && (
                  <span className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                    {item.priceEstimate}
                  </span>
                )}
              </div>

              {/* Tag Pill if exists */}
              {item.tag && (
                <div className="mb-1.5">
                  <span className="text-xs font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md inline-block">
                    🏷️ {item.tag}
                  </span>
                </div>
              )}

              {/* Title & Japanese Subtitle */}
              <h4 className="font-black text-slate-800 text-base leading-snug mb-0.5">
                {item.name}
              </h4>
              {item.japaneseName && (
                <p className="text-xs text-slate-400 font-medium mb-2">
                  {item.japaneseName}
                </p>
              )}

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-3">
                {item.description}
              </p>

              {/* Must-Try Items Tags */}
              {item.mustTry && item.mustTry.length > 0 && (
                <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <UtensilsCrossed size={12} className="text-amber-500" />
                    必吃必點 / 必買款式
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.mustTry.map((tryItem, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs"
                      >
                        {tryItem}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-1">
              <span className="text-xs text-slate-500 font-bold flex items-center gap-1 truncate">
                <MapPin size={13} className="text-pink-500 shrink-0" />
                <span className="truncate">{item.location || '沖繩在地名店'}</span>
              </span>

              {item.googleMapsUrl && (
                <a
                  href={item.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1.5 rounded-xl transition-colors shrink-0"
                >
                  <span>地圖定位</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

