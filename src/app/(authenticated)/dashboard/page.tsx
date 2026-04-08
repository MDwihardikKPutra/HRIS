import {
  users, projects, workPlans, workRealizations,
  leaveRequests, spds, purchases, vendorPayments,
  getUserById, getProjectById, formatCurrency, formatDate, getStatusColor
} from "@/lib/data";
import {
  Users, FolderKanban, ClipboardList, CalendarDays,
  Plane, ShoppingCart, CreditCard, TrendingUp,
  CheckCircle2, Clock, XCircle, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const totalPending =
    workPlans.filter(w => w.status === "pending").length +
    leaveRequests.filter(l => l.status === "pending").length +
    spds.filter(s => s.status === "pending").length +
    purchases.filter(p => p.status === "pending").length +
    vendorPayments.filter(v => v.status === "pending").length;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "from-blue-500 to-blue-600", href: "/users" },
    { label: "Active Projects", value: projects.filter(p => p.status === "active").length, icon: FolderKanban, color: "from-emerald-500 to-emerald-600", href: "/projects" },
    { label: "Work Plans", value: workPlans.length, icon: ClipboardList, color: "from-violet-500 to-violet-600", href: "/work/plans" },
    { label: "Pending Approval", value: totalPending, icon: Clock, color: "from-amber-500 to-amber-600", href: "/approval" },
  ];

  const recentActivities = [
    ...workPlans.map(w => ({ type: "Work Plan", number: w.planNumber, user: getUserById(w.userId)?.name || "", status: w.status, date: w.createdAt, project: getProjectById(w.projectId)?.name || "" })),
    ...leaveRequests.map(l => ({ type: "Leave", number: l.leaveNumber, user: getUserById(l.userId)?.name || "", status: l.status, date: l.createdAt, project: "" })),
    ...spds.map(s => ({ type: "SPD", number: s.spdNumber, user: getUserById(s.userId)?.name || "", status: s.status, date: s.createdAt, project: getProjectById(s.projectId)?.name || "" })),
    ...purchases.map(p => ({ type: "Purchase", number: p.purchaseNumber, user: getUserById(p.userId)?.name || "", status: p.status, date: p.createdAt, project: getProjectById(p.projectId)?.name || "" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const moduleStats = [
    { label: "Leave Requests", total: leaveRequests.length, pending: leaveRequests.filter(l => l.status === "pending").length, approved: leaveRequests.filter(l => l.status === "approved").length, icon: CalendarDays, href: "/leave" },
    { label: "SPD", total: spds.length, pending: spds.filter(s => s.status === "pending").length, approved: spds.filter(s => s.status === "approved").length, icon: Plane, href: "/spd" },
    { label: "Purchases", total: purchases.length, pending: purchases.filter(p => p.status === "pending").length, approved: purchases.filter(p => p.status === "approved").length, icon: ShoppingCart, href: "/purchase" },
    { label: "Vendor Payments", total: vendorPayments.length, pending: vendorPayments.filter(v => v.status === "pending").length, approved: vendorPayments.filter(v => v.status === "approved").length, icon: CreditCard, href: "/vendor-payment" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview semua aktivitas sistem HRIS</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group bg-white border border-slate-200/80 rounded-xl p-5 hover:shadow-md hover:border-slate-300/60 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-3 text-xs text-slate-400 group-hover:text-blue-500 transition-colors">
                <span>View details</span>
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Module stats + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module breakdown */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Module Summary</h2>
          {moduleStats.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.label}
                href={mod.href}
                className="flex items-center gap-4 bg-white border border-slate-200/80 rounded-xl p-4 hover:shadow-sm hover:border-slate-300/60 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{mod.label}</p>
                  <div className="flex gap-3 mt-0.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {mod.approved}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {mod.pending}
                    </span>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900">{mod.total}</span>
              </Link>
            );
          })}
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Recent Activity</h2>
          <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Number</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((act, i) => {
                  const sc = getStatusColor(act.status);
                  return (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {act.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-700">{act.number}</td>
                      <td className="py-2.5 px-4 text-slate-600 hidden sm:table-cell">{act.user}</td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text} border ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {act.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-slate-400 hidden md:table-cell">{formatDate(act.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
