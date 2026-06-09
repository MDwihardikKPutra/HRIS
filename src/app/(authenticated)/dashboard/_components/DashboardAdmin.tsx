"use client";

import {
  users, projects, workPlans, workRealizations, leaveRequests, spds, purchases, payrolls, vendorPayments,
  getUserById, getProjectById, getStatusColor, formatDate, formatCurrency
} from "@/lib/data";
import {
  Users, FolderKanban, ClipboardList, CalendarDays,
  Plane, ShoppingCart, Banknote, BarChart3, ChevronRight, CheckCircle2, HeartPulse,
  Activity, ArrowUpRight, ShieldCheck, Clock, CreditCard, Wallet, TrendingUp, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

function StatCard({ icon, iconBg, label, value, sub, valueColor, subIcon, trendStr, trendUp }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string | number;
  sub: string; valueColor: string; subIcon?: React.ReactNode; trendStr?: string; trendUp?: boolean;
}) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className={"w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 " + iconBg}>
          {icon}
        </div>
        {trendStr && (
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 ${trendUp ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
            {trendUp ? <TrendingUp className="w-3 h-3"/> : <TrendingUp className="w-3 h-3 rotate-180"/>} {trendStr}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className={"text-2xl font-black leading-tight truncate " + valueColor}>{value}</p>
        <div className="flex items-center gap-1 mt-1.5">
          {subIcon}
          <p className="text-[10px] text-slate-500 font-medium truncate">{sub}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardAdmin() {
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? "User";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // --- Data Calculations ---
  const pendingLeave = leaveRequests.filter(l => l.status === "pending");
  const pendingSpds = spds.filter(s => s.status === "pending");
  const pendingPurchases = purchases.filter(p => p.status === "pending");
  const pendingVendors = vendorPayments.filter(v => v.status === "pending");
  
  const totalPendingItems = pendingLeave.length + pendingSpds.length + pendingPurchases.length + pendingVendors.length;

  const draftPayrolls = payrolls.filter(p => p.status === "draft").length;
  const activeUsers = users.filter(u => u.isActive).length;
  const activeProjects = projects.filter(p => p.status === "active");
  const totalWorkPlans = workPlans.length;
  const totalBudget = activeProjects.reduce((sum, p) => sum + p.budget, 0);

  // Financial Stats
  const approvedPurchasesTotal = purchases.filter(p => p.status === "approved").reduce((s, p) => s + p.totalPrice, 0);
  const approvedSpdsTotal = spds.filter(p => p.status === "approved").reduce((s, p) => s + p.totalCost, 0);
  const approvedVendorsTotal = vendorPayments.filter(p => p.status === "approved").reduce((s, p) => s + p.amount, 0);
  const paidPayrollsTotal = payrolls.filter(p => p.status === "paid").reduce((s, p) => s + p.netSalary, 0);
  
  const totalPengeluaran = approvedPurchasesTotal + approvedSpdsTotal + approvedVendorsTotal + paidPayrollsTotal;
  const pengeluaranPct = totalBudget > 0 ? Math.round((totalPengeluaran / totalBudget) * 100) : 0;

  // Build unified approval queue (latest 6)
  const approvalQueue = useMemo(() => {
    const q: any[] = [];
    pendingLeave.forEach(l => q.push({ id: `L-${l.id}`, date: l.createdAt, type: "Cuti & Izin", desc: l.reason, user: getUserById(l.userId)?.name, link: "/leave", amount: null }));
    pendingSpds.forEach(s => q.push({ id: `S-${s.id}`, date: s.createdAt, type: "Perjalanan Dinas", desc: s.purpose, user: getUserById(s.userId)?.name, link: "/spd", amount: s.totalCost }));
    pendingPurchases.forEach(p => q.push({ id: `P-${p.id}`, date: p.createdAt, type: "Pembelian", desc: p.description, user: getUserById(p.userId)?.name, link: "/purchase", amount: p.totalPrice }));
    pendingVendors.forEach(v => q.push({ id: `V-${v.id}`, date: v.createdAt, type: "Vendor", desc: v.description, user: getUserById(v.userId)?.name, link: "/finance", amount: v.amount }));
    return q.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [pendingLeave, pendingSpds, pendingPurchases, pendingVendors]);

  return (
    <div className="flex flex-col h-full overflow-y-auto w-full pb-10 space-y-5">
      
      {/* ── 5 DETAILED STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 shrink-0">
        <StatCard 
          icon={<Users className="w-5 h-5 text-indigo-600"/>} iconBg="bg-indigo-50 border-indigo-100"
          label="Total Personel" value={activeUsers} sub={`${users.length - activeUsers} Inaktif`} valueColor="text-slate-800"
          trendStr="+2 bln ini" trendUp={true}
        />
        <StatCard 
          icon={<FolderKanban className="w-5 h-5 text-emerald-600"/>} iconBg="bg-emerald-50 border-emerald-100"
          label="Proyek Berjalan" value={activeProjects.length} sub={`Budget: ${formatCurrency(totalBudget)}`} valueColor="text-emerald-700"
        />
        <StatCard 
          icon={<Clock className="w-5 h-5 text-amber-500"/>} iconBg="bg-amber-50 border-amber-100"
          label="Antrean Approval" value={totalPendingItems} sub="Cuti, SPD, Pembelian" valueColor="text-amber-600"
          trendStr={`${pendingLeave.length} Cuti`} trendUp={false}
        />
        <StatCard 
          icon={<Wallet className="w-5 h-5 text-rose-500"/>} iconBg="bg-rose-50 border-rose-100"
          label="Total Pengeluaran" value={formatCurrency(totalPengeluaran)} sub={`${pengeluaranPct}% dari total budget`} valueColor="text-rose-700"
        />
        <StatCard 
          icon={<Banknote className="w-5 h-5 text-violet-600"/>} iconBg="bg-violet-50 border-violet-100"
          label="Payroll Draft" value={draftPayrolls} sub="Siklus bulan ini" valueColor="text-violet-700"
        />
      </div>

      {/* ── MIDDLE ROW: APPROVAL QUEUE & FINANCIAL SUMMARY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 shrink-0">
        
        {/* APPROVAL QUEUE (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
              <h2 className="text-sm font-bold text-slate-800">Antrean Persetujuan (Prioritas)</h2>
            </div>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">{totalPendingItems} Total</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Tipe & Tanggal</th>
                  <th className="px-4 py-3">Pemohon</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3 text-right">Nilai / Estimasi</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {approvalQueue.length > 0 ? approvalQueue.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-700">{item.type}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date(item.date).toLocaleDateString("id-ID")}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600">{item.user}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-500 max-w-[200px] truncate">{item.desc}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700">
                      {item.amount ? formatCurrency(item.amount) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={item.link} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100 hover:border-indigo-600">
                        Review <ChevronRight className="w-3 h-3"/>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-600">Tidak ada antrean</p>
                      <p className="text-xs text-slate-400">Semua pengajuan telah diproses.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCIAL SUMMARY (Span 1) */}
        <div className="bg-white border-2 border-slate-100 rounded-xl shadow-sm flex flex-col p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> Ringkasan Keuangan
            </h2>
            <Link href="/finance" className="p-1 text-slate-400 hover:text-blue-500"><ArrowUpRight className="w-4 h-4"/></Link>
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-600">Realisasi Budget</span>
                <span className="font-black text-slate-800">{pengeluaranPct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${pengeluaranPct > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pengeluaranPct, 100)}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">Dari {formatCurrency(totalBudget)}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[11px] font-bold text-slate-600">Pembelian Alat/Jasa</span>
                </div>
                <span className="text-xs font-black text-slate-800">{formatCurrency(approvedPurchasesTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[11px] font-bold text-slate-600">Perjalanan Dinas (SPD)</span>
                </div>
                <span className="text-xs font-black text-slate-800">{formatCurrency(approvedSpdsTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[11px] font-bold text-slate-600">Pembayaran Vendor</span>
                </div>
                <span className="text-xs font-black text-slate-800">{formatCurrency(approvedVendorsTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-[11px] font-bold text-slate-600">Payroll / Gaji</span>
                </div>
                <span className="text-xs font-black text-slate-800">{formatCurrency(paidPayrollsTotal)}</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-blue-800">Status Keuangan Stabil</p>
                  <p className="text-[9px] text-blue-600 mt-0.5 leading-relaxed">Pengeluaran bulan ini masih dalam batas aman rencana proyek.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: RECENT ACTIVITIES & DIRECTORY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 shrink-0">
        
        {/* RECENT ACTIVITIES */}
        <div className="bg-white border-2 border-slate-100 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" /> Aktivitas Sistem
            </h2>
          </div>
          <div className="p-5 flex-1">
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
              {/* Dummy Timeline items based on stats */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-emerald-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                  <p className="font-bold text-slate-800 text-xs">Payroll Selesai</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Siklus gaji bulan lalu telah didistribusikan.</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <Users className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                  <p className="font-bold text-slate-800 text-xs">2 Karyawan Baru</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Berhasil ditambahkan ke sistem HRIS.</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-amber-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <ClipboardList className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                  <p className="font-bold text-slate-800 text-xs">{totalWorkPlans} Rencana Kerja</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Draft EAR telah disubmit minggu ini.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PERSONNEL DIRECTORY (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border-2 border-slate-100 overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-800">Direktori Personel</h2>
            </div>
            <Link href="/users" className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-sm">
              Kelola <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Nama Lengkap</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Jabatan / Dept</th>
                  <th className="px-5 py-3 text-center">Akses Role</th>
                  <th className="px-5 py-3 text-center hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-black text-[11px] flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-105 transition-transform">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">{user.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <p className="font-bold text-slate-700 leading-tight">{user.position}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">{user.department}</p>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                        user.role === 'admin' ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
                        user.role === 'hr' ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        {user.role === 'admin' && <ShieldCheck className="w-2.5 h-2.5"/>}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center hidden md:table-cell">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"/> Inaktif
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
