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
      <div className="flex-1 min-h-0 bg-white rounded-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-100 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Approval Pembayaran</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Pantau ringkasan dan persetujuan pengajuan dana</p>
          </div>
        </div>

        {/* Symmetrical Metrics Bar - High Density */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50 border-b border-slate-100 shrink-0">
          
          {/* Total Dana Pending */}
          <div className="p-3.5 flex flex-col justify-center bg-white/60">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100/40">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Dana Pending</span>
            </div>
            <h3 className="text-base font-black text-slate-800 leading-none">{formatCurrency(metrics.pendingAmount)}</h3>
            <p className="text-[9px] text-slate-400 font-medium mt-1.5 leading-none">Menunggu verifikasi pembayaran</p>
          </div>

          {/* Menunggu Persetujuan */}
          <div className="p-3.5 flex flex-col justify-center bg-white/60">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100/40">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Antrean Approval</span>
            </div>
            <h3 className="text-base font-black text-slate-800 leading-none">{metrics.pendingCount} <span className="text-[10px] font-bold text-slate-400 ml-1">Tugas</span></h3>
            <p className="text-[9px] text-amber-600 font-bold mt-1.5 leading-none">Memerlukan tindakan segera</p>
          </div>

          {/* Selesai Diproses */}
          <div className="p-3.5 flex flex-col justify-center bg-white/60">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/40">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Selesai Diproses</span>
            </div>
            <h3 className="text-base font-black text-slate-800 leading-none">{metrics.approvedCount} <span className="text-[10px] font-bold text-slate-400 ml-1">Pengajuan</span></h3>
            <p className="text-[9px] text-emerald-600 font-bold mt-1.5 leading-none">Telah disetujui & diarsipkan</p>
          </div>

          {/* Proporsi Pengeluaran (Mini Chart) */}
          <div className="p-3.5 flex flex-col justify-center bg-slate-50/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">Proporsi Dana</span>
              <span className="text-[10px] font-black text-slate-800 leading-none">{formatCurrency(metrics.totalAmount)}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200/50 rounded-full flex overflow-hidden mb-2">
              <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: `${metrics.spdPercentage}%` }} title={`SPD: ${metrics.spdPercentage}%`} />
              <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${metrics.purchasePercentage}%` }} title={`Pembelian: ${metrics.purchasePercentage}%`} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span className="text-[9px] font-bold text-slate-500 leading-none">SPD ({metrics.spdPercentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-[9px] font-bold text-slate-500 leading-none">Pembelian ({metrics.purchasePercentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Controls Toolbar - High Density */}
        <div className="flex items-center justify-between gap-3 p-2.5 border-b border-slate-100 bg-white shrink-0 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-3 min-w-max">
            {/* Tabs Control */}
            <div className="bg-slate-100/80 p-0.5 rounded-lg flex items-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon && tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-slate-200 hidden sm:block" />

            {/* Status Filters */}
            <div className="flex items-center gap-1.5">
              {["Semua", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2 py-0.5 text-[9px] font-bold rounded-md whitespace-nowrap transition-all border ${
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
          <div className="relative group w-48 xl:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1.5 w-3 h-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari referensi, pengaju..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1 bg-slate-50/40 border border-slate-200 rounded-md text-[10px] focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Table Viewport - High Density */}
        <div className="flex-1 min-h-0 overflow-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-white border-b border-slate-200 font-semibold text-slate-500 capitalize tracking-wide text-[9px] sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <th className="text-left py-3 px-4 font-bold">Referensi / Pengaju</th>
                <th className="text-left py-2 px-4 hidden md:table-cell font-bold">Tujuan & Deskripsi</th>
                <th className="text-right py-2 px-4 hidden sm:table-cell font-bold">Kategori & Nominal</th>
                <th className="text-center py-2 px-4 font-bold w-24">Status</th>
                <th className="text-right py-2 px-4 font-bold w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData.map((item: any) => {
                const sc = getStatusColor(item.status);

                return (
                  <tr key={item.id} className="group hover:bg-slate-50/60 transition-colors">
                    <td className="py-1.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                          {item.user?.name?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 leading-none mb-0.5 truncate">{item.user?.name || "-"}</p>
                          <p className="text-[9px] text-slate-400 font-medium font-sans truncate">#{item.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-1.5 px-4 hidden md:table-cell">
                      <p className="text-[10px] font-bold text-slate-700 truncate max-w-[150px] lg:max-w-[250px]" title={item.target}>{item.target}</p>
                      <p className="text-[9px] text-slate-400 font-medium truncate max-w-[150px] lg:max-w-[250px] leading-tight">{item.description}</p>
                    </td>
                    <td className="py-1.5 px-4 hidden sm:table-cell text-right">
                      <p className="text-xs font-black text-slate-700 leading-none mb-0.5">{formatCurrency(item.amount)}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.type} • {formatDate(item.date)}</p>
                    </td>
                    <td className="py-1.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-widest bg-transparent ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
                        {item.status === 'pending' ? 'Pending' : item.status}
                      </span>
                    </td>
                    <td className="py-1.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        {item.status === "pending" ? (
                          <button
                            onClick={() => setSelectedApprovalItem(item)}
                            className="px-2.5 py-1 text-[9px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-md transition-colors border border-indigo-100 hover:border-indigo-600"
                          >
                            Proses
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); openPDFPreview(item); }}
                              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-md shadow-sm"
                              title="Preview PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedApprovalItem(item)}
                              className="p-1 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-md shadow-sm"
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