import { users, getStatusColor } from "@/lib/data";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Kelola pengguna dan akses modul</p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Employee</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Email</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Department</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 hidden md:table-cell">Position</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Role</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-500 text-xs">{u.email}</td>
                <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">{u.department}</td>
                <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">{u.position}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
