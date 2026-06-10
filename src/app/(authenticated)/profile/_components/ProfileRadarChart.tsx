"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { Activity } from "lucide-react";

export default function ProfileRadarChart({ userId }: { userId: number }) {
  // Demo data for radar chart
  // In a real app, this would be computed based on task completion time, review scores, etc.
  const data = [
    { subject: 'Velocity', A: 85, fullMark: 100 },
    { subject: 'Kualitas Laporan', A: 90, fullMark: 100 },
    { subject: 'Ketepatan Waktu', A: 75, fullMark: 100 },
    { subject: 'Komunikasi', A: 80, fullMark: 100 },
    { subject: 'Inisiatif', A: 70, fullMark: 100 },
    { subject: 'Problem Solving', A: 85, fullMark: 100 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 w-full flex flex-col h-full min-h-[350px]">
      <h2 className="text-sm font-medium text-slate-900 mb-5 flex items-center gap-2">
        <Activity className="w-4 h-4 text-indigo-500" /> Analitik Performa
      </h2>
      
      <div className="flex-1 w-full relative min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              wrapperStyle={{ outline: 'none' }}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: '#818cf8', fontWeight: 600 }}
            />
            <Radar
              name="Skor"
              dataKey="A"
              stroke="#6366f1"
              strokeWidth={2}
              fill="#818cf8"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
