import { spds, getUserById, getProjectById, formatDate, formatCurrency, getStatusColor } from "@/lib/data";

export default function SPDPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Surat Perjalanan Dinas</h1>
        <p className="text-sm text-slate-500 mt-0.5">Business travel management</p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">No. SPD</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Employee</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Destination</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Period</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden lg:table-cell">Cost</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {spds.map((s) => {
              const user = getUserById(s.userId);
              const sc = getStatusColor(s.status);
              return (
                <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 font-medium">{s.spdNumber}</td>
                  <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">{user?.name || "-"}</td>
                  <td className="py-3 px-4 text-slate-700">{s.destination}</td>
                  <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell">{formatDate(s.departureDate)} — {formatDate(s.returnDate)}</td>
                  <td className="py-3 px-4 font-medium text-slate-700 hidden lg:table-cell">{formatCurrency(s.totalCost)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{s.status}
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
