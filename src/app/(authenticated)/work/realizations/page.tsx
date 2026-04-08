import { workRealizations, getUserById, getProjectById, formatDate, getStatusColor } from "@/lib/data";

export default function WorkRealizationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Work Realizations</h1>
        <p className="text-sm text-slate-500 mt-0.5">Realisasi kerja harian</p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">No.</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">User</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Project</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Activities</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Progress</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {workRealizations.map((wr) => {
              const user = getUserById(wr.userId);
              const project = getProjectById(wr.projectId);
              const sc = getStatusColor(wr.status);
              return (
                <tr key={wr.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 font-medium">{wr.realizationNumber}</td>
                  <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">{user?.name || "-"}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">{project?.name || "-"}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{wr.activities}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${wr.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{wr.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {wr.status}
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
