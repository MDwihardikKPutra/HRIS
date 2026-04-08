"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, User, Users, Eye, EyeOff, Globe, Shield, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const demoLogin = async (role: "admin" | "user") => {
    const demoEmail = role === "admin" ? "admin@hris.local" : "user@hris.local";
    setEmail(demoEmail);
    setPassword("password");
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: demoEmail,
      password: "password",
      redirect: false,
    });

    if (result?.error) {
      setError("Demo login gagal.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] flex items-center justify-center p-4 md:p-6 lg:p-8 selection:bg-slate-200">
      {/* Background decorations - Subtle Geometric Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.06]">
        <div className="absolute top-0 right-0 w-[45dvw] h-[45dvw] border-l border-b border-indigo-600 translate-x-1/3 -translate-y-1/3 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[35dvw] h-[35dvw] border-r border-t border-indigo-600 -translate-x-1/3 translate-y-1/3 rotate-12" />
        <div className="absolute top-1/2 left-1/4 w-full h-px bg-gradient-to-r from-transparent via-indigo-600 to-transparent rotate-45" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(79,70,229,0.08)] border border-slate-100">
        {/* Left Section: Sign In Form */}
        <div className="w-full md:w-[48%] flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 py-12 md:py-20 lg:py-24">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center rounded-xl shadow-lg shadow-indigo-100">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900">HRIS Next</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enterprise Portal</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tighter leading-tight uppercase">Log In To<br /><span className="text-indigo-600">Your HR Portal</span></h1>
            <p className="text-slate-500 mt-4 text-sm font-medium">Sistem manajemen SDM terpadu untuk efisiensi maksimal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-900 text-[11px] font-bold uppercase tracking-wide animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-300 font-bold"
                  placeholder="name@company.com"
                  required
                />
                <User className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Forgot?</a>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-300 font-bold"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <Shield className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 mt-2"
            >
              {loading ? "Authenticating..." : "Sign in to Dashboard"}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.3em]">Quick Access</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => demoLogin("admin")}
                className="flex items-center justify-center gap-3 h-12 border border-slate-200 rounded-xl bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all group font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-[11px] text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest">Admin</span>
              </button>
              <button
                onClick={() => demoLogin("user")}
                className="flex items-center justify-center gap-3 h-12 border border-slate-200 rounded-xl bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all group font-bold"
              >
                <Users className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-[11px] text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest">Employee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Hero Part */}
        <div className="hidden md:flex flex-1 relative bg-indigo-600 p-12 lg:p-20 overflow-hidden">
          {/* Hero Decoration */}
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-[10%] right-[10%] w-[32dvw] h-[32dvw] bg-white/[0.04] border border-white/[0.08] rounded-[4rem] rotate-12" />
            <div className="absolute bottom-[20%] left-[20%] w-[22dvw] h-[22dvw] bg-white/[0.03] border border-white/[0.06] rounded-full" />
            {/* Soft geometric lines */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
          </div>

          <div className="relative z-10 flex flex-col justify-between w-full h-full">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-indigo-200" />
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.4em]">Enterprise Edition</span>
            </div>

            <div className="space-y-6 max-w-sm">
              <div className="w-20 h-1 bg-white/30 rounded-full" />
              <h2 className="text-5xl font-bold text-white tracking-tighter leading-[0.9] uppercase">
                Modernize<br />Your HR<br /><span className="text-white/60">Workflows</span>
              </h2>
              <p className="text-indigo-100/60 text-sm leading-relaxed font-medium">
                Solusi manajemen personil generasi baru yang dirancang untuk kecepatan, keamanan, dan pengalaman pengguna yang luar biasa.
              </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-indigo-400 border-2 border-indigo-600" />
                    ))}
                </div>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Trusted by 500+ Teams</p>
            </div>
          </div>

          {/* Large Background Letter */}
          <div className="absolute -bottom-20 -right-20 pointer-events-none select-none">
            <span className="text-[400px] font-bold text-white/[0.03] leading-none tracking-tighter">PGE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
