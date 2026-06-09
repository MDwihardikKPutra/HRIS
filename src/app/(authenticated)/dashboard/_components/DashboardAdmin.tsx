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
    <div className="p-4 flex flex-col relative overflow-hidden group hover:bg-slate-50/50 transition-colors flex-1">
      <div className="flex justify-between items-start mb-3">
        <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 " + iconBg}>
          {icon}
        </div>
        {trendStr && (
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 ${trendUp ? "text-emerald-600 bg-emerald-50/50" : "text-red-600 bg-red-50/50"}`}>
            {trendUp ? <TrendingUp className="w-2.5 h-2.5"/> : <TrendingUp className="w-2.5 h-2.5 rotate-180"/>} {trendStr}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 mb-0.5">{label}</p>
        <p className={"text-xl font-black tracking-tight leading-none mb-1.5 " + valueColor}>{value}</p>
        <div className="flex items-center gap-1">
          {subIcon}
          <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
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
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-full"><AlertCircle className="w-3.5 h-3.5" /></div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">Antrean Persetujuan</h2>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{totalPendingItems} Total</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-2.5">Tipe & Tanggal</th>
                  <th className="px-4 py-2.5">Pemohon</th>
                  <th className="px-4 py-2.5">Deskripsi</th>
                  <th className="px-4 py-2.5 text-right">Nilai / Estimasi</th>
                  <th className="px-4 py-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {approvalQueue.length > 0 ? approvalQueue.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-slate-900">{item.type}</p>
                      <p className="text-[10px] text-slate-400">{new Date(item.date).toLocaleDateString("id-ID")}</p>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-700">{item.user}</td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500 max-w-[180px] truncate">{item.desc}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                      {item.amount ? formatCurrency(item.amount) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Link href={item.link} className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-700 text-[10px] font-bold rounded-full hover:bg-slate-100 transition-colors">
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
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col p-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-400" /> Ringkasan Keuangan
            </h2>
            <Link href="/finance" className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"><ArrowUpRight className="w-3.5 h-3.5"/></Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-500">Realisasi Budget</span>
                <span className="font-black text-slate-900">{pengeluaranPct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1 mb-1.5">
                <div className={`h-1 rounded-full ${pengeluaranPct > 80 ? 'bg-red-500' : 'bg-slate-800'}`} style={{ width: `${Math.min(pengeluaranPct, 100)}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 text-right font-medium">Dari {formatCurrency(totalBudget)}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500">Pembelian Alat/Jasa</span>
                <span className="text-xs font-black text-slate-900">{formatCurrency(approvedPurchasesTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500">Perjalanan Dinas (SPD)</span>
                <span className="text-xs font-black text-slate-900">{formatCurrency(approvedSpdsTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500">Pembayaran Vendor</span>
                <span className="text-xs font-black text-slate-900">{formatCurrency(approvedVendorsTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500">Payroll / Gaji</span>
                <span className="text-xs font-black text-slate-900">{formatCurrency(paidPayrollsTotal)}</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-start gap-2">
                <Activity className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-900">Status Stabil</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">Pengeluaran bulan ini masih dalam batas aman rencana proyek.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: RECENT ACTIVITIES & DIRECTORY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* RECENT ACTIVITIES / CHART */}
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-slate-400" /> Analisis Kehadiran & Aktivitas
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-hidden min-h-[200px]">
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
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="px-4 py-3 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-full"><Users className="w-3.5 h-3.5" /></div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">Direktori Personel</h2>
            </div>
            <Link href="/users" className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-700 rounded-full text-[10px] font-bold hover:bg-slate-100 transition-colors flex items-center gap-1">
              Kelola <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-2.5">Nama Lengkap</th>
                  <th className="px-4 py-2.5 hidden sm:table-cell">Jabatan / Dept</th>
                  <th className="px-4 py-2.5 text-center">Akses Role</th>
                  <th className="px-4 py-2.5 text-center hidden md:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-black text-[10px] flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-105 transition-transform">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <p className="font-bold text-slate-700 leading-tight text-xs">{user.position}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">{user.department}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                        user.role === 'admin' ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                        user.role === 'hr' ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        {user.role === 'admin' && <ShieldCheck className="w-2.5 h-2.5"/>}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center hidden md:table-cell">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
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
