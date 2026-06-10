import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh]">
      <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
    </div>
  );
}
