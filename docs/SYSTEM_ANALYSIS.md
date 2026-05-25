# 📋 SYSTEM ANALYSIS DOCUMENT
## HRIS Next — Human Resource Integration System

**Document Version:** 1.0
**Date:** 2026-05-25
**Analyst:** Claude Code Assistant
**Status:** 🟡 In Development

---

## 1. EXECUTIVE SUMMARY

Dokumen ini memuat analisis system HRIS berbasis web yang dikembangkan menggunakan Next.js 16. Sistem ini dirancang untuk mengelola workflow operasional perusahaan termasuk manajemen karyawan, cuti, perjalanan dinas, pembelian, dan pembayaran vendor.

**Tech Stack:**
- Frontend: Next.js 16.2.2 (App Router)
- Styling: Tailwind CSS v4
- Authentication: NextAuth v5 (Beta)
- Database: Prisma ORM (JSON-based demo mode)
- Icons: Lucide React
- Font: Plus Jakarta Sans

---

## 2. CURRENT MODULES ANALYSIS

### 2.1 Module yang Sudah Ada ✅

| # | Modul | Halaman | Status | Keterangan |
|---|-------|---------|--------|------------|
| 1 | **Authentication** | `/login` | ✅ Complete | Login dengan credential + demo accounts |
| 2 | **Dashboard** | `/dashboard` | ✅ Complete | Overview stats, activity log, module status |
| 3 | **Manajemen User** | `/users` | ✅ Complete | CRUD user, role assignment, module permissions |
| 4 | **Rencana Kerja (EAR)** | `/work/plans` | ✅ Complete | Work plan submission & listing |
| 5 | **Realisasi Kerja** | `/work/realizations` | ✅ Complete | Work realization dengan progress tracking |
| 6 | **Daftar Cuti & Izin** | `/leave` | ✅ Complete | Approval workflow untuk cuti |
| 7 | **SPD (Perjalanan Dinas)** | `/spd` | ✅ Complete | Pengajuan perjalanan dinas |
| 8 | **Pembelian/Procurement** | `/purchase` | ✅ Complete | Purchase order management |
| 9 | **Pembayaran Vendor** | `/vendor` | ✅ Complete | Vendor payment tracking |
| 10 | **Approval Pembayaran** | `/finance` | ✅ Complete | Unified approval untuk SPD, Purchase, Vendor |
| 11 | **Project Management** | `/projects` | ✅ Complete | Project listing, team management |
| 12 | **EAR Report** | `/ear` | ✅ Complete | Executive report untuk rencana & realisasi |
| 13 | **Activity Log** | `/activity-log` | ✅ Complete | Audit trail untuk semua transaksi |
| 14 | **Dokumentasi** | `/documentation` | ✅ Complete | Sistem panduan pengguna |

---

### 2.2 Module yang Dibutuhkan tapi Belum Ada ❌

| # | Modul | Prioritas | Estimation | Keterangan |
|---|-------|-----------|------------|------------|
| 1 | **Attendance/Kehadiran** | 🔴 HIGH | Medium | Clock in/out, absensi harian |
| 2 | **Payroll/Gaji** | 🔴 HIGH | Large | Slip gaji, komponen tunjangan |
| 3 | **Employee Directory** | 🟠 MEDIUM | Small | Database karyawan lengkap |
| 4 | **Organizational Chart** | 🟠 MEDIUM | Small | Struktur organisasi visual |
| 5 | **Performance Appraisal** | 🟠 MEDIUM | Large | Evaluasi kinerja berkala |
| 6 | **Announcement/Pengumuman** | 🟡 LOW | Small | Notifikasi internal |
| 7 | **Settings/Config System** | 🟡 LOW | Small | Konfigurasi global sistem |
| 8 | **Reports/Report Builder** | 🟡 LOW | Large | Laporan customizable |
| 9 | **Asset Management** | 🟡 LOW | Medium | Inventaris aset perusahaan |
| 10 | **Training Management** | 🟢 NICE-TO-HAVE | Large | Pelaporan pelatihan karyawan |

---

## 3. FUNCTIONAL REQUIREMENTS ANALYSIS

### 3.1 Core HR Functions (RFC - Required for Complete HRIS)

```
┌─────────────────────────────────────────────────────────────────┐
│                    HRIS CORE FUNCTIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. EMPLOYEE MANAGEMENT                                         │
│     ├── 👤 Personal Info (Name, DOB, Address, Contact)        │
│     ├── 💼 Employment Info (Position, Department, Join Date)   │
│     ├── 🎓 Education & Skills                                   │
│     ├── 📄 Document Attachments (CV, Contract, Certificate)     │
│     └── 📱 Emergency Contact                                    │
│                                                                  │
│  2. ATTENDANCE & TIME MANAGEMENT                                │
│     ├── ⏰ Clock In/Out (Manual & Auto)                         │
│     ├── 📅 Leave Management (Annual, Sick, Unpaid)              │
│     ├── 🌴 Leave Balance Tracking                               │
│     ├── ⏱️ Overtime Management                                   │
│     └── 📊 Attendance Report                                    │
│                                                                  │
│  3. PAYROLL                                                    │
│     ├── 💰 Salary Components (Basic, Allowance, Deduction)     │
│     ├── 📋 Payslip Generation                                   │
│     ├── 🏦 Bank Account Integration                             │
│     ├── 💳 Reimbursement                                       │
│     └── 📑 Tax Calculation (PPh 21)                           │
│                                                                  │
│  4. PERFORMANCE MANAGEMENT                                      │
│     ├── 📈 KPI Setup                                            │
│     ├── 📝 Appraisal Cycle                                     │
│     ├── 🎯 Goal Setting & Tracking                              │
│     └── 📊 Performance Report                                   │
│                                                                  │
│  5. RECRUITMENT (Optional for MVP)                              │
│     ├── 📢 Job Posting                                          │
│     ├── 📥 Application Tracking                                 │
│     └── ✅ Interview Scheduling                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Current Data Entities vs Required Entities

**Current Entities:**
```typescript
- User          ✅ - EmployeeId, Email, Role, Department, Modules
- Project       ✅ - Name, Code, Status, Budget, Manager
- WorkPlan      ✅ - PlanNumber, Date, Activities, Status
- WorkRealization ✅ - RealizationNumber, Date, Progress, Status
- LeaveRequest  ✅ - LeaveType, Date Range, Reason, Status, ApprovedBy
- SPD           ✅ - Destination, Purpose, Dates, Cost, Status
- Purchase      ✅ - Items, TotalPrice, Description, Status
- VendorPayment ✅ - VendorId, InvoiceNumber, Amount, Status
- Vendor        ✅ - Name, Company, Contact, Email, Phone
```

**Missing Entities (Required):**
```typescript
- Attendance    ❌ - clockIn, clockOut, date, workHours
- Payroll       ❌ - salary, allowances, deductions, netSalary
- Payslip       ❌ - period, employeeId, components
- Appraisal     ❌ - period, employeeId, score, notes
- Announcement  ❌ - title, content, date, targetAudience
- Asset         ❌ - name, category, assignedTo, purchaseDate
- Department    ❌ - name, head, parentDepartment
- Position     ❌ - name, level, department, minSalary
- LeaveBalance ❌ - employeeId, leaveType, remainingDays, year
```

---

## 4. GAP ANALYSIS

### 4.1 Critical Gaps (Blocking Full HRIS Usage)

| Gap | Impact | Mitigation |
|-----|--------|-----------|
| No Attendance System | Tidak bisa tracking kehadiran employee | Perlu implementasi clock in/out |
| No Payroll System | Core HR function tidak ada | Perlu design payslip & calculation |
| Leave Balance Not Tracked | Cuti bisa melebihi quota | Perlu tracking balance per employee |
| No Employee Profile Page | Tidak ada detail profile karyawan | Perlu halaman profile lengkap |
| Data Reset on Refresh | Demo mode - semua data hilang | Perlu integration dengan database |

### 4.2 Functional Gaps (Enhancement Needed)

| Gap | Current State | Ideal State |
|-----|--------------|-------------|
| Role-Based Access | 2 role (admin/user) | Multiple roles dengan granular permissions |
| Notification System | Static badge | Real-time notification dengan push |
| Approval Workflow | Single level approval | Multi-level approval (atasan 1, 2, dll) |
| Audit Trail | Activity log ada | Immutable audit dengan versioning |
| Document Storage | No attachment support | Upload/download dokumen |
| Email Notification | No email integration | Notification via email |
| Mobile Responsiveness | Partial | Full mobile support |
| Export/Import | CSV export di Projects | Full data export (PDF, Excel) |

---

## 5. RECOMMENDED IMPLEMENTATION ROADMAP

### Phase 1: Core Stabilization (Current → 2 weeks)
```
✅ DONE  - Authentication System
✅ DONE  - User Management
✅ DONE  - Basic Leave Management
✅ DONE  - Basic Finance Approval
🔄 NOW   - Fix bugs and UI improvements
📋 TODO  - Database integration (Prisma setup)
```

### Phase 2: Attendance Module (2-3 weeks)
```
📋 MODULE: Attendance & Time Management

Features:
├── ⏰ Clock In/Out System
│   ├── Manual clock with geolocation (optional)
│   ├── Automatic time capture
│   └── Missed clock notification
├── 📅 Leave Balance Tracking
│   ├── Automatic balance calculation
│   ├── Leave quota per type
│   └── Carry forward calculation
└── 📊 Attendance Report
    ├── Monthly summary
    └── Export to Excel/PDF
```

### Phase 3: Payroll Module (3-4 weeks)
```
📋 MODULE: Payroll Management

Features:
├── 💰 Salary Setup
│   ├── Component configuration (basic, allowance, deduction)
│   ├── Pay grade structure
│   └── Tax bracket configuration
├── 📋 Payslip Generation
│   ├── Monthly payslip auto-generation
│   ├── PDF export
│   └── Email payslip (optional)
└── 🏦 Payment Integration
    ├── Bank transfer file generation
    └── Payment status tracking
```

### Phase 4: Employee Self-Service (2 weeks)
```
📋 MODULE: Employee Portal

Features:
├── 👤 My Profile
│   ├── View/Edit personal info
│   ├── Upload documents
│   └── Emergency contact update
├── 📅 My Leave
│   ├── Submit leave request
│   ├── View leave balance
│   └── Track approval status
├── ⏰ My Attendance
│   ├── View attendance history
│   └── View timesheet
└── 💰 My Payslip
    └── View/download payslip history
```

---

## 6. TECHNICAL RECOMMENDATIONS

### 6.1 Database Schema (Prisma)

```prisma
// Priority entities to add
model Attendance {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime
  clockIn   DateTime?
  clockOut  DateTime?
  workHours Float?
  status    AttendanceStatus
  notes     String?
  user      User     @relation(fields: [userId], references: [id])
}

model LeaveBalance {
  id         String   @id @default(cuid())
  userId     String
  leaveType  LeaveType
  year       Int
  totalDays  Int
  usedDays   Int      @default(0)
  remaining  Int
  user       User     @relation(fields: [userId], references: [id])
}

model Payroll {
  id          String   @id @default(cuid())
  userId      String
  period      String   // YYYY-MM
  basicSalary Float
  allowances  Float
  deductions  Float
  netSalary   Float
  status      PayrollStatus
  user        User     @relation(fields: [userId], references: [id])
}

model Department {
  id          String   @id @default(cuid())
  name        String
  code        String   @unique
  headId      String?
  parentId    String?
  employees   User[]   @relation("DepartmentEmployees")
}

model Announcement {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  createdAt DateTime @default(now())
  expiresAt DateTime?
  target    String    // all, department-specific, user-specific
}
```

### 6.2 API Structure Recommendation

```
API Endpoints yang Perlu Ditambahkan:

📁 /api/attendance
├── GET    /api/attendance         - Get attendance list
├── POST   /api/attendance/clockin - Clock in
├── POST   /api/attendance/clockout - Clock out
└── GET    /api/attendance/report  - Get attendance report

📁 /api/leave
├── GET    /api/leave/balance      - Get leave balance
├── POST   /api/leave/apply        - Apply for leave
└── GET    /api/leave/history      - Get leave history

📁 /api/payroll
├── GET    /api/payroll            - Get payroll list
├── POST   /api/payroll/generate   - Generate payroll
└── GET    /api/payroll/payslip/:id - Get payslip detail

📁 /api/employees
├── GET    /api/employees          - Get employee list
├── GET    /api/employees/:id      - Get employee detail
├── PUT    /api/employees/:id      - Update employee
└── GET    /api/employees/:id/profile - Get profile
```

---

## 7. CONCLUSION

### Current State: 65% Complete ✅

**Strengths:**
- Authentication & Authorization solid
- Modular architecture dengan role-based access
- Clean UI dengan Tailwind CSS
- Good component reusability

**Weaknesses:**
- No attendance & payroll (core HR functions)
- Demo data only (no persistence)
- Limited role granularity
- No employee self-service portal

### Recommended Priority:

1. 🔴 **CRITICAL** - Database integration (Prisma setup)
2. 🔴 **CRITICAL** - Attendance module
3. 🔴 **CRITICAL** - Leave balance tracking
4. 🟠 **HIGH** - Employee profile page
5. 🟠 **HIGH** - Payroll module
6. 🟡 **MEDIUM** - Enhanced approval workflow
7. 🟡 **MEDIUM** - Document management
8. 🟢 **LOW** - Reports & analytics

---

## 8. NEXT STEPS

### Immediate Actions (This Week):
1. ✅ Setup Prisma dengan PostgreSQL/MySQL
2. ✅ Migrate JSON data ke database
3. ✅ Implement basic attendance system

### Short Term (2-4 weeks):
1. 📋 Complete attendance module
2. 📋 Add leave balance tracking
3. 📋 Create employee profile page

### Long Term (1-2 months):
1. 📋 Implement payroll module
2. 📋 Build employee self-service portal
3. 📋 Add advanced reporting

---

**Document Prepared By:** Claude Code Assistant
**Last Updated:** 2026-05-25
**Next Review:** After Phase 1 completion