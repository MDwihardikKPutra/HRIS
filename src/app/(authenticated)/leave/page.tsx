import { leaveRequests, getUserById, getLeaveTypeById, formatDate, getStatusColor } from "@/lib/data";

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Leave Requests</h1>
        <p className="text-sm text-slate-500 mt-0.5">Pengajuan cuti dan izin</p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">No.</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Employee</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Period</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Days</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden lg:table-cell">Reason</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((lr) => {
              const user = getUserById(lr.userId);
              const leaveType = getLeaveTypeById(lr.leaveTypeId);
              const sc = getStatusColor(lr.status);
              return (
                <tr key={lr.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 font-medium">{lr.leaveNumber}</td>
                  <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">{user?.name || "-"}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs text-slate-600">{leaveType?.name || "-"}</span></td>
                  <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell">{formatDate(lr.startDate)} — {formatDate(lr.endDate)}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">{lr.totalDays}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs max-w-[200px] truncate hidden lg:table-cell">{lr.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{lr.status}
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
