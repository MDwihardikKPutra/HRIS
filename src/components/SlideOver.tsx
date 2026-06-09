"use client";

import { X } from "lucide-react";
import { useEffect, ReactNode } from "react";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function SlideOver({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: SlideOverProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Prevent scrolling when slide-over is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      if (document.body) {
        document.body.style.overflow = "visible";
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-xl",
    xl: "max-w-3xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div
        className={`relative w-full ${sizeClasses[size]} h-full bg-white border-l border-slate-100 flex flex-col shadow-2xl transition-transform animate-in slide-in-from-right duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <h3 className="text-base font-black text-slate-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          {children}
        </div>
        
        {/* Footer */}
        {footer ? (
          <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
