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
  status: "pending" | "approved" | "rejected" | "extended";
  assignedBy?: number;
  isAcknowledged?: boolean;
  feedback?: string;
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
  status: "pending" | "approved" | "rejected" | "extended";
  feedback?: string;
  extendedUntil?: string;
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
    "allowanceTransport": 1500000
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
    "description": "Pembangunan PLTU berkapasitas 660 MW di Jawa Tengah"
  },
  {
    "id": 2,
    "name": "Pipeline Kalimantan",
    "code": "PRJ-002",
    "status": "active",
    "budget": 3200000000,
    "managerId": 4,
    "description": "Pemasangan pipa gas 24 inci sepanjang 80 km di Kalimantan"
  },
  {
    "id": 3,
    "name": "Refinery Upgrade Cilacap",
    "code": "PRJ-003",
    "status": "on_hold",
    "budget": 8000000000,
    "managerId": 16,
    "description": "Upgrade kapasitas refinery Cilacap dari 270k ke 370k BOPD"
  },
  {
    "id": 4,
    "name": "Solar Panel Installation Bali",
    "code": "PRJ-004",
    "status": "active",
    "budget": 1500000000,
    "managerId": 16,
    "description": "Instalasi 5 MWp panel surya di resort dan hotel Bali"
  },
  {
    "id": 5,
    "name": "Wind Farm Sulawesi",
    "code": "PRJ-005",
    "status": "completed",
    "budget": 6000000000,
    "managerId": 4,
    "description": "Pembangunan wind farm 75 MW di Sulawesi Selatan"
  },
  {
    "id": 6,
    "name": "Geothermal Power Plant Sumut",
    "code": "PRJ-006",
    "status": "active",
    "budget": 12000000000,
    "managerId": 16,
    "description": "Pengembangan PLTP 110 MW di Sumatera Utara"
  },
  {
    "id": 7,
    "name": "Dam Construction Papua",
    "code": "PRJ-007",
    "status": "active",
    "budget": 9500000000,
    "managerId": 4,
    "description": "Konstruksi bendungan multifungsi berkapasitas 180 juta m3 di Papua"
  },
  {
    "id": 8,
    "name": "Smart Grid Jakarta",
    "code": "PRJ-008",
    "status": "active",
    "budget": 4000000000,
    "managerId": 16,
    "description": "Implementasi Smart Grid 1000 titik di wilayah Jakarta Raya"
  },
  {
    "id": 9,
    "name": "Offshore Platform Maintenance",
    "code": "PRJ-009",
    "status": "on_hold",
    "budget": 7500000000,
    "managerId": 4,
    "description": "Maintenance besar platform lepas pantai wilayah Natuna"
  },
  {
    "id": 10,
    "name": "EV Charging Stations Trans Jawa",
    "code": "PRJ-010",
    "status": "completed",
    "budget": 2000000000,
    "managerId": 16,
    "description": "Instalasi 200 unit SPKLU di 40 rest area Tol Trans Jawa"
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
    "contactPerson": "Hendra Gunawan",
    "email": "hendra@bajautama.co.id",
    "phone": "021-5551234"
  },
  {
    "id": 2,
    "name": "CV Mitra Teknik",
    "company": "CV Mitra Teknik Sejahtera",
    "contactPerson": "Agus Salim",
    "email": "agus@mitrateknik.com",
    "phone": "021-5555678"
  },
  {
    "id": 3,
    "name": "PT Elektrik Prima",
    "company": "PT Elektrik Prima Nusantara",
    "contactPerson": "Rina Kusuma",
    "email": "rina@elektrikprima.co.id",
    "phone": "021-5559012"
  },
  {
    "id": 4,
    "name": "PT Beton Kuat",
    "company": "PT Beton Kuat Persada",
    "contactPerson": "Bambang Sutejo",
    "email": "bambang@betonkuat.com",
    "phone": "021-5553333"
  },
  {
    "id": 5,
    "name": "PT Kabel Indo",
    "company": "PT Kabel Nusantara Indo",
    "contactPerson": "Siska Dewi",
    "email": "siska@kabelindo.com",
    "phone": "021-5554444"
  }
];

export const workPlans: WorkPlan[] = [
  {
    "id": 1,
    "userId": 4,
    "projectId": 1,
    "planNumber": "WP-2026-001",
    "planDate": "2026-03-19",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "approved",
    "createdAt": "2026-03-19T08:00:00"
  },
  {
    "id": 2,
    "userId": 4,
    "projectId": 1,
    "planNumber": "WP-2026-002",
    "planDate": "2026-05-13",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "rejected",
    "createdAt": "2026-05-13T08:00:00"
  },
  {
    "id": 3,
    "userId": 4,
    "projectId": 1,
    "planNumber": "WP-2026-003",
    "planDate": "2026-04-20",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-04-20T08:00:00"
  },
  {
    "id": 4,
    "userId": 4,
    "projectId": 1,
    "planNumber": "WP-2026-004",
    "planDate": "2026-05-12",
    "activities": "Menyelesaikan pekerjaan finishing dan pembersihan area",
    "status": "pending",
    "createdAt": "2026-05-12T08:00:00"
  },
  {
    "id": 5,
    "userId": 5,
    "projectId": 1,
    "planNumber": "WP-2026-005",
    "planDate": "2026-04-01",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "pending",
    "createdAt": "2026-04-01T08:00:00"
  },
  {
    "id": 6,
    "userId": 5,
    "projectId": 1,
    "planNumber": "WP-2026-006",
    "planDate": "2026-03-16",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "approved",
    "createdAt": "2026-03-16T08:00:00"
  },
  {
    "id": 7,
    "userId": 5,
    "projectId": 1,
    "planNumber": "WP-2026-007",
    "planDate": "2026-02-23",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "approved",
    "createdAt": "2026-02-23T08:00:00"
  },
  {
    "id": 8,
    "userId": 5,
    "projectId": 1,
    "planNumber": "WP-2026-008",
    "planDate": "2026-06-01",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "pending",
    "createdAt": "2026-06-01T08:00:00"
  },
  {
    "id": 9,
    "userId": 5,
    "projectId": 1,
    "planNumber": "WP-2026-009",
    "planDate": "2026-01-13",
    "activities": "Mempersiapkan material dan peralatan kerja di lokasi",
    "status": "rejected",
    "createdAt": "2026-01-13T08:00:00"
  },
  {
    "id": 10,
    "userId": 6,
    "projectId": 1,
    "planNumber": "WP-2026-010",
    "planDate": "2026-02-10",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "rejected",
    "createdAt": "2026-02-10T08:00:00"
  },
  {
    "id": 11,
    "userId": 6,
    "projectId": 1,
    "planNumber": "WP-2026-011",
    "planDate": "2026-04-13",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-04-13T08:00:00"
  },
  {
    "id": 12,
    "userId": 6,
    "projectId": 1,
    "planNumber": "WP-2026-012",
    "planDate": "2026-05-01",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "rejected",
    "createdAt": "2026-05-01T08:00:00"
  },
  {
    "id": 13,
    "userId": 6,
    "projectId": 1,
    "planNumber": "WP-2026-013",
    "planDate": "2026-03-02",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "approved",
    "createdAt": "2026-03-02T08:00:00"
  },
  {
    "id": 14,
    "userId": 10,
    "projectId": 1,
    "planNumber": "WP-2026-014",
    "planDate": "2026-02-15",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "approved",
    "createdAt": "2026-02-15T08:00:00"
  },
  {
    "id": 15,
    "userId": 10,
    "projectId": 1,
    "planNumber": "WP-2026-015",
    "planDate": "2026-03-06",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-03-06T08:00:00"
  },
  {
    "id": 16,
    "userId": 10,
    "projectId": 1,
    "planNumber": "WP-2026-016",
    "planDate": "2026-04-01",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "rejected",
    "createdAt": "2026-04-01T08:00:00"
  },
  {
    "id": 17,
    "userId": 20,
    "projectId": 1,
    "planNumber": "WP-2026-017",
    "planDate": "2026-06-06",
    "activities": "Memverifikasi hasil pengerjaan dengan as-built drawing",
    "status": "approved",
    "createdAt": "2026-06-06T08:00:00"
  },
  {
    "id": 18,
    "userId": 20,
    "projectId": 1,
    "planNumber": "WP-2026-018",
    "planDate": "2026-05-14",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "pending",
    "createdAt": "2026-05-14T08:00:00"
  },
  {
    "id": 19,
    "userId": 20,
    "projectId": 1,
    "planNumber": "WP-2026-019",
    "planDate": "2026-01-14",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "approved",
    "createdAt": "2026-01-14T08:00:00"
  },
  {
    "id": 20,
    "userId": 20,
    "projectId": 1,
    "planNumber": "WP-2026-020",
    "planDate": "2026-01-25",
    "activities": "Mempersiapkan material dan peralatan kerja di lokasi",
    "status": "approved",
    "createdAt": "2026-01-25T08:00:00"
  },
  {
    "id": 21,
    "userId": 4,
    "projectId": 2,
    "planNumber": "WP-2026-021",
    "planDate": "2026-02-20",
    "activities": "Melakukan kalibrasi peralatan ukur di laboratorium",
    "status": "rejected",
    "createdAt": "2026-02-20T08:00:00"
  },
  {
    "id": 22,
    "userId": 4,
    "projectId": 2,
    "planNumber": "WP-2026-022",
    "planDate": "2026-04-05",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "pending",
    "createdAt": "2026-04-05T08:00:00"
  },
  {
    "id": 23,
    "userId": 4,
    "projectId": 2,
    "planNumber": "WP-2026-023",
    "planDate": "2026-03-13",
    "activities": "Berkoordinasi dengan vendor untuk pengiriman material",
    "status": "approved",
    "createdAt": "2026-03-13T08:00:00"
  },
  {
    "id": 24,
    "userId": 5,
    "projectId": 2,
    "planNumber": "WP-2026-024",
    "planDate": "2026-01-05",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "pending",
    "createdAt": "2026-01-05T08:00:00"
  },
  {
    "id": 25,
    "userId": 5,
    "projectId": 2,
    "planNumber": "WP-2026-025",
    "planDate": "2026-02-11",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "pending",
    "createdAt": "2026-02-11T08:00:00"
  },
  {
    "id": 26,
    "userId": 5,
    "projectId": 2,
    "planNumber": "WP-2026-026",
    "planDate": "2026-06-25",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "rejected",
    "createdAt": "2026-06-25T08:00:00"
  },
  {
    "id": 27,
    "userId": 20,
    "projectId": 2,
    "planNumber": "WP-2026-027",
    "planDate": "2026-01-25",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-01-25T08:00:00"
  },
  {
    "id": 28,
    "userId": 20,
    "projectId": 2,
    "planNumber": "WP-2026-028",
    "planDate": "2026-05-10",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 29,
    "userId": 20,
    "projectId": 2,
    "planNumber": "WP-2026-029",
    "planDate": "2026-06-01",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "approved",
    "createdAt": "2026-06-01T08:00:00"
  },
  {
    "id": 30,
    "userId": 20,
    "projectId": 2,
    "planNumber": "WP-2026-030",
    "planDate": "2026-02-24",
    "activities": "Menyelesaikan pekerjaan finishing dan pembersihan area",
    "status": "approved",
    "createdAt": "2026-02-24T08:00:00"
  },
  {
    "id": 31,
    "userId": 14,
    "projectId": 2,
    "planNumber": "WP-2026-031",
    "planDate": "2026-06-12",
    "activities": "Menyelesaikan pekerjaan finishing dan pembersihan area",
    "status": "approved",
    "createdAt": "2026-06-12T08:00:00"
  },
  {
    "id": 32,
    "userId": 14,
    "projectId": 2,
    "planNumber": "WP-2026-032",
    "planDate": "2026-02-21",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "approved",
    "createdAt": "2026-02-21T08:00:00"
  },
  {
    "id": 33,
    "userId": 14,
    "projectId": 2,
    "planNumber": "WP-2026-033",
    "planDate": "2026-01-17",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "pending",
    "createdAt": "2026-01-17T08:00:00"
  },
  {
    "id": 34,
    "userId": 14,
    "projectId": 2,
    "planNumber": "WP-2026-034",
    "planDate": "2026-03-09",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "approved",
    "createdAt": "2026-03-09T08:00:00"
  },
  {
    "id": 35,
    "userId": 16,
    "projectId": 3,
    "planNumber": "WP-2026-035",
    "planDate": "2026-01-24",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "rejected",
    "createdAt": "2026-01-24T08:00:00"
  },
  {
    "id": 36,
    "userId": 16,
    "projectId": 3,
    "planNumber": "WP-2026-036",
    "planDate": "2026-02-23",
    "activities": "Menyelesaikan pekerjaan finishing dan pembersihan area",
    "status": "approved",
    "createdAt": "2026-02-23T08:00:00"
  },
  {
    "id": 37,
    "userId": 16,
    "projectId": 3,
    "planNumber": "WP-2026-037",
    "planDate": "2026-05-22",
    "activities": "Melakukan kalibrasi peralatan ukur di laboratorium",
    "status": "pending",
    "createdAt": "2026-05-22T08:00:00"
  },
  {
    "id": 38,
    "userId": 16,
    "projectId": 3,
    "planNumber": "WP-2026-038",
    "planDate": "2026-06-08",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "rejected",
    "createdAt": "2026-06-08T08:00:00"
  },
  {
    "id": 39,
    "userId": 7,
    "projectId": 3,
    "planNumber": "WP-2026-039",
    "planDate": "2026-06-17",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-06-17T08:00:00"
  },
  {
    "id": 40,
    "userId": 7,
    "projectId": 3,
    "planNumber": "WP-2026-040",
    "planDate": "2026-01-14",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "approved",
    "createdAt": "2026-01-14T08:00:00"
  },
  {
    "id": 41,
    "userId": 7,
    "projectId": 3,
    "planNumber": "WP-2026-041",
    "planDate": "2026-06-03",
    "activities": "Mempersiapkan material dan peralatan kerja di lokasi",
    "status": "approved",
    "createdAt": "2026-06-03T08:00:00"
  },
  {
    "id": 42,
    "userId": 7,
    "projectId": 3,
    "planNumber": "WP-2026-042",
    "planDate": "2026-05-11",
    "activities": "Memverifikasi hasil pengerjaan dengan as-built drawing",
    "status": "approved",
    "createdAt": "2026-05-11T08:00:00"
  },
  {
    "id": 43,
    "userId": 11,
    "projectId": 3,
    "planNumber": "WP-2026-043",
    "planDate": "2026-04-15",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "pending",
    "createdAt": "2026-04-15T08:00:00"
  },
  {
    "id": 44,
    "userId": 11,
    "projectId": 3,
    "planNumber": "WP-2026-044",
    "planDate": "2026-02-06",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "approved",
    "createdAt": "2026-02-06T08:00:00"
  },
  {
    "id": 45,
    "userId": 11,
    "projectId": 3,
    "planNumber": "WP-2026-045",
    "planDate": "2026-04-04",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "rejected",
    "createdAt": "2026-04-04T08:00:00"
  },
  {
    "id": 46,
    "userId": 11,
    "projectId": 3,
    "planNumber": "WP-2026-046",
    "planDate": "2026-06-22",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "rejected",
    "createdAt": "2026-06-22T08:00:00"
  },
  {
    "id": 47,
    "userId": 11,
    "projectId": 3,
    "planNumber": "WP-2026-047",
    "planDate": "2026-05-21",
    "activities": "Mempersiapkan material dan peralatan kerja di lokasi",
    "status": "pending",
    "createdAt": "2026-05-21T08:00:00"
  },
  {
    "id": 48,
    "userId": 18,
    "projectId": 3,
    "planNumber": "WP-2026-048",
    "planDate": "2026-06-16",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "approved",
    "createdAt": "2026-06-16T08:00:00"
  },
  {
    "id": 49,
    "userId": 18,
    "projectId": 3,
    "planNumber": "WP-2026-049",
    "planDate": "2026-05-12",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "approved",
    "createdAt": "2026-05-12T08:00:00"
  },
  {
    "id": 50,
    "userId": 18,
    "projectId": 3,
    "planNumber": "WP-2026-050",
    "planDate": "2026-06-17",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "pending",
    "createdAt": "2026-06-17T08:00:00"
  },
  {
    "id": 51,
    "userId": 18,
    "projectId": 3,
    "planNumber": "WP-2026-051",
    "planDate": "2026-01-18",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-01-18T08:00:00"
  },
  {
    "id": 52,
    "userId": 16,
    "projectId": 4,
    "planNumber": "WP-2026-052",
    "planDate": "2026-04-09",
    "activities": "Memverifikasi hasil pengerjaan dengan as-built drawing",
    "status": "approved",
    "createdAt": "2026-04-09T08:00:00"
  },
  {
    "id": 53,
    "userId": 16,
    "projectId": 4,
    "planNumber": "WP-2026-053",
    "planDate": "2026-04-06",
    "activities": "Berkoordinasi dengan vendor untuk pengiriman material",
    "status": "approved",
    "createdAt": "2026-04-06T08:00:00"
  },
  {
    "id": 54,
    "userId": 16,
    "projectId": 4,
    "planNumber": "WP-2026-054",
    "planDate": "2026-04-10",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "pending",
    "createdAt": "2026-04-10T08:00:00"
  },
  {
    "id": 55,
    "userId": 16,
    "projectId": 4,
    "planNumber": "WP-2026-055",
    "planDate": "2026-01-11",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "approved",
    "createdAt": "2026-01-11T08:00:00"
  },
  {
    "id": 56,
    "userId": 7,
    "projectId": 4,
    "planNumber": "WP-2026-056",
    "planDate": "2026-02-23",
    "activities": "Menyelesaikan pekerjaan finishing dan pembersihan area",
    "status": "approved",
    "createdAt": "2026-02-23T08:00:00"
  },
  {
    "id": 57,
    "userId": 7,
    "projectId": 4,
    "planNumber": "WP-2026-057",
    "planDate": "2026-03-16",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "rejected",
    "createdAt": "2026-03-16T08:00:00"
  },
  {
    "id": 58,
    "userId": 7,
    "projectId": 4,
    "planNumber": "WP-2026-058",
    "planDate": "2026-06-16",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-06-16T08:00:00"
  },
  {
    "id": 59,
    "userId": 14,
    "projectId": 4,
    "planNumber": "WP-2026-059",
    "planDate": "2026-06-10",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "approved",
    "createdAt": "2026-06-10T08:00:00"
  },
  {
    "id": 60,
    "userId": 14,
    "projectId": 4,
    "planNumber": "WP-2026-060",
    "planDate": "2026-02-17",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "rejected",
    "createdAt": "2026-02-17T08:00:00"
  },
  {
    "id": 61,
    "userId": 14,
    "projectId": 4,
    "planNumber": "WP-2026-061",
    "planDate": "2026-06-16",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "approved",
    "createdAt": "2026-06-16T08:00:00"
  },
  {
    "id": 62,
    "userId": 14,
    "projectId": 4,
    "planNumber": "WP-2026-062",
    "planDate": "2026-01-18",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "approved",
    "createdAt": "2026-01-18T08:00:00"
  },
  {
    "id": 63,
    "userId": 17,
    "projectId": 4,
    "planNumber": "WP-2026-063",
    "planDate": "2026-04-06",
    "activities": "Memverifikasi hasil pengerjaan dengan as-built drawing",
    "status": "rejected",
    "createdAt": "2026-04-06T08:00:00"
  },
  {
    "id": 64,
    "userId": 17,
    "projectId": 4,
    "planNumber": "WP-2026-064",
    "planDate": "2026-05-01",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "approved",
    "createdAt": "2026-05-01T08:00:00"
  },
  {
    "id": 65,
    "userId": 17,
    "projectId": 4,
    "planNumber": "WP-2026-065",
    "planDate": "2026-04-03",
    "activities": "Melakukan kalibrasi peralatan ukur di laboratorium",
    "status": "rejected",
    "createdAt": "2026-04-03T08:00:00"
  },
  {
    "id": 66,
    "userId": 17,
    "projectId": 4,
    "planNumber": "WP-2026-066",
    "planDate": "2026-04-07",
    "activities": "Menyelesaikan pekerjaan finishing dan pembersihan area",
    "status": "approved",
    "createdAt": "2026-04-07T08:00:00"
  },
  {
    "id": 67,
    "userId": 17,
    "projectId": 4,
    "planNumber": "WP-2026-067",
    "planDate": "2026-06-02",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "rejected",
    "createdAt": "2026-06-02T08:00:00"
  },
  {
    "id": 68,
    "userId": 4,
    "projectId": 5,
    "planNumber": "WP-2026-068",
    "planDate": "2026-06-13",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "pending",
    "createdAt": "2026-06-13T08:00:00"
  },
  {
    "id": 69,
    "userId": 4,
    "projectId": 5,
    "planNumber": "WP-2026-069",
    "planDate": "2026-05-01",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "rejected",
    "createdAt": "2026-05-01T08:00:00"
  },
  {
    "id": 70,
    "userId": 4,
    "projectId": 5,
    "planNumber": "WP-2026-070",
    "planDate": "2026-02-20",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "pending",
    "createdAt": "2026-02-20T08:00:00"
  },
  {
    "id": 71,
    "userId": 5,
    "projectId": 5,
    "planNumber": "WP-2026-071",
    "planDate": "2026-04-16",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "approved",
    "createdAt": "2026-04-16T08:00:00"
  },
  {
    "id": 72,
    "userId": 5,
    "projectId": 5,
    "planNumber": "WP-2026-072",
    "planDate": "2026-06-17",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "pending",
    "createdAt": "2026-06-17T08:00:00"
  },
  {
    "id": 73,
    "userId": 5,
    "projectId": 5,
    "planNumber": "WP-2026-073",
    "planDate": "2026-06-06",
    "activities": "Memverifikasi hasil pengerjaan dengan as-built drawing",
    "status": "approved",
    "createdAt": "2026-06-06T08:00:00"
  },
  {
    "id": 74,
    "userId": 6,
    "projectId": 5,
    "planNumber": "WP-2026-074",
    "planDate": "2026-02-11",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "pending",
    "createdAt": "2026-02-11T08:00:00"
  },
  {
    "id": 75,
    "userId": 6,
    "projectId": 5,
    "planNumber": "WP-2026-075",
    "planDate": "2026-04-15",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "approved",
    "createdAt": "2026-04-15T08:00:00"
  },
  {
    "id": 76,
    "userId": 6,
    "projectId": 5,
    "planNumber": "WP-2026-076",
    "planDate": "2026-05-01",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "approved",
    "createdAt": "2026-05-01T08:00:00"
  },
  {
    "id": 77,
    "userId": 6,
    "projectId": 5,
    "planNumber": "WP-2026-077",
    "planDate": "2026-04-03",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "rejected",
    "createdAt": "2026-04-03T08:00:00"
  },
  {
    "id": 78,
    "userId": 10,
    "projectId": 5,
    "planNumber": "WP-2026-078",
    "planDate": "2026-04-14",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "rejected",
    "createdAt": "2026-04-14T08:00:00"
  },
  {
    "id": 79,
    "userId": 10,
    "projectId": 5,
    "planNumber": "WP-2026-079",
    "planDate": "2026-03-03",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "rejected",
    "createdAt": "2026-03-03T08:00:00"
  },
  {
    "id": 80,
    "userId": 10,
    "projectId": 5,
    "planNumber": "WP-2026-080",
    "planDate": "2026-04-04",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "approved",
    "createdAt": "2026-04-04T08:00:00"
  },
  {
    "id": 81,
    "userId": 10,
    "projectId": 5,
    "planNumber": "WP-2026-081",
    "planDate": "2026-04-17",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "approved",
    "createdAt": "2026-04-17T08:00:00"
  },
  {
    "id": 82,
    "userId": 16,
    "projectId": 6,
    "planNumber": "WP-2026-082",
    "planDate": "2026-04-12",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "rejected",
    "createdAt": "2026-04-12T08:00:00"
  },
  {
    "id": 83,
    "userId": 16,
    "projectId": 6,
    "planNumber": "WP-2026-083",
    "planDate": "2026-04-16",
    "activities": "Menyelesaikan pekerjaan finishing dan pembersihan area",
    "status": "pending",
    "createdAt": "2026-04-16T08:00:00"
  },
  {
    "id": 84,
    "userId": 16,
    "projectId": 6,
    "planNumber": "WP-2026-084",
    "planDate": "2026-02-25",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "pending",
    "createdAt": "2026-02-25T08:00:00"
  },
  {
    "id": 85,
    "userId": 16,
    "projectId": 6,
    "planNumber": "WP-2026-085",
    "planDate": "2026-01-11",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "approved",
    "createdAt": "2026-01-11T08:00:00"
  },
  {
    "id": 86,
    "userId": 16,
    "projectId": 6,
    "planNumber": "WP-2026-086",
    "planDate": "2026-02-19",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "pending",
    "createdAt": "2026-02-19T08:00:00"
  },
  {
    "id": 87,
    "userId": 6,
    "projectId": 6,
    "planNumber": "WP-2026-087",
    "planDate": "2026-02-16",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "rejected",
    "createdAt": "2026-02-16T08:00:00"
  },
  {
    "id": 88,
    "userId": 6,
    "projectId": 6,
    "planNumber": "WP-2026-088",
    "planDate": "2026-02-20",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "pending",
    "createdAt": "2026-02-20T08:00:00"
  },
  {
    "id": 89,
    "userId": 6,
    "projectId": 6,
    "planNumber": "WP-2026-089",
    "planDate": "2026-02-07",
    "activities": "Mempersiapkan material dan peralatan kerja di lokasi",
    "status": "approved",
    "createdAt": "2026-02-07T08:00:00"
  },
  {
    "id": 90,
    "userId": 6,
    "projectId": 6,
    "planNumber": "WP-2026-090",
    "planDate": "2026-04-04",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "approved",
    "createdAt": "2026-04-04T08:00:00"
  },
  {
    "id": 91,
    "userId": 11,
    "projectId": 6,
    "planNumber": "WP-2026-091",
    "planDate": "2026-03-19",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "rejected",
    "createdAt": "2026-03-19T08:00:00"
  },
  {
    "id": 92,
    "userId": 11,
    "projectId": 6,
    "planNumber": "WP-2026-092",
    "planDate": "2026-02-03",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "rejected",
    "createdAt": "2026-02-03T08:00:00"
  },
  {
    "id": 93,
    "userId": 11,
    "projectId": 6,
    "planNumber": "WP-2026-093",
    "planDate": "2026-02-01",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "approved",
    "createdAt": "2026-02-01T08:00:00"
  },
  {
    "id": 94,
    "userId": 11,
    "projectId": 6,
    "planNumber": "WP-2026-094",
    "planDate": "2026-03-05",
    "activities": "Berkoordinasi dengan vendor untuk pengiriman material",
    "status": "pending",
    "createdAt": "2026-03-05T08:00:00"
  },
  {
    "id": 95,
    "userId": 19,
    "projectId": 6,
    "planNumber": "WP-2026-095",
    "planDate": "2026-04-21",
    "activities": "Melakukan kalibrasi peralatan ukur di laboratorium",
    "status": "approved",
    "createdAt": "2026-04-21T08:00:00"
  },
  {
    "id": 96,
    "userId": 19,
    "projectId": 6,
    "planNumber": "WP-2026-096",
    "planDate": "2026-02-09",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-02-09T08:00:00"
  },
  {
    "id": 97,
    "userId": 19,
    "projectId": 6,
    "planNumber": "WP-2026-097",
    "planDate": "2026-05-06",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "approved",
    "createdAt": "2026-05-06T08:00:00"
  },
  {
    "id": 98,
    "userId": 19,
    "projectId": 6,
    "planNumber": "WP-2026-098",
    "planDate": "2026-05-24",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-05-24T08:00:00"
  },
  {
    "id": 99,
    "userId": 19,
    "projectId": 6,
    "planNumber": "WP-2026-099",
    "planDate": "2026-01-04",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "pending",
    "createdAt": "2026-01-04T08:00:00"
  },
  {
    "id": 100,
    "userId": 4,
    "projectId": 7,
    "planNumber": "WP-2026-100",
    "planDate": "2026-06-23",
    "activities": "Berkoordinasi dengan vendor untuk pengiriman material",
    "status": "rejected",
    "createdAt": "2026-06-23T08:00:00"
  },
  {
    "id": 101,
    "userId": 4,
    "projectId": 7,
    "planNumber": "WP-2026-101",
    "planDate": "2026-02-16",
    "activities": "Menyelesaikan pekerjaan finishing dan pembersihan area",
    "status": "approved",
    "createdAt": "2026-02-16T08:00:00"
  },
  {
    "id": 102,
    "userId": 4,
    "projectId": 7,
    "planNumber": "WP-2026-102",
    "planDate": "2026-01-21",
    "activities": "Memverifikasi hasil pengerjaan dengan as-built drawing",
    "status": "rejected",
    "createdAt": "2026-01-21T08:00:00"
  },
  {
    "id": 103,
    "userId": 20,
    "projectId": 7,
    "planNumber": "WP-2026-103",
    "planDate": "2026-02-11",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "approved",
    "createdAt": "2026-02-11T08:00:00"
  },
  {
    "id": 104,
    "userId": 20,
    "projectId": 7,
    "planNumber": "WP-2026-104",
    "planDate": "2026-02-20",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "approved",
    "createdAt": "2026-02-20T08:00:00"
  },
  {
    "id": 105,
    "userId": 20,
    "projectId": 7,
    "planNumber": "WP-2026-105",
    "planDate": "2026-05-10",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "pending",
    "createdAt": "2026-05-10T08:00:00"
  },
  {
    "id": 106,
    "userId": 5,
    "projectId": 7,
    "planNumber": "WP-2026-106",
    "planDate": "2026-01-02",
    "activities": "Berkoordinasi dengan vendor untuk pengiriman material",
    "status": "approved",
    "createdAt": "2026-01-02T08:00:00"
  },
  {
    "id": 107,
    "userId": 5,
    "projectId": 7,
    "planNumber": "WP-2026-107",
    "planDate": "2026-05-15",
    "activities": "Mempersiapkan material dan peralatan kerja di lokasi",
    "status": "approved",
    "createdAt": "2026-05-15T08:00:00"
  },
  {
    "id": 108,
    "userId": 5,
    "projectId": 7,
    "planNumber": "WP-2026-108",
    "planDate": "2026-01-23",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "approved",
    "createdAt": "2026-01-23T08:00:00"
  },
  {
    "id": 109,
    "userId": 5,
    "projectId": 7,
    "planNumber": "WP-2026-109",
    "planDate": "2026-06-20",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "rejected",
    "createdAt": "2026-06-20T08:00:00"
  },
  {
    "id": 110,
    "userId": 10,
    "projectId": 7,
    "planNumber": "WP-2026-110",
    "planDate": "2026-05-11",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-05-11T08:00:00"
  },
  {
    "id": 111,
    "userId": 10,
    "projectId": 7,
    "planNumber": "WP-2026-111",
    "planDate": "2026-06-20",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "approved",
    "createdAt": "2026-06-20T08:00:00"
  },
  {
    "id": 112,
    "userId": 10,
    "projectId": 7,
    "planNumber": "WP-2026-112",
    "planDate": "2026-02-12",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "rejected",
    "createdAt": "2026-02-12T08:00:00"
  },
  {
    "id": 113,
    "userId": 16,
    "projectId": 8,
    "planNumber": "WP-2026-113",
    "planDate": "2026-01-10",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "approved",
    "createdAt": "2026-01-10T08:00:00"
  },
  {
    "id": 114,
    "userId": 16,
    "projectId": 8,
    "planNumber": "WP-2026-114",
    "planDate": "2026-06-03",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "approved",
    "createdAt": "2026-06-03T08:00:00"
  },
  {
    "id": 115,
    "userId": 16,
    "projectId": 8,
    "planNumber": "WP-2026-115",
    "planDate": "2026-04-03",
    "activities": "Melakukan koordinasi dengan instansi pemerintah setempat",
    "status": "rejected",
    "createdAt": "2026-04-03T08:00:00"
  },
  {
    "id": 116,
    "userId": 16,
    "projectId": 8,
    "planNumber": "WP-2026-116",
    "planDate": "2026-01-22",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "rejected",
    "createdAt": "2026-01-22T08:00:00"
  },
  {
    "id": 117,
    "userId": 16,
    "projectId": 8,
    "planNumber": "WP-2026-117",
    "planDate": "2026-05-21",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "pending",
    "createdAt": "2026-05-21T08:00:00"
  },
  {
    "id": 118,
    "userId": 7,
    "projectId": 8,
    "planNumber": "WP-2026-118",
    "planDate": "2026-06-01",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "rejected",
    "createdAt": "2026-06-01T08:00:00"
  },
  {
    "id": 119,
    "userId": 7,
    "projectId": 8,
    "planNumber": "WP-2026-119",
    "planDate": "2026-05-04",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "approved",
    "createdAt": "2026-05-04T08:00:00"
  },
  {
    "id": 120,
    "userId": 7,
    "projectId": 8,
    "planNumber": "WP-2026-120",
    "planDate": "2026-06-15",
    "activities": "Memverifikasi hasil pengerjaan dengan as-built drawing",
    "status": "approved",
    "createdAt": "2026-06-15T08:00:00"
  },
  {
    "id": 121,
    "userId": 7,
    "projectId": 8,
    "planNumber": "WP-2026-121",
    "planDate": "2026-03-16",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-03-16T08:00:00"
  },
  {
    "id": 122,
    "userId": 7,
    "projectId": 8,
    "planNumber": "WP-2026-122",
    "planDate": "2026-01-21",
    "activities": "Berkoordinasi dengan vendor untuk pengiriman material",
    "status": "rejected",
    "createdAt": "2026-01-21T08:00:00"
  },
  {
    "id": 123,
    "userId": 17,
    "projectId": 8,
    "planNumber": "WP-2026-123",
    "planDate": "2026-01-09",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "approved",
    "createdAt": "2026-01-09T08:00:00"
  },
  {
    "id": 124,
    "userId": 17,
    "projectId": 8,
    "planNumber": "WP-2026-124",
    "planDate": "2026-02-01",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "approved",
    "createdAt": "2026-02-01T08:00:00"
  },
  {
    "id": 125,
    "userId": 17,
    "projectId": 8,
    "planNumber": "WP-2026-125",
    "planDate": "2026-06-13",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "rejected",
    "createdAt": "2026-06-13T08:00:00"
  },
  {
    "id": 126,
    "userId": 17,
    "projectId": 8,
    "planNumber": "WP-2026-126",
    "planDate": "2026-04-05",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "approved",
    "createdAt": "2026-04-05T08:00:00"
  },
  {
    "id": 127,
    "userId": 17,
    "projectId": 8,
    "planNumber": "WP-2026-127",
    "planDate": "2026-02-13",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "rejected",
    "createdAt": "2026-02-13T08:00:00"
  },
  {
    "id": 128,
    "userId": 9,
    "projectId": 8,
    "planNumber": "WP-2026-128",
    "planDate": "2026-03-17",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-03-17T08:00:00"
  },
  {
    "id": 129,
    "userId": 9,
    "projectId": 8,
    "planNumber": "WP-2026-129",
    "planDate": "2026-03-03",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "approved",
    "createdAt": "2026-03-03T08:00:00"
  },
  {
    "id": 130,
    "userId": 9,
    "projectId": 8,
    "planNumber": "WP-2026-130",
    "planDate": "2026-04-23",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "approved",
    "createdAt": "2026-04-23T08:00:00"
  },
  {
    "id": 131,
    "userId": 4,
    "projectId": 9,
    "planNumber": "WP-2026-131",
    "planDate": "2026-02-03",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "pending",
    "createdAt": "2026-02-03T08:00:00"
  },
  {
    "id": 132,
    "userId": 4,
    "projectId": 9,
    "planNumber": "WP-2026-132",
    "planDate": "2026-03-10",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "pending",
    "createdAt": "2026-03-10T08:00:00"
  },
  {
    "id": 133,
    "userId": 4,
    "projectId": 9,
    "planNumber": "WP-2026-133",
    "planDate": "2026-01-23",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "approved",
    "createdAt": "2026-01-23T08:00:00"
  },
  {
    "id": 134,
    "userId": 4,
    "projectId": 9,
    "planNumber": "WP-2026-134",
    "planDate": "2026-05-13",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "approved",
    "createdAt": "2026-05-13T08:00:00"
  },
  {
    "id": 135,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-135",
    "planDate": "2026-04-21",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "rejected",
    "createdAt": "2026-04-21T08:00:00"
  },
  {
    "id": 136,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-136",
    "planDate": "2026-05-21",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "rejected",
    "createdAt": "2026-05-21T08:00:00"
  },
  {
    "id": 137,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-137",
    "planDate": "2026-03-06",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "pending",
    "createdAt": "2026-03-06T08:00:00"
  },
  {
    "id": 138,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-138",
    "planDate": "2026-03-02",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "approved",
    "createdAt": "2026-03-02T08:00:00"
  },
  {
    "id": 139,
    "userId": 6,
    "projectId": 9,
    "planNumber": "WP-2026-139",
    "planDate": "2026-01-20",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-01-20T08:00:00"
  },
  {
    "id": 140,
    "userId": 8,
    "projectId": 9,
    "planNumber": "WP-2026-140",
    "planDate": "2026-06-08",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "approved",
    "createdAt": "2026-06-08T08:00:00"
  },
  {
    "id": 141,
    "userId": 8,
    "projectId": 9,
    "planNumber": "WP-2026-141",
    "planDate": "2026-01-17",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "rejected",
    "createdAt": "2026-01-17T08:00:00"
  },
  {
    "id": 142,
    "userId": 8,
    "projectId": 9,
    "planNumber": "WP-2026-142",
    "planDate": "2026-02-22",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "pending",
    "createdAt": "2026-02-22T08:00:00"
  },
  {
    "id": 143,
    "userId": 16,
    "projectId": 10,
    "planNumber": "WP-2026-143",
    "planDate": "2026-02-14",
    "activities": "Berkoordinasi dengan vendor untuk pengiriman material",
    "status": "approved",
    "createdAt": "2026-02-14T08:00:00"
  },
  {
    "id": 144,
    "userId": 16,
    "projectId": 10,
    "planNumber": "WP-2026-144",
    "planDate": "2026-04-25",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "approved",
    "createdAt": "2026-04-25T08:00:00"
  },
  {
    "id": 145,
    "userId": 16,
    "projectId": 10,
    "planNumber": "WP-2026-145",
    "planDate": "2026-04-16",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "approved",
    "createdAt": "2026-04-16T08:00:00"
  },
  {
    "id": 146,
    "userId": 16,
    "projectId": 10,
    "planNumber": "WP-2026-146",
    "planDate": "2026-01-16",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "rejected",
    "createdAt": "2026-01-16T08:00:00"
  },
  {
    "id": 147,
    "userId": 16,
    "projectId": 10,
    "planNumber": "WP-2026-147",
    "planDate": "2026-02-07",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "rejected",
    "createdAt": "2026-02-07T08:00:00"
  },
  {
    "id": 148,
    "userId": 12,
    "projectId": 10,
    "planNumber": "WP-2026-148",
    "planDate": "2026-01-19",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "approved",
    "createdAt": "2026-01-19T08:00:00"
  },
  {
    "id": 149,
    "userId": 12,
    "projectId": 10,
    "planNumber": "WP-2026-149",
    "planDate": "2026-04-25",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "approved",
    "createdAt": "2026-04-25T08:00:00"
  },
  {
    "id": 150,
    "userId": 12,
    "projectId": 10,
    "planNumber": "WP-2026-150",
    "planDate": "2026-04-12",
    "activities": "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
    "status": "rejected",
    "createdAt": "2026-04-12T08:00:00"
  },
  {
    "id": 151,
    "userId": 12,
    "projectId": 10,
    "planNumber": "WP-2026-151",
    "planDate": "2026-05-15",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "pending",
    "createdAt": "2026-05-15T08:00:00"
  },
  {
    "id": 152,
    "userId": 8,
    "projectId": 10,
    "planNumber": "WP-2026-152",
    "planDate": "2026-05-07",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "approved",
    "createdAt": "2026-05-07T08:00:00"
  },
  {
    "id": 153,
    "userId": 8,
    "projectId": 10,
    "planNumber": "WP-2026-153",
    "planDate": "2026-02-20",
    "activities": "Melaksanakan pengujian kualitas material sebelum pemasangan",
    "status": "approved",
    "createdAt": "2026-02-20T08:00:00"
  },
  {
    "id": 154,
    "userId": 8,
    "projectId": 10,
    "planNumber": "WP-2026-154",
    "planDate": "2026-02-08",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "rejected",
    "createdAt": "2026-02-08T08:00:00"
  },
  {
    "id": 155,
    "userId": 9,
    "projectId": 10,
    "planNumber": "WP-2026-155",
    "planDate": "2026-03-12",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "approved",
    "createdAt": "2026-03-12T08:00:00"
  },
  {
    "id": 156,
    "userId": 9,
    "projectId": 10,
    "planNumber": "WP-2026-156",
    "planDate": "2026-01-13",
    "activities": "Melakukan kalibrasi peralatan ukur di laboratorium",
    "status": "approved",
    "createdAt": "2026-01-13T08:00:00"
  },
  {
    "id": 157,
    "userId": 9,
    "projectId": 10,
    "planNumber": "WP-2026-157",
    "planDate": "2026-06-20",
    "activities": "Melaksanakan safety briefing dan inspeksi K3 harian",
    "status": "approved",
    "createdAt": "2026-06-20T08:00:00"
  },
  {
    "id": 158,
    "userId": 9,
    "projectId": 10,
    "planNumber": "WP-2026-158",
    "planDate": "2026-05-03",
    "activities": "Mempersiapkan material dan peralatan kerja di lokasi",
    "status": "approved",
    "createdAt": "2026-05-03T08:00:00"
  },
  {
    "id": 159,
    "userId": 1,
    "projectId": 1,
    "planNumber": "WP-2026-159",
    "planDate": "2026-02-13",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-02-13T08:00:00"
  },
  {
    "id": 160,
    "userId": 1,
    "projectId": 1,
    "planNumber": "WP-2026-160",
    "planDate": "2026-01-18",
    "activities": "Membuat laporan progres mingguan dan dokumentasi foto",
    "status": "approved",
    "createdAt": "2026-01-18T08:00:00"
  },
  {
    "id": 161,
    "userId": 1,
    "projectId": 1,
    "planNumber": "WP-2026-161",
    "planDate": "2026-01-12",
    "activities": "Melakukan commissioning awal sistem mekanikal",
    "status": "approved",
    "createdAt": "2026-01-12T08:00:00"
  },
  {
    "id": 162,
    "userId": 2,
    "projectId": 1,
    "planNumber": "WP-2026-162",
    "planDate": "2026-05-24",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-05-24T08:00:00"
  },
  {
    "id": 163,
    "userId": 2,
    "projectId": 1,
    "planNumber": "WP-2026-163",
    "planDate": "2026-04-07",
    "activities": "Mempersiapkan material dan peralatan kerja di lokasi",
    "status": "approved",
    "createdAt": "2026-04-07T08:00:00"
  },
  {
    "id": 164,
    "userId": 2,
    "projectId": 1,
    "planNumber": "WP-2026-164",
    "planDate": "2026-05-15",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "pending",
    "createdAt": "2026-05-15T08:00:00"
  },
  {
    "id": 165,
    "userId": 2,
    "projectId": 1,
    "planNumber": "WP-2026-165",
    "planDate": "2026-03-06",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-03-06T08:00:00"
  },
  {
    "id": 166,
    "userId": 3,
    "projectId": 5,
    "planNumber": "WP-2026-166",
    "planDate": "2026-03-23",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-03-23T08:00:00"
  },
  {
    "id": 167,
    "userId": 3,
    "projectId": 5,
    "planNumber": "WP-2026-167",
    "planDate": "2026-02-23",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "approved",
    "createdAt": "2026-02-23T08:00:00"
  },
  {
    "id": 168,
    "userId": 3,
    "projectId": 5,
    "planNumber": "WP-2026-168",
    "planDate": "2026-03-21",
    "activities": "Melaksanakan pelatihan teknis untuk operator lokal",
    "status": "rejected",
    "createdAt": "2026-03-21T08:00:00"
  },
  {
    "id": 169,
    "userId": 15,
    "projectId": 2,
    "planNumber": "WP-2026-169",
    "planDate": "2026-04-16",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "approved",
    "createdAt": "2026-04-16T08:00:00"
  },
  {
    "id": 170,
    "userId": 15,
    "projectId": 2,
    "planNumber": "WP-2026-170",
    "planDate": "2026-06-14",
    "activities": "Melaksanakan survei topografi dan pemetaan jalur instalasi",
    "status": "rejected",
    "createdAt": "2026-06-14T08:00:00"
  },
  {
    "id": 171,
    "userId": 15,
    "projectId": 2,
    "planNumber": "WP-2026-171",
    "planDate": "2026-01-24",
    "activities": "Melakukan fabrikasi komponen struktural sesuai gambar desain",
    "status": "approved",
    "createdAt": "2026-01-24T08:00:00"
  },
  {
    "id": 172,
    "userId": 15,
    "projectId": 2,
    "planNumber": "WP-2026-172",
    "planDate": "2026-01-04",
    "activities": "Mengurus dokumen izin kerja (Work Permit) di lokasi",
    "status": "approved",
    "createdAt": "2026-01-04T08:00:00"
  },
  {
    "id": 173,
    "userId": 15,
    "projectId": 2,
    "planNumber": "WP-2026-173",
    "planDate": "2026-05-07",
    "activities": "Berkoordinasi dengan vendor untuk pengiriman material",
    "status": "approved",
    "createdAt": "2026-05-07T08:00:00"
  }
];

export const workRealizations: WorkRealization[] = [
  {
    "id": 1,
    "userId": 1,
    "projectId": 1,
    "realizationNumber": "WR-2026-001",
    "realizationDate": "2026-06-22",
    "activities": "Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.",
    "progress": 85,
    "status": "extended",
    "createdAt": "2026-06-22T17:00:00",
    "feedback": "Beberapa poin belum selesai. Selesaikan item B3, C1, dan D2 sebelum laporan final.",
    "extendedUntil": "2026-07-10"
  },
  {
    "id": 2,
    "userId": 1,
    "projectId": 1,
    "realizationNumber": "WR-2026-002",
    "realizationDate": "2026-03-03",
    "activities": "Material lengkap tiba di lokasi. Seluruh item sudah diinspeksi dan dicatat di inventory log.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-03-03T17:00:00"
  },
  {
    "id": 3,
    "userId": 1,
    "projectId": 1,
    "realizationNumber": "WR-2026-003",
    "realizationDate": "2026-02-21",
    "activities": "Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.",
    "progress": 85,
    "status": "extended",
    "createdAt": "2026-02-21T17:00:00",
    "feedback": "Koordinasi dengan pihak ketiga masih berlangsung. Update status setiap Senin.",
    "extendedUntil": "2026-03-20"
  },
  {
    "id": 4,
    "userId": 2,
    "projectId": 1,
    "realizationNumber": "WR-2026-004",
    "realizationDate": "2026-06-12",
    "activities": "Pelatihan operator dilakukan untuk 15 personel lokal. Modul teknis sudah didistribusikan.",
    "progress": 82,
    "status": "extended",
    "createdAt": "2026-06-12T17:00:00",
    "feedback": "Menunggu material pengganti dari vendor. Estimasi tiba 2 minggu, lanjutkan setelah itu.",
    "extendedUntil": "2026-07-23"
  },
  {
    "id": 5,
    "userId": 2,
    "projectId": 1,
    "realizationNumber": "WR-2026-005",
    "realizationDate": "2026-04-04",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "rejected",
    "createdAt": "2026-04-04T17:00:00",
    "feedback": "Data pengujian tidak terlampir. Wajib sertakan hasil uji laboratorium bersertifikat."
  },
  {
    "id": 6,
    "userId": 2,
    "projectId": 1,
    "realizationNumber": "WR-2026-006",
    "realizationDate": "2026-03-03",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "approved",
    "createdAt": "2026-03-03T17:00:00",
    "feedback": "Selesai sesuai jadwal dan standar. Bagus!"
  },
  {
    "id": 7,
    "userId": 3,
    "projectId": 5,
    "realizationNumber": "WR-2026-007",
    "realizationDate": "2026-04-25",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "approved",
    "createdAt": "2026-04-25T17:00:00"
  },
  {
    "id": 8,
    "userId": 3,
    "projectId": 5,
    "realizationNumber": "WR-2026-008",
    "realizationDate": "2026-02-11",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "rejected",
    "createdAt": "2026-02-11T17:00:00",
    "feedback": "Data pengujian tidak terlampir. Wajib sertakan hasil uji laboratorium bersertifikat."
  },
  {
    "id": 9,
    "userId": 15,
    "projectId": 2,
    "realizationNumber": "WR-2026-009",
    "realizationDate": "2026-04-14",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "rejected",
    "createdAt": "2026-04-14T17:00:00",
    "feedback": "Progress tidak sesuai target. Jelaskan hambatan yang terjadi dan rencana percepatan."
  },
  {
    "id": 10,
    "userId": 15,
    "projectId": 2,
    "realizationNumber": "WR-2026-010",
    "realizationDate": "2026-04-12",
    "activities": "Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.",
    "progress": 85,
    "status": "extended",
    "createdAt": "2026-04-12T17:00:00",
    "feedback": "Menunggu material pengganti dari vendor. Estimasi tiba 2 minggu, lanjutkan setelah itu.",
    "extendedUntil": "2026-05-25"
  },
  {
    "id": 11,
    "userId": 15,
    "projectId": 2,
    "realizationNumber": "WR-2026-011",
    "realizationDate": "2026-04-13",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "approved",
    "createdAt": "2026-04-13T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 12,
    "userId": 15,
    "projectId": 2,
    "realizationNumber": "WR-2026-012",
    "realizationDate": "2026-06-06",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-06-06T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 13,
    "userId": 4,
    "projectId": 1,
    "realizationNumber": "WR-2026-013",
    "realizationDate": "2026-03-10",
    "activities": "Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-03-10T17:00:00"
  },
  {
    "id": 14,
    "userId": 4,
    "projectId": 1,
    "realizationNumber": "WR-2026-014",
    "realizationDate": "2026-04-24",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-04-24T17:00:00"
  },
  {
    "id": 15,
    "userId": 5,
    "projectId": 1,
    "realizationNumber": "WR-2026-015",
    "realizationDate": "2026-05-05",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "approved",
    "createdAt": "2026-05-05T17:00:00"
  },
  {
    "id": 16,
    "userId": 5,
    "projectId": 1,
    "realizationNumber": "WR-2026-016",
    "realizationDate": "2026-05-07",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-05-07T17:00:00"
  },
  {
    "id": 17,
    "userId": 6,
    "projectId": 1,
    "realizationNumber": "WR-2026-017",
    "realizationDate": "2026-05-15",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "rejected",
    "createdAt": "2026-05-15T17:00:00",
    "feedback": "Data pengujian tidak terlampir. Wajib sertakan hasil uji laboratorium bersertifikat."
  },
  {
    "id": 18,
    "userId": 6,
    "projectId": 1,
    "realizationNumber": "WR-2026-018",
    "realizationDate": "2026-04-22",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-04-22T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 19,
    "userId": 10,
    "projectId": 1,
    "realizationNumber": "WR-2026-019",
    "realizationDate": "2026-05-22",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "pending",
    "createdAt": "2026-05-22T17:00:00"
  },
  {
    "id": 20,
    "userId": 10,
    "projectId": 1,
    "realizationNumber": "WR-2026-020",
    "realizationDate": "2026-06-24",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "approved",
    "createdAt": "2026-06-24T17:00:00"
  },
  {
    "id": 21,
    "userId": 20,
    "projectId": 1,
    "realizationNumber": "WR-2026-021",
    "realizationDate": "2026-06-01",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "approved",
    "createdAt": "2026-06-01T17:00:00"
  },
  {
    "id": 22,
    "userId": 20,
    "projectId": 1,
    "realizationNumber": "WR-2026-022",
    "realizationDate": "2026-06-15",
    "activities": "Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-06-15T17:00:00"
  },
  {
    "id": 23,
    "userId": 20,
    "projectId": 1,
    "realizationNumber": "WR-2026-023",
    "realizationDate": "2026-03-12",
    "activities": "Material lengkap tiba di lokasi. Seluruh item sudah diinspeksi dan dicatat di inventory log.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-03-12T17:00:00"
  },
  {
    "id": 24,
    "userId": 4,
    "projectId": 2,
    "realizationNumber": "WR-2026-024",
    "realizationDate": "2026-04-02",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-04-02T17:00:00"
  },
  {
    "id": 25,
    "userId": 20,
    "projectId": 2,
    "realizationNumber": "WR-2026-025",
    "realizationDate": "2026-03-19",
    "activities": "Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.",
    "progress": 87,
    "status": "pending",
    "createdAt": "2026-03-19T17:00:00"
  },
  {
    "id": 26,
    "userId": 20,
    "projectId": 2,
    "realizationNumber": "WR-2026-026",
    "realizationDate": "2026-05-11",
    "activities": "Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-05-11T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 27,
    "userId": 20,
    "projectId": 2,
    "realizationNumber": "WR-2026-027",
    "realizationDate": "2026-06-11",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "approved",
    "createdAt": "2026-06-11T17:00:00",
    "feedback": "Selesai sesuai jadwal dan standar. Bagus!"
  },
  {
    "id": 28,
    "userId": 20,
    "projectId": 2,
    "realizationNumber": "WR-2026-028",
    "realizationDate": "2026-02-25",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "pending",
    "createdAt": "2026-02-25T17:00:00"
  },
  {
    "id": 29,
    "userId": 14,
    "projectId": 2,
    "realizationNumber": "WR-2026-029",
    "realizationDate": "2026-06-16",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-06-16T17:00:00"
  },
  {
    "id": 30,
    "userId": 14,
    "projectId": 2,
    "realizationNumber": "WR-2026-030",
    "realizationDate": "2026-06-21",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "rejected",
    "createdAt": "2026-06-21T17:00:00",
    "feedback": "Dokumentasi tidak lengkap. Mohon lampirkan foto before-after dan laporan QC."
  },
  {
    "id": 31,
    "userId": 14,
    "projectId": 2,
    "realizationNumber": "WR-2026-031",
    "realizationDate": "2026-06-10",
    "activities": "Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.",
    "progress": 100,
    "status": "rejected",
    "createdAt": "2026-06-10T17:00:00",
    "feedback": "Jumlah personel yang dilaporkan tidak sesuai absensi harian. Harap diklarifikasi."
  },
  {
    "id": 32,
    "userId": 16,
    "projectId": 3,
    "realizationNumber": "WR-2026-032",
    "realizationDate": "2026-04-10",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "extended",
    "createdAt": "2026-04-10T17:00:00",
    "feedback": "Hasil pengujian belum memenuhi standar minimal. Lakukan pengulangan dengan witnessing.",
    "extendedUntil": "2026-05-20"
  },
  {
    "id": 33,
    "userId": 7,
    "projectId": 3,
    "realizationNumber": "WR-2026-033",
    "realizationDate": "2026-06-08",
    "activities": "Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.",
    "progress": 100,
    "status": "extended",
    "createdAt": "2026-06-08T17:00:00",
    "feedback": "Pekerjaan perlu dilanjutkan. Sertakan jadwal penyelesaian yang realistis.",
    "extendedUntil": "2026-07-10"
  },
  {
    "id": 34,
    "userId": 7,
    "projectId": 3,
    "realizationNumber": "WR-2026-034",
    "realizationDate": "2026-05-12",
    "activities": "Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.",
    "progress": 85,
    "status": "rejected",
    "createdAt": "2026-05-12T17:00:00",
    "feedback": "Data pengujian tidak terlampir. Wajib sertakan hasil uji laboratorium bersertifikat."
  },
  {
    "id": 35,
    "userId": 7,
    "projectId": 3,
    "realizationNumber": "WR-2026-035",
    "realizationDate": "2026-06-24",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "extended",
    "createdAt": "2026-06-24T17:00:00",
    "feedback": "Beberapa poin belum selesai. Selesaikan item B3, C1, dan D2 sebelum laporan final.",
    "extendedUntil": "2026-07-12"
  },
  {
    "id": 36,
    "userId": 7,
    "projectId": 3,
    "realizationNumber": "WR-2026-036",
    "realizationDate": "2026-06-20",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-06-20T17:00:00"
  },
  {
    "id": 37,
    "userId": 11,
    "projectId": 3,
    "realizationNumber": "WR-2026-037",
    "realizationDate": "2026-04-13",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "pending",
    "createdAt": "2026-04-13T17:00:00"
  },
  {
    "id": 38,
    "userId": 18,
    "projectId": 3,
    "realizationNumber": "WR-2026-038",
    "realizationDate": "2026-06-05",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "approved",
    "createdAt": "2026-06-05T17:00:00"
  },
  {
    "id": 39,
    "userId": 18,
    "projectId": 3,
    "realizationNumber": "WR-2026-039",
    "realizationDate": "2026-05-04",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-05-04T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 40,
    "userId": 18,
    "projectId": 3,
    "realizationNumber": "WR-2026-040",
    "realizationDate": "2026-02-09",
    "activities": "Pengerjaan pondasi 8 titik selesai. Uji sondir menunjukkan daya dukung tanah memenuhi syarat.",
    "progress": 90,
    "status": "approved",
    "createdAt": "2026-02-09T17:00:00"
  },
  {
    "id": 41,
    "userId": 16,
    "projectId": 4,
    "realizationNumber": "WR-2026-041",
    "realizationDate": "2026-06-17",
    "activities": "Material lengkap tiba di lokasi. Seluruh item sudah diinspeksi dan dicatat di inventory log.",
    "progress": 100,
    "status": "rejected",
    "createdAt": "2026-06-17T17:00:00",
    "feedback": "Dokumentasi tidak lengkap. Mohon lampirkan foto before-after dan laporan QC."
  },
  {
    "id": 42,
    "userId": 16,
    "projectId": 4,
    "realizationNumber": "WR-2026-042",
    "realizationDate": "2026-04-07",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-04-07T17:00:00"
  },
  {
    "id": 43,
    "userId": 16,
    "projectId": 4,
    "realizationNumber": "WR-2026-043",
    "realizationDate": "2026-01-21",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "pending",
    "createdAt": "2026-01-21T17:00:00"
  },
  {
    "id": 44,
    "userId": 7,
    "projectId": 4,
    "realizationNumber": "WR-2026-044",
    "realizationDate": "2026-06-10",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "approved",
    "createdAt": "2026-06-10T17:00:00"
  },
  {
    "id": 45,
    "userId": 7,
    "projectId": 4,
    "realizationNumber": "WR-2026-045",
    "realizationDate": "2026-06-22",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "extended",
    "createdAt": "2026-06-22T17:00:00",
    "feedback": "Koordinasi dengan pihak ketiga masih berlangsung. Update status setiap Senin.",
    "extendedUntil": "2026-07-15"
  },
  {
    "id": 46,
    "userId": 14,
    "projectId": 4,
    "realizationNumber": "WR-2026-046",
    "realizationDate": "2026-06-05",
    "activities": "Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.",
    "progress": 85,
    "status": "pending",
    "createdAt": "2026-06-05T17:00:00"
  },
  {
    "id": 47,
    "userId": 14,
    "projectId": 4,
    "realizationNumber": "WR-2026-047",
    "realizationDate": "2026-06-24",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "approved",
    "createdAt": "2026-06-24T17:00:00",
    "feedback": "Selesai sesuai jadwal dan standar. Bagus!"
  },
  {
    "id": 48,
    "userId": 14,
    "projectId": 4,
    "realizationNumber": "WR-2026-048",
    "realizationDate": "2026-05-22",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "rejected",
    "createdAt": "2026-05-22T17:00:00",
    "feedback": "Dokumentasi tidak lengkap. Mohon lampirkan foto before-after dan laporan QC."
  },
  {
    "id": 49,
    "userId": 17,
    "projectId": 4,
    "realizationNumber": "WR-2026-049",
    "realizationDate": "2026-06-23",
    "activities": "Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-06-23T17:00:00"
  },
  {
    "id": 50,
    "userId": 17,
    "projectId": 4,
    "realizationNumber": "WR-2026-050",
    "realizationDate": "2026-06-04",
    "activities": "Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.",
    "progress": 100,
    "status": "rejected",
    "createdAt": "2026-06-04T17:00:00",
    "feedback": "Jumlah personel yang dilaporkan tidak sesuai absensi harian. Harap diklarifikasi."
  },
  {
    "id": 51,
    "userId": 5,
    "projectId": 5,
    "realizationNumber": "WR-2026-051",
    "realizationDate": "2026-05-07",
    "activities": "Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.",
    "progress": 87,
    "status": "rejected",
    "createdAt": "2026-05-07T17:00:00",
    "feedback": "Jumlah personel yang dilaporkan tidak sesuai absensi harian. Harap diklarifikasi."
  },
  {
    "id": 52,
    "userId": 5,
    "projectId": 5,
    "realizationNumber": "WR-2026-052",
    "realizationDate": "2026-06-24",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "approved",
    "createdAt": "2026-06-24T17:00:00",
    "feedback": "Pekerjaan sangat baik. Pertahankan kualitas ini di periode berikutnya."
  },
  {
    "id": 53,
    "userId": 6,
    "projectId": 5,
    "realizationNumber": "WR-2026-053",
    "realizationDate": "2026-05-06",
    "activities": "Material lengkap tiba di lokasi. Seluruh item sudah diinspeksi dan dicatat di inventory log.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-05-06T17:00:00"
  },
  {
    "id": 54,
    "userId": 6,
    "projectId": 5,
    "realizationNumber": "WR-2026-054",
    "realizationDate": "2026-05-17",
    "activities": "Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-05-17T17:00:00"
  },
  {
    "id": 55,
    "userId": 10,
    "projectId": 5,
    "realizationNumber": "WR-2026-055",
    "realizationDate": "2026-04-10",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "extended",
    "createdAt": "2026-04-10T17:00:00",
    "feedback": "Beberapa poin belum selesai. Selesaikan item B3, C1, dan D2 sebelum laporan final.",
    "extendedUntil": "2026-05-28"
  },
  {
    "id": 56,
    "userId": 10,
    "projectId": 5,
    "realizationNumber": "WR-2026-056",
    "realizationDate": "2026-06-19",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "rejected",
    "createdAt": "2026-06-19T17:00:00",
    "feedback": "Progress tidak sesuai target. Jelaskan hambatan yang terjadi dan rencana percepatan."
  },
  {
    "id": 57,
    "userId": 16,
    "projectId": 6,
    "realizationNumber": "WR-2026-057",
    "realizationDate": "2026-02-25",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-02-25T17:00:00"
  },
  {
    "id": 58,
    "userId": 6,
    "projectId": 6,
    "realizationNumber": "WR-2026-058",
    "realizationDate": "2026-02-12",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "rejected",
    "createdAt": "2026-02-12T17:00:00",
    "feedback": "Laporan mengacu pada standar lama. Gunakan form revisi terbaru yang sudah dikirimkan."
  },
  {
    "id": 59,
    "userId": 6,
    "projectId": 6,
    "realizationNumber": "WR-2026-059",
    "realizationDate": "2026-04-12",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "extended",
    "createdAt": "2026-04-12T17:00:00",
    "feedback": "Menunggu material pengganti dari vendor. Estimasi tiba 2 minggu, lanjutkan setelah itu.",
    "extendedUntil": "2026-05-22"
  },
  {
    "id": 60,
    "userId": 11,
    "projectId": 6,
    "realizationNumber": "WR-2026-060",
    "realizationDate": "2026-06-07",
    "activities": "Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.",
    "progress": 87,
    "status": "extended",
    "createdAt": "2026-06-07T17:00:00",
    "feedback": "Pekerjaan perlu dilanjutkan. Sertakan jadwal penyelesaian yang realistis.",
    "extendedUntil": "2026-07-19"
  },
  {
    "id": 61,
    "userId": 19,
    "projectId": 6,
    "realizationNumber": "WR-2026-061",
    "realizationDate": "2026-05-03",
    "activities": "Material lengkap tiba di lokasi. Seluruh item sudah diinspeksi dan dicatat di inventory log.",
    "progress": 100,
    "status": "rejected",
    "createdAt": "2026-05-03T17:00:00",
    "feedback": "Laporan mengacu pada standar lama. Gunakan form revisi terbaru yang sudah dikirimkan."
  },
  {
    "id": 62,
    "userId": 19,
    "projectId": 6,
    "realizationNumber": "WR-2026-062",
    "realizationDate": "2026-02-17",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "rejected",
    "createdAt": "2026-02-17T17:00:00",
    "feedback": "Dokumentasi tidak lengkap. Mohon lampirkan foto before-after dan laporan QC."
  },
  {
    "id": 63,
    "userId": 19,
    "projectId": 6,
    "realizationNumber": "WR-2026-063",
    "realizationDate": "2026-05-21",
    "activities": "Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.",
    "progress": 100,
    "status": "extended",
    "createdAt": "2026-05-21T17:00:00",
    "feedback": "Menunggu material pengganti dari vendor. Estimasi tiba 2 minggu, lanjutkan setelah itu.",
    "extendedUntil": "2026-06-27"
  },
  {
    "id": 64,
    "userId": 19,
    "projectId": 6,
    "realizationNumber": "WR-2026-064",
    "realizationDate": "2026-06-02",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-06-02T17:00:00"
  },
  {
    "id": 65,
    "userId": 4,
    "projectId": 7,
    "realizationNumber": "WR-2026-065",
    "realizationDate": "2026-04-05",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "pending",
    "createdAt": "2026-04-05T17:00:00"
  },
  {
    "id": 66,
    "userId": 20,
    "projectId": 7,
    "realizationNumber": "WR-2026-066",
    "realizationDate": "2026-04-18",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "approved",
    "createdAt": "2026-04-18T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 67,
    "userId": 20,
    "projectId": 7,
    "realizationNumber": "WR-2026-067",
    "realizationDate": "2026-02-15",
    "activities": "Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-02-15T17:00:00"
  },
  {
    "id": 68,
    "userId": 5,
    "projectId": 7,
    "realizationNumber": "WR-2026-068",
    "realizationDate": "2026-02-09",
    "activities": "Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.",
    "progress": 100,
    "status": "extended",
    "createdAt": "2026-02-09T17:00:00",
    "feedback": "Menunggu material pengganti dari vendor. Estimasi tiba 2 minggu, lanjutkan setelah itu.",
    "extendedUntil": "2026-03-26"
  },
  {
    "id": 69,
    "userId": 5,
    "projectId": 7,
    "realizationNumber": "WR-2026-069",
    "realizationDate": "2026-06-21",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "rejected",
    "createdAt": "2026-06-21T17:00:00",
    "feedback": "Dokumentasi tidak lengkap. Mohon lampirkan foto before-after dan laporan QC."
  },
  {
    "id": 70,
    "userId": 5,
    "projectId": 7,
    "realizationNumber": "WR-2026-070",
    "realizationDate": "2026-01-12",
    "activities": "Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-01-12T17:00:00",
    "feedback": "Pekerjaan sangat baik. Pertahankan kualitas ini di periode berikutnya."
  },
  {
    "id": 71,
    "userId": 10,
    "projectId": 7,
    "realizationNumber": "WR-2026-071",
    "realizationDate": "2026-06-24",
    "activities": "Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-06-24T17:00:00",
    "feedback": "Selesai sesuai jadwal dan standar. Bagus!"
  },
  {
    "id": 72,
    "userId": 10,
    "projectId": 7,
    "realizationNumber": "WR-2026-072",
    "realizationDate": "2026-06-09",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "rejected",
    "createdAt": "2026-06-09T17:00:00",
    "feedback": "Progress tidak sesuai target. Jelaskan hambatan yang terjadi dan rencana percepatan."
  },
  {
    "id": 73,
    "userId": 16,
    "projectId": 8,
    "realizationNumber": "WR-2026-073",
    "realizationDate": "2026-03-21",
    "activities": "Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-03-21T17:00:00",
    "feedback": "Pekerjaan sangat baik. Pertahankan kualitas ini di periode berikutnya."
  },
  {
    "id": 74,
    "userId": 16,
    "projectId": 8,
    "realizationNumber": "WR-2026-074",
    "realizationDate": "2026-06-03",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "extended",
    "createdAt": "2026-06-03T17:00:00",
    "feedback": "Koordinasi dengan pihak ketiga masih berlangsung. Update status setiap Senin.",
    "extendedUntil": "2026-07-17"
  },
  {
    "id": 75,
    "userId": 7,
    "projectId": 8,
    "realizationNumber": "WR-2026-075",
    "realizationDate": "2026-05-18",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "pending",
    "createdAt": "2026-05-18T17:00:00"
  },
  {
    "id": 76,
    "userId": 7,
    "projectId": 8,
    "realizationNumber": "WR-2026-076",
    "realizationDate": "2026-06-07",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "approved",
    "createdAt": "2026-06-07T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 77,
    "userId": 7,
    "projectId": 8,
    "realizationNumber": "WR-2026-077",
    "realizationDate": "2026-03-06",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "pending",
    "createdAt": "2026-03-06T17:00:00"
  },
  {
    "id": 78,
    "userId": 17,
    "projectId": 8,
    "realizationNumber": "WR-2026-078",
    "realizationDate": "2026-06-10",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "extended",
    "createdAt": "2026-06-10T17:00:00",
    "feedback": "Pekerjaan perlu dilanjutkan. Sertakan jadwal penyelesaian yang realistis.",
    "extendedUntil": "2026-07-11"
  },
  {
    "id": 79,
    "userId": 17,
    "projectId": 8,
    "realizationNumber": "WR-2026-079",
    "realizationDate": "2026-06-18",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "approved",
    "createdAt": "2026-06-18T17:00:00"
  },
  {
    "id": 80,
    "userId": 17,
    "projectId": 8,
    "realizationNumber": "WR-2026-080",
    "realizationDate": "2026-06-08",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-06-08T17:00:00"
  },
  {
    "id": 81,
    "userId": 9,
    "projectId": 8,
    "realizationNumber": "WR-2026-081",
    "realizationDate": "2026-05-06",
    "activities": "Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.",
    "progress": 85,
    "status": "rejected",
    "createdAt": "2026-05-06T17:00:00",
    "feedback": "Jumlah personel yang dilaporkan tidak sesuai absensi harian. Harap diklarifikasi."
  },
  {
    "id": 82,
    "userId": 9,
    "projectId": 8,
    "realizationNumber": "WR-2026-082",
    "realizationDate": "2026-03-23",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-03-23T17:00:00"
  },
  {
    "id": 83,
    "userId": 9,
    "projectId": 8,
    "realizationNumber": "WR-2026-083",
    "realizationDate": "2026-06-07",
    "activities": "Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.",
    "progress": 87,
    "status": "pending",
    "createdAt": "2026-06-07T17:00:00"
  },
  {
    "id": 84,
    "userId": 4,
    "projectId": 9,
    "realizationNumber": "WR-2026-084",
    "realizationDate": "2026-04-25",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "approved",
    "createdAt": "2026-04-25T17:00:00",
    "feedback": "Selesai sesuai jadwal dan standar. Bagus!"
  },
  {
    "id": 85,
    "userId": 4,
    "projectId": 9,
    "realizationNumber": "WR-2026-085",
    "realizationDate": "2026-05-13",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "pending",
    "createdAt": "2026-05-13T17:00:00"
  },
  {
    "id": 86,
    "userId": 6,
    "projectId": 9,
    "realizationNumber": "WR-2026-086",
    "realizationDate": "2026-06-16",
    "activities": "Pengerjaan pondasi 8 titik selesai. Uji sondir menunjukkan daya dukung tanah memenuhi syarat.",
    "progress": 90,
    "status": "pending",
    "createdAt": "2026-06-16T17:00:00"
  },
  {
    "id": 87,
    "userId": 6,
    "projectId": 9,
    "realizationNumber": "WR-2026-087",
    "realizationDate": "2026-03-19",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-03-19T17:00:00"
  },
  {
    "id": 88,
    "userId": 8,
    "projectId": 9,
    "realizationNumber": "WR-2026-088",
    "realizationDate": "2026-06-21",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "extended",
    "createdAt": "2026-06-21T17:00:00",
    "feedback": "Beberapa poin belum selesai. Selesaikan item B3, C1, dan D2 sebelum laporan final.",
    "extendedUntil": "2026-07-21"
  },
  {
    "id": 89,
    "userId": 16,
    "projectId": 10,
    "realizationNumber": "WR-2026-089",
    "realizationDate": "2026-05-12",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "rejected",
    "createdAt": "2026-05-12T17:00:00",
    "feedback": "Laporan mengacu pada standar lama. Gunakan form revisi terbaru yang sudah dikirimkan."
  },
  {
    "id": 90,
    "userId": 16,
    "projectId": 10,
    "realizationNumber": "WR-2026-090",
    "realizationDate": "2026-05-20",
    "activities": "Pelatihan operator dilakukan untuk 15 personel lokal. Modul teknis sudah didistribusikan.",
    "progress": 82,
    "status": "approved",
    "createdAt": "2026-05-20T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 91,
    "userId": 16,
    "projectId": 10,
    "realizationNumber": "WR-2026-091",
    "realizationDate": "2026-05-02",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "rejected",
    "createdAt": "2026-05-02T17:00:00",
    "feedback": "Progress tidak sesuai target. Jelaskan hambatan yang terjadi dan rencana percepatan."
  },
  {
    "id": 92,
    "userId": 12,
    "projectId": 10,
    "realizationNumber": "WR-2026-092",
    "realizationDate": "2026-06-15",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-06-15T17:00:00"
  },
  {
    "id": 93,
    "userId": 12,
    "projectId": 10,
    "realizationNumber": "WR-2026-093",
    "realizationDate": "2026-06-01",
    "activities": "Pengerjaan pondasi 8 titik selesai. Uji sondir menunjukkan daya dukung tanah memenuhi syarat.",
    "progress": 90,
    "status": "approved",
    "createdAt": "2026-06-01T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 94,
    "userId": 8,
    "projectId": 10,
    "realizationNumber": "WR-2026-094",
    "realizationDate": "2026-05-21",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "rejected",
    "createdAt": "2026-05-21T17:00:00",
    "feedback": "Dokumentasi tidak lengkap. Mohon lampirkan foto before-after dan laporan QC."
  },
  {
    "id": 95,
    "userId": 8,
    "projectId": 10,
    "realizationNumber": "WR-2026-095",
    "realizationDate": "2026-04-19",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "approved",
    "createdAt": "2026-04-19T17:00:00"
  },
  {
    "id": 96,
    "userId": 9,
    "projectId": 10,
    "realizationNumber": "WR-2026-096",
    "realizationDate": "2026-03-07",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "approved",
    "createdAt": "2026-03-07T17:00:00",
    "feedback": "Pekerjaan sangat baik. Pertahankan kualitas ini di periode berikutnya."
  },
  {
    "id": 97,
    "userId": 9,
    "projectId": 10,
    "realizationNumber": "WR-2026-097",
    "realizationDate": "2026-05-20",
    "activities": "Pengerjaan pondasi 8 titik selesai. Uji sondir menunjukkan daya dukung tanah memenuhi syarat.",
    "progress": 90,
    "status": "pending",
    "createdAt": "2026-05-20T17:00:00"
  },
  {
    "id": 98,
    "userId": 9,
    "projectId": 10,
    "realizationNumber": "WR-2026-098",
    "realizationDate": "2026-06-18",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-06-18T17:00:00",
    "feedback": "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan."
  },
  {
    "id": 99,
    "userId": 9,
    "projectId": 10,
    "realizationNumber": "WR-2026-099",
    "realizationDate": "2026-06-17",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "rejected",
    "createdAt": "2026-06-17T17:00:00",
    "feedback": "Jumlah personel yang dilaporkan tidak sesuai absensi harian. Harap diklarifikasi."
  },
  {
    "id": 100,
    "userId": 1,
    "projectId": 1,
    "realizationNumber": "WR-2026-100",
    "realizationDate": "2026-04-22",
    "activities": "Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-04-22T17:00:00"
  },
  {
    "id": 101,
    "userId": 1,
    "projectId": 1,
    "realizationNumber": "WR-2026-101",
    "realizationDate": "2026-06-08",
    "activities": "Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.",
    "progress": 85,
    "status": "extended",
    "createdAt": "2026-06-08T17:00:00",
    "feedback": "Koordinasi dengan pihak ketiga masih berlangsung. Update status setiap Senin.",
    "extendedUntil": "2026-07-23"
  },
  {
    "id": 102,
    "userId": 1,
    "projectId": 1,
    "realizationNumber": "WR-2026-102",
    "realizationDate": "2026-04-20",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-04-20T17:00:00",
    "feedback": "Selesai sesuai jadwal dan standar. Bagus!"
  },
  {
    "id": 103,
    "userId": 2,
    "projectId": 1,
    "realizationNumber": "WR-2026-103",
    "realizationDate": "2026-06-07",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "approved",
    "createdAt": "2026-06-07T17:00:00"
  },
  {
    "id": 104,
    "userId": 2,
    "projectId": 1,
    "realizationNumber": "WR-2026-104",
    "realizationDate": "2026-06-18",
    "activities": "Pengerjaan pondasi 8 titik selesai. Uji sondir menunjukkan daya dukung tanah memenuhi syarat.",
    "progress": 90,
    "status": "rejected",
    "createdAt": "2026-06-18T17:00:00",
    "feedback": "Progress tidak sesuai target. Jelaskan hambatan yang terjadi dan rencana percepatan."
  },
  {
    "id": 105,
    "userId": 2,
    "projectId": 1,
    "realizationNumber": "WR-2026-105",
    "realizationDate": "2026-03-20",
    "activities": "Pengerjaan pondasi 8 titik selesai. Uji sondir menunjukkan daya dukung tanah memenuhi syarat.",
    "progress": 90,
    "status": "extended",
    "createdAt": "2026-03-20T17:00:00",
    "feedback": "Pekerjaan perlu dilanjutkan. Sertakan jadwal penyelesaian yang realistis.",
    "extendedUntil": "2026-04-19"
  },
  {
    "id": 106,
    "userId": 3,
    "projectId": 5,
    "realizationNumber": "WR-2026-106",
    "realizationDate": "2026-04-16",
    "activities": "Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.",
    "progress": 87,
    "status": "extended",
    "createdAt": "2026-04-16T17:00:00",
    "feedback": "Koordinasi dengan pihak ketiga masih berlangsung. Update status setiap Senin.",
    "extendedUntil": "2026-05-27"
  },
  {
    "id": 107,
    "userId": 3,
    "projectId": 5,
    "realizationNumber": "WR-2026-107",
    "realizationDate": "2026-03-02",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "approved",
    "createdAt": "2026-03-02T17:00:00"
  },
  {
    "id": 108,
    "userId": 15,
    "projectId": 2,
    "realizationNumber": "WR-2026-108",
    "realizationDate": "2026-06-07",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "approved",
    "createdAt": "2026-06-07T17:00:00"
  },
  {
    "id": 109,
    "userId": 15,
    "projectId": 2,
    "realizationNumber": "WR-2026-109",
    "realizationDate": "2026-01-05",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "rejected",
    "createdAt": "2026-01-05T17:00:00",
    "feedback": "Jumlah personel yang dilaporkan tidak sesuai absensi harian. Harap diklarifikasi."
  },
  {
    "id": 110,
    "userId": 15,
    "projectId": 2,
    "realizationNumber": "WR-2026-110",
    "realizationDate": "2026-06-14",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "rejected",
    "createdAt": "2026-06-14T17:00:00",
    "feedback": "Progress tidak sesuai target. Jelaskan hambatan yang terjadi dan rencana percepatan."
  },
  {
    "id": 111,
    "userId": 15,
    "projectId": 2,
    "realizationNumber": "WR-2026-111",
    "realizationDate": "2026-05-03",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "pending",
    "createdAt": "2026-05-03T17:00:00"
  },
  {
    "id": 112,
    "userId": 5,
    "projectId": 1,
    "realizationNumber": "WR-2026-112",
    "realizationDate": "2026-05-21",
    "activities": "Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.",
    "progress": 95,
    "status": "pending",
    "createdAt": "2026-05-21T09:00:00"
  },
  {
    "id": 113,
    "userId": 6,
    "projectId": 1,
    "realizationNumber": "WR-2026-113",
    "realizationDate": "2026-05-19",
    "activities": "Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-05-19T09:00:00"
  },
  {
    "id": 114,
    "userId": 10,
    "projectId": 1,
    "realizationNumber": "WR-2026-114",
    "realizationDate": "2026-06-21",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-06-21T09:00:00"
  },
  {
    "id": 115,
    "userId": 20,
    "projectId": 1,
    "realizationNumber": "WR-2026-115",
    "realizationDate": "2026-06-17",
    "activities": "Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.",
    "progress": 87,
    "status": "pending",
    "createdAt": "2026-06-17T09:00:00"
  },
  {
    "id": 116,
    "userId": 5,
    "projectId": 2,
    "realizationNumber": "WR-2026-116",
    "realizationDate": "2026-06-28",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "pending",
    "createdAt": "2026-06-28T09:00:00"
  },
  {
    "id": 117,
    "userId": 20,
    "projectId": 2,
    "realizationNumber": "WR-2026-117",
    "realizationDate": "2026-05-07",
    "activities": "Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.",
    "progress": 85,
    "status": "pending",
    "createdAt": "2026-05-07T09:00:00"
  },
  {
    "id": 118,
    "userId": 14,
    "projectId": 2,
    "realizationNumber": "WR-2026-118",
    "realizationDate": "2026-06-04",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "pending",
    "createdAt": "2026-06-04T09:00:00"
  },
  {
    "id": 119,
    "userId": 7,
    "projectId": 3,
    "realizationNumber": "WR-2026-119",
    "realizationDate": "2026-05-27",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "pending",
    "createdAt": "2026-05-27T09:00:00"
  },
  {
    "id": 120,
    "userId": 11,
    "projectId": 3,
    "realizationNumber": "WR-2026-120",
    "realizationDate": "2026-06-05",
    "activities": "Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.",
    "progress": 92,
    "status": "pending",
    "createdAt": "2026-06-05T09:00:00"
  },
  {
    "id": 121,
    "userId": 18,
    "projectId": 3,
    "realizationNumber": "WR-2026-121",
    "realizationDate": "2026-06-04",
    "activities": "Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.",
    "progress": 78,
    "status": "pending",
    "createdAt": "2026-06-04T09:00:00"
  },
  {
    "id": 122,
    "userId": 7,
    "projectId": 4,
    "realizationNumber": "WR-2026-122",
    "realizationDate": "2026-05-22",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-05-22T09:00:00"
  },
  {
    "id": 123,
    "userId": 14,
    "projectId": 4,
    "realizationNumber": "WR-2026-123",
    "realizationDate": "2026-06-26",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-06-26T09:00:00"
  },
  {
    "id": 124,
    "userId": 17,
    "projectId": 4,
    "realizationNumber": "WR-2026-124",
    "realizationDate": "2026-06-25",
    "activities": "Pelatihan operator dilakukan untuk 15 personel lokal. Modul teknis sudah didistribusikan.",
    "progress": 82,
    "status": "pending",
    "createdAt": "2026-06-25T09:00:00"
  },
  {
    "id": 125,
    "userId": 5,
    "projectId": 5,
    "realizationNumber": "WR-2026-125",
    "realizationDate": "2026-05-07",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-05-07T09:00:00"
  },
  {
    "id": 126,
    "userId": 6,
    "projectId": 5,
    "realizationNumber": "WR-2026-126",
    "realizationDate": "2026-05-03",
    "activities": "Pelatihan operator dilakukan untuk 15 personel lokal. Modul teknis sudah didistribusikan.",
    "progress": 82,
    "status": "pending",
    "createdAt": "2026-05-03T09:00:00"
  },
  {
    "id": 127,
    "userId": 10,
    "projectId": 5,
    "realizationNumber": "WR-2026-127",
    "realizationDate": "2026-05-25",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "pending",
    "createdAt": "2026-05-25T09:00:00"
  },
  {
    "id": 128,
    "userId": 6,
    "projectId": 6,
    "realizationNumber": "WR-2026-128",
    "realizationDate": "2026-06-02",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-06-02T09:00:00"
  },
  {
    "id": 129,
    "userId": 11,
    "projectId": 6,
    "realizationNumber": "WR-2026-129",
    "realizationDate": "2026-05-12",
    "activities": "Pelatihan operator dilakukan untuk 15 personel lokal. Modul teknis sudah didistribusikan.",
    "progress": 82,
    "status": "pending",
    "createdAt": "2026-05-12T09:00:00"
  },
  {
    "id": 130,
    "userId": 19,
    "projectId": 6,
    "realizationNumber": "WR-2026-130",
    "realizationDate": "2026-06-16",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-06-16T09:00:00"
  },
  {
    "id": 131,
    "userId": 20,
    "projectId": 7,
    "realizationNumber": "WR-2026-131",
    "realizationDate": "2026-06-03",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "pending",
    "createdAt": "2026-06-03T09:00:00"
  },
  {
    "id": 132,
    "userId": 5,
    "projectId": 7,
    "realizationNumber": "WR-2026-132",
    "realizationDate": "2026-05-08",
    "activities": "Pengerjaan pondasi 8 titik selesai. Uji sondir menunjukkan daya dukung tanah memenuhi syarat.",
    "progress": 90,
    "status": "pending",
    "createdAt": "2026-05-08T09:00:00"
  },
  {
    "id": 133,
    "userId": 10,
    "projectId": 7,
    "realizationNumber": "WR-2026-133",
    "realizationDate": "2026-05-03",
    "activities": "Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.",
    "progress": 70,
    "status": "pending",
    "createdAt": "2026-05-03T09:00:00"
  },
  {
    "id": 134,
    "userId": 7,
    "projectId": 8,
    "realizationNumber": "WR-2026-134",
    "realizationDate": "2026-06-02",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-06-02T09:00:00"
  },
  {
    "id": 135,
    "userId": 17,
    "projectId": 8,
    "realizationNumber": "WR-2026-135",
    "realizationDate": "2026-06-20",
    "activities": "Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.",
    "progress": 87,
    "status": "pending",
    "createdAt": "2026-06-20T09:00:00"
  },
  {
    "id": 136,
    "userId": 9,
    "projectId": 8,
    "realizationNumber": "WR-2026-136",
    "realizationDate": "2026-05-28",
    "activities": "Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-05-28T09:00:00"
  },
  {
    "id": 137,
    "userId": 6,
    "projectId": 9,
    "realizationNumber": "WR-2026-137",
    "realizationDate": "2026-05-24",
    "activities": "Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.",
    "progress": 87,
    "status": "pending",
    "createdAt": "2026-05-24T09:00:00"
  },
  {
    "id": 138,
    "userId": 8,
    "projectId": 9,
    "realizationNumber": "WR-2026-138",
    "realizationDate": "2026-06-04",
    "activities": "Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.",
    "progress": 88,
    "status": "pending",
    "createdAt": "2026-06-04T09:00:00"
  },
  {
    "id": 139,
    "userId": 12,
    "projectId": 10,
    "realizationNumber": "WR-2026-139",
    "realizationDate": "2026-06-01",
    "activities": "6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.",
    "progress": 100,
    "status": "pending",
    "createdAt": "2026-06-01T09:00:00"
  },
  {
    "id": 140,
    "userId": 8,
    "projectId": 10,
    "realizationNumber": "WR-2026-140",
    "realizationDate": "2026-06-09",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-06-09T09:00:00"
  },
  {
    "id": 141,
    "userId": 9,
    "projectId": 10,
    "realizationNumber": "WR-2026-141",
    "realizationDate": "2026-05-20",
    "activities": "Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.",
    "progress": 75,
    "status": "pending",
    "createdAt": "2026-05-20T09:00:00"
  }
];

export const leaveRequests: LeaveRequest[] = [
  {
    "id": 1,
    "userId": 1,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-001",
    "startDate": "2026-05-09",
    "endDate": "2026-05-09",
    "totalDays": 1,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-05T10:00:00"
  },
  {
    "id": 2,
    "userId": 1,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-002",
    "startDate": "2026-06-09",
    "endDate": "2026-06-12",
    "totalDays": 4,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-05-02T10:00:00"
  },
  {
    "id": 3,
    "userId": 2,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-003",
    "startDate": "2026-02-09",
    "endDate": "2026-02-09",
    "totalDays": 1,
    "reason": "Acara pernikahan anggota keluarga",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-08T10:00:00"
  },
  {
    "id": 4,
    "userId": 3,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-004",
    "startDate": "2026-01-07",
    "endDate": "2026-01-09",
    "totalDays": 3,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-17T10:00:00"
  },
  {
    "id": 5,
    "userId": 3,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-005",
    "startDate": "2026-03-06",
    "endDate": "2026-03-06",
    "totalDays": 1,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "pending",
    "createdAt": "2026-02-12T10:00:00"
  },
  {
    "id": 6,
    "userId": 4,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-006",
    "startDate": "2026-03-19",
    "endDate": "2026-03-20",
    "totalDays": 2,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-02-21T10:00:00"
  },
  {
    "id": 7,
    "userId": 5,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-007",
    "startDate": "2026-03-17",
    "endDate": "2026-03-18",
    "totalDays": 2,
    "reason": "Kunjungan keluarga yang sudah lama direncanakan",
    "status": "rejected",
    "createdAt": "2026-02-24T10:00:00"
  },
  {
    "id": 8,
    "userId": 5,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-008",
    "startDate": "2026-05-15",
    "endDate": "2026-05-18",
    "totalDays": 4,
    "reason": "Mendampingi orang tua yang sakit di rumah sakit",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-05T10:00:00"
  },
  {
    "id": 9,
    "userId": 6,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-009",
    "startDate": "2026-02-12",
    "endDate": "2026-02-13",
    "totalDays": 2,
    "reason": "Sakit dan perlu istirahat berdasarkan surat dokter",
    "status": "pending",
    "createdAt": "2026-01-04T10:00:00"
  },
  {
    "id": 10,
    "userId": 6,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-010",
    "startDate": "2026-01-05",
    "endDate": "2026-01-05",
    "totalDays": 1,
    "reason": "Acara pernikahan anggota keluarga",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-14T10:00:00"
  },
  {
    "id": 11,
    "userId": 6,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-011",
    "startDate": "2026-05-20",
    "endDate": "2026-05-23",
    "totalDays": 4,
    "reason": "Mendampingi orang tua yang sakit di rumah sakit",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-19T10:00:00"
  },
  {
    "id": 12,
    "userId": 6,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-012",
    "startDate": "2026-05-10",
    "endDate": "2026-05-13",
    "totalDays": 4,
    "reason": "Cuti tahunan rutin",
    "status": "rejected",
    "createdAt": "2026-04-19T10:00:00"
  },
  {
    "id": 13,
    "userId": 7,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-013",
    "startDate": "2026-03-12",
    "endDate": "2026-03-15",
    "totalDays": 4,
    "reason": "Sakit dan perlu istirahat berdasarkan surat dokter",
    "status": "pending",
    "createdAt": "2026-02-21T10:00:00"
  },
  {
    "id": 14,
    "userId": 7,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-014",
    "startDate": "2026-06-12",
    "endDate": "2026-06-12",
    "totalDays": 1,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-05-10T10:00:00"
  },
  {
    "id": 15,
    "userId": 7,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-015",
    "startDate": "2026-02-15",
    "endDate": "2026-02-16",
    "totalDays": 2,
    "reason": "Pemulihan setelah operasi minor",
    "status": "pending",
    "createdAt": "2026-01-08T10:00:00"
  },
  {
    "id": 16,
    "userId": 8,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-016",
    "startDate": "2026-03-19",
    "endDate": "2026-03-22",
    "totalDays": 4,
    "reason": "Sakit dan perlu istirahat berdasarkan surat dokter",
    "status": "rejected",
    "createdAt": "2026-02-04T10:00:00"
  },
  {
    "id": 17,
    "userId": 8,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-017",
    "startDate": "2026-01-13",
    "endDate": "2026-01-15",
    "totalDays": 3,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "pending",
    "createdAt": "2026-01-25T10:00:00"
  },
  {
    "id": 18,
    "userId": 9,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-018",
    "startDate": "2026-01-11",
    "endDate": "2026-01-12",
    "totalDays": 2,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-11T10:00:00"
  },
  {
    "id": 19,
    "userId": 9,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-019",
    "startDate": "2026-05-21",
    "endDate": "2026-05-22",
    "totalDays": 2,
    "reason": "Acara pernikahan anggota keluarga",
    "status": "pending",
    "createdAt": "2026-04-12T10:00:00"
  },
  {
    "id": 20,
    "userId": 9,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-020",
    "startDate": "2026-01-17",
    "endDate": "2026-01-17",
    "totalDays": 1,
    "reason": "Sakit dan perlu istirahat berdasarkan surat dokter",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-15T10:00:00"
  },
  {
    "id": 21,
    "userId": 9,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-021",
    "startDate": "2026-01-04",
    "endDate": "2026-01-04",
    "totalDays": 1,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-12T10:00:00"
  },
  {
    "id": 22,
    "userId": 10,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-022",
    "startDate": "2026-02-20",
    "endDate": "2026-02-20",
    "totalDays": 1,
    "reason": "Cuti tahunan rutin",
    "status": "rejected",
    "createdAt": "2026-01-05T10:00:00"
  },
  {
    "id": 23,
    "userId": 10,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-023",
    "startDate": "2026-02-01",
    "endDate": "2026-02-04",
    "totalDays": 4,
    "reason": "Pemulihan setelah operasi minor",
    "status": "pending",
    "createdAt": "2026-01-23T10:00:00"
  },
  {
    "id": 24,
    "userId": 10,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-024",
    "startDate": "2026-05-15",
    "endDate": "2026-05-16",
    "totalDays": 2,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "pending",
    "createdAt": "2026-04-10T10:00:00"
  },
  {
    "id": 25,
    "userId": 10,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-025",
    "startDate": "2026-01-21",
    "endDate": "2026-01-23",
    "totalDays": 3,
    "reason": "Sakit dan perlu istirahat berdasarkan surat dokter",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-24T10:00:00"
  },
  {
    "id": 26,
    "userId": 11,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-026",
    "startDate": "2026-06-25",
    "endDate": "2026-06-26",
    "totalDays": 2,
    "reason": "Kunjungan keluarga yang sudah lama direncanakan",
    "status": "pending",
    "createdAt": "2026-05-17T10:00:00"
  },
  {
    "id": 27,
    "userId": 11,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-027",
    "startDate": "2026-04-03",
    "endDate": "2026-04-05",
    "totalDays": 3,
    "reason": "Kunjungan keluarga yang sudah lama direncanakan",
    "status": "pending",
    "createdAt": "2026-03-03T10:00:00"
  },
  {
    "id": 28,
    "userId": 12,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-028",
    "startDate": "2026-05-15",
    "endDate": "2026-05-15",
    "totalDays": 1,
    "reason": "Sakit dan perlu istirahat berdasarkan surat dokter",
    "status": "pending",
    "createdAt": "2026-04-12T10:00:00"
  },
  {
    "id": 29,
    "userId": 12,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-029",
    "startDate": "2026-06-12",
    "endDate": "2026-06-14",
    "totalDays": 3,
    "reason": "Mendampingi orang tua yang sakit di rumah sakit",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-05-08T10:00:00"
  },
  {
    "id": 30,
    "userId": 12,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-030",
    "startDate": "2026-02-24",
    "endDate": "2026-02-27",
    "totalDays": 4,
    "reason": "Cuti tahunan rutin",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-06T10:00:00"
  },
  {
    "id": 31,
    "userId": 12,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-031",
    "startDate": "2026-03-16",
    "endDate": "2026-03-19",
    "totalDays": 4,
    "reason": "Pemulihan setelah operasi minor",
    "status": "rejected",
    "createdAt": "2026-02-06T10:00:00"
  },
  {
    "id": 32,
    "userId": 13,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-032",
    "startDate": "2026-03-22",
    "endDate": "2026-03-22",
    "totalDays": 1,
    "reason": "Mendampingi orang tua yang sakit di rumah sakit",
    "status": "rejected",
    "createdAt": "2026-02-08T10:00:00"
  },
  {
    "id": 33,
    "userId": 13,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-033",
    "startDate": "2026-04-07",
    "endDate": "2026-04-10",
    "totalDays": 4,
    "reason": "Acara pernikahan anggota keluarga",
    "status": "pending",
    "createdAt": "2026-03-19T10:00:00"
  },
  {
    "id": 34,
    "userId": 13,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-034",
    "startDate": "2026-06-19",
    "endDate": "2026-06-22",
    "totalDays": 4,
    "reason": "Acara pernikahan anggota keluarga",
    "status": "rejected",
    "createdAt": "2026-05-02T10:00:00"
  },
  {
    "id": 35,
    "userId": 14,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-035",
    "startDate": "2026-04-10",
    "endDate": "2026-04-12",
    "totalDays": 3,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-03-20T10:00:00"
  },
  {
    "id": 36,
    "userId": 14,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-036",
    "startDate": "2026-04-20",
    "endDate": "2026-04-23",
    "totalDays": 4,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-03-20T10:00:00"
  },
  {
    "id": 37,
    "userId": 14,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-037",
    "startDate": "2026-01-17",
    "endDate": "2026-01-18",
    "totalDays": 2,
    "reason": "Mendampingi orang tua yang sakit di rumah sakit",
    "status": "rejected",
    "createdAt": "2026-01-12T10:00:00"
  },
  {
    "id": 38,
    "userId": 15,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-038",
    "startDate": "2026-02-24",
    "endDate": "2026-02-26",
    "totalDays": 3,
    "reason": "Mendampingi orang tua yang sakit di rumah sakit",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-25T10:00:00"
  },
  {
    "id": 39,
    "userId": 16,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-039",
    "startDate": "2026-05-03",
    "endDate": "2026-05-03",
    "totalDays": 1,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-09T10:00:00"
  },
  {
    "id": 40,
    "userId": 16,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-040",
    "startDate": "2026-04-25",
    "endDate": "2026-04-28",
    "totalDays": 4,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "rejected",
    "createdAt": "2026-03-18T10:00:00"
  },
  {
    "id": 41,
    "userId": 17,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-041",
    "startDate": "2026-01-13",
    "endDate": "2026-01-13",
    "totalDays": 1,
    "reason": "Pemulihan setelah operasi minor",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-21T10:00:00"
  },
  {
    "id": 42,
    "userId": 17,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-042",
    "startDate": "2026-02-20",
    "endDate": "2026-02-21",
    "totalDays": 2,
    "reason": "Cuti tahunan rutin",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-25T10:00:00"
  },
  {
    "id": 43,
    "userId": 17,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-043",
    "startDate": "2026-04-12",
    "endDate": "2026-04-13",
    "totalDays": 2,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "rejected",
    "createdAt": "2026-03-07T10:00:00"
  },
  {
    "id": 44,
    "userId": 18,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-044",
    "startDate": "2026-02-10",
    "endDate": "2026-02-12",
    "totalDays": 3,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-21T10:00:00"
  },
  {
    "id": 45,
    "userId": 18,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-045",
    "startDate": "2026-05-24",
    "endDate": "2026-05-25",
    "totalDays": 2,
    "reason": "Urusan administrasi keluarga di kampung halaman",
    "status": "pending",
    "createdAt": "2026-04-14T10:00:00"
  },
  {
    "id": 46,
    "userId": 18,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-046",
    "startDate": "2026-01-23",
    "endDate": "2026-01-23",
    "totalDays": 1,
    "reason": "Cuti tahunan rutin",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-10T10:00:00"
  },
  {
    "id": 47,
    "userId": 18,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-047",
    "startDate": "2026-05-09",
    "endDate": "2026-05-12",
    "totalDays": 4,
    "reason": "Cuti tahunan rutin",
    "status": "pending",
    "createdAt": "2026-04-16T10:00:00"
  },
  {
    "id": 48,
    "userId": 19,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-048",
    "startDate": "2026-02-21",
    "endDate": "2026-02-24",
    "totalDays": 4,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "rejected",
    "createdAt": "2026-01-25T10:00:00"
  },
  {
    "id": 49,
    "userId": 19,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-049",
    "startDate": "2026-01-01",
    "endDate": "2026-01-01",
    "totalDays": 1,
    "reason": "Sakit dan perlu istirahat berdasarkan surat dokter",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-24T10:00:00"
  },
  {
    "id": 50,
    "userId": 19,
    "leaveTypeId": 4,
    "leaveNumber": "LV-2026-050",
    "startDate": "2026-02-03",
    "endDate": "2026-02-05",
    "totalDays": 3,
    "reason": "Mendampingi orang tua yang sakit di rumah sakit",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-18T10:00:00"
  },
  {
    "id": 51,
    "userId": 19,
    "leaveTypeId": 5,
    "leaveNumber": "LV-2026-051",
    "startDate": "2026-06-11",
    "endDate": "2026-06-12",
    "totalDays": 2,
    "reason": "Pemulihan setelah operasi minor",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-05-17T10:00:00"
  },
  {
    "id": 52,
    "userId": 20,
    "leaveTypeId": 3,
    "leaveNumber": "LV-2026-052",
    "startDate": "2026-05-16",
    "endDate": "2026-05-17",
    "totalDays": 2,
    "reason": "Mengurus keperluan kelahiran anak",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-13T10:00:00"
  },
  {
    "id": 53,
    "userId": 20,
    "leaveTypeId": 2,
    "leaveNumber": "LV-2026-053",
    "startDate": "2026-02-06",
    "endDate": "2026-02-07",
    "totalDays": 2,
    "reason": "Mendampingi orang tua yang sakit di rumah sakit",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-10T10:00:00"
  },
  {
    "id": 54,
    "userId": 20,
    "leaveTypeId": 1,
    "leaveNumber": "LV-2026-054",
    "startDate": "2026-01-02",
    "endDate": "2026-01-02",
    "totalDays": 1,
    "reason": "Pemulihan setelah operasi minor",
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-10T10:00:00"
  }
];

export const spds: SPD[] = [
  {
    "id": 1,
    "userId": 1,
    "projectId": 9,
    "spdNumber": "SPD-2026-001",
    "destination": "Batam",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-05-20",
    "returnDate": "2026-05-23",
    "totalCost": 12000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-04T09:00:00"
  },
  {
    "id": 2,
    "userId": 1,
    "projectId": 10,
    "spdNumber": "SPD-2026-002",
    "destination": "Palembang",
    "purpose": "Serah terima pekerjaan dengan subkontraktor",
    "departureDate": "2026-03-09",
    "returnDate": "2026-03-13",
    "totalCost": 6000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-02-06T09:00:00"
  },
  {
    "id": 3,
    "userId": 1,
    "projectId": 4,
    "spdNumber": "SPD-2026-003",
    "destination": "Semarang",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-01-08",
    "returnDate": "2026-01-10",
    "totalCost": 4000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-04T09:00:00"
  },
  {
    "id": 4,
    "userId": 1,
    "projectId": 3,
    "spdNumber": "SPD-2026-004",
    "destination": "Palembang",
    "purpose": "Serah terima pekerjaan dengan subkontraktor",
    "departureDate": "2026-03-12",
    "returnDate": "2026-03-14",
    "totalCost": 13000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-02-03T09:00:00"
  },
  {
    "id": 5,
    "userId": 2,
    "projectId": 3,
    "spdNumber": "SPD-2026-005",
    "destination": "Medan",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-01-14",
    "returnDate": "2026-01-16",
    "totalCost": 2000000,
    "status": "pending",
    "createdAt": "2026-01-01T09:00:00"
  },
  {
    "id": 6,
    "userId": 2,
    "projectId": 5,
    "spdNumber": "SPD-2026-006",
    "destination": "Jayapura",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-05-08",
    "returnDate": "2026-05-11",
    "totalCost": 7000000,
    "status": "pending",
    "createdAt": "2026-04-14T09:00:00"
  },
  {
    "id": 7,
    "userId": 2,
    "projectId": 9,
    "spdNumber": "SPD-2026-007",
    "destination": "Palembang",
    "purpose": "Inspeksi kualitas material di gudang vendor",
    "departureDate": "2026-06-14",
    "returnDate": "2026-06-19",
    "totalCost": 6000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-05-06T09:00:00"
  },
  {
    "id": 8,
    "userId": 2,
    "projectId": 2,
    "spdNumber": "SPD-2026-008",
    "destination": "Makassar",
    "purpose": "Serah terima pekerjaan dengan subkontraktor",
    "departureDate": "2026-04-03",
    "returnDate": "2026-04-05",
    "totalCost": 3000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-03-07T09:00:00"
  },
  {
    "id": 9,
    "userId": 3,
    "projectId": 1,
    "spdNumber": "SPD-2026-009",
    "destination": "Semarang",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-05-18",
    "returnDate": "2026-05-21",
    "totalCost": 15000000,
    "status": "pending",
    "createdAt": "2026-04-20T09:00:00"
  },
  {
    "id": 10,
    "userId": 3,
    "projectId": 8,
    "spdNumber": "SPD-2026-010",
    "destination": "Balikpapan",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-01-05",
    "returnDate": "2026-01-10",
    "totalCost": 9000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-09T09:00:00"
  },
  {
    "id": 11,
    "userId": 3,
    "projectId": 7,
    "spdNumber": "SPD-2026-011",
    "destination": "Surabaya",
    "purpose": "Supervisi dan koordinasi pekerjaan lapangan",
    "departureDate": "2026-02-12",
    "returnDate": "2026-02-17",
    "totalCost": 4000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-18T09:00:00"
  },
  {
    "id": 12,
    "userId": 4,
    "projectId": 8,
    "spdNumber": "SPD-2026-012",
    "destination": "Palembang",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-02-07",
    "returnDate": "2026-02-10",
    "totalCost": 9000000,
    "status": "rejected",
    "createdAt": "2026-01-01T09:00:00"
  },
  {
    "id": 13,
    "userId": 4,
    "projectId": 6,
    "spdNumber": "SPD-2026-013",
    "destination": "Batam",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-03-05",
    "returnDate": "2026-03-09",
    "totalCost": 3000000,
    "status": "pending",
    "createdAt": "2026-02-20T09:00:00"
  },
  {
    "id": 14,
    "userId": 4,
    "projectId": 8,
    "spdNumber": "SPD-2026-014",
    "destination": "Jakarta",
    "purpose": "Supervisi dan koordinasi pekerjaan lapangan",
    "departureDate": "2026-01-19",
    "returnDate": "2026-01-23",
    "totalCost": 9000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-16T09:00:00"
  },
  {
    "id": 15,
    "userId": 4,
    "projectId": 7,
    "spdNumber": "SPD-2026-015",
    "destination": "Makassar",
    "purpose": "Kunjungan teknis dan pengambilan data",
    "departureDate": "2026-02-16",
    "returnDate": "2026-02-19",
    "totalCost": 9000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-14T09:00:00"
  },
  {
    "id": 16,
    "userId": 5,
    "projectId": 9,
    "spdNumber": "SPD-2026-016",
    "destination": "Palembang",
    "purpose": "Inspeksi kualitas material di gudang vendor",
    "departureDate": "2026-02-09",
    "returnDate": "2026-02-11",
    "totalCost": 3000000,
    "status": "pending",
    "createdAt": "2026-01-06T09:00:00"
  },
  {
    "id": 17,
    "userId": 5,
    "projectId": 2,
    "spdNumber": "SPD-2026-017",
    "destination": "Medan",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-06-14",
    "returnDate": "2026-06-18",
    "totalCost": 15000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-05-09T09:00:00"
  },
  {
    "id": 18,
    "userId": 6,
    "projectId": 6,
    "spdNumber": "SPD-2026-018",
    "destination": "Jakarta",
    "purpose": "Inspeksi kualitas material di gudang vendor",
    "departureDate": "2026-02-02",
    "returnDate": "2026-02-07",
    "totalCost": 13000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-04T09:00:00"
  },
  {
    "id": 19,
    "userId": 6,
    "projectId": 2,
    "spdNumber": "SPD-2026-019",
    "destination": "Surabaya",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-02-10",
    "returnDate": "2026-02-12",
    "totalCost": 10000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-20T09:00:00"
  },
  {
    "id": 20,
    "userId": 7,
    "projectId": 1,
    "spdNumber": "SPD-2026-020",
    "destination": "Surabaya",
    "purpose": "Kunjungan teknis dan pengambilan data",
    "departureDate": "2026-03-07",
    "returnDate": "2026-03-09",
    "totalCost": 4000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-02-05T09:00:00"
  },
  {
    "id": 21,
    "userId": 7,
    "projectId": 4,
    "spdNumber": "SPD-2026-021",
    "destination": "Palembang",
    "purpose": "Inspeksi kualitas material di gudang vendor",
    "departureDate": "2026-05-10",
    "returnDate": "2026-05-12",
    "totalCost": 3000000,
    "status": "rejected",
    "createdAt": "2026-04-01T09:00:00"
  },
  {
    "id": 22,
    "userId": 7,
    "projectId": 3,
    "spdNumber": "SPD-2026-022",
    "destination": "Batam",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-02-11",
    "returnDate": "2026-02-15",
    "totalCost": 4000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-15T09:00:00"
  },
  {
    "id": 23,
    "userId": 7,
    "projectId": 10,
    "spdNumber": "SPD-2026-023",
    "destination": "Jakarta",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-02-06",
    "returnDate": "2026-02-11",
    "totalCost": 3000000,
    "status": "pending",
    "createdAt": "2026-01-11T09:00:00"
  },
  {
    "id": 24,
    "userId": 8,
    "projectId": 2,
    "spdNumber": "SPD-2026-024",
    "destination": "Semarang",
    "purpose": "Supervisi dan koordinasi pekerjaan lapangan",
    "departureDate": "2026-02-17",
    "returnDate": "2026-02-22",
    "totalCost": 4000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-03T09:00:00"
  },
  {
    "id": 25,
    "userId": 8,
    "projectId": 7,
    "spdNumber": "SPD-2026-025",
    "destination": "Medan",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-04-18",
    "returnDate": "2026-04-23",
    "totalCost": 14000000,
    "status": "pending",
    "createdAt": "2026-03-08T09:00:00"
  },
  {
    "id": 26,
    "userId": 9,
    "projectId": 8,
    "spdNumber": "SPD-2026-026",
    "destination": "Batam",
    "purpose": "Supervisi dan koordinasi pekerjaan lapangan",
    "departureDate": "2026-06-10",
    "returnDate": "2026-06-12",
    "totalCost": 12000000,
    "status": "pending",
    "createdAt": "2026-05-02T09:00:00"
  },
  {
    "id": 27,
    "userId": 9,
    "projectId": 10,
    "spdNumber": "SPD-2026-027",
    "destination": "Medan",
    "purpose": "Kunjungan teknis dan pengambilan data",
    "departureDate": "2026-05-06",
    "returnDate": "2026-05-11",
    "totalCost": 7000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-01T09:00:00"
  },
  {
    "id": 28,
    "userId": 10,
    "projectId": 3,
    "spdNumber": "SPD-2026-028",
    "destination": "Semarang",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-04-12",
    "returnDate": "2026-04-17",
    "totalCost": 2000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-03-01T09:00:00"
  },
  {
    "id": 29,
    "userId": 10,
    "projectId": 7,
    "spdNumber": "SPD-2026-029",
    "destination": "Surabaya",
    "purpose": "Kunjungan teknis dan pengambilan data",
    "departureDate": "2026-06-11",
    "returnDate": "2026-06-13",
    "totalCost": 2000000,
    "status": "pending",
    "createdAt": "2026-05-01T09:00:00"
  },
  {
    "id": 30,
    "userId": 10,
    "projectId": 6,
    "spdNumber": "SPD-2026-030",
    "destination": "Jayapura",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-03-09",
    "returnDate": "2026-03-13",
    "totalCost": 5000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-02-04T09:00:00"
  },
  {
    "id": 31,
    "userId": 11,
    "projectId": 8,
    "spdNumber": "SPD-2026-031",
    "destination": "Batam",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-02-10",
    "returnDate": "2026-02-15",
    "totalCost": 3000000,
    "status": "pending",
    "createdAt": "2026-01-02T09:00:00"
  },
  {
    "id": 32,
    "userId": 11,
    "projectId": 9,
    "spdNumber": "SPD-2026-032",
    "destination": "Denpasar",
    "purpose": "Serah terima pekerjaan dengan subkontraktor",
    "departureDate": "2026-02-13",
    "returnDate": "2026-02-15",
    "totalCost": 15000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-11T09:00:00"
  },
  {
    "id": 33,
    "userId": 11,
    "projectId": 3,
    "spdNumber": "SPD-2026-033",
    "destination": "Jakarta",
    "purpose": "Inspeksi kualitas material di gudang vendor",
    "departureDate": "2026-03-12",
    "returnDate": "2026-03-15",
    "totalCost": 4000000,
    "status": "pending",
    "createdAt": "2026-02-05T09:00:00"
  },
  {
    "id": 34,
    "userId": 11,
    "projectId": 1,
    "spdNumber": "SPD-2026-034",
    "destination": "Jakarta",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-01-04",
    "returnDate": "2026-01-09",
    "totalCost": 12000000,
    "status": "rejected",
    "createdAt": "2026-01-06T09:00:00"
  },
  {
    "id": 35,
    "userId": 12,
    "projectId": 1,
    "spdNumber": "SPD-2026-035",
    "destination": "Balikpapan",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-06-01",
    "returnDate": "2026-06-03",
    "totalCost": 4000000,
    "status": "rejected",
    "createdAt": "2026-05-01T09:00:00"
  },
  {
    "id": 36,
    "userId": 12,
    "projectId": 10,
    "spdNumber": "SPD-2026-036",
    "destination": "Semarang",
    "purpose": "Serah terima pekerjaan dengan subkontraktor",
    "departureDate": "2026-02-13",
    "returnDate": "2026-02-16",
    "totalCost": 5000000,
    "status": "pending",
    "createdAt": "2026-01-19T09:00:00"
  },
  {
    "id": 37,
    "userId": 12,
    "projectId": 3,
    "spdNumber": "SPD-2026-037",
    "destination": "Surabaya",
    "purpose": "Inspeksi kualitas material di gudang vendor",
    "departureDate": "2026-04-09",
    "returnDate": "2026-04-11",
    "totalCost": 9000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-03-12T09:00:00"
  },
  {
    "id": 38,
    "userId": 13,
    "projectId": 2,
    "spdNumber": "SPD-2026-038",
    "destination": "Jayapura",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-01-11",
    "returnDate": "2026-01-16",
    "totalCost": 15000000,
    "status": "rejected",
    "createdAt": "2026-01-07T09:00:00"
  },
  {
    "id": 39,
    "userId": 13,
    "projectId": 7,
    "spdNumber": "SPD-2026-039",
    "destination": "Surabaya",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-02-20",
    "returnDate": "2026-02-25",
    "totalCost": 4000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-04T09:00:00"
  },
  {
    "id": 40,
    "userId": 14,
    "projectId": 10,
    "spdNumber": "SPD-2026-040",
    "destination": "Surabaya",
    "purpose": "Kunjungan teknis dan pengambilan data",
    "departureDate": "2026-06-09",
    "returnDate": "2026-06-11",
    "totalCost": 14000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-05-02T09:00:00"
  },
  {
    "id": 41,
    "userId": 14,
    "projectId": 9,
    "spdNumber": "SPD-2026-041",
    "destination": "Surabaya",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-05-14",
    "returnDate": "2026-05-17",
    "totalCost": 3000000,
    "status": "rejected",
    "createdAt": "2026-04-07T09:00:00"
  },
  {
    "id": 42,
    "userId": 14,
    "projectId": 10,
    "spdNumber": "SPD-2026-042",
    "destination": "Balikpapan",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-04-20",
    "returnDate": "2026-04-24",
    "totalCost": 2000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-03-05T09:00:00"
  },
  {
    "id": 43,
    "userId": 15,
    "projectId": 6,
    "spdNumber": "SPD-2026-043",
    "destination": "Medan",
    "purpose": "Supervisi dan koordinasi pekerjaan lapangan",
    "departureDate": "2026-01-13",
    "returnDate": "2026-01-16",
    "totalCost": 14000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-04T09:00:00"
  },
  {
    "id": 44,
    "userId": 15,
    "projectId": 3,
    "spdNumber": "SPD-2026-044",
    "destination": "Batam",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-05-08",
    "returnDate": "2026-05-12",
    "totalCost": 14000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-10T09:00:00"
  },
  {
    "id": 45,
    "userId": 15,
    "projectId": 4,
    "spdNumber": "SPD-2026-045",
    "destination": "Semarang",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-01-05",
    "returnDate": "2026-01-10",
    "totalCost": 7000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-01-15T09:00:00"
  },
  {
    "id": 46,
    "userId": 15,
    "projectId": 3,
    "spdNumber": "SPD-2026-046",
    "destination": "Surabaya",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-05-06",
    "returnDate": "2026-05-08",
    "totalCost": 9000000,
    "status": "pending",
    "createdAt": "2026-04-03T09:00:00"
  },
  {
    "id": 47,
    "userId": 16,
    "projectId": 7,
    "spdNumber": "SPD-2026-047",
    "destination": "Balikpapan",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-06-13",
    "returnDate": "2026-06-16",
    "totalCost": 14000000,
    "status": "rejected",
    "createdAt": "2026-05-12T09:00:00"
  },
  {
    "id": 48,
    "userId": 16,
    "projectId": 6,
    "spdNumber": "SPD-2026-048",
    "destination": "Jayapura",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-03-03",
    "returnDate": "2026-03-05",
    "totalCost": 13000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-02-17T09:00:00"
  },
  {
    "id": 49,
    "userId": 16,
    "projectId": 2,
    "spdNumber": "SPD-2026-049",
    "destination": "Medan",
    "purpose": "Inspeksi kualitas material di gudang vendor",
    "departureDate": "2026-05-14",
    "returnDate": "2026-05-19",
    "totalCost": 9000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-20T09:00:00"
  },
  {
    "id": 50,
    "userId": 17,
    "projectId": 4,
    "spdNumber": "SPD-2026-050",
    "destination": "Jayapura",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-03-16",
    "returnDate": "2026-03-19",
    "totalCost": 15000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-02-10T09:00:00"
  },
  {
    "id": 51,
    "userId": 17,
    "projectId": 5,
    "spdNumber": "SPD-2026-051",
    "destination": "Balikpapan",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-05-19",
    "returnDate": "2026-05-21",
    "totalCost": 13000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-04-03T09:00:00"
  },
  {
    "id": 52,
    "userId": 17,
    "projectId": 7,
    "spdNumber": "SPD-2026-052",
    "destination": "Denpasar",
    "purpose": "Kunjungan teknis dan pengambilan data",
    "departureDate": "2026-06-13",
    "returnDate": "2026-06-15",
    "totalCost": 8000000,
    "status": "rejected",
    "createdAt": "2026-05-13T09:00:00"
  },
  {
    "id": 53,
    "userId": 18,
    "projectId": 3,
    "spdNumber": "SPD-2026-053",
    "destination": "Balikpapan",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-02-12",
    "returnDate": "2026-02-17",
    "totalCost": 7000000,
    "status": "pending",
    "createdAt": "2026-01-17T09:00:00"
  },
  {
    "id": 54,
    "userId": 18,
    "projectId": 9,
    "spdNumber": "SPD-2026-054",
    "destination": "Medan",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-06-05",
    "returnDate": "2026-06-07",
    "totalCost": 14000000,
    "status": "pending",
    "createdAt": "2026-05-16T09:00:00"
  },
  {
    "id": 55,
    "userId": 19,
    "projectId": 5,
    "spdNumber": "SPD-2026-055",
    "destination": "Palembang",
    "purpose": "Kunjungan teknis dan pengambilan data",
    "departureDate": "2026-03-09",
    "returnDate": "2026-03-13",
    "totalCost": 7000000,
    "status": "rejected",
    "createdAt": "2026-02-10T09:00:00"
  },
  {
    "id": 56,
    "userId": 19,
    "projectId": 3,
    "spdNumber": "SPD-2026-056",
    "destination": "Denpasar",
    "purpose": "Audit keselamatan kerja (K3) di site",
    "departureDate": "2026-03-02",
    "returnDate": "2026-03-05",
    "totalCost": 14000000,
    "status": "pending",
    "createdAt": "2026-02-04T09:00:00"
  },
  {
    "id": 57,
    "userId": 19,
    "projectId": 1,
    "spdNumber": "SPD-2026-057",
    "destination": "Batam",
    "purpose": "Kunjungan teknis dan pengambilan data",
    "departureDate": "2026-03-05",
    "returnDate": "2026-03-08",
    "totalCost": 11000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-02-12T09:00:00"
  },
  {
    "id": 58,
    "userId": 20,
    "projectId": 6,
    "spdNumber": "SPD-2026-058",
    "destination": "Denpasar",
    "purpose": "Kalibrasi dan pengujian peralatan di site",
    "departureDate": "2026-04-16",
    "returnDate": "2026-04-18",
    "totalCost": 4000000,
    "status": "rejected",
    "createdAt": "2026-03-20T09:00:00"
  },
  {
    "id": 59,
    "userId": 20,
    "projectId": 5,
    "spdNumber": "SPD-2026-059",
    "destination": "Jakarta",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-04-12",
    "returnDate": "2026-04-16",
    "totalCost": 8000000,
    "status": "pending",
    "createdAt": "2026-03-17T09:00:00"
  },
  {
    "id": 60,
    "userId": 20,
    "projectId": 6,
    "spdNumber": "SPD-2026-060",
    "destination": "Jayapura",
    "purpose": "Menghadiri rapat koordinasi dengan owner",
    "departureDate": "2026-06-01",
    "returnDate": "2026-06-04",
    "totalCost": 15000000,
    "status": "approved",
    "approvedBy": 2,
    "createdAt": "2026-05-06T09:00:00"
  }
];

export const purchases: Purchase[] = [
  {
    "id": 1,
    "userId": 1,
    "projectId": 7,
    "purchaseNumber": "PO-2026-001",
    "items": [
      {
        "name": "Semen Portland PC",
        "qty": 1000,
        "price": 75000
      },
      {
        "name": "Besi Tulangan D19",
        "qty": 5000,
        "price": 18500
      }
    ],
    "totalPrice": 167500000,
    "description": "Pengadaan material tahap 1 – Semen Portland PC",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-03-02T10:00:00"
  },
  {
    "id": 2,
    "userId": 1,
    "projectId": 2,
    "purchaseNumber": "PO-2026-002",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 3 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-04-17T10:00:00"
  },
  {
    "id": 3,
    "userId": 2,
    "projectId": 5,
    "purchaseNumber": "PO-2026-003",
    "items": [
      {
        "name": "Baja H-Beam 200x200",
        "qty": 50,
        "price": 4500000
      },
      {
        "name": "Baut Galvanis M24",
        "qty": 200,
        "price": 45000
      }
    ],
    "totalPrice": 234000000,
    "description": "Pengadaan material tahap 2 – Baja H-Beam 200x200",
    "status": "rejected",
    "createdAt": "2026-04-15T10:00:00"
  },
  {
    "id": 4,
    "userId": 2,
    "projectId": 3,
    "purchaseNumber": "PO-2026-004",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 1 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-05-20T10:00:00"
  },
  {
    "id": 5,
    "userId": 3,
    "projectId": 4,
    "purchaseNumber": "PO-2026-005",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 2 – Pipa Carbon Steel 8 inci",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-02-15T10:00:00"
  },
  {
    "id": 6,
    "userId": 3,
    "projectId": 1,
    "purchaseNumber": "PO-2026-006",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 3 – Pipa Carbon Steel 8 inci",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-05-01T10:00:00"
  },
  {
    "id": 7,
    "userId": 4,
    "projectId": 1,
    "purchaseNumber": "PO-2026-007",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 2 – Kabel XLPE 150mm2",
    "status": "rejected",
    "createdAt": "2026-01-08T10:00:00"
  },
  {
    "id": 8,
    "userId": 4,
    "projectId": 2,
    "purchaseNumber": "PO-2026-008",
    "items": [
      {
        "name": "Cat Epoxy Minyak",
        "qty": 200,
        "price": 450000
      },
      {
        "name": "Thinner Industri",
        "qty": 50,
        "price": 120000
      }
    ],
    "totalPrice": 96000000,
    "description": "Pengadaan material tahap 1 – Cat Epoxy Minyak",
    "status": "pending",
    "createdAt": "2026-03-25T10:00:00"
  },
  {
    "id": 9,
    "userId": 5,
    "projectId": 9,
    "purchaseNumber": "PO-2026-009",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 3 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-01-18T10:00:00"
  },
  {
    "id": 10,
    "userId": 5,
    "projectId": 6,
    "purchaseNumber": "PO-2026-010",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 3 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-02-07T10:00:00"
  },
  {
    "id": 11,
    "userId": 6,
    "projectId": 8,
    "purchaseNumber": "PO-2026-011",
    "items": [
      {
        "name": "Semen Portland PC",
        "qty": 1000,
        "price": 75000
      },
      {
        "name": "Besi Tulangan D19",
        "qty": 5000,
        "price": 18500
      }
    ],
    "totalPrice": 167500000,
    "description": "Pengadaan material tahap 3 – Semen Portland PC",
    "status": "rejected",
    "createdAt": "2026-05-06T10:00:00"
  },
  {
    "id": 12,
    "userId": 6,
    "projectId": 6,
    "purchaseNumber": "PO-2026-012",
    "items": [
      {
        "name": "Cat Epoxy Minyak",
        "qty": 200,
        "price": 450000
      },
      {
        "name": "Thinner Industri",
        "qty": 50,
        "price": 120000
      }
    ],
    "totalPrice": 96000000,
    "description": "Pengadaan material tahap 1 – Cat Epoxy Minyak",
    "status": "rejected",
    "createdAt": "2026-02-24T10:00:00"
  },
  {
    "id": 13,
    "userId": 6,
    "projectId": 3,
    "purchaseNumber": "PO-2026-013",
    "items": [
      {
        "name": "Pompa Sentrifugal 100 kW",
        "qty": 2,
        "price": 85000000
      },
      {
        "name": "Coupling Fleksibel",
        "qty": 4,
        "price": 2500000
      }
    ],
    "totalPrice": 180000000,
    "description": "Pengadaan material tahap 1 – Pompa Sentrifugal 100 kW",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-02-04T10:00:00"
  },
  {
    "id": 14,
    "userId": 7,
    "projectId": 3,
    "purchaseNumber": "PO-2026-014",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 1 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-04-07T10:00:00"
  },
  {
    "id": 15,
    "userId": 7,
    "projectId": 10,
    "purchaseNumber": "PO-2026-015",
    "items": [
      {
        "name": "Semen Portland PC",
        "qty": 1000,
        "price": 75000
      },
      {
        "name": "Besi Tulangan D19",
        "qty": 5000,
        "price": 18500
      }
    ],
    "totalPrice": 167500000,
    "description": "Pengadaan material tahap 2 – Semen Portland PC",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-05-09T10:00:00"
  },
  {
    "id": 16,
    "userId": 8,
    "projectId": 5,
    "purchaseNumber": "PO-2026-016",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 2 – Kabel XLPE 150mm2",
    "status": "pending",
    "createdAt": "2026-03-17T10:00:00"
  },
  {
    "id": 17,
    "userId": 8,
    "projectId": 3,
    "purchaseNumber": "PO-2026-017",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 1 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-03-13T10:00:00"
  },
  {
    "id": 18,
    "userId": 9,
    "projectId": 10,
    "purchaseNumber": "PO-2026-018",
    "items": [
      {
        "name": "Semen Portland PC",
        "qty": 1000,
        "price": 75000
      },
      {
        "name": "Besi Tulangan D19",
        "qty": 5000,
        "price": 18500
      }
    ],
    "totalPrice": 167500000,
    "description": "Pengadaan material tahap 3 – Semen Portland PC",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-05-20T10:00:00"
  },
  {
    "id": 19,
    "userId": 9,
    "projectId": 7,
    "purchaseNumber": "PO-2026-019",
    "items": [
      {
        "name": "Panel MDB 400A",
        "qty": 3,
        "price": 25000000
      },
      {
        "name": "MCB 3 Fase 200A",
        "qty": 12,
        "price": 1800000
      }
    ],
    "totalPrice": 96600000,
    "description": "Pengadaan material tahap 1 – Panel MDB 400A",
    "status": "rejected",
    "createdAt": "2026-03-06T10:00:00"
  },
  {
    "id": 20,
    "userId": 10,
    "projectId": 5,
    "purchaseNumber": "PO-2026-020",
    "items": [
      {
        "name": "Pompa Sentrifugal 100 kW",
        "qty": 2,
        "price": 85000000
      },
      {
        "name": "Coupling Fleksibel",
        "qty": 4,
        "price": 2500000
      }
    ],
    "totalPrice": 180000000,
    "description": "Pengadaan material tahap 2 – Pompa Sentrifugal 100 kW",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-01-17T10:00:00"
  },
  {
    "id": 21,
    "userId": 10,
    "projectId": 3,
    "purchaseNumber": "PO-2026-021",
    "items": [
      {
        "name": "Pompa Sentrifugal 100 kW",
        "qty": 2,
        "price": 85000000
      },
      {
        "name": "Coupling Fleksibel",
        "qty": 4,
        "price": 2500000
      }
    ],
    "totalPrice": 180000000,
    "description": "Pengadaan material tahap 3 – Pompa Sentrifugal 100 kW",
    "status": "rejected",
    "createdAt": "2026-01-24T10:00:00"
  },
  {
    "id": 22,
    "userId": 10,
    "projectId": 8,
    "purchaseNumber": "PO-2026-022",
    "items": [
      {
        "name": "Panel MDB 400A",
        "qty": 3,
        "price": 25000000
      },
      {
        "name": "MCB 3 Fase 200A",
        "qty": 12,
        "price": 1800000
      }
    ],
    "totalPrice": 96600000,
    "description": "Pengadaan material tahap 3 – Panel MDB 400A",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-03-09T10:00:00"
  },
  {
    "id": 23,
    "userId": 11,
    "projectId": 1,
    "purchaseNumber": "PO-2026-023",
    "items": [
      {
        "name": "Semen Portland PC",
        "qty": 1000,
        "price": 75000
      },
      {
        "name": "Besi Tulangan D19",
        "qty": 5000,
        "price": 18500
      }
    ],
    "totalPrice": 167500000,
    "description": "Pengadaan material tahap 3 – Semen Portland PC",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-05-01T10:00:00"
  },
  {
    "id": 24,
    "userId": 11,
    "projectId": 7,
    "purchaseNumber": "PO-2026-024",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 2 – Pipa Carbon Steel 8 inci",
    "status": "rejected",
    "createdAt": "2026-03-25T10:00:00"
  },
  {
    "id": 25,
    "userId": 11,
    "projectId": 7,
    "purchaseNumber": "PO-2026-025",
    "items": [
      {
        "name": "Baja H-Beam 200x200",
        "qty": 50,
        "price": 4500000
      },
      {
        "name": "Baut Galvanis M24",
        "qty": 200,
        "price": 45000
      }
    ],
    "totalPrice": 234000000,
    "description": "Pengadaan material tahap 2 – Baja H-Beam 200x200",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-03-23T10:00:00"
  },
  {
    "id": 26,
    "userId": 12,
    "projectId": 10,
    "purchaseNumber": "PO-2026-026",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 3 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-01-12T10:00:00"
  },
  {
    "id": 27,
    "userId": 12,
    "projectId": 3,
    "purchaseNumber": "PO-2026-027",
    "items": [
      {
        "name": "Pompa Sentrifugal 100 kW",
        "qty": 2,
        "price": 85000000
      },
      {
        "name": "Coupling Fleksibel",
        "qty": 4,
        "price": 2500000
      }
    ],
    "totalPrice": 180000000,
    "description": "Pengadaan material tahap 2 – Pompa Sentrifugal 100 kW",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-03-14T10:00:00"
  },
  {
    "id": 28,
    "userId": 13,
    "projectId": 1,
    "purchaseNumber": "PO-2026-028",
    "items": [
      {
        "name": "Baja H-Beam 200x200",
        "qty": 50,
        "price": 4500000
      },
      {
        "name": "Baut Galvanis M24",
        "qty": 200,
        "price": 45000
      }
    ],
    "totalPrice": 234000000,
    "description": "Pengadaan material tahap 2 – Baja H-Beam 200x200",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-03-07T10:00:00"
  },
  {
    "id": 29,
    "userId": 13,
    "projectId": 4,
    "purchaseNumber": "PO-2026-029",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 3 – Pipa Carbon Steel 8 inci",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-02-07T10:00:00"
  },
  {
    "id": 30,
    "userId": 14,
    "projectId": 3,
    "purchaseNumber": "PO-2026-030",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 1 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-01-18T10:00:00"
  },
  {
    "id": 31,
    "userId": 14,
    "projectId": 1,
    "purchaseNumber": "PO-2026-031",
    "items": [
      {
        "name": "Semen Portland PC",
        "qty": 1000,
        "price": 75000
      },
      {
        "name": "Besi Tulangan D19",
        "qty": 5000,
        "price": 18500
      }
    ],
    "totalPrice": 167500000,
    "description": "Pengadaan material tahap 1 – Semen Portland PC",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-03-17T10:00:00"
  },
  {
    "id": 32,
    "userId": 14,
    "projectId": 2,
    "purchaseNumber": "PO-2026-032",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 3 – Kabel XLPE 150mm2",
    "status": "pending",
    "createdAt": "2026-02-08T10:00:00"
  },
  {
    "id": 33,
    "userId": 15,
    "projectId": 2,
    "purchaseNumber": "PO-2026-033",
    "items": [
      {
        "name": "Cat Epoxy Minyak",
        "qty": 200,
        "price": 450000
      },
      {
        "name": "Thinner Industri",
        "qty": 50,
        "price": 120000
      }
    ],
    "totalPrice": 96000000,
    "description": "Pengadaan material tahap 1 – Cat Epoxy Minyak",
    "status": "pending",
    "createdAt": "2026-04-06T10:00:00"
  },
  {
    "id": 34,
    "userId": 15,
    "projectId": 10,
    "purchaseNumber": "PO-2026-034",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 2 – Pipa Carbon Steel 8 inci",
    "status": "pending",
    "createdAt": "2026-01-17T10:00:00"
  },
  {
    "id": 35,
    "userId": 16,
    "projectId": 5,
    "purchaseNumber": "PO-2026-035",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 1 – Pipa Carbon Steel 8 inci",
    "status": "rejected",
    "createdAt": "2026-05-22T10:00:00"
  },
  {
    "id": 36,
    "userId": 16,
    "projectId": 5,
    "purchaseNumber": "PO-2026-036",
    "items": [
      {
        "name": "Panel MDB 400A",
        "qty": 3,
        "price": 25000000
      },
      {
        "name": "MCB 3 Fase 200A",
        "qty": 12,
        "price": 1800000
      }
    ],
    "totalPrice": 96600000,
    "description": "Pengadaan material tahap 2 – Panel MDB 400A",
    "status": "pending",
    "createdAt": "2026-03-20T10:00:00"
  },
  {
    "id": 37,
    "userId": 16,
    "projectId": 6,
    "purchaseNumber": "PO-2026-037",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 1 – Pipa Carbon Steel 8 inci",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-04-24T10:00:00"
  },
  {
    "id": 38,
    "userId": 17,
    "projectId": 4,
    "purchaseNumber": "PO-2026-038",
    "items": [
      {
        "name": "Semen Portland PC",
        "qty": 1000,
        "price": 75000
      },
      {
        "name": "Besi Tulangan D19",
        "qty": 5000,
        "price": 18500
      }
    ],
    "totalPrice": 167500000,
    "description": "Pengadaan material tahap 1 – Semen Portland PC",
    "status": "rejected",
    "createdAt": "2026-02-03T10:00:00"
  },
  {
    "id": 39,
    "userId": 17,
    "projectId": 9,
    "purchaseNumber": "PO-2026-039",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 2 – Pipa Carbon Steel 8 inci",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-01-10T10:00:00"
  },
  {
    "id": 40,
    "userId": 18,
    "projectId": 1,
    "purchaseNumber": "PO-2026-040",
    "items": [
      {
        "name": "Semen Portland PC",
        "qty": 1000,
        "price": 75000
      },
      {
        "name": "Besi Tulangan D19",
        "qty": 5000,
        "price": 18500
      }
    ],
    "totalPrice": 167500000,
    "description": "Pengadaan material tahap 2 – Semen Portland PC",
    "status": "rejected",
    "createdAt": "2026-01-17T10:00:00"
  },
  {
    "id": 41,
    "userId": 18,
    "projectId": 6,
    "purchaseNumber": "PO-2026-041",
    "items": [
      {
        "name": "Panel MDB 400A",
        "qty": 3,
        "price": 25000000
      },
      {
        "name": "MCB 3 Fase 200A",
        "qty": 12,
        "price": 1800000
      }
    ],
    "totalPrice": 96600000,
    "description": "Pengadaan material tahap 1 – Panel MDB 400A",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-02-21T10:00:00"
  },
  {
    "id": 42,
    "userId": 19,
    "projectId": 10,
    "purchaseNumber": "PO-2026-042",
    "items": [
      {
        "name": "Baja H-Beam 200x200",
        "qty": 50,
        "price": 4500000
      },
      {
        "name": "Baut Galvanis M24",
        "qty": 200,
        "price": 45000
      }
    ],
    "totalPrice": 234000000,
    "description": "Pengadaan material tahap 1 – Baja H-Beam 200x200",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-02-20T10:00:00"
  },
  {
    "id": 43,
    "userId": 19,
    "projectId": 9,
    "purchaseNumber": "PO-2026-043",
    "items": [
      {
        "name": "Panel MDB 400A",
        "qty": 3,
        "price": 25000000
      },
      {
        "name": "MCB 3 Fase 200A",
        "qty": 12,
        "price": 1800000
      }
    ],
    "totalPrice": 96600000,
    "description": "Pengadaan material tahap 1 – Panel MDB 400A",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-03-22T10:00:00"
  },
  {
    "id": 44,
    "userId": 19,
    "projectId": 8,
    "purchaseNumber": "PO-2026-044",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 1 – Pipa Carbon Steel 8 inci",
    "status": "pending",
    "createdAt": "2026-04-19T10:00:00"
  },
  {
    "id": 45,
    "userId": 20,
    "projectId": 1,
    "purchaseNumber": "PO-2026-045",
    "items": [
      {
        "name": "Kabel XLPE 150mm2",
        "qty": 500,
        "price": 320000
      },
      {
        "name": "Conduit PVC 4 inci",
        "qty": 200,
        "price": 85000
      }
    ],
    "totalPrice": 177000000,
    "description": "Pengadaan material tahap 3 – Kabel XLPE 150mm2",
    "status": "approved",
    "approvedBy": 3,
    "createdAt": "2026-04-23T10:00:00"
  },
  {
    "id": 46,
    "userId": 20,
    "projectId": 8,
    "purchaseNumber": "PO-2026-046",
    "items": [
      {
        "name": "Pipa Carbon Steel 8 inci",
        "qty": 100,
        "price": 2800000
      },
      {
        "name": "Fitting Elbow 90°",
        "qty": 40,
        "price": 350000
      }
    ],
    "totalPrice": 294000000,
    "description": "Pengadaan material tahap 2 – Pipa Carbon Steel 8 inci",
    "status": "rejected",
    "createdAt": "2026-04-07T10:00:00"
  }
];

export const vendorPayments: VendorPayment[] = [
  {
    "id": 1,
    "userId": 3,
    "vendorId": 3,
    "projectId": 4,
    "paymentNumber": "VP-2026-001",
    "invoiceNumber": "INV-0001",
    "amount": 257000000,
    "paymentType": "material",
    "description": "Pelunasan tagihan bulan April 2026",
    "status": "rejected",
    "createdAt": "2026-02-10T14:00:00"
  },
  {
    "id": 2,
    "userId": 3,
    "vendorId": 4,
    "projectId": 10,
    "paymentNumber": "VP-2026-002",
    "invoiceNumber": "INV-0002",
    "amount": 371000000,
    "paymentType": "material",
    "description": "Pembayaran termin 1 sesuai progress pekerjaan 30%",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-01-25T14:00:00"
  },
  {
    "id": 3,
    "userId": 3,
    "vendorId": 2,
    "projectId": 6,
    "paymentNumber": "VP-2026-003",
    "invoiceNumber": "INV-0003",
    "amount": 322000000,
    "paymentType": "material",
    "description": "Pembayaran termin 2 sesuai progress pekerjaan 60%",
    "status": "rejected",
    "createdAt": "2026-06-02T14:00:00"
  },
  {
    "id": 4,
    "userId": 3,
    "vendorId": 2,
    "projectId": 1,
    "paymentNumber": "VP-2026-004",
    "invoiceNumber": "INV-0004",
    "amount": 86000000,
    "paymentType": "material",
    "description": "Pembayaran termin 1 sesuai progress pekerjaan 30%",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-03-22T14:00:00"
  },
  {
    "id": 5,
    "userId": 3,
    "vendorId": 3,
    "projectId": 10,
    "paymentNumber": "VP-2026-005",
    "invoiceNumber": "INV-0005",
    "amount": 173000000,
    "paymentType": "material",
    "description": "Pembayaran termin 2 sesuai progress pekerjaan 60%",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-06-04T14:00:00"
  },
  {
    "id": 6,
    "userId": 3,
    "vendorId": 2,
    "projectId": 2,
    "paymentNumber": "VP-2026-006",
    "invoiceNumber": "INV-0006",
    "amount": 58000000,
    "paymentType": "material",
    "description": "Pembayaran termin 2 sesuai progress pekerjaan 60%",
    "status": "rejected",
    "createdAt": "2026-03-06T14:00:00"
  },
  {
    "id": 7,
    "userId": 3,
    "vendorId": 1,
    "projectId": 1,
    "paymentNumber": "VP-2026-007",
    "invoiceNumber": "INV-0007",
    "amount": 114000000,
    "paymentType": "material",
    "description": "Pelunasan tagihan bulan April 2026",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-02-18T14:00:00"
  },
  {
    "id": 8,
    "userId": 3,
    "vendorId": 5,
    "projectId": 3,
    "paymentNumber": "VP-2026-008",
    "invoiceNumber": "INV-0008",
    "amount": 216000000,
    "paymentType": "service",
    "description": "Pembayaran termin 1 sesuai progress pekerjaan 30%",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-05-23T14:00:00"
  },
  {
    "id": 9,
    "userId": 15,
    "vendorId": 2,
    "projectId": 10,
    "paymentNumber": "VP-2026-009",
    "invoiceNumber": "INV-0009",
    "amount": 253000000,
    "paymentType": "material",
    "description": "Pembayaran termin 1 sesuai progress pekerjaan 30%",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-04-20T14:00:00"
  },
  {
    "id": 10,
    "userId": 15,
    "vendorId": 5,
    "projectId": 9,
    "paymentNumber": "VP-2026-010",
    "invoiceNumber": "INV-0010",
    "amount": 441000000,
    "paymentType": "material",
    "description": "Pembayaran termin 2 sesuai progress pekerjaan 60%",
    "status": "rejected",
    "createdAt": "2026-03-06T14:00:00"
  },
  {
    "id": 11,
    "userId": 15,
    "vendorId": 3,
    "projectId": 2,
    "paymentNumber": "VP-2026-011",
    "invoiceNumber": "INV-0011",
    "amount": 192000000,
    "paymentType": "material",
    "description": "Pembayaran termin 3 (final) selesainya pekerjaan 100%",
    "status": "pending",
    "createdAt": "2026-06-20T14:00:00"
  },
  {
    "id": 12,
    "userId": 15,
    "vendorId": 3,
    "projectId": 3,
    "paymentNumber": "VP-2026-012",
    "invoiceNumber": "INV-0012",
    "amount": 198000000,
    "paymentType": "material",
    "description": "Pembayaran termin 1 sesuai progress pekerjaan 30%",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-05-22T14:00:00"
  },
  {
    "id": 13,
    "userId": 15,
    "vendorId": 1,
    "projectId": 8,
    "paymentNumber": "VP-2026-013",
    "invoiceNumber": "INV-0013",
    "amount": 162000000,
    "paymentType": "material",
    "description": "Pembayaran termin 1 sesuai progress pekerjaan 30%",
    "status": "rejected",
    "createdAt": "2026-02-07T14:00:00"
  },
  {
    "id": 14,
    "userId": 15,
    "vendorId": 5,
    "projectId": 8,
    "paymentNumber": "VP-2026-014",
    "invoiceNumber": "INV-0014",
    "amount": 228000000,
    "paymentType": "material",
    "description": "Pelunasan tagihan bulan April 2026",
    "status": "pending",
    "createdAt": "2026-06-24T14:00:00"
  },
  {
    "id": 15,
    "userId": 15,
    "vendorId": 2,
    "projectId": 10,
    "paymentNumber": "VP-2026-015",
    "invoiceNumber": "INV-0015",
    "amount": 456000000,
    "paymentType": "material",
    "description": "Pembayaran termin 2 sesuai progress pekerjaan 60%",
    "status": "approved",
    "approvedBy": 1,
    "createdAt": "2026-05-19T14:00:00"
  },
  {
    "id": 16,
    "userId": 15,
    "vendorId": 5,
    "projectId": 10,
    "paymentNumber": "VP-2026-016",
    "invoiceNumber": "INV-0016",
    "amount": 360000000,
    "paymentType": "material",
    "description": "Pembayaran termin 3 (final) selesainya pekerjaan 100%",
    "status": "pending",
    "createdAt": "2026-02-09T14:00:00"
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
    case "paid":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" };
    case "pending":
    case "on_hold":
    case "draft":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" };
    case "rejected":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" };
    case "extended":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" };
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
    "userId": 6,
    "role": "Senior Engineer"
  },
  {
    "id": 4,
    "projectId": 1,
    "userId": 10,
    "role": "Site Supervisor"
  },
  {
    "id": 5,
    "projectId": 1,
    "userId": 20,
    "role": "Architect"
  },
  {
    "id": 6,
    "projectId": 2,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 7,
    "projectId": 2,
    "userId": 5,
    "role": "Project Engineer"
  },
  {
    "id": 8,
    "projectId": 2,
    "userId": 20,
    "role": "Architect"
  },
  {
    "id": 9,
    "projectId": 2,
    "userId": 14,
    "role": "Field Engineer"
  },
  {
    "id": 10,
    "projectId": 3,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 11,
    "projectId": 3,
    "userId": 7,
    "role": "Engineer"
  },
  {
    "id": 12,
    "projectId": 3,
    "userId": 11,
    "role": "Junior Engineer"
  },
  {
    "id": 13,
    "projectId": 3,
    "userId": 18,
    "role": "Legal Counsel"
  },
  {
    "id": 14,
    "projectId": 4,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 15,
    "projectId": 4,
    "userId": 7,
    "role": "Engineer"
  },
  {
    "id": 16,
    "projectId": 4,
    "userId": 14,
    "role": "Field Engineer"
  },
  {
    "id": 17,
    "projectId": 4,
    "userId": 17,
    "role": "IT Support"
  },
  {
    "id": 18,
    "projectId": 5,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 19,
    "projectId": 5,
    "userId": 5,
    "role": "Project Engineer"
  },
  {
    "id": 20,
    "projectId": 5,
    "userId": 6,
    "role": "Senior Engineer"
  },
  {
    "id": 21,
    "projectId": 5,
    "userId": 10,
    "role": "Site Supervisor"
  },
  {
    "id": 22,
    "projectId": 6,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 23,
    "projectId": 6,
    "userId": 6,
    "role": "Senior Engineer"
  },
  {
    "id": 24,
    "projectId": 6,
    "userId": 11,
    "role": "Junior Engineer"
  },
  {
    "id": 25,
    "projectId": 6,
    "userId": 19,
    "role": "Marketing Specialist"
  },
  {
    "id": 26,
    "projectId": 7,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 27,
    "projectId": 7,
    "userId": 20,
    "role": "Architect"
  },
  {
    "id": 28,
    "projectId": 7,
    "userId": 5,
    "role": "Project Engineer"
  },
  {
    "id": 29,
    "projectId": 7,
    "userId": 10,
    "role": "Site Supervisor"
  },
  {
    "id": 30,
    "projectId": 8,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 31,
    "projectId": 8,
    "userId": 7,
    "role": "Engineer"
  },
  {
    "id": 32,
    "projectId": 8,
    "userId": 17,
    "role": "IT Support"
  },
  {
    "id": 33,
    "projectId": 8,
    "userId": 9,
    "role": "Accountant"
  },
  {
    "id": 34,
    "projectId": 9,
    "userId": 4,
    "role": "Project Manager"
  },
  {
    "id": 35,
    "projectId": 9,
    "userId": 6,
    "role": "Senior Engineer"
  },
  {
    "id": 36,
    "projectId": 9,
    "userId": 8,
    "role": "Procurement Officer"
  },
  {
    "id": 37,
    "projectId": 10,
    "userId": 16,
    "role": "Project Manager"
  },
  {
    "id": 38,
    "projectId": 10,
    "userId": 12,
    "role": "Procurement Staff"
  },
  {
    "id": 39,
    "projectId": 10,
    "userId": 8,
    "role": "Procurement Officer"
  },
  {
    "id": 40,
    "projectId": 10,
    "userId": 9,
    "role": "Accountant"
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
    "period": "Januari 2026",
    "baseSalary": 20000000,
    "allowances": 2500000,
    "deductions": 1600000,
    "netSalary": 20900000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 2,
    "userId": 1,
    "period": "Februari 2026",
    "baseSalary": 20000000,
    "allowances": 2500000,
    "deductions": 1600000,
    "netSalary": 20900000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 3,
    "userId": 1,
    "period": "Maret 2026",
    "baseSalary": 20000000,
    "allowances": 2500000,
    "deductions": 1600000,
    "netSalary": 20900000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 4,
    "userId": 1,
    "period": "April 2026",
    "baseSalary": 20000000,
    "allowances": 2500000,
    "deductions": 1600000,
    "netSalary": 20900000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 5,
    "userId": 1,
    "period": "Mei 2026",
    "baseSalary": 20000000,
    "allowances": 2500000,
    "deductions": 1600000,
    "netSalary": 20900000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 6,
    "userId": 1,
    "period": "Juni 2026",
    "baseSalary": 20000000,
    "allowances": 2500000,
    "deductions": 1600000,
    "netSalary": 20900000,
    "status": "draft"
  },
  {
    "id": 7,
    "userId": 2,
    "period": "Januari 2026",
    "baseSalary": 15000000,
    "allowances": 2000000,
    "deductions": 1200000,
    "netSalary": 15800000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 8,
    "userId": 2,
    "period": "Februari 2026",
    "baseSalary": 15000000,
    "allowances": 2000000,
    "deductions": 1200000,
    "netSalary": 15800000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 9,
    "userId": 2,
    "period": "Maret 2026",
    "baseSalary": 15000000,
    "allowances": 2000000,
    "deductions": 1200000,
    "netSalary": 15800000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 10,
    "userId": 2,
    "period": "April 2026",
    "baseSalary": 15000000,
    "allowances": 2000000,
    "deductions": 1200000,
    "netSalary": 15800000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 11,
    "userId": 2,
    "period": "Mei 2026",
    "baseSalary": 15000000,
    "allowances": 2000000,
    "deductions": 1200000,
    "netSalary": 15800000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 12,
    "userId": 2,
    "period": "Juni 2026",
    "baseSalary": 15000000,
    "allowances": 2000000,
    "deductions": 1200000,
    "netSalary": 15800000,
    "status": "draft"
  },
  {
    "id": 13,
    "userId": 3,
    "period": "Januari 2026",
    "baseSalary": 16000000,
    "allowances": 2000000,
    "deductions": 1280000,
    "netSalary": 16720000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 14,
    "userId": 3,
    "period": "Februari 2026",
    "baseSalary": 16000000,
    "allowances": 2000000,
    "deductions": 1280000,
    "netSalary": 16720000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 15,
    "userId": 3,
    "period": "Maret 2026",
    "baseSalary": 16000000,
    "allowances": 2000000,
    "deductions": 1280000,
    "netSalary": 16720000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 16,
    "userId": 3,
    "period": "April 2026",
    "baseSalary": 16000000,
    "allowances": 2000000,
    "deductions": 1280000,
    "netSalary": 16720000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 17,
    "userId": 3,
    "period": "Mei 2026",
    "baseSalary": 16000000,
    "allowances": 2000000,
    "deductions": 1280000,
    "netSalary": 16720000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 18,
    "userId": 3,
    "period": "Juni 2026",
    "baseSalary": 16000000,
    "allowances": 2000000,
    "deductions": 1280000,
    "netSalary": 16720000,
    "status": "draft"
  },
  {
    "id": 19,
    "userId": 4,
    "period": "Januari 2026",
    "baseSalary": 18000000,
    "allowances": 3000000,
    "deductions": 1440000,
    "netSalary": 19560000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 20,
    "userId": 4,
    "period": "Februari 2026",
    "baseSalary": 18000000,
    "allowances": 3000000,
    "deductions": 1440000,
    "netSalary": 19560000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 21,
    "userId": 4,
    "period": "Maret 2026",
    "baseSalary": 18000000,
    "allowances": 3000000,
    "deductions": 1440000,
    "netSalary": 19560000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 22,
    "userId": 4,
    "period": "April 2026",
    "baseSalary": 18000000,
    "allowances": 3000000,
    "deductions": 1440000,
    "netSalary": 19560000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 23,
    "userId": 4,
    "period": "Mei 2026",
    "baseSalary": 18000000,
    "allowances": 3000000,
    "deductions": 1440000,
    "netSalary": 19560000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 24,
    "userId": 4,
    "period": "Juni 2026",
    "baseSalary": 18000000,
    "allowances": 3000000,
    "deductions": 1440000,
    "netSalary": 19560000,
    "status": "draft"
  },
  {
    "id": 25,
    "userId": 5,
    "period": "Januari 2026",
    "baseSalary": 10000000,
    "allowances": 1000000,
    "deductions": 800000,
    "netSalary": 10200000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 26,
    "userId": 5,
    "period": "Februari 2026",
    "baseSalary": 10000000,
    "allowances": 1000000,
    "deductions": 800000,
    "netSalary": 10200000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 27,
    "userId": 5,
    "period": "Maret 2026",
    "baseSalary": 10000000,
    "allowances": 1000000,
    "deductions": 800000,
    "netSalary": 10200000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 28,
    "userId": 5,
    "period": "April 2026",
    "baseSalary": 10000000,
    "allowances": 1000000,
    "deductions": 800000,
    "netSalary": 10200000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 29,
    "userId": 5,
    "period": "Mei 2026",
    "baseSalary": 10000000,
    "allowances": 1000000,
    "deductions": 800000,
    "netSalary": 10200000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 30,
    "userId": 5,
    "period": "Juni 2026",
    "baseSalary": 10000000,
    "allowances": 1000000,
    "deductions": 800000,
    "netSalary": 10200000,
    "status": "draft"
  },
  {
    "id": 31,
    "userId": 6,
    "period": "Januari 2026",
    "baseSalary": 12000000,
    "allowances": 1000000,
    "deductions": 960000,
    "netSalary": 12040000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 32,
    "userId": 6,
    "period": "Februari 2026",
    "baseSalary": 12000000,
    "allowances": 1000000,
    "deductions": 960000,
    "netSalary": 12040000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 33,
    "userId": 6,
    "period": "Maret 2026",
    "baseSalary": 12000000,
    "allowances": 1000000,
    "deductions": 960000,
    "netSalary": 12040000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 34,
    "userId": 6,
    "period": "April 2026",
    "baseSalary": 12000000,
    "allowances": 1000000,
    "deductions": 960000,
    "netSalary": 12040000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 35,
    "userId": 6,
    "period": "Mei 2026",
    "baseSalary": 12000000,
    "allowances": 1000000,
    "deductions": 960000,
    "netSalary": 12040000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 36,
    "userId": 6,
    "period": "Juni 2026",
    "baseSalary": 12000000,
    "allowances": 1000000,
    "deductions": 960000,
    "netSalary": 12040000,
    "status": "draft"
  },
  {
    "id": 37,
    "userId": 7,
    "period": "Januari 2026",
    "baseSalary": 9000000,
    "allowances": 1000000,
    "deductions": 720000,
    "netSalary": 9280000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 38,
    "userId": 7,
    "period": "Februari 2026",
    "baseSalary": 9000000,
    "allowances": 1000000,
    "deductions": 720000,
    "netSalary": 9280000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 39,
    "userId": 7,
    "period": "Maret 2026",
    "baseSalary": 9000000,
    "allowances": 1000000,
    "deductions": 720000,
    "netSalary": 9280000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 40,
    "userId": 7,
    "period": "April 2026",
    "baseSalary": 9000000,
    "allowances": 1000000,
    "deductions": 720000,
    "netSalary": 9280000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 41,
    "userId": 7,
    "period": "Mei 2026",
    "baseSalary": 9000000,
    "allowances": 1000000,
    "deductions": 720000,
    "netSalary": 9280000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 42,
    "userId": 7,
    "period": "Juni 2026",
    "baseSalary": 9000000,
    "allowances": 1000000,
    "deductions": 720000,
    "netSalary": 9280000,
    "status": "draft"
  },
  {
    "id": 43,
    "userId": 8,
    "period": "Januari 2026",
    "baseSalary": 8000000,
    "allowances": 1000000,
    "deductions": 640000,
    "netSalary": 8360000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 44,
    "userId": 8,
    "period": "Februari 2026",
    "baseSalary": 8000000,
    "allowances": 1000000,
    "deductions": 640000,
    "netSalary": 8360000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 45,
    "userId": 8,
    "period": "Maret 2026",
    "baseSalary": 8000000,
    "allowances": 1000000,
    "deductions": 640000,
    "netSalary": 8360000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 46,
    "userId": 8,
    "period": "April 2026",
    "baseSalary": 8000000,
    "allowances": 1000000,
    "deductions": 640000,
    "netSalary": 8360000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 47,
    "userId": 8,
    "period": "Mei 2026",
    "baseSalary": 8000000,
    "allowances": 1000000,
    "deductions": 640000,
    "netSalary": 8360000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 48,
    "userId": 8,
    "period": "Juni 2026",
    "baseSalary": 8000000,
    "allowances": 1000000,
    "deductions": 640000,
    "netSalary": 8360000,
    "status": "draft"
  },
  {
    "id": 49,
    "userId": 9,
    "period": "Januari 2026",
    "baseSalary": 8500000,
    "allowances": 1000000,
    "deductions": 680000,
    "netSalary": 8820000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 50,
    "userId": 9,
    "period": "Februari 2026",
    "baseSalary": 8500000,
    "allowances": 1000000,
    "deductions": 680000,
    "netSalary": 8820000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 51,
    "userId": 9,
    "period": "Maret 2026",
    "baseSalary": 8500000,
    "allowances": 1000000,
    "deductions": 680000,
    "netSalary": 8820000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 52,
    "userId": 9,
    "period": "April 2026",
    "baseSalary": 8500000,
    "allowances": 1000000,
    "deductions": 680000,
    "netSalary": 8820000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 53,
    "userId": 9,
    "period": "Mei 2026",
    "baseSalary": 8500000,
    "allowances": 1000000,
    "deductions": 680000,
    "netSalary": 8820000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 54,
    "userId": 9,
    "period": "Juni 2026",
    "baseSalary": 8500000,
    "allowances": 1000000,
    "deductions": 680000,
    "netSalary": 8820000,
    "status": "draft"
  },
  {
    "id": 55,
    "userId": 10,
    "period": "Januari 2026",
    "baseSalary": 11000000,
    "allowances": 1500000,
    "deductions": 880000,
    "netSalary": 11620000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 56,
    "userId": 10,
    "period": "Februari 2026",
    "baseSalary": 11000000,
    "allowances": 1500000,
    "deductions": 880000,
    "netSalary": 11620000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 57,
    "userId": 10,
    "period": "Maret 2026",
    "baseSalary": 11000000,
    "allowances": 1500000,
    "deductions": 880000,
    "netSalary": 11620000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 58,
    "userId": 10,
    "period": "April 2026",
    "baseSalary": 11000000,
    "allowances": 1500000,
    "deductions": 880000,
    "netSalary": 11620000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 59,
    "userId": 10,
    "period": "Mei 2026",
    "baseSalary": 11000000,
    "allowances": 1500000,
    "deductions": 880000,
    "netSalary": 11620000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 60,
    "userId": 10,
    "period": "Juni 2026",
    "baseSalary": 11000000,
    "allowances": 1500000,
    "deductions": 880000,
    "netSalary": 11620000,
    "status": "draft"
  },
  {
    "id": 61,
    "userId": 11,
    "period": "Januari 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 62,
    "userId": 11,
    "period": "Februari 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 63,
    "userId": 11,
    "period": "Maret 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 64,
    "userId": 11,
    "period": "April 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 65,
    "userId": 11,
    "period": "Mei 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 66,
    "userId": 11,
    "period": "Juni 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "draft"
  },
  {
    "id": 67,
    "userId": 12,
    "period": "Januari 2026",
    "baseSalary": 6500000,
    "allowances": 1000000,
    "deductions": 520000,
    "netSalary": 6980000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 68,
    "userId": 12,
    "period": "Februari 2026",
    "baseSalary": 6500000,
    "allowances": 1000000,
    "deductions": 520000,
    "netSalary": 6980000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 69,
    "userId": 12,
    "period": "Maret 2026",
    "baseSalary": 6500000,
    "allowances": 1000000,
    "deductions": 520000,
    "netSalary": 6980000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 70,
    "userId": 12,
    "period": "April 2026",
    "baseSalary": 6500000,
    "allowances": 1000000,
    "deductions": 520000,
    "netSalary": 6980000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 71,
    "userId": 12,
    "period": "Mei 2026",
    "baseSalary": 6500000,
    "allowances": 1000000,
    "deductions": 520000,
    "netSalary": 6980000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 72,
    "userId": 12,
    "period": "Juni 2026",
    "baseSalary": 6500000,
    "allowances": 1000000,
    "deductions": 520000,
    "netSalary": 6980000,
    "status": "draft"
  },
  {
    "id": 73,
    "userId": 13,
    "period": "Januari 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 74,
    "userId": 13,
    "period": "Februari 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 75,
    "userId": 13,
    "period": "Maret 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 76,
    "userId": 13,
    "period": "April 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 77,
    "userId": 13,
    "period": "Mei 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 78,
    "userId": 13,
    "period": "Juni 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "draft"
  },
  {
    "id": 79,
    "userId": 14,
    "period": "Januari 2026",
    "baseSalary": 9500000,
    "allowances": 1300000,
    "deductions": 760000,
    "netSalary": 10040000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 80,
    "userId": 14,
    "period": "Februari 2026",
    "baseSalary": 9500000,
    "allowances": 1300000,
    "deductions": 760000,
    "netSalary": 10040000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 81,
    "userId": 14,
    "period": "Maret 2026",
    "baseSalary": 9500000,
    "allowances": 1300000,
    "deductions": 760000,
    "netSalary": 10040000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 82,
    "userId": 14,
    "period": "April 2026",
    "baseSalary": 9500000,
    "allowances": 1300000,
    "deductions": 760000,
    "netSalary": 10040000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 83,
    "userId": 14,
    "period": "Mei 2026",
    "baseSalary": 9500000,
    "allowances": 1300000,
    "deductions": 760000,
    "netSalary": 10040000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 84,
    "userId": 14,
    "period": "Juni 2026",
    "baseSalary": 9500000,
    "allowances": 1300000,
    "deductions": 760000,
    "netSalary": 10040000,
    "status": "draft"
  },
  {
    "id": 85,
    "userId": 15,
    "period": "Januari 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 86,
    "userId": 15,
    "period": "Februari 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 87,
    "userId": 15,
    "period": "Maret 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 88,
    "userId": 15,
    "period": "April 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 89,
    "userId": 15,
    "period": "Mei 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 90,
    "userId": 15,
    "period": "Juni 2026",
    "baseSalary": 7000000,
    "allowances": 1000000,
    "deductions": 560000,
    "netSalary": 7440000,
    "status": "draft"
  },
  {
    "id": 91,
    "userId": 16,
    "period": "Januari 2026",
    "baseSalary": 16000000,
    "allowances": 2500000,
    "deductions": 1280000,
    "netSalary": 17220000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 92,
    "userId": 16,
    "period": "Februari 2026",
    "baseSalary": 16000000,
    "allowances": 2500000,
    "deductions": 1280000,
    "netSalary": 17220000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 93,
    "userId": 16,
    "period": "Maret 2026",
    "baseSalary": 16000000,
    "allowances": 2500000,
    "deductions": 1280000,
    "netSalary": 17220000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 94,
    "userId": 16,
    "period": "April 2026",
    "baseSalary": 16000000,
    "allowances": 2500000,
    "deductions": 1280000,
    "netSalary": 17220000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 95,
    "userId": 16,
    "period": "Mei 2026",
    "baseSalary": 16000000,
    "allowances": 2500000,
    "deductions": 1280000,
    "netSalary": 17220000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 96,
    "userId": 16,
    "period": "Juni 2026",
    "baseSalary": 16000000,
    "allowances": 2500000,
    "deductions": 1280000,
    "netSalary": 17220000,
    "status": "draft"
  },
  {
    "id": 97,
    "userId": 17,
    "period": "Januari 2026",
    "baseSalary": 7500000,
    "allowances": 1000000,
    "deductions": 600000,
    "netSalary": 7900000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 98,
    "userId": 17,
    "period": "Februari 2026",
    "baseSalary": 7500000,
    "allowances": 1000000,
    "deductions": 600000,
    "netSalary": 7900000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 99,
    "userId": 17,
    "period": "Maret 2026",
    "baseSalary": 7500000,
    "allowances": 1000000,
    "deductions": 600000,
    "netSalary": 7900000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 100,
    "userId": 17,
    "period": "April 2026",
    "baseSalary": 7500000,
    "allowances": 1000000,
    "deductions": 600000,
    "netSalary": 7900000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 101,
    "userId": 17,
    "period": "Mei 2026",
    "baseSalary": 7500000,
    "allowances": 1000000,
    "deductions": 600000,
    "netSalary": 7900000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 102,
    "userId": 17,
    "period": "Juni 2026",
    "baseSalary": 7500000,
    "allowances": 1000000,
    "deductions": 600000,
    "netSalary": 7900000,
    "status": "draft"
  },
  {
    "id": 103,
    "userId": 18,
    "period": "Januari 2026",
    "baseSalary": 13000000,
    "allowances": 1800000,
    "deductions": 1040000,
    "netSalary": 13760000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 104,
    "userId": 18,
    "period": "Februari 2026",
    "baseSalary": 13000000,
    "allowances": 1800000,
    "deductions": 1040000,
    "netSalary": 13760000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 105,
    "userId": 18,
    "period": "Maret 2026",
    "baseSalary": 13000000,
    "allowances": 1800000,
    "deductions": 1040000,
    "netSalary": 13760000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 106,
    "userId": 18,
    "period": "April 2026",
    "baseSalary": 13000000,
    "allowances": 1800000,
    "deductions": 1040000,
    "netSalary": 13760000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 107,
    "userId": 18,
    "period": "Mei 2026",
    "baseSalary": 13000000,
    "allowances": 1800000,
    "deductions": 1040000,
    "netSalary": 13760000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 108,
    "userId": 18,
    "period": "Juni 2026",
    "baseSalary": 13000000,
    "allowances": 1800000,
    "deductions": 1040000,
    "netSalary": 13760000,
    "status": "draft"
  },
  {
    "id": 109,
    "userId": 19,
    "period": "Januari 2026",
    "baseSalary": 8500000,
    "allowances": 1200000,
    "deductions": 680000,
    "netSalary": 9020000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 110,
    "userId": 19,
    "period": "Februari 2026",
    "baseSalary": 8500000,
    "allowances": 1200000,
    "deductions": 680000,
    "netSalary": 9020000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 111,
    "userId": 19,
    "period": "Maret 2026",
    "baseSalary": 8500000,
    "allowances": 1200000,
    "deductions": 680000,
    "netSalary": 9020000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 112,
    "userId": 19,
    "period": "April 2026",
    "baseSalary": 8500000,
    "allowances": 1200000,
    "deductions": 680000,
    "netSalary": 9020000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 113,
    "userId": 19,
    "period": "Mei 2026",
    "baseSalary": 8500000,
    "allowances": 1200000,
    "deductions": 680000,
    "netSalary": 9020000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 114,
    "userId": 19,
    "period": "Juni 2026",
    "baseSalary": 8500000,
    "allowances": 1200000,
    "deductions": 680000,
    "netSalary": 9020000,
    "status": "draft"
  },
  {
    "id": 115,
    "userId": 20,
    "period": "Januari 2026",
    "baseSalary": 14000000,
    "allowances": 1800000,
    "deductions": 1120000,
    "netSalary": 14680000,
    "status": "paid",
    "paymentDate": "2026-01-25T08:00:00Z"
  },
  {
    "id": 116,
    "userId": 20,
    "period": "Februari 2026",
    "baseSalary": 14000000,
    "allowances": 1800000,
    "deductions": 1120000,
    "netSalary": 14680000,
    "status": "paid",
    "paymentDate": "2026-02-25T08:00:00Z"
  },
  {
    "id": 117,
    "userId": 20,
    "period": "Maret 2026",
    "baseSalary": 14000000,
    "allowances": 1800000,
    "deductions": 1120000,
    "netSalary": 14680000,
    "status": "paid",
    "paymentDate": "2026-03-25T08:00:00Z"
  },
  {
    "id": 118,
    "userId": 20,
    "period": "April 2026",
    "baseSalary": 14000000,
    "allowances": 1800000,
    "deductions": 1120000,
    "netSalary": 14680000,
    "status": "paid",
    "paymentDate": "2026-04-25T08:00:00Z"
  },
  {
    "id": 119,
    "userId": 20,
    "period": "Mei 2026",
    "baseSalary": 14000000,
    "allowances": 1800000,
    "deductions": 1120000,
    "netSalary": 14680000,
    "status": "paid",
    "paymentDate": "2026-05-25T08:00:00Z"
  },
  {
    "id": 120,
    "userId": 20,
    "period": "Juni 2026",
    "baseSalary": 14000000,
    "allowances": 1800000,
    "deductions": 1120000,
    "netSalary": 14680000,
    "status": "draft"
  }
];
