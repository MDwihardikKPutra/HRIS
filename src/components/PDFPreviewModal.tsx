"use client";

import { FileText, Download, Eye, CheckCircle2, Shield } from "lucide-react";
import Modal from "./Modal";

interface PDFPreviewModalProps {
 isOpen: boolean;
 onClose: () => void;
 title: string;
 documentNumber: string;
 itemData: any;
}

export default function PDFPreviewModal({
 isOpen,
 onClose,
 title,
 documentNumber,
 itemData,
}: PDFPreviewModalProps) {
 return (
 <Modal
 isOpen={isOpen}
 onClose={onClose}
 title="Preview Document (PDF Simulation)"
 size="lg"
 footer={
 <div className="flex justify-between items-center w-full">
 <div className="flex gap-2 text-[10px] text-slate-400 font-medium">
 <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Digital Signature Verified</span>
 </div>
 <div className="flex gap-4">
 <button
 onClick={onClose}
 className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
 >
 Tutup
 </button>
 <button
 onClick={() => {
 alert("Simulasi: File sedang diunduh ke folder Downloads Anda.");
 onClose();
 }}
 className="inline-flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-all active:scale-95"
 >
 <Download className="w-3.5 h-3.5" /> Download PDF
 </button>
 </div>
 </div>
 }
 >
 <div className="space-y-6">
 {/* Simulated PDF Header */}
 <div className="pb-6 border-b border-slate-200 flex justify-between items-start">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 border border-slate-200 rounded-md flex items-center justify-center text-slate-900">
 <FileText className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-base font-medium text-slate-900 mb-1">HRIS NEXT SYSTEM</h3>
 <p className="text-xs text-slate-500">Official Document Generator</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-xs text-slate-500 mb-1">Document No.</p>
 <p className="text-[13px] font-medium text-slate-900">#{documentNumber}</p>
 </div>
 </div>

 {/* Simulated Document Content */}
 <div className="py-6 space-y-8 relative overflow-hidden">
 {/* Watermark */}
 <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none rotate-12 select-none">
 <p className="text-6xl font-medium text-slate-900 leading-none">HRIS-NEXT</p>
 </div>

 <div className="text-center space-y-1">
 <h2 className="text-lg font-medium text-slate-900 underline decoration-slate-200 underline-offset-4">{title}</h2>
 <p className="text-[12px] text-slate-500 pt-1">Salinan Dokumen Digital Legal</p>
 </div>

 <div className="grid grid-cols-2 gap-8 text-[13px] border-y border-slate-200 py-6">
 <div className="space-y-4">
 <div>
 <p className="text-xs text-slate-500 mb-1">Diterbitkan Untuk:</p>
 <p className="font-medium text-slate-900">{itemData?.user?.name || itemData?.name || "Karyawan Lintas"}</p>
 <p className="text-slate-500 text-xs">#{itemData?.user?.employeeId || "EM-001"}</p>
 </div>
 <div>
 <p className="text-xs text-slate-500 mb-1">Departemen:</p>
 <p className="font-medium text-slate-900">{itemData?.user?.department || "Operasional"}</p>
 </div>
 </div>
 <div className="space-y-4">
 <div>
 <p className="text-xs text-slate-500 mb-1">Tanggal Dokumen:</p>
 <p className="font-medium text-slate-900">{new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
 </div>
 <div>
 <p className="text-xs text-slate-500 mb-1">Status Akhir:</p>
 <span className="text-slate-900 font-medium">Approved</span>
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <p className="text-xs text-slate-500">Detail Informasi:</p>
 <div className="text-slate-900 text-[13px] leading-relaxed">
 &quot;{itemData?.description || itemData?.purpose || "Detail permohonan telah divalidasi oleh sistem dan disetujui oleh otoritas terkait sesuai dengan prosedur perusahaan yang berlaku."}&quot;
 </div>
 </div>

 <div className="flex justify-end pt-12 pb-4">
 <div className="text-center space-y-2">
 <p className="text-xs text-slate-500">Digital Signatory</p>
 <div className="w-24 h-24 rounded-md border border-slate-200 flex items-center justify-center mx-auto opacity-40">
 <Shield className="w-8 h-8 text-slate-300" />
 </div>
 <p className="text-[13px] font-medium text-slate-900 border-t border-slate-200 pt-2 px-4">HRIS Automation</p>
 </div>
 </div>
 </div>

 <div className="pt-4 flex items-center gap-3">
 <Eye className="w-4 h-4 text-slate-400" />
 <p className="text-[12px] text-slate-500">
 Simulasi file PDF. Pada sistem produksi akan menggunakan library untuk generate PDF.
 </p>
 </div>
 </div>
 </Modal>
 );
}

