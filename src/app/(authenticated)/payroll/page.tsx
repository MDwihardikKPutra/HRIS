"use client";

import { useState, useMemo } from "react";
import { payrolls as initialPayrolls, users, Payroll } from "@/lib/data";
import Modal from "@/components/Modal";
import { Search, CheckCircle, RefreshCcw, Banknote, Edit3, UploadCloud, X, Settings2, Save } from "lucide-react";

export default function ManagePayrollPage() {
 const [payrollsState, setPayrollsState] = useState<Payroll[]>(initialPayrolls);
 const [searchQuery, setSearchQuery] = useState("");
 const [filterMonth, setFilterMonth] = useState("Juni");
 const [filterYear, setFilterYear] = useState("2026");
 const filterPeriod = `${filterMonth} ${filterYear}`;
 
 const [isProcessing, setIsProcessing] = useState(false);
 const [masterUsers, setMasterUsers] = useState(users);
 const [activeTab, setActiveTab] = useState<"pencairan" | "master">("pencairan");
 const [editingMasterUser, setEditingMasterUser] = useState<any>(null);
 const [draftSalaryForm, setDraftSalaryForm] = useState({
 baseSalary: 0,
 allowanceMeal: 500000,
 allowanceTransport: 500000,
 allowancePositionPct: 10,
 deductionBpjsKesehatanPct: 1,
 deductionBpjsKetenagakerjaanPct: 2,
 deductionPph21Pct: 5
 });
 const [isManageModalOpen, setIsManageModalOpen] = useState(false);
 const [selectedManageItem, setSelectedManageItem] = useState<any>(null);
 const [uploadFile, setUploadFile] = useState<File | null>(null);
 const [editForm, setEditForm] = useState({ notes: "" });


 // Calculate dynamic components based on baseSalary
 const employeeMaster = masterUsers.find(u => u.id === selectedManageItem?.userId);
 const baseSalary = employeeMaster?.baseSalary || selectedManageItem?.baseSalary || 5000000;
 
 // Allowances breakdown
 const allowance_meal = employeeMaster?.allowanceMeal ?? 500000;
 const allowance_transport = employeeMaster?.allowanceTransport ?? 500000;
 const allowance_position_pct = employeeMaster?.allowancePositionPct ?? 10;
 const allowance_position = baseSalary * (allowance_position_pct / 100);
 const total_allowances = allowance_meal + allowance_transport + allowance_position;
 
 // Deductions breakdown
 const bpjs_kes_pct = employeeMaster?.deductionBpjsKesehatanPct ?? 1;
 const bpjs_ket_pct = employeeMaster?.deductionBpjsKetenagakerjaanPct ?? 2;
 const pph21_pct = employeeMaster?.deductionPph21Pct ?? 5;
 const bpjs_kesehatan = baseSalary * (bpjs_kes_pct / 100);
 const bpjs_ketenagakerjaan = baseSalary * (bpjs_ket_pct / 100);
 const pph21 = baseSalary * (pph21_pct / 100);
 const total_deductions = bpjs_kesehatan + bpjs_ketenagakerjaan + pph21;
 
 const currentNetSalary = selectedManageItem?.status === 'draft' 
 ? baseSalary + total_allowances - total_deductions
 : selectedManageItem?.netSalary;

 // Generate Payroll dummy action
 const handleGenerate = () => {
 setIsProcessing(true);
 setTimeout(() => {
 setIsProcessing(false);
 alert(`Payroll untuk periode ${filterPeriod} berhasil digenerate!`);
 }, 1500);
 };

 const openManageModal = (item: any) => {
 setSelectedManageItem(item);
 setUploadFile(null);
 setIsManageModalOpen(true);
 };

 const handleMarkAsPaid = () => {
 if (!selectedManageItem) return;
 setPayrollsState(prev => prev.map(p => 
 p.id === selectedManageItem.id 
 ? { 
 ...p, 
 allowances: total_allowances,
 deductions: total_deductions,
 netSalary: currentNetSalary,
 status: "paid", 
 paymentDate: new Date().toISOString(),
 notes: editForm.notes
 } 
 : p
 ));
 setIsManageModalOpen(false);
 };

 const handleSaveDraft = () => {
 if (!selectedManageItem) return;
 setPayrollsState(prev => prev.map(p => 
 p.id === selectedManageItem.id 
 ? { 
 ...p, 
 allowances: total_allowances,
 deductions: total_deductions,
 netSalary: currentNetSalary,
 notes: editForm.notes
 } 
 : p
 ));
 setIsManageModalOpen(false);
 };

 const enrichedPayrolls = useMemo(() => {
 return payrollsState
 .map(p => {
 const user = users.find(u => u.id === p.userId);
 return {
 ...p,
 user
 };
 })
 .filter(p => {
 const matchPeriod = p.period === filterPeriod;
 const matchSearch = p.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 p.user?.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
 return matchPeriod && matchSearch;
 });
 }, [payrollsState, filterPeriod, searchQuery]);

 // Calculations for summary
 const summary = useMemo(() => {
 const total = enrichedPayrolls.reduce((acc, curr) => acc + curr.netSalary, 0);
 const paidCount = enrichedPayrolls.filter(p => p.status === 'paid').length;
 const pendingCount = enrichedPayrolls.filter(p => p.status === 'draft').length;
 return { total, paidCount, pendingCount };
 }, [enrichedPayrolls]);

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden w-full animate-in fade-in duration-500 pb-2">
      {/* Unified Table Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white border border-slate-100/80 rounded-2xl flex flex-col overflow-hidden shadow-xs">
        
        {/* Top Card Header (Title, description, actions, and tabs all unified in one card) */}
        <div className="border-b border-slate-100 p-4 bg-white shrink-0 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Kelola Payroll</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">Sistem manajemen dan persetujuan gaji karyawan</p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 border border-indigo-500/20"
              >
                {isProcessing ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCcw className="w-3.5 h-3.5" />}
                Generate {filterPeriod}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-50 pt-3 gap-3">
            <div className="bg-slate-100/80 p-0.5 rounded-lg flex items-center shrink-0">
              <button 
                onClick={() => setActiveTab("pencairan")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                  activeTab === "pencairan" 
                    ? "bg-white text-indigo-600 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Pencairan Payroll
              </button>
              <button 
                onClick={() => setActiveTab("master")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                  activeTab === "master" 
                    ? "bg-white text-indigo-600 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Master Gaji Karyawan
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content 1: Pencairan Payroll */}
        {activeTab === "pencairan" ? (
          <>
            {/* Symmetrical Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/30 border-b border-slate-100 shrink-0">
              {/* Total Payroll (Net) */}
              <div className="py-3 px-5 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100/40">
                  <Banknote className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Total Payroll (Net)</span>
                  <h3 className="text-sm font-black text-slate-800 leading-none">Rp {summary.total.toLocaleString('id-ID')}</h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-1 leading-none">Total seluruh gaji bersih karyawan</p>
                </div>
              </div>

              {/* Sudah Dibayar */}
              <div className="py-3 px-5 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/40">
                  <CheckCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Sudah Dibayar</span>
                  <h3 className="text-sm font-black text-slate-800 leading-none">{summary.paidCount} Karyawan</h3>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1 leading-none">Pencairan selesai diproses</p>
                </div>
              </div>

              {/* Menunggu */}
              <div className="py-3 px-5 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100/40">
                  <Banknote className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Menunggu</span>
                  <h3 className="text-sm font-black text-slate-800 leading-none">{summary.pendingCount} Karyawan</h3>
                  <p className="text-[9px] text-amber-600 font-bold mt-1 leading-none">Menunggu approval transfer</p>
                </div>
              </div>
            </div>

            {/* Unified Controls Toolbar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b border-slate-50 bg-white shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Daftar Pencairan</h2>
                <div className="w-px h-4 bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 focus:outline-none focus:border-indigo-400 transition-all cursor-pointer"
                  >
                    {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 focus:outline-none focus:border-indigo-400 transition-all cursor-pointer"
                  >
                    {["2024", "2025", "2026", "2027"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative group w-full xl:w-64 shrink-0">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama karyawan / NIK..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Table Viewport */}
            <div className="flex-1 overflow-auto scrollbar-hide">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 tracking-wide text-[10px] sticky top-0 z-10">
                    <th className="text-left py-3 px-4 font-bold">Karyawan</th>
                    <th className="text-left py-3 px-4 font-bold hidden sm:table-cell">Gaji Pokok</th>
                    <th className="text-left py-3 px-4 font-bold hidden md:table-cell">Tunjangan</th>
                    <th className="text-left py-3 px-4 font-bold hidden md:table-cell">Potongan</th>
                    <th className="text-left py-3 px-4 font-bold text-slate-800">Net Take Home</th>
                    <th className="text-center py-3 px-4 font-bold">Status</th>
                    <th className="text-right py-3 px-4 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {enrichedPayrolls.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                            {item.user?.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-none mb-1">{item.user?.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{item.user?.employeeId} • {item.user?.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell font-medium text-slate-600">
                        Rp {item.baseSalary.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell font-medium text-emerald-600">
                        + Rp {item.allowances.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell font-medium text-red-500">
                        - Rp {item.deductions.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        Rp {item.netSalary.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border tracking-wide bg-transparent ${item.status === 'paid' ? 'text-emerald-600 border-emerald-200' : 'text-amber-600 border-amber-200'}`}>
                          {item.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => openManageModal(item)}
                          className="px-3 py-1.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors rounded-lg flex items-center justify-center gap-1.5 ml-auto"
                          title="Kelola Payroll"
                        >
                          Kelola
                        </button>
                      </td>
                    </tr>
                  ))}
                  {enrichedPayrolls.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-sm">
                        Data payroll periode {filterPeriod} belum digenerate atau tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Tab Content 2: Master Gaji */
          <>
            <div className="p-4 border-b border-slate-50 bg-slate-50/15 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Master Gaji Karyawan</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-1 leading-none">
                  Atur gaji pokok, tunjangan, dan persentase potongan masing-masing karyawan.
                </p>
              </div>
              <div className="relative group w-full md:w-64 shrink-0">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama karyawan / NIK..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50/40 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-auto scrollbar-hide">
              <table className="w-full text-xs text-left relative">
                <thead className="bg-slate-50/50 border-b border-slate-200 sticky top-0 z-10">
                  <tr className="font-semibold text-slate-500 tracking-wide text-[10px] uppercase">
                    <th className="px-5 py-3 font-bold">Karyawan</th>
                    <th className="px-5 py-3 font-bold">Jabatan & Dept</th>
                    <th className="px-5 py-3 font-bold">Gaji Pokok (Rp)</th>
                    <th className="px-5 py-3 font-bold">Total Tunjangan</th>
                    <th className="px-5 py-3 font-bold">Total Potongan</th>
                    <th className="px-5 py-3 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {masterUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.employeeId.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-[10px] text-slate-500">{user.employeeId}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-600 font-medium">
                        {user.position} • {user.department}
                      </td>
                      <td className="px-5 py-3 text-slate-800 font-bold">
                        Rp {(user.baseSalary || 5000000).toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-bold text-emerald-600">
                          + Rp {((user.allowanceMeal ?? 500000) + (user.allowanceTransport ?? 500000) + ((user.baseSalary || 5000000) * ((user.allowancePositionPct ?? 10) / 100))).toLocaleString('id-ID')}
                        </div>
                        <div className="mt-1 flex flex-col gap-0.5 text-[9px] text-slate-500 font-medium">
                          <span>Makan: Rp {(user.allowanceMeal ?? 500000).toLocaleString('id-ID')}</span>
                          <span>Transport: Rp {(user.allowanceTransport ?? 500000).toLocaleString('id-ID')}</span>
                          <span>Jabatan: {user.allowancePositionPct ?? 10}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-bold text-red-500">
                          - Rp {((user.baseSalary || 5000000) * (((user.deductionBpjsKesehatanPct ?? 1) + (user.deductionBpjsKetenagakerjaanPct ?? 2) + (user.deductionPph21Pct ?? 5)) / 100)).toLocaleString('id-ID')}
                        </div>
                        <div className="mt-1 flex flex-col gap-0.5 text-[9px] text-slate-500 font-medium">
                          <span>BPJS Kes: {user.deductionBpjsKesehatanPct ?? 1}%</span>
                          <span>BPJS TK: {user.deductionBpjsKetenagakerjaanPct ?? 2}%</span>
                          <span>PPh21: {user.deductionPph21Pct ?? 5}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button 
                          onClick={() => {
                            setEditingMasterUser(user);
                            setDraftSalaryForm({
                              baseSalary: user.baseSalary || 5000000,
                              allowanceMeal: user.allowanceMeal ?? 500000,
                              allowanceTransport: user.allowanceTransport ?? 500000,
                              allowancePositionPct: user.allowancePositionPct ?? 10,
                              deductionBpjsKesehatanPct: user.deductionBpjsKesehatanPct ?? 1,
                              deductionBpjsKetenagakerjaanPct: user.deductionBpjsKetenagakerjaanPct ?? 2,
                              deductionPph21Pct: user.deductionPph21Pct ?? 5
                            });
                          }}
                          className="px-3 py-1.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors rounded-lg flex items-center justify-center gap-1.5 ml-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

 {/* Manage Payroll Modal */}
 <Modal
 isOpen={isManageModalOpen}
 onClose={() => setIsManageModalOpen(false)}
 title="Kelola Pencairan Payroll"
 size="2xl"
 footer={
 <>
 <button
 onClick={() => setIsManageModalOpen(false)}
 className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
 >
 Batal
 </button>
 {selectedManageItem?.status === 'draft' && (
 <>
 <button
 onClick={handleSaveDraft}
 className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
 >
 Simpan Draft
 </button>
 <button
 onClick={handleMarkAsPaid}
 disabled={!uploadFile}
 className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-all"
 >
 <CheckCircle className="w-3.5 h-3.5" /> Konfirmasi & Bayar
 </button>
 </>
 )}
 </>
 }
 >
 {selectedManageItem && (
 <div className="space-y-6 px-1">
 {/* Header Info */}
 <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end border-b border-slate-100 pb-5 gap-4">
 <div>
 <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
 Rp {currentNetSalary.toLocaleString('id-ID')}
 </h3>
 <p className="text-sm text-slate-500 font-medium mt-1">Take Home Pay • {selectedManageItem.period}</p>
 </div>
 <div className="text-left md:text-right text-sm">
 <p className="font-bold text-slate-800">{selectedManageItem.user?.name}</p>
 <p className="text-slate-500">{selectedManageItem.user?.employeeId} • {selectedManageItem.user?.position}</p>
 </div>
 </div>

 {/* Rincian Komponen */}
 {selectedManageItem.status === 'draft' ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
 
 {/* Kolom 1 Kiri Atas: Pendapatan */}
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
 <div className="mt-4 pt-4 border-t border-slate-100">
 <div className="flex justify-between items-center">
 <span className="text-xs font-bold text-slate-800">Total Pendapatan</span>
 <span className="text-sm font-bold text-emerald-600">+ Rp {(baseSalary + total_allowances).toLocaleString('id-ID')}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Kolom 2 Kanan Atas: Potongan */}
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
 <div className="mt-4 pt-4 border-t border-slate-100">
 <div className="flex justify-between items-center">
 <span className="text-xs font-bold text-slate-800">Total Potongan</span>
 <span className="text-sm font-bold text-red-500">- Rp {total_deductions.toLocaleString('id-ID')}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Kolom 1 Kiri Bawah: Detail Transfer */}
 <div className="h-full flex flex-col">
 <div className="flex items-center mb-3 h-5 shrink-0">
 <h4 className="text-sm font-semibold text-slate-800 leading-none">Detail Transfer</h4>
 </div>
 <div className="flex-1 space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
 <div className="space-y-1">
 <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bank Tujuan</label>
 <p className="text-sm font-bold text-slate-800">Bank Mandiri</p>
 </div>
 <div className="space-y-1">
 <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Nomor Rekening</label>
 <p className="text-sm font-bold text-slate-800">
 1122334455 <br/>
 <span className="font-normal text-xs text-slate-500">a/n {selectedManageItem.user?.name}</span>
 </p>
 </div>
 </div>
 </div>

 {/* Kolom 2 Kanan Bawah: Bukti Transfer */}
 <div className="h-full flex flex-col">
 <div className="flex items-center mb-3 h-5 shrink-0">
 <h4 className="text-sm font-semibold text-slate-800 leading-none">Bukti Transfer</h4>
 </div>
 <div className="flex-1 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50">
 <label className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider mb-3 block">Upload Bukti Transfer</label>
 {!uploadFile ? (
 <label className="flex items-center gap-3 cursor-pointer group p-3 bg-white border border-indigo-200 border-dashed rounded-lg hover:bg-indigo-50 transition-colors">
 <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 text-indigo-500 group-hover:text-indigo-600 transition-colors shrink-0">
 <UploadCloud className="w-4 h-4" />
 </div>
 <div>
 <p className="text-xs text-indigo-600 font-bold">Pilih File</p>
 <p className="text-[9px] text-slate-400 mt-0.5">PDF/JPG, Maks. 2MB</p>
 </div>
 <input 
 type="file" 
 className="hidden" 
 accept=".pdf,image/*"
 onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
 />
 </label>
 ) : (
 <div className="flex items-center justify-between p-3 border border-emerald-200 bg-emerald-50 rounded-lg group">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
 <CheckCircle className="w-4 h-4" />
 </div>
 <div className="truncate pr-2">
 <p className="text-xs font-bold text-slate-800 truncate">{uploadFile.name}</p>
 <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Siap diunggah</p>
 </div>
 </div>
 <button 
 onClick={() => setUploadFile(null)}
 className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors shrink-0 px-2 py-1"
 >
 Hapus
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 ) : (
 <div className="pt-2 flex items-start gap-3">
 <div className="mt-0.5 text-emerald-500">
 <CheckCircle className="w-5 h-5" />
 </div>
 <div>
 <p className="text-sm font-medium text-slate-800">Status Pembayaran Selesai</p>
 <p className="text-xs text-slate-500 mt-0.5">
 Telah ditransfer pada {new Date(selectedManageItem.paymentDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
 </p>
 </div>
 </div>
 )}
 </div>
 )}
 </Modal>

 {/* Edit Master Gaji Modal */}
 <Modal
 isOpen={!!editingMasterUser}
 onClose={() => setEditingMasterUser(null)}
 title="Edit Master Gaji & Tunjangan"
 size="md"
 footer={
 <>
 <button
 onClick={() => setEditingMasterUser(null)}
 className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
 >
 Batal
 </button>
 <button
 onClick={() => {
 if (editingMasterUser) {
 setMasterUsers(prev => prev.map(u => u.id === editingMasterUser.id ? { 
 ...u, 
 baseSalary: draftSalaryForm.baseSalary,
 allowanceMeal: draftSalaryForm.allowanceMeal,
 allowanceTransport: draftSalaryForm.allowanceTransport,
 allowancePositionPct: draftSalaryForm.allowancePositionPct,
 deductionBpjsKesehatanPct: draftSalaryForm.deductionBpjsKesehatanPct,
 deductionBpjsKetenagakerjaanPct: draftSalaryForm.deductionBpjsKetenagakerjaanPct,
 deductionPph21Pct: draftSalaryForm.deductionPph21Pct
 } : u));
 setEditingMasterUser(null);
 }
 }}
 className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
 >
 Simpan Perubahan
 </button>
 </>
 }
 >
 <div className="space-y-4">
 <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
 <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
 {editingMasterUser?.name?.charAt(0)}
 </div>
 <div>
 <p className="font-bold text-slate-800 text-sm">{editingMasterUser?.name}</p>
 <p className="text-[10px] text-slate-500">{editingMasterUser?.position} • {editingMasterUser?.department}</p>
 </div>
 </div>
 
 <div className="grid grid-cols-1 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700">Gaji Pokok (Rp)</label>
 <div className="relative">
 <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
 <input 
 type="number" 
 value={draftSalaryForm.baseSalary}
 onChange={(e) => setDraftSalaryForm({...draftSalaryForm, baseSalary: Number(e.target.value)})}
 className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700">Tj. Makan (Rp)</label>
 <div className="relative">
 <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
 <input 
 type="number" 
 value={draftSalaryForm.allowanceMeal}
 onChange={(e) => setDraftSalaryForm({...draftSalaryForm, allowanceMeal: Number(e.target.value)})}
 className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700">Tj. Transport (Rp)</label>
 <div className="relative">
 <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">Rp</span>
 <input 
 type="number" 
 value={draftSalaryForm.allowanceTransport}
 onChange={(e) => setDraftSalaryForm({...draftSalaryForm, allowanceTransport: Number(e.target.value)})}
 className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
 />
 </div>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-semibold text-slate-700">Tj. Jabatan (Persentase %)</label>
 <div className="relative">
 <span className="absolute right-4 top-2.5 text-slate-400 text-sm font-medium">%</span>
 <input 
 type="number" 
 value={draftSalaryForm.allowancePositionPct}
 onChange={(e) => setDraftSalaryForm({...draftSalaryForm, allowancePositionPct: Number(e.target.value)})}
 className="w-full px-4 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
 />
 </div>
 </div>
 <div className="space-y-1.5 pt-2 border-t border-slate-100">
 <h4 className="text-xs font-bold text-slate-800 mb-2">Potongan (Deductions)</h4>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold text-slate-700">BPJS Kes. (%)</label>
 <div className="relative group">
 <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium">%</span>
 <input 
 type="number" 
 value={draftSalaryForm.deductionBpjsKesehatanPct}
 onChange={(e) => setDraftSalaryForm({...draftSalaryForm, deductionBpjsKesehatanPct: Number(e.target.value)})}
 className="w-full px-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
 />
 </div>
 <p className="text-[9px] text-slate-400 leading-tight">Memotong dari Gaji Pokok untuk Jaminan Kesehatan.</p>
 </div>
 
 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold text-slate-700">BPJS TK. (%)</label>
 <div className="relative">
 <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium">%</span>
 <input 
 type="number" 
 value={draftSalaryForm.deductionBpjsKetenagakerjaanPct}
 onChange={(e) => setDraftSalaryForm({...draftSalaryForm, deductionBpjsKetenagakerjaanPct: Number(e.target.value)})}
 className="w-full px-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
 />
 </div>
 <p className="text-[9px] text-slate-400 leading-tight">Memotong dari Gaji Pokok untuk Jaminan Hari Tua.</p>
 </div>

 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold text-slate-700">PPh21 (%)</label>
 <div className="relative">
 <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium">%</span>
 <input 
 type="number" 
 value={draftSalaryForm.deductionPph21Pct}
 onChange={(e) => setDraftSalaryForm({...draftSalaryForm, deductionPph21Pct: Number(e.target.value)})}
 className="w-full px-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
 />
 </div>
 <p className="text-[9px] text-slate-400 leading-tight">Memotong dari Gaji Pokok untuk Pajak Penghasilan.</p>
 </div>
 </div>
 </div>
 </div>
 
 <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-100 pt-3">
 Komponen Gaji Pokok & Tunjangan ini akan otomatis menjadi acuan dalam perhitungan form pencairan payroll berikutnya.
 </p>
 </div>
 </Modal>
 </div>
 );
}
