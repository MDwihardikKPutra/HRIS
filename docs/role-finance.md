# Finance (Keuangan) - Dokumentasi Peran Komprehensif

## 1. Abstrak & Tinjauan Eksekutif
Dalam lanskap sistem *Human Resource Information System* (HRIS) berskala *enterprise*, modul keuangan beroperasi dengan kedisiplinan tingkat dewa. Peran *Finance* (Keuangan) memikul beban krusial sebagai penjaga likuiditas (*Liquidity Guardian*) dan pengawal utama terhadap setiap pergerakan uang yang keluar dari entitas perusahaan, baik itu ke dalam dompet karyawan (Gaji/Payroll) maupun ke pihak eksternal (Pembayaran Vendor melalui Purchase Order). Pengguna dengan peran Finance di dalam HRIS Next tidak difokuskan pada manajemen operasional SDM, melainkan diwajibkan untuk menjamin akurasi presisi komputasi matematis, rekonsiliasi pengeluaran, kepatuhan perpajakan (PPh 21/Pajak Penghasilan), dan pencairan iuran asuransi sosial (BPJS Kesehatan & Ketenagakerjaan). Dokumen ini merincikan metodologi operasional dan arsitektur pengawasan yang melekat pada otoritas seorang manajer keuangan.

## 2. Filosofi Hak Akses & Konteks Peran
Ekosistem Finance di dalam HRIS sangat terenkripsi dan bersifat restriktif demi menjaga keseimbangan neraca keuangan. Filosofi inti yang mendasari desain fitur untuk peran Finance meliputi:
- **Tembok Presisi (The Precision Firewall):** Sistem memproses ratusan hingga ribuan variabel matematis setiap akhir bulan (hari absensi, pemotongan pajak progresif, denda mangkir, klaim lembur). Peran Finance bertindak sebagai "dinding validasi" manusia terakhir sebelum mesin diizinkan untuk menerbitkan slip gaji final dan mengeksekusi transfer antar-bank.
- **Pemusatan Likuiditas (Centralized Disbursal):** Modul-modul operasional yang memakan biaya besar (seperti Surat Perintah Dinas untuk perjalanan ke luar negeri, atau Pembelian Material Proyek) secara algoritma akan diarahkan (routed) langsung ke dasbor Finance. Finance adalah katup pengendali (Throttle); mereka berhak membekukan (*freeze*) pembelian jika *burn-rate* proyek telah melampaui indikator batas aman.
- **Kerahasiaan Mutlak (Absolute Confidentiality):** Gaji, pesangon, hutang kasbon, dan histori pinjaman adalah data tingkat privasi tertinggi. Akun dengan *role* Finance dikonfigurasi untuk menangani layar dengan sensitivitas data ini. Semua transaksi terekam abadi dalam bentuk *Immutable Ledger* (buku besar tak dapat diubah) guna mengantisipasi manipulasi pelaporan aset (Fraud Prevention).

## 3. Rincian Tanggung Jawab Operasional dan Teknis
Ruang kerja utama (*Workspace*) dari tim Keuangan terbagi menjadi dua sektor masif: sektor kompensasi (Payroll) dan sektor belanja modal (Procurement Approval).

### A. Orkestrasi Siklus Penggajian (Payroll Engine Operation)
Modul Penggajian adalah komponen teknis paling kompleks. Finance tidak mengetik gaji secara manual, melainkan bertugas "meracik" mesin kalkulasinya.
- **Simulasi Komputasi (Payroll Draft):** Mendekati tanggal pencairan (misal: tanggal 25), Finance menjalankan *Simulation Script* di aplikasi. Sistem HRIS Next akan menarik data absensi bulanan dari modul HR, menghitung jam mangkir, memvalidasi persetujuan Cuti *Unpaid*, menambahkan tunjangan posisi tetap, dan mengkalkulasi potongan *tax bracket* progresif. Finance menelaah *spreadsheet virtual* hasil simulasi tersebut.
- **Eksekusi Penyesuaian Komponen (Component Adjustment):** Jika ada Karyawan yang mengajukan lembur darurat (Overtime) atau menerima bonus tahunan *Pro Rata*, Finance menginjeksi komponen *One-Time Allowance* (Tunjangan Insidentil) tersebut secara legal dan tercatat sistem sebelum dikunci (*locked*).
- **Distribusi Slip PDF Kriptografis:** Setelah diverifikasi dan diputuskan *Final*, Finance menekan tombol "Publish Payroll". Detik itu juga, server HRIS akan melakukan *rendering* dan mengemas detail Slip Gaji bulanan menjadi format PDF untuk seluruh karyawan secara masif dan mengirimkan notifikasinya ke Dasbor pribadi masing-masing Karyawan.

### B. Validasi Arus Pengeluaran Pembelian & Dinas (Outflow Validation)
Setiap proyek atau kegiatan lapangan membutuhkan anggaran tunai yang riil.
- **Purchase Order (PO) Vetting:** Saat Project Manager (PM) mengajukan pengadaan laptop, alat berat, atau vendor konstruksi (Procurement), berkas PO (Surat Pemesanan) akan mendarat di keranjang kerja Finance. Finance menganalisa Nomor Rekening Vendor, Termin Pembayaran (Term of Payment), dan melakukan pengecekan Anggaran Sisa (Remaining Budget Balance) proyek tersebut. Jika lolos, barulah Finance mengklik "Approve for Payout".
- **Reimbursement & Uang Muka Dinas (Cash Advance):** Ketika karyawan melakukan perjalanan dinas, mereka membutuhkan tiket pesawat dan uang harian (Per Diem). Modul SPD secara otomatis menghitung *Per Diem* sesuai zona geografi. Tugas Finance adalah menyetujui pengajuan *Reimbursement* setelah mengevaluasi kecocokan foto struk/kwitansi (Receipt Verification) dengan kebijakan nilai batas atas perusahaan (*Company Policy Limits*).

## 4. Alur Kerja Arsitektural (Flowchart)
Diagram berikut mendemonstrasikan kompleksitas logika mesin (Engine Logic) ketika tim Finance menangani pengesahan *Purchase Order* (PO), dari validasi modal hingga integrasi ke sistem buku besar.

```mermaid
flowchart TD
    %% Initiation of Procurement
    A[Project Manager Submit Purchase Order/PO] --> B(Routing Otomatis ke Dasbor Finance)
    B --> C{Pengecekan Kebijakan Keuangan (Policy Check)}
    
    %% Finance Human Decision Layer
    C -->|Cek 1| D[Sistem Cek Anggaran Proyek]
    C -->|Cek 2| E[Pemeriksaan Dokumen Penawaran Vendor (Quotation)]
    C -->|Cek 3| F[Evaluasi Profil Risiko Vendor Baru]

    %% Validation Nodes
    D & E & F --> G{Tindakan Analisa Finance}
    
    %% Pathways
    G -->|Tolak/Hentikan| H[Reject: Dana Proyek Over-limit]
    G -->|Revisi Bukti| I[Kembalikan Status: Bukti Kwitansi Kurang Jelas]
    G -->|Verifikasi Valid| J[Approve Payout (Eksekusi Dana)]
    
    %% Final Action Integration
    J --> K[Sistem Memotong Saldo Pagu Anggaran Proyek]
    J --> L[Generate Kode Referensi Pembayaran Internal]
    
    %% Cross-Module Notification
    K & L --> M{Notifikasi Jaringan}
    M --> N[Push Notif ke PM: Dana Telah Cair]
    M --> O[Sinkronisasi API ke Aplikasi Akuntansi Inti Perusahaan]
    
    %% State Final
    H --> P[Sistem Tutup Laporan / End Process]
    I --> Q[Kembali ke Siklus Pengajuan]
```

## 5. Matriks Otorisasi Absolut & Batasan Etika
Role Finance dituntut untuk bersikap sangat analitis, dengan pembatasan hak yang berpusat pada integritas akuntansi.

| Fitur/Modul HRIS | Akses Spesifik Finance | Limitasi Keras (Hard Restrictions) |
| :--- | :--- | :--- |
| **Siklus Penggajian (Payroll)** | Hak Kalkulasi, Adjustmen Khusus, Publikasi Final. | Tidak dapat mengubah *Base Salary* tanpa integrasi kontrak yang disetujui HR & Direksi. |
| **Approval Surat Perintah Dinas (SPD)** | Menyetujui klaim pencairan dana *Reimbursement*. | Tidak memiliki yurisdiksi untuk menilai apakah dinas tersebut "Penting" secara teknis (Itu Otoritas PM/HR). Finance hanya memvalidasi "Angka/Nominal". |
| **Laporan Kerja Harian (EAR / Kanban)**| Read-Only level ringkasan biaya (Cost Center View). | Tidak berhak menyetujui, membaca detail kode/tugas, atau mengatur jadwal pekerja. |
| **Informasi Sensitif** | Mampu mengakses NIK, NPWP, Rekening Bank. | Dilarang mengubah data rekening karyawan tanpa dokumen permohonan resmi ber-materai (*Anti-Money Laundering Rule*). |

## 6. Skenario Penyelesaian Masalah (Troubleshooting & Edge Cases)
Lanskap moneter memiliki ratusan skenario ujung (Edge Cases) yang berpotensi merugikan, dan harus dinavigasi secara ahli oleh Finance:
1. **Insiden Discrepancy (Selisih) Gaji Massal:**
   - **Kasus:** Pasca perilisan (Publish) Slip Gaji ke seluruh staf, 10 Karyawan melapor bahwa tunjangan BPJS Kesehatan mereka dipotong 2x lipat akibat *bug* konfigurasi baru di dalam mesin perhitungan.
   - **Resolusi Finance:** Finance mengeksekusi fitur "Emergency Rollback Payroll Run". Sistem HRIS akan menarik kembali akses slip PDF yang telah terbit secara seketika (mencabut *visibility* di Dasbor Karyawan). Finance kemudian memperbaiki formula parameter persentase BPJS di halaman Pengaturan Komponen, mengkalkulasi ulang, dan merilis versi koreksi (*Revised Slip*) dengan riwayat audit bahwa versi sebelumnya telah dibatalkan demi legalitas.
2. **Kwitansi Pengeluaran Palsu (Fraudulent Receipt Claim):**
   - **Kasus:** Karyawan mengunggah foto bon bensin dan parkir (Toll & Gas) senilai Rp 800.000 pada saat Dinas Luar Kota. Namun mesin analitik Finance atau insting Auditor mendeteksi manipulasi Photoshop pada angka kwitansi tersebut.
   - **Resolusi Finance:** Finance mengubah status *Reimbursement* menjadi "Hold for Investigation" (Pembekuan Investigatif). Finance juga dapat menyematkan status *Penalty Marking* ke akun karyawan di sistem untuk ditindaklanjuti secara disipliner oleh HR, sekaligus mengunci akses karyawan untuk mengajukan klaim dana baru sampai kasus diselesaikan secara komite.
3. **Konflik Pagu Anggaran (Budget Overhead Clash):**
   - **Kasus:** PM lapangan mencoba membuar PO darurat senilai Rp 150 Juta. Namun, sisa plafon (*budget threshold*) dari Proyek Alpha tersebut di sistem tinggal tersisa Rp 20 Juta. Otomatis aplikasi HRIS akan menampilkan indikator "Insufficient Funds" dan memblokir opsi persetujuan (Approve) standar.
   - **Resolusi Finance:** Untuk membuka *lock* mesin tersebut, Finance harus menjalankan negosiasi lisan dengan jajaran Direktur untuk meminta *Top-Up Budget*. Setelah mendapatkan lampu hijau, Finance mengeksekusi *Budget Injection* ke dompet digital proyek (Cost Center) dengan memasukkan "Token Approval Direktur" agar saldo proyek bertambah dan PO tersebut baru bisa diklik "Approve".

## 7. Kebijakan Kepatuhan & Standar Operasional Prosedur (SLA & SOP)
Untuk mempertahankan kredibilitas ekosistem fiskal perusahaan, peran Keuangan terikat pada kode etik prosedural:
- **Zero Modification Post-Approval (Sifat Buku Besar):** Setelah sebuah *Purchase Order* dibayarkan atau slip *Payroll* diterbitkan dengan sukses, Finance dilarang menghapus rekaman di *database*. Modifikasi yang bersifat merusak (Destructive Edit) akan mengacaukan penomoran invoice faktur pajak (Tax Numbering). Segala perbaikan harus dibuat melalui mekanisme "Jurnal Koreksi" (*Reversal Entry*).
- **Service Level Agreement (SLA) Verifikasi:** Pengecekan *Reimbursement* karyawan atau pembayaran tagihan vendor (*Invoice*) wajib diselesaikan maksimal sebelum tanggal batas termin (misal H+3 sejak berkas diunggah), untuk menghindari pinalti atau pemburukan *rating* kredit perusahaan.
- **Maker-Checker Segregation:** Dalam ekosistem perusahaan multinasional, fitur pencairan dana besar tidak boleh dipegang oleh 1 *user*. Harus ada pemisahan di mana "Staf Finance" bertugas menyiapkan *Draft/Maker*, dan "Finance Manager (CFO)" memegang kunci otoritas final (Checker). HRIS memfasilitasi konsep *Approval Bertingkat* tersebut.

## 8. Kesimpulan Peran
Modul Finance di HRIS Next bukan sekadar *calculator* pintar; ia adalah mesin yang menggabungkan kepatuhan hukum, akurasi pajak, dan orkestrasi pencairan likuiditas. Seorang staf atau manajer Keuangan yang mengakses aplikasi ini bertindak sebagai perisai dari kebocoran kerugian finansial perusahaan. Pemahaman yang sangat detail mengenai formula tunjangan, manajemen resiko klaim, dan arsitektur otorisasi bertingkat sangat vital dalam menjamin proses bisnis perusahaan berdetak tanpa henti, dan hak moneter karyawan terpenuhi secara memuaskan serta tepat pada waktunya.
