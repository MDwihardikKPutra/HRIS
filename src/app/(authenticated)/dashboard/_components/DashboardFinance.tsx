"use client";

import { useState } from "react";
import {
  spds, purchases, payrolls,
  getUserById, getProjectById, getStatusColor, formatDate,
} from "@/lib/data";
import {
  ClipboardList, CheckCircle2, Banknote,
  Wallet, ShoppingCart, Plane, ChevronRight, FileText, ExternalLink,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, CartesianGrid, PieChart, Pie } from "recharts";

const trendChartConfig = {
  amount: {
    label: "Pengeluaran",
    color: "#6366f1",
  },
} satisfies ChartConfig;

const donutConfig = {
  payroll: { label: "Payroll", color: "#6366f1" },
  pembelian: { label: "Pembelian", color: "#f59e0b" },
  operasional: { label: "Operasional", color: "#10b981" },
} satisfies ChartConfig;


export default function DashboardFinance() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? "User";
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Metrics
  let pendingAmount = 0;
  let pendingCount = 0;
  let approvedCount = 0;
  let draftPayrollCount = 0;

  spds.forEach(s => {
    if (s.status === "pending") { pendingAmount += s.totalCost; pendingCount++; }
    else if (s.status === "approved") approvedCount++;
  });
  purchases.forEach(p => {
    if (p.status === "pending") { pendingAmount += p.totalPrice; pendingCount++; }
    else if (p.status === "approved") approvedCount++;
  });
  payrolls.forEach(pr => { if (pr.status === "draft") draftPayrollCount++; });

  // Recent activities
  const recentActivities = [
    ...spds.map(s => ({
      type: "SPD", icon: Plane,
      user: getUserById(s.userId)?.name || "",
      initial: getUserById(s.userId)?.name?.charAt(0) || "?",
      status: s.status, date: s.createdAt, detail: s.spdNumber,
      description: s.purpose,
      amount: s.totalCost,
      extraDetails: [
        { label: "Tujuan Dinas", value: s.destination },
        { label: "Berangkat", value: formatDate(s.departureDate) },
        { label: "Total Biaya", value: `Rp ${s.totalCost.toLocaleString("id-ID")}` },
      ],
      href: "/finance",
    })),
    ...purchases.map(p => ({
      type: "Pembelian", icon: ShoppingCart,
      user: getUserById(p.userId)?.name || "",
      initial: getUserById(p.userId)?.name?.charAt(0) || "?",
      status: p.status, date: p.createdAt, detail: p.purchaseNumber,
      description: p.description,
      amount: p.totalPrice,
      extraDetails: [
        { label: "Proyek", value: getProjectById(p.projectId)?.name || "Internal" },
        { label: "Total", value: `Rp ${p.totalPrice.toLocaleString("id-ID")}` },
      ],
      href: "/finance",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Dynamic monthly trend calculation (Jan - Des 2026)
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const chartPoints = months.map((month, idx) => {
    let payrollTotal = 0;
    let purchaseTotal = 0;
    let spdTotal = 0;

    // Filter payrolls for this month
    payrolls.forEach(pr => {
      let prMonth = -1;
      if (pr.period.includes("Januari") || pr.period.includes("Jan")) prMonth = 0;
      else if (pr.period.includes("Februari") || pr.period.includes("Feb")) prMonth = 1;
      else if (pr.period.includes("Maret") || pr.period.includes("Mar")) prMonth = 2;
      else if (pr.period.includes("April") || pr.period.includes("Apr")) prMonth = 3;
      else if (pr.period.includes("Mei") || pr.period.includes("May")) prMonth = 4;
      else if (pr.period.includes("Juni") || pr.period.includes("Jun")) prMonth = 5;
      else if (pr.period.includes("Juli") || pr.period.includes("Jul")) prMonth = 6;
      else if (pr.period.includes("Agustus") || pr.period.includes("Ags") || pr.period.includes("Aug")) prMonth = 7;
      else if (pr.period.includes("September") || pr.period.includes("Sep")) prMonth = 8;
      else if (pr.period.includes("Oktober") || pr.period.includes("Okt")) prMonth = 9;
      else if (pr.period.includes("November") || pr.period.includes("Nov")) prMonth = 10;
      else if (pr.period.includes("Desember") || pr.period.includes("Des") || pr.period.includes("Dec")) prMonth = 11;

      if (prMonth === idx) {
        payrollTotal += pr.netSalary;
      }
    });

    // Filter purchases
    purchases.forEach(p => {
      const pDate = new Date(p.createdAt);
      if (pDate.getFullYear() === 2026 && pDate.getMonth() === idx) {
        purchaseTotal += p.totalPrice;
      }
    });

    // Filter SPDs
    spds.forEach(s => {
      const sDate = new Date(s.createdAt);
      if (sDate.getFullYear() === 2026 && sDate.getMonth() === idx) {
        spdTotal += s.totalCost;
      }
    });

    const total = payrollTotal + purchaseTotal + spdTotal;

    return {
      month,
      payroll: payrollTotal,
      purchases: purchaseTotal,
      spd: spdTotal,
      amount: total,
    };
  });

  return (
    <div className="flex flex-col h-[calc(100vh-5.25rem)] overflow-hidden gap-4 w-full animate-in fade-in duration-500 text-slate-800">
      {/* Premium Gradient Banner */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-indigo-600 border border-indigo-500/20 shadow-sm shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/15 text-blue-100 border border-white/20 tracking-widest uppercase mb-1.5 inline-block">
              DASHBOARD KEUANGAN
            </span>
            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName}
            </h1>
            {pendingCount > 0 ? (
              <p className="text-xs text-blue-100/90 mt-1">
                Terdapat <span className="text-white font-bold">{pendingCount} pengajuan dana baru</span> yang memerlukan verifikasi Anda.
              </p>
            ) : (
              <p className="text-xs text-blue-100/90 mt-1">Semua pengajuan pembayaran saat ini telah selesai diproses.</p>
            )}
          </div>
          <Link 
            href="/finance" 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border border-indigo-500/30"
          >
            Approval Pembayaran
            {pendingCount > 0 && (
              <span className="bg-indigo-500 text-white py-0.5 px-2 rounded-full text-[10px] font-black shadow-inner">
                {pendingCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Clean Symmetrical Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Link 
          href="/finance" 
          className="bg-white rounded-xl p-4 border-l-4 border-l-amber-500 border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[90px] relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pending</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-500 group-hover:bg-amber-100/70 transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              Rp {pendingAmount.toLocaleString("id-ID")}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1 leading-none">Menunggu approval pembayaran</p>
          </div>
        </Link>

        <Link 
          href="/finance" 
          className="bg-white rounded-xl p-4 border-l-4 border-l-indigo-500 border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[90px] relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menunggu Approval</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100/70 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {pendingCount} <span className="text-xs text-slate-400 font-medium">Tiket</span>
            </h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-1 leading-none">Perlu tindakan segera</p>
          </div>
        </Link>

        <Link 
          href="/finance" 
          className="bg-white rounded-xl p-4 border-l-4 border-l-emerald-500 border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[90px] relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telah Disetujui</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100/70 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {approvedCount} <span className="text-xs text-slate-400 font-medium">Tiket</span>
            </h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1 leading-none">Berhasil disetujui & diarsip</p>
          </div>
        </Link>

        <Link 
          href="/payroll" 
          className="bg-white rounded-xl p-4 border-l-4 border-l-violet-500 border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[90px] relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Draft Payroll</span>
            <div className="p-1.5 rounded-lg bg-violet-50 text-violet-500 group-hover:bg-violet-100/70 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
              {draftPayrollCount} <span className="text-xs text-slate-400 font-medium">Karyawan</span>
            </h3>
            <p className="text-[10px] text-violet-600 font-semibold mt-1 leading-none">Siap untuk diproses</p>
          </div>
        </Link>
      </div>

      {/* Modern & Symmetrical Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 h-[225px]">
        {/* Rebuilt Trend Curve Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-4 relative flex flex-col justify-between h-full hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                Tren Pengeluaran
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Budget terpakai bulanan (Januari - Desember 2026)</p>
            </div>
          </div>

          <div className="relative flex-1 w-full min-h-0 mt-2">
            <ChartContainer config={trendChartConfig} className="h-[140px] w-full min-h-0 min-w-0 aspect-auto">
              <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={6}
                  style={{ fontSize: "10px", fill: "#94a3b8", fontWeight: "bold" }}
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      indicator="line" 
                      formatter={(value, name, item) => {
                        const data = item.payload;
                        return (
                          <div className="space-y-1.5 min-w-[150px] text-slate-800">
                            <div className="flex items-center justify-between font-bold border-b border-slate-100 pb-1 text-[11px] mb-1">
                              <span>Pengeluaran {data.month}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <span>Payroll</span>
                              </div>
                              <span className="font-mono font-semibold">Rp {data.payroll.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span>Pembelian</span>
                              </div>
                              <span className="font-mono font-semibold">Rp {data.purchases.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                <span>SPD</span>
                              </div>
                              <span className="font-mono font-semibold">Rp {data.spd.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex items-center justify-between font-black text-[11px] border-t border-slate-100 pt-1.5 text-slate-800 mt-1 gap-4">
                              <span>Total</span>
                              <span className="font-mono text-indigo-600">Rp {data.amount.toLocaleString("id-ID")}</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                  } 
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#chartGradient)"
                  dot={{ r: 3, stroke: "#6366f1", strokeWidth: 1.5, fill: "#ffffff" }}
                  activeDot={{ r: 5, stroke: "#6366f1", strokeWidth: 1.5, fill: "#6366f1" }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Rebuilt 2-Column Donut Chart Card */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col justify-between h-full hover:shadow-sm transition-shadow">
          <div className="shrink-0">
            <h3 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              Alokasi Dana
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Proporsi anggaran operasional</p>
          </div>

          <div className="flex items-center justify-between gap-4 flex-1 min-h-0 py-2">
            {/* Recharts Donut Circle */}
            <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
              <ChartContainer config={donutConfig} className="w-24 h-24 min-h-0 min-w-0 aspect-square">
                <PieChart>
                  <Pie
                    data={[
                      { name: "payroll", value: 55, fill: "#6366f1" },
                      { name: "pembelian", value: 30, fill: "#f59e0b" },
                      { name: "operasional", value: 15, fill: "#10b981" }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={26}
                    outerRadius={36}
                    strokeWidth={1}
                    stroke="#ffffff"
                  />
                </PieChart>
              </ChartContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total</span>
                <span className="text-[11px] font-black text-slate-700 mt-1 leading-none">Rp 218M</span>
              </div>
            </div>

            {/* Premium Detailed Legends */}
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <div className="flex items-center justify-between text-[11px] border-b border-slate-50 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-slate-500 font-semibold">Payroll</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800 block leading-none">55%</span>
                  <span className="text-[8.5px] text-slate-400 font-medium">Rp 120M</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] border-b border-slate-50 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-500 font-semibold">Pembelian</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800 block leading-none">30%</span>
                  <span className="text-[8.5px] text-slate-400 font-medium">Rp 65M</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-500 font-semibold">Operasional</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800 block leading-none">15%</span>
                  <span className="text-[8.5px] text-slate-400 font-medium">Rp 33M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical & Clean Recent Activities List */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-100 flex flex-col p-4 overflow-hidden hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h2 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Pengajuan Terbaru</h2>
          <Link href="/finance" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 transition-colors">
            Semua Pengajuan <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
          {recentActivities.map((act, i) => {
            const sc = getStatusColor(act.status);
            return (
              <div 
                key={i} 
                onClick={() => setSelectedActivity(act)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {/* Badged Avatar Block */}
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100/80 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-600">
                      {act.initial}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white text-white shadow-sm ${
                      act.type === "SPD" ? "bg-sky-500" : "bg-indigo-500"
                    }`}>
                      <act.icon className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {act.user}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9.5px] text-slate-400 font-semibold font-mono">#{act.detail}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[9.5px] text-slate-400 font-medium">{act.type}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[9.5px] text-slate-400 font-medium">{formatDate(act.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Price/Cost */}
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800 tracking-tight">
                      Rp {act.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {/* Status Badges */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border capitalize tracking-wider ${sc.bg} ${sc.text} ${sc.border}`}>
                    {act.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title="Detail Pengajuan" size="lg"
        footer={
          <>
            <button onClick={() => setSelectedActivity(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">Tutup</button>
            {selectedActivity?.href && (
              <button onClick={() => router.push(selectedActivity.href)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                Approval <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        }
      >
        {selectedActivity && (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 text-slate-800">
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                  <selectedActivity.icon className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base leading-tight">{selectedActivity.type}</h4>
                  <p className="text-xs text-slate-500">{new Date(selectedActivity.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] font-bold text-slate-400 mb-1">Pengaju</p><p className="text-sm font-semibold text-slate-800">{selectedActivity.user}</p></div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 mb-1">Status</p>
                  <span className={`inline-flex px-2.5 py-0.5 rounded text-[11px] font-bold capitalize border ${getStatusColor(selectedActivity.status).bg} ${getStatusColor(selectedActivity.status).text} ${getStatusColor(selectedActivity.status).border}`}>{selectedActivity.status}</span>
                </div>
                <div className="col-span-2"><p className="text-[11px] font-bold text-slate-400 mb-1">No. Referensi</p><p className="text-sm font-semibold text-slate-800 font-sans">{selectedActivity.detail}</p></div>
              </div>
              {selectedActivity.extraDetails?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  {selectedActivity.extraDetails.map((f: any, idx: number) => (
                    <div key={idx}><p className="text-[11px] font-bold text-slate-400 mb-1">{f.label}</p><p className="text-sm font-semibold text-slate-800">{f.value}</p></div>
                  ))}
                </div>
              )}
            </div>
            {selectedActivity.description && (
              <div className="w-full md:w-5/12 md:border-l border-slate-100 md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 mt-6 md:mt-0">
                <p className="text-[11px] font-bold text-slate-400 mb-2">Keterangan</p>
                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed border border-slate-100">{selectedActivity.description}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
