"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";

// ============================================
// REUSABLE TABLE COMPONENT
// Standardized styling for HRIS tables
// ============================================

interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (item: T, index: number) => string | number;
  renderRowExtra?: (item: T) => ReactNode;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  onRowClick?: (item: T) => void;
  showRowHover?: boolean;
  className?: string;
  tbodyClassName?: string;
}

// STANDARDIZED: Main Table Component
export function DataTable<T>({
  columns,
  data,
  rowKey,
  renderRowExtra,
  emptyMessage = "Tidak ada data ditemukan.",
  emptyIcon,
  onRowClick,
  showRowHover = true,
  className = "",
  tbodyClassName = "",
}: DataTableProps<T>) {
  const visibleColumns = columns.filter(col => !col.hideOnMobile);

  return (
    <div className={`bg-white border border-slate-100 rounded-xl overflow-hidden mt-2 ${className}`}>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left py-3 px-4 font-medium ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
              {renderRowExtra && (
                <th className="text-right py-3 px-4 font-medium">Opsi</th>
              )}
            </tr>
          </thead>
          <tbody className={`divide-y divide-slate-50 ${tbodyClassName}`}>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (renderRowExtra ? 1 : 0)}
                  className="py-12 text-center text-slate-400 font-medium text-sm"
                >
                  {emptyIcon && <div className="mb-2">{emptyIcon}</div>}
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const key = rowKey(item, index);
                const RowWrapper = onRowClick ? "tr" : "tr";
                return (
                  <RowWrapper
                    key={key}
                    onClick={() => onRowClick?.(item)}
                    className={`group transition-colors ${
                      showRowHover ? "hover:bg-slate-50/50 cursor-pointer" : ""
                    } ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className={`py-2.5 px-4 ${col.className || ""}`}
                      >
                        {col.render
                          ? col.render(item, index)
                          : (item as any)[col.key]}
                      </td>
                    ))}
                    {renderRowExtra && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 transition-opacity opacity-0 group-hover:opacity-100">
                          {renderRowExtra(item)}
                        </div>
                      </td>
                    )}
                  </RowWrapper>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// STANDARDIZED: Filter Bar Container
interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export function FilterBar({ children, className = "" }: FilterBarProps) {
  return (
    <div className={`py-3 mt-4 border-b border-slate-200 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {children}
      </div>
    </div>
  );
}

// STANDARDIZED: Status Filter Button
interface StatusFilterProps {
  options: string[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusFilter({ options, activeStatus, onStatusChange }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
      {options.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={`py-1 text-[13px] font-medium whitespace-nowrap transition-colors border-b-2 ${
            activeStatus === status
              ? "text-slate-900 border-slate-900"
              : "text-slate-500 border-transparent hover:text-slate-700"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

// STANDARDIZED: Search Input
interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableSearch({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
}: TableSearchProps) {
  return (
    <div className={`relative group min-w-[280px] ${className}`}>
      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 bg-transparent border border-slate-200 rounded-md text-[13px] focus:outline-none focus:border-slate-400 transition-all font-medium"
      />
    </div>
  );
}

// STANDARDIZED: Status Badge
interface StatusBadgeProps {
  status: string;
  statusColor?: {
    text: string;
    border: string;
    bg?: string;
  };
}

export function StatusBadge({ status, statusColor }: StatusBadgeProps) {
  const sc = statusColor || {
    text: "text-slate-500",
  };

  const LABELS: Record<string, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    accepted: "Diterima",
    rejected: "Ditolak",
    declined: "Ditolak",
    extended: "Diperpanjang",
    completed: "Selesai",
    active: "Aktif",
    on_hold: "Ditahan",
  };

  const label = LABELS[status] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${sc.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${sc.text.replace('text-', 'bg-')}`} />
      {label}
    </span>
  );
}

// STANDARDIZED: Action Button Icon
interface ActionButtonProps {
  icon: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  variant?: "default" | "primary" | "danger" | "success";
  className?: string;
}

export function ActionButton({
  icon,
  onClick,
  title,
  variant = "default",
  className = "",
}: ActionButtonProps) {
  const variantClasses = {
    default: "text-slate-400 hover:text-slate-700 hover:bg-slate-50",
    primary: "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50",
    danger: "text-red-500 hover:text-red-700 hover:bg-red-50",
    success: "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50",
  };

  return (
    <button
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      title={title}
      className={`p-1.5 transition-colors rounded-md ${variantClasses[variant]} ${className}`}
    >
      {icon}
    </button>
  );
}

// STANDARDIZED: Avatar Initial Badge
interface AvatarInitialProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarInitial({
  name,
  size = "md",
  className = "",
}: AvatarInitialProps) {
  const sizes = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-8 h-8 text-[10px]",
    lg: "w-9 h-9 text-xs",
  };

  return (
    <div
      className={`rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold ${sizes[size]} ${className}`}
    >
      {name?.charAt(0) || "?"}
    </div>
  );
}

// STANDARDIZED: User Info Cell
interface UserCellProps {
  name: string;
  subtitle?: string;
  subtitlePrefix?: string;
}

export function UserCell({ name, subtitle, subtitlePrefix = "#" }: UserCellProps) {
  return (
    <div className="flex items-center gap-3">
      <AvatarInitial name={name} size="sm" />
      <div>
        <p className="font-medium text-slate-900 leading-none mb-1">{name || "-"}</p>
        <p className="text-[11px] text-slate-500">
          {subtitlePrefix}{subtitle || "—"}
        </p>
      </div>
    </div>
  );
}