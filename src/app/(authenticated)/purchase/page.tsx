import { purchases, getUserById, getProjectById, formatDate, formatCurrency, getStatusColor } from "@/lib/data";

export default function PurchasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Purchase Requests</h1>
        <p className="text-sm text-slate-500 mt-0.5">Permintaan pembelian barang</p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">No. PO</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Employee</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Project</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Description</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Total</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => {
              const user = getUserById(p.userId);
              const project = getProjectById(p.projectId);
              const sc = getStatusColor(p.status);
              return (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 font-medium">{p.purchaseNumber}</td>
                  <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">{user?.name || "-"}</td>
                  <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell">{project?.name || "-"}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{p.description}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{formatCurrency(p.totalPrice)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{p.status}
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
