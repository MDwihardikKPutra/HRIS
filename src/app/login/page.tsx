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
 <div className="flex min-h-screen w-full bg-white font-sans text-slate-800">
 
 {/* LEFT SECTION - IMAGE */}
 <div className="hidden lg:flex w-1/2 min-h-screen relative bg-black flex-col justify-between p-12">
 <img
 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2069&auto=format&fit=crop"
 alt="Office space"
 className="absolute inset-0 w-full h-full object-cover opacity-80"
 />
 
 {/* Top Logo */}
 <div className="relative z-10 flex items-center">
 <span className="text-white font-bold text-2xl tracking-tighter">HRIS Next</span>
 </div>

 {/* Bottom Text */}
 <div className="relative z-10 mb-8">
 <h1 className="text-white text-5xl font-bold mb-4 tracking-tight leading-tight">
 Portal Manajemen<br/>SDM Terpadu
 </h1>
 <p className="text-white/90 text-[15px] font-medium mb-6">
 Tingkatkan efisiensi pengelolaan data karyawan, persetujuan<br/>operasional, dan payroll dalam satu platform.
 </p>
 <div className="flex gap-2 items-center">
 <div className="w-8 h-1.5 bg-white rounded-full"></div>
 <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
 <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
 </div>
 </div>
 </div>

 {/* RIGHT SECTION - FORM */}
 <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center relative bg-white px-6 py-12">
 
 {/* Top Right "Support" Pill */}
 <div className="absolute top-8 right-8 hidden md:block">
 <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
 Pusat Bantuan
 </button>
 </div>

 {/* Main Form Center Wrapper */}
 <div className="w-full max-w-md">
 {/* Titles */}
 <h2 className="text-[#151522] text-3xl font-bold mb-2 tracking-tight">
 Selamat Datang!
 </h2>
 <p className="text-[#92929D] text-sm mb-6 font-medium">
 Silakan masuk menggunakan akun perusahaan Anda
 </p>

 {/* Demo Alert Box */}
 <div className="mb-6 p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl flex gap-3 items-start">
 <div className="mt-0.5 text-indigo-500 shrink-0">
 <Info className="w-5 h-5" />
 </div>
 <div className="text-[13px] font-medium text-indigo-900 leading-relaxed">
 Anda sedang mengakses versi <strong>Demo HRIS</strong> (Human Resource Integration System). Ini adalah ruang lingkup demonstrasi untuk tujuan pengujian. Beberapa fitur operasional mungkin dibatasi, dan data yang dimasukkan tidak akan tersimpan secara permanen.
 </div>
 </div>

 <form onSubmit={handleLogin} className="space-y-6">
 {error && (
 <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
 {error}
 </div>
 )}

 {/* Email Field */}
 <div className="space-y-2">
 <label className="text-[#696974] text-xs font-semibold tracking-wide uppercase">Email Perusahaan</label>
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 placeholder="nama@perusahaan.com"
 className="w-full p-3.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400"
 />
 </div>

 {/* Password Field */}
 <div className="space-y-2">
 <label className="text-[#696974] text-xs font-semibold tracking-wide uppercase">Kata Sandi</label>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 placeholder="••••••••"
 className="w-full p-3.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 tracking-widest"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
 >
 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
 </button>
 </div>
 </div>

 {/* Remember Me & Forgot Password */}
 <div className="flex items-center justify-between text-xs pt-1">
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" className="w-4 h-4 rounded border-gray-300 cursor-pointer" defaultChecked />
 <span className="text-gray-600 font-medium">Ingat Saya</span>
 </label>
 <a href="#" className="font-medium text-gray-400 hover:text-black transition-colors">
 Lupa Kata Sandi?
 </a>
 </div>

 {/* Login Button */}
 <button
 type="submit"
 disabled={loading}
 className="w-full bg-[#1A1A1A] hover:bg-black text-white font-medium rounded-lg py-3.5 text-sm transition-colors mt-4 flex items-center justify-center gap-2"
 >
 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
 Masuk Eksekutif
 </button>
 </form>

 {/* Divider */}
 <div className="flex items-center justify-center my-8">
 <div className="h-px bg-gray-200 flex-1"></div>
 <span className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">Login Demo</span>
 <div className="h-px bg-gray-200 flex-1"></div>
 </div>

 {/* Demo Login Buttons */}
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => {
 const demoEmail = "admin@hris.local";
 setEmail(demoEmail);
 setPassword("password");
 setLoading(true);
 setError("");
 signIn("credentials", { email: demoEmail, password: "password", redirect: false }).then(result => {
 if (result?.error) {
 setError("Login failed.");
 setLoading(false);
 } else {
 router.push("/dashboard");
 router.refresh();
 }
 });
 }}
 className="flex flex-col items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors text-xs font-semibold"
 >
 <ShieldCheck className="w-4 h-4 text-gray-400" />
 Admin
 </button>
 <button
 onClick={() => {
 const demoEmail = "hr@hris.local";
 setEmail(demoEmail);
 setPassword("password");
 setLoading(true);
 setError("");
 signIn("credentials", { email: demoEmail, password: "password", redirect: false }).then(result => {
 if (result?.error) {
 setError("Login failed.");
 setLoading(false);
 } else {
 router.push("/dashboard");
 router.refresh();
 }
 });
 }}
 className="flex flex-col items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors text-xs font-semibold"
 >
 <Users className="w-4 h-4 text-gray-400" />
 HR
 </button>
 <button
 onClick={() => {
 const demoEmail = "finance@hris.local";
 setEmail(demoEmail);
 setPassword("password");
 setLoading(true);
 setError("");
 signIn("credentials", { email: demoEmail, password: "password", redirect: false }).then(result => {
 if (result?.error) {
 setError("Login failed.");
 setLoading(false);
 } else {
 router.push("/dashboard");
 router.refresh();
 }
 });
 }}
 className="flex flex-col items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors text-xs font-semibold"
 >
 <CreditCard className="w-4 h-4 text-gray-400" />
 Finance
 </button>
 <button
 onClick={() => {
 const demoEmail = "pm@hris.local";
 setEmail(demoEmail);
 setPassword("password");
 setLoading(true);
 setError("");
 signIn("credentials", { email: demoEmail, password: "password", redirect: false }).then(result => {
 if (result?.error) {
 setError("Login failed.");
 setLoading(false);
 } else {
 router.push("/dashboard");
 router.refresh();
 }
 });
 }}
 className="flex flex-col items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-lg transition-colors text-xs font-semibold"
 >
 <Briefcase className="w-4 h-4 text-gray-400" />
 Project Mgr
 </button>
 </div>

 <p className="text-[10px] text-gray-400 text-center mt-3">Atau login sebagai karyawan: Budi Santoso (budi@hris.local)</p>

 {/* Registration link at the very bottom */}
 <div className="mt-12 text-center text-xs font-medium text-gray-500">
 Belum memiliki akses? <a href="#" className="text-blue-600 font-bold hover:underline">Hubungi HRD</a>
 </div>
 </div>
 </div>
 </div>
 );
}
