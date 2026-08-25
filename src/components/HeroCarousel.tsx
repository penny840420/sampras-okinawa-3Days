import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, MapPin, Star, ExternalLink } from 'lucide-react';
import { HERO_SLIDES } from '../data/tripData';

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = HERO_SLIDES.length;

  // Auto slide every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [total]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const current = HERO_SLIDES[currentIndex];

  return (
    <div className="relative w-full mb-6">
      {/* Main Hero Card */}
      <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-white shadow-xl shadow-sky-900/10 border-2 border-white/80 group">
        {/* Photo Canvas */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Top Tag Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="bg-sky-500/90 text-white backdrop-blur-md text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/30">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              {current.tag}
            </span>
            <div className="flex items-center gap-1 bg-black/40 text-white backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-full border border-white/20">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>{current.rating}</span>
            </div>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-5 right-5 text-white z-10">
            <p className="text-[11px] text-sky-200 font-bold uppercase tracking-wider mb-0.5">
              {current.area}
            </p>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug drop-shadow-md">
              {current.title}
            </h2>
            <p className="text-xs text-white/80 line-clamp-1 mt-1 font-medium">
              {current.description}
            </p>
          </div>
        </div>

        {/* Bottom Control Strip (Korean Tourism Portal Style: 관광 TOP 10 | 1 / 5 < >) */}
        <div className="px-5 py-3.5 bg-white flex items-center justify-between border-t border-sky-50">
          <a
            href={current.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors group/link"
          >
            <MapPin size={14} className="text-sky-500" />
            <span className="font-black">觀光 TOP 10</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 group-hover/link:underline truncate max-w-[140px] sm:max-w-none">
              {current.subtitle}
            </span>
            <ExternalLink size={11} className="opacity-40" />
          </a>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black text-slate-500 tracking-wider">
              <span className="text-sky-600 font-black">{currentIndex + 1}</span> / {total}
            </span>
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 flex items-center justify-center transition-all active:scale-90"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 flex items-center justify-center transition-all active:scale-90"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
