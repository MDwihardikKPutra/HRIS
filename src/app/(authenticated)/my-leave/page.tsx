"use client";

import { useState, useMemo } from"react";
import { leaveRequests, getUserById, getLeaveTypeById, getStatusColor, leaveTypes } from"@/lib/data";
import Modal from"@/components/Modal";
import { Search, Printer } from"lucide-react";
import PDFPreviewModal from"@/components/PDFPreviewModal";
import { useSession } from"next-auth/react";

export default function LeavePage() {
 const { data: session } = useSession();
 const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [filterStatus, setFilterStatus] = useState("Pending");

 // PDF Preview State
 const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
 const [previewItem, setPreviewItem] = useState<any>(null);

 // Extract user email for dependency
 const userEmail = session?.user?.email;

 const openPDFPreview = (item: any) => {
 setPreviewItem(item);
 setIsPDFModalOpen(true);
 };

 // Format datanya agar mirip dengan daftar approve (sesuai legacy Laravel HRIS)
 const allLeaveData = useMemo(() => {
 return leaveRequests.map((l: any) => ({
 id: `leave-${l.id}`,
 originalId: l.id,
 category:"leaves",
 type: getLeaveTypeById(l.leaveTypeId)?.name ||"Cuti / Izin",
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
 // Filter by current user
 if (userEmail && item.user?.email !== userEmail) {
 return false;
 }

 const matchStatus = filterStatus ==="Semua Status"|| item.status.toLowerCase() === filterStatus.toLowerCase();
 const matchSearch = item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 item.number.toLowerCase().includes(searchQuery.toLowerCase());
 return matchStatus && matchSearch;
 });
 }, [searchQuery, filterStatus, allLeaveData, userEmail]);

 return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden w-full animate-in fade-in duration-500 pb-2">
      {/* Unified Table Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white border border-slate-100/80 rounded-2xl flex flex-col overflow-hidden shadow-xs">
        
        {/* Top Card Header (Title, description, and actions) */}
        <div className="border-b border-slate-100 p-4 bg-white shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Cuti & Izin Pribadi</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">Kelola dan pantau pengajuan cuti & izin Anda</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
            >
              Ajukan Sakit
            </button>
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 border border-indigo-500/20"
            >
              <span>+</span> Ajukan Cuti
            </button>
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
            <tbody className="divide-y divide-slate-50">
              {filteredLeaves.map((item: any) => {
                const user = item.user;
                const sc = getStatusColor(item.status);

                return (
                  <tr key={item.id} className="group hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          {user?.name?.charAt(0) || "?"}
                        </div>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => openPDFPreview(item)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg inline-flex"
                          title="Download PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 border border-slate-100 rounded-lg inline-flex"
                          title="View Details"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
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
 className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all"
 >
 Kirim Pengajuan
 </button>
 </>
 }
 >
 <div className="space-y-4">
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-slate-700">Kategori Pengajuan</label>
 <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium appearance-none">
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
 className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium"
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-slate-700">Tanggal Selesai</label>
 <input
 type="date"
 className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-medium text-slate-700">Alasan / Keterangan</label>
 <textarea
 rows={3}
 placeholder="Berikan detail alasan pengajuan..."
 className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all resize-none font-medium"
 ></textarea>
 </div>
 </div>
 </Modal>

 <PDFPreviewModal
 isOpen={isPDFModalOpen}
 onClose={() => setIsPDFModalOpen(false)}
 title="SURAT IZIN / CUTI KARYAWAN"
 documentNumber={previewItem?.number ||"LEAVE/2026/001"}
 itemData={previewItem}
 />
 </div>
 );
}
