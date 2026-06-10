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
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    <div className="flex flex-col h-full overflow-hidden gap-4 w-full text-slate-800 pb-0">
      {/* Premium Gradient Banner */}
      <div className="relative overflow-hidden rounded-xl p-4 bg-indigo-600 shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs text-indigo-200 font-medium mb-1 inline-block">
              Dashboard Keuangan
            </span>
            <h1 className="text-xl font-semibold text-white leading-snug">
              {getGreeting()}, {status === "loading" ? <span className="inline-block w-32 h-6 bg-white/20 animate-pulse rounded-md align-middle" /> : userName}
            </h1>
            {pendingCount > 0 ? (
              <p className="text-[13px] text-blue-100 mt-1">
                Terdapat <span className="text-white font-medium">{pendingCount} pengajuan dana baru</span> yang memerlukan verifikasi Anda.
              </p>
            ) : (
              <p className="text-[13px] text-blue-100 mt-1">Semua pengajuan pembayaran saat ini telah selesai diproses.</p>
            )}
          </div>
          <Link 
            href="/finance" 
            className="px-4 py-2 bg-white text-indigo-700 hover:bg-slate-50 active:scale-95 rounded-md text-[13px] font-medium transition-all flex items-center gap-2 shrink-0"
          >
            Approval Pembayaran
            {pendingCount > 0 && (
              <span className="text-indigo-700 text-[11px]">
                ({pendingCount})
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Clean Symmetrical Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Link 
          href="/finance" 
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Total Pending</span>
            <div className="text-amber-500">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              Rp {pendingAmount.toLocaleString("id-ID")}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Menunggu approval</p>
          </div>
        </Link>

        <Link 
          href="/finance" 
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Menunggu Approval</span>
            <div className="text-indigo-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {pendingCount} <span className="text-[11px] text-slate-400 font-normal">Tiket</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Perlu tindakan segera</p>
          </div>
        </Link>

        <Link 
          href="/finance" 
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Telah Disetujui</span>
            <div className="text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {approvedCount} <span className="text-[11px] text-slate-400 font-normal">Tiket</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Berhasil disetujui</p>
          </div>
        </Link>

        <Link 
          href="/payroll" 
          className="bg-white p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-slate-500">Draft Payroll</span>
            <div className="text-violet-500">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-900 leading-none">
              {draftPayrollCount} <span className="text-[11px] text-slate-400 font-normal">Karyawan</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-none">Siap untuk diproses</p>
          </div>
        </Link>
      </div>

      {/* Modern & Symmetrical Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Rebuilt Trend Curve Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 relative flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between shrink-0 mb-2">
            <div>
              <h3 className="text-[13px] font-medium text-slate-900">
                Tren Pengeluaran
              </h3>
            </div>
          </div>

          <div className="relative flex-1 w-full min-h-0">
            <ChartContainer config={trendChartConfig} className="h-full w-full aspect-auto">
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
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col h-full overflow-hidden">
          <div className="shrink-0 mb-2">
            <h3 className="text-[13px] font-medium text-slate-900">
              Alokasi Dana
            </h3>
          </div>

          <div className="flex items-center justify-between gap-4 flex-1 min-h-0">
            {/* Recharts Donut Circle */}
            <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
              <ChartContainer config={donutConfig} className="w-24 h-24 aspect-square">
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
                <span className="text-[10px] text-slate-500 leading-none">Total</span>
                <span className="text-xs font-medium text-slate-900 mt-0.5 leading-none">218M</span>
              </div>
            </div>

            {/* Premium Detailed Legends */}
            <div className="flex-1 flex flex-col justify-center space-y-2 overflow-y-auto pr-1 scrollbar-hide h-full">
              <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1.5 last:border-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-slate-500 truncate">Payroll</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-medium text-slate-900 block leading-none">55%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1.5 last:border-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-500 truncate">Pembelian</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-medium text-slate-900 block leading-none">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1.5 last:border-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-500 truncate">Operasional</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-medium text-slate-900 block leading-none">15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical & Clean Recent Activities List */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-[13px] font-medium text-slate-900">Pengajuan Terbaru</h2>
          <Link href="/finance" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
            Semua Pengajuan <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="px-4 py-2 font-medium">Pengaju & Tipe</th>
                <th className="px-4 py-2 font-medium">Tanggal</th>
                <th className="px-4 py-2 font-medium text-right">Nilai</th>
                <th className="px-4 py-2 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {recentActivities.map((act, i) => {
                const sc = getStatusColor(act.status);
                return (
                  <tr key={i} onClick={() => setSelectedActivity(act)} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full border border-slate-200 text-slate-600 font-medium text-[11px] flex items-center justify-center shrink-0">
                          {act.initial}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{act.user}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{act.type} • #{act.detail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(act.date)}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">Rp {act.amount.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-center text-xs">
                      <span className={`capitalize font-medium ${sc.text.replace('text-', 'text-').replace('-800', '-600').replace('-700', '-600')}`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title="Detail Pengajuan" size="lg"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button onClick={() => setSelectedActivity(null)} className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Tutup</button>
            {selectedActivity?.href && (
              <button onClick={() => router.push(selectedActivity.href)} className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-[13px] font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                Approval <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        }
      >
        {selectedActivity && (
          <div className="p-2 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-medium text-slate-900 text-[13px]">{selectedActivity.type}</h4>
                <p className="text-xs text-slate-500">{new Date(selectedActivity.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div><p className="text-xs text-slate-500 mb-1">Pengaju</p><p className="font-medium text-slate-900">{selectedActivity.user}</p></div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <span className={`capitalize font-medium text-slate-900`}>{selectedActivity.status}</span>
              </div>
              <div className="col-span-2"><p className="text-xs text-slate-500 mb-1">No. Referensi</p><p className="font-medium text-slate-900">{selectedActivity.detail}</p></div>
            </div>
            {selectedActivity.extraDetails?.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-[13px]">
                {selectedActivity.extraDetails.map((f: any, idx: number) => (
                  <div key={idx}><p className="text-xs text-slate-500 mb-1">{f.label}</p><p className="font-medium text-slate-900">{f.value}</p></div>
                ))}
              </div>
            )}
            {selectedActivity.description && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Keterangan</p>
                <div className="text-[13px] text-slate-900 leading-relaxed">{selectedActivity.description}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
