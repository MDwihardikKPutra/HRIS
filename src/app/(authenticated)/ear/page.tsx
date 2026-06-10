"use client";

import { useState, useMemo, useEffect } from "react";
import { 
 ClipboardList, CheckCircle2, Search, 
 Calendar, User as UserIcon, FolderKanban, Info,
 Printer, Eye, Check, X, Plus, Target
} from"lucide-react";
import Modal from "@/components/Modal";
import { 
 workPlans, workRealizations, users, projects,
 getUserById, getProjectById, getProjectTeam
} from"@/lib/data";
import { useSession } from "next-auth/react";

export default function EARPage() {
 const [activeTab, setActiveTab] = useState<"plans"|"realizations">("plans");
 const [selectedMonth, setSelectedMonth] = useState("");
 const [selectedUser, setSelectedUser] = useState("");
 const [selectedProject, setSelectedProject] = useState("");
 const [searchQuery, setSearchQuery] = useState("");
 const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
 const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
 const [selectedItem, setSelectedItem] = useState<any>(null);

 const { data: session } = useSession();
 const userRole = session?.user?.role;

 const [localPlans, setLocalPlans] = useState(workPlans);
 const [localRealizations, setLocalRealizations] = useState(workRealizations);

 const handleApproval = (status: 'approved' | 'rejected', itemToUpdate?: any) => {
   const targetItem = itemToUpdate || selectedItem;
   if (!targetItem) return;

   if (targetItem.type === 'rencana') {
     setLocalPlans(prev => prev.map(p => p.id === targetItem.id ? { ...p, status } : p));
   } else {
     setLocalRealizations(prev => prev.map(r => r.id === targetItem.id ? { ...r, status } : r));
   }
   
   // Update selectedItem state if it's the one currently opened in the modal
   if (selectedItem && selectedItem.id === targetItem.id && selectedItem.type === targetItem.type) {
     setSelectedItem({ ...selectedItem, status });
   }
 };

 const handleAssignTask = (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   const formData = new FormData(e.currentTarget);
   const userId = Number(formData.get("userId"));
   const projectId = Number(formData.get("projectId"));
   const date = formData.get("date") as string;
   const activities = formData.get("activities") as string;

   const newPlan = {
     id: Date.now(),
     userId,
     projectId,
     planNumber: `WP-${Date.now().toString().slice(-4)}`,
     planDate: date,
     activities,
     status: "pending" as const,
     createdAt: new Date().toISOString(),
     assignedBy: Number(session?.user?.id),
     isAcknowledged: false
   };

   workPlans.push(newPlan);
   setLocalPlans([...localPlans, newPlan]);
   setIsAssignTaskModalOpen(false);
   alert("Penugasan berhasil diberikan! Karyawan akan melihatnya di Rencana Kerja mereka.");
 };

 useEffect(() => {
   const params = new URLSearchParams(window.location.search);
   const pId = params.get('project');
   if (pId) {
     setSelectedProject(pId);
   }
 }, []);

 const openDetail = (item: any, type: 'rencana' | 'realisasi') => {
   setSelectedItem({ ...item, type });
   setIsDetailModalOpen(true);
 };
 
 // Filtering Logic
 const filteredPlans = useMemo(() => {
 return localPlans.filter(plan => {
 const matchesMonth = !selectedMonth || plan.planDate.startsWith(selectedMonth);
 const matchesUser = !selectedUser || plan.userId === parseInt(selectedUser);
 const matchesProject = !selectedProject || plan.projectId === parseInt(selectedProject);
 const matchesSearch = !searchQuery || 
 plan.activities.toLowerCase().includes(searchQuery.toLowerCase()) ||
 plan.planNumber.toLowerCase().includes(searchQuery.toLowerCase());
 
 return matchesMonth && matchesUser && matchesProject && matchesSearch;
 }).sort((a, b) => {
   const order = { pending: 0, rejected: 1, approved: 2 };
   return (order[a.status as keyof typeof order] || 0) - (order[b.status as keyof typeof order] || 0);
 });
 }, [selectedMonth, selectedUser, selectedProject, searchQuery, localPlans]);

 const filteredRealizations = useMemo(() => {
 return localRealizations.filter(real => {
 const matchesMonth = !selectedMonth || real.realizationDate.startsWith(selectedMonth);
 const matchesUser = !selectedUser || real.userId === parseInt(selectedUser);
 const matchesProject = !selectedProject || real.projectId === parseInt(selectedProject);
 const matchesSearch = !searchQuery || 
 real.activities.toLowerCase().includes(searchQuery.toLowerCase()) ||
 real.realizationNumber.toLowerCase().includes(searchQuery.toLowerCase());
 
 return matchesMonth && matchesUser && matchesProject && matchesSearch;
 }).sort((a, b) => {
   const order = { pending: 0, rejected: 1, approved: 2 };
   return (order[a.status as keyof typeof order] || 0) - (order[b.status as keyof typeof order] || 0);
 });
 }, [selectedMonth, selectedUser, selectedProject, searchQuery, localRealizations]);

 return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 px-4 py-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium text-slate-900">Executive Report (EAR)</h1>
            <p className="text-[13px] text-slate-500 mt-1">Monitoring Rencana & Realisasi Kerja Karyawan</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-[13px] rounded-md hover:bg-slate-50 transition-colors">
              <Printer className="w-4 h-4"/>
              Cetak
            </button>
            {userRole === 'project_manager' && (
              <button 
                onClick={() => setIsAssignTaskModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[13px] rounded-md transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4"/> Beri Tugas
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar (Light Mode) */}
        <div className="bg-white border-b border-slate-200 p-4 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Month Filter */}
            <div>
              <label className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5"/> Bulan
              </label>
              <input 
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* User Filter */}
            <div>
              <label className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5">
                <UserIcon className="w-3.5 h-3.5"/> User
              </label>
              <select 
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="">Semua User</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5">
                <FolderKanban className="w-3.5 h-3.5"/> Project
              </label>
              <select 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="">Semua Project</option>
                {projects.filter(p => userRole !== 'project_manager' || p.managerId === Number(session?.user?.id) || getProjectTeam(p.id).some(member => member.userId === Number(session?.user?.id))).map(p => (
                  <option key={p.id} value={p.id}>{p.code}</option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div className="lg:col-span-2">
              <label className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5">
                <Search className="w-3.5 h-3.5"/> Cari
              </label>
              <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 group-focus-within:text-indigo-500 transition-colors"/>
                <input 
                  type="text"
                  placeholder="Cari aktivitas atau nomor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Tabs Merged Row */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 px-4 pt-4 border-b border-slate-200 shrink-0">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide w-full max-w-sm">
            {[
              { id:"plans", label:"Rencana Kerja", icon: <ClipboardList className="w-4 h-4"/> },
              { id:"realizations", label:"Realisasi Kerja", icon: <CheckCircle2 className="w-4 h-4"/> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-[13px] font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id ?"text-indigo-600":"text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"/>
                )}
              </button>
            ))}
          </div>
          
          {/* Compact Stats */}
          <div className="flex items-center gap-4 pb-3">
            <div className="text-[13px] text-slate-500 flex items-center gap-1.5">
              Rencana <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{filteredPlans.length}</span>
            </div>
            <div className="text-[13px] text-slate-500 flex items-center gap-1.5">
              Realisasi <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{filteredRealizations.length}</span>
            </div>
          </div>
        </div>

        {/* Main Content Table */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          {activeTab ==="plans"? (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
                <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                  <th className="px-4 py-3 font-medium">Waktu</th>
                  <th className="px-4 py-3 font-medium">Karyawan</th>
                  <th className="px-4 py-3 font-medium">Aktivitas</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Project</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map(plan => {
                    const user = getUserById(plan.userId);
                    const project = plan.projectId ? getProjectById(plan.projectId) : null;
                    const createdDate = new Date(plan.createdAt);
                    const isLate = createdDate.getHours() >= 10;

                    return (
                      <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 mb-0.5">
                            {new Date(plan.planDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                          </p>
                          <span className={`text-xs ${
                            isLate ? 'text-red-600' : 'text-slate-500'
                          }`}>
                            {createdDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} {isLate ? '(TLT)' : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                              {user?.name?.charAt(0) ||"?"}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 mb-0.5">{user?.name}</p>
                              <p className="text-xs text-slate-500 capitalize">{user?.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 block truncate max-w-[250px] mb-0.5">{plan.activities}</div>
                          <div className="text-xs text-slate-500 font-mono">#{plan.planNumber}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {project ? (
                            <span className="text-slate-600">
                              {project.code}
                            </span>
                          ) : <span className="text-slate-400">-</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 text-[11px] font-medium capitalize ${
                            plan.status === 'approved' ? 'text-emerald-600' :
                            plan.status === 'rejected' ? 'text-red-600' :
                            'text-amber-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              plan.status === 'approved' ? 'bg-emerald-500' :
                              plan.status === 'rejected' ? 'bg-red-500' :
                              'bg-amber-500'
                            }`}></span>
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => openDetail(plan, 'rencana')} 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5"/>
                            Preview
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-[13px]">
                      Tidak ada data rencana kerja ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
                <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Karyawan</th>
                  <th className="px-4 py-3 font-medium">Aktivitas</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Project</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                {filteredRealizations.length > 0 ? (
                  filteredRealizations.map(real => {
                    const user = getUserById(real.userId);
                    const project = real.projectId ? getProjectById(real.projectId) : null;

                    return (
                      <tr key={real.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 mb-1.5">
                            {new Date(real.realizationDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                          </p>
                          <div className="flex items-center gap-2 w-24">
                            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${real.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-slate-500">{real.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                              {user?.name?.charAt(0) ||"?"}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 mb-0.5">{user?.name}</p>
                              <p className="text-xs text-slate-500 capitalize">{user?.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 block truncate max-w-[250px] mb-0.5">{real.activities}</div>
                          <div className="text-xs text-slate-500 font-mono">#{real.realizationNumber}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {project ? (
                            <span className="text-slate-600">
                              {project.code}
                            </span>
                          ) : <span className="text-slate-400">-</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 text-[11px] font-medium capitalize ${
                            real.status === 'approved' ? 'text-emerald-600' :
                            real.status === 'rejected' ? 'text-red-600' :
                            'text-amber-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              real.status === 'approved' ? 'bg-emerald-500' :
                              real.status === 'rejected' ? 'bg-red-500' :
                              'bg-amber-500'
                            }`}></span>
                            {real.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => openDetail(real, 'realisasi')} 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5"/>
                            Preview
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-[13px]">
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
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 shrink-0">
        <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0"/>
        <div className="text-[13px] text-slate-700 leading-relaxed">
          <p className="font-medium text-slate-900 mb-1">Panduan Pemantauan EAR:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li><span className="font-medium">Waktu Abu-abu:</span> Rencana kerja diinput tepat waktu (sebelum jam 10:00).</li>
            <li><span className="text-red-600 font-medium">Waktu Merah (TLT):</span> Rencana kerja diinput terlambat (setelah jam 10:00).</li>
            <li>Gunakan kombinasi <span className="font-medium text-slate-900">Bulan</span>, <span className="font-medium text-slate-900">User</span>, atau <span className="font-medium text-slate-900">Project</span> untuk memfilter secara komprehensif.</li>
          </ul>
        </div>
      </div>
      
      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Detail ${selectedItem?.type === 'rencana' ? 'Rencana' : 'Realisasi'} Kerja`}
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            {((userRole === 'project_manager' || userRole === 'admin') && selectedItem?.status === 'pending') ? (
              <div className="flex items-center gap-2">
                <button onClick={() => handleApproval('rejected')} className="px-4 py-2 text-[13px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Tolak</button>
                <button onClick={() => handleApproval('approved')} className="px-4 py-2 text-[13px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors">Setujui</button>
              </div>
            ) : (
              <div />
            )}
            <button onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Tutup</button>
          </div>
        }
      >
        {selectedItem && (() => {
          const project = selectedItem.projectId ? getProjectById(selectedItem.projectId) : null;
          const user = getUserById(selectedItem.userId);
          const createdAt = new Date(selectedItem.createdAt);
          const isLate = selectedItem.type === 'rencana' && createdAt.getHours() >= 10;
          
          return (
            <div className="space-y-5">
              {/* Header Info */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 font-mono tracking-tight">{selectedItem.planNumber || selectedItem.realizationNumber}</h4>
                  <p className="text-[13px] text-slate-500 mt-1">
                    Diinput pada: <span className="font-medium text-slate-700">{createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul {createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </p>
                  {isLate && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-medium rounded border border-red-200">
                      Terlambat (Input setelah 10:00)
                    </span>
                  )}
                </div>
                <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                  selectedItem.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  selectedItem.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {selectedItem.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Tanggal Pelaksanaan</p>
                  <p className="text-[14px] font-medium text-slate-900">
                    {new Date(selectedItem.planDate || selectedItem.realizationDate).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Proyek Terkait</p>
                  {project ? (
                    <div>
                      <p className="text-[13px] font-medium text-slate-900 truncate">{project.name}</p>
                      <p className="text-[11px] font-mono text-slate-500">{project.code}</p>
                    </div>
                  ) : (
                    <p className="text-[13px] text-slate-500">- Non Project -</p>
                  )}
                </div>

                <div className="col-span-2">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Karyawan</p>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[13px] font-bold text-indigo-700">
                      {user?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{user?.position} • {user?.department}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Detail Aktivitas</p>
                  <div className="p-3.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 leading-relaxed min-h-[80px] shadow-sm">
                    {selectedItem.activities}
                  </div>
                </div>

                {selectedItem.type === 'realisasi' && (
                  <div className="col-span-2">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Progress Pencapaian</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            selectedItem.progress === 100 ? 'bg-emerald-500' :
                            selectedItem.progress >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${selectedItem.progress}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-bold text-slate-700 w-10 text-right">{selectedItem.progress}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Assign Task Modal */}
      <Modal
        isOpen={isAssignTaskModalOpen}
        onClose={() => setIsAssignTaskModalOpen(false)}
        title="Buat Penugasan Karyawan"
        size="sm"
      >
        <form onSubmit={handleAssignTask} className="space-y-5">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-3">
            <Target className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-indigo-900">Delegasi Tugas Cepat</p>
              <p className="text-[11px] text-indigo-600/80">Penugasan ini akan otomatis masuk ke antrean Rencana Kerja karyawan (EAR).</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Karyawan Ditugaskan <span className="text-red-500">*</span></label>
            <select name="userId" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none">
              <option value="">Pilih Karyawan...</option>
              {users.filter(u => u.role !== 'hr' && u.role !== 'admin').map((u: any) => (
                <option key={u.id} value={u.id}>{u.name} - {u.position}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Proyek Terkait <span className="text-red-500">*</span></label>
            <select name="projectId" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none">
              <option value="">Pilih Proyek...</option>
              {projects.filter(p => userRole !== 'project_manager' || p.managerId === Number(session?.user?.id)).map((p: any) => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Batas Waktu (Tenggat) <span className="text-red-500">*</span></label>
            <input type="date" name="date" required className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Deskripsi Pekerjaan <span className="text-red-500">*</span></label>
            <textarea
              name="activities"
              required
              rows={4}
              placeholder="Jelaskan detail tugas yang harus diselesaikan..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsAssignTaskModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm">
              Berikan Tugas
            </button>
          </div>
        </form>
      </Modal>
    </div>
 );
}
