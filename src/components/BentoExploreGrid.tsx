import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Utensils, Gift, Calculator, Compass, ChevronRight, CheckCircle2, ArrowRight, Plane, Clock, ShieldCheck, MapPin, X } from 'lucide-react';

interface BentoExploreGridProps {
  onOpenTab: (tab: 'itinerary' | 'map' | 'souvenirs' | 'split' | 'tools') => void;
  onSelectDay?: (day: number) => void;
}

export const BentoExploreGrid = ({ onOpenTab, onSelectDay }: BentoExploreGridProps) => {
  // Custom quick match filter states
  const [whenTime, setWhenTime] = useState('下午 (13:00-17:00)');
  const [whoGroup, setWhoGroup] = useState('Sampras 全體員工');
  const [whatActivity, setWhatActivity] = useState('琉球道地美食 & 居酒屋');
  const [matchResult, setMatchResult] = useState<string | null>(null);

  const handleCustomRecommend = () => {
    let rec = '';
    if (whatActivity.includes('美食')) {
      rec = '推薦：Day 1 琉球的牛頂級炭火和牛燒肉 或 Day 2 Shima ShabuShabu NAKAMA 頂級涮涮鍋！';
    } else if (whatActivity.includes('海灘') || whatActivity.includes('水上') || whatActivity.includes('水族館')) {
      rec = '推薦：Day 2 DMM Kariyushi 光影水族館 與 Day 3 瀨長島純白海景露台美食！';
    } else if (whatActivity.includes('自駕') || whatActivity.includes('打卡')) {
      rec = '推薦：Day 2 殘波岬燈塔斷崖 與 Day 3 波上宮崖上神社參拜！';
    } else {
      rec = '推薦：Day 1 北谷美國村逛街 與 Day 2 iias 購物中心 + Ashibinaa Outlet 暢貨中心！';
    }
    setMatchResult(rec);
  };

  return (
    <section className="mb-8">
      {/* Section Title (요기조기 style) */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black mb-1.5 shadow-sm">
          <Sparkles size={12} className="text-amber-600" />
          <span>員工旅遊百寶箱</span>
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          沖繩全方位攻略 <span className="text-base">✨</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          行程篩選、必吃美食、免稅購物、分帳試算與行前指南
        </p>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Left Column: Amber Card - Custom Recommender (맞춤관광) */}
        <div className="md:row-span-2 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 text-white shadow-lg flex flex-col justify-between relative overflow-hidden portal-bento-card">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black bg-white/20 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                智慧推薦
              </span>
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-lg font-black tracking-tight mb-1">員工旅遊快篩</h4>
            <p className="text-xs text-amber-100 mb-4 font-medium">
              自選時間與喜好，快速找出最適合的行程亮點！
            </p>

            {/* Selectors */}
            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-amber-200 block mb-1">何時出發？</label>
                <select
                  value={whenTime}
                  onChange={(e) => setWhenTime(e.target.value)}
                  className="w-full bg-white/15 border border-white/25 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none focus:bg-white/25 transition-all"
                >
                  <option value="上午 (09:00-12:00)" className="text-slate-800">上午 (09:00-12:00)</option>
                  <option value="下午 (13:00-17:00)" className="text-slate-800">下午 (13:00-17:00)</option>
                  <option value="傍晚 (17:30-20:00)" className="text-slate-800">傍晚 (17:30-20:00)</option>
                  <option value="深夜宵夜 (20:00+)" className="text-slate-800">深夜宵夜 (20:00+)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-amber-200 block mb-1">與誰同行？</label>
                <select
                  value={whoGroup}
                  onChange={(e) => setWhoGroup(e.target.value)}
                  className="w-full bg-white/15 border border-white/25 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none focus:bg-white/25 transition-all"
                >
                  <option value="Sampras 全體員工" className="text-slate-800">Sampras 全體員工</option>
                  <option value="海灘水上探險隊" className="text-slate-800">海灘水上探險隊</option>
                  <option value="美食甜點饕客組" className="text-slate-800">美食甜點饕客組</option>
                  <option value="購物免稅採買團" className="text-slate-800">購物免稅採買團</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-amber-200 block mb-1">想體驗什麼？</label>
                <select
                  value={whatActivity}
                  onChange={(e) => setWhatActivity(e.target.value)}
                  className="w-full bg-white/15 border border-white/25 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none focus:bg-white/25 transition-all"
                >
                  <option value="琉球道地美食 & 居酒屋" className="text-slate-800">琉球道地美食 & 居酒屋</option>
                  <option value="水上活動 & 青之洞窟浮潛" className="text-slate-800">水上活動 & 青之洞窟浮潛</option>
                  <option value="絕景自駕 & 跨海大橋" className="text-slate-800">絕景自駕 & 跨海大橋</option>
                  <option value="Outlet 免稅購物 & 藥妝採買" className="text-slate-800">Outlet 免稅購物 & 藥妝採買</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleCustomRecommend}
              className="w-full bg-slate-900 hover:bg-black text-amber-300 font-black text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>立即推薦行程</span>
              <ArrowRight size={13} />
            </button>

            {matchResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-2.5 bg-black/30 rounded-xl text-[11px] font-bold text-white border border-white/20"
              >
                {matchResult}
              </motion.div>
            )}
          </div>
        </div>

        {/* Card 2: Sky Blue - Food Guide (우리동네지도) */}
        <div
          onClick={() => onOpenTab('souvenirs')}
          className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer portal-bento-card flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase">
                必吃在地
              </span>
              <h4 className="text-base font-black tracking-tight mt-1">琉球美食地圖</h4>
              <p className="text-[11px] text-sky-100 mt-0.5">
                阿古豬火鍋・沖繩麵・海葡萄・Orion生啤
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              🍜
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-bold text-sky-100">
            <span>探索必吃名單</span>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Card 3: Emerald/Mint - Must-buy Souvenirs (유성구 식도락) */}
        <div
          onClick={() => onOpenTab('souvenirs')}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer portal-bento-card flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase">
                推薦採購
              </span>
              <h4 className="text-base font-black tracking-tight mt-1">伴手禮 & 藥妝</h4>
              <p className="text-[11px] text-emerald-100 mt-0.5">
                紅芋塔・雪鹽・黑糖年輪・石垣島巧克力・YOLU
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              🛍️
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-100">
            <span>查看完整購買清單</span>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Card 4: Indigo/Blue - Split & Currency (자전거 100리 길) */}
        <div
          onClick={() => onOpenTab('split')}
          className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer portal-bento-card flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase">
                即時換算
              </span>
              <h4 className="text-base font-black tracking-tight mt-1">公費記帳 & 匯率</h4>
              <p className="text-[11px] text-indigo-100 mt-0.5">
                日幣 JPY ↔ 台幣 TWD・團員分帳結算
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              🪙
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-100">
            <span>前往公費記帳簿</span>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Card 5: Violet/Purple - Flight & Tools (하루를 부탁해) */}
        <div
          onClick={() => onOpenTab('tools')}
          className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer portal-bento-card flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase">
                行程保障
              </span>
              <h4 className="text-base font-black tracking-tight mt-1">航班與行前工具</h4>
              <p className="text-[11px] text-purple-100 mt-0.5">
                星宇航班資訊・護照行前清單・分房表
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              ✈️
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-100">
            <span>開啟團隊工具箱</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </section>
  );
};
