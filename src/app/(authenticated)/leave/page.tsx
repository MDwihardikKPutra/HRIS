"use client";

import { useState, useMemo } from "react";
import { leaveRequests, getUserById, getLeaveTypeById, getStatusColor } from "@/lib/data";
import { Search, Printer, Clock, CheckCircle, Calendar } from "lucide-react";
import ApprovalDetailModal from "@/components/ApprovalDetailModal";
import PDFPreviewModal from "@/components/PDFPreviewModal";
import { AvatarInitial } from "@/components/DataTable";

export default function LeavePage() {
  const [selectedApprovalItem, setSelectedApprovalItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");

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

  const metrics = useMemo(() => {
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    allLeaveData.forEach((item: any) => {
      if (item.status === 'pending') {
        pendingCount++;
      } else if (item.status === 'approved') {
        approvedCount++;
      } else if (item.status === 'rejected') {
        rejectedCount++;
      }
    });

    return { pendingCount, approvedCount, rejectedCount, totalCount: allLeaveData.length };
  }, [allLeaveData]);

  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Table Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl flex flex-col overflow-hidden">
        
        {/* Top Card Header (Title and description) */}
        <div className="border-b border-slate-100 p-4 bg-white shrink-0 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Daftar Cuti & Izin</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">Kelola dan pantau seluruh pengajuan cuti karyawan</p>
            </div>
          </div>
        </div>

        {/* Symmetrical Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/30 border-b border-slate-100 shrink-0">
          {/* Menunggu Persetujuan */}
          <div className="py-3 px-5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100/40">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Menunggu Persetujuan</span>
              <h3 className="text-sm font-black text-slate-800 leading-none">{metrics.pendingCount} Pengajuan</h3>
              <p className="text-[9px] text-amber-600 font-bold mt-1 leading-none">Memerlukan tindakan segera</p>
            </div>
          </div>

          {/* Selesai Disetujui */}
          <div className="py-3 px-5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/40">
              <CheckCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Cuti Disetujui</span>
              <h3 className="text-sm font-black text-slate-800 leading-none">{metrics.approvedCount} Pengajuan</h3>
              <p className="text-[9px] text-emerald-600 font-bold mt-1 leading-none">Telah disetujui & aktif</p>
            </div>
          </div>

          {/* Total Seluruh Pengajuan */}
          <div className="py-3 px-5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100/40">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Total Pengajuan</span>
              <h3 className="text-sm font-black text-slate-800 leading-none">{metrics.totalCount} Pengajuan</h3>
              <p className="text-[9px] text-slate-400 font-medium mt-1 leading-none">Total riwayat pengajuan cuti</p>
            </div>
          </div>
        </div>

        {/* Unified Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-50 bg-white shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {["Semua Status", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap transition-all border ${
                  filterStatus === status
                    ? (status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200"
                      : status === "Semua Status" ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                      : status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200")
                    : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative group w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Cari nama karyawan atau nomor surat..."
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
                <th className="text-left py-3 px-4 font-bold">Info Karyawan</th>
                <th className="text-left py-3 px-4 hidden sm:table-cell font-bold">Kategori / Durasi</th>
                <th className="text-left py-3 px-4 hidden md:table-cell font-bold">Keterangan</th>
                <th className="text-center py-3 px-4 font-bold">Status</th>
                <th className="text-right py-3 px-4 font-bold">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 group">
              {filteredLeaves.map((item: any) => {
                const user = item.user;
                const sc = getStatusColor(item.status);

                return (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/40 transition-colors"
                    onClick={() => setSelectedApprovalItem(item)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <AvatarInitial name={user?.name || "?"} />
                        <div>
                          <p className="font-semibold text-slate-800 leading-none mb-1">{user?.name || "-"}</p>
                          <p className="text-[10px] text-slate-400 font-medium">#{user?.employeeId || item.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <p className="font-bold text-slate-700 leading-tight mb-0.5">{item.type}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-tight">{item.totalDays || "3"} Hari Cuti</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-[11px] text-slate-500 max-w-[200px] truncate leading-tight">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border tracking-wide bg-transparent ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.status === "pending" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApprovalItem(item);
                            }}
                            className="px-3 py-1.5 text-[10px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors border border-indigo-100 hover:border-indigo-600"
                          >
                            Proses Form
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e: any) => {
                                e.stopPropagation();
                                openPDFPreview(item);
                              }}
                              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg inline-flex"
                              title="Download PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
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
