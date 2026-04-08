"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  purchases, 
  getUserById,
  getProjectById,
  formatCurrency, formatDate, getStatusColor, 
} from "@/lib/data";
import Modal from "@/components/Modal";
import { 
  ShoppingCart, Search, Printer, Edit, Trash2, CheckCircle2
} from "lucide-react";

export default function PurchasePage() {
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
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-indigo-600" /> Procurement / Pembelian
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Daftar pengajuan pembelian barang dan jasa Anda</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm self-start sm:self-center"
        >
          <span>+</span> Pengajuan Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-100 p-3 mt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {["Semua", "Pending", "Approved", "Rejected"].map((status) => (
                  <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1.5 text-[12px] font-bold rounded-lg whitespace-nowrap transition-all uppercase tracking-wider ${
                          filterStatus === status 
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                          : "bg-transparent text-slate-400 border border-transparent hover:bg-slate-50 hover:text-slate-600"
                      }`}
                  >
                      {status}
                  </button>
              ))}
          </div>
          
          <div className="relative group min-w-[280px]">
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
              <input
                  type="text"
                  placeholder="Cari referensi atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium shadow-sm"
              />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-2">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="text-left py-3.5 px-6">Ref Pembelian</th>
                <th className="text-left py-3.5 px-4 hidden sm:table-cell">Keperluan / Proyek</th>
                <th className="text-left py-3.5 px-4 hidden sm:table-cell">Nominal</th>
                <th className="text-center py-3.5 px-4">Status</th>
                <th className="text-right py-3.5 px-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData.map((item: any) => {
                const sc = getStatusColor(item.status);
                const project = item.projectId ? getProjectById(item.projectId) : null;
                
                return (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 leading-none mb-1 truncate">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric'})}</p>
                          <p className="text-[10px] text-slate-400 font-bold font-sans tracking-tight">#{item.purchaseNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <p className="font-bold text-slate-700 truncate max-w-[150px] lg:max-w-[200px] mb-0.5">{item.description}</p>
                      {project ? (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[12px] font-black border border-slate-200 uppercase tracking-tighter">PRJ: {project.code}</span>
                      ) : (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded text-[12px] font-black border border-slate-200 uppercase tracking-tighter">Internal</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <p className="font-black text-slate-800 text-[12px] tracking-tighter">{formatCurrency(item.totalPrice)}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[12px] font-black border uppercase tracking-widest bg-transparent ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 transition-opacity opacity-0 group-hover:opacity-100">
                           {item.status === "pending" && (
                                <>
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg shadow-sm">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-lg shadow-sm">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </>
                           )}
                           {item.status === "approved" && (
                                <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-lg shadow-sm">
                                    <Printer className="w-3.5 h-3.5" />
                                </button>
                           )}
                        </div>
                    </td>
                  </tr>
                );
              })}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">
                    <ShoppingCart className="w-10 h-10 mx-auto text-slate-200 mb-2" />
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
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Batal</button>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm">Kirim Pengajuan</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Terkait Proyek (Opsional)</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium appearance-none shadow-sm">
              <option value="">-- Internal / Operasional Karyawan --</option>
              <option value="1">Alpha (PRJ-001)</option>
              <option value="2">Beta (PRJ-002)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Item Barang/Jasa</label>
            <input type="text" placeholder="Laptop, Sewa Server, dll" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium shadow-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Estimasi Harga (Rp)</label>
            <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium shadow-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Tujuan Pengadaan (Deskripsi)</label>
            <textarea rows={3} placeholder="Alasan membutuhkan barang/jasa ini..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none shadow-sm"></textarea>
          </div>
        </div>
      </Modal>
    </div>
  );
}
