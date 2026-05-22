import React, { useState, useMemo } from 'react';
import {
  Truck,
  Database,
  Search,
  Filter,
  MapPin,
  Clock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Coins,
  ShieldCheck,
  Layers,
  CheckCircle,
  X,
  Sparkles,
  RefreshCw,
  Info,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  Check,
  AlertCircle,
  Calendar,
  Settings,
  Shield,
  Zap,
  BarChart2
} from 'lucide-react';

// Core domestic factory-to-factory order pool dataset
const initialOrders = [
  {
    id: "ORD-20260520-001",
    source: "ERP",
    pickup: "上海嘉定工厂",
    delivery: "苏州工业园客户仓",
    weight: 8.5,
    volume: 22.0,
    type: "整车",
    requiredArrival: "2026-05-21 18:00",
    scenario: "内贸工厂到工厂",
    status: "待规划",
    description: "厂区出货校验通过，协议大通道配载中。"
  },
  {
    id: "ORD-20260520-002",
    source: "WMS",
    pickup: "昆山工厂",
    delivery: "宁波北仑仓",
    weight: 3.2,
    volume: 11.0,
    type: "零担",
    requiredArrival: "2026-05-21 16:00",
    scenario: "零担补位",
    status: "待规划",
    description: "建议配载同流向协议整车，以降本提效。"
  },
  {
    id: "ORD-20260520-003",
    source: "ERP",
    pickup: "太仓工厂",
    delivery: "杭州下沙备料仓",
    weight: 6.8,
    volume: 18.0,
    type: "整车",
    requiredArrival: "2026-05-21 12:00", // Strictly demands 12-hour safe cutoff transit checks
    scenario: "前程陆运说明",
    status: "待规划",
    description: "外贸第一程前置公路集港，涉及严格下沙备货仓入库截单时效。"
  },
  {
    id: "ORD-20260520-004",
    source: "ERP",
    pickup: "无锡工厂",
    delivery: "常州客户仓",
    weight: 7.1,
    volume: 20.0,
    type: "整车",
    requiredArrival: "2026-05-21 20:00",
    scenario: "内贸工厂到工厂",
    status: "规划中", // Pre-locked order to demonstrate concurrent multi-user protection
    description: "该订单正被协同二组调度排配中，暂不可重复选择。"
  }
];

// Baseline carrier statistics for dynamic quotation calculations
const initialCarriers = [
  {
    id: "CAND-SHUNDA",
    name: "顺达物流",
    baseScore: 92,
    baseQuote: 3200,
    baseBenchmark: 3400,
    transit: "10 小时",
    transitHours: 10,
    onTime: "96.5%",
    exception: "0.8%",
    fulfillment: "98.2%",
    capacity: "可接单",
    scenario: "整车直发",
    subScenario: "长三角协议大通道",
    marker: "系统推荐",
    reason: "长三角大宗协议首选车队，综合得分最高，历史履约无破损赔偿记录。",
    isPreferred: true,
    passesCutoff: true
  },
  {
    id: "CAND-HUADONG",
    name: "华东快运",
    baseScore: 90,
    baseQuote: 3380,
    baseBenchmark: 3400,
    transit: "8 小时",
    transitHours: 8,
    onTime: "98.0%",
    exception: "0.5%",
    fulfillment: "99.1%",
    capacity: "可接单",
    scenario: "整车直发",
    subScenario: "极速绿色通道",
    marker: "时效最优",
    reason: "自营车队直发调度，具备北斗高频双通道定位，适合极速厂际配料。",
    isPreferred: false,
    passesCutoff: true
  },
  {
    id: "CAND-YUANDONG",
    name: "远东供应链",
    baseScore: 88,
    baseQuote: 2950,
    baseBenchmark: 3400,
    transit: "13 小时", // Slower transit that fails 12h cutoff buffers
    transitHours: 13,
    onTime: "93.0%",
    exception: "1.5%",
    fulfillment: "95.0%",
    capacity: "运力紧张",
    scenario: "零担补位",
    subScenario: "跨省专线拼载",
    marker: "报价最低",
    reason: "返程配货运价成本最低。但时效冗余较低，不适于极高紧急度订单。",
    isPreferred: false,
    passesCutoff: false // Fails export cutoff threshold
  }
];

// Parallel Spot bids for backup comparisons
const initialSpotBids = [
  { name: "联运快线 (社会车辆)", quoteFactor: 1.12, transit: "9 小时", desc: "货主社会招标，GPS高频回传，运力池临时匹配" },
  { name: "中安快捷 (回程车匹配)", quoteFactor: 0.98, transit: "12 小时", desc: "回程货运配载，协议价偏低，时效波动稍大" }
];

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [orders, setOrders] = useState(initialOrders);

  // Selection state (initially loading ORD-001 and ORD-002)
  const [selectedIds, setSelectedIds] = useState(["ORD-20260520-001", "ORD-20260520-002"]);

  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterScenario, setFilterScenario] = useState("all");

  // Recommendation Page Configuration
  const [currentSort, setCurrentSort] = useState("score");
  const [isFirstLegCutoffChecking, setIsFirstLegCutoffChecking] = useState(true); // Default active for transparent demonstration
  const [selectedCarrierId, setSelectedCarrierId] = useState("CAND-SHUNDA");

  // Task generation results
  const [showTaskResult, setShowTaskResult] = useState(false);
  const [customToast, setCustomToast] = useState(null);

  const triggerToast = (message, type = "success") => {
    setCustomToast({ message, type });
    setTimeout(() => setCustomToast(null), 4000);
  };

  // 1. Get Selected Orders dynamically
  const selectedOrdersData = useMemo(() => {
    return orders.filter(o => selectedIds.includes(o.id));
  }, [selectedIds, orders]);

  // 2. Identify Locked vs Unlockable orders
  const unlockableOrders = useMemo(() => {
    return orders.filter(o => o.status !== "规划中");
  }, [orders]);

  // Check if all unlockable are selected
  const isAllUnlockableSelected = useMemo(() => {
    return unlockableOrders.length > 0 && unlockableOrders.every(o => selectedIds.includes(o.id));
  }, [unlockableOrders, selectedIds]);

  // 3. Aggregate Weight and Volume based on selection
  const aggregatedStats = useMemo(() => {
    let totalWeight = 0;
    let totalVolume = 0;
    selectedOrdersData.forEach(o => {
      totalWeight += o.weight;
      totalVolume += o.volume;
    });
    return {
      weight: parseFloat(totalWeight.toFixed(1)),
      volume: parseFloat(totalVolume.toFixed(1)),
      count: selectedOrdersData.length
    };
  }, [selectedOrdersData]);

  // 4. Check if current selection contains the Export First-leg Order (ORD-20260520-003)
  const hasExportFirstLegSelected = useMemo(() => {
    return selectedOrdersData.some(o => o.scenario === "前程陆运说明");
  }, [selectedOrdersData]);

  // 5. Dynamic vehicle determination and Carrier tariff calculations based on load
  const dynamicCarriers = useMemo(() => {
    const weight = aggregatedStats.weight;

    // Determine dynamic domestic truck layout
    let truckSpecs = {
      type: "9.6米单桥厢式车 (核载 10 吨 / 45 m³)",
      multiplier: 1.0,
      classification: "FTL-中型干线"
    };

    if (weight === 0) {
      truckSpecs = { type: "未选配载货品", multiplier: 0, classification: "空仓" };
    } else if (weight <= 5.0) {
      truckSpecs = {
        type: "6.8米高栏中型货车 (核载 5 吨 / 28 m³)",
        multiplier: 0.75, // Lower quote factors for lighter loads
        classification: "FTL-轻度配载"
      };
    } else if (weight > 10.0) {
      truckSpecs = {
        type: "13.5米大型半挂牵引车 (核载 30 吨 / 80 m³)",
        multiplier: 1.45, // Cost increases for heavy capacity loads
        classification: "FTL-重度配载"
      };
    }

    // Adapt base prices to dynamic selection multiplier
    let carriersList = initialCarriers.map(c => {
      const calculatedQuote = Math.round(c.baseQuote * truckSpecs.multiplier);
      const calculatedBenchmark = Math.round(c.baseBenchmark * truckSpecs.multiplier);
      const deviationVal = calculatedBenchmark > 0
        ? (((calculatedQuote - calculatedBenchmark) / calculatedBenchmark) * 100).toFixed(1)
        : "0.0";

      const deviationText = parseFloat(deviationVal) < 0
        ? `低于大盘 ${Math.abs(deviationVal)}%`
        : `高于大盘 ${deviationVal}%`;

      // Apply penalty and downgrade if cutoff verification is ON and contains export items
      let finalScore = c.baseScore;
      let failsCutoffDueToSLA = false;
      let customAlert = null;

      if (hasExportFirstLegSelected && isFirstLegCutoffChecking && !c.passesCutoff) {
        finalScore = 58; // Downgraded below safety threshold
        failsCutoffDueToSLA = true;
        customAlert = `警告：该承运商（远东供应链）预计在途时效为 ${c.transit}，无法满足杭州下沙备料仓 12 小时安全截单发运窗口。`;
      }

      return {
        ...c,
        quote: calculatedQuote,
        benchmark: calculatedBenchmark,
        deviation: deviationText,
        score: finalScore,
        truckType: truckSpecs.type,
        classification: truckSpecs.classification,
        hasCutoffAlert: failsCutoffDueToSLA,
        cutoffAlertText: customAlert
      };
    });

    // Sort carriers based on dispatcher selected sort rule
    if (currentSort === "score") {
      return carriersList.sort((a, b) => b.score - a.score);
    } else if (currentSort === "price") {
      return carriersList.sort((a, b) => a.quote - b.quote);
    } else if (currentSort === "time") {
      return carriersList.sort((a, b) => a.transitHours - b.transitHours);
    } else if (currentSort === "kpi") {
      const getPct = (str) => parseFloat(str.replace("%", ""));
      return carriersList.sort((a, b) => getPct(b.onTime) - getPct(a.onTime));
    }

    return carriersList;
  }, [aggregatedStats.weight, currentSort, hasExportFirstLegSelected, isFirstLegCutoffChecking]);

  // Find the currently active selected carrier
  const activeSelectedCarrier = useMemo(() => {
    return dynamicCarriers.find(c => c.id === selectedCarrierId) || dynamicCarriers[0] || {};
  }, [selectedCarrierId, dynamicCarriers]);

  // Dynamic Spot market rates based on selection scale
  const dynamicSpotBids = useMemo(() => {
    const referenceFTLPrice = activeSelectedCarrier.quote || 3200;
    return initialSpotBids.map(bid => {
      return {
        ...bid,
        quote: Math.round(referenceFTLPrice * bid.quoteFactor)
      };
    });
  }, [activeSelectedCarrier]);

  const handleToggleRow = (order) => {
    if (order.status === "规划中") {
      triggerToast("此订单正被协同规划锁定，不可选择！", "error");
      return;
    }

    if (selectedIds.includes(order.id)) {
      setSelectedIds(selectedIds.filter(id => id !== order.id));
      triggerToast(`已从配载池中移除订单：${order.id}`, "info");
    } else {
      setSelectedIds([...selectedIds, order.id]);
      triggerToast(`已成功选定订单: ${order.id}`);
    }
  };

  const handleSelectAllToggle = (e) => {
    if (e.target.checked) {
      // ONLY select unlockable orders
      const unlockableIds = unlockableOrders.map(o => o.id);
      setSelectedIds(unlockableIds);
      triggerToast(`已一键选定所有待规划订单 (${unlockableIds.length} 笔)`);
    } else {
      setSelectedIds([]);
      triggerToast("已清空所有选定订单", "info");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-[#e2e8f0] font-sans flex flex-col antialiased">

      {/* Toast Notification */}
      {customToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`p-4 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-xl ${customToast.type === "error"
              ? "bg-red-950/95 border-red-500/50 text-red-200"
              : customToast.type === "info"
                ? "bg-indigo-950/95 border-indigo-500/50 text-indigo-100"
                : "bg-emerald-950/95 border-emerald-500/50 text-emerald-100"
            }`}>
            <Info className={`h-5 w-5 ${customToast.type === "error" ? "text-red-400" : customToast.type === "info" ? "text-indigo-400" : "text-emerald-400"}`} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">控制台调度日志</p>
              <p className="text-xs font-semibold mt-0.5 leading-relaxed">{customToast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-[#0b1125] border-b border-[#141f42] px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-950/50">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wider uppercase text-slate-100">国内大宗智慧干线控制塔</h1>
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-widest">
                货主配载调度端 Shipper Dispatch Terminal
              </span>
            </div>
            <p className="text-xs text-slate-400">Domestic Factory-to-Factory Trucking Dispatch & Logistics Control Tower</p>
          </div>
        </div>

        {/* Live sync indicators */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#101730] rounded-lg border border-[#1b2752]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ERP/WMS 主流同步: <strong className="text-slate-100 font-mono">10分钟前已同步</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#101730] rounded-lg border border-[#1b2752]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>车辆北斗定位平台: <strong className="text-cyan-400 font-mono">在途监控就绪</strong></span>
          </div>
        </div>
      </header>

      {/* Steps Navigation Bar */}
      <nav className="bg-[#090e20] border-b border-[#121c3b] py-3 px-6 overflow-x-auto shadow-inner shrink-0">
        <div className="flex items-center gap-2 min-w-[950px] justify-between">
          <div className="flex items-center gap-1">

            {/* Step 1 */}
            <button
              onClick={() => { setActiveStep(1); setShowTaskResult(false); }}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${activeStep === 1
                  ? "bg-[#14234b] text-cyan-400 border border-cyan-500/20 font-black"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${activeStep === 1 ? "bg-cyan-400 text-slate-950" : "bg-[#141f3e] text-slate-400"
                }`}>1</span>
              <span>1. 待规划订单池</span>
              <span className="bg-[#1e2e60] text-slate-300 font-mono text-[9px] px-1.5 py-0.2 rounded ml-1">
                {unlockableOrders.length} 待办
              </span>
            </button>

            <ChevronRight className="h-4 w-4 text-slate-700" />

            {/* Step 2 */}
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  triggerToast("未检测到选中订单！请先在订单池勾选订单。", "error");
                } else {
                  setActiveStep(2);
                  setShowTaskResult(false);
                }
              }}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${activeStep === 2
                  ? "bg-[#14234b] text-cyan-400 border border-cyan-500/20 font-black"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${activeStep === 2 ? "bg-cyan-400 text-slate-950" : "bg-[#141f3e] text-slate-400"
                }`}>2</span>
              <span>2. 运输规划页</span>
              {selectedIds.length > 0 && (
                <span className="bg-cyan-500/20 text-cyan-400 font-mono text-[9px] px-1.5 py-0.2 rounded ml-1">
                  已配载 {selectedIds.length}
                </span>
              )}
            </button>

            <ChevronRight className="h-4 w-4 text-slate-700" />

            {/* Step 3 */}
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  triggerToast("请先在订单池勾选并规划订单！", "error");
                } else {
                  setActiveStep(3);
                  setShowTaskResult(false);
                }
              }}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${activeStep === 3
                  ? "bg-[#14234b] text-cyan-400 border border-cyan-500/20 font-black"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${activeStep === 3 ? "bg-cyan-400 text-slate-950" : "bg-[#141f3e] text-slate-400"
                }`}>3</span>
              <span>3. 承运商推荐</span>
            </button>

            <ChevronRight className="h-4 w-4 text-slate-700" />

            {/* Step 4 */}
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  triggerToast("未完成承运商指派。请在第3步进行推荐确认。", "error");
                } else {
                  setActiveStep(4);
                }
              }}
              className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors border ${activeStep === 4
                  ? "bg-[#14234b] text-cyan-400 border-cyan-500/30 font-black"
                  : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${activeStep === 4 ? "bg-cyan-400 text-slate-950" : "bg-[#141f3e] text-slate-400"
                }`}>4</span>
              <span>4. 确认指派与结果</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-2">
            <span>安全时效基线要求:</span>
            <span className="bg-[#121c33] text-slate-300 border border-[#1b2a4c] px-2 py-0.5 rounded font-mono font-bold">
              长三角跨省干线直达准时率 &ge; 96.5%
            </span>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">

        {/* ========================================================== */}
        {/* PAGE 1: 订单池 / 待规划列表                                 */}
        {/* ========================================================== */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-fade-in text-xs font-semibold">

            {/* Header Area */}
            <div className="bg-[#0b1125] p-5 rounded-2xl border border-[#17254e] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                    订单池 / 待规划列表
                  </h2>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  统一对接货主 ERP/WMS 系统，调度员可勾选无锁定的待发货源，一键合并进入多维度干线排载空间模拟。
                </p>
                <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 bg-[#101d3a] border border-[#1d3368] rounded text-[10px] text-indigo-300">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span>今日实时同步：发料总单 28 笔，当前大盘挂起待规划共 3 笔。</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedIds.length === 0) {
                    triggerToast("未勾选任何订单，无法进入规划主线！", "error");
                  } else {
                    setActiveStep(2);
                    triggerToast(`已锁定 ${selectedIds.length} 笔订单，开始载入空间规划及干线配载约束计算。`, "success");
                  }
                }}
                className={`text-xs font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-md shrink-0 ${selectedIds.length > 0
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  }`}
              >
                <span>进入规划 ({selectedIds.length} 订单)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Row */}
            <div className="bg-[#0b1125] p-3 rounded-xl border border-[#17254e] flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-[#050814] px-3 py-1.5 rounded-lg border border-[#1a2b5d] w-80">
                <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="搜索订单号 / 提货地 / 交付目的地..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-slate-200 text-xs w-full p-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">运输类型:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#050814] text-slate-300 border border-[#1a2b5d] rounded px-2.5 py-1 focus:outline-none"
                >
                  <option value="all">全部类型 (整车 / 零担)</option>
                  <option value="整车">整车 (FTL)</option>
                  <option value="零担">零担 (LTL)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">业务场景:</span>
                <select
                  value={filterScenario}
                  onChange={(e) => setFilterScenario(e.target.value)}
                  className="bg-[#050814] text-slate-300 border border-[#1a2b5d] rounded px-2.5 py-1 focus:outline-none"
                >
                  <option value="all">全部场景标签</option>
                  <option value="内贸工厂到工厂">内贸工厂到工厂</option>
                  <option value="零担补位">零担配载补位</option>
                  <option value="前程陆运说明">外贸前程陆运</option>
                </select>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => { setFilterType("整车"); triggerToast("过滤：只看整车"); }}
                  className="bg-[#101b3a] hover:bg-[#152755] text-slate-300 text-[10px] px-2 py-1 rounded border border-[#1d316e]"
                >
                  只看整车
                </button>
                <button
                  onClick={() => { setFilterScenario("前程陆运说明"); triggerToast("过滤：下沙备料仓第一程件"); }}
                  className="bg-[#101b3a] hover:bg-[#152755] text-slate-300 text-[10px] px-2 py-1 rounded border border-[#1d316e]"
                >
                  外贸首程件
                </button>
              </div>

              <button
                onClick={() => { setSearchTerm(""); setFilterType("all"); setFilterScenario("all"); }}
                className="text-[10px] text-slate-400 hover:text-white underline ml-auto"
              >
                重置过滤器
              </button>
            </div>

            {/* Dynamic Stowage Bulk Action Bar */}
            <div className="bg-[#121b36] px-5 py-4 rounded-xl border border-[#233870] flex flex-wrap items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-slate-300">
                  当前已勾选配载货品：<strong className="text-cyan-400 font-mono text-sm">{selectedIds.length}</strong> 笔
                </span>
                <span className="text-slate-600">|</span>
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span>动态累计重量：<strong className="text-slate-200 font-mono text-xs">{aggregatedStats.weight} 吨</strong></span>
                  <span>动态累计体积：<strong className="text-slate-200 font-mono text-xs">{aggregatedStats.volume} m³</strong></span>
                  {aggregatedStats.weight > 0 && (
                    <span className="bg-[#1b2b54] text-slate-300 px-2.5 py-0.5 rounded border border-[#2d437e] text-[10px]">
                      预计所需车型: {aggregatedStats.weight <= 5.0 ? "6.8米车" : aggregatedStats.weight <= 10.0 ? "9.6米车" : "13.5米挂车"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setSelectedIds([]); triggerToast("已清空规划勾选项", "info"); }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline mr-2"
                >
                  清空已选
                </button>
                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => {
                    setActiveStep(2);
                    triggerToast(`合并规划已执行，已导入 ${selectedIds.length} 个订单到规划控制面板。`);
                  }}
                  className={`px-5 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${selectedIds.length > 0
                      ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow cursor-pointer"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                    }`}
                >
                  <span>立即执行空间配载判断</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* High-Contrast Main Table Area */}
            <div className="bg-[#0b1125] rounded-xl border border-[#17254e] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#101730] border-b border-[#17254e] text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={isAllUnlockableSelected}
                          onChange={handleSelectAllToggle}
                          className="rounded text-cyan-500 focus:ring-0 bg-[#050814] border-[#1a2b5d] cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4">订单编号</th>
                      <th className="py-3 px-3">数据来源</th>
                      <th className="py-3 px-4">提货地(Shipper)</th>
                      <th className="py-3 px-4">交付地(Destination)</th>
                      <th className="py-3 px-4 text-right">重量 / 体积</th>
                      <th className="py-3 px-4 text-center">规划运输类型</th>
                      <th className="py-3 px-4">最晚到货时限</th>
                      <th className="py-3 px-4">场景标签</th>
                      <th className="py-3 px-4 text-center">流向锁定状态</th>
                      <th className="py-3 px-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#152147]">
                    {orders
                      .filter(o => {
                        const matchesQuery = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.delivery.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesType = filterType === "all" || o.type === filterType;
                        const matchesScenario = filterScenario === "all" || o.scenario === filterScenario;
                        return matchesQuery && matchesType && matchesScenario;
                      })
                      .map(o => {
                        const isChecked = selectedIds.includes(o.id);
                        const isLocked = o.status === "规划中";

                        return (
                          <tr
                            key={o.id}
                            onClick={() => handleToggleRow(o)}
                            className={`hover:bg-[#121d3b] transition-colors cursor-pointer ${isChecked ? "bg-[#14264d] border-l-2 border-cyan-400" : ""
                              } ${isLocked ? "opacity-50 bg-[#090e1f]" : ""}`}
                          >
                            <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                disabled={isLocked}
                                checked={isChecked}
                                onChange={() => handleToggleRow(o)}
                                className={`rounded text-cyan-500 focus:ring-0 bg-[#050814] border-[#1a2b5d] ${isLocked ? "cursor-not-allowed bg-slate-800" : "cursor-pointer"
                                  }`}
                              />
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                              {o.id}
                            </td>
                            <td className="py-3.5 px-3 text-slate-400 font-semibold">
                              {o.source}
                            </td>
                            <td className="py-3.5 px-4 text-slate-200">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                <span>{o.pickup}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-200">
                              <div className="flex items-center gap-1 font-bold">
                                <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                <span>{o.delivery}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-slate-200 font-bold">
                              {o.weight} 吨 / {o.volume} m³
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${o.type === "整车"
                                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                }`}>
                                {o.type}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 font-mono">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                <span>{o.requiredArrival}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] ${o.scenario === "前程陆运说明"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/25 font-bold"
                                  : o.scenario === "零担补位"
                                    ? "bg-indigo-950 text-indigo-300 border border-indigo-900/40"
                                    : "bg-slate-900 text-slate-300 border border-slate-800"
                                }`}>
                                {o.scenario === "前程陆运说明" ? "外贸首程(下沙件)" : o.scenario}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {isLocked ? (
                                <span className="bg-[#241a0a] text-amber-400 border border-amber-900/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block">
                                  规划中 (锁定)
                                </span>
                              ) : (
                                <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full text-[10px] inline-block">
                                  待规划
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                              {isLocked ? (
                                <span className="text-slate-500">协同占用中</span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedIds([o.id]);
                                    setActiveStep(2);
                                    triggerToast(`已隔离其他项。专线导入单据 ${o.id} 的规划决策面板。`);
                                  }}
                                  className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                                >
                                  单载规划
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explanatory notes */}
            <div className="bg-[#0b1125] p-4 rounded-xl border border-[#17254e] text-xs text-slate-400 flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
              <span>
                💡 <strong>调度决策指引：</strong> 为防止重复配运，流向锁定状态为 [规划中] 的单据将处于防呆阻断状态，无法勾选或参与批量配载。
              </span>
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* PAGE 2: 运输规划页                                         */}
        {/* ========================================================== */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fade-in text-xs font-semibold">

            {/* Guard against empty selection */}
            {selectedIds.length === 0 ? (
              <div className="bg-[#0b1125] p-12 rounded-2xl border border-red-500/20 text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-base font-black text-slate-200">未检测到已选配载订单</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  请先返回第一步“待规划订单池”，至少勾选一笔有效的货主运单，再由决策系统为您测算运力配载及车辆车型。
                </p>
                <button
                  onClick={() => setActiveStep(1)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-2 rounded-lg"
                >
                  返回待规划列表
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#0b1125] p-4.5 rounded-xl border border-[#17254e] flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-1">
                      <span>订单池 / 待规划列表</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-cyan-400 font-bold">运输规划控制面板</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-cyan-400" />
                      长三角大宗专线配载方案决策
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      系统已根据您在 Screen 1 选择的订单货值、总重量与拼载路径，自动规划最适协议运力形态。
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveStep(3);
                      triggerToast("规划锁定：开始计算对应协议运力大盘的候选车队报价...", "success");
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow"
                  >
                    <span>查看推荐承运商列表</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Column 1: Dynamic Order Context Summary */}
                  <div className="space-y-4">
                    <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-3.5">
                      <span className="text-xs font-black text-cyan-400 block border-b border-[#17254e] pb-2 uppercase tracking-wider">
                        一、当前实选待配载明细 ({selectedOrdersData.length} 笔)
                      </span>

                      <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                        {selectedOrdersData.map((order) => (
                          <div key={order.id} className="bg-[#050814] p-3 rounded border border-[#152349] space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-cyan-400 font-bold">{order.id}</span>
                              <span className="text-slate-400 text-[10px]">{order.scenario}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>发货：{order.pickup}</span>
                              <span>交货：{order.delivery}</span>
                            </div>
                            <div className="flex justify-between text-[10.5px] text-slate-400 pt-1 border-t border-[#131f3b]">
                              <span>货量：{order.weight}吨 / {order.volume}m³</span>
                              <span>时效：{order.requiredArrival.split(" ")[1]} 达</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#050814] p-3 rounded-lg border border-[#1a2b5d] space-y-2">
                        <span className="text-slate-400 text-[10px] block">累计配配总计：</span>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-[#0e172e] p-1.5 rounded">
                            <span className="text-slate-500 block text-[9px]">总货重</span>
                            <strong className="text-slate-200 font-mono text-xs">{aggregatedStats.weight} 吨</strong>
                          </div>
                          <div className="bg-[#0e172e] p-1.5 rounded">
                            <span className="text-slate-500 block text-[9px]">总容积</span>
                            <strong className="text-slate-200 font-mono text-xs">{aggregatedStats.volume} m³</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-3">
                      <span className="text-xs font-black text-slate-200 block border-b border-[#17254e] pb-2 uppercase tracking-wider">
                        二、装卸配车物理约束
                      </span>

                      <div className="space-y-2.5 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">规划拟选流向：</span>
                          <span className="text-slate-200 font-bold">
                            {selectedOrdersData.length === 1
                              ? `${selectedOrdersData[0].pickup.replace("工厂", "")} ➔ ${selectedOrdersData[0].delivery.replace("客户仓", "").replace("备料仓", "")}`
                              : `多厂合并 ➔ 华东干线大宗大盘`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">时效级别：</span>
                          <span className="text-amber-400 font-bold">按最晚时效统一约束</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">车厢约束：</span>
                          <span>要求单仓高栏/全厢式防护</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">含外贸首程件：</span>
                          <span className={hasExportFirstLegSelected ? "text-amber-400 font-bold" : "text-slate-500"}>
                            {hasExportFirstLegSelected ? "是 (太仓 ➔ 杭州下沙)" : "否"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Visual Loading Space Simulator */}
                  <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-black text-cyan-400 block border-b border-[#17254e] pb-2 uppercase tracking-wider">
                        三、车型配载利用率预估
                      </span>

                      <div className="mt-4 p-4 bg-[#111e35] rounded-xl border border-[#20365c] space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                          <span className="font-black text-sm text-cyan-400">
                            系统建议方案：{aggregatedStats.weight > 10.0 ? "主推 13.5米 整车直发" : "主推 9.6米 / 6.8米 整车直发"}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          当前选定配载总重为 <strong className="font-mono text-cyan-400">{aggregatedStats.weight} 吨</strong>。
                          {aggregatedStats.weight > 15.0
                            ? "由于货重已经超过大型车辆极限值限制，系统已自动阻断多货拼配，建议单厂整车分别发运以降低在途货损及装卸超限安全惩罚风险。"
                            : "此批量配货重容比属于标准大宗普货，利用现有长三角干线白名单协议运力，时效最稳妥。"
                          }
                        </p>
                      </div>
                    </div>

                    {/* Stacking truck representation */}
                    <div className="bg-[#050814] rounded-xl p-5 border border-[#152349] flex flex-col items-center justify-center min-h-[150px] relative my-2">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#121d33_1px,transparent_1px),linear-gradient(to_bottom,#121d33_1px,transparent_1px)] bg-[size:16px_16px] opacity-10"></div>

                      <div className="relative w-full max-w-sm bg-[#0a1122] border border-slate-700 rounded-xl p-3 flex items-center gap-3 z-10 shadow-lg">
                        <div className="w-12 h-14 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-lg flex flex-col justify-center items-center text-[9px] text-slate-300 font-bold font-mono">
                          <span className="text-cyan-400 text-[10px]">苏E</span>
                          <span>FTL-03</span>
                        </div>
                        <div className="flex-1 h-14 bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border border-dashed border-cyan-400/60 rounded-lg flex flex-col justify-center items-center p-1">
                          <span className="text-[11px] text-cyan-400 font-black uppercase">
                            配载有效利用率：{Math.min(100, parseFloat((aggregatedStats.weight * 7.5).toFixed(1)))}%
                          </span>
                          <span className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                            车型: {aggregatedStats.weight <= 5.0 ? "6.8米厢式车" : "9.6米厢式车"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-3">建议配车规格: 国内工厂干线标准白名单大货车</span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-lg text-[10.5px] text-slate-400 leading-normal">
                      💡 <strong>拼载规则：</strong> 合载可极大分摊工厂到客户仓的单吨运费，但起讫点数量超过3个以上时，时效将会出现 2-3 小时理货积压延误。
                    </div>
                  </div>

                  {/* Column 3: FTL vs LTL Comparison (As specified by layout rules) */}
                  <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-black text-amber-400 block border-b border-[#17254e] pb-2 uppercase tracking-wider">
                        四、干线运力方案对比 (FTL 与 LTL 对照)
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        基于长三角干线实选货重 <strong className="text-slate-200">{aggregatedStats.weight} 吨</strong> 进行的纯数字对账测算：
                      </p>

                      <div className="bg-[#050814] rounded-lg border border-[#152349] overflow-hidden mt-3.5">
                        <table className="w-full text-left text-[11px] font-semibold">
                          <thead>
                            <tr className="bg-[#101730] border-b border-[#17254e] text-slate-400">
                              <th className="py-2 px-3">对账维度</th>
                              <th className="py-2 px-3">整车直发 (FTL)</th>
                              <th className="py-2 px-3">零担拼装 (LTL)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#152147]">
                            <tr>
                              <td className="py-2.5 px-3 text-slate-400">时效稳定性</td>
                              <td className="py-2.5 px-3 text-emerald-400 font-bold">高 (直接发车)</td>
                              <td className="py-2.5 px-3 text-amber-500 font-bold">中 (拼载中转)</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 text-slate-400">单吨综合运价</td>
                              <td className="py-2.5 px-3 text-slate-200">
                                ¥{aggregatedStats.weight > 0 ? Math.round(activeSelectedCarrier.quote / aggregatedStats.weight) : 0}/吨
                              </td>
                              <td className="py-2.5 px-3 text-amber-400">
                                约 ¥380/吨 (轻抛件)
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 text-slate-400">货损索赔几率</td>
                              <td className="py-2.5 px-3 text-emerald-400">极低 (全封闭直达)</td>
                              <td className="py-2.5 px-3 text-amber-400">中高 (多次转运)</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 text-slate-400">本单适配决策</td>
                              <td className="py-2.5 px-3 text-cyan-400 font-black">
                                {aggregatedStats.weight > 10.0 ? "强制整车" : "系统推荐FTL"}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {aggregatedStats.weight > 10.0 ? "超限无法使用" : "仅作为备选"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {aggregatedStats.weight > 10.0 && (
                        <div className="mt-3 p-2 bg-red-950/20 border border-red-500/20 text-[10px] rounded text-red-300">
                          ⚠️ <strong>货量过载阻断通知：</strong> 货源总重量已超过常规拼载上限，无法采用零担拼装(LTL)替代。
                        </div>
                      )}
                    </div>

                    <div className="bg-[#14234b] p-3 rounded-lg border border-cyan-500/10 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-black block">运力匹配建议说明</span>
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-200">
                          推荐规格: {aggregatedStats.weight <= 5 ? "6.8米中卡" : "9.6米厢车"}
                        </span>
                        <span className="text-emerald-400 font-bold">协议专线在仓充沛</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-[#101730] rounded-xl border border-[#17254e] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-slate-400 text-xs">
                    * 本次大宗公路运输方案符合道路货运法规与轴重配载标准。
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-5 py-2 rounded-lg bg-[#141f3e] text-slate-300 hover:text-white border border-[#17254e] transition-colors"
                    >
                      返回待规划列表
                    </button>
                    <button
                      onClick={() => {
                        setActiveStep(3);
                        triggerToast("方案已锁定，推荐承运商列表已调取并对账完毕。");
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black px-8 py-2 rounded-lg text-xs"
                    >
                      查看承运商推荐
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ========================================================== */}
        {/* PAGE 3: 承运商推荐 / 竞价结果区                             */}
        {/* ========================================================== */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-fade-in text-xs font-semibold">

            {/* Guard against empty selection */}
            {selectedIds.length === 0 ? (
              <div className="bg-[#0b1125] p-12 rounded-2xl border border-red-500/20 text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                <h3 className="text-base font-black text-slate-200">无正在规划的订单，无法获取推荐</h3>
                <button onClick={() => setActiveStep(1)} className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-lg">
                  返回订单池
                </button>
              </div>
            ) : (
              <>
                {/* Header with Sorting Information & Trigger */}
                <div className="bg-[#0b1125] p-5 rounded-2xl border border-[#17254e] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-cyan-400" />
                      <h2 className="text-sm font-black text-slate-100 tracking-wide uppercase">
                        协议承运商契约推荐列表
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
                        排序规则：{currentSort === "score" ? "综合评分最高优先" : currentSort === "price" ? "价格最低优先" : currentSort === "time" ? "预计时效最优优先" : "准时履约率优先"}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        基于长三角白名单合作车队的实际协议报价进行核算，杜绝暗箱操作。
                      </span>
                    </div>
                  </div>

                  <div className="text-slate-500 text-[11px] font-bold">
                    发运货品重量：<span className="text-cyan-400 font-mono text-xs">{aggregatedStats.weight} 吨</span> |
                    拟定车型：<span className="text-slate-200">{aggregatedStats.weight <= 5.0 ? "6.8米中型车" : "9.6米厢式车"}</span>
                  </div>
                </div>

                {/* Sorting Tabs */}
                <div className="flex flex-wrap items-center justify-between border-b border-[#141f42] pb-3 gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setCurrentSort("score"); triggerToast("已切换至：综合评分最高优先"); }}
                      className={`px-4 py-2 rounded-lg font-black tracking-wider transition-all flex items-center gap-1.5 ${currentSort === "score"
                          ? "bg-[#14234b] text-cyan-400 border border-cyan-500/20"
                          : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      综合评分优先 (SLA)
                    </button>

                    <button
                      onClick={() => { setCurrentSort("price"); triggerToast("已切换至：协议合同低价优先"); }}
                      className={`px-4 py-2 rounded-lg font-black tracking-wider transition-all flex items-center gap-1.5 ${currentSort === "price"
                          ? "bg-[#14234b] text-cyan-400 border border-cyan-500/20"
                          : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <Coins className="h-4 w-4 text-emerald-400" />
                      协议合同底价优先
                    </button>

                    <button
                      onClick={() => { setCurrentSort("time"); triggerToast("已切换至：运输配送时效最快优先"); }}
                      className={`px-4 py-2 rounded-lg font-black tracking-wider transition-all flex items-center gap-1.5 ${currentSort === "time"
                          ? "bg-[#14234b] text-cyan-400 border border-cyan-500/20"
                          : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <Clock className="h-4 w-4 text-indigo-400" />
                      预计时效优先
                    </button>

                    <button
                      onClick={() => { setCurrentSort("kpi"); triggerToast("已切换至：KPI履约准时率优先"); }}
                      className={`px-4 py-2 rounded-lg font-black tracking-wider transition-all flex items-center gap-1.5 ${currentSort === "kpi"
                          ? "bg-[#14234b] text-cyan-400 border border-cyan-500/20"
                          : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <CheckCircle className="h-4 w-4 text-amber-400" />
                      准时履约率优先
                    </button>
                  </div>

                  <div className="text-slate-500 text-[10.5px]">
                    大通道协议版本：<strong className="text-slate-400">CHN-East-FTL-2026.02</strong>
                  </div>
                </div>

                { }
                {/* 3-Card Structured Lateral Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {dynamicCarriers.map((carrier) => {
                    const isSelected = selectedCarrierId === carrier.id;
                    const isSlaIntercepted = hasExportFirstLegSelected && isFirstLegCutoffChecking && !carrier.passesCutoff;

                    return (
                      <div
                        key={carrier.id}
                        onClick={() => {
                          if (isSlaIntercepted) {
                            triggerToast("时效拦截：远东供应链运输耗时较长，无法用于杭州下沙前程截单订单。", "error");
                            return;
                          }
                          setSelectedCarrierId(carrier.id);
                          triggerToast(`已选定干线承运商：${carrier.name}`);
                        }}
                        className={`rounded-xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${isSlaIntercepted
                            ? "border-red-900 bg-[#1e0d14] opacity-85 shadow-lg shadow-red-950/20"
                            : isSelected
                              ? "border-cyan-500 bg-[#101b31] shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500/20"
                              : "border-[#17254e] bg-[#0b1125] hover:border-slate-500"
                          }`}
                      >

                        {/* Card Header */}
                        <div className={`px-4 py-3 border-b flex justify-between items-center ${isSlaIntercepted ? "bg-red-950/30 border-red-950/40" : "bg-[#101730] border-[#17254e]"
                          }`}>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${isSlaIntercepted
                                ? "bg-red-500 text-slate-950"
                                : carrier.marker === "系统推荐"
                                  ? "bg-cyan-500 text-slate-950"
                                  : carrier.marker === "时效最优"
                                    ? "bg-indigo-500 text-white"
                                    : "bg-emerald-500 text-slate-950"
                              }`}>
                              {isSlaIntercepted ? "时效拦截" : carrier.marker}
                            </span>
                            <div>
                              <h4 className="font-extrabold text-slate-100 text-xs block">{carrier.name}</h4>
                              <span className="text-[10px] text-slate-400 block mt-0.5">运能: {carrier.capacity}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 font-bold block">综合得分</span>
                            <span className={`text-sm font-mono font-black ${isSlaIntercepted ? "text-red-400 line-through" : "text-cyan-400"}`}>
                              {carrier.score}/100
                            </span>
                          </div>
                        </div>

                        {/* Structured Comparison Grid (Strictly Aligned Specifications) */}
                        <div className="p-4 space-y-3 flex-1">

                          {/* 1. Pricing Row */}
                          <div className="bg-[#050814] p-3 rounded-lg border border-[#152349] flex justify-between items-center">
                            <div>
                              <span className="text-slate-500 text-[9px] uppercase font-bold block">合同协议报价</span>
                              <span className="text-sm font-black font-mono text-slate-100">¥{carrier.quote.toLocaleString()} 元</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-500 text-[9px] uppercase font-bold block">大盘指导 / 偏差</span>
                              <div className="flex items-center gap-1 justify-end font-mono text-[10.5px]">
                                <span className="text-slate-400">¥{carrier.benchmark}</span>
                                <span className="text-slate-600">|</span>
                                <span className={isSlaIntercepted ? "text-red-400" : "text-emerald-400"}>{carrier.deviation}</span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Structured Comparison Attribute Rows */}
                          <div className="space-y-2 border-b border-[#152349] pb-3 text-[11px]">
                            {/* Row A: Transit Time */}
                            <div className="flex justify-between items-center py-1 border-b border-[#121c33]/40">
                              <span className="text-slate-500 font-medium">预计在途时效:</span>
                              <span className="text-slate-200 font-bold font-mono">{carrier.transit}</span>
                            </div>

                            {/* Row B: KPI On-time Rate */}
                            <div className="flex justify-between items-center py-1 border-b border-[#121c33]/40">
                              <span className="text-slate-500 font-medium">历史准时履约率:</span>
                              <span className="text-slate-200 font-bold font-mono">{carrier.onTime}</span>
                            </div>

                            {/* Row C: KPI Exception Rate */}
                            <div className="flex justify-between items-center py-1 border-b border-[#121c33]/40">
                              <span className="text-slate-500 font-medium">异常 / 货损率:</span>
                              <span className="text-slate-200 font-bold font-mono">{carrier.exception}</span>
                            </div>

                            {/* Row D: Dynamic Truck Specs */}
                            <div className="flex justify-between items-center py-1">
                              <span className="text-slate-500 font-medium">拟定匹配车型:</span>
                              <span className="text-slate-200 font-bold text-right truncate max-w-[150px]">{carrier.truckType.split(" ")[0]}</span>
                            </div>
                          </div>

                          {/* 3. Operational Logic / Comments */}
                          <div className="space-y-1.5 pt-1 text-[11px]">
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[9px] px-1.5 py-0.2 bg-slate-900 text-slate-300 border border-slate-800 rounded">
                                {carrier.scenario}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 bg-[#121e3d] text-indigo-300 border border-indigo-900/30 rounded">
                                {carrier.subScenario}
                              </span>
                            </div>

                            <div className="text-[10.5px] leading-relaxed">
                              <strong className="text-slate-300 block mb-0.5">智能决策依据：</strong>
                              {isSlaIntercepted ? (
                                <span className="text-red-400 font-bold block">{carrier.cutoffAlertText}</span>
                              ) : (
                                <span className="text-slate-400 block">{carrier.reason}</span>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* Card footer trigger */}
                        <div className="p-3 border-t border-[#152349] bg-[#050814]/60">
                          {isSlaIntercepted ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded py-2 text-center text-[10px] text-red-400 font-black flex items-center justify-center gap-1">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                              <span>时效拦截 · 不予指派</span>
                            </div>
                          ) : isSelected ? (
                            <div className="bg-cyan-500 text-slate-950 rounded py-2 text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow">
                              <Check className="h-3.5 w-3.5 stroke-[3px]" />
                              <span>已选定为此单承运商</span>
                            </div>
                          ) : (
                            <div className="text-center py-2 text-slate-400 hover:text-white transition-colors text-[10px] font-bold">
                              点击选定为此单协议车队
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

                { }
                {/* Lower Support Area (Rule Notes, Market Benchmarks, Spot bidding) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Note 1: Export First-Leg explanation note (Subtle supporting rule explanation) */}
                  <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          外贸前程陆运时效规则说明
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        当所选配载中包含外贸杭州下沙前置运输件（如太仓工厂 ➔ 下沙备件仓）时，公路联动政策要求调度系统自动进行发运时限安全窗口核验：
                      </p>
                    </div>

                    <div className="bg-[#180a0a] p-3 rounded-lg border border-red-950/40 space-y-2">
                      <div className="text-[10.5px] text-slate-300 leading-normal">
                        <span className="font-bold text-red-400 block mb-1">
                          时效强校验规则：
                        </span>
                        <span>
                          杭州下沙备货仓最晚入库时限为 12:00。远东供应链协议运输时效为 13 小时，预计超出时限缓冲（13h &gt; 12h 安全截单发运窗口），故自动被判定为不符。
                        </span>
                      </div>

                      {/* Decoupled Interactive Toggle - Hidden inside the rule note card for demo transparency */}
                      {hasExportFirstLegSelected && (
                        <div className="flex items-center justify-between pt-1 border-t border-red-900/30">
                          <span className="text-[10px] text-slate-400">开启截单窗口校验降级:</span>
                          <button
                            onClick={() => {
                              setIsFirstLegCutoffChecking(!isFirstLegCutoffChecking);
                              triggerToast(
                                !isFirstLegCutoffChecking
                                  ? "杭州下沙备件仓12小时安全截单发运核验已启用。"
                                  : "已关闭截单窗口核验，远东供应链推荐评级恢复正常。",
                                "info"
                              );
                            }}
                            className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${isFirstLegCutoffChecking ? "bg-red-500 text-slate-950" : "bg-slate-800 text-slate-400"
                              }`}
                          >
                            {isFirstLegCutoffChecking ? "已启用拦截" : "已忽略拦截"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Note 2: Domestic market rate benchmark */}
                  <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        长三角大宗专线运费合理度对账
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        系统基于华东整车货运大盘，自动捕获同吨位、同车型的柴油公路运费数据，监控协议运费偏差值：
                      </p>
                    </div>

                    <div className="bg-[#050814] p-3 rounded-lg border border-[#152349] text-[10.5px] font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">大盘均价参考</span>
                        <span className="text-slate-300">¥{activeSelectedCarrier.benchmark} 元</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">拟指派车队协议价</span>
                        <span className="text-cyan-400 font-bold">¥{activeSelectedCarrier.quote} 元</span>
                      </div>
                      <div className="flex justify-between border-t border-[#152349] pt-1.5 font-sans">
                        <span className="text-slate-400 font-bold">运费降幅成本</span>
                        <span className="text-emerald-400 font-bold">{activeSelectedCarrier.deviation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Note 3: Spot Bidding branch */}
                  <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                        <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                        货主招标 / 社会运力补充竞价
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        当协议车队运力紧张时，系统同步调取长三角社会整车运力招标平台临时补充竞标：
                      </p>
                    </div>

                    <div className="space-y-2 text-[10.5px]">
                      {dynamicSpotBids.map((bid, idx) => (
                        <div key={idx} className="bg-[#050814] p-2 rounded border border-[#152349] font-mono text-[10px] space-y-1">
                          <div className="flex justify-between font-bold text-slate-300">
                            <span>{bid.name}</span>
                            <span className="text-emerald-400">¥{bid.quote} 元 | {bid.transit}</span>
                          </div>
                          <p className="text-slate-500 font-sans">{bid.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Primary Action bar */}
                <div className="p-4 bg-[#101730] rounded-xl border border-cyan-500/30 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-slate-300">拟选定指派车队:</span>
                    <strong className="text-white text-sm">
                      {activeSelectedCarrier.name} (协议价: ¥{activeSelectedCarrier.quote?.toLocaleString()} 元, SLA: {activeSelectedCarrier.onTime})
                    </strong>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-5 py-2.5 rounded-lg bg-[#141f3e] text-slate-300 hover:text-white border border-[#17254e] transition-colors"
                    >
                      返回规划调整
                    </button>
                    <button
                      onClick={() => {
                        setActiveStep(4);
                        triggerToast(`契约指派生效。请对 ${selectedIds.length} 笔合并订单进行出厂指派二次审核确认。`);
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black px-8 py-2.5 rounded-lg text-xs"
                    >
                      确认指派 (Proceed to Confirm)
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ========================================================== */}
        {/* PAGE 4: 确认指派与任务生成结果                             */}
        {/* ========================================================== */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-fade-in text-xs font-semibold">

            {/* Guard against empty selection */}
            {selectedIds.length === 0 ? (
              <div className="bg-[#0b1125] p-12 rounded-2xl border border-red-500/20 text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                <h3 className="text-base font-black text-slate-200">无正在指派的任务</h3>
                <button onClick={() => setActiveStep(1)} className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-lg">
                  返回订单池
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#0b1125] p-4.5 rounded-xl border border-[#17254e] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                      <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" />
                      指派二次复核及订单下发
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      货主调度复核窗口：请确认协议契约金额及配车吨位是否合理，再生成正式运输任务。
                    </p>
                  </div>

                  {!showTaskResult ? (
                    <span className="bg-[#14234b] text-cyan-400 border border-cyan-500/25 px-2.5 py-1 rounded text-[10.5px]">
                      状态: 待最终授权下发
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded text-[10.5px] font-black flex items-center gap-1 uppercase">
                      <CheckCircle2 className="h-3.5 w-3.5 animate-pulse" /> 调度指派确认成功
                    </span>
                  )}
                </div>

                { }
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left Column: Confirmation Details & Linked Orders */}
                  <div className="lg:col-span-2 space-y-4">

                    <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-4">
                      <span className="text-xs font-black text-slate-200 block border-b border-[#17254e] pb-2 uppercase tracking-wide">
                        一、承运车队契约二次确认信息
                      </span>

                      <p className="text-[11px] text-slate-400 leading-normal">
                        系统将向承运车队 <strong className="text-slate-100 font-bold">{activeSelectedCarrier.name}</strong> 的华东干线车调度管理终端自动发送提发货装车通知。请对账无误后签字发布：
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="bg-[#050814] p-3 rounded-lg border border-[#17254e] space-y-1">
                          <span className="text-slate-500 text-[9.5px] uppercase font-bold block">拟定承运车队</span>
                          <span className="text-cyan-400 block font-black text-[11px]">{activeSelectedCarrier.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">SLA准时：{activeSelectedCarrier.onTime}</span>
                        </div>

                        <div className="bg-[#050814] p-3 rounded-lg border border-[#17254e] space-y-1">
                          <span className="text-slate-500 text-[9.5px] uppercase font-bold block">拟选定配送车型</span>
                          <span className="text-slate-200 block font-black text-[11px]">{activeSelectedCarrier.truckType?.split(" ")[0]}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">货量：{aggregatedStats.weight} 吨 / {aggregatedStats.volume} m³</span>
                        </div>

                        <div className="bg-[#050814] p-3 rounded-lg border border-[#17254e] space-y-1">
                          <span className="text-slate-500 text-[9.5px] uppercase font-bold block">总运费结算额</span>
                          <span className="text-emerald-400 block font-black text-xs font-mono">¥{activeSelectedCarrier.quote?.toLocaleString()} 元</span>
                          <span className="text-[10px] text-slate-400 block mt-1">{activeSelectedCarrier.deviation}</span>
                        </div>
                      </div>

                      <div className="bg-[#121d33] p-3 rounded-lg border border-cyan-500/15 text-[11.5px] text-slate-300">
                        <strong>💡 决策追溯备忘：</strong>
                        <span>
                          本次合并排载符合道路运输规范，运力准时率为 <strong>{activeSelectedCarrier.onTime}</strong>。运价与市场参考价对账合理，满足时效要求。
                          {hasExportFirstLegSelected && " 包含下沙备料仓前程件，系统已二次加锁时效安全差值验证。"}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Table displaying actually selected sub-orders */}
                    <div className="bg-[#0b1125] rounded-xl border border-[#17254e] overflow-hidden">
                      <div className="p-3.5 bg-[#101730] border-b border-[#17254e] flex justify-between items-center">
                        <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                          本车合并承运的原发料单列表 ({selectedOrdersData.length} 笔)
                        </span>
                        <span className="text-slate-400 text-[10.5px]">
                          货品总计： <strong className="text-cyan-400">{aggregatedStats.weight} 吨</strong>
                        </span>
                      </div>

                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="bg-[#050814] text-slate-500 text-[10px] font-bold border-b border-[#17254e] uppercase">
                            <th className="py-2.5 px-4">发料单号</th>
                            <th className="py-2.5 px-4">提货 ➔ 卸货地点</th>
                            <th className="py-2.5 px-4 text-right">重量 / 体积</th>
                            <th className="py-2.5 px-4 text-center">状态同步代码</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#152147]">
                          {selectedOrdersData.map(o => (
                            <tr key={o.id} className="hover:bg-[#121d3b]">
                              <td className="py-3 px-4 font-mono font-bold text-slate-200">
                                {o.id}
                              </td>
                              <td className="py-3 px-4 text-slate-300">
                                <span className="font-bold">{o.pickup}</span> &rarr; <span>{o.delivery}</span>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-slate-400 font-bold">
                                {o.weight} 吨 / {o.volume} m³
                              </td>
                              <td className="py-3 px-4 text-center">
                                {showTaskResult ? (
                                  <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded text-[10px]">
                                    派单成功
                                  </span>
                                ) : (
                                  <span className="text-slate-400">待指派下发</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>

                  {/* Right Column: Submission Feedback & Success Result Card */}
                  <div className="space-y-4">

                    {!showTaskResult ? (
                      <div className="bg-[#0b1125] p-5 rounded-xl border border-[#17254e] space-y-4 flex flex-col justify-between min-h-[300px]">
                        <div className="space-y-3">
                          <span className="text-xs font-black text-cyan-400 block border-b border-[#17254e] pb-2 uppercase">
                            下发确认 Checklist
                          </span>

                          <div className="space-y-3 text-slate-300">
                            <div className="flex justify-between border-b border-[#131f3b] pb-2 text-[11px]">
                              <span>指派车队：</span>
                              <strong className="text-slate-100">{activeSelectedCarrier.name}</strong>
                            </div>
                            <div className="flex justify-between border-b border-[#131f3b] pb-2 text-[11px]">
                              <span>拟结算运费：</span>
                              <strong className="text-emerald-400 font-mono">¥{activeSelectedCarrier.quote?.toLocaleString()} 元</strong>
                            </div>
                            <div className="flex justify-between border-b border-[#131f3b] pb-2 text-[11px]">
                              <span>承诺时效：</span>
                              <strong className="text-amber-400 font-mono">{activeSelectedCarrier.transit}</strong>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span>发料单总数：</span>
                              <strong className="font-mono">{selectedIds.length} 笔订单</strong>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#17254e] space-y-4">
                          <p className="text-[10.5px] text-slate-400 leading-relaxed">
                            💡 <strong>调度提示：</strong> 点击“确认并生成任务”后，系统将自动通过 API 通知太仓/嘉定厂区排队看板。
                          </p>

                          <button
                            onClick={() => {
                              setShowTaskResult(true);
                              triggerToast("大宗干线运输单指派成功，正式任务下达！", "success");
                            }}
                            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black py-3 rounded-lg text-xs uppercase tracking-wider transition-all shadow-md"
                          >
                            确认并生成任务
                          </button>
                        </div>
                      </div>
                    ) : (

                      /* Dynamic Task Generation Success Panel */
                      <div className="bg-[#0a221b] p-5 rounded-xl border border-emerald-500/30 space-y-4 animate-fade-in">

                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-emerald-900/40">
                          <div className="p-2 bg-emerald-500 text-slate-950 rounded-lg">
                            <CheckCircle className="h-5 w-5 animate-pulse" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-emerald-400 text-xs">国内干线运输任务已生成</h4>
                            <span className="text-[10px] text-slate-400 block uppercase font-mono">TSK Process Complete</span>
                          </div>
                        </div>

                        <div className="bg-[#050814] p-3.5 rounded-xl border border-[#17254e] space-y-3 font-mono text-[11px]">

                          <div className="flex justify-between items-center pb-1.5 border-b border-[#121c33]">
                            <span className="text-slate-500 font-sans">新任务 ID</span>
                            <span className="text-cyan-400 font-bold">TSK-20260520-001</span>
                          </div>

                          <div className="flex justify-between items-center pb-1.5 border-b border-[#121c33]">
                            <span className="text-slate-500 font-sans">承运商</span>
                            <span className="text-slate-200 font-sans font-bold">{activeSelectedCarrier.name}</span>
                          </div>

                          <div className="flex justify-between items-center pb-1.5 border-b border-[#121c33]">
                            <span className="text-slate-500 font-sans">执行车辆规格</span>
                            <span className="text-slate-200 font-sans max-w-[130px] truncate block text-right">{activeSelectedCarrier.truckType}</span>
                          </div>

                          <div className="flex justify-between items-center pb-1.5 border-b border-[#121c33]">
                            <span className="text-slate-500 font-sans">流向状态</span>
                            <span className="text-emerald-400 font-sans font-bold bg-emerald-950/40 px-2 py-0.2 rounded border border-emerald-900/30">
                              已指派 (车队接单中)
                            </span>
                          </div>

                          <div className="flex justify-between items-center pb-1.5 border-b border-[#121c33]">
                            <span className="text-slate-500 font-sans">创建时间</span>
                            <span className="text-slate-400">2026-05-20 15:20</span>
                          </div>

                          <div className="pt-1">
                            <span className="text-slate-500 font-sans block mb-1">下一步建议</span>
                            <p className="text-slate-300 font-sans leading-relaxed text-[10px]">
                              该运输任务已进入承运商终端，厂内排班系统已为本次 {aggregatedStats.weight} 吨货品分配提货台位，等待GPS/北斗绑签入场。
                            </p>
                          </div>

                        </div>

                        <div className="bg-emerald-950/20 p-3 rounded border border-emerald-900/30 text-emerald-400 text-[10.5px] leading-relaxed">
                          <span>通知：已通过联动API自动锁闭提货流程。车辆将在入场地过磅后开启北斗卫星全链条在途轨迹监控。</span>
                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-[#0b1125] rounded-xl border border-[#17254e] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-slate-400 text-[11px]">
                    {showTaskResult
                      ? "✓ 本次大宗发运调度排配闭环已圆满达成。运单状态数据已沉淀入库。"
                      : "二次复核将核验提发装车时效及大盘合同费率安全边际。"
                    }
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedIds([]);
                        setShowTaskResult(false);
                        setActiveStep(1);
                        triggerToast("已清空并返回订单池首页。");
                      }}
                      className="px-5 py-2 rounded-lg bg-[#101730] text-[#a0aec0] hover:text-white border border-[#17254e] font-bold text-xs"
                    >
                      返回订单池首页
                    </button>

                    <button
                      onClick={() => {
                        triggerToast("正在接入华东工厂实时货运北斗在途地图（模拟北斗接口正常）...", "success");
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow"
                    >
                      查看在途运输任务 (北斗监控)
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#050814] border-t border-[#121c3b] py-3.5 px-6 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between gap-2 shrink-0 font-semibold">
        <span>国内大宗智慧干线控制塔 v1.0 - Shipper Dispatcher Terminal</span>
        <div className="flex gap-4 justify-center">
          <span className="hover:underline cursor-pointer" onClick={() => triggerToast("大宗陆路装卸安全国标已验证通过", "success")}>
            装卸安全协议标准
          </span>
          <span>|</span>
          <span className="hover:underline cursor-pointer" onClick={() => triggerToast("全国货运在途北斗卫星接口同步中...", "success")}>
            北斗卫星监控联通: 正常
          </span>
        </div>
      </footer>

    </div>
  );
}