"use client";

import { useState, useMemo } from "react";
import { users as initialUsers, SYSTEM_MODULES } from "@/lib/data";
import Modal from "@/components/Modal";
import { 
    Users as UsersIcon, UserCheck, ShieldCheck, 
    Search, Plus, Check, Shield, 
    Lock, Settings2, X, Package, LayoutGrid
} from "lucide-react";

// Deep copy to allow in-memory mutations
type UserState = typeof initialUsers[0] & { modules: string[] };

export default function UsersPage() {
  // In-memory user list (resets on refresh — demo only)
  const [userList, setUserList] = useState<UserState[]>(
    () => initialUsers.map(u => ({ ...u, modules: [...u.modules] }))
  );

  // ---- Add User Modal ----
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserRole, setNewUserRole] = useState("user");
  const [newUserModules, setNewUserModules] = useState<string[]>(
    SYSTEM_MODULES.filter(m => m.isDefault).map(m => m.key)
  );

  // ---- Manage Module Modal ----
  const [managingUser, setManagingUser] = useState<UserState | null>(null);
  const [draftModules, setDraftModules] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Karyawan", value: userList.length, icon: UsersIcon, color: "text-slate-600", bg: "bg-slate-50" },
    { label: "Status Aktif", value: userList.filter(u => u.isActive).length, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Administrator", value: userList.filter(u => u.role === "admin").length, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const filteredUsers = useMemo(() => {
    return userList.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, userList]);

  // ---------- Add User Handlers ----------
  const toggleNewUserModule = (key: string) => {
    if (newUserRole === "admin") return;
    setNewUserModules(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleNewUserRoleChange = (role: string) => {
    setNewUserRole(role);
    if (role === "admin") {
      setNewUserModules(SYSTEM_MODULES.map(m => m.key));
    } else {
      setNewUserModules(SYSTEM_MODULES.filter(m => m.isDefault).map(m => m.key));
    }
  };

  // ---------- Manage Module Handlers ----------
  const openManageModal = (user: UserState) => {
    setManagingUser(user);
    setDraftModules([...user.modules]);
  };

  const toggleDraftModule = (key: string) => {
    if (managingUser?.role === "admin") return;
    setDraftModules(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const saveModules = () => {
    if (!managingUser) return;
    setUserList(prev =>
      prev.map(u => u.id === managingUser.id ? { ...u, modules: [...draftModules] } : u)
    );
    setManagingUser(null);
  };

  // Group modules by category
  const modulesByCategory = useMemo(() => {
    const grouped: Record<string, typeof SYSTEM_MODULES> = {};
    SYSTEM_MODULES.forEach(m => {
      const cat = m.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(m);
    });
    return grouped;
  }, []);

  const categoryLabel: Record<string, string> = {
    modul: "Modul Operasional",
    administrasi: "Administrasi",
    "pusat-data": "Pusat Data",
  };

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Manajemen Personel</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Konfigurasi hak akses modul dan direktori karyawan</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Karyawan
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-slate-100 p-5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* User table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-2">
        <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-800">Direktori Personel</h2>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Cari nama, email, atau departemen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:border-indigo-300 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-widest text-[12px]">
                <th className="text-left py-3.5 px-6">ID / Karyawan</th>
                <th className="text-left py-3.5 px-4 hidden sm:table-cell">Jabatan & Departemen</th>
                <th className="text-left py-3.5 px-4 hidden md:table-cell">Modul Aktif</th>
                <th className="text-center py-3.5 px-4">Role</th>
                <th className="text-center py-3.5 px-4">Status</th>
                <th className="text-right py-3.5 px-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none mb-1">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <p className="font-bold text-slate-700 mb-0.5">{u.position}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{u.department}</p>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {u.role === "admin" ? (
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[12px] font-bold uppercase border border-indigo-100 tracking-tighter">FULL ACCESS</span>
                      ) : u.modules.length === 0 ? (
                        <span className="text-[10px] text-slate-400 font-bold italic">No Modules</span>
                      ) : (
                        u.modules.slice(0, 3).map(m => {
                          const mod = SYSTEM_MODULES.find(s => s.key === m);
                          return (
                            <span key={m} className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[12px] font-bold border border-slate-100 uppercase tracking-tighter">
                              {mod?.label || m}
                            </span>
                          );
                        })
                      )}
                      {u.role !== "admin" && u.modules.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[12px] font-bold border border-slate-200">
                          +{u.modules.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest ${
                      u.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {u.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[12px] font-bold border uppercase tracking-widest ${
                      u.isActive ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {u.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 transition-opacity">
                      <button 
                        onClick={() => openManageModal(u)}
                        title="Kelola Modul"
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg shadow-sm"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        title="Pengaturan User"
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-50 border border-slate-100 rounded-lg shadow-sm"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MANAGE MODULE MODAL ===== */}
      {managingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setManagingUser(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
              {managingUser.role === "admin" ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-indigo-600" />
                  </div>
                  <p className="font-bold text-slate-800">Administrator</p>
                  <p className="text-xs text-slate-400 max-w-[260px]">
                    Admin memiliki akses penuh ke semua modul sistem. Pengaturan modul tidak diperlukan.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-500" /> Izin Akses Modul
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">{draftModules.length} modul aktif</span>
                  </div>

                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-hide">
                    {Object.entries(modulesByCategory).map(([cat, mods]) => (
                      <div key={cat}>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                          {categoryLabel[cat] || cat}
                        </p>
                        <div className="space-y-1.5">
                          {mods.map(mod => {
                            const isSelected = draftModules.includes(mod.key);
                            return (
                              <button
                                key={mod.key}
                                onClick={() => toggleDraftModule(mod.key)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                                  isSelected
                                    ? "bg-indigo-50/60 border-indigo-200 shadow-sm"
                                    : "bg-white border-slate-100 hover:border-slate-200"
                                }`}
                              >
                                <div>
                                  <p className={`text-xs font-semibold ${isSelected ? "text-indigo-700" : "text-slate-600"}`}>
                                    {mod.label}
                                  </p>
                                  <p className="text-[12px] text-slate-400 font-medium mt-0.5 uppercase tracking-wide">
                                    {categoryLabel[mod.category] || mod.category}
                                  </p>
                                </div>
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                                  isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-200 bg-white"
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/50 border-t border-slate-100">
              <button
                onClick={() => setManagingUser(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Batal
              </button>
              {managingUser.role !== "admin" && (
                <button
                  onClick={saveModules}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  Simpan Perubahan
                </button>
              )}
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
            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Batal</button>
            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm">Simpan Personel</button>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Lengkap</label>
                <input type="text" placeholder="Masukkan nama..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Pekerjaan</label>
                <input type="email" placeholder="email@perusahaan.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Jabatan</label>
                <input type="text" placeholder="Engineer, Staff, dll" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Departemen</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all font-medium appearance-none">
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Procurement">Procurement</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Role Sistem</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleNewUserRoleChange("user")}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    newUserRole === "user" ? "bg-white border-indigo-500 ring-4 ring-indigo-50" : "bg-slate-50 border-slate-100 opacity-60"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${newUserRole === "user" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                    <UsersIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">User Biasa</p>
                    <p className="text-[10px] text-slate-400 font-medium">Akses operasional</p>
                  </div>
                </button>
                <button
                  onClick={() => handleNewUserRoleChange("admin")}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    newUserRole === "admin" ? "bg-white border-indigo-500 ring-4 ring-indigo-50" : "bg-slate-50 border-slate-100 opacity-60"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${newUserRole === "admin" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">Admin</p>
                    <p className="text-[10px] text-slate-400 font-medium">Akses penuh sistem</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Module panel for Add User */}
          <div className="lg:col-span-2 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-indigo-500" /> Izin Modul
              </h3>
              {newUserRole === "admin" && (
                <span className="text-[12px] font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded uppercase">All Access</span>
              )}
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-[260px] pr-1 scrollbar-hide flex-1">
              {SYSTEM_MODULES.map(mod => {
                const isSelected = newUserModules.includes(mod.key);
                const isDisabled = newUserRole === "admin";
                return (
                  <div 
                    key={mod.key}
                    onClick={() => toggleNewUserModule(mod.key)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    } ${isSelected ? "bg-white border-indigo-200 shadow-sm" : "bg-white/50 border-slate-100 hover:border-slate-200"}`}
                  >
                    <div>
                      <p className={`text-[12px] font-semibold ${isSelected ? "text-slate-800" : "text-slate-500"}`}>{mod.label}</p>
                      <p className="text-[12px] text-slate-400 font-medium uppercase tracking-tighter">
                        {categoryLabel[mod.category] || mod.category}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-200 bg-white"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic">
              * Centang modul yang ingin diaktifkan untuk user ini.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
