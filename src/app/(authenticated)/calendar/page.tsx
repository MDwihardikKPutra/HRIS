"use client";

import { useState, useMemo } from "react";
import { leaveRequests, spds, getUserById } from "@/lib/data";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plane, CalendarDays } from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Defaulting to Jan 2026 based on seed data

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const monthName = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  // Generate Calendar Grid
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
  
  // Adjust so Monday is first (optional, standard is Sunday)
  // Let's stick to Sunday = 0
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Prepare Events
  const events = useMemo(() => {
    const list: any[] = [];
    
    // Approved Leaves
    leaveRequests.filter(l => l.status === "approved").forEach(l => {
      const user = getUserById(l.userId);
      list.push({
        id: `L-${l.id}`,
        type: "leave",
        title: `${user?.name} (${l.reason})`,
        start: new Date(l.startDate),
        end: new Date(l.endDate),
        color: "bg-amber-100 text-amber-700 border-amber-200"
      });
    });

    // Approved SPDs
    spds.filter(s => s.status === "approved").forEach(s => {
      const user = getUserById(s.userId);
      list.push({
        id: `S-${s.id}`,
        type: "spd",
        title: `${user?.name} (Ke ${s.destination})`,
        start: new Date(s.departureDate),
        end: new Date(s.returnDate),
        color: "bg-indigo-100 text-indigo-700 border-indigo-200"
      });
    });

    return list;
  }, []);

  const getEventsForDay = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Remove time for precise comparison
    const targetTime = d.getTime();

    return events.filter(e => {
      const start = new Date(e.start.getFullYear(), e.start.getMonth(), e.start.getDate()).getTime();
      const end = new Date(e.end.getFullYear(), e.end.getMonth(), e.end.getDate()).getTime();
      return targetTime >= start && targetTime <= end;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full space-y-4">
      {/* Unified Dashboard Card */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-100 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-600" /> Kalender Perusahaan
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Pantau jadwal Cuti & Perjalanan Dinas seluruh tim</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 shadow-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="w-36 text-center font-bold text-sm text-slate-800 tracking-wide">{monthName}</span>
            <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-slate-50/50 border-b border-slate-100 p-3 shrink-0 flex gap-4 text-xs font-bold text-slate-500 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" /> Cuti Karyawan
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500" /> Perjalanan Dinas (SPD)
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto bg-slate-50 flex flex-col">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-white sticky top-0 z-10 shrink-0">
            {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map(day => (
              <div key={day} className="py-3 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
            {blanks.map(b => (
              <div key={`b-${b}`} className="border-r border-b border-slate-200/50 bg-slate-50/50 min-h-[120px]" />
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
              
              return (
                <div key={day} className={`border-r border-b border-slate-200/50 p-2 min-h-[120px] hover:bg-indigo-50/10 transition-colors group ${isToday ? "bg-indigo-50/30" : "bg-white"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-black ${isToday ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50"}`}>
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {dayEvents.map(e => (
                      <div key={`${e.id}-${day}`} className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold leading-tight truncate shadow-sm ${e.color}`} title={e.title}>
                        <span className="mr-1 opacity-70">
                          {e.type === 'leave' ? '🏖️' : '✈️'}
                        </span>
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
