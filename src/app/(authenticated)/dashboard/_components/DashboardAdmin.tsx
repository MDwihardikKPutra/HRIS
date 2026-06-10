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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ icon, iconBg, label, value, sub, valueColor, subIcon, trendStr, trendUp }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string | number;
  sub: string; valueColor: string; subIcon?: React.ReactNode; trendStr?: string; trendUp?: boolean;
}) {
  return (
    <div className="p-3 flex flex-col relative overflow-hidden flex-1">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center justify-center shrink-0">
          {icon}
        </div>
        {trendStr && (
          <span className={`text-[11px] font-medium flex items-center gap-1 ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
            {trendUp ? <TrendingUp className="w-3 h-3"/> : <TrendingUp className="w-3 h-3 rotate-180"/>} {trendStr}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className={"text-xl font-medium leading-none mb-1.5 " + valueColor}>{value}</p>
        <div className="flex items-center gap-1.5">
          {subIcon}
          <p className="text-[11px] text-slate-400">{sub}</p>
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
    return q.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [pendingLeave, pendingSpds, pendingPurchases, pendingVendors]);

  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      
      {/* ── 5 DETAILED STAT CARDS (Edge-to-Edge Unified Block) ── */}
      <div className="bg-white border border-slate-200 rounded-xl flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 shrink-0 overflow-hidden">
        <StatCard 
          icon={<Users className="w-4 h-4 text-indigo-600"/>} iconBg="bg-indigo-50"
          label="Total Personel" value={activeUsers} sub={`${users.length - activeUsers} Inaktif`} valueColor="text-slate-900"
          trendStr="+2 bln ini" trendUp={true}
        />
        <StatCard 
          icon={<FolderKanban className="w-4 h-4 text-emerald-600"/>} iconBg="bg-emerald-50"
          label="Proyek Berjalan" value={activeProjects.length} sub={`Budget: ${formatCurrency(totalBudget)}`} valueColor="text-slate-900"
        />
        <StatCard 
          icon={<Clock className="w-4 h-4 text-amber-600"/>} iconBg="bg-amber-50"
          label="Antrean Approval" value={totalPendingItems} sub="Cuti, SPD, Pembelian" valueColor="text-slate-900"
          trendStr={`${pendingLeave.length} Cuti`} trendUp={false}
        />
        <StatCard 
          icon={<Wallet className="w-4 h-4 text-rose-600"/>} iconBg="bg-rose-50"
          label="Total Pengeluaran" value={formatCurrency(totalPengeluaran)} sub={`${pengeluaranPct}% budget`} valueColor="text-slate-900"
        />
        <StatCard 
          icon={<Banknote className="w-4 h-4 text-violet-600"/>} iconBg="bg-violet-50"
          label="Payroll Draft" value={draftPayrolls} sub="Siklus bulan ini" valueColor="text-slate-900"
        />
      </div>

      {/* ── MIDDLE ROW: APPROVAL QUEUE & FINANCIAL SUMMARY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* APPROVAL QUEUE (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden h-full">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400" />
              <h2 className="text-[13px] font-medium text-slate-900">Antrean Persetujuan</h2>
            </div>
            <span className="text-[11px] text-slate-500">{totalPendingItems} Total</span>
          </div>
          <div className="flex-1 overflow-auto scrollbar-hide">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
                <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                  <th className="px-4 py-2 font-medium">Tipe & Tanggal</th>
                  <th className="px-4 py-2 font-medium">Pemohon</th>
                  <th className="px-4 py-2 font-medium">Deskripsi</th>
                  <th className="px-4 py-2 font-medium text-right">Nilai / Estimasi</th>
                  <th className="px-4 py-2 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {approvalQueue.length > 0 ? approvalQueue.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{item.type}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{new Date(item.date).toLocaleDateString("id-ID")}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.user}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">{item.desc}</td>
                    <td className="px-4 py-3 text-right text-slate-900">
                      {item.amount ? formatCurrency(item.amount) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={item.link} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition-colors">
                        Review <ChevronRight className="w-3 h-3"/>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700">Tidak ada antrean</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCIAL SUMMARY (Span 1) */}
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col p-4 overflow-y-auto scrollbar-hide h-full">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-[13px] font-medium text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" /> Ringkasan Keuangan
            </h2>
            <Link href="/finance" className="p-1 text-slate-400 hover:text-slate-900 transition-colors"><ArrowUpRight className="w-4 h-4"/></Link>
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500">Realisasi Budget</span>
                <span className="font-medium text-slate-900">{pengeluaranPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1 mb-2">
                <div className={`h-1 ${pengeluaranPct > 80 ? 'bg-red-500' : 'bg-slate-900'}`} style={{ width: `${Math.min(pengeluaranPct, 100)}%` }} />
              </div>
              <p className="text-[11px] text-slate-400 text-right">Dari {formatCurrency(totalBudget)}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Pembelian Alat/Jasa</span>
                <span className="font-medium text-slate-900">{formatCurrency(approvedPurchasesTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Perjalanan Dinas (SPD)</span>
                <span className="font-medium text-slate-900">{formatCurrency(approvedSpdsTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Pembayaran Vendor</span>
                <span className="font-medium text-slate-900">{formatCurrency(approvedVendorsTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Payroll / Gaji</span>
                <span className="font-medium text-slate-900">{formatCurrency(paidPayrollsTotal)}</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-200 shrink-0">
              <div className="flex items-start gap-2 text-slate-500">
                <Activity className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-slate-900 leading-none">Status Stabil</p>
                  <p className="text-[11px] mt-1 leading-relaxed">Pengeluaran bulan ini masih dalam batas aman rencana proyek.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: RECENT ACTIVITIES & DIRECTORY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* RECENT ACTIVITIES / CHART */}
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden h-full">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
            <h2 className="text-[13px] font-medium text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-400" /> Analisis Kehadiran & Aktivitas
            </h2>
          </div>
          <div className="p-3 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Senin', hadir: 18, izin: 2 },
                { name: 'Selasa', hadir: 19, izin: 1 },
                { name: 'Rabu', hadir: 17, izin: 3 },
                { name: 'Kamis', hadir: 20, izin: 0 },
                { name: 'Jumat', hadir: 16, izin: 4 },
              ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                />
                <Bar dataKey="hadir" name="Kehadiran" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="izin" name="Cuti/Izin/Sakit" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PERSONNEL DIRECTORY (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden h-full">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <h2 className="text-[13px] font-medium text-slate-900">Direktori Personel</h2>
            </div>
            <Link href="/users" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
              Kelola <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-auto scrollbar-hide">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
                <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                  <th className="px-4 py-2 font-medium">Nama Lengkap</th>
                  <th className="px-4 py-2 font-medium hidden sm:table-cell">Jabatan / Dept</th>
                  <th className="px-4 py-2 font-medium text-center">Akses Role</th>
                  <th className="px-4 py-2 font-medium text-center hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full border border-slate-200 text-slate-600 font-medium text-[11px] flex items-center justify-center shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 leading-tight">{user.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{user.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-slate-900 leading-tight text-[12px]">{user.position}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{user.department}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-[12px] text-slate-500 capitalize">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"/> Inaktif
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
