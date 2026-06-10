"use client";

import { useState } from "react";
import { 
  Fingerprint, Book, ShieldCheck, Zap, Server, Users, History, 
  Briefcase, CreditCard, ChevronRight, Search 
} from "lucide-react";

type DocTab = "admin" | "karyawan" | "pm" | "hr" | "finance" | "changelog" | "overview";

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState<DocTab>("overview");

  return (
    <div className="w-full h-[calc(100vh-7rem)] animate-in fade-in duration-500 font-sans flex flex-col md:flex-row gap-6">
        
        {/* Left: Main Content */}
        <div className="flex-1 min-w-0 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Content Header (Breadcrumb-like) */}
            <div className="px-8 py-4 border-b border-slate-100 flex items-center gap-2 text-[13px] font-medium text-slate-500">
              <span className="cursor-pointer hover:text-slate-800" onClick={() => setActiveTab("overview")}>Docs</span>
              <ChevronRight className="w-3 h-3" />
              {activeTab === "overview" && <span className="text-slate-800">First Steps</span>}
              {activeTab === "changelog" && <span className="text-slate-800">System Updates</span>}
              {["admin", "hr", "pm", "finance", "karyawan"].includes(activeTab) && <span className="text-slate-800">Roles</span>}
            </div>

            <div className="p-8 md:p-12 w-full flex-1 overflow-y-auto pr-2 custom-scrollbar">
              
              {/* --- OVERVIEW TAB --- */}
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Intro to HRIS Next</h1>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-8">
                    HRIS Next is a highly performant, trustworthy, and intelligent platform built to handle human resources tasks involving approvals, reporting, data analysis, and payroll.
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
                    <h3 className="font-bold text-slate-800 mb-2">The latest generation of HRIS Next:</h3>
                    <ul className="space-y-3 text-[14px] text-slate-600">
                      <li><strong>v2.5.0</strong> - The most capable widely released version for Kanban project management and integrated multi-role dashboards.</li>
                      <li><strong>v2.4.0</strong> - Complete UI/UX revamp adopting a Super Clean density format to reduce visual hierarchy.</li>
                      <li><strong>v2.3.0</strong> - Introduction of complex role-based routing and permissions.</li>
                    </ul>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Recommended path for new users</h2>
                  <p className="text-[14px] text-slate-600 mb-6">Follow these steps to go from zero to a working HRIS workflow.</p>
                  
                  <div className="space-y-4 mb-10">
                    <div className="flex gap-4 p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer" onClick={() => setActiveTab('admin')}>
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-[15px]">Understand the Roles</h3>
                        <p className="text-[14px] text-slate-600 mt-1">Set up your environment and learn about the capabilities of each role (Admin, HR, PM, Finance).</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer" onClick={() => setActiveTab('karyawan')}>
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-[15px]">Make your first request</h3>
                        <p className="text-[14px] text-slate-600 mt-1">Learn how to submit Leave Requests (Cuti) and Official Travel (SPD).</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-[15px]">Explore tools</h3>
                        <p className="text-[14px] text-slate-600 mt-1">Discover what the system can do: Kanban boards, automated payroll, data handling, and structured tables.</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* --- ADMIN TAB --- */}
              {activeTab === 'admin' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Administrator (Admin)</h1>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-8">
                    Administrator adalah peran tingkat tertinggi (root) yang dibangun khusus untuk mengawasi operasional teknis HRIS. Admin memiliki izin tanpa batas untuk mengelola, mengubah, atau memvalidasi data lintas departemen secara langsung.
                  </p>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-10">
                    <table className="w-full text-left text-[14px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-5 font-bold text-slate-900 w-1/3">Tinjauan</th>
                          <th className="py-3 px-5 font-bold text-slate-900">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Konteks Peran</td>
                          <td className="py-3 px-5 text-slate-600">Akses langsung ke seluruh API dan menu antarmuka.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Kesesuaian Ideal</td>
                          <td className="py-3 px-5 text-slate-600">Tim IT, CTO, atau System Administrator.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Rekomendasi Jalur (First Steps)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-indigo-300 transition-colors">
                      <div className="text-indigo-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center text-xs">1</div> Setup Pengguna
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Manajemen Kredensial</h3>
                      <p className="text-[14px] text-slate-600">Pelajari cara menambahkan akun baru, reset password, dan blokir akses melalui modul Manajemen Pengguna.</p>
                    </div>
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-indigo-300 transition-colors">
                      <div className="text-indigo-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center text-xs">2</div> Pahami Override
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Bypass Persetujuan</h3>
                      <p className="text-[14px] text-slate-600">Uji coba menyetujui dokumen Cuti atau Pembelian yang terkunci di Manajer yang sedang berhalangan hadir.</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Kapabilitas Kunci</h2>
                  <div className="flex gap-4 p-6 border border-slate-200 bg-white shadow-sm rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0"/>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">Akses Lintas Modul (Global Scope)</h3>
                      <p className="text-[14px] text-slate-600">Menembus pembatasan sidebar. Admin melihat seluruh menu, termasuk metrik keuangan, metrik SDM, log proyek, dan aktivitas harian personal.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- HR TAB --- */}
              {activeTab === 'hr' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Human Resources (HR)</h1>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-8">
                    HR difokuskan pada pengelolaan kesejahteraan pegawai dan kepatuhan administratif. Mereka memonitor presensi, izin cuti, serta pergerakan organisasi dari perspektif personil.
                  </p>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-10">
                    <table className="w-full text-left text-[14px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-5 font-bold text-slate-900 w-1/3">Tinjauan</th>
                          <th className="py-3 px-5 font-bold text-slate-900">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Konteks Peran</td>
                          <td className="py-3 px-5 text-slate-600">Fokus pada Modul Cuti, Master Data, dan Presensi Kalender.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Kesesuaian Ideal</td>
                          <td className="py-3 px-5 text-slate-600">Personalia, HRD, Talent Acquisition.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Rekomendasi Jalur (First Steps)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-emerald-300 transition-colors">
                      <div className="text-emerald-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-xs">1</div> Pemantauan
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Tinjau Beban Organisasi</h3>
                      <p className="text-[14px] text-slate-600">Cek Kalender Perusahaan untuk melihat tumpukan Cuti (merah) atau SPD (kuning) guna mengantisipasi kelangkaan SDM.</p>
                    </div>
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-emerald-300 transition-colors">
                      <div className="text-emerald-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-xs">2</div> Dasbor HR
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Eksekusi Pending Request</h3>
                      <p className="text-[14px] text-slate-600">Selesaikan seluruh antrean permohonan Cuti yang menunggu persetujuan pada widget "Butuh Tindakan".</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Kapabilitas Kunci</h2>
                  <div className="flex gap-4 p-6 border border-slate-200 bg-white shadow-sm rounded-xl">
                    <Users className="w-6 h-6 text-emerald-600 shrink-0"/>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">Manajemen Cuti Terpusat</h3>
                      <p className="text-[14px] text-slate-600">Menganalisa sisa kuota cuti karyawan dan memutuskan validitas permohonan Izin/Cuti dengan mencocokkan jadwal proyek.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- FINANCE TAB --- */}
              {activeTab === 'finance' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Finance (Keuangan)</h1>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-8">
                    Finance bertanggung jawab atas aliran dana keluar, pengelolaan penggajian, dan persetujuan pembelian. Mereka menjaga kesehatan moneter dari seluruh aktivitas karyawan.
                  </p>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-10">
                    <table className="w-full text-left text-[14px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-5 font-bold text-slate-900 w-1/3">Tinjauan</th>
                          <th className="py-3 px-5 font-bold text-slate-900">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Konteks Peran</td>
                          <td className="py-3 px-5 text-slate-600">Akses Modul Penggajian, Pembelian, Tagihan, dan Approval Dana.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Kesesuaian Ideal</td>
                          <td className="py-3 px-5 text-slate-600">CFO, Staf Akuntansi, Bendahara.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Rekomendasi Jalur (First Steps)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-amber-300 transition-colors">
                      <div className="text-amber-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center text-xs">1</div> Proses Payroll
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Simulasi Penggajian</h3>
                      <p className="text-[14px] text-slate-600">Masuk ke modul Penggajian untuk mencetak slip dan memverifikasi perhitungan potogan BPJS/Pajak karyawan otomatis.</p>
                    </div>
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-amber-300 transition-colors">
                      <div className="text-amber-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center text-xs">2</div> Eksekusi PO
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Otorisasi Pembelian</h3>
                      <p className="text-[14px] text-slate-600">Tinjau antrean "Purchase Order" (PO) untuk mencairkan anggaran operasional proyek (CAPEX/OPEX).</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Kapabilitas Kunci</h2>
                  <div className="flex gap-4 p-6 border border-slate-200 bg-white shadow-sm rounded-xl">
                    <CreditCard className="w-6 h-6 text-amber-600 shrink-0"/>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">Distribusi Slip Gaji & Rekonsiliasi</h3>
                      <p className="text-[14px] text-slate-600">Mengelola siklus penggajian bulanan, memastikan komponen upah tersinkronisasi, dan merilis dana pembayaran tagihan ke vendor via modul Keuangan Terpusat.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- PM TAB --- */}
              {activeTab === 'pm' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Project Manager (PM)</h1>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-8">
                    Project Manager adalah motor penggerak eksekusi lapangan. Mereka mengatur pembagian tugas (Kanban), memantau kemajuan riil, dan menyetujui Laporan Pekerjaan harian dari anggota tim.
                  </p>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-10">
                    <table className="w-full text-left text-[14px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-5 font-bold text-slate-900 w-1/3">Tinjauan</th>
                          <th className="py-3 px-5 font-bold text-slate-900">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Konteks Peran</td>
                          <td className="py-3 px-5 text-slate-600">Akses Modul Proyek, Kanban, dan Persetujuan EAR (Realisasi).</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Kesesuaian Ideal</td>
                          <td className="py-3 px-5 text-slate-600">Team Lead, Supervisor Lapangan, Manajer Proyek.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Rekomendasi Jalur (First Steps)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-purple-300 transition-colors">
                      <div className="text-purple-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center text-xs">1</div> Board Interaktif
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Pindahkan Status Task</h3>
                      <p className="text-[14px] text-slate-600">Buka modul "Kelola Proyek" dan gunakan <em>Drag and Drop</em> di Papan Kanban untuk mengubah progress pekerjaan (Todo, In-Progress, Done).</p>
                    </div>
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-purple-300 transition-colors">
                      <div className="text-purple-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center text-xs">2</div> Cek Laporan Tim
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Validasi EAR</h3>
                      <p className="text-[14px] text-slate-600">Setujui (Approve) laporan Realisasi Kerja Harian (EAR) yang diajukan oleh karyawan proyek yang Anda supervisi.</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Kapabilitas Kunci</h2>
                  <div className="flex gap-4 p-6 border border-slate-200 bg-white shadow-sm rounded-xl">
                    <Briefcase className="w-6 h-6 text-purple-600 shrink-0"/>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">Visibilitas Komprehensif Proyek</h3>
                      <p className="text-[14px] text-slate-600">Melihat perbandingan antara <em>Planned vs Actual Work</em>, memantau penggunaan biaya proyek secara <em>real-time</em>, dan menyetujui SPD karyawan teknis untuk keperluan lapangan.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- KARYAWAN TAB --- */}
              {activeTab === 'karyawan' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Karyawan Umum</h1>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-8">
                    Karyawan adalah entitas utama pembuat data (Data Creator). Mereka merancang jadwal, merealisasikan tugas, meminta cuti liburan, serta menerima kompensasi upah.
                  </p>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-10">
                    <table className="w-full text-left text-[14px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-5 font-bold text-slate-900 w-1/3">Tinjauan</th>
                          <th className="py-3 px-5 font-bold text-slate-900">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Konteks Peran</td>
                          <td className="py-3 px-5 text-slate-600">Akses Mandiri (Self-Service) untuk pembuatan dokumen.</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-5 font-medium text-slate-900">Kesesuaian Ideal</td>
                          <td className="py-3 px-5 text-slate-600">Staf Reguler, Operator Lapangan, Entitas Individual.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Rekomendasi Jalur (First Steps)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-rose-300 transition-colors">
                      <div className="text-rose-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-rose-100 flex items-center justify-center text-xs">1</div> Pengajuan Dokumen
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Eksplorasi Self-Service</h3>
                      <p className="text-[14px] text-slate-600">Cobalah membuat Rencana Kerja baru, kemudian buat Realisasi berdasarkan rencana tersebut melalui Modul Karyawan.</p>
                    </div>
                    <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-rose-300 transition-colors">
                      <div className="text-rose-600 font-bold mb-3 text-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-rose-100 flex items-center justify-center text-xs">2</div> Cetak Riwayat
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Slip Gaji & Bukti</h3>
                      <p className="text-[14px] text-slate-600">Kunjungi halaman Penggajian Personal untuk membuka PDF rincian Slip Gaji resmi tanpa harus memintanya secara manual ke bagian Finance.</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 border-b border-slate-100 pb-2">Kapabilitas Kunci</h2>
                  <div className="flex gap-4 p-6 border border-slate-200 bg-white shadow-sm rounded-xl">
                    <Users className="w-6 h-6 text-rose-600 shrink-0"/>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">Isolasi Keamanan (Privacy First)</h3>
                      <p className="text-[14px] text-slate-600">Setiap Karyawan hanya dapat melihat dan memodifikasi data miliknya sendiri. Tidak ada kebocoran privasi gaji, riwayat sanksi, atau cuti ke sesama kolega.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- CHANGELOG TAB --- */}
              {activeTab === 'changelog' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Riwayat Pembaruan (Changelog)</h1>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-10">
                    Catatan rilis dari seluruh iterasi sistem HRIS Next. Kami terus berinovasi untuk memberikan pengalaman enterprise terbaik.
                  </p>
                  
                  <div className="space-y-12">
                    {/* v2.5.0 */}
                    <div className="relative pl-8 border-l border-slate-200">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white" />
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-bold text-slate-900">v2.5.0</h2>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-md">Terbaru</span>
                        </div>
                        <p className="text-[14px] text-slate-500 font-medium">Ekspansi Modul & Optimalisasi UI — Juni 2026</p>
                      </div>
                      <ul className="space-y-4">
                        <li className="text-[14px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Ekspansi Dasbor Project Manager</strong> 
                          Penambahan Dasbor PM secara komprehensif, dengan metrik real-time terkait progres proyek, beban tim, dan pipeline anggaran yang tertintegrasi.
                        </li>
                        <li className="text-[14px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Kelola Proyek & Kanban Terpusat</strong> 
                          Membangun integrasi interaktif antara daftar proyek dengan fitur Kanban board (Drag & Drop), memungkinkan pemantauan status dan pengelolaan operasional.
                        </li>
                        <li className="text-[14px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Tata Letak Kanban</strong> 
                          Menyatukan dan merelokasi filter board secara rapi sejajar dengan tab, memperluas area kerja menjadi <em>full-height</em>.
                        </li>
                        <li className="text-[14px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Perluasan Metrik Pengguna</strong> 
                          Memisahkan metrik dan KPI untuk setiap Role (Admin, HR, Finance, Karyawan) agar akurat sesuai porsi dan tanggung jawab masing-masing.
                        </li>
                        <li className="text-[14px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Standarisasi Tabel Terpadu</strong> 
                          Menyelaraskan seluruh <em>typography</em> tabel (font, padding, margin) di 18 halaman ke desain satu rupa yang konsisten (13px body, 12px header).
                        </li>
                      </ul>
                    </div>

                    {/* v2.4.0 */}
                    <div className="relative pl-8 border-l border-slate-200">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white" />
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-900 mb-1">v2.4.0</h2>
                        <p className="text-[14px] text-slate-500 font-medium">Pembaruan UI Super Clean</p>
                      </div>
                      <ul className="space-y-4">
                        <li className="text-[14px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">UI/UX Revamp</strong> 
                          Mengadopsi tata letak "Super Clean" dan "High-Density" untuk menghilangkan hierarki visual berlebih.
                        </li>
                        <li className="text-[14px] text-slate-600 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Internal Scroll</strong> 
                          Mengunci tabel dalam viewport untuk menghindari <em>double scrolling</em>.
                        </li>
                      </ul>
                    </div>

                    {/* v2.3.0 */}
                    <div className="relative pl-8">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white" />
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-900 mb-1">v2.3.0</h2>
                        <p className="text-[14px] text-slate-500 font-medium">Sistem Hak Akses (RBAC)</p>
                      </div>
                      <ul className="space-y-4">
                        <li className="text-[14px] text-slate-600 leading-relaxed">
                          Pemisahan otorisasi berdasarkan <em>Role</em> (Admin, HR, Finance, Project Manager).
                        </li>
                      </ul>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

        {/* Right: Sidebar Navigation */}
        <div className="w-full md:w-72 lg:w-80 shrink-0 h-full">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
            
            <div className="mb-6 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search docs" 
                  className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg py-2 pl-9 pr-3 text-[13px] outline-none transition-all placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">First Steps</h3>
                <ul className="space-y-0.5 text-[14px] font-medium text-slate-600">
                  <li>
                    <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'}`}>
                      Intro to HRIS
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Roles & Permissions</h3>
                <ul className="space-y-0.5 text-[14px] font-medium text-slate-600">
                  <li>
                    <button onClick={() => setActiveTab('admin')} className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'admin' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'}`}>
                      Administrator
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('hr')} className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'hr' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'}`}>
                      HR Manager
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('finance')} className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'finance' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'}`}>
                      Finance
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('pm')} className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'pm' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'}`}>
                      Project Manager
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('karyawan')} className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'karyawan' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'}`}>
                      Karyawan (Umum)
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">System Updates</h3>
                <ul className="space-y-0.5 text-[14px] font-medium text-slate-600">
                  <li>
                    <button onClick={() => setActiveTab('changelog')} className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'changelog' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 hover:text-slate-900'}`}>
                      Changelog v2.5.0
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">Support</h3>
                <ul className="space-y-0.5 text-[14px] font-medium text-slate-600">
                  <li>
                    <button className="w-full text-left px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900">
                      Help Center
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900">
                      Service Status
                    </button>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

    </div>
  );
}
