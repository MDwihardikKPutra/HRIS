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
    let spdAmount = 0;
    let purchaseAmount = 0;

    unifiedData.forEach((item: any) => {
      if (item.status === 'pending') {
        pendingAmount += item.amount;
        pendingCount++;
      } else if (item.status === 'approved') {
        approvedCount++;
      }

      if (item.typeKey === 'spd') {
        spdAmount += item.amount;
      } else {
        purchaseAmount += item.amount;
      }
    });

    const totalAmount = spdAmount + purchaseAmount;
    const spdPercentage = totalAmount === 0 ? 0 : Math.round((spdAmount / totalAmount) * 100);
    const purchasePercentage = totalAmount === 0 ? 0 : Math.round((purchaseAmount / totalAmount) * 100);

    return { pendingAmount, pendingCount, approvedCount, spdAmount, purchaseAmount, totalAmount, spdPercentage, purchasePercentage };
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
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Table Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium text-slate-900">Approval Pembayaran</h1>
            <p className="text-[13px] text-slate-500 mt-1">Pantau ringkasan dan persetujuan pengajuan dana</p>
          </div>
        </div>

        {/* Symmetrical Metrics Bar - High Density */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-200 shrink-0">
          
          {/* Total Dana Pending */}
          <div className="p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-slate-500">Dana Pending</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{formatCurrency(metrics.pendingAmount)}</h3>
            <p className="text-xs text-slate-500 mt-1">Menunggu verifikasi pembayaran</p>
          </div>

          {/* Menunggu Persetujuan */}
          <div className="p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-slate-500">Antrean Approval</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{metrics.pendingCount} <span className="text-xs font-normal text-slate-500 ml-1">Tugas</span></h3>
            <p className="text-xs text-slate-500 mt-1">Memerlukan tindakan segera</p>
          </div>

          {/* Selesai Diproses */}
          <div className="p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-slate-500">Selesai Diproses</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{metrics.approvedCount} <span className="text-xs font-normal text-slate-500 ml-1">Pengajuan</span></h3>
            <p className="text-xs text-slate-500 mt-1">Telah disetujui & diarsipkan</p>
          </div>

          {/* Proporsi Pengeluaran (Mini Chart) */}
          <div className="p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500">Proporsi Dana</span>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(metrics.totalAmount)}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full flex overflow-hidden mb-2">
              <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: `${metrics.spdPercentage}%` }} title={`SPD: ${metrics.spdPercentage}%`} />
              <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${metrics.purchasePercentage}%` }} title={`Pembelian: ${metrics.purchasePercentage}%`} />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>SPD ({metrics.spdPercentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Pembelian ({metrics.purchasePercentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Controls Toolbar - High Density */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-200 shrink-0 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-4 min-w-max">
            {/* Tabs Control */}
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? "bg-slate-100 text-slate-900" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab.icon && tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-slate-200 hidden sm:block" />

            {/* Status Filters */}
            <div className="flex items-center gap-2">
              {["Semua", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${
                    filterStatus === status
                      ? (status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200"
                        : status === "Semua" ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200")
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative group min-w-[240px] shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari referensi, pengaju..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Table Viewport - High Density */}
        <div className="flex-1 overflow-auto scrollbar-hide bg-white">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="py-3 px-4 font-medium">Referensi / Pengaju</th>
                <th className="py-3 px-4 hidden md:table-cell font-medium">Tujuan & Deskripsi</th>
                <th className="py-3 px-4 hidden sm:table-cell font-medium text-right">Kategori & Nominal</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {currentData.map((item: any) => {
                const sc = getStatusColor(item.status);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                          {item.user?.name?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 mb-0.5 truncate">{item.user?.name || "-"}</p>
                          <p className="text-xs text-slate-500 font-mono truncate">#{item.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-medium text-slate-900 truncate max-w-[150px] lg:max-w-[250px]" title={item.target}>{item.target}</p>
                      <p className="text-[13px] text-slate-500 truncate max-w-[150px] lg:max-w-[250px]">{item.description}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-right">
                      <p className="font-medium text-slate-900 mb-0.5">{formatCurrency(item.amount)}</p>
                      <p className="text-xs text-slate-500">{item.type} • {formatDate(item.date)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${sc.bg} ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {item.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === "pending" ? (
                          <button
                            onClick={() => setSelectedApprovalItem(item)}
                            className="px-3 py-1.5 text-[13px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors border border-indigo-200"
                          >
                            Proses
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); openPDFPreview(item); }}
                              className="p-1.5 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
                              title="Preview PDF"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedApprovalItem(item)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
                              title="Detail"
                            >
                              <Search className="w-4 h-4" />
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
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-[13px]">
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