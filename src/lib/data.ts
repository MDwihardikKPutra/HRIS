// ============================================
// HRIS Data Layer - JSON-based demo data
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  employeeId: string;
  department: string;
  position: string;
  isActive: boolean;
  avatar?: string;
  modules: string[];
}

export interface Project {
  id: number;
  name: string;
  code: string;
  status: "active" | "completed" | "on_hold";
  budget: number;
  managerId: number;
  description: string;
}

export interface WorkPlan {
  id: number;
  userId: number;
  projectId: number;
  planNumber: string;
  planDate: string;
  activities: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface WorkRealization {
  id: number;
  userId: number;
  projectId: number;
  realizationNumber: string;
  realizationDate: string;
  activities: string;
  progress: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface LeaveType {
  id: number;
  name: string;
  maxDays: number;
}

export interface LeaveRequest {
  id: number;
  userId: number;
  leaveTypeId: number;
  leaveNumber: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: number;
  createdAt: string;
}

export interface SPD {
  id: number;
  userId: number;
  projectId: number;
  spdNumber: string;
  destination: string;
  purpose: string;
  departureDate: string;
  returnDate: string;
  totalCost: number;
  status: "pending" | "approved" | "rejected";
  approvedBy?: number;
  createdAt: string;
}

export interface Purchase {
  id: number;
  userId: number;
  projectId: number;
  purchaseNumber: string;
  items: { name: string; qty: number; price: number }[];
  totalPrice: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: number;
  createdAt: string;
}

export interface VendorPayment {
  id: number;
  userId: number;
  vendorId: number;
  projectId: number;
  paymentNumber: string;
  invoiceNumber: string;
  amount: number;
  paymentType: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: number;
  createdAt: string;
}

export interface Vendor {
  id: number;
  name: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
}

// ============================================
// SYSTEM MODULES REGISTRY
// ============================================
export const SYSTEM_MODULES = [
  // Modul category (assignable to users)
  { key: "work-plan", label: "Rencana Kerja", category: "modul", isDefault: true },
  { key: "work-realization", label: "Realisasi Kerja", category: "modul", isDefault: true },
  { key: "leave", label: "Cuti & Izin", category: "modul", isDefault: false },
  { key: "spd", label: "SPD", category: "modul", isDefault: false },
  { key: "purchase", label: "Pembelian", category: "modul", isDefault: false },
  { key: "vendor-payment", label: "Pembayaran Vendor", category: "modul", isDefault: false },
  // Administrasi category (approval/admin functions)
  { key: "leave-approval", label: "Daftar Cuti & Izin", category: "administrasi", isDefault: false },
  { key: "payment-approval", label: "Approval Pembayaran", category: "administrasi", isDefault: false },
  { key: "project-management", label: "Project Management", category: "administrasi", isDefault: false },
  { key: "ear", label: "EAR", category: "administrasi", isDefault: false },
  { key: "user", label: "Manajemen User", category: "administrasi", isDefault: false },
  { key: "documentation", label: "Dokumentasi", category: "administrasi", isDefault: false },
];

// ============================================
// SEED DATA
// ============================================

export const users: User[] = [
  {
    id: 1,
    name: "Admin HRIS",
    email: "admin@hris.local",
    password: "password",
    role: "admin",
    employeeId: "ADM001",
    department: "IT",
    position: "Administrator",
    isActive: true,
    modules: ["all"],
  },
  {
    id: 2,
    name: "Budi Santoso",
    email: "user@hris.local",
    password: "password",
    role: "user",
    employeeId: "EMP002",
    department: "Engineering",
    position: "Project Manager",
    isActive: true,
    modules: ["work-plan", "work-realization", "leave", "spd", "purchase"],
  },
  {
    id: 3,
    name: "Siti Nurhaliza",
    email: "siti@hris.local",
    password: "password",
    role: "user",
    employeeId: "EMP003",
    department: "Engineering",
    position: "Senior Engineer",
    isActive: true,
    modules: ["work-plan", "work-realization", "leave"],
  },
  {
    id: 4,
    name: "Ahmad Yani",
    email: "ahmad@hris.local",
    password: "password",
    role: "user",
    employeeId: "EMP004",
    department: "Engineering",
    position: "Engineer",
    isActive: true,
    modules: ["work-plan", "work-realization", "leave"],
  },
  {
    id: 5,
    name: "Dewi Sartika",
    email: "dewi@hris.local",
    password: "password",
    role: "user",
    employeeId: "EMP005",
    department: "Finance",
    position: "Finance Officer",
    isActive: true,
    modules: ["work-plan", "work-realization", "leave", "purchase", "vendor-payment"],
  },
  {
    id: 6,
    name: "Rizki Pratama",
    email: "rizki@hris.local",
    password: "password",
    role: "user",
    employeeId: "EMP006",
    department: "Procurement",
    position: "Procurement Officer",
    isActive: true,
    modules: ["work-plan", "work-realization", "purchase", "vendor-payment"],
  },
];

export const projects: Project[] = [
  { id: 1, name: "PLTU Jawa Tengah", code: "PRJ-001", status: "active", budget: 5000000000, managerId: 2, description: "Pembangunan PLTU di Jawa Tengah" },
  { id: 2, name: "Pipeline Kalimantan", code: "PRJ-002", status: "active", budget: 3200000000, managerId: 2, description: "Pemasangan pipeline di Kalimantan" },
  { id: 3, name: "Refinery Upgrade Cilacap", code: "PRJ-003", status: "on_hold", budget: 8000000000, managerId: 3, description: "Upgrade fasilitas refinery Cilacap" },
  { id: 4, name: "Solar Panel Installation Bali", code: "PRJ-004", status: "active", budget: 1500000000, managerId: 4, description: "Instalasi panel surya di Bali" },
  { id: 5, name: "Wind Farm Sulawesi", code: "PRJ-005", status: "completed", budget: 6000000000, managerId: 2, description: "Pembangunan wind farm di Sulawesi" },
];

export const leaveTypes: LeaveType[] = [
  { id: 1, name: "Cuti Tahunan", maxDays: 12 },
  { id: 2, name: "Cuti Sakit", maxDays: 30 },
  { id: 3, name: "Cuti Melahirkan", maxDays: 90 },
  { id: 4, name: "Izin Pribadi", maxDays: 3 },
  { id: 5, name: "Cuti Besar", maxDays: 30 },
];

export const vendors: Vendor[] = [
  { id: 1, name: "PT Baja Utama", company: "PT Baja Utama Indonesia", contactPerson: "Hendra", email: "hendra@bajautama.co.id", phone: "021-5551234" },
  { id: 2, name: "CV Mitra Teknik", company: "CV Mitra Teknik Sejahtera", contactPerson: "Agus", email: "agus@mitrateknik.com", phone: "021-5555678" },
  { id: 3, name: "PT Elektrik Prima", company: "PT Elektrik Prima Nusantara", contactPerson: "Rina", email: "rina@elektrikprima.co.id", phone: "021-5559012" },
];

export const workPlans: WorkPlan[] = [
  { id: 1, userId: 2, projectId: 1, planNumber: "WP-2026-001", planDate: "2026-04-07", activities: "Survey lokasi dan koordinasi dengan tim lapangan untuk persiapan fondasi", status: "approved", createdAt: "2026-04-07T08:00:00" },
  { id: 2, userId: 3, projectId: 1, planNumber: "WP-2026-002", planDate: "2026-04-07", activities: "Review design engineering dan kalkulasi struktur baja", status: "approved", createdAt: "2026-04-07T08:30:00" },
  { id: 3, userId: 4, projectId: 2, planNumber: "WP-2026-003", planDate: "2026-04-07", activities: "Pengecekan material pipa dan fitting di gudang", status: "pending", createdAt: "2026-04-07T09:00:00" },
  { id: 4, userId: 2, projectId: 2, planNumber: "WP-2026-004", planDate: "2026-04-08", activities: "Meeting progres mingguan dengan kontraktor pipeline", status: "pending", createdAt: "2026-04-08T07:30:00" },
  { id: 5, userId: 5, projectId: 4, planNumber: "WP-2026-005", planDate: "2026-04-08", activities: "Persiapan dokumen pengadaan panel surya batch kedua", status: "pending", createdAt: "2026-04-08T08:00:00" },
  { id: 6, userId: 3, projectId: 3, planNumber: "WP-2026-006", planDate: "2026-04-06", activities: "Analisis kapasitas output refinery existing", status: "approved", createdAt: "2026-04-06T08:00:00" },
  { id: 7, userId: 6, projectId: 1, planNumber: "WP-2026-007", planDate: "2026-04-05", activities: "Koordinasi pengadaan material konstruksi fase 2", status: "rejected", createdAt: "2026-04-05T08:30:00" },
];

export const workRealizations: WorkRealization[] = [
  { id: 1, userId: 2, projectId: 1, realizationNumber: "WR-2026-001", realizationDate: "2026-04-07", activities: "Survey lokasi selesai, titik koordinat fondasi sudah ditandai", progress: 100, status: "approved", createdAt: "2026-04-07T17:00:00" },
  { id: 2, userId: 3, projectId: 1, realizationNumber: "WR-2026-002", realizationDate: "2026-04-07", activities: "Review design 80% selesai, masih ada revisi minor di bagian beam", progress: 80, status: "approved", createdAt: "2026-04-07T17:30:00" },
  { id: 3, userId: 4, projectId: 2, realizationNumber: "WR-2026-003", realizationDate: "2026-04-07", activities: "Material pipa 90% tersedia, waiting 2 items from vendor", progress: 90, status: "pending", createdAt: "2026-04-07T16:45:00" },
  { id: 4, userId: 3, projectId: 3, realizationNumber: "WR-2026-004", realizationDate: "2026-04-06", activities: "Analisis kapasitas selesai, output report sudah dibuat", progress: 100, status: "approved", createdAt: "2026-04-06T17:00:00" },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 1, userId: 3, leaveTypeId: 1, leaveNumber: "LV-2026-001", startDate: "2026-04-15", endDate: "2026-04-18", totalDays: 4, reason: "Liburan keluarga", status: "approved", approvedBy: 1, createdAt: "2026-04-05T10:00:00" },
  { id: 2, userId: 4, leaveTypeId: 2, leaveNumber: "LV-2026-002", startDate: "2026-04-10", endDate: "2026-04-11", totalDays: 2, reason: "Sakit demam", status: "approved", approvedBy: 1, createdAt: "2026-04-09T08:00:00" },
  { id: 3, userId: 2, leaveTypeId: 1, leaveNumber: "LV-2026-003", startDate: "2026-04-20", endDate: "2026-04-25", totalDays: 5, reason: "Acara keluarga di luar kota", status: "pending", createdAt: "2026-04-07T14:00:00" },
  { id: 4, userId: 5, leaveTypeId: 4, leaveNumber: "LV-2026-004", startDate: "2026-04-12", endDate: "2026-04-12", totalDays: 1, reason: "Urusan pribadi", status: "pending", createdAt: "2026-04-08T09:00:00" },
  { id: 5, userId: 6, leaveTypeId: 1, leaveNumber: "LV-2026-005", startDate: "2026-05-01", endDate: "2026-05-03", totalDays: 3, reason: "Mudik lebaran", status: "rejected", createdAt: "2026-04-01T10:00:00" },
];

export const spds: SPD[] = [
  { id: 1, userId: 2, projectId: 1, spdNumber: "SPD-2026-001", destination: "Semarang, Jawa Tengah", purpose: "Site visit dan inspeksi progress konstruksi PLTU", departureDate: "2026-04-10", returnDate: "2026-04-12", totalCost: 4500000, status: "approved", approvedBy: 1, createdAt: "2026-04-05T09:00:00" },
  { id: 2, userId: 4, projectId: 2, spdNumber: "SPD-2026-002", destination: "Balikpapan, Kalimantan", purpose: "Koordinasi pemasangan pipeline section 3", departureDate: "2026-04-15", returnDate: "2026-04-18", totalCost: 8200000, status: "pending", createdAt: "2026-04-07T10:00:00" },
  { id: 3, userId: 3, projectId: 4, spdNumber: "SPD-2026-003", destination: "Denpasar, Bali", purpose: "Survey lokasi instalasi panel surya tambahan", departureDate: "2026-04-20", returnDate: "2026-04-22", totalCost: 5800000, status: "pending", createdAt: "2026-04-08T08:00:00" },
];

export const purchases: Purchase[] = [
  { id: 1, userId: 6, projectId: 1, purchaseNumber: "PO-2026-001", items: [{ name: "Baja H-Beam 200x200", qty: 50, price: 3500000 }, { name: "Baut Anchor M24", qty: 200, price: 45000 }], totalPrice: 184000000, description: "Material struktur fondasi PLTU", status: "approved", approvedBy: 1, createdAt: "2026-04-03T09:00:00" },
  { id: 2, userId: 5, projectId: 2, purchaseNumber: "PO-2026-002", items: [{ name: "Pipa Carbon Steel 6 inch", qty: 100, price: 2800000 }, { name: "Elbow 90° 6 inch", qty: 30, price: 450000 }], totalPrice: 293500000, description: "Material pipeline section 3", status: "pending", createdAt: "2026-04-06T14:00:00" },
  { id: 3, userId: 6, projectId: 4, purchaseNumber: "PO-2026-003", items: [{ name: "Solar Panel 450W", qty: 200, price: 4200000 }, { name: "Inverter 10kW", qty: 10, price: 15000000 }], totalPrice: 990000000, description: "Solar panel dan inverter untuk instalasi Bali", status: "pending", createdAt: "2026-04-08T11:00:00" },
];

export const vendorPayments: VendorPayment[] = [
  { id: 1, userId: 5, vendorId: 1, projectId: 1, paymentNumber: "VP-2026-001", invoiceNumber: "INV-BU-0412", amount: 184000000, paymentType: "material", description: "Pembayaran material baja H-Beam dan anchor bolt", status: "approved", approvedBy: 1, createdAt: "2026-04-04T10:00:00" },
  { id: 2, userId: 6, vendorId: 2, projectId: 2, paymentNumber: "VP-2026-002", invoiceNumber: "INV-MT-0285", amount: 95000000, paymentType: "service", description: "Jasa welding dan fabrikasi fitting pipeline", status: "pending", createdAt: "2026-04-07T15:00:00" },
  { id: 3, userId: 5, vendorId: 3, projectId: 4, paymentNumber: "VP-2026-003", invoiceNumber: "INV-EP-0198", amount: 650000000, paymentType: "material", description: "DP 65% pembelian panel surya dan inverter", status: "pending", createdAt: "2026-04-08T09:30:00" },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getUserById(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

export function getProjectById(id: number): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getVendorById(id: number): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}

export function getLeaveTypeById(id: number): LeaveType | undefined {
  return leaveTypes.find((lt) => lt.id === id);
}

export function formatCurrency(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getStatusColor(status: string) {
  switch (status) {
    case "approved":
    case "completed":
    case "active":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" };
    case "pending":
    case "on_hold":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" };
    case "rejected":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" };
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" };
  }
}
export function getPendingApprovalsCount() {
  const pendingLeaves = leaveRequests.filter(l => l.status === "pending").length;
  const pendingSpds = spds.filter(s => s.status === "pending").length;
  const pendingPurchases = purchases.filter(p => p.status === "pending").length;
  const pendingPayments = vendorPayments.filter(v => v.status === "pending").length;
  
  return {
    leave: pendingLeaves,
    finance: pendingSpds + pendingPurchases + pendingPayments,
    total: pendingLeaves + pendingSpds + pendingPurchases + pendingPayments
  };
}

export interface ProjectTeam {
  id: number;
  projectId: number;
  userId: number;
  role: string;
}

export const projectTeams: ProjectTeam[] = [
  { id: 1, projectId: 1, userId: 2, role: "Project Manager" },
  { id: 2, projectId: 1, userId: 3, role: "Lead Engineer" },
  { id: 3, projectId: 1, userId: 6, role: "Procurement Lead" },
  { id: 4, projectId: 2, userId: 2, role: "Project Manager" },
  { id: 5, projectId: 2, userId: 4, role: "Field Engineer" },
];

export function getProjectTeam(projectId: number): ProjectTeam[] {
  return projectTeams.filter(pt => pt.projectId === projectId);
}
