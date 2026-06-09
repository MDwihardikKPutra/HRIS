"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Eye, EyeOff, Info, CreditCard, Users, Briefcase } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
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
      setError("Incorrect email or password.");
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
      setError("Demo login failed.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 font-sans text-slate-800 p-4 sm:p-6 flex items-center justify-center">
      
      {/* THE NEW PARENT CARD WRAPPER */}
      <div className="w-full max-w-[1400px] h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] max-h-[900px] bg-white rounded-[3rem] p-4 lg:p-6 shadow-2xl border border-slate-200/60">
        
        {/* Inner Bento Grid: Image on Left (1.1fr), Form on Right (1fr) */}
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4 lg:gap-6">
          
          {/* LEFT COLUMN - Image Card */}
          <div className="hidden lg:flex relative bg-indigo-900 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden flex-col justify-between p-12 shadow-sm">
            {/* The Image Overlay */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2069&auto=format&fit=crop"
              alt="Office space"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-slate-900/80 to-slate-900/90 mix-blend-multiply" />
            
            {/* Top Content */}
            <div className="relative z-10 max-w-[480px]">
              <div className="mb-12 flex items-center gap-2.5">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-white rounded-sm" />
                </div>
                <span className="text-white font-bold text-2xl tracking-tighter">HRIS Next</span>
              </div>
              <h1 className="text-white text-[42px] font-medium leading-[1.15] tracking-tight mb-6">
                Mendefinisikan ulang cara Anda mengelola, mengembangkan, dan terhubung dengan setiap talenta.
              </h1>
            </div>

            {/* Bottom Glassmorphic Widget */}
            <div className="relative z-10 w-full max-w-[500px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="px-5 py-2 rounded-full border border-white/30 text-white text-xs font-bold tracking-wide">
                    Testing Environment
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-[13px] font-medium leading-relaxed pr-8">
                Akses mode demo ini dirancang untuk mensimulasikan persetujuan, manajemen proyek, dan alur operasional SDM secara komprehensif tanpa mengubah data asli.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - Form & Widgets */}
          <div className="flex flex-col gap-4 lg:gap-6 h-full">
            
            {/* Main Form Card */}
            <div className="bg-slate-50/50 rounded-[2rem] lg:rounded-[2.5rem] p-8 lg:p-12 flex-1 flex flex-col justify-center relative">
              <div className="w-full max-w-[420px] mx-auto">
                
                {/* Titles */}
                <div className="mb-10">
                  <h2 className="text-4xl lg:text-[42px] font-medium tracking-tight text-slate-900 leading-tight">
                    Selamat Datang di<br/>HRIS Next
                  </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center border border-red-100">
                      {error}
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="nama@perusahaan.com"
                      className="w-full px-6 h-14 bg-white border border-slate-200 rounded-full text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-400 font-medium"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-6 pr-14 h-14 bg-white border border-slate-200 rounded-full text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-400 font-medium tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full h-14 text-[15px] transition-all mt-4 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    Masuk
                  </button>

                  {/* Forgot Password Link */}
                  <div className="text-center mt-6">
                    <span className="text-slate-500 text-sm font-medium">Lupa kata sandi? </span>
                    <a href="#" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors text-sm">
                      Hubungi Admin
                    </a>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom Widget: Demo Login */}
            <div className="bg-slate-50/50 rounded-[2rem] p-6 lg:p-8 shrink-0 flex flex-col gap-4 transition-all">
              <button 
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="flex items-center justify-between w-full text-left group"
              >
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Login Instan Demo</p>
                  <p className="text-[12px] text-slate-500 font-medium mt-0.5">Tampilkan akun pengujian khusus</p>
                </div>
                <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 transition-transform ${showDemo ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'group-hover:bg-slate-100'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>
              
              {showDemo && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-2 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
                  {[
                    { role: "Admin", email: "admin@hris.local", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-100" },
                    { role: "HR", email: "hr@hris.local", icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
                    { role: "Finance", email: "finance@hris.local", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-100" },
                    { role: "Project Mgr", email: "pm@hris.local", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-100" },
                  ].map((demo) => {
                    const Icon = demo.icon;
                    return (
                      <button
                        key={demo.role}
                        type="button"
                        onClick={() => {
                          setEmail(demo.email);
                          setPassword("password");
                        }}
                        className="flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-100 shadow-sm border border-slate-100 rounded-2xl p-3 transition-all group"
                      >
                        <div className={`w-10 h-10 rounded-full ${demo.bg} flex items-center justify-center ${demo.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-center">{demo.role}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
