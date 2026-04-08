"use client";

import { Fingerprint, Book, ShieldCheck, Zap, Server, Globe, Users } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      {/* Header section with soft-geometric light design */}
      <div className="relative overflow-hidden bg-white border border-indigo-100 rounded-2xl p-8 shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Fingerprint className="w-32 h-32 text-indigo-600 rotate-12" />
        </div>
        
        {/* Soft light burst effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-6 border border-indigo-100">
            <Zap className="w-3.5 h-3.5 fill-indigo-600" /> Pusat Informasi
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 leading-none">Buku Panduan SDM</h1>
          <p className="text-slate-500 mt-3 max-w-xl text-sm leading-relaxed font-medium">
            Protokol Standar Operasional dan Panduan Infrastruktur untuk sistem manajemen SDM (HRIS).
            Dokumentasi teknis lengkap mengenai alur kerja perusahaan.
          </p>
          <div className="flex gap-6 mt-8">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-800 tracking-tight">v2.4.0</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Versi Sistem</span>
            </div>
            <div className="w-px h-10 bg-slate-200 self-center" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-emerald-600 tracking-tight">Valid</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status Server</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Guide */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <h2 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  Alur Operasional
                </h2>
                <span className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200">Protokol Dasar</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform border border-slate-200">1</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Pengajuan</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                    Inisiasi transaksi melalui form modul. Sistem akan melakukan pengecekan validasi data secara otomatis.
                  </p>
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center font-bold border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all">2</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Verifikasi</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                    Proses persetujuan oleh atasan atau direktur melalui dasbor. Evaluasi status approval atau penolakan.
                  </p>
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 group-hover:rotate-6 transition-all shadow-sm">3</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Finalisasi</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                    Penomoran dokumen unik dilakukan dan status sistem terupdate. Tercatat di log transaksi secara permanen.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Spesifikasi Sistem Component transformed to Light Mode */}
          <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                <Server className="w-32 h-32 text-indigo-600" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Server className="w-4 h-4" />
                </div>
                <h2 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                  Spesifikasi Sistem
                </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 relative z-10 w-full sm:w-4/5 lg:w-3/4 pb-2">
               <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                   <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">Base Engine</span>
                   <span className="text-xs text-indigo-600 font-bold uppercase tabular-nums bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">Next.js 16.2</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                   <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">Design Core</span>
                   <span className="text-xs text-slate-700 font-bold uppercase tabular-nums">Tailwind v4.0</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                   <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">Basis Data</span>
                   <span className="text-xs text-slate-700 font-bold uppercase tabular-nums">JSON / Dummy</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                   <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">Node Env</span>
                   <span className="text-xs text-emerald-600 font-bold uppercase tabular-nums bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">LTS 20.x.x</span>
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Book className="w-4 h-4 text-indigo-600" />
              Referensi
            </h2>
            <div className="space-y-1.5">
              {[
                "Kebijakan Perusahaan",
                "Protokol SPD/Dinas",
                "Alur Pembelian",
                "Siklus Tagihan",
                "Standard Keamanan"
              ].map((item, i) => (
                <button key={i} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all flex items-center justify-between group border border-transparent hover:border-indigo-100">
                  {item}
                  <Zap className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-all md:-rotate-12 group-hover:rotate-12" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-indigo-100 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 relative z-10">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold tracking-tight leading-none mb-2 relative z-10 text-slate-800">Butuh Bantuan?</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium relative z-10">
              Hubungi manajemen untuk pertanyaan teknis atau pembuatan peran baru.
            </p>
            <button className="w-full mt-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 relative z-10">
              Buat Tiket Bantuan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
