"use client";

import { X } from "lucide-react";
import { useEffect, ReactNode } from "react";

interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 title: string;
 children: ReactNode;
 footer?: ReactNode;
 size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function Modal({
 isOpen,
 onClose,
 title,
 children,
 footer,
 size = "md",
}: ModalProps) {
 // Close on Escape key
 useEffect(() => {
 const handleEsc = (e: KeyboardEvent) => {
 if (e.key === "Escape") onClose();
 };
 if (isOpen) {
 window.addEventListener("keydown", handleEsc);
 // Prevent scrolling when modal is open
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
 sm: "max-w-md",
 md: "max-w-lg",
 lg: "max-w-2xl",
 xl: "max-w-4xl",
 "2xl": "max-w-6xl",
 };

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 {/* Backdrop */}
 <div
 className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
 onClick={onClose}
 />

 {/* Modal Container: Flat, no , clean border */}
 <div
 className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in-95`}
 >
 {/* Header */}
 <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
 <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
 <button
 onClick={onClose}
 className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 
 {/* Content */}
 <div className="flex-1 overflow-y-auto p-6 text-slate-600">
 {children}
 </div>
 
 {/* Footer */}
 {footer ? (
 <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 flex justify-end gap-2.5">
 {footer}
 </div>
 ) : null}
 </div>
 </div>
 );
}
