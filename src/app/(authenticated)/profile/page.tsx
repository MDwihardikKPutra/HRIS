"use client";

import { useSession } from "next-auth/react";
import { users, getUserById, leaveRequests, workRealizations, projects } from "@/lib/data";
import { Mail, Phone, MapPin, Building, ShieldCheck, CalendarDays, CheckCircle2, FolderKanban, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import ProfileRadarChart from "./_components/ProfileRadarChart";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div className="p-8 text-center text-slate-500">Memuat profil...</div>;
  }

  const userId = session?.user?.id ? parseInt(session.user.id) : null;
  const user = users.find(u => u.id === userId) || users[0];

  const myLeaves = leaveRequests.filter(l => l.userId === user.id && l.status === "approved").length;
  const leaveQuota = 12;
  const myRealizations = workRealizations.filter(r => r.userId === user.id).length;
  const myProjects = projects.filter(p => p.managerId === user.id).length;

  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium text-slate-900">Profil & ID Digital</h1>
            <p className="text-[13px] text-slate-500 mt-1">Kelola informasi personal dan lihat kartu identitas Anda</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/30">
          <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Col: Digital ID Card */}
        <div className="xl:w-1/3 shrink-0 flex flex-col gap-4">
          {/* Glassmorphism ID Card */}
          <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-lg"
               style={{
                 background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
               }}
          >
            {/* Glow effects */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-indigo-300 opacity-20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full min-h-[360px] justify-between">
              {/* Header Card */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-medium tracking-wide text-xs text-white/90 uppercase">PGE HRIS</span>
                  </div>
                  <p className="text-xs text-indigo-100">Digital Identity Card</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-indigo-100 mb-0.5">EMP. ID</p>
                  <p className="font-mono text-sm font-medium">{user.employeeId}</p>
                </div>
              </div>

              {/* Avatar & Name */}
              <div className="flex flex-col items-center justify-center my-8 text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl font-medium shadow-sm mb-4">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-xl font-medium mb-1">{user.name}</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[13px] border border-white/20">
                  <Building className="w-3.5 h-3.5" /> {user.department}
                </div>
              </div>

              {/* Footer Card */}
              <div className="flex justify-between items-end border-t border-white/20 pt-4">
                <div>
                  <p className="text-xs text-indigo-100 mb-1">Posisi</p>
                  <p className="text-sm font-medium">{user.position}</p>
                </div>
                {/* Mock QR Code space */}
                <div className="w-10 h-10 bg-white/90 rounded flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 border border-slate-900 border-dashed rounded-[2px] grid grid-cols-2 gap-0.5 p-0.5 opacity-80">
                    <div className="bg-slate-800 rounded-sm"></div>
                    <div className="bg-slate-800 rounded-sm"></div>
                    <div className="bg-slate-800 rounded-sm"></div>
                    <div className="bg-transparent rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-medium text-[13px] transition-colors border border-red-100"
          >
            <LogOut className="w-4 h-4" /> Keluar dari Sistem
          </button>
        </div>

        {/* Right Col: Details & Stats */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Sisa Cuti</p>
                <p className="text-lg font-medium text-slate-900 leading-none">{leaveQuota - myLeaves} <span className="text-[13px] text-slate-500 font-normal">Hari</span></p>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Tugas Selesai</p>
                <p className="text-lg font-medium text-slate-900 leading-none">{myRealizations} <span className="text-[13px] text-slate-500 font-normal">Tugas</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Proyek Aktif</p>
                <p className="text-lg font-medium text-slate-900 leading-none">{myProjects} <span className="text-[13px] text-slate-500 font-normal">Proyek</span></p>
              </div>
            </div>
          </div>

          {/* Personal Information & Analytics */}
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Personal Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex-1">
            <h2 className="text-sm font-medium text-slate-900 mb-5 flex items-center gap-2">
              <InfoIcon className="w-4 h-4 text-slate-400" /> Informasi Personal
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Email Pribadi</label>
                  <div className="flex items-center gap-2 text-slate-700 bg-white px-3 py-2 rounded-md border border-slate-200">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-[13px]">{user.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Nomor Telepon</label>
                  <div className="flex items-center gap-2 text-slate-700 bg-white px-3 py-2 rounded-md border border-slate-200">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-[13px]">+62 812-3456-7890</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Alamat Tempat Tinggal</label>
                <div className="flex items-start gap-2 text-slate-700 bg-white px-3 py-2.5 rounded-md border border-slate-200">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[13px] leading-relaxed">Jl. Jend. Sudirman No. 45, Kav. 21<br/>Jakarta Selatan, DKI Jakarta 12190</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t border-slate-100">
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Hak Akses Sistem</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs border border-slate-200 capitalize">{user.role}</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs border border-slate-200">Karyawan Internal</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Status Karyawan</label>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-slate-700 rounded-md text-xs border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif Bekerja
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </div>
            
            {/* Analytics Radar Chart */}
            <div className="xl:w-[45%] shrink-0">
              <ProfileRadarChart userId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
