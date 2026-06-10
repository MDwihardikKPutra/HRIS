"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  projects,
  getUserById,
  users,
  getProjectTeam,
  workPlans,
  workRealizations,
  formatDate,
  getStatusColor,
} from "@/lib/data";
import {
  ArrowLeft,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  Target,
  Shield,
  Activity,
  KanbanSquare,
  ClipboardList
} from "lucide-react";
import Modal from "@/components/Modal";
import KanbanBoard from "./_components/KanbanBoard";
import { StatusBadge } from "@/components/DataTable";

export default function ProjectTeamPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [selectedUserIdForTask, setSelectedUserIdForTask] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'team' | 'timeline' | 'kanban'>('team');
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<any>(null);
  const [timelineFilterType, setTimelineFilterType] = useState<'all' | 'month' | 'week' | 'range'>('all');
  const [timelineFilterValue, setTimelineFilterValue] = useState<string>('');
  const [timelineStartDate, setTimelineStartDate] = useState<string>('');
  const [timelineEndDate, setTimelineEndDate] = useState<string>('');

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projectId]);

  const projectTeam = useMemo(() => {
    if (!selectedProject) return [];
    return getProjectTeam(selectedProject.id);
  }, [selectedProject]);

  const timelineEvents = useMemo(() => {
    if (!selectedProject) return [];
    
    const pReals = workRealizations.filter(wr => wr.projectId === selectedProject.id).map(wr => {
      const relatedPlans = workPlans
        .filter(wp => wp.projectId === selectedProject.id && wp.userId === wr.userId && new Date(wp.planDate).getTime() <= new Date(wr.realizationDate).getTime())
        .sort((a, b) => new Date(b.planDate).getTime() - new Date(a.planDate).getTime());
        
      return {
        id: `wr-${wr.id}`,
        type: 'realization',
        date: wr.realizationDate,
        title: `Realisasi Kerja: ${wr.realizationNumber}`,
        description: wr.activities,
        user: getUserById(wr.userId),
        status: wr.status,
        progress: wr.progress,
        relatedPlan: relatedPlans[0] || null
      };
    });
    
    let combined = pReals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (timelineFilterType === 'month' && timelineFilterValue) {
      const [year, month] = timelineFilterValue.split('-');
      combined = combined.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
      });
    } else if (timelineFilterType === 'week' && timelineFilterValue) {
      const [yearStr, weekStr] = timelineFilterValue.split('-W');
      const year = parseInt(yearStr);
      const week = parseInt(weekStr);
      
      const jan4 = new Date(year, 0, 4);
      const dayOfWeek = jan4.getDay() === 0 ? 7 : jan4.getDay(); 
      const startOfWeek = new Date(year, 0, 4 - dayOfWeek + 1 + (week - 1) * 7);
      const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
      endOfWeek.setHours(23, 59, 59, 999);
      
      combined = combined.filter(e => {
        const d = new Date(e.date);
        return d >= startOfWeek && d <= endOfWeek;
      });
    } else if (timelineFilterType === 'range') {
      combined = combined.filter(e => {
        const d = new Date(e.date);
        const start = timelineStartDate ? new Date(timelineStartDate) : new Date(0);
        let end = new Date('2100-01-01');
        if (timelineEndDate) {
          end = new Date(timelineEndDate);
          end.setHours(23, 59, 59, 999);
        }
        return d >= start && d <= end;
      });
    }
    
    return combined;
  }, [selectedProject, timelineFilterType, timelineFilterValue, timelineStartDate, timelineEndDate]);

  const timelineFilterText = useMemo(() => {
    if (timelineFilterType === 'all') return 'Seluruh histori realisasi proyek';
    if (timelineFilterType === 'week' && timelineFilterValue) {
       const [year, week] = timelineFilterValue.split('-W');
       return `Realisasi di Minggu ke-${week}, Tahun ${year}`;
    }
    if (timelineFilterType === 'month' && timelineFilterValue) {
       const [year, month] = timelineFilterValue.split('-');
       const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
       return `Realisasi di Bulan ${monthNames[parseInt(month) - 1]} ${year}`;
    }
    if (timelineFilterType === 'range') {
       if (timelineStartDate && timelineEndDate) {
          return `Realisasi dari ${formatDate(timelineStartDate)} s/d ${formatDate(timelineEndDate)}`;
       } else if (timelineStartDate) {
          return `Realisasi mulai dari ${formatDate(timelineStartDate)}`;
       } else if (timelineEndDate) {
          return `Realisasi sampai dengan ${formatDate(timelineEndDate)}`;
       }
    }

    return 'Seluruh histori realisasi proyek';
  }, [timelineFilterType, timelineFilterValue, timelineStartDate, timelineEndDate]);

  const handleAssignTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    const formData = new FormData(e.currentTarget);
    const userId = Number(formData.get("userId"));
    const date = formData.get("date") as string;
    const activities = formData.get("activities") as string;

    workPlans.push({
      id: Date.now(),
      userId,
      projectId: selectedProject.id,
      planNumber: `WP-${Date.now().toString().slice(-4)}`,
      planDate: date,
      activities,
      status: "pending",
      createdAt: new Date().toISOString(),
      assignedBy: Number(currentUser?.id),
      isAcknowledged: false,
    });

    setIsAssignTaskModalOpen(false);
    alert("Penugasan berhasil diberikan! Karyawan akan melihatnya di Rencana Kerja mereka.");
  };

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-slate-500">Proyek tidak ditemukan.</p>
        <button onClick={() => router.back()} className="mt-4 text-indigo-600 font-medium">
          Kembali
        </button>
      </div>
    );
  }

  const isManager = selectedProject.managerId === Number(currentUser?.id);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div>
            <button
              onClick={() => router.push("/projects")}
              className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </button>
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                 <Users className="w-5 h-5"/>
               </div>
               <div>
                 <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                   Manajemen Proyek
                 </h1>
                 <p className="text-[13px] text-slate-500 font-medium mt-0.5">{selectedProject.name} <span className="mx-1.5 text-slate-300">•</span> <span className="font-mono text-slate-400">{selectedProject.code}</span></p>
               </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-xl transition-colors shadow-sm whitespace-nowrap">
              <Plus className="w-4 h-4" /> Tambah Personel
            </button>
          </div>
        </div>
        <div className="px-5 flex flex-wrap items-center justify-between gap-4 mt-2">
          <div className="flex gap-6">
            <button 
               onClick={() => setActiveTab('team')}
               className={`py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${activeTab === 'team' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
               Tim & Tugas
            </button>
            <button 
               onClick={() => setActiveTab('kanban')}
               className={`py-2.5 text-[13px] font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'kanban' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
               <KanbanSquare className="w-3.5 h-3.5"/> Task Board
            </button>
            <button 
               onClick={() => setActiveTab('timeline')}
               className={`py-2.5 text-[13px] font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'timeline' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
               <Activity className="w-3.5 h-3.5"/> Timeline
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mr-1">
              {activeTab === 'team' ? 'Filter Tanggal Tugas' : 'Filter Waktu'}
            </span>

            {activeTab === 'team' && (
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-[12px] font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-400 transition-colors"
              />
            )}

            {(activeTab === 'timeline' || activeTab === 'kanban') && (
              <>
                {(['all','month','week','range'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTimelineFilterType(t); setTimelineFilterValue(''); setTimelineStartDate(''); setTimelineEndDate(''); }}
                    className={`px-3 py-1 text-[11px] font-semibold rounded-full border transition-colors ${
                      timelineFilterType === t
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {t === 'all' ? 'Semua' : t === 'month' ? 'Per Bulan' : t === 'week' ? 'Per Minggu' : 'Rentang'}
                  </button>
                ))}
                {timelineFilterType === 'month' && (
                  <input type="month" value={timelineFilterValue} onChange={e => setTimelineFilterValue(e.target.value)}
                    className="text-[12px] font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-400" />
                )}
                {timelineFilterType === 'week' && (
                  <input type="week" value={timelineFilterValue} onChange={e => setTimelineFilterValue(e.target.value)}
                    className="text-[12px] font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-400" />
                )}
                {timelineFilterType === 'range' && (
                  <div className="flex items-center gap-1.5">
                    <input type="date" value={timelineStartDate} onChange={e => setTimelineStartDate(e.target.value)}
                      className="text-[12px] font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-400" />
                    <span className="text-[11px] text-slate-400 font-medium">s/d</span>
                    <input type="date" value={timelineEndDate} onChange={e => setTimelineEndDate(e.target.value)}
                      className="text-[12px] font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-400" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className={activeTab === 'kanban' 
        ? "flex-1 flex flex-col overflow-hidden px-4 pb-4" 
        : "flex-1 overflow-y-auto custom-scrollbar p-5 bg-slate-50/30"
      }>
        {activeTab === 'team' ? (
        <>
        <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white">
          {projectTeam.length > 0 ? (
            projectTeam.map((member: any) => {
              const userTasks = workPlans.filter(
                (wp) => wp.userId === member.userId && wp.projectId === selectedProject.id && wp.planDate === filterDate
              );
              const hasTasks = userTasks.length > 0;
              return (
                <div
                  key={member.id}
                  className="flex flex-col p-3 border-b border-slate-200 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {member.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-900 mb-0.5 leading-none">
                          {member.user?.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {!hasTasks ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 tracking-wide">
                          <AlertCircle className="w-3 h-3" /> NO TASK
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 tracking-wide">
                          ACTIVE
                        </span>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedUserIdForTask(String(member.userId));
                          setIsAssignTaskModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100 transition-colors"
                      >
                        BERI TUGAS
                      </button>
                      
                      <button className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  {hasTasks && (
                    <div className="pl-11 pt-2 space-y-1">
                      {userTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex flex-col bg-white border border-slate-100 rounded p-2.5 gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-700">
                                {task.planNumber}
                              </span>
                              <span className="text-[11px] text-slate-600 line-clamp-1">
                                {task.activities}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 whitespace-nowrap">
                                {formatDate(task.planDate)}
                              </span>
                              <StatusBadge 
                                status={task.status} 
                                statusColor={{ ...getStatusColor(task.status), border: getStatusColor(task.status).border === 'border-slate-200' ? 'border-slate-300' : getStatusColor(task.status).border }} 
                              />
                            </div>
                          </div>
                          {task.feedback && (
                            <div className="p-2 bg-amber-50 rounded border border-amber-100 flex items-start gap-1.5 mt-1">
                              <ClipboardList className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-amber-800 leading-snug">"{task.feedback}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-slate-500 bg-white">
              <Users className="w-8 h-8 text-slate-300 mb-3" />
              <p className="text-[12px] font-medium">Belum ada personel yang dialokasikan ke tim ini.</p>
            </div>
          )}
        </div>

        <div className="mt-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-400 shrink-0" />
          <p className="text-[11px] text-slate-600">
            Hak akses Rencana Kerja (EAR) diberikan ke personel untuk proyek ini.
          </p>
        </div>
        </>
        ) : activeTab === 'kanban' ? (
          <KanbanBoard 
            projectId={selectedProject.id} 
            filterType={timelineFilterType}
            filterValue={timelineFilterValue}
            filterStart={timelineStartDate}
            filterEnd={timelineEndDate}
          />
        ) : (
          <div className="relative py-6 px-1 overflow-x-hidden max-w-full">
             <div className="mb-6 px-2 flex items-center gap-1.5 text-[13px] text-slate-500 font-medium border-b border-slate-200 pb-3">
               <Activity className="w-4 h-4 text-slate-400" />
               {timelineFilterText}
             </div>
             
             <div className="w-full flex flex-col">
               {(() => {
                 const ITEMS_PER_ROW = 8;
                 const rows = [];
                 for (let i = 0; i < timelineEvents.length; i += ITEMS_PER_ROW) {
                   rows.push(timelineEvents.slice(i, i + ITEMS_PER_ROW));
                 }
                 
                 if (rows.length === 0) {
                   return (
                     <div className="py-12 flex flex-col items-center justify-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                       <Activity className="w-8 h-8 text-slate-300 mb-3" />
                       <p className="text-[12px] font-medium">Belum ada aktivitas di proyek ini.</p>
                     </div>
                   );
                 }
                 
                 return rows.map((row, rowIndex) => {
                   const isEven = rowIndex % 2 === 0;
                   return (
                     <div key={rowIndex} className={`flex w-full relative ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                       {row.map((event, colIndex) => {
                         const isFirstInRow = colIndex === 0;
                         const isLastInRow = colIndex === row.length - 1;
                         const isLastRow = rowIndex === rows.length - 1;
                         
                         return (
                           <div key={event.id} className="relative flex-1 flex flex-col items-center group mb-8">
                             {/* Garis Horizontal ke node berikutnya */}
                             {!isLastInRow && (
                               <div className={`absolute top-[7px] w-full h-[2px] bg-slate-200 z-0 ${isEven ? 'left-[50%]' : 'right-[50%]'}`}></div>
                             )}
                             
                             {/* Garis vertikal ke row bawah (ditaruh di belakang kotak) */}
                             {isLastInRow && !isLastRow && (
                               <div className="absolute top-[7px] left-[50%] -translate-x-[1px] w-[2px] h-[calc(100%+2rem)] bg-slate-200 z-0"></div>
                             )}
                             
                             {/* Titik (Dot) */}
                             <div className="relative z-10 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ring-1 ring-slate-100 bg-white mb-3 transition-transform group-hover:scale-110">
                               <div className="w-full h-full rounded-full bg-emerald-500" />
                             </div>
                             
                             {/* Card Konten */}
                             <div 
                               onClick={() => setSelectedTimelineEvent(event)}
                               className="relative z-10 w-[94%] bg-white border border-slate-200 p-2 rounded-lg shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all text-left flex flex-col h-full overflow-hidden"
                             >
                               <div className="flex flex-col gap-1 mb-1.5">
                                 <div className="flex justify-between items-center">
                                   <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 bg-emerald-50 text-emerald-600">
                                     REALISASI
                                   </span>
                                   <p className="text-[9px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded whitespace-nowrap">{formatDate(event.date)}</p>
                                 </div>
                               </div>
                               <p className="text-[11px] font-bold text-slate-800 mb-1 line-clamp-1 leading-tight">{event.title.split(': ')[1]}</p>
                               <p className="text-[10px] text-slate-600 mb-1 line-clamp-2 leading-relaxed flex-1">{event.description}</p>
                               
                               {event.relatedPlan && (
                                 <div className="bg-slate-50/80 rounded border border-slate-100 p-1.5 mb-1.5 mt-0.5 shadow-sm">
                                   <p className="text-[6px] font-bold text-indigo-500 uppercase mb-0.5">Rencana: {event.relatedPlan.planNumber}</p>
                                   <p className="text-[7.5px] text-slate-500 line-clamp-2 leading-tight">{event.relatedPlan.activities}</p>
                                 </div>
                               )}
                               
                               <div className="flex items-center gap-1 pt-1 border-t border-slate-100 mt-auto">
                                 <div className="w-3.5 h-3.5 rounded-full bg-slate-100 flex items-center justify-center text-[6px] font-bold text-slate-600 shrink-0">
                                   {event.user?.name?.charAt(0)}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                   <p className="text-[7px] text-slate-600 font-medium truncate">{event.user?.name}</p>
                                   {event.type === 'realization' && (
                                     <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(event as any).progress}%` }}></div>
                                     </div>
                                   )}
                                 </div>
                               </div>
                             </div>
                           </div>
                         );
                       })}
                       
                       {/* Spacer untuk baris yang tidak penuh */}
                       {row.length < ITEMS_PER_ROW && Array.from({ length: ITEMS_PER_ROW - row.length }).map((_, i) => (
                         <div key={`spacer-${i}`} className="flex-1"></div>
                       ))}
                     </div>
                   );
                 });
               })()}
             </div>
          </div>
        )}
      </div>

      {/* Modal Beri Tugas */}
      <Modal
        isOpen={isAssignTaskModalOpen}
        onClose={() => {
          setIsAssignTaskModalOpen(false);
          setSelectedUserIdForTask("");
        }}
        title="Berikan Tugas (EAR) ke Personel"
        size="md"
      >
        <form onSubmit={handleAssignTask} className="space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-3">
            <Target className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-indigo-900">{selectedProject.name}</p>
              <p className="text-[11px] text-indigo-600/80">Penugasan ini akan otomatis masuk ke antrean Rencana Kerja karyawan.</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Karyawan Ditugaskan <span className="text-red-500">*</span></label>
            <select 
              name="userId" 
              required 
              value={selectedUserIdForTask}
              onChange={(e) => setSelectedUserIdForTask(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
            >
              <option value="">Pilih Anggota Tim...</option>
              {projectTeam.map((member: any) => (
                <option key={member.userId} value={member.userId}>{member.user?.name} - {member.role}</option>
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
            <button 
              type="button" 
              onClick={() => {
                setIsAssignTaskModalOpen(false);
                setSelectedUserIdForTask("");
              }} 
              className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
            >
              Batal
            </button>
            <button type="submit" className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm">
              Berikan Tugas
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Timeline Event Modal */}
      <Modal
        isOpen={selectedTimelineEvent !== null}
        onClose={() => setSelectedTimelineEvent(null)}
        title="Detail Aktivitas"
        size="md"
      >
        {selectedTimelineEvent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-emerald-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{selectedTimelineEvent.title.split(': ')[1]}</h3>
                  <p className="text-xs font-medium text-slate-500">Realisasi Kerja</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  selectedTimelineEvent.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                  selectedTimelineEvent.status === 'rejected' ? 'bg-red-50 text-red-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {selectedTimelineEvent.status}
                </span>
                <p className="text-xs font-semibold text-slate-400 mt-1">{formatDate(selectedTimelineEvent.date)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Realisasi</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[13px] text-slate-700 leading-relaxed">{selectedTimelineEvent.description}</p>
              </div>
            </div>

            {selectedTimelineEvent.relatedPlan && (
              <div>
                <p className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider mb-2">Berdasarkan Rencana Kerja</p>
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <p className="text-[12px] font-bold text-indigo-900 mb-1">{selectedTimelineEvent.relatedPlan.planNumber}</p>
                  <p className="text-[13px] text-indigo-800/80 leading-relaxed">{selectedTimelineEvent.relatedPlan.activities}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                   {selectedTimelineEvent.user?.name?.charAt(0)}
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-700">{selectedTimelineEvent.user?.name}</p>
                   <p className="text-[10px] text-slate-500">{selectedTimelineEvent.user?.role}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-semibold text-slate-500 mb-1">Velocity Progress</p>
                 <div className="flex items-center gap-2">
                   <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedTimelineEvent.progress}%` }}></div>
                   </div>
                   <span className="text-xs font-bold text-emerald-600">{selectedTimelineEvent.progress}%</span>
                 </div>
               </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedTimelineEvent(null)} className="px-5 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors shadow-sm">
                Tutup Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
