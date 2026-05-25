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
 <div className="flex gap-2">
 <button
 onClick={onClose}
 className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
 >
 Tutup
 </button>
 <button
 onClick={() => {
 alert("Simulasi: File sedang diunduh ke folder Downloads Anda.");
 onClose();
 }}
 className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all active:scale-95"
 >
 <Download className="w-3.5 h-3.5" /> Download PDF
 </button>
 </div>
 </div>
 }
 >
 <div className="space-y-6">
 {/* Simulated PDF Header */}
 <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start rounded-xl">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white -indigo-200">
 <FileText className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-lg font-black text-slate-800 tracking-tighter uppercase leading-none mb-1">HRIS NEXT SYSTEM</h3>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Document Generator</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Document No.</p>
 <p className="text-sm font-sans font-bold text-indigo-600">#{documentNumber}</p>
 </div>
 </div>

 {/* Simulated Document Content */}
 <div className="bg-white border-2 border-slate-50 p-8 rounded-xl space-y-8 relative overflow-hidden">
 {/* Watermark */}
 <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-12 select-none">
 <p className="text-8xl font-black text-slate-900 leading-none">HRIS-NEXT</p>
 </div>

 <div className="text-center space-y-1">
 <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight underline decoration-indigo-200 decoration-4 underline-offset-4">{title}</h2>
 <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest pt-1">Salinan Dokumen Digital Legal</p>
 </div>

 <div className="grid grid-cols-2 gap-8 text-xs border-y border-slate-50 py-6">
 <div className="space-y-4">
 <div>
 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Diterbitkan Untuk:</p>
 <p className="font-bold text-slate-800 text-sm">{itemData?.user?.name || itemData?.name || "Karyawan Lintas"}</p>
 <p className="text-slate-500 font-medium">#{itemData?.user?.employeeId || "EM-001"}</p>
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Departemen:</p>
 <p className="font-bold text-slate-700">{itemData?.user?.department || "Operasional"}</p>
 </div>
 </div>
 <div className="space-y-4">
 <div>
 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Tanggal Dokumen:</p>
 <p className="font-bold text-slate-800">{new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Status Akhir:</p>
 <span className="text-emerald-600 font-black uppercase tracking-tighter">SUCCESSFULLY APPROVED</span>
 </div>
 </div>
 </div>

 <div className="space-y-3">
 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Detail Informasi:</p>
 <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-slate-600 text-sm italic leading-relaxed">
 &quot;{itemData?.description || itemData?.purpose || "Detail permohonan telah divalidasi oleh sistem dan disetujui oleh otoritas terkait sesuai dengan prosedur perusahaan yang berlaku."}&quot;
 </div>
 </div>

 <div className="flex justify-end pt-12 pb-4">
 <div className="text-center space-y-2">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Signatory</p>
 <div className="w-24 h-24 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center mx-auto opacity-40">
 <Shield className="w-10 h-10 text-slate-300" />
 </div>
 <p className="text-xs font-bold text-slate-800 border-t border-slate-100 pt-2 px-4 italic">HRIS AUTOMATION</p>
 </div>
 </div>
 </div>

 <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
 <Eye className="w-4 h-4 text-indigo-400" />
 <p className="text-[12px] text-indigo-700 font-medium italic">
 Ini adalah simulasi priview PDF. Pada sistem produksi, tombol di bawah akan menggenerasi file .pdf asli menggunakan library pdf-lib atau jsPDF.
 </p>
 </div>
 </div>
 </Modal>
 );
}

