import { useState, useEffect, FormEvent } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  Luggage,
  Plane,
  Clock,
  ArrowRight,
} from 'lucide-react';
import okinawaBrightCoastImg from '../assets/images/okinawa_bright_coast_1787319522356.jpg';

interface ChecklistItem {
  id: string;
  category: 'essential' | 'electronics' | 'clothes' | 'medicine' | 'custom';
  text: string;
  note?: string;
  checked: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // 必備證件
  {
    id: 'doc-1',
    category: 'essential',
    text: '台灣護照正本（有效期限需大於 6 個月）',
    note: '建議手機拍照存檔備份（免簽 90 天）',
    checked: false,
  },
  {
    id: 'doc-1b',
    category: 'essential',
    text: '香港特區護照 / BNO 護照正本（效期大於 6 個月）',
    note: '港籍免簽證短期停留 90 天，建議拍照備份',
    checked: false,
  },
  {
    id: 'doc-2',
    category: 'essential',
    text: '台灣駕照正本 + 監理所日文譯本正本（台籍自駕）',
    note: '租車時兩張正本皆為必備，缺一無法取車',
    checked: false,
  },
  {
    id: 'doc-2b',
    category: 'essential',
    text: '香港正式駕照 + 國際駕駛許可證 IDP（港籍自駕）',
    note: '需持 1949 年公約國際駕照與香港駕照正本取車',
    checked: false,
  },
  {
    id: 'doc-3',
    category: 'essential',
    text: 'Visit Japan Web (VJW) 入境申報 QR Code 截圖',
    note: '離線時也能出示海關與入境審查審驗',
    checked: false,
  },
  {
    id: 'doc-4',
    category: 'essential',
    text: '日幣現金',
    note: '部分神社、路邊收費停車場、在地小吃僅收現金',
    checked: false,
  },
  {
    id: 'doc-5',
    category: 'essential',
    text: '海外高回饋信用卡 / 雙幣卡',
    note: '確認已開啟海外實體刷卡與線上刷卡功能',
    checked: false,
  },
  {
    id: 'doc-6',
    category: 'essential',
    text: '海外旅遊平安險與不便險保單',
    note: '含海外突發疾病醫療及班機延誤理賠',
    checked: false,
  },

  // 3C 與網路
  {
    id: 'elec-1',
    category: 'electronics',
    text: '日本 eSIM 下載開通 / 日本上網 SIM 卡',
    note: '到日本後開啟數據漫遊即可上網',
    checked: false,
  },
  {
    id: 'elec-2',
    category: 'electronics',
    text: '行動電源（容量符合航空規定）',
    note: '⚠️ 必須放在手提行李，嚴禁托運！',
    checked: false,
  },
  {
    id: 'elec-3',
    category: 'electronics',
    text: '手機/相機充電線、快充頭',
    note: '日本雙平腳插座與台灣通用，無需轉接頭',
    checked: false,
  },

  // 穿搭與防曬
  {
    id: 'clo-1',
    category: 'clothes',
    text: '舒適透氣短袖 + 薄長袖防風防曬外套',
    note: '沖繩早晚海風稍涼，室內冷氣充足',
    checked: false,
  },
  {
    id: 'clo-2',
    category: 'clothes',
    text: '太陽眼鏡、遮陽帽、防曬乳',
    note: '沖繩紫外線偏強，戶外踏青必備',
    checked: false,
  },
  {
    id: 'clo-3',
    category: 'clothes',
    text: '好走的運動球鞋與休閒鞋',
    note: '適合商場逛街、波上宮、美國村散步',
    checked: false,
  },

  // 常備藥品
  {
    id: 'med-1',
    category: 'medicine',
    text: '個人常備藥（暈車藥、止痛退燒、胃腸藥）',
    note: '日本自駕或車程建議備妥暈車藥',
    checked: false,
  },
  {
    id: 'med-2',
    category: 'medicine',
    text: '防蚊液、OK 繃、人工淚液/眼藥水',
    note: '小容量包裝便於隨身攜帶',
    checked: false,
  },
];

export const PrepTab = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'essential' | 'electronics' | 'clothes' | 'medicine' | 'custom'>('all');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('sampras_okinawa_prep_checklist_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_CHECKLIST;
  });

  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('sampras_okinawa_prep_checklist_v3', JSON.stringify(checklist));
    } catch {
      // ignore
    }
  }, [checklist]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleUncheckAll = () => {
    setChecklist((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      category: 'custom',
      text: newItemText.trim(),
      checked: false,
    };
    setChecklist((prev) => [...prev, newItem]);
    setNewItemText('');
  };

  const handleDeleteItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const completedCount = checklist.filter((item) => item.checked).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = checklist.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Top Banner with Bright Okinawa Photo */}
      <div className="rounded-3xl p-6 text-white shadow-md relative overflow-hidden bg-sky-900 border border-white/30">
        {/* Okinawa Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={okinawaBrightCoastImg}
            alt="Okinawa Beach & Coast"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100 transition-all"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-slate-900/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-md">
          <span className="text-[10px] font-black bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20 text-white shadow-xs">
            Trip Preparation & Flights
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2 mb-1 drop-shadow-md text-white">
            沖繩行前準備與航班資訊 ✈️
          </h2>
          <p className="text-xs text-white/95 font-medium drop-shadow-sm">
            亞洲航空直飛航班資訊・必備出國證件・行李打包清單一站式查閱
          </p>
        </div>
      </div>

      {/* Flight Information Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-[#e01a22] shrink-0">
              <Plane size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                航班資訊 Flight Details
              </h3>
              <p className="text-xs font-bold text-slate-400">
                亞洲航空 AirAsia・直飛航班
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-rose-50 text-[#e01a22]">
            AirAsia 直飛
          </span>
        </div>

        <div className="space-y-3.5">
          {/* 去程 (Outbound) */}
          <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100/80 rounded-2xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0090d3] bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100">
                ✈ 去程 Outbound
              </span>
              <span className="text-xs font-semibold text-slate-400">
                台灣 (TPE) → 沖繩 (OKA)
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              {/* AirAsia Logo */}
              <div className="w-8 h-8 rounded-full bg-[#e01a22] flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white text-[9px] font-black italic tracking-tighter select-none">
                  AirAsia
                </span>
              </div>

              {/* Departure */}
              <div className="text-center min-w-[65px]">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  13:30
                </div>
                <div className="text-xs font-black text-slate-500 mt-0.5">
                  TPE
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  台北桃園
                </div>
              </div>

              {/* Flight Duration & Line */}
              <div className="flex-1 flex flex-col items-center px-1 max-w-[170px]">
                <div className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  <span>1小時 25 分鐘</span>
                </div>
                <div className="w-full flex items-center relative py-1">
                  <div className="h-[1.5px] w-full bg-slate-300 relative" />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ✈
                  </span>
                </div>
                <span className="text-xs font-bold text-teal-600 mt-1">
                  直飛
                </span>
              </div>

              {/* Arrival */}
              <div className="text-center min-w-[65px]">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  15:55
                </div>
                <div className="text-xs font-black text-slate-500 mt-0.5">
                  OKA
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  沖繩那霸
                </div>
              </div>
            </div>
          </div>

          {/* 回程 (Inbound) */}
          <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100/80 rounded-2xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#ef652d] bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-100">
                ✈ 回程 Return
              </span>
              <span className="text-xs font-semibold text-slate-400">
                沖繩 (OKA) → 台灣 (TPE)
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              {/* AirAsia Logo */}
              <div className="w-8 h-8 rounded-full bg-[#e01a22] flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white text-[9px] font-black italic tracking-tighter select-none">
                  AirAsia
                </span>
              </div>

              {/* Departure */}
              <div className="text-center min-w-[65px]">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  16:55
                </div>
                <div className="text-xs font-black text-slate-500 mt-0.5">
                  OKA
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  沖繩那霸
                </div>
              </div>

              {/* Flight Duration & Line */}
              <div className="flex-1 flex flex-col items-center px-1 max-w-[170px]">
                <div className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  <span>1小時 35 分鐘</span>
                </div>
                <div className="w-full flex items-center relative py-1">
                  <div className="h-[1.5px] w-full bg-slate-300 relative" />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ✈
                  </span>
                </div>
                <span className="text-xs font-bold text-teal-600 mt-1">
                  直飛
                </span>
              </div>

              {/* Arrival */}
              <div className="text-center min-w-[65px]">
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  17:30
                </div>
                <div className="text-xs font-black text-slate-500 mt-0.5">
                  TPE
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  台北桃園
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-bold text-amber-600">💡 機場報到提點：</span>
            <span>建議提前 2.5 ~ 3 小時抵達機場辦理報到與行李托運</span>
          </div>
        </div>
      </div>

      {/* Packing Checklist Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-[#d6f2ff] flex items-center justify-center text-[#0086c9] shrink-0">
              <Luggage size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-800 truncate">
                出發行李打包互動清單
              </h3>
              <p className="text-xs font-bold text-slate-400 truncate">
                點擊勾選標記進度・即時自動儲存
              </p>
            </div>
          </div>

          {completedCount > 0 && (
            <button
              onClick={handleUncheckAll}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl transition-colors shrink-0"
              title="全部清除勾選"
            >
              全部取消勾選
            </button>
          )}
        </div>

        {/* Progress Bar & Counter (Placed between Title and Category Tabs) */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="text-slate-500">打包進度：</span>
            <span>{completedCount} / {totalCount} 項完成</span>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-[200px]">
            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#009fe9] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#009fe9] min-w-[36px] text-right">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Category Filter Pills (Tabs) */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100 max-w-full">
          {[
            { id: 'all', label: '全部項目' },
            { id: 'essential', label: '重要證件' },
            { id: 'electronics', label: '3C與網路' },
            { id: 'clothes', label: '衣物防曬' },
            { id: 'medicine', label: '常備藥品' },
            { id: 'custom', label: '自訂項目' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#009fe9] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List items */}
        <div className="space-y-2 mb-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex items-start justify-between gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                item.checked
                  ? 'bg-slate-50/70 border-slate-200/60 opacity-60'
                  : 'bg-white border-slate-200/80 hover:border-sky-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div className="mt-0.5 shrink-0">
                  {item.checked ? (
                    <CheckSquare size={20} className="text-[#009fe9]" />
                  ) : (
                    <Square size={20} className="text-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-bold leading-snug break-words ${
                      item.checked ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                  >
                    {item.text}
                  </p>
                  {item.note && (
                    <p className="text-xs text-slate-500 font-medium mt-0.5 break-words">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>

              {item.category === 'custom' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="text-slate-300 hover:text-rose-500 p-1 transition-colors shrink-0"
                  title="刪除"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs font-bold">
              此分類目前沒有項目
            </div>
          )}
        </div>

        {/* Add custom item */}
        <form onSubmit={handleAddItem} className="flex items-center gap-2 w-full min-w-0">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="新增行李項目（如：防曬乳、腳架）..."
            className="flex-1 min-w-0 w-full text-xs sm:text-sm font-bold bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!newItemText.trim()}
            className="bg-[#009fe9] hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-black px-3.5 sm:px-4 py-2.5 rounded-2xl flex items-center gap-1 shrink-0 whitespace-nowrap transition-colors shadow-xs"
          >
            <Plus size={16} />
            <span>新增</span>
          </button>
        </form>
      </div>

      {/* Flight & Baggage Regulations Notice */}
      <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-200/80">
        <div className="flex items-center gap-2 text-amber-800 mb-2">
          <AlertCircle size={18} className="text-amber-600 shrink-0" />
          <h4 className="text-base font-black text-amber-900">
            登機行李與海關入境須知
          </h4>
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
          <p>
            • <strong className="font-bold text-amber-950">鋰電池與行動電源：</strong>嚴禁託運，請務必隨身攜帶上飛機。
          </p>
          <p>
            • <strong className="font-bold text-amber-950">隨身液體限制：</strong>單瓶容器不得超過 100ml，並需置於 1 公升透明夾鏈袋內。
          </p>
          <p>
            • <strong className="font-bold text-amber-950">肉類與生鮮蔬果：</strong>生鮮水果、肉製品（含肉乾、肉鬆）嚴禁攜帶入境日本與攜回台灣。
          </p>
        </div>
      </div>
    </div>
  );
};
