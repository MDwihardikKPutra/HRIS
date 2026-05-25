"use client";

import { FileText, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import Modal from "./Modal";
import { formatCurrency } from "@/lib/data";

interface ApprovalDetailModalProps {
 isOpen: boolean;
 onClose: () => void;
 item: any;
 onApprove: (id: string, notes: string) => void;
 onReject: (id: string, notes: string) => void;
}

export default function ApprovalDetailModal({
 isOpen,
 onClose,
 item,
 onApprove,
 onReject,
}: ApprovalDetailModalProps) {
 if (!item) return null;

 const isPending = item.status === "pending";

 const renderContent = () => {
 // Determine the general theme/category of the item
 const type = item.type || "";
 const isLeave = type.includes("Cuti") || type.includes("Izin") || type === "Leave";
 const isSPD = type === "SPD";
 const isPurchase = type === "Pembelian" || type === "Purchase";
 const isVendor = type === "Pembayaran Vendor" || type === "Vendor Payment";

 if (isLeave) {
 return (
 <div className="flex-1 flex flex-col space-y-3">
 <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
 <span className="text-slate-500">Jenis Pengajuan</span>
 <span className="font-semibold text-slate-800">{type}</span>
 </div>
 <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
 <span className="text-slate-500">Durasi</span>
 <span className="font-semibold text-slate-800">{item.totalDays || item.detail?.split(' • ')[1] || "3"} Hari</span>
 </div>
 <div className="pt-1">
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Alasan Pengajuan</span>
 <p className="text-sm text-slate-700">{item.description || "Tidak ada alasan."}</p>
 </div>
 </div>
 );
 }

 if (isSPD) {
 return (
 <div className="flex-1 flex flex-col space-y-3">
 <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
 <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> Tujuan</span>
 <span className="font-semibold text-slate-800 text-right">{item.target || item.detail?.split(' • ')[0] || "-"}</span>
 </div>
 <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
 <span className="text-slate-500 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5"/> Estimasi Biaya</span>
 <span className="font-bold text-indigo-600">{item.amount ? formatCurrency(item.amount) : (item.detail?.split(' • ')[1] || "Rp 0")}</span>
 </div>
 <div className="pt-1">
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Maksud & Tujuan</span>
 <p className="text-sm text-slate-700">{item.description || "Detail perjalanan dinas."}</p>
 </div>
 </div>
 );
 }

 if (isPurchase) {
 return (
 <div className="flex-1 flex flex-col space-y-3">
 <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
 <span className="text-slate-500 flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5"/> Project / Keperluan</span>
 <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">{item.target || item.detail?.split(' • ')[0] || "Internal"}</span>
 </div>
 <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
 <span className="text-slate-500 flex items-center gap-1">Total Harga</span>
 <span className="font-bold text-indigo-600">{item.amount ? formatCurrency(item.amount) : (item.detail?.split(' • ')[1] || "Rp 0")}</span>
 </div>
 <div className="pt-1">
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Deskripsi</span>
 <p className="text-sm text-slate-700 italic">&quot;{item.description}&quot;</p>
 </div>
 </div>
 );
 }

 if (isVendor) {
 return (
 <div className="flex-1 flex flex-col space-y-3">
 <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
 <span className="text-slate-500 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5"/> Nama Vendor</span>
 <span className="font-semibold text-slate-800 text-right">{item.target || item.detail?.split(' • ')[0] || "-"}</span>
 </div>
 <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
 <span className="text-slate-500 flex items-center gap-1">Total Tagihan</span>
 <span className="font-bold text-emerald-600">{item.amount ? formatCurrency(item.amount) : (item.detail?.split(' • ')[1] || "Rp 0")}</span>
 </div>
 <div className="pt-1">
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Keterangan</span>
 <p className="text-sm text-slate-700">{item.description}</p>
 </div>
 </div>
 );
 }

 // Default Fallback
 return (
 <div className="flex-1 flex flex-col space-y-3">
 <div className="pt-1">
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Detail Pengajuan</span>
 <p className="text-sm text-slate-800 font-medium">{item.detail || item.target || "Tidak ada detail."}</p>
 {item.description && <p className="text-xs text-slate-500 mt-2">{item.description}</p>}
 </div>
 </div>
 );
 };

 return (
 <Modal
 isOpen={isOpen}
 onClose={onClose}
 title={`Review Approval: ${item.number}`}
 size="lg"
 footer={
 <div className="flex justify-between items-center w-full">
 <div className="flex gap-2">
 <button className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-1.5 ">
 <FileText className="w-3.5 h-3.5" /> View Dokumen
 </button>
 </div>
 <div className="flex gap-2.5">
 <button
 onClick={onClose}
 className="px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors "
 >
 Tutup
 </button>
 {isPending && (
 <>
 <button
 onClick={() => onReject(item.id, "")}
 className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors "
 >
 Tolak
 </button>
 <button
 onClick={() => onApprove(item.id, "")}
 className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors "
 >
 Setujui
 </button>
 </>
 )}
 </div>
 </div>
 }
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-2">
 {/* Kolom 1 Kiri Atas: Rincian Pengajuan */}
 <div className="h-full flex flex-col">
 <div className="flex items-center mb-3 h-5 shrink-0">
 <h4 className="text-sm font-semibold text-slate-800 leading-none">Rincian Pengajuan</h4>
 </div>
 <div className="flex-1 flex flex-col border border-slate-100 rounded-lg p-4 bg-white">
 {renderContent()}
 </div>
 </div>

 {/* Kolom 2 Kanan Atas: Info Pengaju */}
 <div className="h-full flex flex-col">
 <div className="flex items-center mb-3 h-5 shrink-0">
 <h4 className="text-sm font-semibold text-slate-800 leading-none">Informasi Pengaju</h4>
 </div>
 <div className="flex-1 flex flex-col border border-slate-100 rounded-lg p-4 bg-white">
 <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
 <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center text-lg font-bold border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
 {item.user?.name?.charAt(0) || "?"}
 </div>
 <div className="min-w-0">
 <p className="text-sm font-bold text-slate-800 truncate">{item.user?.name}</p>
 <p className="text-xs text-slate-500 font-medium truncate">{item.user?.position} • {item.user?.employeeId}</p>
 <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-wider">{item.user?.department}</p>
 </div>
 </div>
 <div className="space-y-3 flex-1">
 <div className="flex justify-between items-center text-sm">
 <span className="text-slate-500">Tipe Pengajuan</span>
 <span className="font-semibold text-indigo-600">{item.type}</span>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="text-slate-500">Tanggal Transaksi</span>
 <span className="font-semibold text-slate-800">{new Date(item.date || item.createdAt || Date.now()).toLocaleDateString('id-ID')}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Kolom 1 Kiri Bawah: Dokumen */}
 <div className="h-full flex flex-col">
 <div className="flex items-center mb-3 h-5 shrink-0">
 <h4 className="text-sm font-semibold text-slate-800 leading-none">Dokumen Lampiran</h4>
 </div>
 <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
 <div className="flex items-center gap-3 group cursor-pointer hover:bg-white p-2 -mx-2 rounded-lg transition-colors">
 <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shrink-0">
 <FileText className="w-5 h-5" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">lampiran_pengajuan.pdf</p>
 <p className="text-[10px] text-slate-400 font-medium mt-0.5">PDF • 1.2 MB</p>
 </div>
 <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1.5 rounded-lg border border-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity">
 BUKA
 </button>
 </div>
 </div>
 </div>

 {/* Kolom 2 Kanan Bawah: Catatan Admin */}
 <div className="h-full flex flex-col">
 <div className="flex items-center mb-3 h-5 shrink-0">
 <h4 className="text-sm font-semibold text-slate-800 leading-none">Catatan Admin</h4>
 </div>
 <div className="flex-1 flex flex-col">
 {isPending ? (
 <textarea
 rows={2}
 placeholder="Berikan catatan jika ditolak/disetujui..."
 className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all resize-none placeholder:text-slate-400"
 ></textarea>
 ) : (
 <div className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500 italic flex items-center justify-center">
 Pengajuan telah diproses.
 </div>
 )}
 </div>
 </div>
 </div>
 </Modal>
 );
}
