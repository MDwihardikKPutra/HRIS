const fs = require('fs');

// ─── MASTER DATA ─────────────────────────────────────────────────────────────

const users = [
  { id: 1,  name: "Rina Wijaya",    email: "admin@hris.local",  password: "password", role: "admin",           employeeId: "ADM001", department: "IT",                 position: "System Administrator",  isActive: true, baseSalary: 20000000, allowanceMeal: 1000000, allowanceTransport: 1500000 },
  { id: 2,  name: "Dewi Lestari",   email: "hr@hris.local",     password: "password", role: "hr",              employeeId: "HR001",  department: "Human Resource",     position: "HR Manager",            isActive: true, baseSalary: 15000000, allowanceMeal: 1000000, allowanceTransport: 1000000 },
  { id: 3,  name: "Ahmad Hidayat",  email: "finance@hris.local",password: "password", role: "finance",         employeeId: "FIN001", department: "Finance",            position: "Finance Manager",       isActive: true, baseSalary: 16000000, allowanceMeal: 1000000, allowanceTransport: 1000000 },
  { id: 4,  name: "Dimas Anggara",  email: "pm@hris.local",     password: "password", role: "project_manager", employeeId: "PM001",  department: "Project Management", position: "Senior Project Manager",isActive: true, baseSalary: 18000000, allowanceMeal: 1000000, allowanceTransport: 2000000 },
  { id: 5,  name: "Budi Santoso",   email: "budi@hris.local",   password: "password", role: "karyawan",        employeeId: "EMP001", department: "Engineering",        position: "Project Engineer",      isActive: true, baseSalary: 10000000, allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 6,  name: "Siti Nurhaliza", email: "siti@hris.local",   password: "password", role: "karyawan",        employeeId: "EMP002", department: "Engineering",        position: "Senior Engineer",       isActive: true, baseSalary: 12000000, allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 7,  name: "Andi Pratama",   email: "andi@hris.local",   password: "password", role: "karyawan",        employeeId: "EMP003", department: "Engineering",        position: "Engineer",              isActive: true, baseSalary: 9000000,  allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 8,  name: "Rizki Pratama",  email: "rizki@hris.local",  password: "password", role: "karyawan",        employeeId: "EMP004", department: "Procurement",        position: "Procurement Officer",   isActive: true, baseSalary: 8000000,  allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 9,  name: "Mega Sari",      email: "mega@hris.local",   password: "password", role: "karyawan",        employeeId: "EMP005", department: "Finance",            position: "Accountant",            isActive: true, baseSalary: 8500000,  allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 10, name: "Fajar Nugroho",  email: "fajar@hris.local",  password: "password", role: "karyawan",        employeeId: "EMP006", department: "Engineering",        position: "Site Supervisor",       isActive: true, baseSalary: 11000000, allowanceMeal: 700000,  allowanceTransport: 800000  },
  { id: 11, name: "Nadia Utami",    email: "nadia@hris.local",  password: "password", role: "karyawan",        employeeId: "EMP007", department: "Engineering",        position: "Junior Engineer",       isActive: true, baseSalary: 7000000,  allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 12, name: "Hendra Wijaya",  email: "hendra@hris.local", password: "password", role: "karyawan",        employeeId: "EMP008", department: "Procurement",        position: "Procurement Staff",     isActive: true, baseSalary: 6500000,  allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 13, name: "Lisa Permata",   email: "lisa@hris.local",   password: "password", role: "karyawan",        employeeId: "EMP009", department: "Human Resource",     position: "HR Staff",              isActive: true, baseSalary: 7000000,  allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 14, name: "Bayu Setiawan",  email: "bayu@hris.local",   password: "password", role: "karyawan",        employeeId: "EMP010", department: "Engineering",        position: "Field Engineer",        isActive: true, baseSalary: 9500000,  allowanceMeal: 600000,  allowanceTransport: 700000  },
  { id: 15, name: "Toko Sinar",     email: "toko@hris.local",   password: "password", role: "finance",         employeeId: "FIN002", department: "Finance",            position: "Finance Staff",         isActive: true, baseSalary: 7000000,  allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 16, name: "Gita Wiryawan",  email: "pm2@hris.local",    password: "password", role: "project_manager", employeeId: "PM002",  department: "Project Management", position: "Project Manager",       isActive: true, baseSalary: 16000000, allowanceMeal: 1000000, allowanceTransport: 1500000 },
  { id: 17, name: "Cahyo Kumolo",   email: "cahyo@hris.local",  password: "password", role: "karyawan",        employeeId: "EMP011", department: "IT",                 position: "IT Support",            isActive: true, baseSalary: 7500000,  allowanceMeal: 500000,  allowanceTransport: 500000  },
  { id: 18, name: "Dina Mariana",   email: "dina@hris.local",   password: "password", role: "karyawan",        employeeId: "EMP012", department: "Legal",              position: "Legal Counsel",         isActive: true, baseSalary: 13000000, allowanceMeal: 800000,  allowanceTransport: 1000000 },
  { id: 19, name: "Eko Patrio",     email: "eko@hris.local",    password: "password", role: "karyawan",        employeeId: "EMP013", department: "Marketing",          position: "Marketing Specialist",  isActive: true, baseSalary: 8500000,  allowanceMeal: 500000,  allowanceTransport: 700000  },
  { id: 20, name: "Farah Quinn",    email: "farah@hris.local",  password: "password", role: "karyawan",        employeeId: "EMP014", department: "Engineering",        position: "Architect",             isActive: true, baseSalary: 14000000, allowanceMeal: 800000,  allowanceTransport: 1000000 },
];

const projects = [
  { id: 1,  name: "PLTU Jawa Tengah",               code: "PRJ-001", status: "active",    budget: 5000000000,  managerId: 4,  description: "Pembangunan PLTU berkapasitas 660 MW di Jawa Tengah" },
  { id: 2,  name: "Pipeline Kalimantan",             code: "PRJ-002", status: "active",    budget: 3200000000,  managerId: 4,  description: "Pemasangan pipa gas 24 inci sepanjang 80 km di Kalimantan" },
  { id: 3,  name: "Refinery Upgrade Cilacap",        code: "PRJ-003", status: "on_hold",   budget: 8000000000,  managerId: 16, description: "Upgrade kapasitas refinery Cilacap dari 270k ke 370k BOPD" },
  { id: 4,  name: "Solar Panel Installation Bali",   code: "PRJ-004", status: "active",    budget: 1500000000,  managerId: 16, description: "Instalasi 5 MWp panel surya di resort dan hotel Bali" },
  { id: 5,  name: "Wind Farm Sulawesi",              code: "PRJ-005", status: "completed", budget: 6000000000,  managerId: 4,  description: "Pembangunan wind farm 75 MW di Sulawesi Selatan" },
  { id: 6,  name: "Geothermal Power Plant Sumut",    code: "PRJ-006", status: "active",    budget: 12000000000, managerId: 16, description: "Pengembangan PLTP 110 MW di Sumatera Utara" },
  { id: 7,  name: "Dam Construction Papua",          code: "PRJ-007", status: "active",    budget: 9500000000,  managerId: 4,  description: "Konstruksi bendungan multifungsi berkapasitas 180 juta m3 di Papua" },
  { id: 8,  name: "Smart Grid Jakarta",              code: "PRJ-008", status: "active",    budget: 4000000000,  managerId: 16, description: "Implementasi Smart Grid 1000 titik di wilayah Jakarta Raya" },
  { id: 9,  name: "Offshore Platform Maintenance",   code: "PRJ-009", status: "on_hold",   budget: 7500000000,  managerId: 4,  description: "Maintenance besar platform lepas pantai wilayah Natuna" },
  { id: 10, name: "EV Charging Stations Trans Jawa", code: "PRJ-010", status: "completed", budget: 2000000000,  managerId: 16, description: "Instalasi 200 unit SPKLU di 40 rest area Tol Trans Jawa" },
];

const leaveTypes = [
  { id: 1, name: "Cuti Tahunan",   maxDays: 12 },
  { id: 2, name: "Cuti Sakit",     maxDays: 30 },
  { id: 3, name: "Cuti Melahirkan",maxDays: 90 },
  { id: 4, name: "Izin Pribadi",   maxDays: 3  },
  { id: 5, name: "Cuti Besar",     maxDays: 30 },
];

const vendors = [
  { id: 1, name: "PT Baja Utama",     company: "PT Baja Utama Indonesia",        contactPerson: "Hendra Gunawan",  email: "hendra@bajautama.co.id",    phone: "021-5551234" },
  { id: 2, name: "CV Mitra Teknik",   company: "CV Mitra Teknik Sejahtera",      contactPerson: "Agus Salim",      email: "agus@mitrateknik.com",      phone: "021-5555678" },
  { id: 3, name: "PT Elektrik Prima", company: "PT Elektrik Prima Nusantara",    contactPerson: "Rina Kusuma",     email: "rina@elektrikprima.co.id",  phone: "021-5559012" },
  { id: 4, name: "PT Beton Kuat",     company: "PT Beton Kuat Persada",          contactPerson: "Bambang Sutejo",  email: "bambang@betonkuat.com",     phone: "021-5553333" },
  { id: 5, name: "PT Kabel Indo",     company: "PT Kabel Nusantara Indo",        contactPerson: "Siska Dewi",      email: "siska@kabelindo.com",       phone: "021-5554444" },
];

// ─── PROJECT TEAMS ────────────────────────────────────────────────────────────
// Fixed, deterministic teams per project
const projectTeamMap = {
  1:  [4, 5, 6, 10, 20],
  2:  [4, 5, 20, 14],
  3:  [16, 7, 11, 18],
  4:  [16, 7, 14, 17],
  5:  [4, 5, 6, 10],
  6:  [16, 6, 11, 19],
  7:  [4, 20, 5, 10],
  8:  [16, 7, 17, 9],
  9:  [4, 6, 8],
  10: [16, 12, 8, 9],
};

const projectTeams = [];
let ptId = 1;
Object.entries(projectTeamMap).forEach(([pId, uIds]) => {
  uIds.forEach(uId => {
    const u = users.find(u => u.id === uId);
    projectTeams.push({ id: ptId++, projectId: Number(pId), userId: uId, role: u.role === 'project_manager' ? 'Project Manager' : u.position });
  });
});

// ─── ACTIVITY TEMPLATES ────────────────────────────────────────────────────────
const planActivities = [
  "Melaksanakan survei topografi dan pemetaan jalur instalasi",
  "Mempersiapkan material dan peralatan kerja di lokasi",
  "Melakukan fabrikasi komponen struktural sesuai gambar desain",
  "Mengkoordinasikan tim lapangan untuk pengerjaan pondasi",
  "Melaksanakan pengujian kualitas material sebelum pemasangan",
  "Membuat laporan progres mingguan dan dokumentasi foto",
  "Melakukan kalibrasi peralatan ukur di laboratorium",
  "Berkoordinasi dengan vendor untuk pengiriman material",
  "Melaksanakan safety briefing dan inspeksi K3 harian",
  "Menyelesaikan pekerjaan finishing dan pembersihan area",
  "Melakukan commissioning awal sistem mekanikal",
  "Mengurus dokumen izin kerja (Work Permit) di lokasi",
  "Melaksanakan pelatihan teknis untuk operator lokal",
  "Memverifikasi hasil pengerjaan dengan as-built drawing",
  "Melakukan koordinasi dengan instansi pemerintah setempat",
];

const realizationActivities = [
  ["Survei topografi selesai. Peta jalur sudah divalidasi tim GIS dan disetujui kepala teknik.", 88],
  ["Material lengkap tiba di lokasi. Seluruh item sudah diinspeksi dan dicatat di inventory log.", 100],
  ["Fabrikasi 24 modul struktural selesai. QC test lulus standar ASTM A36 semua item.", 95],
  ["Pengerjaan pondasi 8 titik selesai. Uji sondir menunjukkan daya dukung tanah memenuhi syarat.", 90],
  ["Uji kualitas 150 sampel material dilakukan. 148 lulus, 2 dikembalikan ke vendor.", 85],
  ["Laporan progres W-23 sudah diserahkan. Dokumentasi 180 foto lapangan terlampir.", 100],
  ["Kalibrasi 12 unit alat ukur selesai. Sertifikat kalibrasi berlaku hingga Desember 2026.", 100],
  ["Koordinasi vendor PT Baja Utama. Jadwal pengiriman batch 2 dikonfirmasi 15 Juni.", 75],
  ["Safety briefing 32 personel lapangan. Tidak ada insiden K3 selama periode laporan.", 100],
  ["Pekerjaan finishing zona C selesai. Area sudah dibersihkan dan diserahkan ke owner.", 92],
  ["Commissioning awal pompa sirkulasi berhasil. Flow rate 250 m3/h, dalam batas desain.", 87],
  ["6 Work Permit sudah diterbitkan. Semua pekerjaan panas sudah dilengkapi fire watch.", 100],
  ["Pelatihan operator dilakukan untuk 15 personel lokal. Modul teknis sudah didistribusikan.", 82],
  ["Verifikasi as-built drawing zona A selesai. 3 minor deviation sudah didokumentasikan.", 78],
  ["Koordinasi dengan Dinas PUPR setempat. Izin utilitas sudah diperpanjang 6 bulan.", 70],
];

const rejectedFeedback = [
  "Dokumentasi tidak lengkap. Mohon lampirkan foto before-after dan laporan QC.",
  "Progress tidak sesuai target. Jelaskan hambatan yang terjadi dan rencana percepatan.",
  "Laporan mengacu pada standar lama. Gunakan form revisi terbaru yang sudah dikirimkan.",
  "Data pengujian tidak terlampir. Wajib sertakan hasil uji laboratorium bersertifikat.",
  "Jumlah personel yang dilaporkan tidak sesuai absensi harian. Harap diklarifikasi.",
];

const extendedFeedback = [
  "Pekerjaan perlu dilanjutkan. Sertakan jadwal penyelesaian yang realistis.",
  "Beberapa poin belum selesai. Selesaikan item B3, C1, dan D2 sebelum laporan final.",
  "Hasil pengujian belum memenuhi standar minimal. Lakukan pengulangan dengan witnessing.",
  "Koordinasi dengan pihak ketiga masih berlangsung. Update status setiap Senin.",
  "Menunggu material pengganti dari vendor. Estimasi tiba 2 minggu, lanjutkan setelah itu.",
];

const approvedFeedback = [
  "Pekerjaan sangat baik. Pertahankan kualitas ini di periode berikutnya.",
  "Laporan lengkap dan rapi. Dokumentasi sangat membantu monitoring lapangan.",
  "Selesai sesuai jadwal dan standar. Bagus!",
  null, null, null, // sometimes no feedback
];

const leaveReasons = [
  "Acara pernikahan anggota keluarga",
  "Sakit dan perlu istirahat berdasarkan surat dokter",
  "Urusan administrasi keluarga di kampung halaman",
  "Cuti tahunan rutin",
  "Mendampingi orang tua yang sakit di rumah sakit",
  "Mengurus keperluan kelahiran anak",
  "Kunjungan keluarga yang sudah lama direncanakan",
  "Pemulihan setelah operasi minor",
];

const spdPurposes = [
  "Supervisi dan koordinasi pekerjaan lapangan",
  "Inspeksi kualitas material di gudang vendor",
  "Menghadiri rapat koordinasi dengan owner",
  "Kunjungan teknis dan pengambilan data",
  "Audit keselamatan kerja (K3) di site",
  "Serah terima pekerjaan dengan subkontraktor",
  "Kalibrasi dan pengujian peralatan di site",
];

const destinations = ["Semarang", "Balikpapan", "Denpasar", "Jayapura", "Makassar", "Jakarta", "Batam", "Surabaya", "Palembang", "Medan"];

const purchaseItems = [
  [{ name: "Baja H-Beam 200x200", qty: 50, price: 4500000 }, { name: "Baut Galvanis M24", qty: 200, price: 45000 }],
  [{ name: "Pipa Carbon Steel 8 inci", qty: 100, price: 2800000 }, { name: "Fitting Elbow 90°", qty: 40, price: 350000 }],
  [{ name: "Kabel XLPE 150mm2", qty: 500, price: 320000 }, { name: "Conduit PVC 4 inci", qty: 200, price: 85000 }],
  [{ name: "Semen Portland PC", qty: 1000, price: 75000 }, { name: "Besi Tulangan D19", qty: 5000, price: 18500 }],
  [{ name: "Pompa Sentrifugal 100 kW", qty: 2, price: 85000000 }, { name: "Coupling Fleksibel", qty: 4, price: 2500000 }],
  [{ name: "Panel MDB 400A", qty: 3, price: 25000000 }, { name: "MCB 3 Fase 200A", qty: 12, price: 1800000 }],
  [{ name: "Cat Epoxy Minyak", qty: 200, price: 450000 }, { name: "Thinner Industri", qty: 50, price: 120000 }],
];

const paymentDescs = [
  "Pembayaran termin 1 sesuai progress pekerjaan 30%",
  "Pembayaran termin 2 sesuai progress pekerjaan 60%",
  "Pembayaran termin 3 (final) selesainya pekerjaan 100%",
  "Pembayaran down payment kontrak baru",
  "Pelunasan tagihan bulan April 2026",
  "Pembayaran material batch 2 sesuai PO",
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad = (n, len = 3) => String(n).padStart(len, '0');
const dateStr = (y, m, d) => `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const months = [1,2,3,4,5,6];

// ─── GENERATE DATA ────────────────────────────────────────────────────────────

const workPlans = [];
const workRealizations = [];
let wpId = 1, wrId = 1;

// For every project, for every team member, generate 3-5 workplans
Object.entries(projectTeamMap).forEach(([pIdStr, uIds]) => {
  const pId = Number(pIdStr);
  uIds.forEach(uId => {
    const u = users.find(u => u.id === uId);
    if (!['karyawan','project_manager'].includes(u.role)) return; // karyawan & PM submit work plans

    const count = rndInt(3, 5);
    for (let i = 0; i < count; i++) {
      const month = pick(months);
      const day = rndInt(1, 25);
      const planDate = dateStr(2026, month, day);
      const status = pick(['approved','approved','pending','approved','rejected']);
      const activity = pick(planActivities);

      workPlans.push({
        id: wpId,
        userId: uId,
        projectId: pId,
        planNumber: `WP-2026-${pad(wpId)}`,
        planDate,
        activities: activity,
        status,
        createdAt: `${planDate}T08:00:00`,
      });
      wpId++;
    }
  });
});

// Add workplans & realizations for admin, hr, finance, and project_manager roles too
users.filter(u => ['admin','hr','finance'].includes(u.role)).forEach(u => {
  const count = rndInt(3, 5);
  const pId = pick([1, 2, 3, 4, 5]); // use first few projects
  for (let i = 0; i < count; i++) {
    const month = pick(months);
    const day = rndInt(1, 25);
    const planDate = dateStr(2026, month, day);
    const status = pick(['approved','approved','pending','approved','rejected']);
    const activity = pick(planActivities);
    workPlans.push({
      id: wpId,
      userId: u.id,
      projectId: pId,
      planNumber: `WP-2026-${pad(wpId)}`,
      planDate,
      activities: activity,
      status,
      createdAt: `${planDate}T08:00:00`,
    });
    if (status === 'approved') {
      const realMonth = rndInt(month, 6);
      const realDay = rndInt(1, 25);
      const realDate = dateStr(2026, realMonth, realDay);
      const actIdx = rndInt(0, realizationActivities.length - 1);
      const [actText, progress] = realizationActivities[actIdx];
      const wrStatus = pick(['approved','approved','pending','pending','rejected','extended']);
      const wr = {
        id: wrId++,
        userId: u.id,
        projectId: pId,
        realizationNumber: `WR-2026-${pad(wrId - 1)}`,
        realizationDate: realDate,
        activities: actText,
        progress,
        status: wrStatus,
        createdAt: `${realDate}T17:00:00`,
      };
      if (wrStatus === 'approved') { const fb = pick(approvedFeedback); if (fb) wr.feedback = fb; }
      else if (wrStatus === 'rejected') wr.feedback = pick(rejectedFeedback);
      else if (wrStatus === 'extended') { wr.feedback = pick(extendedFeedback); wr.extendedUntil = dateStr(2026, Math.min(realMonth+1,12), rndInt(10,28)); }
      workRealizations.push(wr);
    }
    wpId++;
  }
});

workPlans.filter(wp => wp.status === 'approved').forEach(wp => {
  const month = rndInt(wp.planDate.slice(5,7)|0, 6);
  const day = rndInt(1, 25);
  const realDate = dateStr(2026, month, day);
  const actIdx = rndInt(0, realizationActivities.length - 1);
  const [actText, progress] = realizationActivities[actIdx];
  const wrStatus = pick(['approved','approved','pending','pending','rejected','extended']);

  const wr = {
    id: wrId++,
    userId: wp.userId,
    projectId: wp.projectId,
    realizationNumber: `WR-2026-${pad(wrId - 1)}`,
    realizationDate: realDate,
    activities: actText,
    progress,
    status: wrStatus,
    createdAt: `${realDate}T17:00:00`,
  };

  if (wrStatus === 'approved') {
    const fb = pick(approvedFeedback);
    if (fb) wr.feedback = fb;
  } else if (wrStatus === 'rejected') {
    wr.feedback = pick(rejectedFeedback);
  } else if (wrStatus === 'extended') {
    wr.feedback = pick(extendedFeedback);
    const extMonth = Math.min(month + 1, 12);
    wr.extendedUntil = dateStr(2026, extMonth, rndInt(10, 28));
  }

  workRealizations.push(wr);
});

// Add some extra pending realizations per project so kanban is never empty
Object.entries(projectTeamMap).forEach(([pIdStr, uIds]) => {
  const pId = Number(pIdStr);
  const karyawanIds = uIds.filter(id => users.find(u => u.id === id)?.role === 'karyawan');
  karyawanIds.forEach(uId => {
    const month = rndInt(5, 6);
    const day = rndInt(1, 28);
    const realDate = dateStr(2026, month, day);
    const [actText, progress] = pick(realizationActivities);
    workRealizations.push({
      id: wrId++,
      userId: uId,
      projectId: pId,
      realizationNumber: `WR-2026-${pad(wrId - 1)}`,
      realizationDate: realDate,
      activities: actText,
      progress,
      status: 'pending',
      createdAt: `${realDate}T09:00:00`,
    });
  });
});

// ─── LEAVE REQUESTS ──────────────────────────────────────────────────────────
const leaveRequests = [];
let lvId = 1;
users.forEach(u => {
  const count = u.role === 'karyawan' ? rndInt(2, 4) : rndInt(1, 2);
  for (let i = 0; i < count; i++) {
    const month = rndInt(1, 6);
    const startDay = rndInt(1, 25);
    const days = rndInt(1, 4);
    const endDay = Math.min(startDay + days - 1, 28);
    const typeId = rndInt(1, 5);
    const status = pick(['approved','approved','pending','rejected','approved']);
    leaveRequests.push({
      id: lvId++,
      userId: u.id,
      leaveTypeId: typeId,
      leaveNumber: `LV-2026-${pad(lvId - 1)}`,
      startDate: dateStr(2026, month, startDay),
      endDate: dateStr(2026, month, endDay),
      totalDays: days,
      reason: pick(leaveReasons),
      status,
      ...(status === 'approved' ? { approvedBy: 2 } : {}),
      createdAt: dateStr(2026, Math.max(1, month - 1), rndInt(1, 25)) + 'T10:00:00',
    });
  }
});

// ─── SPDs ─────────────────────────────────────────────────────────────────────
const spds = [];
let spdId = 1;

// All users get SPDs
users.forEach(u => {
  const count = rndInt(2, 4);
  for (let i = 0; i < count; i++) {
    const pId = pick([1,2,5,7,9].includes(u.id) ? [1,2,7] : [3,4,6,8]);
    const month = rndInt(1, 6);
    const startDay = rndInt(1, 20);
    const dur = rndInt(2, 5);
    const status = pick(['approved','approved','pending','rejected','approved']);
    spds.push({
      id: spdId++,
      userId: u.id,
      projectId: rndInt(1, 10),
      spdNumber: `SPD-2026-${pad(spdId - 1)}`,
      destination: pick(destinations),
      purpose: pick(spdPurposes),
      departureDate: dateStr(2026, month, startDay),
      returnDate: dateStr(2026, month, Math.min(startDay + dur, 28)),
      totalCost: rndInt(2, 15) * 1000000,
      status,
      ...(status === 'approved' ? { approvedBy: 2 } : {}),
      createdAt: dateStr(2026, Math.max(1, month - 1), rndInt(1, 20)) + 'T09:00:00',
    });
  }
});

// ─── PURCHASES ───────────────────────────────────────────────────────────────
const purchases = [];
let poId = 1;

// All users submit purchases (realistic breadth)
users.forEach(u => {
  const count = rndInt(2, 3);
  for (let i = 0; i < count; i++) {
    const items = pick(purchaseItems);
    const totalPrice = items.reduce((s, it) => s + it.qty * it.price, 0);
    const month = rndInt(1, 5);
    const status = pick(['approved','approved','pending','rejected','approved']);
    purchases.push({
      id: poId++,
      userId: u.id,
      projectId: rndInt(1, 10),
      purchaseNumber: `PO-2026-${pad(poId - 1)}`,
      items,
      totalPrice,
      description: `Pengadaan material tahap ${rndInt(1,3)} – ${items[0].name}`,
      status,
      ...(status === 'approved' ? { approvedBy: 3 } : {}),
      createdAt: dateStr(2026, month, rndInt(1, 25)) + 'T10:00:00',
    });
  }
});

// ─── VENDOR PAYMENTS ─────────────────────────────────────────────────────────
const vendorPayments = [];
let vpId = 1;
[3, 15].forEach(finUserId => { // Finance Manager & Finance Staff
  for (let i = 0; i < 8; i++) {
    const month = rndInt(1, 6);
    const status = pick(['approved','approved','pending','rejected','approved']);
    const amount = rndInt(50, 500) * 1000000;
    vendorPayments.push({
      id: vpId++,
      userId: finUserId,
      vendorId: rndInt(1, 5),
      projectId: rndInt(1, 10),
      paymentNumber: `VP-2026-${pad(vpId - 1)}`,
      invoiceNumber: `INV-${pad(vpId - 1, 4)}`,
      amount,
      paymentType: pick(['material','service','material']),
      description: pick(paymentDescs),
      status,
      ...(status === 'approved' ? { approvedBy: 1 } : {}),
      createdAt: dateStr(2026, month, rndInt(1, 25)) + 'T14:00:00',
    });
  }
});

// ─── PAYROLLS ────────────────────────────────────────────────────────────────
const payrolls = [];
let prId = 1;
const payrollPeriods = ['Januari 2026','Februari 2026','Maret 2026','April 2026','Mei 2026','Juni 2026'];
users.forEach(u => {
  const bs = u.baseSalary;
  const al = (u.allowanceMeal || 500000) + (u.allowanceTransport || 500000);
  const bpjsK = Math.round(bs * 0.01);
  const bpjsTK = Math.round(bs * 0.02);
  const pph21 = Math.round(bs * 0.05);
  const de = bpjsK + bpjsTK + pph21;

  payrollPeriods.forEach((period, idx) => {
    const isPaid = idx < 5;
    payrolls.push({
      id: prId++,
      userId: u.id,
      period,
      baseSalary: bs,
      allowances: al,
      deductions: de,
      netSalary: bs + al - de,
      status: isPaid ? 'paid' : 'draft',
      ...(isPaid ? { paymentDate: `2026-${String(idx + 1).padStart(2,'0')}-25T08:00:00Z` } : {}),
    });
  });
});

// ─── OUTPUT ───────────────────────────────────────────────────────────────────
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

console.log('✅ Seed data berhasil di-generate!');
console.log(`   👥 Users      : ${users.length}`);
console.log(`   📋 WorkPlans  : ${workPlans.length}`);
console.log(`   📊 WorkReal.  : ${workRealizations.length}`);
console.log(`   🏖  Leave Req. : ${leaveRequests.length}`);
console.log(`   ✈️  SPDs        : ${spds.length}`);
console.log(`   🛒 Purchases  : ${purchases.length}`);
console.log(`   💳 VendorPay. : ${vendorPayments.length}`);
console.log(`   💰 Payrolls   : ${payrolls.length}`);
