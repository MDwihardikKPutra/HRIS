import { projects, getUserById, formatCurrency, getStatusColor } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Projects</h1>
        <p className="text-sm text-slate-500 mt-0.5">Project tracking & monitoring</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => {
          const manager = getUserById(p.managerId);
          const sc = getStatusColor(p.status);
          return (
            <div key={p.id} className="bg-white border border-slate-200/80 rounded-xl p-5 hover:shadow-md hover:border-slate-300/60 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{p.code}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{p.status.replace("_", " ")}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{p.name}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Budget</p>
                  <p className="text-sm font-semibold text-slate-800">{formatCurrency(p.budget)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Manager</p>
                  <p className="text-xs text-slate-600">{manager?.name || "-"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
