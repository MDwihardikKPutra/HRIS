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
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Table Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Card Header */}
        <div className="border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium text-slate-900">Manajemen Personel</h1>
            <p className="text-[13px] text-slate-500 mt-1">Konfigurasi hak akses modul, detail kontrak, dan direktori karyawan</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[13px] rounded-md transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tambah Karyawan
            </button>
          </div>
        </div>

        {/* Symmetrical Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-b border-slate-200 shrink-0">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">{s.label}</span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-medium text-slate-900 leading-none">{s.value}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Unified Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-200 shrink-0">
          <h2 className="text-[13px] font-medium text-slate-900">Direktori Personel</h2>
          
          {/* Search Box */}
          <div className="relative group w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari karyawan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Table Viewport */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 text-xs font-medium text-slate-500">
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="px-4 py-3 font-medium">Karyawan (NIK)</th>
                <th className="px-4 py-3 font-medium">Penempatan</th>
                <th className="px-4 py-3 font-medium text-center">Hubungan Kerja</th>
                <th className="px-4 py-3 font-medium">Masa Kontrak</th>
                <th className="px-4 py-3 font-medium text-center">Role</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Karyawan (Name, Email, NIK) */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AvatarInitial name={u.name} />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-slate-900">{u.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {u.employeeId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Penempatan */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 mb-0.5">{u.position}</p>
                    <p className="text-xs text-slate-500">{u.department}</p>
                  </td>

                  {/* Hubungan Kerja */}
                  <td className="px-4 py-3 text-center">
                    <span className={`font-medium ${
                      u.statusKontrak === 'Tetap (PKWTT)' 
                        ? 'text-blue-600' 
                        : u.statusKontrak === 'Magang (Intern)'
                          ? 'text-amber-600'
                          : 'text-indigo-600'
                    }`}>
                      {u.statusKontrak || "Kontrak (PKWT)"}
                    </span>
                  </td>

                  {/* Masa Kontrak */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 mb-0.5">
                      {formatDisplayDate(u.joinDate)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        s/d {u.endDate === "-" ? "Permanen" : formatDisplayDate(u.endDate)}
                      </span>
                      <span className="text-[10px] text-slate-400">({u.durationStr})</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium text-slate-700 capitalize">
                      {ROLE_LABELS[u.role as UserRole] || u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleUserActiveStatus(u.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                        u.isActive ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {u.isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setProfileDetailUser(u)}
                        title="Lihat Detail Profil"
                        className="text-slate-400 hover:text-slate-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openManageModal(u)}
                        title="Kelola Role"
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
            onClick={() => setProfileDetailUser(null)} 
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden flex flex-col shadow-xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[15px] font-medium text-slate-900">Detail Profil Karyawan</h3>
              <button 
                onClick={() => setProfileDetailUser(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Layout */}
            <div className="flex flex-col sm:flex-row h-full max-h-[70vh] overflow-auto">
              {/* Left Side (Avatar Area) */}
              <div className="w-full sm:w-[220px] shrink-0 bg-slate-50 p-6 flex flex-col items-center sm:border-r border-slate-200">
                <div className="w-32 h-40 border border-slate-200 bg-white flex flex-col items-center justify-center mb-4 rounded-md">
                  <UserCheck className="w-8 h-8 text-slate-300 mb-2" />
                  <span className="text-[11px] text-slate-400 font-mono">3 × 4</span>
                </div>
              </div>

              {/* Right Side (Details) */}
              <div className="flex-1 p-6 flex flex-col space-y-6">
                {/* Name & Basic Info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-medium text-slate-900">{profileDetailUser.name}</h2>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${profileDetailUser.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {profileDetailUser.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-500">{profileDetailUser.employeeId} • {profileDetailUser.email}</p>
                </div>

                {/* Grid 1: Penempatan */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Departemen</p>
                    <p className="text-[13px] font-medium text-slate-900">{profileDetailUser.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Jabatan</p>
                    <p className="text-[13px] font-medium text-slate-900">{profileDetailUser.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Role Sistem</p>
                    <p className="text-[13px] font-medium text-slate-900 capitalize">{ROLE_LABELS[profileDetailUser.role as UserRole] || profileDetailUser.role}</p>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100" />

                {/* Grid 2: Kontrak */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Hubungan Kerja</p>
                    <p className="text-[13px] font-medium text-slate-900">{profileDetailUser.statusKontrak}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tipe Karyawan</p>
                    <p className="text-[13px] font-medium text-slate-900">{profileDetailUser.tipeKaryawan}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Mulai Kerja</p>
                    <p className="text-[13px] font-medium text-slate-900">{formatDisplayDate(profileDetailUser.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Akhir Kontrak</p>
                    <p className="text-[13px] font-medium text-slate-900">{profileDetailUser.endDate === "-" ? "Permanen" : formatDisplayDate(profileDetailUser.endDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between mt-auto shrink-0">
              <button 
                onClick={() => {
                  toggleUserActiveStatus(profileDetailUser.id);
                  setProfileDetailUser(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
                }} 
                className={`text-[13px] font-medium transition-colors ${
                  profileDetailUser.isActive ? "text-red-600 hover:text-red-700" : "text-emerald-600 hover:text-emerald-700"
                }`}
              >
                {profileDetailUser.isActive ? "Nonaktifkan Karyawan" : "Aktifkan Karyawan"}
              </button>
              <button 
                onClick={() => setProfileDetailUser(null)} 
                className="px-4 py-2 bg-slate-900 text-white rounded-md text-[13px] font-medium hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MANAGE MODULE MODAL ===== */}
      {managingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setManagingUser(null)} />
          <div className="relative bg-white rounded-xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <AvatarInitial name={managingUser.name} />
                <div>
                  <p className="font-medium text-slate-900 text-[15px]">{managingUser.name}</p>
                  <p className="text-xs text-slate-500">{managingUser.position}</p>
                </div>
              </div>
              <button onClick={() => setManagingUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-[13px] font-medium text-slate-900">Pengaturan Role Sistem</p>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleDraftRoleChange(r)}
                    className={`flex items-center justify-between p-3 rounded-md border transition-all text-left ${
                      draftRole === r ? "bg-indigo-50 border-indigo-500" : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <p className={`text-[13px] font-medium capitalize ${draftRole === r ? "text-indigo-900" : "text-slate-900"}`}>
                        {ROLE_LABELS[r]}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {r === "admin" && "Akses penuh semua fitur."}
                        {r === "hr" && "Kelola karyawan & EAR."}
                        {r === "finance" && "Proses keuangan & SPD."}
                        {r === "karyawan" && "Akses modul mandiri."}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      draftRole === r ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                    }`}>
                      {draftRole === r && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 pt-2">
              <button
                onClick={() => setManagingUser(null)}
                className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveRole}
                className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                Simpan
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
          <div className="flex justify-end gap-3 w-full">
            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Batal</button>
            <button onClick={handleAddUser} className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">Simpan Personel</button>
          </div>
        }
      >
        <div className="space-y-4 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="Masukkan nama..." 
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">Email Pekerjaan</label>
              <input 
                type="email" 
                placeholder="email@perusahaan.com" 
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">NIK (Nomor Induk Karyawan)</label>
              <input 
                type="text" 
                placeholder="EMP000" 
                value={newUserEmpId}
                onChange={(e) => setNewUserEmpId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors uppercase" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">Jabatan</label>
              <input 
                type="text" 
                placeholder="Engineer, Staff, dll" 
                value={newUserPosition}
                onChange={(e) => setNewUserPosition(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">Departemen</label>
              <select 
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
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
              <label className="text-[13px] font-medium text-slate-700">Hubungan Kerja</label>
              <select 
                value={newUserStatusKontrak}
                onChange={(e) => setNewUserStatusKontrak(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Kontrak (PKWT)">Kontrak (PKWT)</option>
                <option value="Tetap (PKWTT)">Tetap (PKWTT)</option>
                <option value="Magang (Intern)">Magang (Intern)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">Tipe Pekerjaan</label>
              <select 
                value={newUserTipe}
                onChange={(e) => setNewUserTipe(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Magang">Magang</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">Tanggal Bergabung</label>
              <input 
                type="date" 
                value={newUserJoinDate}
                onChange={(e) => setNewUserJoinDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
            {newUserStatusKontrak !== "Tetap (PKWTT)" && (
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700">Akhir Kontrak</label>
                <input 
                  type="date" 
                  value={newUserEndDate}
                  onChange={(e) => setNewUserEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-indigo-500 transition-colors" 
                />
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 mt-4">
            <label className="text-[13px] font-medium text-slate-700">Role Sistem</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleNewUserRoleChange(r)}
                  className={`flex flex-col items-start gap-2 p-3 rounded-md border transition-all ${
                    newUserRole === r ? "bg-indigo-50 border-indigo-500" : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${newUserRole === r ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {r === "admin" || r === "hr" ? <Shield className="w-4 h-4" /> : <UsersIcon className="w-4 h-4" />}
                  </div>
                  <div className="text-left w-full">
                    <p className={`text-[13px] font-medium capitalize ${newUserRole === r ? "text-indigo-900" : "text-slate-900"}`}>{ROLE_LABELS[r]}</p>
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