"use client";

import { useState, useMemo } from "react";
import { 
  ClipboardList, CheckCircle2, Search, 
  Calendar, User as UserIcon, FolderKanban, Info,
  Printer, Eye
} from "lucide-react";
import { 
  workPlans, workRealizations, users, projects,
  getUserById, getProjectById 
} from "@/lib/data";

export default function EARPage() {
  const [activeTab, setActiveTab] = useState<"plans" | "realizations">("plans");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtering Logic
  const filteredPlans = useMemo(() => {
    return workPlans.filter(plan => {
      const matchesMonth = !selectedMonth || plan.planDate.startsWith(selectedMonth);
      const matchesUser = !selectedUser || plan.userId === parseInt(selectedUser);
      const matchesProject = !selectedProject || plan.projectId === parseInt(selectedProject);
      const matchesSearch = !searchQuery || 
        plan.activities.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.planNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesMonth && matchesUser && matchesProject && matchesSearch;
    });
  }, [selectedMonth, selectedUser, selectedProject, searchQuery]);

  const filteredRealizations = useMemo(() => {
    return workRealizations.filter(real => {
      const matchesMonth = !selectedMonth || real.realizationDate.startsWith(selectedMonth);
      const matchesUser = !selectedUser || real.userId === parseInt(selectedUser);
      const matchesProject = !selectedProject || real.projectId === parseInt(selectedProject);
      const matchesSearch = !searchQuery || 
        real.activities.toLowerCase().includes(searchQuery.toLowerCase()) ||
        real.realizationNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesMonth && matchesUser && matchesProject && matchesSearch;
    });
  }, [selectedMonth, selectedUser, selectedProject, searchQuery]);

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Executive Report (EAR)</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Monitoring Rencana & Realisasi Kerja Karyawan</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-center">
          <Printer className="w-3.5 h-3.5" />
          Cetak Laporan
        </button>
      </div>

      {/* Filter Bar (Light Mode) */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Month Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Bulan
            </label>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium shadow-sm"
            />
          </div>

          {/* User Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <UserIcon className="w-3 h-3" /> User
            </label>
            <select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium shadow-sm appearance-none"
            >
              <option value="">Semua User</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FolderKanban className="w-3 h-3" /> Project
            </label>
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium shadow-sm appearance-none"
            >
              <option value="">Semua Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code}</option>
              ))}
            </select>
          </div>

          {/* Search Filter */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3 h-3" /> Cari
            </label>
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 group-focus-within:text-indigo-500" />
              <input 
                type="text" 
                placeholder="Cari aktivitas atau nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Tabs Merged Row */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-100">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide w-full max-w-sm">
            {[
                { id: "plans", label: "Rencana Kerja", icon: <ClipboardList className="w-3.5 h-3.5" /> },
                { id: "realizations", label: "Realisasi Kerja", icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap flex items-center gap-2 ${
                        activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                    )}
                </button>
            ))}
        </div>
        
        {/* Compact Stats */}
        <div className="flex items-center gap-3 pb-3">
             <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 flex items-center gap-2 shadow-sm">
                 <span>Rencana</span>
                 <span className="bg-white px-2 py-0.5 rounded text-indigo-600 border border-indigo-50">{filteredPlans.length}</span>
             </div>
             <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 flex items-center gap-2 shadow-sm">
                 <span>Realisasi</span>
                 <span className="bg-white px-2 py-0.5 rounded text-emerald-600 border border-emerald-50">{filteredRealizations.length}</span>
             </div>
        </div>
      </div>

      {/* Main Content Table (Geometric & Compact) */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          {activeTab === "plans" ? (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-3.5 text-left">Tanggal & Waktu</th>
                  <th className="px-4 py-3.5 text-left">Karyawan</th>
                  <th className="px-4 py-3.5 text-left">Aktivitas / Nomor</th>
                  <th className="px-4 py-3.5 text-left hidden md:table-cell">Project</th>
                  <th className="px-6 py-3.5 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map(plan => {
                    const user = getUserById(plan.userId);
                    const project = plan.projectId ? getProjectById(plan.projectId) : null;
                    const createdDate = new Date(plan.createdAt);
                    const isLate = createdDate.getHours() >= 10;

                    return (
                      <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <p className="font-semibold text-slate-800 mb-0.5">
                            {new Date(plan.planDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${
                            isLate ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {createdDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} {isLate ? '(Telat)' : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                                {user?.name?.charAt(0) || "?"}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 leading-none mb-1">{user?.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{user?.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-700 block truncate max-w-[200px] lg:max-w-xs">{plan.activities}</div>
                          <div className="text-[10px] text-slate-400 font-sans mt-0.5">#{plan.planNumber}</div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                          {project ? (
                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold border border-purple-100 shadow-sm">
                              {project.code}
                            </span>
                          ) : <span className="text-slate-400 text-xs font-bold">-</span>}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-right">
                          <button className="p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium text-sm">
                      Tidak ada data rencana kerja ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-3.5 text-left">Tanggal & Progress</th>
                  <th className="px-4 py-3.5 text-left">Karyawan</th>
                  <th className="px-4 py-3.5 text-left">Aktivitas / Nomor</th>
                  <th className="px-4 py-3.5 text-left hidden md:table-cell">Project</th>
                  <th className="px-6 py-3.5 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRealizations.length > 0 ? (
                  filteredRealizations.map(real => {
                    const user = getUserById(real.userId);
                    const project = real.projectId ? getProjectById(real.projectId) : null;

                    return (
                      <tr key={real.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <p className="font-semibold text-slate-800 mb-1.5">
                            {new Date(real.realizationDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <div className="flex flex-col gap-1 w-24">
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full" 
                                style={{ width: `${real.progress}%` }}
                              />
                            </div>
                            <span className="text-[12px] font-black text-emerald-600 uppercase tracking-widest">{real.progress}% Selesai</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                                {user?.name?.charAt(0) || "?"}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 leading-none mb-1">{user?.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{user?.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-700 block truncate max-w-[200px] lg:max-w-xs">{real.activities}</div>
                          <div className="text-[10px] text-slate-400 font-sans mt-0.5">#{real.realizationNumber}</div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                          {project ? (
                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold border border-purple-100 shadow-sm">
                              {project.code}
                            </span>
                          ) : <span className="text-slate-400 text-xs font-bold">-</span>}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-right">
                          <button className="p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium text-sm">
                      Tidak ada data realisasi kerja ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Info Box - Lightened and Styled */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 shadow-sm">
        <Info className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
        <div className="text-xs text-indigo-900 leading-relaxed font-medium">
          <p className="font-bold text-indigo-800 mb-1">Panduan Pemantauan EAR:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li><span className="text-emerald-700 font-bold">Waktu Hijau:</span> Rencana kerja diinput tepat waktu (sebelum jam 10:00).</li>
            <li><span className="text-red-600 font-bold">Waktu Merah (Telat):</span> Rencana kerja diinput terlambat (setelah jam 10:00).</li>
            <li>Gunakan kombinasi <span className="font-bold">Bulan</span>, <span className="font-bold">User</span>, atau <span className="font-bold">Project</span> untuk mendapatkan filter komprehensif.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
