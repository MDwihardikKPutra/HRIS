"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  purchases,
  getProjectById,
  formatCurrency, getStatusColor,
} from "@/lib/data";
import Modal from "@/components/Modal";
import { ShoppingCart, Printer, Edit, Trash2 } from "lucide-react";
import { FilterBar, StatusFilter, TableSearch, StatusBadge, ActionButton } from "@/components/DataTable";

export default function MyPurchasePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentData = useMemo(() => {
    return purchases.filter((item: any) => {
      // 1. Strict filter: Modul is ONLY for individual user requests
      if (item.userId !== userId) return false;

      const matchStatus = filterStatus === "Semua" || item.status.toLowerCase() === filterStatus.toLowerCase();
      const matchSearch = item.purchaseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [filterStatus, searchQuery, userId]);

  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-indigo-600" /> Pengajuan Pembelian
            </h1>
            <p className="text-[13px] text-slate-500 mt-1">Daftar pengajuan pembelian barang dan jasa Anda</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[13px] rounded-md transition-colors self-start sm:self-center shrink-0"
          >
            <span>+</span> Pengajuan Baru
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-200 shrink-0">
          <StatusFilter
            options={["Semua", "Pending", "Approved", "Rejected"]}
            activeStatus={filterStatus}
            onStatusChange={setFilterStatus}
          />
          <TableSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari referensi atau deskripsi..."
          />
        </div>

        {/* Main Table */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="py-3 px-4 font-medium">Ref Pembelian</th>
                <th className="py-3 px-4 hidden sm:table-cell font-medium">Keperluan / Proyek</th>
                <th className="py-3 px-4 hidden sm:table-cell font-medium">Nominal</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700 group">
              {currentData.map((item: any) => {
                const sc = getStatusColor(item.status);
                const project = item.projectId ? getProjectById(item.projectId) : null;

                return (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 mb-0.5 truncate">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          <p className="text-xs text-slate-500 font-mono truncate">#{item.purchaseNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="font-medium text-slate-900 truncate max-w-[150px] lg:max-w-[200px] mb-0.5">{item.description}</p>
                      {project ? (
                        <span className="text-xs text-slate-500">PRJ: {project.code}</span>
                      ) : (
                        <span className="text-xs text-slate-500">Internal</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="font-medium text-slate-900">{formatCurrency(item.totalPrice)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge
                        status={item.status}
                        statusColor={{ text: sc.text, border: sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border }}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 transition-opacity opacity-0 group-hover:opacity-100">
                        {item.status === "pending" && (
                          <>
                            <ActionButton
                              icon={<Edit className="w-4 h-4" />}
                              title="Edit"
                              variant="primary"
                            />
                            <ActionButton
                              icon={<Trash2 className="w-4 h-4" />}
                              title="Hapus"
                              variant="danger"
                            />
                          </>
                        )}
                        {item.status === "approved" && (
                          <ActionButton
                            icon={<Printer className="w-4 h-4" />}
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
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-[13px]">
                    Tidak ada pengajuan Pembelian ditemukan.
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
        title="Buat Pengajuan Pembelian Baru"
        size="md"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors">Batal</button>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">Kirim Pengajuan</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Terkait Proyek (Opsional)</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
              <option value="">-- Internal / Operasional Karyawan --</option>
              <option value="1">Alpha (PRJ-001)</option>
              <option value="2">Beta (PRJ-002)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Item Barang/Jasa</label>
            <input type="text" placeholder="Laptop, Sewa Server, dll" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Estimasi Harga (Rp)</label>
            <input type="number" placeholder="0" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Tujuan Pengadaan (Deskripsi)</label>
            <textarea rows={3} placeholder="Alasan membutuhkan barang/jasa ini..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}