import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRightLeft, Sparkles, ShoppingBag } from 'lucide-react';
import americanVillageWheelImg from '../assets/images/american_village_wheel_1787624938535.jpg';

export const CurrencyConverterTab = () => {
  const [exchangeRate, setExchangeRate] = useState<number>(0.215); // Fallback reference rate
  const [jpyAmount, setJpyAmount] = useState<string>('10000');
  const [twdAmount, setTwdAmount] = useState<string>((10000 * 0.215).toFixed(0));
  const [activeInput, setActiveInput] = useState<'jpy' | 'twd'>('jpy');
  const [taxFreeMode, setTaxFreeMode] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchLiveRate = useCallback(async () => {
    try {
      // Primary API: open.er-api.com
      const res = await fetch('https://open.er-api.com/v6/latest/JPY');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && data.rates.TWD) {
          const liveRate = Number(data.rates.TWD);
          setExchangeRate(liveRate);
          const now = new Date();
          setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
          
          // Re-calculate with new live rate
          const num = parseFloat(jpyAmount);
          if (!isNaN(num)) {
            const finalJpy = taxFreeMode ? num / 1.1 : num;
            setTwdAmount((finalJpy * liveRate).toFixed(0));
          }
          return;
        }
      }
    } catch {
      // Secondary fallback attempt
      try {
        const resFallback = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
        if (resFallback.ok) {
          const dataFallback = await resFallback.json();
          if (dataFallback && dataFallback.rates && dataFallback.rates.TWD) {
            const liveRate = Number(dataFallback.rates.TWD);
            setExchangeRate(liveRate);
            const now = new Date();
            setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
            const num = parseFloat(jpyAmount);
            if (!isNaN(num)) {
              const finalJpy = taxFreeMode ? num / 1.1 : num;
              setTwdAmount((finalJpy * liveRate).toFixed(0));
            }
          }
        }
      } catch {
        // Keep default fallback rate if offline
      }
    }
  }, [jpyAmount, taxFreeMode]);

  useEffect(() => {
    fetchLiveRate();
  }, [fetchLiveRate]);

  const handleJpyChange = (val: string) => {
    setJpyAmount(val);
    setActiveInput('jpy');
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const autoTaxFree = num >= 5500;
      setTaxFreeMode(autoTaxFree);
      const finalJpy = autoTaxFree ? num / 1.1 : num;
      setTwdAmount((finalJpy * exchangeRate).toFixed(0));
    } else {
      setTwdAmount('');
    }
  };

  const handleTwdChange = (val: string) => {
    setTwdAmount(val);
    setActiveInput('twd');
    const num = parseFloat(val);
    if (!isNaN(num) && exchangeRate > 0) {
      const baseJpy = num / exchangeRate;
      const finalJpy = taxFreeMode ? baseJpy * 1.1 : baseJpy;
      setJpyAmount(finalJpy.toFixed(0));
    } else {
      setJpyAmount('');
    }
  };

  const toggleTaxFree = () => {
    const nextTax = !taxFreeMode;
    setTaxFreeMode(nextTax);
    const num = parseFloat(jpyAmount);
    if (!isNaN(num)) {
      const finalJpy = nextTax ? num / 1.1 : num;
      setTwdAmount((finalJpy * exchangeRate).toFixed(0));
    }
  };

  const presets = [
    { jpy: 500, label: '超商飲料 / 冰棒' },
    { jpy: 1000, label: '拉麵 / 丼飯定食' },
    { jpy: 2000, label: '居酒屋小酌 / 伴手禮' },
    { jpy: 3500, label: '景點門票 / 精緻晚餐' },
    { jpy: 5500, label: '日本免稅門檻 (¥5,000未稅)' },
    { jpy: 10000, label: '藥妝購物 / 服飾' },
    { jpy: 25000, label: '琉球之牛 / 和牛燒肉' },
    { jpy: 50000, label: 'Outlet 精品採購' },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner with Bright Okinawa Photo */}
      <div className="rounded-3xl p-6 text-white shadow-md relative overflow-hidden bg-sky-900 border border-white/30">
        {/* Okinawa Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={americanVillageWheelImg}
            alt="Okinawa American Village Ferris Wheel"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100 transition-all"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-slate-900/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-md">
          <span className="text-[10px] font-black bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20 text-white shadow-xs">
            Shopping & 旅遊換算
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2 mb-1 drop-shadow-md text-white">
            匯率即時換算 💱
          </h2>
          <p className="text-xs text-white/95 font-medium drop-shadow-sm">
            日圓 JPY ⇄ 新台幣 TWD 即時雙向計算・免稅 10% 試算
          </p>
        </div>
      </div>

      {/* Main Converter Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        {/* Real-time Exchange Rate Info Header (No manual adjustments) */}
        <div className="flex items-center justify-between bg-sky-50/80 border border-sky-100 px-4 py-3 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-[15px] text-slate-700 font-black flex items-center gap-1">
              <span>1 JPY ≈</span>
              <span className="text-[#0086c9] font-black text-[16px]">{exchangeRate.toFixed(4)}</span>
              <span>TWD</span>
            </div>
          </div>
          {lastUpdated && (
            <span className="text-[12px] text-slate-400 font-medium shrink-0">
              ({lastUpdated} 更新)
            </span>
          )}
        </div>

        {/* Tax-free info */}
        <div className="bg-amber-50/70 border border-amber-200/60 p-3.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-amber-600 shrink-0" />
            <span className="text-[16px] font-black text-slate-800 leading-none">日本免稅 10% 試算</span>
          </div>
          <div className="text-[14px] text-slate-500 font-normal ml-[26px] mt-1">
            消費滿 ¥5,500(含稅) 可享免稅，自動折抵計算
          </div>
        </div>

        {/* JPY Input */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 focus-within:border-sky-500 focus-within:ring-2 ring-sky-100 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-rose-500 font-black text-[16px]">
              🇯🇵 日圓 (JPY)
            </span>
            {taxFreeMode && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-black">
                含稅標價
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-400">¥</span>
            <input
              type="number"
              value={jpyAmount}
              onChange={(e) => handleJpyChange(e.target.value)}
              placeholder="0"
              className="w-full text-2xl font-black text-slate-800 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Arrow separator */}
        <div className="flex justify-center -mt-7 -mb-4 relative z-10">
          <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md border-2 border-white">
            <ArrowRightLeft size={15} />
          </div>
        </div>

        {/* TWD Input */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 focus-within:border-sky-500 focus-within:ring-2 ring-sky-100 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-sky-600 font-black text-[16px]">
              🇹🇼 新台幣 (TWD)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-400">NT$</span>
            <input
              type="number"
              value={twdAmount}
              onChange={(e) => handleTwdChange(e.target.value)}
              placeholder="0"
              className="w-full text-2xl font-black text-sky-600 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Quick Lookup Presets */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex flex-col gap-0.5 text-slate-700">
          <div className="flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-500 shrink-0" />
            <span className="text-[16px] font-black">常用金額快速換算對照</span>
          </div>
          <div className="text-[13px] text-slate-400 font-bold ml-[22px]">
            (即時匯率 1 JPY ≈ {exchangeRate.toFixed(4)} TWD)
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {presets.map((item) => {
            const twd = Math.round(item.jpy * exchangeRate);
            return (
              <button
                key={item.jpy}
                onClick={() => handleJpyChange(item.jpy.toString())}
                className="py-3 px-3.5 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-200/80 rounded-2xl text-left transition-all active:scale-[0.98] group flex flex-col justify-center gap-1 shadow-2xs"
              >
                <div className="flex items-baseline justify-between w-full">
                  <span className="text-[16px] font-black text-slate-800 group-hover:text-sky-600 tracking-tight">
                    ¥{item.jpy.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">JPY</span>
                </div>
                <div className="flex items-baseline justify-between w-full border-t border-slate-200/60 pt-1">
                  <span className="text-[16px] font-black text-[#0086c9] tracking-tight">
                    NT$ {twd.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-sky-500">TWD</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

