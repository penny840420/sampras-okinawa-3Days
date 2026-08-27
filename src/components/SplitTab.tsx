import { useState, FormEvent, useMemo, useEffect, type ReactNode } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Pencil,
  Users,
  Wallet,
  PieChart,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard,
  Layers,
  Car,
  Utensils,
  Hotel,
  ShieldCheck,
  Ticket,
  Wifi,
  CircleParking,
} from 'lucide-react';
import {
  TEAM_MEMBERS,
  DEFAULT_EXPENSES,
  TOTAL_TRIP_BUDGET_TWD,
  BUDGET_CATEGORIES_PLAN,
} from '../data/tripData';
import { Expense } from '../types';
import okinawaStreetImg from '../assets/images/okinawa_kokusai_street_1787377958840.jpg';

const BUDGET_CATEGORY_LUCIDE_ICONS: Record<
  string,
  { icon: ReactNode; color: string; bg: string }
> = {
  transport: { icon: <Car size={16} />, color: 'text-sky-600', bg: 'bg-sky-50' },
  food: { icon: <Utensils size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  stay: { icon: <Hotel size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  insurance: { icon: <ShieldCheck size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  entertainment: { icon: <Ticket size={16} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  internet: { icon: <Wifi size={16} />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  parking_etc: { icon: <CircleParking size={16} />, color: 'text-rose-600', bg: 'bg-rose-50' },
};

export const SplitTab = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        for (const exp of DEFAULT_EXPENSES) {
          const { id: _id, ...rest } = exp;
          await addDoc(collection(db, 'expenses'), { ...rest, isFixed: true, createdAt: Date.now() });
        }
      } else {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Expense));
        setExpenses(data);
        setLoadingExpenses(false);
      }
    });
    return () => unsub();
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New expense form state
  const [currency, setCurrency] = useState<'TWD' | 'JPY'>('JPY');
  const [jpyExchangeRate, setJpyExchangeRate] = useState<number>(0.215);
  const [newNote, setNewNote] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('交通');
  const [newPayerId, setNewPayerId] = useState('fund');
  const [selectedSplitIds, setSelectedSplitIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/JPY')
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates?.TWD) {
          setJpyExchangeRate(Number(data.rates.TWD));
        }
      })
      .catch(() => {});
  }, []);

  const splitOptions = useMemo(() => [
    { id: 'fund', name: '公費', avatar: '🪙', isFund: true },
    ...TEAM_MEMBERS.map((m) => ({ id: m.id, name: m.name, avatar: m.avatar || '👤', avatarImg: m.avatarImg, isFund: false })),
  ], []);

  const totalBudget = TOTAL_TRIP_BUDGET_TWD; // 120,000
  const memberCount = TEAM_MEMBERS.length; // 7

  // Total spent calculation
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  // Remaining budget
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsagePercent = Math.min(
    100,
    Math.round((totalSpent / totalBudget) * 100)
  );

  // Per person calculations
  const perPersonBudget = Math.round(totalBudget / memberCount);
  const perPersonSpent = Math.round(totalSpent / memberCount);
  const perPersonRemaining = Math.round(remainingBudget / memberCount);

  // Category breakdown calculation
  const categoryStats = useMemo(() => {
    return BUDGET_CATEGORIES_PLAN.map((cat) => {
      const spent = expenses
        .filter((e) => e.category.includes(cat.name) || cat.name.includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);
      const remaining = cat.plannedTwd - spent;
      const percent = Math.min(100, Math.round((spent / cat.plannedTwd) * 100));
      return {
        ...cat,
        spent,
        remaining,
        percent,
      };
    });
  }, [expenses]);

  // Member settlement calculation
  const memberSettlements = useMemo(() => {
    return TEAM_MEMBERS.map((member) => {
      // Amount paid by this member
      const paid = expenses
        .filter((e) => e.payerId === member.id)
        .reduce((sum, e) => sum + e.amount, 0);

      // Amount this member should share across all expenses
      const shouldPay = expenses.reduce((sum, e) => {
        if (e.splitWithIds.includes(member.id) && e.splitWithIds.length > 0) {
          return sum + Math.round(e.amount / e.splitWithIds.length);
        }
        return sum;
      }, 0);

      const netBalance = paid - shouldPay; // positive = refund, negative = owes

      return {
        member,
        paid,
        shouldPay,
        netBalance,
      };
    });
  }, [expenses]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    if (selectedCategory === 'all') return expenses;
    return expenses.filter(
      (e) => e.category.includes(selectedCategory) || selectedCategory.includes(e.category)
    );
  }, [expenses, selectedCategory]);

  const resetForm = () => {
    setNewNote('');
    setNewAmount('');
    setNewCategory('交通');
    setNewPayerId('fund');
    setSelectedSplitIds([]);
    setCurrency('JPY');
    setEditingExpense(null);
    setShowAddForm(false);
  };

  const handleAddExpense = async (e: FormEvent) => {
    e.preventDefault();
    const amountNum = Number(newAmount);
    if (!newAmount || isNaN(amountNum) || amountNum <= 0 || !newNote.trim()) return;

    const twdAmount = currency === 'JPY' ? Math.round(amountNum * jpyExchangeRate) : amountNum;
    const splitIds = selectedSplitIds.length > 0 ? selectedSplitIds : ['fund', ...TEAM_MEMBERS.map((m) => m.id)];

    if (editingExpense) {
      await updateDoc(doc(db, 'expenses', editingExpense.id), {
        note: newNote.trim(),
        amount: twdAmount,
        currency,
        originalAmount: amountNum,
        category: newCategory,
        payerId: newPayerId,
        splitWithIds: splitIds,
      });
    } else {
      const newExp = {
        day: 1,
        amount: twdAmount,
        currency,
        originalAmount: amountNum,
        category: newCategory,
        note: newNote.trim(),
        payerId: newPayerId,
        splitWithIds: splitIds,
        createdAt: Date.now(),
      };
      await addDoc(collection(db, 'expenses'), newExp);
    }

    resetForm();
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('確定刪除這筆記帳？')) return;
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (e) {
      alert('刪除失敗：' + String(e));
    }
  };

  const handleResetDefault = () => {};

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const startEdit = (item: Expense) => {
    setEditingExpense(item);
    setNewNote(item.note);
    setNewAmount(String(item.originalAmount ?? item.amount));
    setNewCategory(item.category);
    setCurrency(item.currency ?? 'TWD');
    setNewPayerId(item.payerId);
    setSelectedSplitIds(item.splitWithIds ?? []);
    setShowAddForm(true);
  };

  const toggleMemberSplit = (memberId: string) => {
    if (selectedSplitIds.includes(memberId)) {
      setSelectedSplitIds(selectedSplitIds.filter((id) => id !== memberId));
    } else {
      setSelectedSplitIds([...selectedSplitIds, memberId]);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Header Banner with Bright Okinawa Photo */}
      <div className="rounded-3xl p-6 text-white shadow-md relative overflow-hidden bg-sky-900 border border-white/30">
        <div className="absolute inset-0 z-0">
          <img
            src={okinawaStreetImg}
            alt="Okinawa International Street"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-900/35 to-transparent" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20 text-white shadow-xs">
              Sampras 沖繩員工旅遊
            </span>
            <span className="text-xs font-black bg-[#03a8e2] text-white px-2.5 py-1 rounded-full shadow-xs">
              7 位團員
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1 mb-1 drop-shadow-md text-white">
            預算追蹤 & 公費計算 💰
          </h2>
          <p className="text-xs text-white/95 font-medium drop-shadow-sm">
            公費總預算 NT$ 120,000・即時公費支出記帳與預算明細
          </p>
        </div>
      </div>

      {/* 2. Total Budget Overview Dashboard */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Wallet size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">公費總預算概覽</h3>
              <p className="text-xs font-bold text-slate-400">
                公司員工旅遊公費・即時支出與剩餘額度追蹤
              </p>
            </div>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Total Budget */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-xs font-black text-slate-500 block mb-1">
              總預算
            </span>
            <p className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
              NT$ {totalBudget.toLocaleString()}
            </p>
          </div>

          {/* Total Spent */}
          <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100/70">
            <span className="text-xs font-black text-rose-500 block mb-1">
              總支出
            </span>
            <p className="text-base sm:text-lg font-black text-rose-600 tracking-tight">NT$</p>
            <p className="text-base sm:text-lg font-black text-rose-600 tracking-tight">
              {totalSpent.toLocaleString()}
            </p>
          </div>

          {/* Remaining */}
          <div className="bg-[#e5f6ff] p-3.5 rounded-2xl border border-[#cbeaff]">
            <span className="text-xs font-black text-[#16a0fb] block mb-1">
              剩餘公費
            </span>
            <p className="text-base sm:text-lg font-black text-[#16a0fb] tracking-tight">NT$</p>
            <p className="text-base sm:text-lg font-black text-[#16a0fb] tracking-tight">
              {remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-500 text-sm">預算使用進度</span>
            <span className="text-slate-700 font-black text-sm">
              ({budgetUsagePercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetUsagePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                budgetUsagePercent > 90
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : budgetUsagePercent > 70
                  ? 'bg-gradient-to-r from-sky-500 to-amber-500'
                  : 'bg-gradient-to-r from-sky-500 to-emerald-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3. Budget Category Breakdown (預算明細規劃) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <PieChart size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">公費預算規劃明細</h3>
              <p className="text-xs font-bold text-slate-400">
                各項目規劃預算 vs 實際支出狀況
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400 self-start pt-1">
            7 大類別
          </span>
        </div>

        <div className="space-y-3">
          {categoryStats.map((cat) => {
            const iconConfig = BUDGET_CATEGORY_LUCIDE_ICONS[cat.id] || {
              icon: <Wallet size={16} />,
              color: 'text-slate-600',
              bg: 'bg-slate-50',
            };

            return (
              <div
                key={cat.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-sky-100 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl ${iconConfig.bg} ${iconConfig.color} flex items-center justify-center shadow-2xs shrink-0`}
                    >
                      {iconConfig.icon}
                    </div>
                    <h4 className="text-base font-black text-slate-800 leading-none">
                      {cat.name}
                    </h4>
                  </div>

                  <p className="text-sm font-black text-slate-800 tracking-tight flex-shrink-0">
                    NT$ {cat.spent.toLocaleString()}{' '}
                    <span className="text-xs text-slate-400 font-normal ml-0.5">
                      / NT$ {cat.plannedTwd.toLocaleString()}
                    </span>
                  </p>
                </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                <div
                  style={{ width: `${cat.percent}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.percent >= 100
                      ? 'bg-rose-500'
                      : cat.percent > 80
                      ? 'bg-amber-500'
                      : 'bg-sky-500'
                  }`}
                />
              </div>

              {/* Remaining info below progress bar */}
              <div className="flex justify-between items-center text-xs font-bold mt-1.5">
                <span className="text-slate-400 font-medium">
                  {cat.percent}%
                </span>
                <span
                  className={
                    cat.remaining >= 0 ? 'text-[#16a0fb]' : 'text-rose-500'
                  }
                >
                  {cat.remaining >= 0
                    ? `剩餘 NT$ ${cat.remaining.toLocaleString()}`
                    : `超支 NT$ ${Math.abs(cat.remaining).toLocaleString()}`}
                </span>
              </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Team Members & Reimbursement Settlements (團員墊款與分攤結算) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                團員名單 & 墊款統計 ({memberCount}人)
              </h3>
              <p className="text-xs font-bold text-slate-400">
                記錄每位團員目前先墊付的公費金額
              </p>
            </div>
          </div>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {memberSettlements.map(({ member, paid }) => {
            return (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl p-1 bg-white rounded-xl shadow-2xs shrink-0 w-10 h-10 flex items-center justify-center overflow-hidden">
                    {member.avatarImg
                      ? <img src={member.avatarImg} alt={member.name} className="w-full h-full object-cover rounded-lg" />
                      : (member.avatar || '👤')}
                  </span>
                  <p className="text-sm font-black text-slate-800 truncate">
                    {member.name}
                  </p>
                </div>

                {/* Paid Badge with Light Blue Background & Blue Text */}
                <div className="text-right shrink-0">
                  <div
                    className={`inline-flex flex-col items-end px-3 py-1 rounded-xl ${
                      paid > 0
                        ? 'bg-sky-50 text-[#16a0fb]'
                        : 'bg-slate-100/80 text-slate-400'
                    }`}
                  >
                    <span className="text-[12px] leading-tight">代墊</span>
                    <span className="text-[14px] leading-tight font-medium">
                      NT$ {paid.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Expense Ledger & Add Expense (公費支出明細列表) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Receipt size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-slate-800 leading-tight">
                公費支出紀錄
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-1 whitespace-normal break-words">
                每一筆公費支出與分攤人員紀錄
              </p>
            </div>
          </div>

          <div className="shrink-0 mt-0.5">
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex flex-row items-center gap-1.5 bg-[#0086c9] hover:bg-[#0074ad] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <Plus size={14} className="shrink-0" />
              <span className="whitespace-nowrap inline-block">記帳</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: '全部' },
            { id: '交通', label: '交通' },
            { id: '餐費', label: '餐費' },
            { id: '住宿', label: '住宿' },
            { id: '保險', label: '保險' },
            { id: '門票', label: '門票' },
            { id: '網路', label: '網路' },
            { id: '停車', label: '停車/ETC' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-black transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#ef652d] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Expenses List */}
        <div className="space-y-2.5">
          {filteredExpenses.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-400">目前無此分類的公費支出紀錄</p>
            </div>
          ) : (
            filteredExpenses.map((item) => {
              const payer = TEAM_MEMBERS.find((m) => m.id === item.payerId);

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-sky-50/40 hover:border-sky-100 transition-all flex flex-col justify-between"
                >
                  {/* Top Row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-black bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-md">{item.category}</span>
                      {item.createdAt && (
                        <span className="text-[12px] text-slate-400 font-medium">{item.createdAt}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(item)} className="text-slate-300 hover:text-sky-500 p-1 rounded-lg hover:bg-sky-50 transition-colors">
                        <Pencil size={14} />
                      </button>
                      {!item.isFixed && (
                        <button onClick={() => handleDeleteExpense(item.id)} className="text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Note */}
                  <h5 className="text-[16px] font-black text-slate-800 break-words whitespace-normal leading-snug mb-2">{item.note}</h5>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-0.5">
                    <p className="text-[14px] text-slate-500 font-medium">
                      墊付人: <span className="font-normal text-slate-700">{payer ? payer.name : '公費'}</span>
                    </p>
                    <div className="flex flex-col items-end gap-0.5">
                      <p className="text-[16px] font-black text-[#16a0fb]">
                        {item.currency === 'JPY' && item.originalAmount && (
                          <><span className="text-[#ef652d]">¥{item.originalAmount.toLocaleString()}</span><span className="text-slate-400"> / </span></>
                        )}
                        NT$ {item.amount.toLocaleString()}
                      </p>
                      {item.splitWithIds && item.splitWithIds.length > 0 && (
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-slate-400">
                            每人約 NT$ {Math.round(item.amount / item.splitWithIds.length).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {item.splitWithIds.map(id => {
                              if (id === 'fund') return '公費';
                              return TEAM_MEMBERS.find(m => m.id === id)?.name ?? id;
                            }).join('・')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Standalone Modal Popup for Add Expense Form */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Gray Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={resetForm}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Popup Modal Window: only contains New Expense Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-[#0086c9]">
                    <Plus size={16} />
                  </div>
                  <h3 className="text-[18px] font-black text-slate-800">{editingExpense ? '編輯公費支出紀錄' : '新增公費支出紀錄'}</h3>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                    <line x1="3" y1="3" x2="15" y2="15"/><line x1="15" y1="3" x2="3" y2="15"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-3.5">
                <div>
                  {/* Currency Switcher */}
                  <div className="grid grid-cols-2 gap-1.5 bg-sky-100/80 p-1 rounded-xl border border-sky-200">
                    <button
                      type="button"
                      onClick={() => setCurrency('JPY')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        currency === 'JPY'
                          ? 'bg-white text-[#ef652d] shadow-xs font-black'
                          : 'text-sky-700 hover:text-sky-900'
                      }`}
                    >
                      <span>🇯🇵 日幣 JPY 記帳</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('TWD')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        currency === 'TWD'
                          ? 'bg-white text-[#ef652d] shadow-xs font-black'
                          : 'text-sky-700 hover:text-sky-900'
                      }`}
                    >
                      <span>🇹🇼 台幣 TWD 記帳</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[14px] font-bold text-slate-600 block mb-1">
                    品項名稱 / 支出說明
                  </label>
                  <input
                    type="text"
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="例如：琉球的牛燒肉、租車加油、超市補給..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-[#0086c9] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[14px] font-bold text-slate-600 whitespace-nowrap block mb-1">
                        支出金額 ({currency === 'JPY' ? '¥ 日幣' : 'NT$ 台幣'})
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder={currency === 'JPY' ? '例如：15000' : '例如：3500'}
                        className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs font-bold outline-none focus:border-[#0086c9] focus:bg-white transition-colors"
                      />
                      {currency === 'JPY' && Number(newAmount) > 0 && (
                        <p className="text-[11px] font-black text-[#0086c9] mt-1">
                          ≈ NT$ {Math.round(Number(newAmount) * jpyExchangeRate).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-[14px] font-bold text-slate-600 block mb-1">
                        支出類別
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold outline-none focus:bg-white transition-colors"
                      >
                        <option value="交通">交通</option>
                        <option value="餐費">餐費</option>
                        <option value="住宿">住宿</option>
                        <option value="保險">保險</option>
                        <option value="娛樂費用">娛樂費用</option>
                        <option value="網路費">網路費</option>
                        <option value="停車費＋ETC">停車費＋ETC</option>
                      </select>
                    </div>
                  </div>
                  {currency === 'JPY' && (
                    <p className="text-[12px] font-medium text-slate-400 mt-1.5 whitespace-nowrap">
                      💡 依即時匯率 1 JPY ≈ {jpyExchangeRate.toFixed(4)} TWD 自動換算
                    </p>
                  )}
                </div>

                {/* Split with participants selection (including fund) */}
                <div>
                  {/* Payer selector */}
                  <div className="mb-3.5">
                    <label className="text-[14px] font-bold text-slate-600 block mb-1.5">代墊人</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {splitOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setNewPayerId(opt.id)}
                          className={`w-full py-2 px-1 text-center rounded-xl text-[12px] font-bold transition-all flex items-center justify-center ${
                            newPayerId === opt.id
                              ? 'bg-[#0086c9] text-white shadow-xs'
                              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {opt.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[14px] font-bold text-slate-600">
                      分攤人員 ({selectedSplitIds.length} 個項目)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSplitIds(
                            selectedSplitIds.length === TEAM_MEMBERS.length && !selectedSplitIds.includes('fund')
                              ? []
                              : TEAM_MEMBERS.map((m) => m.id)
                          )
                        }
                        className="text-[12px] font-bold text-[#0086c9] hover:underline"
                      >
                        7位成員
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSplitIds(
                            selectedSplitIds.length === splitOptions.length
                              ? []
                              : splitOptions.map((o) => o.id)
                          )
                        }
                        className="text-[12px] font-bold text-slate-500 hover:text-slate-700 hover:underline"
                      >
                        {selectedSplitIds.length === splitOptions.length ? '清除全選' : '全選 (含公費)'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {splitOptions.map((opt) => {
                      const isSelected = selectedSplitIds.includes(opt.id);
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => toggleMemberSplit(opt.id)}
                          className={`w-full py-2 px-1 text-center rounded-xl text-[12px] font-bold transition-all flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#ef652d] text-white shadow-xs'
                              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSplitIds.length > 0 && Number(newAmount) > 0 && (
                    <p className="text-[11px] font-black text-[#0086c9] mt-1.5">
                      每人約 NT$ {Math.round((currency === 'JPY' ? Math.round(Number(newAmount) * jpyExchangeRate) : Number(newAmount)) / selectedSplitIds.length).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#0086c9] hover:bg-[#0074ad] text-white text-[14px] font-black py-2.5 rounded-xl shadow-xs transition-all active:scale-98"
                  >
                    {editingExpense ? '儲存變更' : '新增公費支出'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
