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
      <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
        
        {/* Top Card Header (Title and description) */}
        <div className="border-b border-slate-200 p-4 bg-white shrink-0 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-medium text-slate-900">Daftar Cuti & Izin</h1>
              <p className="text-[13px] text-slate-500 mt-1">Kelola dan pantau seluruh pengajuan cuti karyawan</p>
            </div>
          </div>
        </div>

        {/* Symmetrical Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50/50 border-b border-slate-200 shrink-0">
          {/* Menunggu Persetujuan */}
          <div className="py-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider mb-0.5">Menunggu Persetujuan</span>
              <h3 className="text-sm font-semibold text-slate-900">{metrics.pendingCount} Pengajuan</h3>
            </div>
          </div>

          {/* Selesai Disetujui */}
          <div className="py-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider mb-0.5">Cuti Disetujui</span>
              <h3 className="text-sm font-semibold text-slate-900">{metrics.approvedCount} Pengajuan</h3>
            </div>
          </div>

          {/* Total Seluruh Pengajuan */}
          <div className="py-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider mb-0.5">Total Pengajuan</span>
              <h3 className="text-sm font-semibold text-slate-900">{metrics.totalCount} Pengajuan</h3>
            </div>
          </div>
        </div>

        {/* Unified Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {["Semua Status", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${
                  filterStatus === status
                    ? (status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200"
                      : status === "Semua Status" ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200")
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative group min-w-[240px] shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama karyawan atau nomor surat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Table Viewport */}
        <div className="flex-1 overflow-auto scrollbar-hide bg-white">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="py-3 px-4 font-medium">Info Karyawan</th>
                <th className="py-3 px-4 hidden sm:table-cell font-medium">Kategori / Durasi</th>
                <th className="py-3 px-4 hidden md:table-cell font-medium">Keterangan</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {filteredLeaves.map((item: any) => {
                const user = item.user;
                const sc = getStatusColor(item.status);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedApprovalItem(item)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <AvatarInitial name={user?.name || "?"} />
                        <div>
                          <p className="font-medium text-slate-900 mb-0.5">{user?.name || "-"}</p>
                          <p className="text-xs text-slate-500">#{user?.employeeId || item.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="font-medium text-slate-900 mb-0.5">{item.type}</p>
                      <p className="text-xs text-slate-500">{item.totalDays || "3"} Hari Cuti</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-slate-500 truncate max-w-[200px]">{item.description}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${sc.bg} ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {item.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === "pending" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApprovalItem(item);
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            Proses
                          </button>
                        ) : (
                          <button
                            onClick={(e: any) => {
                              e.stopPropagation();
                              openPDFPreview(item);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors bg-white hover:bg-slate-50 border border-slate-200 rounded-md inline-flex"
                            title="Download PDF"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-[13px]">
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
