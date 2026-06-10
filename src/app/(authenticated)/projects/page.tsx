"use client";

import { useState, useMemo } from "react";
import {
 projects, getUserById, getStatusColor, users,
 getProjectTeam, workPlans, workRealizations, getProjectById, formatDate
} from "@/lib/data";
import Modal from"@/components/Modal";
import {
 FolderKanban, Users, Trash2, Eye, Plus,
 Search, Shield, ArrowRight, Clock, Target,
 CheckCircle2, ListChecks, DollarSign, ExternalLink,
 AlertCircle
} from"lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProjectsPage() {
 const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
 const [filterStatus, setFilterStatus] = useState("Semua Proyek");
 const [searchQuery, setSearchQuery] = useState("");
 const router = useRouter();
 const { data: session } = useSession();
 const currentUser = session?.user;

 const filteredProjects = useMemo(() => {
 return projects.filter(p => {
  // If user is PM, show projects they manage OR projects they are a member of
  if (currentUser?.role === 'project_manager') {
    const isManager = p.managerId === Number(currentUser.id);
    const isMember = getProjectTeam(p.id).some(member => member.userId === Number(currentUser.id));
    if (!isManager && !isMember) return false;
  }
  const matchStatus = filterStatus ==="Semua Proyek"|| p.status.toLowerCase() === filterStatus.toLowerCase();
  const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
  p.code.toLowerCase().includes(searchQuery.toLowerCase());
  return matchStatus && matchSearch;
 });
 }, [filterStatus, searchQuery, currentUser]);

 
 const openDetailModal = (project: any) => {
 setSelectedProject(project);
 setIsDetailModalOpen(true);
 };

 
 
  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium text-slate-900">Project Management</h1>
            <p className="text-[13px] text-slate-500 mt-1">Monitoring lifecycle dan alokasi personel proyek</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-[13px] rounded-md hover:bg-slate-50 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[13px] rounded-md transition-colors"
            >
              <Plus className="w-4 h-4"/> Proyek Baru
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
              {["Semua Proyek","active","on_hold","completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-4 py-2 text-[13px] font-medium rounded-md whitespace-nowrap transition-colors border ${
                    filterStatus === tab 
                      ?"bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      :"bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {tab ==="Semua Proyek"? tab : tab.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </button>
              ))}
            </div>
            
            <div className="relative group min-w-[280px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"/>
              <input
                type="text"
                placeholder="Cari nama proyek atau kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="py-3 px-4 font-medium">Informasi Proyek</th>
                <th className="py-3 px-4 font-medium hidden md:table-cell">PIC / Manager</th>
                <th className="py-3 px-4 font-medium hidden lg:table-cell">Timeline</th>
                <th className="py-3 px-4 font-medium text-center">Status</th>
                <th className="py-3 px-4 font-medium text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {filteredProjects.map((p) => {
                const manager = getUserById(p.managerId);
                const sc = getStatusColor(p.status);
                const pTeam = getProjectTeam(p.id);
                const hasIdleMembers = pTeam.some(member => !workPlans.some(wp => wp.userId === member.userId && wp.projectId === p.id));
                
                return (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                          <FolderKanban className="w-4 h-4"/>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 mb-0.5 truncate">{p.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{p.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                          {manager?.name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 mb-0.5 truncate">{manager?.name ||"-"}</p>
                          <p className="text-xs text-slate-500">{manager?.position ||"Staff"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-col gap-1.5 w-32">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> 3 Bln</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-2/3 rounded-full"/>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.text.replace('text-', 'bg-').replace('-700', '-500')}`} />
                        <span className={`text-[12px] font-medium ${sc.text}`}>
                          {p.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Detail Info"
                          onClick={() => openDetailModal(p)}
                          className="inline-flex items-center justify-center p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4"/>
                        </button>
                        {p.managerId === Number(currentUser?.id) && (
                          <>
                            <button 
                              onClick={() => router.push(`/projects/${p.id}`)}
                              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md transition-colors text-[13px] font-medium shadow-sm"
                            >
                              <Users className="w-4 h-4"/> 
                              <span className="hidden sm:inline">Kelola Tim</span>
                              {hasIdleMembers && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                                </span>
                              )}
                            </button>
                            <button 
                              title="Hapus Proyek"
                              className="inline-flex items-center justify-center p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors border border-red-100"
                            >
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-[13px]">
                    <FolderKanban className="w-10 h-10 mx-auto text-slate-300 mb-3"/>
                    Tidak ada data proyek ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      

      {/* New Project Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Inisiasi Proyek Baru"
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsNewProjectModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => setIsNewProjectModalOpen(false)}
              className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Simpan Proyek
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Nama Proyek</label>
            <input
              type="text"
              placeholder="Contoh: Infrastruktur Data Center"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Kode Internal</label>
              <input
                type="text"
                placeholder="PRJ-XXXX"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Manajer</label>
              <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
                <option value="">Pilih Member...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Masa Kontrak / Timeline</label>
            <div className="flex items-center gap-3">
              <input type="date" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"/>
              <ArrowRight className="w-4 h-4 text-slate-400"/>
              <input type="date" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"/>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">Deskripsi Proyek</label>
            <textarea
              rows={3}
              placeholder="Ruang lingkup kerja..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            ></textarea>
          </div>
        </div>
      </Modal>
      {/* Detail Project Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Informasi Detail Proyek"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={() => {
                setIsDetailModalOpen(false);
                router.push(`/ear?project=${selectedProject?.id}`);
              }}
              className="px-4 py-2 text-[13px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Lihat Laporan EAR
            </button>
            <button onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Tutup</button>
          </div>
        }
      >
        {selectedProject && (() => {
          const manager = getUserById(selectedProject.managerId);
          const sc = getStatusColor(selectedProject.status);
          
          // Derived Stats
          const projectTeam = getProjectTeam(selectedProject.id);
          const pPlans = workPlans.filter(wp => wp.projectId === selectedProject.id);
          const pReals = workRealizations.filter(wr => wr.projectId === selectedProject.id);
          const avgProgress = pReals.length > 0 
            ? Math.round(pReals.reduce((acc, curr) => acc + curr.progress, 0) / pReals.length) 
            : 0;

          return (
            <div className="space-y-8 px-2 py-1">
              {/* Header - Clean */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">{selectedProject.name}</h4>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.text.replace('text-', 'bg-')}`}></span>
                      {selectedProject.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[13px] font-mono text-slate-500">{selectedProject.code}</p>
                </div>
              </div>

              {/* Minimal Key Info */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Project Manager</p>
                  <p className="text-[14px] font-medium text-slate-900">{manager?.name || '-'}</p>
                  <p className="text-[12px] text-slate-500">{manager?.position || '-'}</p>
                </div>
                
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5"/> Budget</p>
                  <p className="text-xl font-medium text-slate-900 tracking-tight">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedProject.budget)}
                  </p>
                </div>
              </div>

              {/* Minimal Stats Line */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Target className="w-3.5 h-3.5"/> Performance</p>
                <div className="flex items-center justify-between py-4 border-y border-slate-100">
                  <div className="text-center px-4">
                    <p className="text-2xl font-light text-slate-800">{projectTeam.length}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Tim</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100"></div>
                  <div className="text-center px-4">
                    <p className="text-2xl font-light text-slate-800">{pPlans.length}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Rencana</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100"></div>
                  <div className="text-center px-4">
                    <p className="text-2xl font-light text-slate-800">{pReals.length}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Realisasi</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100"></div>
                  <div className="text-center px-4">
                    <p className="text-2xl font-medium text-indigo-600">{avgProgress}%</p>
                    <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mt-1">Progress</p>
                  </div>
                </div>
              </div>

              {/* Clean Description */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Deskripsi</p>
                <p className="text-[14px] text-slate-600 leading-relaxed font-light">
                  {selectedProject.description || 'Tidak ada deskripsi rinci untuk proyek ini.'}
                </p>
              </div>
            </div>
          );
        })()}
      </Modal>

      
 </div>
 );
}
