"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, BellRing } from "lucide-react";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (title: string, message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (title: string, message: string, type: NotificationType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, title, message, type }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // --- SIMULATION (For Demo Purposes) ---
  useEffect(() => {
    // Randomly pop a notification every 45-60 seconds to simulate a live environment
    const randomInterval = () => Math.floor(Math.random() * 15000) + 45000;
    let timer: NodeJS.Timeout;

    const simulateEvent = () => {
      const events = [
        { title: "Pengajuan Cuti Disetujui", message: "HRD telah menyetujui Cuti Tahunan Anda.", type: "success" as const },
        { title: "Tugas Baru", message: "Dimas Anggara menugaskan Anda pada PRJ-009.", type: "info" as const },
        { title: "Approval Diperlukan", message: "Ada 3 pengajuan SPD menunggu konfirmasi Anda.", type: "warning" as const },
        { title: "Dokumen Baru", message: "Kebijakan SOP 2026 telah diunggah.", type: "info" as const },
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      showNotification(event.title, event.message, event.type);
      timer = setTimeout(simulateEvent, randomInterval());
    };

    timer = setTimeout(simulateEvent, 10000); // First ping after 10s

    return () => clearTimeout(timer);
  }, []);
  // --------------------------------------

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 sm:px-0">
        {notifications.map((n) => (
          <Toast key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function Toast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const { title, message, type } = notification;

  const typeConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      bg: "bg-white",
      border: "border-emerald-100",
      indicator: "bg-emerald-500",
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      bg: "bg-white",
      border: "border-red-100",
      indicator: "bg-red-500",
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
      bg: "bg-white",
      border: "border-amber-100",
      indicator: "bg-amber-500",
    },
    info: {
      icon: <Info className="w-5 h-5 text-indigo-500" />,
      bg: "bg-white",
      border: "border-indigo-100",
      indicator: "bg-indigo-500",
    },
  };

  const config = typeConfig[type];

  return (
    <div className={`relative overflow-hidden ${config.bg} rounded-2xl shadow-xl border ${config.border} p-4 pointer-events-auto flex items-start gap-3 animate-in slide-in-from-right-8 fade-in duration-300`}>
      {/* Left indicator strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.indicator}`} />
      
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-800 leading-tight">{title}</h4>
        <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 -mt-1 -mr-1 rounded-lg hover:bg-slate-50"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
