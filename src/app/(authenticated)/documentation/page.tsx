import { Fingerprint } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Documentation</h1>
        <p className="text-sm text-slate-500 mt-0.5">HRIS - Complete Documentation</p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">HRIS — Integrated Management Platform</h2>
            <p className="text-xs text-slate-500 mt-0.5">Version 2.0.0 • Next.js 15 • SQLite (JSON) • React 19</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Sistem manajemen kantor komprehensif yang mengelola seluruh workflow operasional perusahaan,
          mulai dari perencanaan kerja, realisasi, keuangan, cuti, hingga monitoring project dengan
          modular system dan role-based access control.
        </p>

        <h3 className="text-sm font-semibold text-slate-900 mb-3">Tech Stack</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {["Next.js 15", "React 19", "TypeScript", "Tailwind CSS 4", "NextAuth.js", "Vercel", "Lucide Icons"].map((tech) => (
            <span key={tech} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200">{tech}</span>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-slate-900 mb-3">Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { name: "Work Plan", desc: "Rencana kerja harian" },
            { name: "Work Realization", desc: "Realisasi kerja dengan progress tracking" },
            { name: "Leave Management", desc: "Cuti & izin dengan approval system" },
            { name: "SPD", desc: "Surat Perjalanan Dinas" },
            { name: "Purchase", desc: "Permintaan pembelian barang" },
            { name: "Vendor Payment", desc: "Pembayaran ke vendor" },
            { name: "Approval Center", desc: "Centralized approval system" },
            { name: "User Management", desc: "RBAC & module assignment" },
            { name: "Project Monitoring", desc: "Project tracking & analytics" },
            { name: "Documentation", desc: "System documentation" },
          ].map((mod) => (
            <div key={mod.name} className="flex gap-3 items-start p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">{mod.name}</p>
                <p className="text-xs text-slate-500">{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
