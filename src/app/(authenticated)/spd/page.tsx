"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  spds,
  formatCurrency, getStatusColor,
} from "@/lib/data";
import Modal from "@/components/Modal";
import { Plane, Printer, Edit, Trash2 } from "lucide-react";
import { FilterBar, StatusFilter, TableSearch, StatusBadge, ActionButton } from "@/components/DataTable";

export default function SPDPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentData = useMemo(() => {
    return spds.filter((item: any) => {
      // 1. Strict filter: Modul is ONLY for individual user requests
      if (item.userId !== userId) return false;

      const matchStatus = filterStatus === "Semua" || item.status.toLowerCase() === filterStatus.toLowerCase();
      const matchSearch = item.spdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [filterStatus, searchQuery, userId]);

  return (
    <div className="space-y-5 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <Plane className="w-6 h-6 text-indigo-600" /> Perjalanan Dinas (SPD)
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Daftar pengajuan Surat Perjalanan Dinas Anda</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors self-start sm:self-center"
        >
          <span>+</span> Pengajuan Baru
        </button>
      </div>

      {/* STANDARDIZED: Filter Bar */}
      <FilterBar>
        <StatusFilter
          options={["Semua", "Pending", "Approved", "Rejected"]}
          activeStatus={filterStatus}
          onStatusChange={setFilterStatus}
        />
        <TableSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Cari referensi atau tujuan..."
        />
      </FilterBar>

      {/* STANDARDIZED: Main Table */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden mt-2">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 tracking-wide text-[10px]">
                <th className="text-left py-2.5 px-4 font-bold">Referensi SPD</th>
                <th className="text-left py-2.5 px-4 hidden sm:table-cell font-bold">Tujuan</th>
                <th className="text-left py-2.5 px-4 hidden sm:table-cell font-bold">Nominal</th>
                <th className="text-center py-2.5 px-4 font-bold">Status</th>
                <th className="text-right py-2.5 px-4 font-bold">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 group">
              {currentData.map((item: any) => {
                const sc = getStatusColor(item.status);

                return (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                          <Plane className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 leading-none mb-1 truncate">{new Date(item.departureDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          <p className="text-[10px] text-slate-400 font-bold font-sans tracking-tight">#{item.spdNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 hidden sm:table-cell">
                      <p className="font-bold text-slate-700 truncate max-w-[150px] lg:max-w-[200px]">{item.destination}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-tight truncate max-w-[150px] lg:max-w-[200px]">{item.purpose}</p>
                    </td>
                    <td className="py-2.5 px-4 hidden sm:table-cell">
                      <p className="font-black text-slate-800 text-[12px] tracking-tighter">{formatCurrency(item.totalCost)}</p>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <StatusBadge
                        status={item.status}
                        statusColor={{ text: sc.text, border: sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border }}
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 transition-opacity opacity-0 group-hover:opacity-100">
                        {item.status === "pending" && (
                          <>
                            <ActionButton
                              icon={<Edit className="w-3.5 h-3.5" />}
                              title="Edit"
                              variant="primary"
                            />
                            <ActionButton
                              icon={<Trash2 className="w-3.5 h-3.5" />}
                              title="Hapus"
                              variant="danger"
                            />
                          </>
                        )}
                        {item.status === "approved" && (
                          <ActionButton
                            icon={<Printer className="w-3.5 h-3.5" />}
                            title="Cetak PDF"
                            variant="success"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                    <Plane className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                    Tidak ada pengajuan SPD ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Pengajuan SPD Baru"
        size="md"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Batal</button>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all">Kirim Pengajuan</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 tracking-wide">Tujuan Dinas</label>
            <input type="text" placeholder="Kota/Perusahaan tujuan..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 tracking-wide">Tgl Berangkat</label>
              <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium text-slate-700" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 tracking-wide">Tgl Kembali</label>
              <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium text-slate-700" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 tracking-wide">Estimasi Biaya (Rp)</label>
            <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 tracking-wide">Catatan/Maksud Perjalanan</label>
            <textarea rows={3} placeholder="Tujuan spesifik SPD..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}