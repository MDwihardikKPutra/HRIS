"use client";

import { useState, useMemo, Suspense } from"react";
import { useSearchParams } from"next/navigation";
import {
 purchases, spds,
 getUserById, getProjectById,
 formatCurrency, formatDate, getStatusColor,
} from"@/lib/data";
import {
 ShoppingCart, Plane,
 Search,
 CheckCircle2, Printer,
 Wallet, Clock, CheckCircle
} from"lucide-react";
import ApprovalDetailModal from"@/components/ApprovalDetailModal";
import PDFPreviewModal from"@/components/PDFPreviewModal";

function FinanceContent() {
 const searchParams = useSearchParams();
 const initialType = (searchParams.get("type") as any) ||"all";

 const [activeTab, setActiveTab] = useState<"all"|"spd"|"purchase">(initialType);
 const [filterStatus, setFilterStatus] = useState("Pending");
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedApprovalItem, setSelectedApprovalItem] = useState<any>(null);

 // PDF Preview
 const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
 const [previewItem, setPreviewItem] = useState<any>(null);

 const openPDFPreview = (item: any) => {
 setPreviewItem(item);
 setIsPDFModalOpen(true);
 };

 // Unified Data - SPD dan Pembelian (tanpa Vendor Payment)
 const unifiedData = useMemo(() => {
 return [
 ...spds.map(s => ({
 id: `spd-${s.id}`,
 originalId: s.id,
 category:"payments",
 type:"SPD",
 typeKey:"spd",
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
 category:"payments",
 type:"Pembelian",
 typeKey:"purchase",
 number: p.purchaseNumber,
 user: getUserById(p.userId),
 target: getProjectById(p.projectId)?.name ||"Internal",
 amount: p.totalPrice,
 description: p.description,
 status: p.status,
 date: p.createdAt,
 })),
 ];
 }, []);

 const currentData = useMemo(() => {
 return unifiedData.filter((item: any) => {
 const matchTab = activeTab ==="all"|| item.typeKey === activeTab;
 const matchStatus = filterStatus ==="Semua"|| item.status.toLowerCase() === filterStatus.toLowerCase();
 const matchSearch = item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
 item.target?.toLowerCase().includes(searchQuery.toLowerCase());
 return matchTab && matchStatus && matchSearch;
 });
 }, [activeTab, filterStatus, searchQuery, unifiedData]);

 // Compute Metrics
 const metrics = useMemo(() => {
 let pendingAmount = 0;
 let pendingCount = 0;
 let approvedCount = 0;

 unifiedData.forEach((item: any) => {
 if (item.status === 'pending') {
 pendingAmount += item.amount;
 pendingCount++;
 } else if (item.status === 'approved') {
 approvedCount++;
 }
 });

 return { pendingAmount, pendingCount, approvedCount };
 }, [unifiedData]);

 const handleApprove = (id: string) => {
 alert(`Approved: ${id}`);
 setSelectedApprovalItem(null);
 };

 const handleReject = (id: string) => {
 alert(`Rejected: ${id}`);
 setSelectedApprovalItem(null);
 };

 const tabs = [
 { id:"all", label:"Semua"},
 { id:"spd", label:"SPD", icon: <Plane className="w-3.5 h-3.5"/> },
 { id:"purchase", label:"Pembelian", icon: <ShoppingCart className="w-3.5 h-3.5"/> }
 ];

 return (
    <div className="flex flex-col h-[calc(100vh-5.25rem)] overflow-hidden gap-4 w-full animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Approval Pembayaran</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Pantau ringkasan dan persetujuan pengajuan dana</p>
        </div>
      </div>

      {/* Unified Table Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white border border-slate-100/80 rounded-2xl flex flex-col overflow-hidden shadow-xs">
        {/* Symmetrical Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/30 border-b border-slate-100 shrink-0">
          {/* Total Dana Pending */}
          <div className="py-3 px-5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100/40">
              <Wallet className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Total Dana Pending</span>
              <h3 className="text-sm font-black text-slate-800 leading-none">{formatCurrency(metrics.pendingAmount)}</h3>
              <p className="text-[9px] text-slate-400 font-medium mt-1 leading-none">Menunggu verifikasi pembayaran</p>
            </div>
          </div>

          {/* Menunggu Persetujuan */}
          <div className="py-3 px-5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100/40">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Menunggu Persetujuan</span>
              <h3 className="text-sm font-black text-slate-800 leading-none">{metrics.pendingCount} Pengajuan</h3>
              <p className="text-[9px] text-amber-600 font-bold mt-1 leading-none">Memerlukan tindakan segera</p>
            </div>
          </div>

          {/* Selesai Diproses */}
          <div className="py-3 px-5 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/40">
              <CheckCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">Selesai Diproses</span>
              <h3 className="text-sm font-black text-slate-800 leading-none">{metrics.approvedCount} Pengajuan</h3>
              <p className="text-[9px] text-emerald-600 font-bold mt-1 leading-none">Telah disetujui & diarsipkan</p>
            </div>
          </div>
        </div>

        {/* Unified Controls Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b border-slate-50 bg-white shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Tabs Control */}
            <div className="bg-slate-100/80 p-0.5 rounded-lg flex items-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "bg-white text-indigo-600 shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.icon && tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Symmetrical Vertical Divider */}
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            {/* Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              {["Semua", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap transition-all border ${
                    filterStatus === status
                      ? (status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200"
                        : status === "Semua" ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200")
                      : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative group w-full xl:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari referensi, pengaju, tujuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50/40 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Table Viewport */}
        <div className="flex-1 min-h-0 overflow-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 capitalize tracking-wide text-[10px]">
                <th className="text-left py-2.5 px-4 font-bold">Referensi / Pengaju</th>
                <th className="text-left py-2.5 px-4 hidden sm:table-cell font-bold">Kategori</th>
                <th className="text-left py-2.5 px-4 hidden md:table-cell font-bold">Tujuan</th>
                <th className="text-left py-2.5 px-4 hidden sm:table-cell font-bold">Nominal</th>
                <th className="text-center py-2.5 px-4 font-bold">Status</th>
                <th className="text-right py-2.5 px-4 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData.map((item: any) => {
                const sc = getStatusColor(item.status);

                return (
                  <tr key={item.id} className="group hover:bg-slate-50/40 transition-colors">
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
                      <p className="text-[10px] text-slate-400 font-bold capitalize">{formatDate(item.date)}</p>
                    </td>
                    <td className="py-2.5 px-4 hidden md:table-cell">
                      <p className="font-bold text-slate-700 truncate max-w-[150px] lg:max-w-[200px]" title={item.target}>{item.target}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px] lg:max-w-[200px] leading-tight">{item.description}</p>
                    </td>
                    <td className="py-2.5 px-4 hidden sm:table-cell font-bold text-slate-700">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold border capitalize tracking-wide bg-transparent ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {item.status === 'pending' ? 'Pending' : item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 transition-opacity">
                        {item.status === "pending" ? (
                          <button
                            onClick={() => setSelectedApprovalItem(item)}
                            className="px-3 py-1.5 text-[10px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors border border-indigo-100 hover:border-indigo-600"
                          >
                            Proses
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); openPDFPreview(item); }}
                              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg"
                              title="Preview PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedApprovalItem(item)}
                              className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 border border-slate-100 rounded-lg"
                              title="Detail"
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
    </div>
 );
}

export default function FinancePage() {
 return (
 <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm font-medium">Memuat data...</div>}>
 <FinanceContent />
 </Suspense>
 );
}