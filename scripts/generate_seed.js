const fs = require('fs');

const users = [
  { id: 1, name: "Rina Wijaya", email: "admin@hris.local", password: "password", role: "admin", employeeId: "ADM001", department: "IT", position: "System Administrator", isActive: true, baseSalary: 20000000, allowanceMeal: 1000000, allowanceTransport: 1500000, allowancePositionPct: 10, deductionBpjsKesehatanPct: 1, deductionBpjsKetenagakerjaanPct: 2, deductionPph21Pct: 5 },
  { id: 2, name: "Dewi Lestari", email: "hr@hris.local", password: "password", role: "hr", employeeId: "HR001", department: "Human Resource", position: "HR Manager", isActive: true, baseSalary: 15000000, allowanceMeal: 1000000, allowanceTransport: 1000000 },
  { id: 3, name: "Ahmad Hidayat", email: "finance@hris.local", password: "password", role: "finance", employeeId: "FIN001", department: "Finance", position: "Finance Manager", isActive: true, baseSalary: 16000000, allowanceMeal: 1000000, allowanceTransport: 1000000 },
  { id: 4, name: "Dimas Anggara", email: "pm@hris.local", password: "password", role: "project_manager", employeeId: "PM001", department: "Project Management", position: "Senior Project Manager", isActive: true, baseSalary: 18000000, allowanceMeal: 1000000, allowanceTransport: 2000000 },
  { id: 5, name: "Budi Santoso", email: "budi@hris.local", password: "password", role: "karyawan", employeeId: "EMP001", department: "Engineering", position: "Project Engineer", isActive: true, baseSalary: 10000000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 6, name: "Siti Nurhaliza", email: "siti@hris.local", password: "password", role: "karyawan", employeeId: "EMP002", department: "Engineering", position: "Senior Engineer", isActive: true, baseSalary: 12000000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 7, name: "Andi Pratama", email: "andi@hris.local", password: "password", role: "karyawan", employeeId: "EMP003", department: "Engineering", position: "Engineer", isActive: true, baseSalary: 9000000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 8, name: "Rizki Pratama", email: "rizki@hris.local", password: "password", role: "karyawan", employeeId: "EMP004", department: "Procurement", position: "Procurement Officer", isActive: true, baseSalary: 8000000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 9, name: "Mega Sari", email: "mega@hris.local", password: "password", role: "karyawan", employeeId: "EMP005", department: "Finance", position: "Accountant", isActive: true, baseSalary: 8500000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 10, name: "Fajar Nugroho", email: "fajar@hris.local", password: "password", role: "karyawan", employeeId: "EMP006", department: "Engineering", position: "Site Supervisor", isActive: true, baseSalary: 11000000, allowanceMeal: 700000, allowanceTransport: 800000 },
  { id: 11, name: "Nadia Utami", email: "nadia@hris.local", password: "password", role: "karyawan", employeeId: "EMP007", department: "Engineering", position: "Junior Engineer", isActive: true, baseSalary: 7000000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 12, name: "Hendra Wijaya", email: "hendra@hris.local", password: "password", role: "karyawan", employeeId: "EMP008", department: "Procurement", position: "Procurement Staff", isActive: true, baseSalary: 6500000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 13, name: "Lisa Permata", email: "lisa@hris.local", password: "password", role: "karyawan", employeeId: "EMP009", department: "Human Resource", position: "HR Staff", isActive: true, baseSalary: 7000000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 14, name: "Bayu Setiawan", email: "bayu@hris.local", password: "password", role: "karyawan", employeeId: "EMP010", department: "Engineering", position: "Field Engineer", isActive: true, baseSalary: 9500000, allowanceMeal: 600000, allowanceTransport: 700000 },
  // Extra Users to make it comprehensive
  { id: 15, name: "Toko Sinar", email: "toko@hris.local", password: "password", role: "finance", employeeId: "FIN002", department: "Finance", position: "Finance Staff", isActive: true, baseSalary: 7000000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 16, name: "Gita Wiryawan", email: "pm2@hris.local", password: "password", role: "project_manager", employeeId: "PM002", department: "Project Management", position: "Project Manager", isActive: true, baseSalary: 16000000, allowanceMeal: 1000000, allowanceTransport: 1500000 },
  { id: 17, name: "Cahyo Kumolo", email: "cahyo@hris.local", password: "password", role: "karyawan", employeeId: "EMP011", department: "IT", position: "IT Support", isActive: true, baseSalary: 7500000, allowanceMeal: 500000, allowanceTransport: 500000 },
  { id: 18, name: "Dina Mariana", email: "dina@hris.local", password: "password", role: "karyawan", employeeId: "EMP012", department: "Legal", position: "Legal Counsel", isActive: true, baseSalary: 13000000, allowanceMeal: 800000, allowanceTransport: 1000000 },
  { id: 19, name: "Eko Patrio", email: "eko@hris.local", password: "password", role: "karyawan", employeeId: "EMP013", department: "Marketing", position: "Marketing Specialist", isActive: true, baseSalary: 8500000, allowanceMeal: 500000, allowanceTransport: 700000 },
  { id: 20, name: "Farah Quinn", email: "farah@hris.local", password: "password", role: "karyawan", employeeId: "EMP014", department: "Engineering", position: "Architect", isActive: true, baseSalary: 14000000, allowanceMeal: 800000, allowanceTransport: 1000000 },
];

const projects = [
  { id: 1, name: "PLTU Jawa Tengah", code: "PRJ-001", status: "active", budget: 5000000000, managerId: 4, description: "Pembangunan PLTU di Jawa Tengah" },
  { id: 2, name: "Pipeline Kalimantan", code: "PRJ-002", status: "active", budget: 3200000000, managerId: 4, description: "Pemasangan pipeline di Kalimantan" },
  { id: 3, name: "Refinery Upgrade Cilacap", code: "PRJ-003", status: "on_hold", budget: 8000000000, managerId: 16, description: "Upgrade fasilitas refinery Cilacap" },
  { id: 4, name: "Solar Panel Installation Bali", code: "PRJ-004", status: "active", budget: 1500000000, managerId: 16, description: "Instalasi panel surya di Bali" },
  { id: 5, name: "Wind Farm Sulawesi", code: "PRJ-005", status: "completed", budget: 6000000000, managerId: 4, description: "Pembangunan wind farm di Sulawesi" },
  { id: 6, name: "Geothermal Power Plant Sumut", code: "PRJ-006", status: "active", budget: 12000000000, managerId: 16, description: "Pengembangan Geothermal di Sumatera Utara" },
  { id: 7, name: "Dam Construction Papua", code: "PRJ-007", status: "active", budget: 9500000000, managerId: 4, description: "Konstruksi bendungan air di Papua" },
  { id: 8, name: "Smart Grid Implementation Jakarta", code: "PRJ-008", status: "active", budget: 4000000000, managerId: 16, description: "Implementasi Smart Grid di wilayah Jakarta Raya" },
  { id: 9, name: "Offshore Platform Maintenance", code: "PRJ-009", status: "on_hold", budget: 7500000000, managerId: 4, description: "Maintenance platform lepas pantai" },
  { id: 10, name: "Electric Vehicle Charging Stations", code: "PRJ-010", status: "completed", budget: 2000000000, managerId: 16, description: "Instalasi SPKLU di jalan tol Trans Jawa" },
];

const leaveTypes = [
  { id: 1, name: "Cuti Tahunan", maxDays: 12 },
  { id: 2, name: "Cuti Sakit", maxDays: 30 },
  { id: 3, name: "Cuti Melahirkan", maxDays: 90 },
  { id: 4, name: "Izin Pribadi", maxDays: 3 },
  { id: 5, name: "Cuti Besar", maxDays: 30 },
];

const vendors = [
  { id: 1, name: "PT Baja Utama", company: "PT Baja Utama Indonesia", contactPerson: "Hendra", email: "hendra@bajautama.co.id", phone: "021-5551234" },
  { id: 2, name: "CV Mitra Teknik", company: "CV Mitra Teknik Sejahtera", contactPerson: "Agus", email: "agus@mitrateknik.com", phone: "021-5555678" },
  { id: 3, name: "PT Elektrik Prima", company: "PT Elektrik Prima Nusantara", contactPerson: "Rina", email: "rina@elektrikprima.co.id", phone: "021-5559012" },
  { id: 4, name: "PT Beton Kuat", company: "PT Beton Kuat Persada", contactPerson: "Bambang", email: "bambang@betonkuat.com", phone: "021-5553333" },
  { id: 5, name: "PT Kabel Indo", company: "PT Kabel Nusantara", contactPerson: "Siska", email: "siska@kabelindo.com", phone: "021-5554444" },
];

// Generate robust seed data
const projectTeams = [];
projects.forEach(p => {
  projectTeams.push({ id: projectTeams.length + 1, projectId: p.id, userId: p.managerId, role: "Project Manager" });
  // Add 3-5 random engineers/staff to each project
  for(let i=0; i<3; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    if(randomUser.role === 'karyawan' && !projectTeams.find(pt => pt.projectId === p.id && pt.userId === randomUser.id)) {
      projectTeams.push({ id: projectTeams.length + 1, projectId: p.id, userId: randomUser.id, role: randomUser.position });
    }
  }
});

const workPlans = [];
const workRealizations = [];
const leaveRequests = [];
const spds = [];
const purchases = [];
const vendorPayments = [];
const payrolls = [];

const statuses = ["approved", "pending", "rejected", "approved", "approved"]; // bias towards approved

// Generate 50 Work Plans & Realizations
for(let i=1; i<=50; i++) {
  const pId = Math.floor(Math.random() * 10) + 1;
  const team = projectTeams.filter(pt => pt.projectId === pId);
  if(team.length === 0) continue;
  const uId = team[Math.floor(Math.random() * team.length)].userId;
  const stat = statuses[Math.floor(Math.random() * statuses.length)];
  
  workPlans.push({
    id: i,
    userId: uId,
    projectId: pId,
    planNumber: `WP-2026-${String(i).padStart(3, '0')}`,
    planDate: `2026-0${Math.floor(Math.random() * 5) + 1}-15`,
    activities: `Pelaksanaan tugas fase ${Math.floor(Math.random() * 5) + 1} untuk instalasi modul utama.`,
    status: stat,
    createdAt: `2026-0${Math.floor(Math.random() * 5) + 1}-10T08:00:00`
  });

  if (stat === "approved") {
    workRealizations.push({
      id: i,
      userId: uId,
      projectId: pId,
      realizationNumber: `WR-2026-${String(i).padStart(3, '0')}`,
      realizationDate: `2026-0${Math.floor(Math.random() * 5) + 1}-20`,
      activities: `Tugas fase instalasi selesai dilaksanakan dengan hasil baik sesuai standard operasi.`,
      progress: Math.floor(Math.random() * 60) + 40,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: `2026-0${Math.floor(Math.random() * 5) + 1}-20T17:00:00`
    });
  }
}

// Generate 30 Leave Requests
for(let i=1; i<=30; i++) {
  const uId = Math.floor(Math.random() * 20) + 1;
  const typeId = Math.floor(Math.random() * 5) + 1;
  const stat = statuses[Math.floor(Math.random() * statuses.length)];
  
  leaveRequests.push({
    id: i,
    userId: uId,
    leaveTypeId: typeId,
    leaveNumber: `LV-2026-${String(i).padStart(3, '0')}`,
    startDate: `2026-0${Math.floor(Math.random() * 5) + 5}-01`,
    endDate: `2026-0${Math.floor(Math.random() * 5) + 5}-03`,
    totalDays: 3,
    reason: ["Acara keluarga", "Sakit demam", "Urusan pribadi", "Cuti tahunan", "Istirahat"][Math.floor(Math.random() * 5)],
    status: stat,
    approvedBy: stat === "approved" ? 1 : undefined,
    createdAt: `2026-0${Math.floor(Math.random() * 4) + 1}-15T10:00:00`
  });
}

// Generate 20 SPDs
for(let i=1; i<=20; i++) {
  const pId = Math.floor(Math.random() * 10) + 1;
  const team = projectTeams.filter(pt => pt.projectId === pId);
  const uId = team.length > 0 ? team[Math.floor(Math.random() * team.length)].userId : 1;
  const stat = statuses[Math.floor(Math.random() * statuses.length)];

  spds.push({
    id: i,
    userId: uId,
    projectId: pId,
    spdNumber: `SPD-2026-${String(i).padStart(3, '0')}`,
    destination: ["Semarang", "Balikpapan", "Denpasar", "Papua", "Sulawesi", "Jakarta"][Math.floor(Math.random() * 6)],
    purpose: "Supervisi dan koordinasi lapangan",
    departureDate: `2026-0${Math.floor(Math.random() * 4) + 5}-10`,
    returnDate: `2026-0${Math.floor(Math.random() * 4) + 5}-15`,
    totalCost: Math.floor(Math.random() * 10) * 1000000 + 1500000,
    status: stat,
    approvedBy: stat === "approved" ? 1 : undefined,
    createdAt: `2026-0${Math.floor(Math.random() * 4) + 1}-01T09:00:00`
  });
}

// Generate 15 Purchases
for(let i=1; i<=15; i++) {
  const pId = Math.floor(Math.random() * 10) + 1;
  const uId = Math.floor(Math.random() * 5) + 6; // Procurement staff
  const stat = statuses[Math.floor(Math.random() * statuses.length)];

  purchases.push({
    id: i,
    userId: uId,
    projectId: pId,
    purchaseNumber: `PO-2026-${String(i).padStart(3, '0')}`,
    items: [
      { name: ["Baja H-Beam", "Pipa Carbon", "Kabel Fiber", "Semen PC"][Math.floor(Math.random() * 4)], qty: 100, price: 3000000 },
      { name: "Material Support", qty: 50, price: 50000 }
    ],
    totalPrice: 302500000,
    description: "Pengadaan material tahap " + Math.floor(Math.random() * 3 + 1),
    status: stat,
    approvedBy: stat === "approved" ? 1 : undefined,
    createdAt: `2026-0${Math.floor(Math.random() * 4) + 1}-05T10:00:00`
  });
}

// Generate 15 Vendor Payments
for(let i=1; i<=15; i++) {
  const pId = Math.floor(Math.random() * 10) + 1;
  const vId = Math.floor(Math.random() * 5) + 1;
  const uId = 3; // Finance
  const stat = statuses[Math.floor(Math.random() * statuses.length)];

  vendorPayments.push({
    id: i,
    userId: uId,
    vendorId: vId,
    projectId: pId,
    paymentNumber: `VP-2026-${String(i).padStart(3, '0')}`,
    invoiceNumber: `INV-${String(i).padStart(4, '0')}`,
    amount: Math.floor(Math.random() * 500) * 1000000 + 50000000,
    paymentType: ["material", "service"][Math.floor(Math.random() * 2)],
    description: "Pembayaran tagihan vendor termin " + Math.floor(Math.random() * 3 + 1),
    status: stat,
    approvedBy: stat === "approved" ? 1 : undefined,
    createdAt: `2026-0${Math.floor(Math.random() * 4) + 1}-12T14:00:00`
  });
}

// Generate Payrolls for 2 months for everyone
let payrollIdCounter = 1;
users.forEach(u => {
  const bs = u.baseSalary || 8000000;
  const al = (u.allowanceMeal || 500000) + (u.allowanceTransport || 500000);
  const de = 500000; // default deduction

  payrolls.push({
    id: payrollIdCounter++,
    userId: u.id,
    period: "Mei 2026",
    baseSalary: bs,
    allowances: al,
    deductions: de,
    netSalary: bs + al - de,
    status: "paid",
    paymentDate: "2026-05-25T08:00:00Z"
  });

  payrolls.push({
    id: payrollIdCounter++,
    userId: u.id,
    period: "Juni 2026",
    baseSalary: bs,
    allowances: al,
    deductions: de,
    netSalary: bs + al - de,
    status: "draft"
  });
});

// Write to file
const dataContent = fs.readFileSync('src/lib/data.ts', 'utf8');
const topPart = dataContent.split('// SEED DATA')[0];

let output = topPart + '// SEED DATA\n// ============================================\n\n';
output += 'export const users: User[] = ' + JSON.stringify(users, null, 2) + ';\n\n';
output += 'export const projects: Project[] = ' + JSON.stringify(projects, null, 2) + ';\n\n';
output += 'export const leaveTypes: LeaveType[] = ' + JSON.stringify(leaveTypes, null, 2) + ';\n\n';
output += 'export const vendors: Vendor[] = ' + JSON.stringify(vendors, null, 2) + ';\n\n';
output += 'export const workPlans: WorkPlan[] = ' + JSON.stringify(workPlans, null, 2) + ';\n\n';
output += 'export const workRealizations: WorkRealization[] = ' + JSON.stringify(workRealizations, null, 2) + ';\n\n';
output += 'export const leaveRequests: LeaveRequest[] = ' + JSON.stringify(leaveRequests, null, 2) + ';\n\n';
output += 'export const spds: SPD[] = ' + JSON.stringify(spds, null, 2) + ';\n\n';
output += 'export const purchases: Purchase[] = ' + JSON.stringify(purchases, null, 2) + ';\n\n';
output += 'export const vendorPayments: VendorPayment[] = ' + JSON.stringify(vendorPayments, null, 2) + ';\n\n';

output += `
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

export const projectTeams: ProjectTeam[] = ${JSON.stringify(projectTeams, null, 2)};

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

export const payrolls: Payroll[] = ${JSON.stringify(payrolls, null, 2)};
`;

fs.writeFileSync('src/lib/data.ts', output);
console.log("Successfully seeded data.ts");
