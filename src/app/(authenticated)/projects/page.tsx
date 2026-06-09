"use client";

import { useState, useMemo } from"react";
import {
 projects, getUserById, getStatusColor, users,
 getProjectTeam, workPlans, workRealizations, getProjectById, formatDate
} from"@/lib/data";
import Modal from"@/components/Modal";
import {
 FolderKanban, Users, Trash2, Eye, Plus,
 Search, Shield, ArrowRight, Clock, Target,
 CheckCircle2, ListChecks
} from"lucide-react";

export default function ProjectsPage() {
 const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
 const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
 const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
 const [detailTab, setDetailTab] = useState<"rencana" | "realisasi">("rencana");
 const [selectedProject, setSelectedProject] = useState<any>(null);
 const [filterStatus, setFilterStatus] = useState("Semua Proyek");
 const [searchQuery, setSearchQuery] = useState("");

 const filteredProjects = useMemo(() => {
 return projects.filter(p => {
 const matchStatus = filterStatus ==="Semua Proyek"|| p.status.toLowerCase() === filterStatus.toLowerCase();
 const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
 p.code.toLowerCase().includes(searchQuery.toLowerCase());
 return matchStatus && matchSearch;
 });
 }, [filterStatus, searchQuery]);

 const openTeamModal = (project: any) => {
 setSelectedProject(project);
 setIsTeamModalOpen(true);
 };

 const openDetailModal = (project: any) => {
 setSelectedProject(project);
 setDetailTab("rencana");
 setIsDetailModalOpen(true);
 };

 const filteredRencana = useMemo(() => {
 if (!selectedProject) return [];
 return workPlans.filter(wp => wp.projectId === selectedProject.id);
 }, [selectedProject]);

 const filteredRealisasi = useMemo(() => {
 if (!selectedProject) return [];
 return workRealizations.filter(wr => wr.projectId === selectedProject.id);
 }, [selectedProject]);

 const projectTeam = useMemo(() => {
 if (!selectedProject) return [];
 return getProjectTeam(selectedProject.id).map((member: any) => ({
 ...member,
 user: getUserById(member.userId)
 }));
 }, [selectedProject]);

 return (
 <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
 {/* Unified Dashboard Card */}
 <div className="flex-1 min-h-0 bg-white rounded-2xl flex flex-col overflow-hidden">
 
 {/* Top Header */}
 <div className="border-b border-slate-100 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Project Management</h1>
 <p className="text-sm font-medium text-slate-500 mt-1">Monitoring lifecycle dan alokasi personel proyek</p>
 </div>
 <div className="flex items-center gap-2.5 shrink-0">
 <button
 className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded-xl hover:bg-slate-50 transition-colors"
 >
 Export CSV
 </button>
 <button
 onClick={() => setIsNewProjectModalOpen(true)}
 className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors"
 >
 <Plus className="w-3.5 h-3.5"/> Proyek Baru
 </button>
 </div>
 </div>

 {/* Filter Controls */}
 <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
 <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
 {["Semua Proyek","active","on_hold","completed"].map((tab) => (
 <button
 key={tab}
 onClick={() => setFilterStatus(tab)}
 className={`px-3 py-1.5 text-[12px] font-bold rounded-lg whitespace-nowrap transition-all tracking-wide ${
 filterStatus === tab 
 ?"bg-indigo-50 text-indigo-600 border border-indigo-100"
 :"bg-transparent text-slate-400 border border-transparent hover:bg-slate-50 hover:text-slate-600"
 }`}
 >
 {tab ==="Semua Proyek"? tab : tab.replace('_', ' ')}
 </button>
 ))}
 </div>
 
 <div className="relative group min-w-[320px]">
 <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400"/>
 <input
 type="text"
 placeholder="Cari nama proyek atau kode..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
 />
 </div>
 </div>
 </div>

 {/* Main Table */}
 <div className="flex-1 overflow-auto scrollbar-hide">
 <table className="w-full text-xs">
 <thead>
 <tr className="bg-white border-b border-slate-200 font-semibold text-slate-500 tracking-wide text-[10px] sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
 <th className="text-left py-3 px-4 font-bold">Informasi Proyek</th>
 <th className="text-left py-2.5 px-4 hidden md:table-cell">PIC / Manager</th>
 <th className="text-left py-2.5 px-4 hidden lg:table-cell">Timeline</th>
 <th className="text-center py-2.5 px-4">Status</th>
 <th className="text-right py-2.5 px-4">Opsi</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {filteredProjects.map((p) => {
 const manager = getUserById(p.managerId);
 const sc = getStatusColor(p.status);
 
 return (
 <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
 <td className="py-2.5 px-4">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
 <FolderKanban className="w-4 h-4"/>
 </div>
 <div className="min-w-0">
 <p className="font-bold text-slate-800 text-sm leading-none mb-1.5 truncate">{p.name}</p>
 <p className="text-[10px] text-slate-400 font-bold tracking-wide font-sans">CODE: {p.code}</p>
 </div>
 </div>
 </td>
 <td className="py-2.5 px-4 hidden md:table-cell">
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
 {manager?.name?.charAt(0)}
 </div>
 <div className="min-w-0">
 <p className="font-bold text-slate-700 leading-none mb-0.5 truncate">{manager?.name ||"-"}</p>
 <p className="text-[10px] text-slate-400 font-bold tracking-tight">{manager?.position ||"Staff"}</p>
 </div>
 </div>
 </td>
 <td className="py-2.5 px-4 hidden lg:table-cell">
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[9px]">
 <Clock className="w-3 h-3 text-slate-300"/>
 <span>3 Bulan Tersisa</span>
 </div>
 <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
 <div className="h-full bg-indigo-500 w-2/3 rounded-full"/>
 </div>
 </div>
 </td>
 <td className="py-2.5 px-4 text-center">
 <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black border tracking-wide bg-transparent ${sc.text} ${sc.border === 'border-slate-200' ? 'border-slate-300' : sc.border}`}>
 {p.status.replace('_', ' ')}
 </span>
 </td>
 <td className="py-2.5 px-4 text-right whitespace-nowrap">
 <div className="flex items-center justify-end gap-1 transition-opacity">
 <button
 title="Detail Info"
 onClick={() => openDetailModal(p)}
 className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 rounded-lg"
 >
 <Eye className="w-3.5 h-3.5"/>
 </button>
 <button 
 onClick={() => openTeamModal(p)}
 className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-slate-500 hover:text-white bg-white hover:bg-slate-800 border border-slate-200 hover:border-slate-800 rounded-lg transition-all text-[10px] font-bold"
 >
 <Users className="w-3.5 h-3.5"/> 
 <span className="hidden sm:inline">Kelola Tim</span>
 </button>
 <button 
 className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white hover:bg-red-50 border border-slate-100 rounded-lg"
 >
 <Trash2 className="w-3.5 h-3.5"/>
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 {filteredProjects.length === 0 && (
 <tr>
 <td colSpan={5} className="py-16 text-center text-slate-400 font-medium">
 <FolderKanban className="w-10 h-10 mx-auto text-slate-200 mb-3"/>
 Tidak ada data proyek ditemukan.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Manage Team Modal */}
 <Modal
 isOpen={isTeamModalOpen}
 onClose={() => setIsTeamModalOpen(false)}
 title={`Manajemen Tim: ${selectedProject?.name}`}
 size="lg"
 footer={
 <button onClick={() => setIsTeamModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all">Simpan Perubahan</button>
 }
 >
 <div className="space-y-6">
 <div className="flex items-center justify-between pb-4 border-b border-slate-100">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
 <Users className="w-4 h-4"/>
 </div>
 <div>
 <h4 className="text-sm font-bold text-slate-800 tracking-tight">Anggota Tim Aktif</h4>
 <p className="text-[10px] text-slate-400 font-bold tracking-wide">{selectedProject?.code}</p>
 </div>
 </div>
 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-all">
 <Plus className="w-3.5 h-3.5"/> Tambah Personel
 </button>
 </div>

 <div className="space-y-3">
 {projectTeam.length > 0 ? projectTeam.map((member: any) => (
 <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl group transition-all hover:bg-white hover:border-indigo-100">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
 {member.user?.name?.charAt(0)}
 </div>
 <div>
 <p className="text-[12px] font-bold text-slate-800 leading-none mb-1">{member.user?.name}</p>
 <p className="text-[10px] text-slate-400 font-bold tracking-wide">{member.role}</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">AKTIF</span>
 <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
 <Trash2 className="w-4 h-4"/>
 </button>
 </div>
 </div>
 )) : (
 <div className="py-12 text-center text-slate-400 italic text-xs">
 Belum ada personel yang dialokasikan ke tim ini.
 </div>
 )}
 </div>
 
 <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3">
 <Shield className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5"/>
 <p className="text-[12px] text-indigo-800 font-medium leading-relaxed">
 Setiap personel yang ditambahkan ke tim proyek akan mendapatkan hak akses untuk membuat Rencana Kerja (EAR) yang dikaitkan langsung dengan Kode Proyek ini.
 </p>
 </div>
 </div>
 </Modal>

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
 className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
 >
 Batal
 </button>
 <button
 onClick={() => setIsNewProjectModalOpen(false)}
 className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all"
 >
 Simpan Proyek
 </button>
 </>
 }
 >
 <div className="space-y-4">
 <div className="space-y-1.5">
 <label className="text-[12px] font-bold text-slate-500 tracking-wide">Nama Proyek</label>
 <input
 type="text"
 placeholder="Contoh: Infrastruktur Data Center"
 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-[12px] font-bold text-slate-500 tracking-wide">Kode Internal</label>
 <input
 type="text"
 placeholder="PRJ-XXXX"
 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"
 />
 </div>

 <div className="space-y-1.5">
 <label className="text-[12px] font-bold text-slate-500 tracking-wide">Manajer</label>
 <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium appearance-none">
 <option value="">Pilih Member...</option>
 {users.map(u => (
 <option key={u.id} value={u.id}>{u.name}</option>
 ))}
 </select>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[12px] font-bold text-slate-500 tracking-wide">Masa Kontrak / Timeline</label>
 <div className="flex items-center gap-3">
 <input type="date"className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"/>
 <ArrowRight className="w-4 h-4 text-slate-300"/>
 <input type="date"className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium"/>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[12px] font-bold text-slate-500 tracking-wide">Deskripsi Proyek</label>
 <textarea
 rows={3}
 placeholder="Ruang lingkup kerja..."
 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium resize-none"
 ></textarea>
 </div>
 </div>
 </Modal>
 </div>
 );
}
