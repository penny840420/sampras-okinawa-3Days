import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, ChevronUp, ChevronDown, Bell, X, Calendar } from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/tripData';

export const NoticeTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <>
      {/* Notice Ticker Bar */}
      <div
        onClick={() => setShowModal(true)}
        className="w-full bg-emerald-700 text-white rounded-2xl p-3 sm:p-3.5 flex items-center justify-between shadow-md cursor-pointer hover:bg-emerald-800 transition-colors mb-6"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Badge (공지사항 style) */}
          <span className="shrink-0 bg-emerald-500 text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <Megaphone size={11} className="text-emerald-950" />
            <span>公告事項</span>
          </span>

          {/* Scrolling text */}
          <div className="overflow-hidden relative h-5 flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-bold text-emerald-50 truncate"
              >
                {current.title}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          <span className="text-[10px] text-emerald-300 font-mono hidden sm:inline">
            {current.date}
          </span>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={handlePrev}
              className="p-0.5 hover:bg-emerald-600 rounded text-emerald-200"
            >
              <ChevronUp size={12} />
            </button>
            <button
              onClick={handleNext}
              className="p-0.5 hover:bg-emerald-600 rounded text-emerald-200"
            >
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Announcements Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base">員工旅遊公告欄</h3>
                    <p className="text-[11px] text-slate-400">Sampras 沖繩旅行團重要須知</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="overflow-y-auto space-y-3 py-4 flex-1 no-scrollbar">
                {ANNOUNCEMENTS.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      ann.important
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          ann.important
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ann.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar size={10} /> {ann.date}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                      {ann.title}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all"
              >
                我知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
