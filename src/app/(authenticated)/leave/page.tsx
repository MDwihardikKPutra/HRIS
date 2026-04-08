"use client";

import { useState, useMemo } from "react";
import { leaveRequests, getUserById, getLeaveTypeById, getStatusColor, leaveTypes } from "@/lib/data";
import Modal from "@/components/Modal";
import { Search, Printer, CheckCircle2, Shield } from "lucide-react";
import ApprovalDetailModal from "@/components/ApprovalDetailModal";
import PDFPreviewModal from "@/components/PDFPreviewModal";

export default function LeavePage() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedApprovalItem, setSelectedApprovalItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  // PDF Preview State
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);

  const openPDFPreview = (item: any) => {
    setPreviewItem(item);
    setIsPDFModalOpen(true);
  };

  // Format datanya agar mirip dengan daftar approve (sesuai legacy Laravel HRIS)
  const allLeaveData = useMemo(() => {
    return leaveRequests.map((l: any) => ({
      id: `leave-${l.id}`,
      originalId: l.id,
      category: "leaves",
      type: getLeaveTypeById(l.leaveTypeId)?.name || "Cuti / Izin",
      number: l.leaveNumber,
      user: getUserById(l.userId),
      totalDays: l.totalDays,
      description: l.reason,
      status: l.status,
      date: l.createdAt,
    }));
  }, []);

  const filteredLeaves = useMemo(() => {
    return allLeaveData.filter((item: any) => {
      const matchStatus = filterStatus === "Semua Status" || item.status.toLowerCase() === filterStatus.toLowerCase();
      const matchSearch = item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.number.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [searchQuery, filterStatus, allLeaveData]);

  const handleApprove = (id: string) => {
    alert(`Approved: ${id}`);
    setSelectedApprovalItem(null);
  };

  const handleReject = (id: string) => {
    alert(`Rejected: ${id}`);
    setSelectedApprovalItem(null);
  };

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Daftar Cuti & Izin</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola dan pantau seluruh pengajuan cuti karyawan</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Ajukan Sakit
          </button>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm"
          >
            <span>+</span> Ajukan Cuti
          </button>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {["Semua Status", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg whitespace-nowrap transition-all ${
                        filterStatus === status 
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                        : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>
        
        <div className="relative group min-w-[280px]">
            <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <input
                type="text"
                placeholder="Cari nama karyawan atau nomor surat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 transition-all font-medium shadow-sm"
            />
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-2">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="text-left py-3.5 px-6">Info Karyawan</th>
                <th className="text-left py-3.5 px-4 hidden sm:table-cell">Kategori / Durasi</th>
                <th className="text-left py-3.5 px-4 hidden md:table-cell">Keterangan</th>
                <th className="text-center py-3.5 px-4">Status</th>
                <th className="text-right py-3.5 px-6">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeaves.map((item: any) => {
                const user = item.user;
                const sc = getStatusColor(item.status);
                
                return (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                          {user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-none mb-1">{user?.name || "-"}</p>
                          <p className="text-[10px] text-slate-400 font-medium">#{user?.employeeId || item.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <p className="font-semibold text-slate-700 mb-0.5">{item.type}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{item.totalDays || "3"} Hari Cuti</p>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500 max-w-[200px] truncate">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest bg-transparent ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 transition-opacity">
                            {item.status === "pending" ? (
                                <button 
                                    onClick={() => setSelectedApprovalItem(item)}
                                    className="px-3 py-1.5 text-[10px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors border border-indigo-100 hover:border-indigo-600 shadow-sm"
                                >
                                    Proses Form
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => openPDFPreview(item)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg shadow-sm"
                                        title="Download PDF"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 border border-slate-100 rounded-lg shadow-sm"
                                        title="View Details"
                                    >
                                        <Search className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                    Tidak ada pengajuan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal for Approval */}
      <ApprovalDetailModal
        isOpen={!!selectedApprovalItem}
        onClose={() => setSelectedApprovalItem(null)}
        item={selectedApprovalItem}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Apply Modal (Tetap ada sebagai dummy karena ini halaman admin tapi mungkin admin juga ingin input manual) */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Form Pengajuan Cuti / Sakit"
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="px-5 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
            >
              Kirim Pengajuan
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Kategori Pengajuan</label>
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium appearance-none shadow-sm">
              <option value="">Pilih Kategori</option>
              {leaveTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Tanggal Mulai</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Tanggal Selesai</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Alasan / Keterangan</label>
            <textarea
              rows={3}
              placeholder="Berikan detail alasan pengajuan..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all resize-none font-medium shadow-sm"
            ></textarea>
          </div>
        </div>
      </Modal>

      <PDFPreviewModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        title="SURAT IZIN / CUTI KARYAWAN"
        documentNumber={previewItem?.number || "LEAVE/2026/001"}
        itemData={previewItem}
      />
    </div>
  );
}
