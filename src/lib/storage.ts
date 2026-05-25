"use client";

import { useState, useCallback, useEffect } from "react";

// Generic localStorage hook - Better pattern to avoid cascading renders
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Client-side only: read from localStorage on mount
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Sync with localStorage on value change (not on mount)
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Set value function
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  // Clear/reset function
  const clearValue = useCallback(() => {
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}

// ======================
// HRIS Data Hooks
// ======================

// Leave Balance Hook
export interface LeaveBalance {
  userId: number;
  leaveTypeId: number;
  year: number;
  totalDays: number;
  usedDays: number;
}

export function useLeaveBalances() {
  const [balances, setBalances, clearBalances] = useLocalStorage<LeaveBalance[]>("hris_leave_balances", []);

  const getBalance = (userId: number, leaveTypeId: number) => {
    return balances.find(b => b.userId === userId && b.leaveTypeId === leaveTypeId);
  };

  const updateBalance = (userId: number, leaveTypeId: number, daysUsed: number) => {
    setBalances(prev => {
      const existing = prev.find(b => b.userId === userId && b.leaveTypeId === leaveTypeId);
      if (existing) {
        return prev.map(b =>
          b.userId === userId && b.leaveTypeId === leaveTypeId
            ? { ...b, usedDays: b.usedDays + daysUsed }
            : b
        );
      }
      return [...prev, { userId, leaveTypeId, year: new Date().getFullYear(), totalDays: 12, usedDays: daysUsed }];
    });
  };

  return { balances, getBalance, updateBalance, clearBalances };
}

// Attendance Hook
export interface Attendance {
  id: string;
  userId: number;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: "present" | "absent" | "late" | "on_leave";
}

export function useAttendance() {
  const [records, setRecords, clearRecords] = useLocalStorage<Attendance[]>("hris_attendance", []);

  const clockIn = (userId: number) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const time = now.toISOString();

    setRecords(prev => {
      const existing = prev.find(r => r.userId === userId && r.date === today);
      if (existing?.clockIn) return prev;

      if (existing) {
        return prev.map(r => r.id === existing.id ? { ...r, clockIn: time } : r);
      }
      return [...prev, {
        id: `att-${Date.now()}`,
        userId,
        date: today,
        clockIn: time,
        status: now.getHours() > 9 ? "late" : "present"
      }];
    });
  };

  const clockOut = (userId: number) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    setRecords(prev => prev.map(r =>
      r.userId === userId && r.date === today && !r.clockOut
        ? { ...r, clockOut: now.toISOString() }
        : r
    ));
  };

  const getTodayAttendance = (userId: number) => {
    const today = new Date().toISOString().split("T")[0];
    return records.find(r => r.userId === userId && r.date === today);
  };

  return { records, clockIn, clockOut, getTodayAttendance, clearRecords };
}

// User Modules Hook (for admin to manage)
export function useUserModules() {
  const [userModules, setUserModules, clearUserModules] = useLocalStorage<Record<number, string[]>>("hris_user_modules", {});

  const getUserModules = (userId: number): string[] => {
    return userModules[userId] || [];
  };

  const setUserModuleList = (userId: number, modules: string[]) => {
    setUserModules(prev => ({
      ...prev,
      [userId]: modules
    }));
  };

  const addModuleToUser = (userId: number, moduleKey: string) => {
    setUserModules(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), moduleKey]
    }));
  };

  const removeModuleFromUser = (userId: number, moduleKey: string) => {
    setUserModules(prev => ({
      ...prev,
      [userId]: (prev[userId] || []).filter(m => m !== moduleKey)
    }));
  };

  const toggleUserModule = (userId: number, moduleKey: string) => {
    const current = getUserModules(userId);
    if (current.includes(moduleKey)) {
      removeModuleFromUser(userId, moduleKey);
    } else {
      addModuleToUser(userId, moduleKey);
    }
  };

  return { userModules, getUserModules, setUserModuleList, addModuleToUser, removeModuleFromUser, toggleUserModule, clearUserModules };
}

// Announcement Hook
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  target: "all" | "department" | "user";
  department?: string;
  isRead: boolean;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements, clearAnnouncements] = useLocalStorage<Announcement[]>("hris_announcements", []);

  const addAnnouncement = (announcement: Omit<Announcement, "id" | "createdAt" | "isRead">) => {
    setAnnouncements(prev => [{
      ...announcement,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    }, ...prev]);
  };

  const markAsRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  return { announcements, addAnnouncement, markAsRead, clearAnnouncements };
}

// Clear all HRIS data
export function useClearAllData() {
  const clearAll = () => {
    const keys = [
      "hris_leave_balances",
      "hris_attendance",
      "hris_user_modules",
      "hris_announcements"
    ];
    keys.forEach(key => window.localStorage.removeItem(key));
    window.location.reload();
  };

  return clearAll;
}