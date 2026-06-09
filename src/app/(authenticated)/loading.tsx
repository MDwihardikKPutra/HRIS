import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh]">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Memuat halaman...</p>
    </div>
  );
}
