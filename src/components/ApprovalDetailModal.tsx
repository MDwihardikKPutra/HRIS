"use client";

import { CheckCircle2, XCircle, FileText, Calendar, MapPin, ShoppingBag, CreditCard, User } from "lucide-react";
import Modal from "./Modal";
import { formatDate, formatCurrency } from "@/lib/data";

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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Jenis Pengajuan</p>
              <p className="text-sm font-semibold text-slate-800">{type}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Durasi</p>
              <p className="text-sm font-semibold text-slate-800">{item.totalDays || item.detail?.split(' • ')[1] || "3"} Hari</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Alasan Pengajuan</p>
            <p className="text-sm text-slate-700 leading-relaxed">{item.description || "Tidak ada alasan yang dicantumkan."}</p>
          </div>
        </div>
      );
    }

    if (isSPD) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> Tujuan
              </p>
              <p className="text-sm font-semibold text-slate-800">{item.target || item.detail?.split(' • ')[0] || "-"}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <CreditCard className="w-2.5 h-2.5" /> Estimasi Biaya
              </p>
              <p className="text-sm font-semibold text-slate-800">{item.amount ? formatCurrency(item.amount) : (item.detail?.split(' • ')[1] || "Rp 0")}</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Maksud & Tujuan</p>
            <p className="text-sm text-slate-700 leading-relaxed">{item.description || "Detail perjalanan dinas."}</p>
          </div>
        </div>
      );
    }

    if (isPurchase) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <ShoppingBag className="w-2.5 h-2.5" /> Project / Keperluan
              </p>
              <p className="text-sm font-semibold text-slate-800">{item.target || item.detail?.split(' • ')[0] || "Internal"}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-sans">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Harga</p>
              <p className="text-sm font-bold text-indigo-600">{item.amount ? formatCurrency(item.amount) : (item.detail?.split(' • ')[1] || "Rp 0")}</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Deskripsi & Keperluan</p>
            <p className="text-sm text-slate-700 leading-relaxed italic">"{item.description}"</p>
          </div>
        </div>
      );
    }

    if (isVendor) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <CreditCard className="w-2.5 h-2.5" /> Nama Vendor
              </p>
              <p className="text-sm font-semibold text-slate-800">{item.target || item.detail?.split(' • ')[0] || "-"}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-sans">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 text-emerald-600">Total Tagihan (Invoice)</p>
              <p className="text-sm font-bold text-emerald-700">{item.amount ? formatCurrency(item.amount) : (item.detail?.split(' • ')[1] || "Rp 0")}</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Keterangan Pembayaran</p>
            <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
          </div>
          <div className="p-3 bg-slate-900/[0.03] rounded-xl border border-dashed border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status Verifikasi Keuangan</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[12px] font-medium text-slate-600 italic">Dokumen invoice telah valid dan siap dibayar.</p>
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Detail Pengajuan</p>
        <p className="text-sm text-slate-800 font-medium">{item.detail || item.target || "Tidak ada detail tambahan."}</p>
        {item.description && <p className="text-xs text-slate-500 mt-2">{item.description}</p>}
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
      <div className="space-y-5">
        {/* User Card */}
        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl">
          <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center text-sm font-bold border border-indigo-100 rounded-lg text-indigo-600 shrink-0">
            {item.user?.name?.charAt(0) || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{item.user?.name}</p>
            <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight uppercase">{item.user?.position} • {item.user?.employeeId}</p>
            <p className="text-[9px] text-indigo-500 font-bold mt-0.5 uppercase tracking-wider">{item.user?.department}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Type Request</p>
            <p className="text-xs font-bold text-indigo-600">{item.type}</p>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="[&>div>div>div]:rounded-xl [&>div>div]:rounded-xl">
          {renderContent()}
        </div>

        {/* Support Documents Placeholder */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Dokumen Lampiran</p>
            <span className="text-[9px] font-bold py-0.5 px-1.5 bg-indigo-50 text-indigo-600 rounded-md">1 File</span>
          </div>
          <div className="p-3 bg-white flex items-center gap-3 group cursor-pointer hover:bg-slate-50/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">lampiran_pengajuan_document.pdf</p>
              <p className="text-[10px] text-slate-400 font-bold">PDF • 1.2 MB</p>
            </div>
            <button className="text-[9px] font-bold text-indigo-600 hover:text-indigo-700 transition-opacity bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 opacity-0 group-hover:opacity-100">
              PREVIEW
            </button>
          </div>
        </div>

        {/* Admin Note Section if Pending */}
        {isPending && (
          <div className="space-y-2">
            <label className="block text-[12px] font-bold text-slate-600 uppercase tracking-wider">
              Catatan Admin (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Berikan catatan jika diperlukan..."
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium resize-none"
            ></textarea>
          </div>
        )}
      </div>
    </Modal>
  );
}
