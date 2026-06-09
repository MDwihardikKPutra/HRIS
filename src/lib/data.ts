// ============================================
// HRIS Data Layer - JSON-based demo data
// ============================================

export type UserRole = "admin" | "hr" | "finance" | "karyawan" | "project_manager";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  employeeId: string;
  department: string;
  position: string;
  isActive: boolean;
  avatar?: string;
  baseSalary?: number;
  allowanceMeal?: number;
  allowanceTransport?: number;
  allowancePositionPct?: number;
  deductionBpjsKesehatanPct?: number;
  deductionBpjsKetenagakerjaanPct?: number;
  deductionPph21Pct?: number;
}

// Role descriptions for display
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  hr: "HR Manager",
  finance: "Finance",
  karyawan: "Karyawan",
  project_manager: "Project Manager"
};

// Role-based access configuration
export const ROLE_ACCESS = {
  admin: {
    canApproveLeave: true,
    canApprovePayment: true,
    canManageUsers: true,
    canManageProjects: true,
    canViewEAR: true,
    canManageDocumentation: true,
    canViewAllActivities: true,
    canManagePayroll: true,
  },
  hr: {
    canApproveLeave: true,
    canApprovePayment: false,
    canManageUsers: true,
    canManageProjects: false,
    canViewEAR: true,
    canManageDocumentation: true,
    canViewAllActivities: true,
    canManagePayroll: false,
  },
  finance: {
    canApproveLeave: false,
    canApprovePayment: true,
    canManageUsers: false,
    canManageProjects: false,
    canViewEAR: false,
    canManageDocumentation: true,
    canViewAllActivities: true,
    canManagePayroll: true,
  },
  karyawan: {
    canApproveLeave: false,
    canApprovePayment: false,
    canManageUsers: false,
    canManageProjects: false,
    canViewEAR: false,
    canManageDocumentation: true,
    canViewAllActivities: false,
    canManagePayroll: false,
  },
  project_manager: {
    canApproveLeave: false,
    canApprovePayment: false,
    canManageUsers: false,
    canManageProjects: true,
    canViewEAR: true,
    canManageDocumentation: true,
    canViewAllActivities: false,
    canManagePayroll: false,
  }
};

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
    "id": 1,
    "name": "Rina Wijaya",
    "email": "admin@hris.local",
    "password": "password",
    "role": "admin",
    "employeeId": "ADM001",
    "department": "IT",
    "position": "System Administrator",
    "isActive": true,
    "baseSalary": 20000000,
    "allowanceMeal": 1000000,
    "allowanceTransport": 1500000,
    "allowancePositionPct": 10,
    "deductionBpjsKesehatanPct": 1,
    "deductionBpjsKetenagakerjaanPct": 2,
    "deductionPph21Pct": 5
  },
  {
    "id": 2,
    "name": "Dewi Lestari",
    "email": "hr@hris.local",
    "password": "password",
    "role": "hr",
    "employeeId": "HR001",
    "department": "Human Resource",
    "position": "HR Manager",
    "isActive": true,
    "baseSalary": 15000000,
    "allowanceMeal": 1000000,
    "allowanceTransport": 1000000
  },
  {
    "id": 3,
    "name": "Ahmad Hidayat",
    "email": "finance@hris.local",
    "password": "password",
    "role": "finance",
    "employeeId": "FIN001",
    "department": "Finance",
    "position": "Finance Manager",
    "isActive": true,
    "baseSalary": 16000000,
    "allowanceMeal": 1000000,
    "allowanceTransport": 1000000
  },
  {
    "id": 4,
    "name": "Dimas Anggara",
    "email": "pm@hris.local",
    "password": "password",
    "role": "project_manager",
    "employeeId": "PM001",
    "department": "Project Management",
    "position": "Senior Project Manager",
    "isActive": true,
    "baseSalary": 18000000,
    "allowanceMeal": 1000000,
    "allowanceTransport": 2000000
  },
  {
    "id": 5,
    "name": "Budi Santoso",
    "email": "budi@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP001",
    "department": "Engineering",
    "position": "Project Engineer",
    "isActive": true,
    "baseSalary": 10000000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 6,
    "name": "Siti Nurhaliza",
    "email": "siti@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP002",
    "department": "Engineering",
    "position": "Senior Engineer",
    "isActive": true,
    "baseSalary": 12000000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 7,
    "name": "Andi Pratama",
    "email": "andi@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP003",
    "department": "Engineering",
    "position": "Engineer",
    "isActive": true,
    "baseSalary": 9000000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 8,
    "name": "Rizki Pratama",
    "email": "rizki@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP004",
    "department": "Procurement",
    "position": "Procurement Officer",
    "isActive": true,
    "baseSalary": 8000000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 9,
    "name": "Mega Sari",
    "email": "mega@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP005",
    "department": "Finance",
    "position": "Accountant",
    "isActive": true,
    "baseSalary": 8500000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 10,
    "name": "Fajar Nugroho",
    "email": "fajar@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP006",
    "department": "Engineering",
    "position": "Site Supervisor",
    "isActive": true,
    "baseSalary": 11000000,
    "allowanceMeal": 700000,
    "allowanceTransport": 800000
  },
  {
    "id": 11,
    "name": "Nadia Utami",
    "email": "nadia@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP007",
    "department": "Engineering",
    "position": "Junior Engineer",
    "isActive": true,
    "baseSalary": 7000000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 12,
    "name": "Hendra Wijaya",
    "email": "hendra@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP008",
    "department": "Procurement",
    "position": "Procurement Staff",
    "isActive": true,
    "baseSalary": 6500000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 13,
    "name": "Lisa Permata",
    "email": "lisa@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP009",
    "department": "Human Resource",
    "position": "HR Staff",
    "isActive": true,
    "baseSalary": 7000000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 14,
    "name": "Bayu Setiawan",
    "email": "bayu@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP010",
    "department": "Engineering",
    "position": "Field Engineer",
    "isActive": true,
    "baseSalary": 9500000,
    "allowanceMeal": 600000,
    "allowanceTransport": 700000
  },
  {
    "id": 15,
    "name": "Toko Sinar",
    "email": "toko@hris.local",
    "password": "password",
    "role": "finance",
    "employeeId": "FIN002",
    "department": "Finance",
    "position": "Finance Staff",
    "isActive": true,
    "baseSalary": 7000000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 16,
    "name": "Gita Wiryawan",
    "email": "pm2@hris.local",
    "password": "password",
    "role": "project_manager",
    "employeeId": "PM002",
    "department": "Project Management",
    "position": "Project Manager",
    "isActive": true,
    "baseSalary": 16000000,
    "allowanceMeal": 1000000,
    "allowanceTransport": 1500000
  },
  {
    "id": 17,
    "name": "Cahyo Kumolo",
    "email": "cahyo@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP011",
    "department": "IT",
    "position": "IT Support",
    "isActive": true,
    "baseSalary": 7500000,
    "allowanceMeal": 500000,
    "allowanceTransport": 500000
  },
  {
    "id": 18,
    "name": "Dina Mariana",
    "email": "dina@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP012",
    "department": "Legal",
    "position": "Legal Counsel",
    "isActive": true,
    "baseSalary": 13000000,
    "allowanceMeal": 800000,
    "allowanceTransport": 1000000
  },
  {
    "id": 19,
    "name": "Eko Patrio",
    "email": "eko@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP013",
    "department": "Marketing",
    "position": "Marketing Specialist",
    "isActive": true,
    "baseSalary": 8500000,
    "allowanceMeal": 500000,
    "allowanceTransport": 700000
  },
  {
    "id": 20,
    "name": "Farah Quinn",
    "email": "farah@hris.local",
    "password": "password",
    "role": "karyawan",
    "employeeId": "EMP014",
    "department": "Engineering",
    "position": "Architect",
    "isActive": true,
    "baseSalary": 14000000,
    "allowanceMeal": 800000,
    "allowanceTransport": 1000000
  }
];

export const projects: Project[] = [
  {
    "id": 1,
    "name": "PLTU Jawa Tengah",
    "code": "PRJ-001",
    "status": "active",
    "budget": 5000000000,
    "managerId": 4,
    "description": "Pembangunan PLTU di Jawa Tengah"
  },
  {
    "id": 2,
    "name": "Pipeline Kalimantan",
    "code": "PRJ-002",
    "status": "active",
    "budget": 3200000000,
    "managerId": 4,
    "description": "Pemasangan pipeline di Kalimantan"
  },
  {
    "id": 3,
    "name": "Refinery Upgrade Cilacap",
    "code": "PRJ-003",
    "status": "on_hold",
    "budget": 8000000000,
    "managerId": 16,
    "description": "Upgrade fasilitas refinery Cilacap"
  },
  {
    "id": 4,
    "name": "Solar Panel Installation Bali",
    "code": "PRJ-004",
    "status": "active",
    "budget": 1500000000,
    "managerId": 16,
    "description": "Instalasi panel surya di Bali"
  },
  {
    "id": 5,
    "name": "Wind Farm Sulawesi",
    "code": "PRJ-005",
    "status": "completed",
    "budget": 6000000000,
    "managerId": 4,
    "description": "Pembangunan wind farm di Sulawesi"
  },
  {
    "id": 6,
    "name": "Geothermal Power Plant Sumut",
    "code": "PRJ-006",
    "status": "active",
    "budget": 12000000000,
    "managerId": 16,
    "description": "Pengembangan Geothermal di Sumatera Utara"
  },
  {
    "id": 7,
    "name": "Dam Construction Papua",
    "code": "PRJ-007",
    "status": "active",
    "budget": 9500000000,
    "managerId": 4,
    "description": "Konstruksi bendungan air di Papua"
  },
  {
    "id": 8,
    "name": "Smart Grid Implementation Jakarta",
    "code": "PRJ-008",
    "status": "active",
    "budget": 4000000000,
    "managerId": 16,
    "description": "Implementasi Smart Grid di wilayah Jakarta Raya"
  },
  {
    "id": 9,
    "name": "Offshore Platform Maintenance",
    "code": "PRJ-009",
    "status": "on_hold",
    "budget": 7500000000,
    "managerId": 4,
    "description": "Maintenance platform lepas pantai"
  },
  {
    "id": 10,
    "name": "Electric Vehicle Charging Stations",
    "code": "PRJ-010",
    "status": "completed",
    "budget": 2000000000,
    "managerId": 16,
    "description": "Instalasi SPKLU di jalan tol Trans Jawa"
  }
];

export const leaveTypes: LeaveType[] = [
  {
    "id": 1,
    "name": "Cuti Tahunan",
    "maxDays": 12
  },
  {
    "id": 2,
    "name": "Cuti Sakit",
    "maxDays": 30
  },
  {
    "id": 3,
    "name": "Cuti Melahirkan",
    "maxDays": 90
  },
  {
    "id": 4,
    "name": "Izin Pribadi",
    "maxDays": 3
  },
  {
    "id": 5,
    "name": "Cuti Besar",
    "maxDays": 30
  }
];

export const vendors: Vendor[] = [
  {
    "id": 1,
    "name": "PT Baja Utama",
    "company": "PT Baja Utama Indonesia",
    "contactPerson": "Hendra",
    "email": "hendra@bajautama.co.id",
    "phone": "021-5551234"
  },
  {
    "id": 2,
    "name": "CV Mitra Teknik",
    "company": "CV Mitra Teknik Sejahtera",
    "contactPerson": "Agus",
    "email": "agus@mitrateknik.com",
    "phone": "021-5555678"
  },
  {
    "id": 3,
    "name": "PT Elektrik Prima",
    "company": "PT Elektrik Prima Nusantara",
    "contactPerson": "Rina",
    "email": "rina@elektrikprima.co.id",
    "phone": "021-5559012"
  },
  {
    "id": 4,
    "name": "PT Beton Kuat",
    "company": "PT Beton Kuat Persada",
    "contactPerson": "Bambang",
    "email": "bambang@betonkuat.com",
    "phone": "021-5553333"
  },
  {
    "id": 5,
    "name": "PT Kabel Indo",
    "company": "PT Kabel Nusantara",
    "contactPerson": "Siska",
    "email": "siska@kabelindo.com",
    "phone": "021-5554444"
  }
];

export const workPlans: WorkPlan[] = [
  {
    "id": 1,
    "userId": 4,
    "projectId": 9,
    "planNumber": "WP-2026-001",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 2,
    "userId": 16,
    "projectId": 8,
    "planNumber": "WP-2026-002",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 1 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 3,
    "userId": 4,
    "projectId": 5,
    "planNumber": "WP-2026-003",
    "planDate": "2026-02-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 4,
    "userId": 17,
    "projectId": 10,
    "planNumber": "WP-2026-004",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 1 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 5,
    "userId": 16,
    "projectId": 8,
    "planNumber": "WP-2026-005",
    "planDate": "2026-02-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 6,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-006",
    "planDate": "2026-04-15",
    "activities": "Pelaksanaan tugas fase 3 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-04-10T08:00:00"
  },
  {
    "id": 7,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-007",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 8,
    "userId": 4,
    "projectId": 5,
    "planNumber": "WP-2026-008",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 1 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 9,
    "userId": 7,
    "projectId": 6,
    "planNumber": "WP-2026-009",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-04-10T08:00:00"
  },
  {
    "id": 10,
    "userId": 19,
    "projectId": 3,
    "planNumber": "WP-2026-010",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 11,
    "userId": 8,
    "projectId": 6,
    "planNumber": "WP-2026-011",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 3 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 12,
    "userId": 8,
    "projectId": 10,
    "planNumber": "WP-2026-012",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-04-10T08:00:00"
  },
  {
    "id": 13,
    "userId": 4,
    "projectId": 2,
    "planNumber": "WP-2026-013",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 14,
    "userId": 10,
    "projectId": 8,
    "planNumber": "WP-2026-014",
    "planDate": "2026-02-15",
    "activities": "Pelaksanaan tugas fase 3 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-04-10T08:00:00"
  },
  {
    "id": 15,
    "userId": 6,
    "projectId": 10,
    "planNumber": "WP-2026-015",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 16,
    "userId": 4,
    "projectId": 9,
    "planNumber": "WP-2026-016",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 17,
    "userId": 4,
    "projectId": 2,
    "planNumber": "WP-2026-017",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 18,
    "userId": 18,
    "projectId": 3,
    "planNumber": "WP-2026-018",
    "planDate": "2026-04-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 19,
    "userId": 18,
    "projectId": 4,
    "planNumber": "WP-2026-019",
    "planDate": "2026-04-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 20,
    "userId": 4,
    "projectId": 5,
    "planNumber": "WP-2026-020",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 21,
    "userId": 8,
    "projectId": 2,
    "planNumber": "WP-2026-021",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 22,
    "userId": 16,
    "projectId": 3,
    "planNumber": "WP-2026-022",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 23,
    "userId": 20,
    "projectId": 1,
    "planNumber": "WP-2026-023",
    "planDate": "2026-02-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-04-10T08:00:00"
  },
  {
    "id": 24,
    "userId": 16,
    "projectId": 3,
    "planNumber": "WP-2026-024",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 25,
    "userId": 7,
    "projectId": 5,
    "planNumber": "WP-2026-025",
    "planDate": "2026-02-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 26,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-026",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 27,
    "userId": 20,
    "projectId": 1,
    "planNumber": "WP-2026-027",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 3 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 28,
    "userId": 16,
    "projectId": 8,
    "planNumber": "WP-2026-028",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 29,
    "userId": 4,
    "projectId": 2,
    "planNumber": "WP-2026-029",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 30,
    "userId": 20,
    "projectId": 1,
    "planNumber": "WP-2026-030",
    "planDate": "2026-04-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 31,
    "userId": 5,
    "projectId": 9,
    "planNumber": "WP-2026-031",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 32,
    "userId": 16,
    "projectId": 6,
    "planNumber": "WP-2026-032",
    "planDate": "2026-01-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 33,
    "userId": 7,
    "projectId": 5,
    "planNumber": "WP-2026-033",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 1 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 34,
    "userId": 4,
    "projectId": 2,
    "planNumber": "WP-2026-034",
    "planDate": "2026-04-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 35,
    "userId": 6,
    "projectId": 8,
    "planNumber": "WP-2026-035",
    "planDate": "2026-02-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 36,
    "userId": 16,
    "projectId": 4,
    "planNumber": "WP-2026-036",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 37,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-037",
    "planDate": "2026-03-15",
    "activities": "Pelaksanaan tugas fase 1 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 38,
    "userId": 5,
    "projectId": 1,
    "planNumber": "WP-2026-038",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 39,
    "userId": 12,
    "projectId": 6,
    "planNumber": "WP-2026-039",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 40,
    "userId": 4,
    "projectId": 2,
    "planNumber": "WP-2026-040",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "rejected",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 41,
    "userId": 10,
    "projectId": 4,
    "planNumber": "WP-2026-041",
    "planDate": "2026-02-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 42,
    "userId": 5,
    "projectId": 1,
    "planNumber": "WP-2026-042",
    "planDate": "2026-04-15",
    "activities": "Pelaksanaan tugas fase 3 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 43,
    "userId": 10,
    "projectId": 8,
    "planNumber": "WP-2026-043",
    "planDate": "2026-04-15",
    "activities": "Pelaksanaan tugas fase 1 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-04-10T08:00:00"
  },
  {
    "id": 44,
    "userId": 4,
    "projectId": 5,
    "planNumber": "WP-2026-044",
    "planDate": "2026-02-15",
    "activities": "Pelaksanaan tugas fase 3 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 45,
    "userId": 18,
    "projectId": 4,
    "planNumber": "WP-2026-045",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 4 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 46,
    "userId": 7,
    "projectId": 5,
    "planNumber": "WP-2026-046",
    "planDate": "2026-04-15",
    "activities": "Pelaksanaan tugas fase 3 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 47,
    "userId": 10,
    "projectId": 8,
    "planNumber": "WP-2026-047",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 48,
    "userId": 6,
    "projectId": 10,
    "planNumber": "WP-2026-048",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 1 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 49,
    "userId": 18,
    "projectId": 7,
    "planNumber": "WP-2026-049",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 2 untuk instalasi modul utama.",
    "status": "pending",
    "createdAt": "2026-04-10T08:00:00"
  },
  {
    "id": 50,
    "userId": 16,
    "projectId": 4,
    "planNumber": "WP-2026-050",
    "planDate": "2026-05-15",
    "activities": "Pelaksanaan tugas fase 5 untuk instalasi modul utama.",
    "status": "approved",
    "createdAt": "2026-02-10T08:00:00"
  }
];

export const workRealizations: WorkRealization[] = [
  {
    "id": 1,
    "userId": 4,
    "projectId": 9,
    "realizationNumber": "WR-2026-001",
    "realizationDate": "2026-02-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 86,
    "status": "approved",
    "createdAt": "2026-02-20T17:00:00"
  },
  {
    "id": 2,
    "userId": 16,
    "projectId": 8,
    "realizationNumber": "WR-2026-002",
    "realizationDate": "2026-03-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 89,
    "status": "approved",
    "createdAt": "2026-03-20T17:00:00"
  },
  {
    "id": 3,
    "userId": 4,
    "projectId": 5,
    "realizationNumber": "WR-2026-003",
    "realizationDate": "2026-04-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 66,
    "status": "rejected",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 5,
    "userId": 16,
    "projectId": 8,
    "realizationNumber": "WR-2026-005",
    "realizationDate": "2026-04-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 56,
    "status": "pending",
    "createdAt": "2026-03-20T17:00:00"
  },
  {
    "id": 7,
    "userId": 6,
    "projectId": 9,
    "realizationNumber": "WR-2026-007",
    "realizationDate": "2026-03-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 83,
    "status": "pending",
    "createdAt": "2026-02-20T17:00:00"
  },
  {
    "id": 8,
    "userId": 4,
    "projectId": 5,
    "realizationNumber": "WR-2026-008",
    "realizationDate": "2026-01-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 41,
    "status": "approved",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 13,
    "userId": 4,
    "projectId": 2,
    "realizationNumber": "WR-2026-013",
    "realizationDate": "2026-05-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 90,
    "status": "rejected",
    "createdAt": "2026-02-20T17:00:00"
  },
  {
    "id": 14,
    "userId": 10,
    "projectId": 8,
    "realizationNumber": "WR-2026-014",
    "realizationDate": "2026-05-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 66,
    "status": "pending",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 15,
    "userId": 6,
    "projectId": 10,
    "realizationNumber": "WR-2026-015",
    "realizationDate": "2026-05-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 72,
    "status": "approved",
    "createdAt": "2026-03-20T17:00:00"
  },
  {
    "id": 17,
    "userId": 4,
    "projectId": 2,
    "realizationNumber": "WR-2026-017",
    "realizationDate": "2026-03-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 71,
    "status": "approved",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 20,
    "userId": 4,
    "projectId": 5,
    "realizationNumber": "WR-2026-020",
    "realizationDate": "2026-01-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 74,
    "status": "pending",
    "createdAt": "2026-05-20T17:00:00"
  },
  {
    "id": 21,
    "userId": 8,
    "projectId": 2,
    "realizationNumber": "WR-2026-021",
    "realizationDate": "2026-01-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 94,
    "status": "approved",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 22,
    "userId": 16,
    "projectId": 3,
    "realizationNumber": "WR-2026-022",
    "realizationDate": "2026-02-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 71,
    "status": "approved",
    "createdAt": "2026-03-20T17:00:00"
  },
  {
    "id": 24,
    "userId": 16,
    "projectId": 3,
    "realizationNumber": "WR-2026-024",
    "realizationDate": "2026-02-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 43,
    "status": "approved",
    "createdAt": "2026-03-20T17:00:00"
  },
  {
    "id": 27,
    "userId": 20,
    "projectId": 1,
    "realizationNumber": "WR-2026-027",
    "realizationDate": "2026-03-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 69,
    "status": "rejected",
    "createdAt": "2026-03-20T17:00:00"
  },
  {
    "id": 28,
    "userId": 16,
    "projectId": 8,
    "realizationNumber": "WR-2026-028",
    "realizationDate": "2026-03-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 47,
    "status": "approved",
    "createdAt": "2026-05-20T17:00:00"
  },
  {
    "id": 30,
    "userId": 20,
    "projectId": 1,
    "realizationNumber": "WR-2026-030",
    "realizationDate": "2026-05-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 65,
    "status": "approved",
    "createdAt": "2026-01-20T17:00:00"
  },
  {
    "id": 31,
    "userId": 5,
    "projectId": 9,
    "realizationNumber": "WR-2026-031",
    "realizationDate": "2026-01-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 47,
    "status": "approved",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 34,
    "userId": 4,
    "projectId": 2,
    "realizationNumber": "WR-2026-034",
    "realizationDate": "2026-01-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 51,
    "status": "pending",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 35,
    "userId": 6,
    "projectId": 8,
    "realizationNumber": "WR-2026-035",
    "realizationDate": "2026-04-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 46,
    "status": "rejected",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 37,
    "userId": 6,
    "projectId": 9,
    "realizationNumber": "WR-2026-037",
    "realizationDate": "2026-01-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 90,
    "status": "approved",
    "createdAt": "2026-01-20T17:00:00"
  },
  {
    "id": 44,
    "userId": 4,
    "projectId": 5,
    "realizationNumber": "WR-2026-044",
    "realizationDate": "2026-04-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 61,
    "status": "approved",
    "createdAt": "2026-05-20T17:00:00"
  },
  {
    "id": 45,
    "userId": 18,
    "projectId": 4,
    "realizationNumber": "WR-2026-045",
    "realizationDate": "2026-04-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 51,
    "status": "pending",
    "createdAt": "2026-05-20T17:00:00"
  },
  {
    "id": 46,
    "userId": 7,
    "projectId": 5,
    "realizationNumber": "WR-2026-046",
    "realizationDate": "2026-03-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 95,
    "status": "approved",
    "createdAt": "2026-02-20T17:00:00"
  },
  {
    "id": 47,
    "userId": 10,
    "projectId": 8,
    "realizationNumber": "WR-2026-047",
    "realizationDate": "2026-01-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 78,
    "status": "approved",
    "createdAt": "2026-04-20T17:00:00"
  },
  {
    "id": 50,
    "userId": 16,
    "projectId": 4,
    "realizationNumber": "WR-2026-050",
    "realizationDate": "2026-02-20",
    "activities": "Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.",
    "progress": 53,
    "status": "rejected",
    "createdAt": "2026-02-20T17:00:00"
  }
];

export const leaveRequests: LeaveRequest[] = [
  {
    "id": 1,
    "userId": 17,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-001",
    "startDate": "2026-05-01",
    "endDate": "2026-06-03",
    "totalDays": 3,
    "reason": "Urusan pribadi",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 2,
    "userId": 3,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-002",
    "startDate": "2026-06-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Istirahat",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 3,
    "userId": 11,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-003",
    "startDate": "2026-05-01",
    "endDate": "2026-07-03",
    "totalDays": 3,
    "reason": "Cuti tahunan",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-15T10:00:00"
  },
  {
    "id": 4,
    "userId": 2,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-004",
    "startDate": "2026-07-01",
    "endDate": "2026-07-03",
    "totalDays": 3,
    "reason": "Sakit demam",
    "status": "rejected",
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 5,
    "userId": 4,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-005",
    "startDate": "2026-08-01",
    "endDate": "2026-08-03",
    "totalDays": 3,
    "reason": "Cuti tahunan",
    "status": "rejected",
    "createdAt": "2026-03-15T10:00:00"
  },
  {
    "id": 6,
    "userId": 7,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-006",
    "startDate": "2026-05-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Urusan pribadi",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 7,
    "userId": 12,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-007",
    "startDate": "2026-07-01",
    "endDate": "2026-05-03",
    "totalDays": 3,
    "reason": "Cuti tahunan",
    "status": "pending",
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 8,
    "userId": 15,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-008",
    "startDate": "2026-06-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Cuti tahunan",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-15T10:00:00"
  },
  {
    "id": 9,
    "userId": 5,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-009",
    "startDate": "2026-07-01",
    "endDate": "2026-07-03",
    "totalDays": 3,
    "reason": "Urusan pribadi",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 10,
    "userId": 14,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-010",
    "startDate": "2026-06-01",
    "endDate": "2026-07-03",
    "totalDays": 3,
    "reason": "Urusan pribadi",
    "status": "pending",
    "createdAt": "2026-01-15T10:00:00"
  },
  {
    "id": 11,
    "userId": 4,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-011",
    "startDate": "2026-09-01",
    "endDate": "2026-05-03",
    "totalDays": 3,
    "reason": "Acara keluarga",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 12,
    "userId": 12,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-012",
    "startDate": "2026-08-01",
    "endDate": "2026-06-03",
    "totalDays": 3,
    "reason": "Urusan pribadi",
    "status": "rejected",
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 13,
    "userId": 11,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-013",
    "startDate": "2026-09-01",
    "endDate": "2026-07-03",
    "totalDays": 3,
    "reason": "Urusan pribadi",
    "status": "rejected",
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 14,
    "userId": 13,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-014",
    "startDate": "2026-06-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Cuti tahunan",
    "status": "pending",
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 15,
    "userId": 11,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-015",
    "startDate": "2026-06-01",
    "endDate": "2026-06-03",
    "totalDays": 3,
    "reason": "Sakit demam",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-15T10:00:00"
  },
  {
    "id": 16,
    "userId": 6,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-016",
    "startDate": "2026-07-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Istirahat",
    "status": "pending",
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 17,
    "userId": 9,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-017",
    "startDate": "2026-06-01",
    "endDate": "2026-05-03",
    "totalDays": 3,
    "reason": "Urusan pribadi",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-15T10:00:00"
  },
  {
    "id": 18,
    "userId": 10,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-018",
    "startDate": "2026-08-01",
    "endDate": "2026-06-03",
    "totalDays": 3,
    "reason": "Acara keluarga",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-15T10:00:00"
  },
  {
    "id": 19,
    "userId": 3,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-019",
    "startDate": "2026-07-01",
    "endDate": "2026-08-03",
    "totalDays": 3,
    "reason": "Cuti tahunan",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-15T10:00:00"
  },
  {
    "id": 20,
    "userId": 11,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-020",
    "startDate": "2026-08-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Acara keluarga",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 21,
    "userId": 19,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-021",
    "startDate": "2026-09-01",
    "endDate": "2026-07-03",
    "totalDays": 3,
    "reason": "Sakit demam",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-15T10:00:00"
  },
  {
    "id": 22,
    "userId": 11,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-022",
    "startDate": "2026-08-01",
    "endDate": "2026-05-03",
    "totalDays": 3,
    "reason": "Istirahat",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-15T10:00:00"
  },
  {
    "id": 23,
    "userId": 7,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-023",
    "startDate": "2026-05-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Acara keluarga",
    "status": "pending",
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 24,
    "userId": 14,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-024",
    "startDate": "2026-06-01",
    "endDate": "2026-06-03",
    "totalDays": 3,
    "reason": "Acara keluarga",
    "status": "pending",
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 25,
    "userId": 10,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-025",
    "startDate": "2026-08-01",
    "endDate": "2026-05-03",
    "totalDays": 3,
    "reason": "Istirahat",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 26,
    "userId": 18,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-026",
    "startDate": "2026-06-01",
    "endDate": "2026-06-03",
    "totalDays": 3,
    "reason": "Sakit demam",
    "status": "rejected",
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 27,
    "userId": 9,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-027",
    "startDate": "2026-08-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Istirahat",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-15T10:00:00"
  },
  {
    "id": 28,
    "userId": 4,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-028",
    "startDate": "2026-08-01",
    "endDate": "2026-08-03",
    "totalDays": 3,
    "reason": "Acara keluarga",
    "status": "rejected",
    "createdAt": "2026-01-15T10:00:00"
  },
  {
    "id": 29,
    "userId": 19,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-029",
    "startDate": "2026-05-01",
    "endDate": "2026-09-03",
    "totalDays": 3,
    "reason": "Cuti tahunan",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-15T10:00:00"
  },
  {
    "id": 30,
    "userId": 11,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-030",
    "startDate": "2026-05-01",
    "endDate": "2026-06-03",
    "totalDays": 3,
    "reason": "Acara keluarga",
    "status": "pending",
    "createdAt": "2026-02-15T10:00:00"
  }
];

export const spds: SPD[] = [
  {
    "id": 1,
    "userId": 18,
    "projectId": 4,
    "spdNumber": "SPD-2026-001",
    "destination": "Jakarta",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-07-10",
    "returnDate": "2026-06-15",
    "totalCost": 8500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-01T09:00:00"
  },
  {
    "id": 2,
    "userId": 16,
    "projectId": 8,
    "spdNumber": "SPD-2026-002",
    "destination": "Balikpapan",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-06-15",
    "totalCost": 5500000,
    "status": "rejected",
    "createdAt": "2026-02-01T09:00:00"
  },
  {
    "id": 3,
    "userId": 16,
    "projectId": 8,
    "spdNumber": "SPD-2026-003",
    "destination": "Sulawesi",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-05-10",
    "returnDate": "2026-06-15",
    "totalCost": 9500000,
    "status": "pending",
    "createdAt": "2026-03-01T09:00:00"
  },
  {
    "id": 4,
    "userId": 16,
    "projectId": 8,
    "spdNumber": "SPD-2026-004",
    "destination": "Denpasar",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-05-15",
    "totalCost": 7500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-01T09:00:00"
  },
  {
    "id": 5,
    "userId": 4,
    "projectId": 2,
    "spdNumber": "SPD-2026-005",
    "destination": "Denpasar",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-08-15",
    "totalCost": 3500000,
    "status": "rejected",
    "createdAt": "2026-02-01T09:00:00"
  },
  {
    "id": 6,
    "userId": 6,
    "projectId": 10,
    "spdNumber": "SPD-2026-006",
    "destination": "Semarang",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-05-10",
    "returnDate": "2026-06-15",
    "totalCost": 1500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-01T09:00:00"
  },
  {
    "id": 7,
    "userId": 18,
    "projectId": 4,
    "spdNumber": "SPD-2026-007",
    "destination": "Sulawesi",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-06-10",
    "returnDate": "2026-05-15",
    "totalCost": 7500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-01T09:00:00"
  },
  {
    "id": 8,
    "userId": 12,
    "projectId": 6,
    "spdNumber": "SPD-2026-008",
    "destination": "Sulawesi",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-07-15",
    "totalCost": 1500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-01T09:00:00"
  },
  {
    "id": 9,
    "userId": 5,
    "projectId": 1,
    "spdNumber": "SPD-2026-009",
    "destination": "Jakarta",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-05-15",
    "totalCost": 1500000,
    "status": "rejected",
    "createdAt": "2026-02-01T09:00:00"
  },
  {
    "id": 10,
    "userId": 6,
    "projectId": 10,
    "spdNumber": "SPD-2026-010",
    "destination": "Semarang",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-07-10",
    "returnDate": "2026-06-15",
    "totalCost": 4500000,
    "status": "pending",
    "createdAt": "2026-02-01T09:00:00"
  },
  {
    "id": 11,
    "userId": 20,
    "projectId": 1,
    "spdNumber": "SPD-2026-011",
    "destination": "Balikpapan",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-07-10",
    "returnDate": "2026-07-15",
    "totalCost": 5500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-01T09:00:00"
  },
  {
    "id": 12,
    "userId": 5,
    "projectId": 1,
    "spdNumber": "SPD-2026-012",
    "destination": "Papua",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-06-10",
    "returnDate": "2026-07-15",
    "totalCost": 7500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-01T09:00:00"
  },
  {
    "id": 13,
    "userId": 4,
    "projectId": 5,
    "spdNumber": "SPD-2026-013",
    "destination": "Balikpapan",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-08-15",
    "totalCost": 3500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-01T09:00:00"
  },
  {
    "id": 14,
    "userId": 5,
    "projectId": 7,
    "spdNumber": "SPD-2026-014",
    "destination": "Denpasar",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-06-10",
    "returnDate": "2026-08-15",
    "totalCost": 7500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-01T09:00:00"
  },
  {
    "id": 15,
    "userId": 8,
    "projectId": 10,
    "spdNumber": "SPD-2026-015",
    "destination": "Semarang",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-07-10",
    "returnDate": "2026-05-15",
    "totalCost": 10500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-01T09:00:00"
  },
  {
    "id": 16,
    "userId": 8,
    "projectId": 10,
    "spdNumber": "SPD-2026-016",
    "destination": "Sulawesi",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-08-15",
    "totalCost": 4500000,
    "status": "rejected",
    "createdAt": "2026-03-01T09:00:00"
  },
  {
    "id": 17,
    "userId": 4,
    "projectId": 2,
    "spdNumber": "SPD-2026-017",
    "destination": "Denpasar",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-06-10",
    "returnDate": "2026-07-15",
    "totalCost": 3500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-01T09:00:00"
  },
  {
    "id": 18,
    "userId": 4,
    "projectId": 2,
    "spdNumber": "SPD-2026-018",
    "destination": "Papua",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-08-15",
    "totalCost": 5500000,
    "status": "pending",
    "createdAt": "2026-02-01T09:00:00"
  },
  {
    "id": 19,
    "userId": 4,
    "projectId": 2,
    "spdNumber": "SPD-2026-019",
    "destination": "Jakarta",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-08-10",
    "returnDate": "2026-06-15",
    "totalCost": 6500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-01T09:00:00"
  },
  {
    "id": 20,
    "userId": 8,
    "projectId": 2,
    "spdNumber": "SPD-2026-020",
    "destination": "Jakarta",
    "purpose": "Supervisi dan koordinasi lapangan",
    "departureDate": "2026-07-10",
    "returnDate": "2026-06-15",
    "totalCost": 8500000,
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-01T09:00:00"
  }
];

export const purchases: Purchase[] = [
  {
    "id": 1,
    "userId": 7,
    "projectId": 1,
    "purchaseNumber": "PO-2026-001",
    "items": [
      {
        "name": "Baja H-Beam",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 1",
    "status": "pending",
    "createdAt": "2026-02-05T10:00:00"
  },
  {
    "id": 2,
    "userId": 9,
    "projectId": 1,
    "purchaseNumber": "PO-2026-002",
    "items": [
      {
        "name": "Pipa Carbon",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 3",
    "status": "pending",
    "createdAt": "2026-01-05T10:00:00"
  },
  {
    "id": 3,
    "userId": 8,
    "projectId": 8,
    "purchaseNumber": "PO-2026-003",
    "items": [
      {
        "name": "Semen PC",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 2",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-05T10:00:00"
  },
  {
    "id": 4,
    "userId": 9,
    "projectId": 7,
    "purchaseNumber": "PO-2026-004",
    "items": [
      {
        "name": "Kabel Fiber",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 2",
    "status": "rejected",
    "createdAt": "2026-03-05T10:00:00"
  },
  {
    "id": 5,
    "userId": 10,
    "projectId": 2,
    "purchaseNumber": "PO-2026-005",
    "items": [
      {
        "name": "Baja H-Beam",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 1",
    "status": "rejected",
    "createdAt": "2026-04-05T10:00:00"
  },
  {
    "id": 6,
    "userId": 8,
    "projectId": 1,
    "purchaseNumber": "PO-2026-006",
    "items": [
      {
        "name": "Kabel Fiber",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 2",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-05T10:00:00"
  },
  {
    "id": 7,
    "userId": 9,
    "projectId": 5,
    "purchaseNumber": "PO-2026-007",
    "items": [
      {
        "name": "Pipa Carbon",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 1",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-05T10:00:00"
  },
  {
    "id": 8,
    "userId": 9,
    "projectId": 8,
    "purchaseNumber": "PO-2026-008",
    "items": [
      {
        "name": "Semen PC",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 3",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-05T10:00:00"
  },
  {
    "id": 9,
    "userId": 8,
    "projectId": 3,
    "purchaseNumber": "PO-2026-009",
    "items": [
      {
        "name": "Baja H-Beam",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 3",
    "status": "rejected",
    "createdAt": "2026-01-05T10:00:00"
  },
  {
    "id": 10,
    "userId": 8,
    "projectId": 3,
    "purchaseNumber": "PO-2026-010",
    "items": [
      {
        "name": "Semen PC",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 3",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-05T10:00:00"
  },
  {
    "id": 11,
    "userId": 10,
    "projectId": 4,
    "purchaseNumber": "PO-2026-011",
    "items": [
      {
        "name": "Kabel Fiber",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 1",
    "status": "pending",
    "createdAt": "2026-04-05T10:00:00"
  },
  {
    "id": 12,
    "userId": 6,
    "projectId": 4,
    "purchaseNumber": "PO-2026-012",
    "items": [
      {
        "name": "Baja H-Beam",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 3",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-05T10:00:00"
  },
  {
    "id": 13,
    "userId": 6,
    "projectId": 1,
    "purchaseNumber": "PO-2026-013",
    "items": [
      {
        "name": "Semen PC",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 1",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-05T10:00:00"
  },
  {
    "id": 14,
    "userId": 6,
    "projectId": 8,
    "purchaseNumber": "PO-2026-014",
    "items": [
      {
        "name": "Baja H-Beam",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 1",
    "status": "rejected",
    "createdAt": "2026-01-05T10:00:00"
  },
  {
    "id": 15,
    "userId": 7,
    "projectId": 10,
    "purchaseNumber": "PO-2026-015",
    "items": [
      {
        "name": "Pipa Carbon",
        "qty": 100,
        "price": 3000000
      },
      {
        "name": "Material Support",
        "qty": 50,
        "price": 50000
      }
    ],
    "totalPrice": 302500000,
    "description": "Pengadaan material tahap 3",
    "status": "rejected",
    "createdAt": "2026-03-05T10:00:00"
  }
];

export const vendorPayments: VendorPayment[] = [
  {
    "id": 1,
    "userId": 3,
    "vendorId": 1,
    "projectId": 7,
    "paymentNumber": "VP-2026-001",
    "invoiceNumber": "INV-0001",
    "amount": 453000000,
    "paymentType": "service",
    "description": "Pembayaran tagihan vendor termin 1",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-12T14:00:00"
  },
  {
    "id": 2,
    "userId": 3,
    "vendorId": 3,
    "projectId": 8,
    "paymentNumber": "VP-2026-002",
    "invoiceNumber": "INV-0002",
    "amount": 385000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 2",
    "status": "rejected",
    "createdAt": "2026-01-12T14:00:00"
  },
  {
    "id": 3,
    "userId": 3,
    "vendorId": 4,
    "projectId": 5,
    "paymentNumber": "VP-2026-003",
    "invoiceNumber": "INV-0003",
    "amount": 437000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 2",
    "status": "pending",
    "createdAt": "2026-01-12T14:00:00"
  },
  {
    "id": 4,
    "userId": 3,
    "vendorId": 4,
    "projectId": 9,
    "paymentNumber": "VP-2026-004",
    "invoiceNumber": "INV-0004",
    "amount": 77000000,
    "paymentType": "service",
    "description": "Pembayaran tagihan vendor termin 2",
    "status": "rejected",
    "createdAt": "2026-04-12T14:00:00"
  },
  {
    "id": 5,
    "userId": 3,
    "vendorId": 5,
    "projectId": 5,
    "paymentNumber": "VP-2026-005",
    "invoiceNumber": "INV-0005",
    "amount": 155000000,
    "paymentType": "service",
    "description": "Pembayaran tagihan vendor termin 2",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-12T14:00:00"
  },
  {
    "id": 6,
    "userId": 3,
    "vendorId": 4,
    "projectId": 10,
    "paymentNumber": "VP-2026-006",
    "invoiceNumber": "INV-0006",
    "amount": 216000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 1",
    "status": "pending",
    "createdAt": "2026-02-12T14:00:00"
  },
  {
    "id": 7,
    "userId": 3,
    "vendorId": 1,
    "projectId": 2,
    "paymentNumber": "VP-2026-007",
    "invoiceNumber": "INV-0007",
    "amount": 437000000,
    "paymentType": "service",
    "description": "Pembayaran tagihan vendor termin 3",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-12T14:00:00"
  },
  {
    "id": 8,
    "userId": 3,
    "vendorId": 5,
    "projectId": 4,
    "paymentNumber": "VP-2026-008",
    "invoiceNumber": "INV-0008",
    "amount": 195000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 2",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-12T14:00:00"
  },
  {
    "id": 9,
    "userId": 3,
    "vendorId": 2,
    "projectId": 6,
    "paymentNumber": "VP-2026-009",
    "invoiceNumber": "INV-0009",
    "amount": 505000000,
    "paymentType": "service",
    "description": "Pembayaran tagihan vendor termin 1",
    "status": "rejected",
    "createdAt": "2026-04-12T14:00:00"
  },
  {
    "id": 10,
    "userId": 3,
    "vendorId": 3,
    "projectId": 7,
    "paymentNumber": "VP-2026-010",
    "invoiceNumber": "INV-0010",
    "amount": 465000000,
    "paymentType": "service",
    "description": "Pembayaran tagihan vendor termin 3",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-12T14:00:00"
  },
  {
    "id": 11,
    "userId": 3,
    "vendorId": 5,
    "projectId": 9,
    "paymentNumber": "VP-2026-011",
    "invoiceNumber": "INV-0011",
    "amount": 347000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 3",
    "status": "pending",
    "createdAt": "2026-04-12T14:00:00"
  },
  {
    "id": 12,
    "userId": 3,
    "vendorId": 4,
    "projectId": 10,
    "paymentNumber": "VP-2026-012",
    "invoiceNumber": "INV-0012",
    "amount": 196000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 3",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-12T14:00:00"
  },
  {
    "id": 13,
    "userId": 3,
    "vendorId": 4,
    "projectId": 5,
    "paymentNumber": "VP-2026-013",
    "invoiceNumber": "INV-0013",
    "amount": 430000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 1",
    "status": "rejected",
    "createdAt": "2026-04-12T14:00:00"
  },
  {
    "id": 14,
    "userId": 3,
    "vendorId": 3,
    "projectId": 6,
    "paymentNumber": "VP-2026-014",
    "invoiceNumber": "INV-0014",
    "amount": 341000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 2",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-12T14:00:00"
  },
  {
    "id": 15,
    "userId": 3,
    "vendorId": 5,
    "projectId": 5,
    "paymentNumber": "VP-2026-015",
    "invoiceNumber": "INV-0015",
    "amount": 126000000,
    "paymentType": "material",
    "description": "Pembayaran tagihan vendor termin 2",
    "status": "pending",
    "createdAt": "2026-04-12T14:00:00"
  }
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
  {
    "id": 1,
    "projectId": 1,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 2,
    "projectId": 1,
    "userId": 5,
    "role": "Project Engineer"
  },
  {
    "id": 3,
    "projectId": 1,
    "userId": 20,
    "role": "Architect"
  },
  {
    "id": 4,
    "projectId": 2,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 5,
    "projectId": 2,
    "userId": 8,
    "role": "Procurement Officer"
  },
  {
    "id": 6,
    "projectId": 3,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 7,
    "projectId": 3,
    "userId": 17,
    "role": "IT Support"
  },
  {
    "id": 8,
    "projectId": 3,
    "userId": 18,
    "role": "Legal Counsel"
  },
  {
    "id": 9,
    "projectId": 3,
    "userId": 19,
    "role": "Marketing Specialist"
  },
  {
    "id": 10,
    "projectId": 4,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 11,
    "projectId": 4,
    "userId": 10,
    "role": "Site Supervisor"
  },
  {
    "id": 12,
    "projectId": 4,
    "userId": 18,
    "role": "Legal Counsel"
  },
  {
    "id": 13,
    "projectId": 5,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 14,
    "projectId": 5,
    "userId": 7,
    "role": "Engineer"
  },
  {
    "id": 15,
    "projectId": 6,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 16,
    "projectId": 6,
    "userId": 12,
    "role": "Procurement Staff"
  },
  {
    "id": 17,
    "projectId": 6,
    "userId": 7,
    "role": "Engineer"
  },
  {
    "id": 18,
    "projectId": 6,
    "userId": 8,
    "role": "Procurement Officer"
  },
  {
    "id": 19,
    "projectId": 7,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 20,
    "projectId": 7,
    "userId": 5,
    "role": "Project Engineer"
  },
  {
    "id": 21,
    "projectId": 7,
    "userId": 18,
    "role": "Legal Counsel"
  },
  {
    "id": 22,
    "projectId": 8,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 23,
    "projectId": 8,
    "userId": 6,
    "role": "Senior Engineer"
  },
  {
    "id": 24,
    "projectId": 8,
    "userId": 10,
    "role": "Site Supervisor"
  },
  {
    "id": 25,
    "projectId": 9,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 26,
    "projectId": 9,
    "userId": 5,
    "role": "Project Engineer"
  },
  {
    "id": 27,
    "projectId": 9,
    "userId": 6,
    "role": "Senior Engineer"
  },
  {
    "id": 28,
    "projectId": 10,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 29,
    "projectId": 10,
    "userId": 17,
    "role": "IT Support"
  },
  {
    "id": 30,
    "projectId": 10,
    "userId": 6,
    "role": "Senior Engineer"
  },
  {
    "id": 31,
    "projectId": 10,
    "userId": 8,
    "role": "Procurement Officer"
  }
];

export function getProjectTeam(projectId: number): ProjectTeam[] {
  return projectTeams.filter(pt => pt.projectId === projectId);
}

export interface Payroll {
  id: number;
  userId: number;
  period: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "draft" | "paid";
  paymentDate?: string;
}

export const payrolls: Payroll[] = [
  {
    "id": 1,
    "userId": 1,
    "period": "Mei 2026",
    "baseSalary": 20000000,
    "allowances": 2500000,
    "deductions": 500000,
    "netSalary": 22000000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 2,
    "userId": 1,
    "period": "Juni 2026",
    "baseSalary": 20000000,
    "allowances": 2500000,
    "deductions": 500000,
    "netSalary": 22000000,
    "status": "draft"
  },
  {
    "id": 3,
    "userId": 2,
    "period": "Mei 2026",
    "baseSalary": 15000000,
    "allowances": 2000000,
    "deductions": 500000,
    "netSalary": 16500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 4,
    "userId": 2,
    "period": "Juni 2026",
    "baseSalary": 15000000,
    "allowances": 2000000,
    "deductions": 500000,
    "netSalary": 16500000,
    "status": "draft"
  },
  {
    "id": 5,
    "userId": 3,
    "period": "Mei 2026",
    "baseSalary": 16000000,
    "allowances": 2000000,
    "deductions": 500000,
    "netSalary": 17500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 6,
    "userId": 3,
    "period": "Juni 2026",
    "baseSalary": 16000000,
    "allowances": 2000000,
    "deductions": 500000,
    "netSalary": 17500000,
    "status": "draft"
  },
  {
    "id": 7,
    "userId": 4,
    "period": "Mei 2026",
    "baseSalary": 18000000,
    "allowances": 3000000,
    "deductions": 500000,
    "netSalary": 20500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 8,
    "userId": 4,
    "period": "Juni 2026",
    "baseSalary": 18000000,
    "allowances": 3000000,
    "deductions": 500000,
    "netSalary": 20500000,
    "status": "draft"
  },
  {
    "id": 9,
    "userId": 5,
    "period": "Mei 2026",
    "baseSalary": 10000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 10500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 10,
    "userId": 5,
    "period": "Juni 2026",
    "baseSalary": 10000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 10500000,
    "status": "draft"
  },
  {
    "id": 11,
    "userId": 6,
    "period": "Mei 2026",
    "baseSalary": 12000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 12500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 12,
    "userId": 6,
    "period": "Juni 2026",
    "baseSalary": 12000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 12500000,
    "status": "draft"
  },
  {
    "id": 13,
    "userId": 7,
    "period": "Mei 2026",
    "baseSalary": 9000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 9500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 14,
    "userId": 7,
    "period": "Juni 2026",
    "baseSalary": 9000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 9500000,
    "status": "draft"
  },
  {
    "id": 15,
    "userId": 8,
    "period": "Mei 2026",
    "baseSalary": 8000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 8500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 16,
    "userId": 8,
    "period": "Juni 2026",
    "baseSalary": 8000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 8500000,
    "status": "draft"
  },
  {
    "id": 17,
    "userId": 9,
    "period": "Mei 2026",
    "baseSalary": 8500000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 9000000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 18,
    "userId": 9,
    "period": "Juni 2026",
    "baseSalary": 8500000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 9000000,
    "status": "draft"
  },
  {
    "id": 19,
    "userId": 10,
    "period": "Mei 2026",
    "baseSalary": 11000000,
    "allowances": 1500000,
    "deductions": 500000,
    "netSalary": 12000000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 20,
    "userId": 10,
    "period": "Juni 2026",
    "baseSalary": 11000000,
    "allowances": 1500000,
    "deductions": 500000,
    "netSalary": 12000000,
    "status": "draft"
  },
  {
    "id": 21,
    "userId": 11,
    "period": "Mei 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 7500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 22,
    "userId": 11,
    "period": "Juni 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 7500000,
    "status": "draft"
  },
  {
    "id": 23,
    "userId": 12,
    "period": "Mei 2026",
    "baseSalary": 6500000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 7000000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 24,
    "userId": 12,
    "period": "Juni 2026",
    "baseSalary": 6500000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 7000000,
    "status": "draft"
  },
  {
    "id": 25,
    "userId": 13,
    "period": "Mei 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 7500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 26,
    "userId": 13,
    "period": "Juni 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 7500000,
    "status": "draft"
  },
  {
    "id": 27,
    "userId": 14,
    "period": "Mei 2026",
    "baseSalary": 9500000,
    "allowances": 1300000,
    "deductions": 500000,
    "netSalary": 10300000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 28,
    "userId": 14,
    "period": "Juni 2026",
    "baseSalary": 9500000,
    "allowances": 1300000,
    "deductions": 500000,
    "netSalary": 10300000,
    "status": "draft"
  },
  {
    "id": 29,
    "userId": 15,
    "period": "Mei 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 7500000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 30,
    "userId": 15,
    "period": "Juni 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 7500000,
    "status": "draft"
  },
  {
    "id": 31,
    "userId": 16,
    "period": "Mei 2026",
    "baseSalary": 16000000,
    "allowances": 2500000,
    "deductions": 500000,
    "netSalary": 18000000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 32,
    "userId": 16,
    "period": "Juni 2026",
    "baseSalary": 16000000,
    "allowances": 2500000,
    "deductions": 500000,
    "netSalary": 18000000,
    "status": "draft"
  },
  {
    "id": 33,
    "userId": 17,
    "period": "Mei 2026",
    "baseSalary": 7500000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 8000000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 34,
    "userId": 17,
    "period": "Juni 2026",
    "baseSalary": 7500000,
    "allowances": 1000000,
    "deductions": 500000,
    "netSalary": 8000000,
    "status": "draft"
  },
  {
    "id": 35,
    "userId": 18,
    "period": "Mei 2026",
    "baseSalary": 13000000,
    "allowances": 1800000,
    "deductions": 500000,
    "netSalary": 14300000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 36,
    "userId": 18,
    "period": "Juni 2026",
    "baseSalary": 13000000,
    "allowances": 1800000,
    "deductions": 500000,
    "netSalary": 14300000,
    "status": "draft"
  },
  {
    "id": 37,
    "userId": 19,
    "period": "Mei 2026",
    "baseSalary": 8500000,
    "allowances": 1200000,
    "deductions": 500000,
    "netSalary": 9200000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 38,
    "userId": 19,
    "period": "Juni 2026",
    "baseSalary": 8500000,
    "allowances": 1200000,
    "deductions": 500000,
    "netSalary": 9200000,
    "status": "draft"
  },
  {
    "id": 39,
    "userId": 20,
    "period": "Mei 2026",
    "baseSalary": 14000000,
    "allowances": 1800000,
    "deductions": 500000,
    "netSalary": 15300000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 40,
    "userId": 20,
    "period": "Juni 2026",
    "baseSalary": 14000000,
    "allowances": 1800000,
    "deductions": 500000,
    "netSalary": 15300000,
    "status": "draft"
  }
];
