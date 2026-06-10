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
        color: "bg-amber-50 text-amber-700 border-amber-100"
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
        color: "bg-indigo-50 text-indigo-700 border-indigo-100"
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
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-400" /> Kalender Perusahaan
            </h1>
            <p className="text-[13px] text-slate-500 mt-1">Pantau jadwal Cuti & Perjalanan Dinas seluruh tim</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 bg-white p-1 rounded-md border border-slate-200">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 rounded transition-colors text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="w-36 text-center font-medium text-[13px] text-slate-900">{monthName}</span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded transition-colors text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-slate-50/50 border-b border-slate-200 p-3 shrink-0 flex gap-4 text-xs font-medium text-slate-600 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Cuti Karyawan
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Perjalanan Dinas (SPD)
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-hidden bg-slate-50 flex flex-col min-h-0">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-white shrink-0">
            {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map(day => (
              <div key={day} className="py-2 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-1 min-h-0" style={{ gridAutoRows: '1fr' }}>
            {blanks.map(b => (
              <div key={`b-${b}`} className="border-r border-b border-slate-200/50 bg-slate-50/50" />
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
              
              return (
                <div key={day} className={`border-r border-b border-slate-200 p-1.5 flex flex-col hover:bg-slate-50/50 transition-colors group ${isToday ? "bg-indigo-50/10" : "bg-white"}`}>
                  <div className="flex justify-between items-start mb-1 shrink-0">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[13px] font-medium ${isToday ? "bg-indigo-600 text-white" : "text-slate-600 group-hover:text-indigo-600 group-hover:bg-indigo-50"}`}>
                      {day}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 min-h-0 custom-scrollbar">
                    {dayEvents.map(e => (
                      <div key={`${e.id}-${day}`} className={`px-1.5 py-0.5 rounded border text-[10px] font-medium leading-tight truncate ${e.color}`} title={e.title}>
                        <span className="mr-0.5 opacity-70">
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
