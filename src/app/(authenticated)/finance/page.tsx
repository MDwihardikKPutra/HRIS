"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  purchases, spds, vendorPayments, 
  getUserById, getProjectById, getVendorById, 
  formatCurrency, formatDate, getStatusColor, 
} from "@/lib/data";
import Modal from "@/components/Modal";
import { 
  ShoppingCart, Plane, CreditCard, 
  Search,
  CheckCircle2, Printer
} from "lucide-react";
import ApprovalDetailModal from "@/components/ApprovalDetailModal";
import PDFPreviewModal from "@/components/PDFPreviewModal";

function FinanceContent() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as any) || "all";
  
  const [activeTab, setActiveTab] = useState<"all" | "spd" | "purchase" | "vendor-payment">(initialType);
  const [filterStatus, setFilterStatus] = useState("Pending"); // Default to pending as per HRIS
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApprovalItem, setSelectedApprovalItem] = useState<any>(null);

  // PDF Preview
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);

  const openPDFPreview = (item: any) => {
    setPreviewItem(item);
    setIsPDFModalOpen(true);
  };

  // Sync state if URL changes dynamically without hard reload
  useEffect(() => {
    setActiveTab((searchParams.get("type") as any) || "all");
  }, [searchParams]);

  // In a real app, role is from Context/Auth
  const userRole = "admin";

  // Unified Data mapped identically to HRIS Approval Pembayaran
  const unifiedData = useMemo(() => {
    return [
      ...spds.map(s => ({
        id: `spd-${s.id}`,
        originalId: s.id,
        category: "payments",
        type: "SPD",
        typeKey: "spd",
        number: s.spdNumber,
        user: getUserById(s.userId),
        target: s.destination,
        amount: s.totalCost,
        description: s.purpose,
        status: s.status,
        date: s.createdAt,
      })),
      ...purchases.map(p => ({
        id: `purchase-${p.id}`,
        originalId: p.id,
        category: "payments",
        type: "Pembelian",
        typeKey: "purchase",
        number: p.purchaseNumber,
        user: getUserById(p.userId),
        target: getProjectById(p.projectId)?.name || "Internal",
        amount: p.totalPrice,
        description: p.description,
        status: p.status,
        date: p.createdAt,
      })),
      ...vendorPayments.map(vp => ({
        id: `vp-${vp.id}`,
        originalId: vp.id,
        category: "payments",
        type: "Pembayaran Vendor",
        typeKey: "vendor-payment",
        number: vp.paymentNumber,
        user: getUserById(vp.userId),
        target: getVendorById(vp.vendorId)?.name || "Vendor",
        amount: vp.amount,
        description: vp.description,
        status: vp.status,
        date: vp.createdAt,
      })),
    ];
  }, []);

  const currentData = useMemo(() => {
    return unifiedData.filter((item: any) => {
      const matchTab = activeTab === "all" || item.typeKey === activeTab;
      const matchStatus = filterStatus === "Semua" || item.status.toLowerCase() === filterStatus.toLowerCase();
      const matchSearch = item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.target?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchStatus && matchSearch;
    });
  }, [activeTab, filterStatus, searchQuery, unifiedData]);

  const handleApprove = (id: string) => {
    alert(`Approved: ${id}`);
    setSelectedApprovalItem(null);
  };

  const handleReject = (id: string) => {
    alert(`Rejected: ${id}`);
    setSelectedApprovalItem(null);
  };

  const tabs = [
    { id: "all", label: "Semua" },
    { id: "spd", label: "SPD", icon: <Plane className="w-3.5 h-3.5" /> },
    { id: "purchase", label: "Pembelian", icon: <ShoppingCart className="w-3.5 h-3.5" /> },
    { id: "vendor-payment", label: "Pembayaran Vendor", icon: <CreditCard className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      {/* Page Header matching HRIS styling concept */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Approval Pembayaran</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola persetujuan pengajuan SPD, Pembelian, dan Pembayaran Vendor</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors  self-start sm:self-center"
        >
          <span>+</span> Pengajuan Baru
        </button>
      </div>

      {/* Tabs (Type Filter) */}
      <div className="flex items-center justify-between border-b border-slate-100 mt-2">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide w-full">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap flex items-center gap-2 ${
                        activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    {tab.icon && tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                    )}
                </button>
            ))}
        </div>
      </div>

      {/* Status Filters & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {["Semua", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg whitespace-nowrap transition-all ${
                        filterStatus === status 
                        ? (status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-200" 
                           : status === "Semua" ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                           : status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                           : "bg-red-50 text-red-600 border border-red-200")
                        : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
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
                placeholder="Cari referensi, pengaju, tujuan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-indigo-300 transition-all font-medium "
            />
        </div>
      </div>

      {/* Unified Table - Aligned with HRIS fields but cleaner */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden  mt-2">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="text-left py-2.5 px-4 font-bold">Referensi / Pengaju</th>
                <th className="text-left py-2.5 px-4 hidden sm:table-cell">Kategori</th>
                <th className="text-left py-2.5 px-4 hidden md:table-cell">Tujuan</th>
                <th className="text-left py-2.5 px-4 hidden sm:table-cell">Nominal</th>
                <th className="text-center py-2.5 px-4">Status</th>
                <th className="text-right py-2.5 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData.map((item: any) => {
                const sc = getStatusColor(item.status);
                
                return (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                          {item.user?.name?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 leading-none mb-1 truncate">{item.user?.name || "-"}</p>
                          <p className="text-[10px] text-slate-400 font-medium font-sans">#{item.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 hidden sm:table-cell">
                      <p className="font-bold text-slate-700 leading-tight mb-0.5">{item.type}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{formatDate(item.date)}</p>
                    </td>
                    <td className="py-2.5 px-4 hidden md:table-cell">
                      <p className="font-bold text-slate-700 truncate max-w-[150px] lg:max-w-[200px]" title={item.target}>{item.target}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px] lg:max-w-[200px] leading-tight">{item.description}</p>
                    </td>
                    <td className="py-2.5 px-4 hidden sm:table-cell font-bold text-slate-700">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-widest bg-transparent ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {item.status === 'pending' ? 'Pending' : item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 transition-opacity">
                            {item.status === "pending" ? (
                                <button 
                                    onClick={() => setSelectedApprovalItem(item)}
                                    className="px-3 py-1.5 text-[10px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors border border-indigo-100 hover:border-indigo-600 "
                                >
                                    Proses Form
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); openPDFPreview(item); }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg "
                                        title="Download PDF"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => setSelectedApprovalItem(item)}
                                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 border border-slate-100 rounded-lg "
                                        title="View Details"
                                    >
                                        <Search className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </td>
                  </tr>
                );
              })}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium text-sm">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                    Tidak ada pengajuan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
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
        title={`BUKTI PERSETUJUAN ${previewItem?.type || "PEMBAYARAN"}`}
        documentNumber={previewItem?.number || "FIN/2026/001"}
        itemData={previewItem}
      />

      {/* Draft App Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Pengajuan Baru"
        size="md"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Batal</button>
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all ">Kirim Pengajuan</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Tipe Pengajuan</label>
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium appearance-none">
              <option value="purchase">Pembelian / Procurement</option>
              <option value="spd">Perjalanan Dinas (SPD)</option>
              <option value="vendor">Pembayaran Vendor</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Tujuan / Deskripsi</label>
            <textarea rows={3} placeholder="Berikan detail pengajuan..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all resize-none "></textarea>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Estimasi Dana (Rp)</label>
            <input type="number" placeholder="0" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-all font-medium " />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm font-medium">Memuat data keuangan...</div>}>
      <FinanceContent />
    </Suspense>
  );
}
