import { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, MapPin, Navigation, Store } from 'lucide-react';
import { HIGHLIGHT_CARDS } from '../data/tripData';
import { AmericanVillageModal } from './AmericanVillageModal';

type FilterType = 'all' | 'beach' | 'food' | 'drive' | 'shopping' | 'team';

const FILTER_BUTTONS: { type: FilterType; label: string; emoji: string }[] = [
  { type: 'all', label: '全部精選', emoji: '🌴' },
  { type: 'beach', label: '蔚藍海洋', emoji: '🌊' },
  { type: 'food', label: '琉球美食', emoji: '🍜' },
  { type: 'drive', label: '絕景自駕', emoji: '🚗' },
  { type: 'shopping', label: '購物商場', emoji: '🛍️' },
  { type: 'team', label: '團體活動', emoji: '🎉' },
];

export const ThemeHighlights = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isAVModalOpen, setIsAVModalOpen] = useState(false);

  const filteredCards =
    activeFilter === 'all'
      ? HIGHLIGHT_CARDS
      : HIGHLIGHT_CARDS.filter((c) => c.category === activeFilter);

  return (
    <section className="mb-8">
      {/* American Village Modal */}
      <AmericanVillageModal
        isOpen={isAVModalOpen}
        onClose={() => setIsAVModalOpen(false)}
      />

      {/* Section Header (취향척척 style with cute icon & title) */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[11px] font-black mb-1.5 shadow-sm">
          <Sparkles size={12} className="text-amber-500" />
          <span>主題精選推薦</span>
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          沖繩玩法・各得其所 <span className="text-base">🌺</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          依照海灘、美食、自駕與團體活動，探索最精彩的沖繩島嶼風情
        </p>
      </div>

      {/* Pill Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 px-1 mb-2">
        {FILTER_BUTTONS.map((btn) => {
          const isActive = activeFilter === btn.type;
          return (
            <button
              key={btn.type}
              onClick={() => setActiveFilter(btn.type)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all border shadow-sm ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sky-500/20 scale-105'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              <span>{btn.emoji}</span>
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Cards Carousel */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1">
        {filteredCards.map((card, idx) => {
          const isAmericanVillage = card.title.includes('美國村') || card.id === 'hl-2';

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={isAmericanVillage ? () => setIsAVModalOpen(true) : undefined}
              className={`shrink-0 w-[200px] sm:w-[220px] bg-white rounded-3xl overflow-hidden border shadow-md hover:shadow-xl transition-all flex flex-col group ${
                isAmericanVillage
                  ? 'border-sky-300 ring-2 ring-sky-400/20 cursor-pointer'
                  : 'border-sky-100/80'
              }`}
            >
              {/* Image Box */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[12px] font-bold px-2.5 py-0.5 rounded-full">
                  {card.tag}
                </span>
                {isAmericanVillage && (
                  <span className="absolute bottom-2 right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                    <Store size={10} />
                    <span>點擊看店家</span>
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[12px] font-bold text-sky-600 flex items-center gap-1 mb-1">
                    <MapPin size={12} /> {card.location}
                  </span>
                  <h4 className="font-black text-slate-800 text-sm leading-tight line-clamp-1 mb-1.5">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  {isAmericanVillage ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAVModalOpen(true);
                      }}
                      className="text-[10px] font-black text-amber-600 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg"
                    >
                      🏬 店家清單
                    </button>
                  ) : card.mapCode ? (
                    <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      MC: {card.mapCode.split('*')[0]}
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400">熱門推薦</span>
                  )}
                  <a
                    href={card.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[10px] font-black text-sky-600 hover:text-sky-700 bg-sky-50 px-2 py-1 rounded-lg"
                  >
                    <Navigation size={10} />
                    <span>導航</span>
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
