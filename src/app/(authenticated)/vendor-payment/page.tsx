import { vendorPayments, getUserById, getVendorById, getProjectById, formatCurrency, formatDate, getStatusColor } from "@/lib/data";

export default function VendorPaymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Vendor Payments</h1>
        <p className="text-sm text-slate-500 mt-0.5">Pembayaran ke vendor</p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">No.</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Vendor</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Invoice</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Description</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {vendorPayments.map((vp) => {
              const vendor = getVendorById(vp.vendorId);
              const sc = getStatusColor(vp.status);
              return (
                <tr key={vp.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 font-medium">{vp.paymentNumber}</td>
                  <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">{vendor?.name || "-"}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500 hidden md:table-cell">{vp.invoiceNumber}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{vp.description}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{formatCurrency(vp.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{vp.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
