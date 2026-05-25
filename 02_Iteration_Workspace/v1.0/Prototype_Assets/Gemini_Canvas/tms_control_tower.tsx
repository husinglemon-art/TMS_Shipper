import React, { useState, useMemo, useEffect } from 'react';
import {
  Truck,
  Database,
  Search,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Coins,
  SlidersHorizontal,
  Check,
  AlertCircle,
  FileText,
  RefreshCw,
  Sliders,
  Filter,
  CheckSquare,
  Square,
  Inbox,
  User,
  ShieldAlert,
  ClipboardList,
  ChevronDown,
  Lock,
  Building
} from 'lucide-react';

const INITIAL_ORDERS = [
  {
    id: "ORD-20260520-001",
    source: "ERP同步",
    pickup: "上海嘉定工厂",
    delivery: "苏州工业园客户仓",
    weight: 8.5,
    volume: 22.0,
    type: "整车",
    requiredArrival: "2026-05-21 18:00",
    scenario: "内贸工厂到工厂",
    status: "待规划",
    description: "标准协议干线调拨，厂区出货质检已通过。"
  },
  {
    id: "ORD-20260520-002",
    source: "WMS同步",
    pickup: "昆山分拨中心",
    delivery: "宁波北仑仓",
    weight: 3.2,
    volume: 11.0,
    type: "零担",
    requiredArrival: "2026-05-21 16:00",
    scenario: "零担补位",
    status: "待规划",
    description: "拼单货源，建议调度员评估整车直发或拼车成本。"
  },
  {
    id: "ORD-20260520-003",
    source: "ERP同步",
    pickup: "太仓干线工厂",
    delivery: "杭州下沙备料仓",
    weight: 6.8,
    volume: 18.0,
    type: "整车",
    requiredArrival: "2026-05-21 12:00",
    scenario: "内贸工厂到工厂", // Restructured as standard domestic scenario
    isSpecialCutoff: true,      // Quiet boolean marker for the Screen 3 rule note 
    status: "待规划",
    description: "工厂急需装配料，涉及下沙备料仓严格的12小时卸货窗口红线。"
  },
  {
    id: "ORD-20260520-004",
    source: "ERP同步",
    pickup: "无锡制造工厂",
    delivery: "常州客户仓",
    weight: 7.1,
    volume: 20.0,
    type: "整车",
    requiredArrival: "2026-05-21 20:00",
    scenario: "内贸工厂到工厂",
    status: "规划中", // Pre-locked order representing active dispatcher workspace lock
    description: "协同二组正在进行合并派车，当前已在后台锁定。"
  }
];

const INITIAL_CARRIERS = [
  {
    id: "CARR-SHUNDA",
    name: "顺达物流",
    score: 92,
    baseQuote: 3200,
    baseBenchmark: 3400,
    transit: "10 小时",
    transitHours: 10,
    onTime: "96%",
    exception: "1.2%",
    fulfillment: "98%",
    capacity: "可接单",
    tag: "整车直发",
    reason: "常协协议价更优，线路适配度高，适合当前整车直发场景。",
    isPreferred: true,
    passesCutoff: true
  },
  {
    id: "CARR-HUADONG",
    name: "华东快运",
    score: 90,
    baseQuote: 3380,
    baseBenchmark: 3400,
    transit: "8 小时",
    transitHours: 8,
    onTime: "98%",
    exception: "0.8%",
    fulfillment: "99%",
    capacity: "可接单",
    tag: "整车直发",
    reason: "时效表现更优，自营车队直发调度，时效保障强，成本略高。",
    isPreferred: false,
    passesCutoff: true
  },
  {
    id: "CARR-YUANDONG",
    name: "远东供应链",
    score: 88,
    baseQuote: 2950,
    baseBenchmark: 3400,
    transit: "13 小时", // Over 12 hours - fails cutoff validation when activated
    transitHours: 13,
    onTime: "94%",
    exception: "1.5%",
    fulfillment: "96%",
    capacity: "可接单",
    tag: "零担补位",
    reason: "协议运价低，但在途时效较长（13小时），时效安全冗余偏低。",
    isPreferred: false,
    passesCutoff: false
  }
];

export default function App() {
  const [activeStep, setActiveStep] = useState(1); // Defaulting to the Order Pool
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedIds, setSelectedIds] = useState(["ORD-20260520-001", "ORD-20260520-003"]); // Default selected standard domestic items

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterScenario, setFilterScenario] = useState("all");

  // Carrier recommendation logic parameters
  const [currentSort, setCurrentSort] = useState("score");
  const [isCutoffChecking, setIsCutoffChecking] = useState(true); // Control special case check
  const [selectedCarrierId, setSelectedCarrierId] = useState("CARR-SHUNDA");

  // Submission flags
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.pickup.includes(searchTerm) ||
        o.delivery.includes(searchTerm);
      const matchType = filterType === "all" || o.type === filterType;
      const matchScenario = filterScenario === "all" || o.scenario === filterScenario;
      return matchSearch && matchType && matchScenario;
    });
  }, [orders, searchTerm, filterType, filterScenario]);

  const activeSelectedOrders = useMemo(() => {
    return orders.filter(o => selectedIds.includes(o.id));
  }, [selectedIds, orders]);

  const isAllEligibleSelected = useMemo(() => {
    const eligibleOrders = orders.filter(o => o.status !== "规划中");
    return eligibleOrders.length > 0 && eligibleOrders.every(o => selectedIds.includes(o.id));
  }, [orders, selectedIds]);

  const stats = useMemo(() => {
    let totalWeight = 0;
    let totalVolume = 0;
    activeSelectedOrders.forEach(o => {
      totalWeight += o.weight;
      totalVolume += o.volume;
    });
    return {
      weight: parseFloat(totalWeight.toFixed(1)),
      volume: parseFloat(totalVolume.toFixed(1)),
      count: activeSelectedOrders.length
    };
  }, [activeSelectedOrders]);

  const currentTruckSuggestion = useMemo(() => {
    const weight = stats.weight;
    if (weight === 0) {
      return { type: "无载荷", label: "请选择待配载订单", factor: 1.0 };
    }
    if (weight <= 4.0) {
      return { type: "6.8米单桥高栏车", label: "核载 5.0 吨 / 28m³", factor: 0.85 };
    }
    if (weight <= 9.0) {
      return { type: "9.6米双桥厢式货车", label: "核载 10.0 吨 / 55m³", factor: 1.00 };
    }
    return { type: "13.5米半挂平板车", label: "核载 30.0 吨 / 85m³", factor: 1.35 };
  }, [stats.weight]);

  const isUrgentOrderIncluded = useMemo(() => {
    return selectedIds.includes("ORD-20260520-003");
  }, [selectedIds]);

  const processedCarriers = useMemo(() => {
    const factor = currentTruckSuggestion.factor;
    const items = INITIAL_CARRIERS.map(c => {
      const computedQuote = Math.round(c.baseQuote * factor);
      const computedBenchmark = Math.round(c.baseBenchmark * factor);
      const deviationPercent = (((computedQuote - computedBenchmark) / computedBenchmark) * 100).toFixed(1);
      const deviationText = parseFloat(deviationPercent) < 0
        ? `低于市场 ${Math.abs(deviationPercent)}%`
        : `高于市场 ${deviationPercent}%`;

      let finalScore = c.score;
      let failsDueToSLA = false;

      // Filter check based on the 太仓 ➔ 杭州下沙备料仓 12h urgent restriction
      if (isUrgentOrderIncluded && isCutoffChecking && !c.passesCutoff) {
        finalScore = 55; // Penalize score
        failsDueToSLA = true;
      }

      return {
        ...c,
        quote: computedQuote,
        benchmark: computedBenchmark,
        deviation: deviationText,
        score: finalScore,
        isIntercepted: failsDueToSLA
      };
    });

    // Handle sort ordering
    if (currentSort === "score") {
      return items.sort((a, b) => b.score - a.score);
    } else if (currentSort === "price") {
      return items.sort((a, b) => a.quote - b.quote);
    } else if (currentSort === "time") {
      return items.sort((a, b) => a.transitHours - b.transitHours);
    }
    return items;
  }, [currentTruckSuggestion, currentSort, isUrgentOrderIncluded, isCutoffChecking]);

  // Separate carrier list into compliant (eligible) and non-compliant (disqualified/risk)
  const eligibleCarriers = useMemo(() => {
    return processedCarriers.filter(c => !c.isIntercepted);
  }, [processedCarriers]);

  const disqualifiedCarriers = useMemo(() => {
    return processedCarriers.filter(c => c.isIntercepted);
  }, [processedCarriers]);

  // Keep selected state consistent: auto fallback if currently selected is disqualified
  useEffect(() => {
    if (disqualifiedCarriers.some(c => c.id === selectedCarrierId)) {
      const fallback = eligibleCarriers[0] || processedCarriers[0];
      if (fallback) {
        setSelectedCarrierId(fallback.id);
      }
    }
  }, [eligibleCarriers, disqualifiedCarriers, selectedCarrierId, processedCarriers]);

  const activeCarrierInfo = useMemo(() => {
    return processedCarriers.find(c => c.id === selectedCarrierId) || processedCarriers[0];
  }, [selectedCarrierId, processedCarriers]);

  const handleToggleOrderSelection = (order) => {
    if (order.status === "规划中") {
      triggerToast("该订单由协同二组规划锁定中，暂无法选择", "error");
      return;
    }
    if (selectedIds.includes(order.id)) {
      setSelectedIds(selectedIds.filter(id => id !== order.id));
      triggerToast(`已取消勾选：${order.id}`, "info");
    } else {
      setSelectedIds([...selectedIds, order.id]);
      triggerToast(`已成功勾选干线订单：${order.id}`, "success");
    }
  };

  const handleSelectAllToggle = () => {
    const eligibleOrders = orders.filter(o => o.status !== "规划中");
    if (isAllEligibleSelected) {
      setSelectedIds([]);
      triggerToast("已清空所有已选配载订单", "info");
    } else {
      setSelectedIds(eligibleOrders.map(o => o.id));
      triggerToast(`已一键配载 ${eligibleOrders.length} 笔待规划订单`, "success");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">

      {/* Toast Alert System */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-100">
          <div className={`p-4 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-md ${toast.type === "error"
              ? "bg-red-950/95 border-red-800 text-red-200"
              : toast.type === "info"
                ? "bg-slate-900/95 border-slate-700 text-slate-200"
                : "bg-emerald-950/95 border-emerald-800 text-emerald-100"
            }`}>
            {toast.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-400" />
            ) : (
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">系统运行日志</p>
              <p className="text-xs font-semibold mt-0.5">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Control Tower Header Area */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg shadow-inner">
            <Truck className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-wide uppercase">公路发运调度工作台 (TMS)</h1>
            <p className="text-[11px] text-slate-400">货主端工厂至工厂干线运输决策终端</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>WMS/ERP 货源同步: <strong className="text-slate-200 font-mono">10分钟前已核查</strong></span>
        </div>
      </header>

      {/* Screen Steps Navigation Bar */}
      <nav className="bg-slate-950 border-b border-slate-900 py-3 px-6 overflow-x-auto shrink-0 shadow-inner">
        <div className="flex items-center justify-between min-w-[900px]">
          <div className="flex items-center gap-2 text-xs">

            {/* Step 1 */}
            <button
              onClick={() => { setActiveStep(1); setIsSubmitted(false); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors font-semibold ${activeStep === 1
                  ? "bg-slate-900 text-indigo-400 font-bold border border-indigo-500/25"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${activeStep === 1 ? "bg-indigo-500 text-slate-950" : "bg-slate-900 text-slate-400"
                }`}>1</span>
              <span>1. 订单池 / 待规划列表</span>
              <span className="bg-slate-800 text-slate-400 text-[10px] font-mono px-1.5 rounded ml-0.5">
                {orders.filter(o => o.status !== "规划中").length}
              </span>
            </button>

            <ChevronRight className="h-3.5 w-3.5 text-slate-700" />

            {/* Step 2 */}
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  triggerToast("请至少选择一笔发货指令进行计划判定", "error");
                } else {
                  setActiveStep(2);
                  setIsSubmitted(false);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors font-semibold ${activeStep === 2
                  ? "bg-slate-900 text-indigo-400 font-bold border border-indigo-500/25"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${activeStep === 2 ? "bg-indigo-500 text-slate-950" : "bg-slate-900 text-slate-400"
                }`}>2</span>
              <span>2. 运输计划与配载判定</span>
            </button>

            <ChevronRight className="h-3.5 w-3.5 text-slate-700" />

            {/* Step 3 */}
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  triggerToast("未选定有效拼载计划，无法进行车队比价", "error");
                } else {
                  setActiveStep(3);
                  setIsSubmitted(false);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors font-semibold ${activeStep === 3
                  ? "bg-slate-900 text-indigo-400 font-bold border border-indigo-500/25"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${activeStep === 3 ? "bg-indigo-500 text-slate-950" : "bg-slate-900 text-slate-400"
                }`}>3</span>
              <span>3. 常协车队比价</span>
            </button>

            <ChevronRight className="h-3.5 w-3.5 text-slate-700" />

            {/* Step 4 */}
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  triggerToast("请先完成比价指派", "error");
                } else {
                  setActiveStep(4);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors font-semibold ${activeStep === 4
                  ? "bg-slate-900 text-indigo-400 font-bold border border-indigo-500/25"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${activeStep === 4 ? "bg-indigo-500 text-slate-950" : "bg-slate-900 text-slate-400"
                }`}>4</span>
              <span>4. 确认指派与任务生成</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mr-2">
            <ClipboardList className="h-4 w-4" />
            <span>常协审计模式: 已开启</span>
          </div>
        </div>
      </nav>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* ========================================== */}
        {/* PAGE 1: 订单池 / 待规划列表                */}
        {/* ========================================== */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-fadeIn">

            {/* Header info bar */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Database className="h-4.5 w-4.5 text-indigo-400" />
                  订单池 / 待规划列表
                </h2>
                <p className="text-xs text-slate-400 max-w-3xl">
                  统一承接自 ERP/WMS 同步进入系统的发货订单。调度员可合并勾选符合条件的货物，进行合并配载与运能核算。
                </p>
                <div className="text-[11px] text-indigo-400/90 pt-1 font-semibold">
                  今日已同步 28 条订单，其中 9 条待规划。
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedIds.length === 0) {
                    triggerToast("请至少勾选一发运订单进行计划判定！", "error");
                  } else {
                    setActiveStep(2);
                    triggerToast(`已合并选中 ${selectedIds.length} 笔订单，转至判定分析。`);
                  }
                }}
                className={`text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shrink-0 shadow-lg ${selectedIds.length > 0
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-slate-950"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  }`}
              >
                <span>进入规划 ({selectedIds.length} 笔)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 w-72">
                <Search className="h-4 w-4 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="搜索订单号 / 提货地 / 收货地..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-slate-200 text-xs w-full p-0 placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">运输类型:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-950 text-slate-300 border border-slate-800 rounded px-2.5 py-1 focus:outline-none"
                >
                  <option value="all">全部类型 (整车/零担)</option>
                  <option value="整车">仅看整车</option>
                  <option value="零担">仅看零担</option>
                </select>
              </div>

              <button
                onClick={() => { setSearchTerm(""); setFilterType("all"); }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline ml-auto"
              >
                重置过滤
              </button>
            </div>

            {/* Selected Count Indicator Bar */}
            <div className="bg-slate-900 px-5 py-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-slate-300">
                  当前勾选待处理: <strong className="text-indigo-400 font-mono text-sm">{selectedIds.length}</strong> 笔发运单
                </span>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-4 text-slate-400">
                  <span>合并总重: <strong className="text-slate-200 font-mono">{stats.weight} 吨</strong></span>
                  <span>合并体积: <strong className="text-slate-200 font-mono">{stats.volume} m³</strong></span>
                  {stats.weight > 0 && (
                    <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700 text-[10px]">
                      匹配拟派车型: {currentTruckSuggestion.type}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setSelectedIds([]); triggerToast("已清空所有已选订单", "info"); }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline mr-1"
                >
                  清空选择
                </button>
                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => {
                    setActiveStep(2);
                    triggerToast(`已合并 ${selectedIds.length} 笔订单，转至计划判定页。`);
                  }}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${selectedIds.length > 0
                      ? "bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                    }`}
                >
                  进入合并规划
                </button>
              </div>
            </div>

            {/* Primary Table View */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4 w-12 text-center">
                        <button
                          onClick={handleSelectAllToggle}
                          className="text-slate-400 hover:text-slate-200 focus:outline-none"
                        >
                          {isAllEligibleSelected ? (
                            <CheckSquare className="h-4.5 w-4.5 text-indigo-400 mx-auto" />
                          ) : (
                            <Square className="h-4.5 w-4.5 text-slate-600 mx-auto" />
                          )}
                        </button>
                      </th>
                      <th className="py-3.5 px-4">订单号</th>
                      <th className="py-3.5 px-3">数据来源</th>
                      <th className="py-3.5 px-4">发货工厂 (提货)</th>
                      <th className="py-3.5 px-4">目的仓库 (交货)</th>
                      <th className="py-3.5 px-4 text-right">重量 / 体积</th>
                      <th className="py-3.5 px-4 text-center">运输类型</th>
                      <th className="py-3.5 px-4">到货时效要求</th>
                      <th className="py-3.5 px-4">场景类型</th>
                      <th className="py-3.5 px-4 text-center">当前状态</th>
                      <th className="py-3.5 px-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-medium">
                    {filteredOrders.map(o => {
                      const isChecked = selectedIds.includes(o.id);
                      const isLocked = o.status === "规划中";

                      return (
                        <tr
                          key={o.id}
                          onClick={() => handleToggleOrderSelection(o)}
                          className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${isChecked ? "bg-slate-800/40" : ""
                            } ${isLocked ? "opacity-50 bg-slate-950/40 cursor-not-allowed" : ""}`}
                        >
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              disabled={isLocked}
                              onClick={() => handleToggleOrderSelection(o)}
                              className="focus:outline-none disabled:cursor-not-allowed"
                            >
                              {isLocked ? (
                                <Square className="h-4.5 w-4.5 text-slate-850 mx-auto" />
                              ) : isChecked ? (
                                <CheckSquare className="h-4.5 w-4.5 text-indigo-400 mx-auto" />
                              ) : (
                                <Square className="h-4.5 w-4.5 text-slate-700 mx-auto" />
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                            {o.id}
                          </td>
                          <td className="py-3.5 px-3 text-slate-400">
                            {o.source}
                          </td>
                          <td className="py-3.5 px-4 text-slate-200">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>{o.pickup}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-200">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                              <span>{o.delivery}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                            {o.weight} 吨 / {o.volume} m³
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${o.type === "整车"
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              }`}>
                              {o.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 font-mono">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                              <span>{o.requiredArrival}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${o.id === "ORD-20260520-003"
                                ? "bg-slate-800 text-slate-300 border border-slate-700"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}>
                              {o.id === "ORD-20260520-003" ? "内贸工厂到工厂 (特急)" : o.scenario}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {isLocked ? (
                              <span className="bg-amber-950/40 text-amber-500 border border-amber-900/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                规划中
                              </span>
                            ) : (
                              <span className="bg-slate-850 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                                待规划
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            {isLocked ? (
                              <span className="text-slate-600 cursor-not-allowed">二组锁定</span>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedIds([o.id]);
                                  setActiveStep(2);
                                  triggerToast(`已选择单笔：${o.id}`);
                                }}
                                className="text-indigo-400 hover:text-indigo-300 font-bold"
                              >
                                进入规划
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

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                <strong>系统多席位隔离提示:</strong> 状态标示为“规划中”的调拨订单由其他操作席位并行处理，防止调度运力冲突。
              </span>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 2: 运输规划与配载判定                 */}
        {/* ========================================== */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fadeIn">

            {/* Direct Back Alert if selection is empty */}
            {selectedIds.length === 0 ? (
              <div className="bg-slate-900 p-12 rounded-xl border border-slate-800 text-center space-y-4">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto animate-pulse" />
                <h3 className="text-sm font-bold text-slate-200">当前没有可进入决策规划的待处理订单</h3>
                <p className="text-slate-400 max-w-md mx-auto text-xs">
                  请先返回订单池页面勾选待运送的货物，以便匹配推荐车型。
                </p>
                <button
                  onClick={() => setActiveStep(1)}
                  className="bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs"
                >
                  返回待规划列表
                </button>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 p-4.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mb-1 font-semibold">
                      <span>公路发车调度</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-indigo-400">运输计划与配载判定</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-400" />
                      公路发运计划方案与配载判定
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      系统已根据您选择的 {activeSelectedOrders.length} 笔订单，核算拟定规格并与常协零担做出运费对比。
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveStep(3);
                      triggerToast("配载核算通过，加载常协合同车队比价表...", "success");
                    }}
                    className="bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-lg text-xs"
                  >
                    <span>查看合同车队比价</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">

                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3.5">
                      <span className="text-xs font-bold text-indigo-400 block border-b border-slate-800 pb-2 uppercase tracking-wider">
                        1. 已加载发货清单 ({activeSelectedOrders.length} 笔)
                      </span>

                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                        {activeSelectedOrders.map((order) => (
                          <div key={order.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-indigo-400 font-bold">{order.id}</span>
                              <span className="text-slate-400 text-[10px] font-semibold">
                                {order.id === "ORD-20260520-003" ? "内贸特急件" : "内贸直发"}
                              </span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>提货: {order.pickup}</span>
                              <span>交货: {order.delivery}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                              <span>参数: {order.weight}吨 / {order.volume}m³</span>
                              <span>时效要求: {order.requiredArrival.split(" ")[1]}前</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cumulative stats */}
                      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                        <span className="text-slate-500 text-[10px] block font-bold">合并调拨总量：</span>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-slate-900 p-2 rounded">
                            <span className="text-slate-500 block text-[9px]">合并总重量</span>
                            <strong className="text-slate-200 font-mono text-xs">{stats.weight} 吨</strong>
                          </div>
                          <div className="bg-slate-900 p-2 rounded">
                            <span className="text-slate-500 block text-[9px]">合并总容积</span>
                            <strong className="text-slate-200 font-mono text-xs">{stats.volume} m³</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-400 block border-b border-slate-800 pb-2 uppercase tracking-wider">
                        2. 推荐车型规格及依据
                      </span>

                      <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
                          <span className="font-bold text-indigo-400 text-[11.5px]">
                            建议方案：指派【{currentTruckSuggestion.type}】
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          由于本单累计货重达 <strong className="font-mono text-indigo-400">{stats.weight} 吨</strong>，
                          指派干线整车能够确保整批货物免受拼装二次拆转，大幅降低货损质损并保障交付在途安全时效。
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 flex flex-col items-center justify-center min-h-[140px] relative my-2">
                      <div className="relative w-full max-w-xs bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center gap-3 z-10 shadow-md">
                        <div className="w-10 h-10 bg-slate-800 rounded flex flex-col justify-center items-center text-[9px] text-slate-300 font-mono border border-slate-700">
                          <span className="text-indigo-400 font-bold">车头</span>
                        </div>
                        <div className="flex-1 h-10 bg-indigo-950/40 border border-dashed border-indigo-500/50 rounded flex flex-col justify-center items-center">
                          <span className="text-[11px] text-indigo-400 font-bold truncate max-w-[150px]">
                            {currentTruckSuggestion.type}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2.5">
                        车厢核准：{currentTruckSuggestion.label}
                      </span>
                    </div>

                    <div className="bg-slate-950/40 p-3 rounded-lg text-[10.5px] text-slate-400">
                      ℹ️ <strong>调度贴士:</strong> 单一发车点到目的地无需中转，若批量总重超过 10 吨，零担方案将自动因超重体积限制显示为“作为备选”。
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-400 block border-b border-slate-800 pb-2 uppercase tracking-wider">
                        3. FTL整车 vs. LTL零担模式对照
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        根据当前合并的总货重测算，多维度决策保障比对：
                      </p>

                      <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden mt-3.5">
                        <table className="w-full text-left text-[11px] font-semibold">
                          <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400">
                              <th className="py-2.5 px-3">比较项目</th>
                              <th className="py-2.5 px-3">整车直发 (FTL)</th>
                              <th className="py-2.5 px-3">零担拼车 (LTL)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            <tr>
                              <td className="py-2.5 px-3 text-slate-400">在途安全性</td>
                              <td className="py-2.5 px-3 text-emerald-400 font-bold">极高 (无需二次中转)</td>
                              <td className="py-2.5 px-3 text-slate-300">中 (多次拆箱分拨)</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 text-slate-400">预计运费</td>
                              <td className="py-2.5 px-3 text-slate-200">
                                约 ¥{activeCarrierInfo.quote?.toLocaleString()} 元
                              </td>
                              <td className="py-2.5 px-3 text-amber-400">
                                按吨累计 ¥{Math.round(stats.weight * 320)} 元
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 text-slate-400">时效时空差</td>
                              <td className="py-2.5 px-3 text-emerald-400">极稳 (可直达目的仓)</td>
                              <td className="py-2.5 px-3 text-amber-400">高 (受配载分发影响)</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-3 text-slate-400">规划决策</td>
                              <td className="py-2.5 px-3 text-indigo-400 font-bold">
                                {stats.weight > 10.0 ? "优先整车" : "系统推荐整车"}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">
                                {stats.weight > 10.0 ? "不符要求" : "可作为备选"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-indigo-500/10 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">运输合规合规保障</span>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-300 truncate max-w-[190px]">
                          流向：{activeSelectedOrders.length === 1 ? activeSelectedOrders[0].pickup : "长三角直发干线"}
                        </span>
                        <span className="text-emerald-400 font-bold">符合配送规范</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-slate-500 text-xs font-semibold">
                    * 测算公式基于国内公路运输车辆轴重及载货装配限值。
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-5 py-2 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs font-semibold"
                    >
                      返回待规划列表
                    </button>
                    <button
                      onClick={() => {
                        setActiveStep(3);
                        triggerToast("常协协议报价库比对匹配就绪。");
                      }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-slate-950 font-bold px-8 py-2 rounded-lg text-xs"
                    >
                      查看合同车队比价
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 3: 承运商推荐                         */}
        {/* ========================================== */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-fadeIn">

            {/* Direct Back Alert if selection is empty */}
            {selectedIds.length === 0 ? (
              <div className="bg-slate-900 p-12 rounded-xl border border-slate-800 text-center space-y-4">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-200">无正在规划比价的方案</h3>
                <button onClick={() => setActiveStep(1)} className="bg-indigo-500 text-slate-950 px-6 py-2 rounded-lg text-xs font-semibold">
                  返回待规划列表
                </button>
              </div>
            ) : (
              <>
                {/* Header Information */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4.5 w-4.5 text-indigo-400" />
                      <h2 className="text-sm font-bold text-slate-100 tracking-wide">
                        常协签约车队报价比对
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400">
                      调取华东区域公路干线合同车队常协价格，基于履约KPI、协议单价和运输时效进行综合推荐。
                    </p>
                  </div>

                  <div className="text-slate-400 text-[11px] font-semibold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
                    拟指派车型：<span className="text-indigo-400 font-mono font-bold">{currentTruckSuggestion.type}</span> |
                    载重量：<span className="text-slate-200 font-bold">{stats.weight} 吨</span>
                  </div>
                </div>

                {/* Grid Header and Sorting Selection */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => { setCurrentSort("score"); triggerToast("排序已切换为：系统综合评分优先"); }}
                      className={`px-4 py-2 rounded-lg font-bold tracking-wide transition-all ${currentSort === "score"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      系统综合评分优先
                    </button>

                    <button
                      onClick={() => { setCurrentSort("price"); triggerToast("排序已切换为：协议运价最低优先"); }}
                      className={`px-4 py-2 rounded-lg font-bold tracking-wide transition-all ${currentSort === "price"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      协议价格最低优先
                    </button>

                    <button
                      onClick={() => { setCurrentSort("time"); triggerToast("排序已切换为：预计运输时效最优优先"); }}
                      className={`px-4 py-2 rounded-lg font-bold tracking-wide transition-all ${currentSort === "time"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      预计运输时效优先
                    </button>
                  </div>

                  <div className="text-slate-500 text-[10.5px] font-semibold">
                    签约协议版本: <strong className="text-slate-400">CHN-East-FTL-2026.Q2</strong>
                  </div>
                </div>

                {/* PRIMARY SECTION: Truly Eligible Candidates */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 pl-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>满足发运时效与配载要求车队 (系统推荐候选)</span>
                  </div>

                  {eligibleCarriers.length === 0 ? (
                    <div className="bg-slate-900 p-8 rounded-xl border border-dashed border-red-900/40 text-center text-slate-400 text-xs">
                      ⚠️ 时效红线开启，且当前所选高时效订单无合规常协协议车队满足要求。请尝试在下方关闭校验或人工指派。
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-${eligibleCarriers.length} gap-6 text-xs`}>
                      {eligibleCarriers.map((carrier) => {
                        const isSelected = selectedCarrierId === carrier.id;

                        return (
                          <div
                            key={carrier.id}
                            onClick={() => {
                              setSelectedCarrierId(carrier.id);
                              triggerToast(`已选定推荐常协承运商：${carrier.name}`);
                            }}
                            className={`rounded-xl border transition-all overflow-hidden flex flex-col justify-between cursor-pointer ${isSelected
                                ? "border-indigo-500 bg-slate-900 shadow-xl ring-1 ring-indigo-500/25"
                                : "border-slate-800 bg-slate-900 hover:border-slate-650"
                              }`}
                          >
                            {/* Eligible Card Header */}
                            <div className="px-4 py-3.5 border-b bg-slate-800/40 border-slate-800 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${carrier.isPreferred
                                    ? "bg-indigo-500 text-slate-950"
                                    : "bg-slate-700 text-slate-300"
                                  }`}>
                                  {carrier.isPreferred ? "首选推荐" : "常协可选"}
                                </span>
                                <div>
                                  <h4 className="font-bold text-slate-100">{carrier.name}</h4>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">{carrier.capacity}</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[9px] text-slate-500 block">综合评分</span>
                                <span className="text-xs font-mono font-bold text-indigo-400">
                                  {carrier.score}/100
                                </span>
                              </div>
                            </div>

                            {/* Specifications Display */}
                            <div className="p-4 space-y-4 flex-1 font-semibold">

                              {/* Cost Block */}
                              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                                <div>
                                  <span className="text-slate-500 text-[9px] uppercase font-bold block">协议价运费</span>
                                  <span className="text-sm font-bold font-mono text-slate-100">¥{carrier.quote.toLocaleString()} 元</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-slate-500 text-[9px] uppercase font-bold block">大盘参考 / 偏差</span>
                                  <div className="flex items-center gap-1 justify-end font-mono text-[10.5px]">
                                    <span className="text-slate-500">¥{carrier.benchmark}</span>
                                    <span className="text-slate-700">|</span>
                                    <span className="text-emerald-400">{carrier.deviation}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Standard B2B parameters */}
                              <div className="space-y-2 text-[11px] border-b border-slate-800 pb-3">
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-500 font-medium">预计在途时效:</span>
                                  <span className="text-slate-200 font-bold font-mono">{carrier.transit}</span>
                                </div>

                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-500 font-medium">历史准时到货率:</span>
                                  <span className="text-slate-200 font-bold font-mono">{carrier.onTime}</span>
                                </div>

                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-500 font-medium">异常破损率:</span>
                                  <span className="text-slate-200 font-bold font-mono">{carrier.exception}</span>
                                </div>

                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-500 font-medium">常协履约成功率:</span>
                                  <span className="text-slate-200 font-bold font-mono">{carrier.fulfillment}</span>
                                </div>
                              </div>

                              <div className="space-y-1 text-[11px]">
                                <div className="flex gap-1.5 flex-wrap">
                                  <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 border border-slate-700 rounded">
                                    {carrier.tag}
                                  </span>
                                </div>

                                <div className="text-[10.5px] leading-relaxed pt-1.5">
                                  <strong className="text-slate-300 block mb-0.5">系统推荐说明：</strong>
                                  <span className="text-slate-400 block">{carrier.reason}</span>
                                </div>
                              </div>

                            </div>

                            {/* Card Footer Status */}
                            <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-center text-[10px] font-bold uppercase tracking-wider">
                              {isSelected ? (
                                <span className="text-indigo-400 flex items-center justify-center gap-1 py-1">
                                  <Check className="h-3.5 w-3.5 stroke-[3px]" />
                                  <span>已选定指派此车队</span>
                                </span>
                              ) : (
                                <span className="text-slate-500 hover:text-white transition-colors block py-1">
                                  选择此常协车队
                                </span>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECONDARY AUDIT SECTION: Downgraded/disqualified Risk Candidates */}
                {disqualifiedCarriers.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pl-1">
                      <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                      <span>时效风险 / 已拦截车队 (仅供大盘比价与审计对账参考，非默认推荐候选)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 text-xs">
                      {disqualifiedCarriers.map((carrier) => (
                        <div
                          key={carrier.id}
                          className="rounded-xl border border-red-950 bg-red-950/5 flex flex-col justify-between cursor-not-allowed overflow-hidden"
                          onClick={() => {
                            triggerToast("该车队在途时效超出当前计划的安全校验窗口，无法指派。", "error");
                          }}
                        >
                          {/* Disqualified Card Header */}
                          <div className="px-4 py-3 bg-red-950/10 border-b border-red-950/40 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="bg-red-500/10 text-red-400 border border-red-800 px-2 py-0.5 rounded text-[9px] font-bold">
                                时效风险
                              </span>
                              <div>
                                <h4 className="font-bold text-slate-400 line-through">{carrier.name}</h4>
                                <span className="text-[10px] text-slate-500 block">不满足到货限制</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[9px] text-slate-600 block">综合得分</span>
                              <span className="text-xs font-mono font-bold text-red-500/80 line-through">
                                {carrier.score}/100
                              </span>
                            </div>
                          </div>

                          {/* Simplified parameters for audit reference */}
                          <div className="p-4 space-y-3 flex-1 font-semibold text-slate-400">

                            {/* Price for audit comparisons */}
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex justify-between items-center text-[11px]">
                              <div>
                                <span className="text-slate-500 text-[9px] block">常协价</span>
                                <strong className="text-slate-400 font-mono">¥{carrier.quote.toLocaleString()} 元</strong>
                              </div>
                              <div className="text-right">
                                <span className="text-slate-500 text-[9px] block">偏差</span>
                                <span className="text-emerald-500 font-mono">{carrier.deviation}</span>
                              </div>
                            </div>

                            <div className="space-y-1 text-[11px] border-b border-slate-900 pb-2.5">
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-500">合同在途时效:</span>
                                <span className="text-red-400 font-bold font-mono">{carrier.transit}</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-slate-500">大盘参考平均:</span>
                                <span className="text-slate-400 font-mono">¥{carrier.benchmark}</span>
                              </div>
                            </div>

                            <div className="bg-red-950/20 p-2.5 rounded border border-red-900/30 text-[10px] text-red-300 leading-relaxed">
                              <div className="flex items-start gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                                <span>
                                  <strong>时效超限拦截：</strong>在途需要 {carrier.transitHours} 小时，超出了 12 小时的配送时效限值。
                                </span>
                              </div>
                            </div>

                          </div>

                          {/* Footer Action Lock */}
                          <div className="p-2.5 border-t border-red-950/40 bg-red-950/20 text-center text-[9px] font-bold text-red-400 flex items-center justify-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span>不可选 · 存在履约违约风险</span>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lower Supporting Decision Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-semibold">

                  {/* Note Block 1: Explanatory Safe Delivery Cutoff Policy */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Building className="h-4 w-4 text-indigo-400 shrink-0" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          特殊时效考核说明 (前程陆运/特急件)
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        当计划内包含急需调拨件（如 <strong>太仓工厂 ➔ 杭州下沙备料仓</strong>）时，
                        为保障下游产线不发生停工风险，在途时效必须确保在 12 小时安全截单红线以内。
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-850 flex items-center justify-between gap-4 mt-2">
                      <div className="text-[10.5px] text-slate-400 leading-normal">
                        <strong>校验开关（特殊时效考核过滤）：</strong>
                        <span className="block text-[9.5px] text-slate-500 mt-0.5">切换此项可一键验证安全时效差值拦截功能。</span>
                      </div>

                      {/* Secondary non-dominant trigger control */}
                      <button
                        onClick={() => {
                          setIsCutoffChecking(!isCutoffChecking);
                          triggerToast(
                            !isCutoffChecking
                              ? "已启动时效拦截，超时车队将自动隔离"
                              : "已关闭时效校验，车队恢复默认排序",
                            "info"
                          );
                        }}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all shrink-0 ${isCutoffChecking
                            ? "bg-slate-800 text-indigo-400 border border-indigo-500/20"
                            : "bg-slate-900 text-slate-500 border border-slate-800"
                          }`}
                      >
                        {isCutoffChecking ? "开启过滤中" : "已关闭过滤"}
                      </button>
                    </div>
                  </div>

                  {/* Note Block 2: Rate reasonableness monitoring */}
                  <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Coins className="h-4.5 w-4.5 text-emerald-400" />
                        协议公允度审计 (偏差合理度)
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        自动调取大盘干线公允指导价，对拟指派车队的报价合理性进行自动化偏差比对与超额管控。
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[10.5px] space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">拟指派车队：{activeCarrierInfo.name}</span>
                        <span className="text-slate-300">协议价 ¥{activeCarrierInfo.quote} 元</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">大盘公允平均价</span>
                        <span className="text-slate-400">¥{activeCarrierInfo.benchmark} 元</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-900 pt-1.5 font-sans">
                        <span className="text-slate-400 font-bold">运价合理偏差值</span>
                        <span className="text-emerald-400 font-bold">{activeCarrierInfo.deviation}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Confirm Action row */}
                <div className="p-4 bg-slate-900 border border-indigo-500/20 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="text-slate-300 font-semibold">拟指派常协车队:</span>
                    <strong className="text-white text-xs font-bold">
                      {activeCarrierInfo.name} (合同报价: ¥{activeCarrierInfo.quote?.toLocaleString()} 元, 预计时效: {activeCarrierInfo.transit})
                    </strong>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-5 py-2.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs font-semibold"
                    >
                      返回计划页
                    </button>
                    <button
                      onClick={() => {
                        setActiveStep(4);
                        triggerToast(`常协车队指派确认，准备下发任务。`);
                      }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-slate-950 font-bold px-8 py-2.5 rounded-lg text-xs"
                    >
                      确认指派
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* PAGE 4: 确认指派与任务结果                 */}
        {/* ========================================== */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-fadeIn">

            {/* Direct Back Alert if selection is empty */}
            {selectedIds.length === 0 ? (
              <div className="bg-slate-900 p-12 rounded-xl border border-slate-800 text-center space-y-4">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-200">无待指派的发运方案</h3>
                <button onClick={() => setActiveStep(1)} className="bg-indigo-500 text-slate-950 px-6 py-2 rounded-lg text-xs font-semibold">
                  返回订单池
                </button>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 p-4.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <FileText className="h-4.5 w-4.5 text-indigo-400" />
                      确认指派与发运任务下发
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-normal">
                      请最后核对承运商议价、SLA时效承诺与拼载重积。确认后将下发给承运商车队。
                    </p>
                  </div>

                  {!isSubmitted ? (
                    <span className="bg-slate-950 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded text-[10.5px] font-bold">
                      状态: 待最终指派
                    </span>
                  ) : (
                    <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-2.5 py-1 rounded text-[10.5px] font-bold flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> 运输任务已生成
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">

                  {/* Left Column: Core Shipment Specs & Sub-Orders */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                      <span className="text-xs font-bold text-indigo-400 block border-b border-slate-800 pb-2 uppercase tracking-wide">
                        1. 拟选定承运车队与协议对账款项
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                          <span className="text-slate-500 text-[9px] uppercase font-bold block">选定常协承运商</span>
                          <span className="text-slate-200 block font-bold text-[11px]">{activeCarrierInfo.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">综合月度绩效：{activeCarrierInfo.score}分</span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                          <span className="text-slate-500 text-[9px] uppercase font-bold block">拟指派车型/装配</span>
                          <span className="text-slate-200 block font-bold text-[11px]">{currentTruckSuggestion.type}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">配载利用：约 {stats.weight} 吨</span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                          <span className="text-slate-500 text-[9px] uppercase font-bold block">常协协议单次运费</span>
                          <span className="text-emerald-400 block font-bold text-xs font-mono">¥{activeCarrierInfo.quote?.toLocaleString()} 元</span>
                          <span className="text-[10px] text-slate-400 block mt-1">{activeCarrierInfo.deviation}</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[11px] text-slate-400 leading-normal font-normal">
                        ℹ️ <strong>决策公允说明：</strong>本次指派合同价格经系统合理度测算，符合该线路常协框架范围，且在途时效安全指标符合下游工厂生产窗口要求。
                      </div>
                    </div>

                    {/* Associated Domestic Orders */}
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                      <div className="p-3.5 bg-slate-800/60 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                          关联的发货调拨清单 ({activeSelectedOrders.length} 笔)
                        </span>
                        <span className="text-slate-400 text-[10.5px]">
                          合并总重积：<strong className="text-indigo-400 font-mono">{stats.weight} 吨</strong>
                        </span>
                      </div>

                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-950 text-slate-500 text-[10px] font-bold border-b border-slate-800 uppercase">
                            <th className="py-2.5 px-4">发货单号</th>
                            <th className="py-2.5 px-4">发运起止节点</th>
                            <th className="py-2.5 px-4 text-right">货重/体积</th>
                            <th className="py-2.5 px-4 text-center">调度交接状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-[11px] font-normal">
                          {activeSelectedOrders.map(o => (
                            <tr key={o.id} className="hover:bg-slate-800/20">
                              <td className="py-3 px-4 font-mono font-bold text-slate-200">
                                {o.id}
                              </td>
                              <td className="py-3 px-4 text-slate-300">
                                <span className="font-semibold text-slate-200">{o.pickup}</span> &rarr; <span className="text-slate-300">{o.delivery}</span>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-slate-400">
                                {o.weight} 吨 / {o.volume} m³
                              </td>
                              <td className="py-3 px-4 text-center">
                                {isSubmitted ? (
                                  <span className="text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded text-[10px]">
                                    任务已就绪 · 等待月台装货
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[10px]">等待调度确认</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>

                  {/* Right Column: Submission States & Actionable Entries */}
                  <div className="space-y-4">

                    {!isSubmitted ? (
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between min-h-[280px]">
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-indigo-400 block border-b border-slate-800 pb-2 uppercase tracking-wider">
                            确认派车指派
                          </span>

                          <div className="space-y-2.5 text-slate-300 text-[11.5px]">
                            <div className="flex justify-between border-b border-slate-850 pb-2">
                              <span className="text-slate-400">指派承运车队:</span>
                              <strong className="text-slate-100">{activeCarrierInfo.name}</strong>
                            </div>
                            <div className="flex justify-between border-b border-slate-850 pb-2">
                              <span className="text-slate-400">商定协议运费:</span>
                              <strong className="text-emerald-400 font-mono">¥{activeCarrierInfo.quote?.toLocaleString()} 元</strong>
                            </div>
                            <div className="flex justify-between border-b border-slate-850 pb-2">
                              <span className="text-slate-400">承诺安全时效:</span>
                              <strong className="text-amber-400 font-mono">{activeCarrierInfo.transit}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">合并发货笔数:</span>
                              <strong className="font-mono text-slate-200">{selectedIds.length} 笔订单</strong>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 space-y-3">
                          <p className="text-[10px] text-slate-500 leading-normal font-normal">
                            * 确认无误后，系统将自动生成运输任务单，并向承运车队发送排班通知。
                          </p>

                          <button
                            onClick={() => {
                              setIsSubmitted(true);
                              triggerToast("公路发运任务生成成功，已下发指派指令！", "success");
                            }}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg"
                          >
                            确认指派并生成运输任务
                          </button>
                        </div>
                      </div>
                    ) : (

                      /* Post-submission: Operational Next-Step Success Screen */
                      <div className="bg-slate-900 p-5 rounded-xl border border-emerald-500/30 space-y-4">

                        {/* Success Title Area */}
                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
                          <div className="p-2 bg-emerald-500 text-slate-950 rounded-lg shrink-0">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-emerald-400 text-xs">国内陆运任务生成成功</h4>
                            <span className="text-[9.5px] text-slate-400 block font-mono mt-0.5">TASK GENERATED</span>
                          </div>
                        </div>

                        {/* Task Metadata Card */}
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[11px] space-y-2">
                          <div className="flex justify-between pb-1.5 border-b border-slate-900">
                            <span className="text-slate-500 font-sans">运输任务单号</span>
                            <span className="text-indigo-400 font-bold">TSK-20260520-001</span>
                          </div>
                          <div className="flex justify-between pb-1.5 border-b border-slate-900">
                            <span className="text-slate-500 font-sans">承运商车队</span>
                            <span className="text-slate-200 font-sans font-bold">{activeCarrierInfo.name}</span>
                          </div>
                          <div className="flex justify-between pb-1.5 border-b border-slate-900">
                            <span className="text-slate-500 font-sans">当前任务状态</span>
                            <span className="text-emerald-400 font-sans font-bold">已指派 (车队接单中)</span>
                          </div>
                        </div>

                        {/* NEXT-STEP TASK ENTRY: Highly visible next instructions */}
                        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-3.5 space-y-2.5">
                          <span className="text-indigo-400 font-bold text-[11px] block tracking-wide uppercase">
                            👉 下一步作业引导 (Next Actions)
                          </span>

                          <div className="space-y-2 text-[10.5px] text-slate-300 font-normal leading-relaxed">
                            <div className="flex gap-2">
                              <span className="w-4 h-4 rounded-full bg-slate-850 text-indigo-400 flex items-center justify-center font-bold font-mono text-[9px] shrink-0 mt-0.5">1</span>
                              <p><strong>车队调度确认：</strong>车队派单调度岗已收到API预约通知，承运商需在 1 小时内反馈车牌及司机北斗设备号。</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="w-4 h-4 rounded-full bg-slate-850 text-indigo-400 flex items-center justify-center font-bold font-mono text-[9px] shrink-0 mt-0.5">2</span>
                              <p><strong>月台排班预约：</strong>发货工厂排车大屏已同步装载窗口，提货点（厂区1号门月台）准备理货备货。</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="w-4 h-4 rounded-full bg-slate-850 text-indigo-400 flex items-center justify-center font-bold font-mono text-[9px] shrink-0 mt-0.5">3</span>
                              <p><strong>打印交接单：</strong>可在发运大厅终端一键打印出厂出门证及纸质装载凭证。</p>
                            </div>
                          </div>
                        </div>

                        {/* Minimalized ERP/WMS sync note - Keeping it minor and secondary */}
                        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-normal flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                          <span>* 状态同步：已完成原生 ERP/WMS 的发运锁定同步 (API: OK)</span>
                        </div>

                      </div>
                    )}

                  </div>

                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-slate-400 text-[11px] font-normal">
                    {isSubmitted
                      ? "✓ 常协车队派发流程已全部闭环，当前决策记录已留底归档。"
                      : "确认指派后，调度方案即锁定生效并下发车队作业。"
                    }
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedIds([]);
                        setIsSubmitted(false);
                        setActiveStep(1);
                        triggerToast("已清空已选发运单，返回待规划列表首页。");
                      }}
                      className="px-5 py-2 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-850 font-bold text-xs"
                    >
                      返回待规划列表
                    </button>

                    <button
                      onClick={() => {
                        triggerToast("正在打印纸质装载交接单...");
                      }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-slate-950 px-6 py-2 rounded-lg text-xs font-bold transition-all shadow"
                    >
                      打印出厂纸质凭证
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

      </main>

      {/* High Density Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3.5 px-6 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between gap-2 shrink-0 font-semibold">
        <span>公路大宗发运调度终端 - 国内干线直发管理平台 v1.0</span>
        <div className="flex gap-4 justify-center">
          <span className="hover:underline cursor-pointer" onClick={() => triggerToast("长三角大宗配载轴重符合国标GB1589-2016规定", "success")}>
            装车限值安全标准说明
          </span>
          <span>|</span>
          <span>
            构建版本: FTL-DISPATCHER-V1.0
          </span>
        </div>
      </footer>

    </div>
  );
}