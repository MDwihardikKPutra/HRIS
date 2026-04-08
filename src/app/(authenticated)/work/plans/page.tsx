import { workPlans, getUserById, getProjectById, formatDate, getStatusColor } from "@/lib/data";
import { ClipboardList, Search } from "lucide-react";

export default function WorkPlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Work Plans</h1>
          <p className="text-sm text-slate-500 mt-0.5">Rencana kerja harian</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">No. Plan</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">User</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Project</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Activities</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {workPlans.map((wp) => {
              const user = getUserById(wp.userId);
              const project = getProjectById(wp.projectId);
              const sc = getStatusColor(wp.status);
              return (
                <tr key={wp.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 font-medium">{wp.planNumber}</td>
                  <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">{user?.name || "-"}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">{project?.name || "-"}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{wp.activities}</td>
                  <td className="py-3 px-4 text-xs text-slate-400">{formatDate(wp.planDate)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {wp.status}
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
