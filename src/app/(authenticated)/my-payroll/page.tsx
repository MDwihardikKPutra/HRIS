"use client";

import { useState, useMemo } from "react";
import { payrolls, getUserById, getStatusColor, users } from "@/lib/data";
import Modal from "@/components/Modal";
import { Search, Printer, Banknote, Download } from "lucide-react";
import { useSession } from "next-auth/react";

export default function MyPayrollPage() {
 const { data: session } = useSession();
 const [searchQuery, setSearchQuery] = useState("");
 const [filterYear, setFilterYear] = useState("2026");

 // PDF Preview State
 const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
 const [selectedSlip, setSelectedSlip] = useState<any>(null);

 // Extract user email for dependency
 const userEmail = session?.user?.email;

 const openSlipPreview = (item: any) => {
 setSelectedSlip(item);
 setIsSlipModalOpen(true);
 };

 const myPayrolls = useMemo(() => {
 // Find user by email
 const currentUser = users.find(u => u.email === userEmail);
 if (!currentUser) return [];

 return payrolls
 .filter(p => p.userId === currentUser.id)
 .map(p => ({
 id: p.id,
 period: p.period,
 baseSalary: p.baseSalary,
 allowances: p.allowances,
 deductions: p.deductions,
 netSalary: p.netSalary,
 status: p.status,
 paymentDate: p.paymentDate,
 user: currentUser
 }))
 .filter(p => p.period.includes(filterYear) && p.period.toLowerCase().includes(searchQuery.toLowerCase()));
 }, [userEmail, filterYear, searchQuery]);

 return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden w-full animate-in fade-in duration-500 pb-2">
      {/* Unified Table Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white border border-slate-100/80 rounded-2xl flex flex-col overflow-hidden shadow-xs">
        
        {/* Top Card Header (Title and description) */}
        <div className="border-b border-slate-100 p-4 bg-white shrink-0 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Slip Gaji Saya</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">Pantau riwayat penggajian dan unduh slip gaji bulanan</p>
            </div>
          </div>
        </div>

        {/* Unified Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-50 bg-white shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {["2026", "2025"].map((year) => (
              <button
                key={year}
                onClick={() => setFilterYear(year)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all border ${
                  filterYear === year 
                    ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                    : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                }`}
              >
                Tahun {year}
              </button>
            ))}
          </div>
          
          {/* Search Box */}
          <div className="relative group w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Cari bulan (misal: Mei)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50/40 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Table Viewport */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 tracking-wide text-[10px] sticky top-0 z-10">
                <th className="text-left py-3 px-4 font-bold">Periode</th>
                <th className="text-left py-3 px-4 font-bold">Total Pendapatan</th>
                <th className="text-left py-3 px-4 hidden md:table-cell font-bold">Total Potongan</th>
                <th className="text-left py-3 px-4 font-bold text-slate-800">Take Home Pay</th>
                <th className="text-center py-3 px-4 font-bold">Status</th>
                <th className="text-right py-3 px-4 font-bold">Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myPayrolls.map((item: any) => (
                <tr key={item.id} className="group hover:bg-slate-50/40 transition-colors cursor-pointer" onClick={() => openSlipPreview(item)}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-none mb-1">{item.period}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.paymentDate ? new Date(item.paymentDate).toLocaleDateString("id-ID") : '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    Rp {(item.baseSalary + item.allowances).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-red-500 font-medium">
                    - Rp {item.deductions.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    Rp {item.netSalary.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border tracking-wide bg-transparent ${item.status === 'paid' ? 'text-emerald-600 border-emerald-200' : 'text-amber-600 border-amber-200'}`}>
                      {item.status === 'paid' ? 'Dibayar' : 'Diproses'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openSlipPreview(item); }}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg inline-flex"
                      title="Lihat Slip"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {myPayrolls.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium text-sm">
                    Tidak ada catatan penggajian ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

 {/* Slip Gaji Modal */}
 <Modal
 isOpen={isSlipModalOpen}
 onClose={() => setIsSlipModalOpen(false)}
 title="Slip Gaji Karyawan"
 size="lg"
 footer={
 <>
 <button
 onClick={() => setIsSlipModalOpen(false)}
 className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
 >
 Tutup
 </button>
 <button
 className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all"
 >
 <Download className="w-3.5 h-3.5" /> Unduh PDF
 </button>
 </>
 }
 >
 {selectedSlip && (() => {
 const baseSalary = selectedSlip.baseSalary || 0;
 const user = selectedSlip.user;

 // Allowances breakdown
 const allowance_meal = user?.allowanceMeal ?? 500000;
 const allowance_transport = user?.allowanceTransport ?? 500000;
 const allowance_position_pct = user?.allowancePositionPct ?? 10;
 const allowance_position = baseSalary * (allowance_position_pct / 100);
 const total_allowances = allowance_meal + allowance_transport + allowance_position;

 // Deductions breakdown
 const bpjs_kes_pct = user?.deductionBpjsKesehatanPct ?? 1;
 const bpjs_ket_pct = user?.deductionBpjsKetenagakerjaanPct ?? 2;
 const pph21_pct = user?.deductionPph21Pct ?? 5;

 const bpjs_kesehatan = baseSalary * (bpjs_kes_pct / 100);
 const bpjs_ketenagakerjaan = baseSalary * (bpjs_ket_pct / 100);
 const pph21 = baseSalary * (pph21_pct / 100);
 const total_deductions = bpjs_kesehatan + bpjs_ketenagakerjaan + pph21;
 
 return (
 <div className="space-y-6 px-1">
 {/* Header / Identitas */}
 <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end border-b border-slate-100 pb-5 gap-4">
 <div>
 <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Slip Gaji</h3>
 <p className="text-sm text-slate-500 font-medium mt-1">Periode {selectedSlip.period}</p>
 </div>
 <div className="text-left md:text-right text-sm">
 <p className="font-bold text-slate-800">{selectedSlip.user.name}</p>
 <p className="text-slate-500">{selectedSlip.user.employeeId} • {selectedSlip.user.position}</p>
 <p className="text-slate-500">{selectedSlip.user.department}</p>
 </div>
 </div>

 {/* Rincian Komponen */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
 {/* Pendapatan */}
 <div className="h-full flex flex-col">
 <div className="flex items-center mb-3 h-5 shrink-0">
 <h4 className="text-sm font-semibold text-slate-800 leading-none">Pendapatan</h4>
 </div>
 <div className="flex-1 flex flex-col border border-slate-100 rounded-lg p-4 bg-white">
 <div className="flex justify-between items-center text-xs mb-4">
 <span className="text-slate-700 font-bold">Gaji Pokok</span>
 <span className="font-bold text-slate-800 text-sm">Rp {baseSalary.toLocaleString('id-ID')}</span>
 </div>
 <div className="border-t border-slate-100 pt-4 space-y-3 flex-1">
 <div className="flex justify-between items-center text-xs">
 <span className="text-slate-500">Tunjangan Makan</span>
 <span className="font-medium text-slate-700">Rp {allowance_meal.toLocaleString('id-ID')}</span>
 </div>
 <div className="flex justify-between items-center text-xs">
 <span className="text-slate-500">Tunjangan Transport</span>
 <span className="font-medium text-slate-700">Rp {allowance_transport.toLocaleString('id-ID')}</span>
 </div>
 <div className="flex justify-between items-center text-xs">
 <span className="text-slate-500">Tunjangan Jabatan <span className="text-slate-400 font-normal">({allowance_position_pct}% × Gaji)</span></span>
 <span className="font-medium text-slate-700">Rp {allowance_position.toLocaleString('id-ID')}</span>
 </div>
 </div>
 <div className="mt-4 pt-4 border-t border-slate-100 border-dashed">
 <div className="flex justify-between items-center">
 <span className="text-xs font-bold text-slate-800">Total Pendapatan</span>
 <span className="text-sm font-bold text-emerald-600">+ Rp {(baseSalary + total_allowances).toLocaleString('id-ID')}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Potongan */}
 <div className="h-full flex flex-col">
 <div className="flex items-center mb-3 h-5 shrink-0">
 <h4 className="text-sm font-semibold text-slate-800 leading-none">Potongan</h4>
 </div>
 <div className="flex-1 flex flex-col border border-slate-100 rounded-lg p-4 bg-white">
 <div className="space-y-3 flex-1">
 <div className="flex justify-between items-center text-xs">
 <span className="text-slate-500">BPJS Kes <span className="text-slate-400 font-normal">({bpjs_kes_pct}% × Gaji)</span></span>
 <span className="font-medium text-slate-700">Rp {bpjs_kesehatan.toLocaleString('id-ID')}</span>
 </div>
 <div className="flex justify-between items-center text-xs">
 <span className="text-slate-500">BPJS TK <span className="text-slate-400 font-normal">({bpjs_ket_pct}% × Gaji)</span></span>
 <span className="font-medium text-slate-700">Rp {bpjs_ketenagakerjaan.toLocaleString('id-ID')}</span>
 </div>
 <div className="flex justify-between items-center text-xs">
 <span className="text-slate-500">PPh 21 <span className="text-slate-400 font-normal">({pph21_pct}%)</span></span>
 <span className="font-medium text-slate-700">Rp {pph21.toLocaleString('id-ID')}</span>
 </div>
 </div>
 <div className="mt-4 pt-4 border-t border-slate-100 border-dashed">
 <div className="flex justify-between items-center">
 <span className="text-xs font-bold text-slate-800">Total Potongan</span>
 <span className="text-sm font-bold text-red-500">- Rp {total_deductions.toLocaleString('id-ID')}</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Total Take Home Pay */}
 <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
 <div>
 <p className="text-sm font-semibold text-slate-500">Take Home Pay</p>
 {selectedSlip.status === 'paid' ? (
 <p className="text-xs text-slate-400 mt-1">
 Ditransfer pada {new Date(selectedSlip.paymentDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}
 </p>
 ) : (
 <p className="text-xs text-amber-500 mt-1 font-medium">
 Dalam proses pencairan
 </p>
 )}
 </div>
 <p className="text-3xl font-bold text-slate-800 tracking-tight">
 Rp {selectedSlip.netSalary.toLocaleString('id-ID')}
 </p>
 </div>
 </div>
 );
 })()}
 </Modal>
 </div>
 );
}
