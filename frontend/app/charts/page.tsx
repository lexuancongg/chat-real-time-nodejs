'use client'

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, Cell, LabelList,
} from "recharts";

// ─── Raw data (exact values from file) ───────────────────────────────────────

const balanceData = [
  {
    year: "2023",
    nganhHan: 215_279_942_424,
    daiHan:    42_823_305_362,
    tongTS:   258_103_247_786,
    no:       105_581_341_938,
    vonChu:   152_521_905_848,
    tongNV:   258_103_247_786,
  },
  {
    year: "2024",
    nganhHan: 247_571_933_788,
    daiHan:    47_967_093_005,
    tongTS:   295_539_026_793,
    no:       116_547_849_293,
    vonChu:   178_991_177_500,
    tongNV:   295_539_026_793,
  },
  {
    year: "2025",
    nganhHan: 283_469_864_127,
    daiHan:    54_922_321_491,
    tongTS:   338_392_185_618,
    no:       133_447_287_441,
    vonChu:   204_944_898_177,
    tongNV:   338_392_185_618,
  },
];

const financeData = [
  { year: "2023", doanhThu: null,            chiPhi: 126_997_800_000, lnTruoc:  48_437_740_000, thue:  9_687_540_000, lnSau: 38_750_160_000 },
  { year: "2024", doanhThu: 241_980_000_000, chiPhi: 170_015_100_000, lnTruoc:  71_964_850_000, thue: 14_392_980_000, lnSau: 57_571_920_000 },
  { year: "2025", doanhThu: 333_700_000_000, chiPhi: 227_600_000_000, lnTruoc: 106_100_000_000, thue: 21_220_000_000, lnSau: 84_880_000_000 },
];

const hrData = [
  { year: "2023", soLuong: 567, pct: null  },
  { year: "2024", soLuong: 620, pct: 9.3   },
  { year: "2025", soLuong: 715, pct: 15.3  },
];

const hrTableData = [
  { year: 2023, soLuong: 567, tang: null, pct: null  },
  { year: 2024, soLuong: 620, tang: 53,   pct: 9.3   },
  { year: 2025, soLuong: 715, tang: 95,   pct: 15.3  },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmtVND = (v: number | null) => {
  if (v == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
  }).format(v);
};

const fmtAxis = (v: number) => {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(0)}B`;
  if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(0)}M`;
  return `${v}`;
};

// ─── KPIs ─────────────────────────────────────────────────────────────────────

const kpis = [
  { label: "Tổng tài sản 2025",     value: fmtVND(338_392_185_618), sub: "↑ 14,5% vs 2024", color: "#378add" },
  { label: "Doanh thu 2025",         value: fmtVND(333_700_000_000), sub: "↑ 37,9% vs 2024", color: "#1d9e75" },
  { label: "LN sau thuế 2025",       value: fmtVND(84_880_000_000),  sub: "↑ 47,5% vs 2024", color: "#ef9f27" },
  { label: "Nhân viên 2025",         value: "715 người",              sub: "↑ 15,3% vs 2024", color: "#534ab7" },
];

// ─── Radar data (tương đối, 2025 = 100) ──────────────────────────────────────

const radarData = [
  { metric: "TS ngắn hạn",  v2023: 83, v2024: 91, v2025: 100 },
  { metric: "TS dài hạn",   v2023: 78, v2024: 87, v2025: 100 },
  { metric: "Vốn CSH",      v2023: 74, v2024: 87, v2025: 100 },
  { metric: "Doanh thu",    v2023: 0,  v2024: 73, v2025: 100 },
  { metric: "LN sau thuế",  v2023: 46, v2024: 68, v2025: 100 },
  { metric: "Nhân viên",    v2023: 79, v2024: 87, v2025: 100 },
];

// ─── Custom Tooltips ──────────────────────────────────────────────────────────

const VNDTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <p style={{ fontWeight: 600, color: "#111", marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: {p.value == null ? "Không có dữ liệu" : fmtVND(p.value)}
        </p>
      ))}
    </div>
  );
};

const HRTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <p style={{ fontWeight: 600, color: "#111", marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#534ab7" }}>Nhân viên: {payload[0]?.value?.toLocaleString("vi-VN")} người</p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"balance" | "finance">("balance");

  return (
    <div className="bg-slate-50 min-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">Báo cáo nội bộ</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tổng quan tài chính</h1>
            <p className="text-sm text-slate-500 mt-1">Giai đoạn 2023 – 2025 · Đơn vị: VND</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
            Cập nhật mới nhất
          </span>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((k) => (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: k.color }} />
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">{k.label}</p>
              <p className="text-base font-bold text-slate-900 leading-tight break-all">{k.value}</p>
              <p className="text-xs text-emerald-600 mt-1.5 font-medium">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Tab charts ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <h2 className="text-sm font-semibold text-slate-800">Phân tích tài chính</h2>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
              {([["balance", "Cân đối kế toán"], ["finance", "Doanh thu & LN"]] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 transition-colors ${activeTab === tab ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "balance" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-400 mb-3">Tài sản & nguồn vốn (VND)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={balanceData} barCategoryGap="25%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<VNDTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                    <Bar dataKey="nganhHan" name="TS ngắn hạn" fill="#378add" radius={[3,3,0,0]} />
                    <Bar dataKey="daiHan"   name="TS dài hạn"  fill="#85b7eb" radius={[3,3,0,0]} />
                    <Bar dataKey="vonChu"   name="Vốn CSH"     fill="#1d9e75" radius={[3,3,0,0]} />
                    <Bar dataKey="no"       name="Nợ phải trả" fill="#e24b4a" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-3">Tổng tài sản & nguồn vốn theo thời gian (VND)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={balanceData}>
                    <defs>
                      <linearGradient id="gTS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#378add" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#378add" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gNV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1d9e75" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1d9e75" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<VNDTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                    <Area type="monotone" dataKey="tongTS" name="Tổng tài sản"   stroke="#378add" strokeWidth={2.5} fill="url(#gTS)" dot={{ r: 5, fill: "#378add" }} />
                    <Area type="monotone" dataKey="tongNV" name="Tổng nguồn vốn" stroke="#1d9e75" strokeWidth={2}   fill="url(#gNV)" dot={{ r: 4, fill: "#1d9e75" }} strokeDasharray="5 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "finance" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-400 mb-3">Doanh thu, chi phí & lợi nhuận (VND)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={financeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<VNDTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                    <Bar dataKey="doanhThu" name="Doanh thu" fill="#378add" radius={[4,4,0,0]} opacity={0.85} />
                    <Bar dataKey="chiPhi"   name="Chi phí"   fill="#e24b4a" radius={[4,4,0,0]} opacity={0.85} />
                    <Line type="monotone" dataKey="lnSau"   name="LN sau thuế"   stroke="#1d9e75" strokeWidth={2.5} dot={{ r: 5, fill: "#1d9e75" }} connectNulls />
                    <Line type="monotone" dataKey="lnTruoc" name="LN trước thuế" stroke="#ef9f27" strokeWidth={2}   dot={{ r: 4, fill: "#ef9f27" }} strokeDasharray="5 3" connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-[11px] text-slate-400 mt-2">* Doanh thu 2023 không có dữ liệu trong file gốc</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-3">Tăng trưởng lợi nhuận & thuế (VND)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={financeData}>
                    <defs>
                      <linearGradient id="gLN" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1d9e75" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1d9e75" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gThue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef9f27" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef9f27" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<VNDTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                    <Area type="monotone" dataKey="lnSau" name="LN sau thuế" stroke="#1d9e75" strokeWidth={2}   fill="url(#gLN)"   dot={{ r: 5, fill: "#1d9e75" }} connectNulls />
                    <Area type="monotone" dataKey="thue"  name="Thuế"        stroke="#ef9f27" strokeWidth={2}   fill="url(#gThue)" dot={{ r: 4, fill: "#ef9f27" }} connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* ── HR + Radar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* HR */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-1">Nhân sự (HR)</h2>
            <p className="text-xs text-slate-400 mb-4">Số lượng nhân viên theo năm</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hrData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[500, 760]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<HRTooltip />} />
                <Bar dataKey="soLuong" radius={[5,5,0,0]}>
                  {hrData.map((_, i) => (
                    <Cell key={i} fill={["#afa9ec","#7f77dd","#534ab7"][i]} />
                  ))}
                  <LabelList dataKey="soLuong" position="top" style={{ fontSize: 12, fontWeight: 700, fill: "#534ab7" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 border-t border-slate-100 pt-4 space-y-2.5">
              {hrTableData.map((r) => (
                <div key={r.year} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{r.year}</span>
                  <span className="font-semibold text-slate-800">{r.soLuong.toLocaleString("vi-VN")} người</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.tang == null ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-700"}`}>
                    {r.tang == null ? "Cơ sở" : `↑ ${r.pct}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Radar */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-1">So sánh chỉ số tổng hợp</h2>
            <p className="text-xs text-slate-400 mb-2">Chỉ số tương đối — lấy 2025 làm chuẩn (= 100%)</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickCount={4} />
                <Radar name="2023" dataKey="v2023" stroke="#e24b4a" fill="#e24b4a" fillOpacity={0.1} strokeWidth={1.5} />
                <Radar name="2024" dataKey="v2024" stroke="#ef9f27" fill="#ef9f27" fillOpacity={0.1} strokeWidth={1.5} />
                <Radar name="2025" dataKey="v2025" stroke="#1d9e75" fill="#1d9e75" fillOpacity={0.15} strokeWidth={2.5} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v}%`]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Data table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 overflow-x-auto">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Bảng dữ liệu chi tiết (VND)</h2>
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-100">
                {["Chỉ tiêu", "2023", "2024", "2025", "Tăng 23→24", "Tăng 24→25"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider pb-2 pr-4 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {([
                ["TS ngắn hạn",   215_279_942_424, 247_571_933_788, 283_469_864_127],
                ["TS dài hạn",     42_823_305_362,  47_967_093_005,  54_922_321_491],
                ["Tổng tài sản",  258_103_247_786, 295_539_026_793, 338_392_185_618],
                ["Nợ phải trả",   105_581_341_938, 116_547_849_293, 133_447_287_441],
                ["Vốn CSH",       152_521_905_848, 178_991_177_500, 204_944_898_177],
                ["Doanh thu",                null, 241_980_000_000, 333_700_000_000],
                ["Chi phí",       126_997_800_000, 170_015_100_000, 227_600_000_000],
                ["LN trước thuế",  48_437_740_000,  71_964_850_000, 106_100_000_000],
                ["Thuế",            9_687_540_000,  14_392_980_000,  21_220_000_000],
                ["LN sau thuế",    38_750_160_000,  57_571_920_000,  84_880_000_000],
              ] as [string, number|null, number, number][]).map(([label, v2023, v2024, v2025]) => {
                const g1 = (v2023 && v2024) ? ((v2024 - v2023) / v2023 * 100).toFixed(1) : null;
                const g2 = (v2024 && v2025) ? ((v2025 - v2024) / v2024 * 100).toFixed(1) : null;
                const badge = (g: string | null) => g == null
                  ? <span className="text-slate-300 text-xs">—</span>
                  : <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${Number(g) >= 0 ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"}`}>
                      {Number(g) >= 0 ? "↑" : "↓"} {Math.abs(Number(g))}%
                    </span>;
                return (
                  <tr key={label} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-slate-700 whitespace-nowrap">{label}</td>
                    <td className="py-2.5 pr-4 text-slate-500 font-mono text-xs whitespace-nowrap">{fmtVND(v2023)}</td>
                    <td className="py-2.5 pr-4 text-slate-600 font-mono text-xs whitespace-nowrap">{fmtVND(v2024)}</td>
                    <td className="py-2.5 pr-4 text-slate-900 font-semibold font-mono text-xs whitespace-nowrap">{fmtVND(v2025)}</td>
                    <td className="py-2.5 pr-4">{badge(g1)}</td>
                    <td className="py-2.5">{badge(g2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
