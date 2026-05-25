"use client";

import { useState, useMemo } from "react";
import { users as initialUsers, ROLE_LABELS, UserRole } from "@/lib/data";
import Modal from "@/components/Modal";
import {
  Users as UsersIcon, UserCheck, ShieldCheck,
  Search, Plus, Shield,
  Settings2, X, Eye, Calendar, Award, FileText, AlertCircle
} from "lucide-react";
import { AvatarInitial } from "@/components/DataTable";

// Deep copy to allow in-memory mutations
type UserState = typeof initialUsers[0] & {
  joinDate?: string;
  endDate?: string;
  statusKontrak?: string;
  tipeKaryawan?: string;
  durationStr?: string;
};

export default function UsersPage() {
  // In-memory user list (resets on refresh — demo only)
  const [userList, setUserList] = useState<UserState[]>(() => 
    initialUsers.map((u) => {
      // Semi-deterministic contract detail based on user role and id
      let statusKontrak = "Kontrak (PKWT)";
      let tipeKaryawan = "Full-Time";
      let joinDate = "2024-01-15";
      let endDate = "2026-12-31";
      
      if (u.role === "admin" || u.role === "hr" || u.id === 3 || u.id === 14) {
        statusKontrak = "Tetap (PKWTT)";
        endDate = "-";
        joinDate = "2022-03-01";
      } else if (u.id === 7 || u.id === 11) {
        statusKontrak = "Magang (Intern)";
        tipeKaryawan = "Magang";
        endDate = "2026-08-31";
        joinDate = "2026-03-01";
      } else if (u.id % 2 === 0) {
        joinDate = "2023-06-01";
        endDate = "2026-06-01";
      } else {
        joinDate = "2025-02-15";
        endDate = "2027-02-15";
      }
      
      let durationStr = "";
      if (statusKontrak === "Tetap (PKWTT)") {
        durationStr = "Permanen";
      } else {
        const s = new Date(joinDate);
        const e = new Date(endDate);
        const diffMonths = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
        durationStr = `${diffMonths} Bulan`;
      }

      return {
        ...u,
        joinDate,
        endDate,
        statusKontrak,
        tipeKaryawan,
        durationStr
      };
    })
  );

  // ---- Add User Modal ----
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPosition, setNewUserPosition] = useState("");
  const [newUserDept, setNewUserDept] = useState("Engineering");
  const [newUserRole, setNewUserRole] = useState<UserRole>("karyawan");
  const [newUserEmpId, setNewUserEmpId] = useState("");
  const [newUserJoinDate, setNewUserJoinDate] = useState("2026-05-25");
  const [newUserEndDate, setNewUserEndDate] = useState("2027-05-25");
  const [newUserStatusKontrak, setNewUserStatusKontrak] = useState("Kontrak (PKWT)");
  const [newUserTipe, setNewUserTipe] = useState("Full-Time");

  // ---- Manage Role Modal ----
  const [managingUser, setManagingUser] = useState<UserState | null>(null);
  const [draftRole, setDraftRole] = useState<UserRole>("karyawan");

  // ---- Detail Profil Karyawan Modal ----
  const [profileDetailUser, setProfileDetailUser] = useState<UserState | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Karyawan", value: userList.length, icon: UsersIcon, color: "text-slate-600", bg: "bg-slate-50" },
    { label: "Status Aktif", value: userList.filter(u => u.isActive).length, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Magang / Kontrak", value: userList.filter(u => u.statusKontrak !== "Tetap (PKWTT)").length, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const filteredUsers = useMemo(() => {
    return userList.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.statusKontrak && u.statusKontrak.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, userList]);

  // ---------- Add User Handlers ----------
  const handleNewUserRoleChange = (role: string) => {
    setNewUserRole(role as UserRole);
  };

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail || !newUserEmpId) {
      alert("Mohon isi Nama, Email, dan NIK!");
      return;
    }

    const calculatedEndDate = newUserStatusKontrak === "Tetap (PKWTT)" ? "-" : newUserEndDate;
    let durationStr = "Permanen";
    if (calculatedEndDate !== "-") {
      const s = new Date(newUserJoinDate);
      const e = new Date(calculatedEndDate);
      const diffMonths = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
      durationStr = `${diffMonths} Bulan`;
    }

    const newUserObj: UserState = {
      id: userList.length + 1,
      name: newUserName,
      email: newUserEmail,
      password: "password",
      role: newUserRole,
      employeeId: newUserEmpId.toUpperCase(),
      department: newUserDept,
      position: newUserPosition,
      isActive: true,
      joinDate: newUserJoinDate,
      endDate: calculatedEndDate,
      statusKontrak: newUserStatusKontrak,
      tipeKaryawan: newUserTipe,
      durationStr
    };

    setUserList(prev => [...prev, newUserObj]);
    
    // Reset form
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPosition("");
    setNewUserDept("Engineering");
    setNewUserRole("karyawan");
    setNewUserEmpId("");
    setNewUserJoinDate("2026-05-25");
    setNewUserEndDate("2027-05-25");
    setNewUserStatusKontrak("Kontrak (PKWT)");
    setNewUserTipe("Full-Time");
    
    setIsAddModalOpen(false);
  };

  const toggleUserActiveStatus = (id: number) => {
    setUserList(prev =>
      prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u)
    );
  };

  // ---------- Manage Role Handlers ----------
  const openManageModal = (user: UserState) => {
    setManagingUser(user);
    setDraftRole(user.role as UserRole);
  };

  const handleDraftRoleChange = (role: string) => {
    setDraftRole(role as UserRole);
  };

  const saveRole = () => {
    if (!managingUser) return;
    setUserList(prev =>
      prev.map(u => u.id === managingUser.id ? { ...u, role: draftRole } : u)
    );
    setManagingUser(null);
  };

  const formatDisplayDate = (dStr?: string) => {
    if (!dStr || dStr === "-") return "-";
    return new Date(dStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full animate-in fade-in duration-500">
      {/* Unified Table Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white border border-slate-100/80 rounded-2xl flex flex-col overflow-hidden shadow-xs">
        
        {/* Top Card Header */}
        <div className="border-b border-slate-100 p-4 bg-white shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Manajemen Personel</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">Konfigurasi hak akses modul, detail kontrak, dan direktori karyawan</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-95 border border-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Karyawan
            </button>
          </div>
        </div>

        {/* Symmetrical Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/30 border-b border-slate-100 shrink-0">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="py-3 px-5 flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/40 ${s.bg} ${s.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider leading-none mb-1">{s.label}</span>
                  <h3 className="text-sm font-black text-slate-800 leading-none">{s.value}</h3>
                  <p className="text-[9px] text-slate-400 font-medium mt-1 leading-none">Status dalam sistem</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-50 bg-white shrink-0">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Direktori Personel</h2>
          
          {/* Search Box */}
          <div className="relative group w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Cari nama, NIK, kontrak, atau departemen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50/40 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Table Viewport */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 tracking-wide text-[10px] sticky top-0 z-10">
                <th className="text-left py-3 px-4 font-bold">Karyawan (NIK)</th>
                <th className="text-left py-3 px-4 font-bold">Penempatan</th>
                <th className="text-center py-3 px-4 font-bold">Hubungan Kerja</th>
                <th className="text-left py-3 px-4 font-bold">Masa Kontrak</th>
                <th className="text-center py-3 px-4 font-bold">Role</th>
                <th className="text-center py-3 px-4 font-bold">Status</th>
                <th className="text-right py-3 px-4 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 group">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                  {/* Karyawan (Name, Email, NIK) */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <AvatarInitial name={u.name} />
                      <div>
                        <p className="font-bold text-slate-800 leading-none mb-1 text-[11px] flex items-center gap-1.5">
                          {u.name}
                          <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100/50 px-1 py-0.2 rounded-md font-mono uppercase">
                            {u.employeeId}
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Penempatan */}
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-700 leading-none mb-1 text-[11px]">{u.position}</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">{u.department}</p>
                  </td>

                  {/* Hubungan Kerja */}
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border tracking-wide uppercase ${
                      u.statusKontrak === 'Tetap (PKWTT)' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : u.statusKontrak === 'Magang (Intern)'
                          ? 'bg-amber-50 text-amber-700 border-amber-200/55'
                          : 'bg-indigo-50 text-indigo-750 border-indigo-100'
                    }`}>
                      {u.statusKontrak || "Kontrak (PKWT)"}
                    </span>
                  </td>

                  {/* Masa Kontrak */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="min-w-[125px]">
                        <p className="font-bold text-slate-700 leading-none mb-1 text-[10px]">
                          {formatDisplayDate(u.joinDate)}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold">
                          s/d {u.endDate === "-" ? "Permanen" : formatDisplayDate(u.endDate)}
                        </p>
                      </div>
                      <span className={`inline-flex px-1.5 py-0.2 rounded text-[9px] font-black border ${
                        u.durationStr === 'Permanen' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {u.durationStr}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border capitalize tracking-wide ${
                      u.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {u.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                      {ROLE_LABELS[u.role as UserRole] || u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleUserActiveStatus(u.id)}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border tracking-wide cursor-pointer transition-all active:scale-90 ${
                        u.isActive ? 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50' : 'text-slate-400 bg-slate-50 border-slate-100 hover:bg-slate-100/50'
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {u.isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setProfileDetailUser(u)}
                        title="Lihat Detail Profil"
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-lg inline-flex"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openManageModal(u)}
                        title="Kelola Role"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg inline-flex"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== DETAIL PROFIL KARYAWAN MODAL ===== */}
      {profileDetailUser && (
        <Modal
          isOpen={!!profileDetailUser}
          onClose={() => setProfileDetailUser(null)}
          title="Profil Detil Karyawan"
          size="lg"
          footer={
            <>
              <button 
                onClick={() => {
                  toggleUserActiveStatus(profileDetailUser.id);
                  setProfileDetailUser(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
                }} 
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors border ${
                  profileDetailUser.isActive 
                    ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                {profileDetailUser.isActive ? "Nonaktifkan Karyawan" : "Aktifkan Karyawan"}
              </button>
              <button 
                onClick={() => setProfileDetailUser(null)} 
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
            </>
          }
        >
          <div className="space-y-6 text-slate-800">
            {/* Header Profil */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <AvatarInitial name={profileDetailUser.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-800 leading-tight">{profileDetailUser.name}</h3>
                  <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono uppercase tracking-wide">
                    NIK: {profileDetailUser.employeeId}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold mt-1 tracking-tight">{profileDetailUser.email}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`w-2 h-2 rounded-full ${profileDetailUser.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="text-[10px] font-bold text-slate-500">Status Akun: {profileDetailUser.isActive ? "Aktif" : "Nonaktif"}</span>
                </div>
              </div>
            </div>

            {/* Grid Detail Pekerjaan & Kontrak */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Informasi Penempatan */}
              <div className="bg-white border border-slate-100 p-4 rounded-2xl space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-500" /> Informasi Penempatan
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Departemen</span>
                    <span className="font-bold text-slate-700">{profileDetailUser.department}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Jabatan</span>
                    <span className="font-bold text-slate-700">{profileDetailUser.position}</span>
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Role Otorisasi Sistem</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100 mt-1 capitalize font-semibold">
                      <Shield className="w-3 h-3 text-slate-400" />
                      {ROLE_LABELS[profileDetailUser.role as UserRole] || profileDetailUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 2: Rincian Hubungan Kerja & Kontrak */}
              <div className="bg-white border border-slate-100 p-4 rounded-2xl space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-500" /> Hubungan & Masa Kontrak
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Hubungan Kerja</span>
                    <span className="inline-flex px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-100 rounded font-bold mt-0.5">
                      {profileDetailUser.statusKontrak}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Tipe Karyawan</span>
                    <span className="font-bold text-slate-700">{profileDetailUser.tipeKaryawan}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Mulai Kerja</span>
                    <span className="font-bold text-slate-700">{formatDisplayDate(profileDetailUser.joinDate)}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Akhir Kontrak</span>
                    <span className="font-bold text-slate-700">{profileDetailUser.endDate === "-" ? "Permanen" : formatDisplayDate(profileDetailUser.endDate)}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-50 mt-1 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Masa Kontrak Kerja</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100/50 rounded font-black">
                      {profileDetailUser.durationStr}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Kebijakan HR */}
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-xs text-slate-500 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-700 mb-0.5">Informasi & Kepatuhan Kontrak Karyawan</p>
                <p>Data durasi kontrak ini digunakan untuk pelaporan audit kepatuhan ketenagakerjaan dan master penggajian. Tanggal pengakhiran kontrak PKWT harus diperbarui sekurang-kurangnya 30 hari sebelum berakhir.</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ===== MANAGE MODULE MODAL ===== */}
      {managingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setManagingUser(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {managingUser.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{managingUser.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{managingUser.position} · {managingUser.department}</p>
                </div>
              </div>
              <button onClick={() => setManagingUser(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" /> Pengaturan Role Sistem
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleDraftRoleChange(r)}
                      className={`flex flex-col items-start gap-1 p-4 rounded-xl border transition-all text-left ${
                        draftRole === r ? "bg-indigo-50/60 border-indigo-500 ring-4 ring-indigo-50" : "bg-white border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <p className={`text-sm font-bold capitalize ${draftRole === r ? "text-indigo-700" : "text-slate-700"}`}>
                          {ROLE_LABELS[r]}
                        </p>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          draftRole === r ? "border-indigo-600 bg-indigo-600" : "border-slate-200 bg-white"
                        }`}>
                          {draftRole === r && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {r === "admin" && "Akses penuh ke semua fitur, modul operasional, dan manajemen data referensi."}
                        {r === "hr" && "Dapat mengelola data karyawan, menyetujui cuti, dan melihat laporan performa (EAR)."}
                        {r === "finance" && "Dapat melihat dan memproses persetujuan transaksi keuangan, SPD, serta pembelian."}
                        {r === "karyawan" && "Akses terbatas ke modul operasional mandiri seperti pengajuan cuti, pekerjaan, dan SPD."}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/50 border-t border-slate-100">
              <button
                onClick={() => setManagingUser(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveRole}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                Simpan Perubahan Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD USER MODAL ===== */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Karyawan Baru"
        size="lg"
        footer={
          <>
            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-slate-550 hover:text-slate-950 transition-colors">Batal</button>
            <button onClick={handleAddUser} className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all">Simpan Personel</button>
          </>
        }
      >
        <div className="space-y-5 text-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="Masukkan nama..." 
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">Email Pekerjaan</label>
              <input 
                type="email" 
                placeholder="email@perusahaan.com" 
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">NIK (Nomor Induk Karyawan)</label>
              <input 
                type="text" 
                placeholder="EMP000" 
                value={newUserEmpId}
                onChange={(e) => setNewUserEmpId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium font-mono uppercase" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">Jabatan</label>
              <input 
                type="text" 
                placeholder="Engineer, Staff, dll" 
                value={newUserPosition}
                onChange={(e) => setNewUserPosition(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">Departemen</label>
              <select 
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium appearance-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resource">Human Resource</option>
                <option value="Finance">Finance</option>
                <option value="Procurement">Procurement</option>
                <option value="IT">IT</option>
                <option value="Project Management">Project Management</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">Hubungan Kerja</label>
              <select 
                value={newUserStatusKontrak}
                onChange={(e) => setNewUserStatusKontrak(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium appearance-none"
              >
                <option value="Kontrak (PKWT)">Kontrak (PKWT)</option>
                <option value="Tetap (PKWTT)">Tetap (PKWTT)</option>
                <option value="Magang (Intern)">Magang (Intern)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">Tipe Pekerjaan</label>
              <select 
                value={newUserTipe}
                onChange={(e) => setNewUserTipe(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium appearance-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Magang">Magang</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">Tanggal Bergabung</label>
              <input 
                type="date" 
                value={newUserJoinDate}
                onChange={(e) => setNewUserJoinDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium" 
              />
            </div>
            {newUserStatusKontrak !== "Tetap (PKWTT)" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 tracking-wide">Akhir Kontrak</label>
                <input 
                  type="date" 
                  value={newUserEndDate}
                  onChange={(e) => setNewUserEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium animate-in slide-in-from-top-1 duration-150" 
                />
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 capitalize tracking-wide block border-t border-slate-100 pt-4">Role Sistem</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleNewUserRoleChange(r)}
                  className={`flex flex-col items-start gap-2 p-3 rounded-xl border transition-all ${
                    newUserRole === r ? "bg-white border-blue-500 ring-4 ring-blue-50" : "bg-slate-50 border-slate-100 opacity-70 hover:opacity-100 hover:bg-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${newUserRole === r ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                    {r === "admin" || r === "hr" ? <Shield className="w-4 h-4" /> : <UsersIcon className="w-4 h-4" />}
                  </div>
                  <div className="text-left w-full">
                    <p className="text-xs font-bold text-slate-800 capitalize">{ROLE_LABELS[r]}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}