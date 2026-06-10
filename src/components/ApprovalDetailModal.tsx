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
 <div className="flex justify-between items-center text-[13px] border-b border-slate-200 pb-2">
 <span className="text-slate-500">Jenis Pengajuan</span>
 <span className="font-medium text-slate-900">{type}</span>
 </div>
 <div className="flex justify-between items-center text-[13px] border-b border-slate-200 pb-2">
 <span className="text-slate-500">Durasi</span>
 <span className="font-medium text-slate-900">{item.totalDays || item.detail?.split(' • ')[1] || "3"} Hari</span>
 </div>
 <div className="pt-1">
 <span className="text-xs text-slate-500 block mb-1">Alasan Pengajuan</span>
 <p className="text-[13px] text-slate-900">{item.description || "Tidak ada alasan."}</p>
 </div>
 </div>
 );
 }

 if (isSPD) {
 return (
 <div className="flex-1 flex flex-col space-y-3">
 <div className="flex justify-between items-center text-[13px] border-b border-slate-200 pb-2">
 <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> Tujuan</span>
 <span className="font-medium text-slate-900 text-right">{item.target || item.detail?.split(' • ')[0] || "-"}</span>
 </div>
 <div className="flex justify-between items-center text-[13px] border-b border-slate-200 pb-2">
 <span className="text-slate-500 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5"/> Estimasi Biaya</span>
 <span className="font-medium text-slate-900">{item.amount ? formatCurrency(item.amount) : (item.detail?.split(' • ')[1] || "Rp 0")}</span>
 </div>
 <div className="pt-1">
 <span className="text-xs text-slate-500 block mb-1">Maksud & Tujuan</span>
 <p className="text-[13px] text-slate-900">{item.description || "Detail perjalanan dinas."}</p>
 </div>
 </div>
 );
 }

 if (isPurchase) {
 return (
 <div className="flex-1 flex flex-col space-y-3">
 <div className="flex justify-between items-center text-[13px] border-b border-slate-200 pb-2">
 <span className="text-slate-500 flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5"/> Project / Keperluan</span>
 <span className="font-medium text-slate-900 text-right max-w-[200px] truncate">{item.target || item.detail?.split(' • ')[0] || "Internal"}</span>
 </div>
 <div className="flex justify-between items-center text-[13px] border-b border-slate-200 pb-2">
 <span className="text-slate-500 flex items-center gap-1">Total Harga</span>
 <span className="font-medium text-slate-900">{item.amount ? formatCurrency(item.amount) : (item.detail?.split(' • ')[1] || "Rp 0")}</span>
 </div>
 <div className="pt-1">
 <span className="text-xs text-slate-500 block mb-1">Deskripsi</span>
 <p className="text-[13px] text-slate-900 italic">&quot;{item.description}&quot;</p>
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
 <span className="text-xs text-slate-500 block mb-1">Detail Pengajuan</span>
 <p className="text-[13px] text-slate-900 font-medium">{item.detail || item.target || "Tidak ada detail."}</p>
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
 <button className="px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5">
 <FileText className="w-3.5 h-3.5" /> View Dokumen
 </button>
 </div>
 <div className="flex gap-4">
 <button
 onClick={onClose}
 className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
 >
 Tutup
 </button>
 {isPending && (
 <>
 <button
 onClick={() => onReject(item.id, "")}
 className="text-[13px] font-medium text-red-600 hover:text-red-700 transition-colors"
 >
 Tolak
 </button>
 <button
 onClick={() => onApprove(item.id, "")}
 className="px-4 py-1.5 text-[13px] font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
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
 <h4 className="text-xs font-medium text-slate-500 mb-2">Rincian Pengajuan</h4>
 <div className="flex-1 flex flex-col">
 {renderContent()}
 </div>
 </div>

 {/* Kolom 2 Kanan Atas: Info Pengaju */}
 <div className="h-full flex flex-col">
 <h4 className="text-xs font-medium text-slate-500 mb-2">Informasi Pengaju</h4>
 <div className="flex-1 flex flex-col">
 <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-3">
 <div className="min-w-0">
 <p className="text-[13px] font-medium text-slate-900 truncate">{item.user?.name}</p>
 <p className="text-xs text-slate-500 truncate">{item.user?.position} • {item.user?.employeeId}</p>
 <p className="text-[11px] text-slate-500 mt-0.5">{item.user?.department}</p>
 </div>
 </div>
 <div className="space-y-2 flex-1">
 <div className="flex justify-between items-center text-[13px]">
 <span className="text-slate-500">Tipe Pengajuan</span>
 <span className="font-medium text-slate-900">{item.type}</span>
 </div>
 <div className="flex justify-between items-center text-[13px]">
 <span className="text-slate-500">Tanggal Transaksi</span>
 <span className="font-medium text-slate-900">{new Date(item.date || item.createdAt || Date.now()).toLocaleDateString('id-ID')}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Kolom 1 Kiri Bawah: Dokumen */}
 <div className="h-full flex flex-col">
 <h4 className="text-xs font-medium text-slate-500 mb-2">Dokumen Lampiran</h4>
 <div className="flex-1 border-t border-slate-200 pt-2">
 <div className="flex items-center gap-3 group cursor-pointer p-2 -mx-2 rounded-md hover:bg-slate-50 transition-colors">
 <div className="flex-1 min-w-0">
 <p className="text-[13px] font-medium text-slate-900 truncate">lampiran_pengajuan.pdf</p>
 <p className="text-xs text-slate-500 mt-0.5">PDF • 1.2 MB</p>
 </div>
 <button className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
 Buka
 </button>
 </div>
 </div>
 </div>

 {/* Kolom 2 Kanan Bawah: Catatan Admin */}
 <div className="h-full flex flex-col">
 <h4 className="text-xs font-medium text-slate-500 mb-2">Catatan Admin</h4>
 <div className="flex-1 flex flex-col border-t border-slate-200 pt-2">
 {isPending ? (
 <textarea
 rows={2}
 placeholder="Berikan catatan jika ditolak/disetujui..."
 className="flex-1 w-full p-2 bg-transparent border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-slate-400 transition-all resize-none placeholder:text-slate-400"
 ></textarea>
 ) : (
 <div className="flex-1 text-[13px] text-slate-500 py-2">
 Pengajuan telah diproses.
 </div>
 )}
 </div>
 </div>
 </div>
 </Modal>
 );
}
