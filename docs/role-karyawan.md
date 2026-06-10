# Karyawan Umum (Employee) - Dokumentasi Peran Komprehensif

## 1. Abstrak & Tinjauan Eksekutif
Dalam anatomi ekosistem HRIS Next, *role* Karyawan (Umum/Staf/End-User) adalah entitas dengan populasi terbesar sekaligus menjadi denyut nadi penghasil data harian (The Ultimate Data Creator). Tidak seperti peran-peran struktural (seperti HR, Finance, atau Admin) yang bertugas "memeriksa" atau "menyetujui" (Approvers & Validators), Karyawan adalah sang inisiator transaksi. Karyawan-lah yang mendesain rencana kerja mereka, mengeksekusi keringat di lapangan, melaporkan realisasi (*input raw data*), mengajukan cuti liburan, hingga merespons perintah perjalanan dinas. Keandalan dan kedisiplinan Karyawan dalam memanipulasi Dasbor Mandiri (Self-Service Dashboard) mereka adalah fondasi bagi seluruh laporan analitik tingkat tinggi (*high-level analytics*) yang akan dilihat oleh Dewan Direksi. Dokumentasi mendalam ini memandu setiap insan pekerja untuk bernavigasi secara mulus, menjaga akuntabilitas waktu kerja mereka, dan melindungi privasi finansial masing-masing.

## 2. Filosofi Hak Akses & Konteks Peran
Paradigma perancangan (Design Paradigm) untuk peran Karyawan di HRIS Next bertumpu pada tiga pilar filosofis absolut:
- **Kemandirian (Extreme Self-Service):** HRIS menghilangkan era ketergantungan pada departemen HR untuk hal-hal klerikal. Karyawan tidak perlu lagi mengetuk pintu ruangan Keuangan sekadar meminta cetak Slip Gaji yang hilang, atau mengecek sisa cuti. Karyawan diberikan kendali, alat (tools), dan otorisasi penuh untuk mengakses seluruh riwayat kesejahteraan dan riwayat penalti administratif mereka secara langsung dan otonom selama 24/7.
- **Isolasi Privasi (Privacy-First Compartmentalization):** Keamanan identitas dan gaji adalah hak asasi. Sistem dikunci dengan protokol enkripsi vertikal. Artinya, seorang karyawan hanya mampu berinteraksi dan melihat dimensi data yang secara eksplisit dikaitkan dengan *User ID*-nya sendiri. Mereka benar-benar buta (Blind) terhadap nilai *Take Home Pay* teman satu meja, riwayat sakit kolega, atau skor *Performance Appraisal* pegawai lainnya.
- **Penilaian Berbasis Output (Meritocratic Logging):** Algoritma sistem (melalui EAR/Kanban) mengubah presensi yang bersifat *time-based* (hanya mengandalkan mesin sidik jari/absen) menjadi absensi *output-based*. 8 jam hadir di kantor tidak bernilai jika Karyawan tidak merinci 8 jam tersebut menjadi laporan *Task* yang tervalidasi. 

## 3. Rincian Tanggung Jawab Operasional dan Teknis
Ruang gerak digital seorang Karyawan berpusat pada modul-modul produktivitas, *compliance*, dan pelaporan. Aktivitas tersebut meliputi:

### A. Orkestrasi Perencanaan & Realisasi Kerja Harian
Ini adalah aktivitas yang wajib dilakukan secara berulang setiap harinya (Daily Routine), menjadi indikator utama dalam penilaian Key Performance Indicator (KPI).
- **Formulasi Rencana Kerja (Work Plan):** Pada awal minggu (atau pagi hari), Karyawan menelaah target yang diberikan oleh Project Manager. Karyawan wajib menyusun secara rinci dokumen Rencana Pekerjaan (Apa yang akan dikerjakan hari ini, berapa estimasi jamnya, dan di lokasi mana). Rencana ini menjadi cetak biru (blueprint).
- **Laporan Aktivitas Harian (Employee Activity Report / EAR):** Mendekati jam pulang kantor, Karyawan merealisasikan rencana tersebut. Karyawan wajib mencatatkan aktivitas kerjanya, mengetik rincian proses, mencantumkan persentase progres (misal: 100% selesai, atau masih 40% berlanjut besok), dan melampirkan eviden (foto mesin lapangan, tautan dokumen, tangkapan layar kode) untuk membuktikan integritas pekerjaannya.

### B. Inisiasi Hak Kesejahteraan (Cuti & Klaim)
Sebagai mekanisme penyeimbang kehidupan pekerja (Work-Life Balance):
- **Dasbor Manajemen Cuti:** Karyawan memiliki indikator visual interaktif berupa *progress bar* yang menunjukkan sisa kuota Cuti Tahunan, Jatah Cuti Kedukaan, atau Cuti Melahirkan. Karyawan melakukan inisiasi pengajuan hari libur dengan memasukkan rentang tanggal, memberikan keterangan yang logis, serta—jika dibutuhkan—mengunggah PDF/Gambar Surat Keterangan Dokter dari Klinik/RS. 
- **Otentikasi Slip Gaji Kriptografis (Payslip Vault):** Di modul "My Payroll / Penggajian Personal", Karyawan melihat seluruh catatan rincian pendapatan dari bulan-bulan historis. Karyawan dapat men-download dokumen berbentuk file PDF resmi yang berisi struktur *base salary*, bonus/tunjangan, potongan utang/kasbon, dan potongan regulasi pajak (PPH 21/BPJS) tanpa intervensi manusia lain.

### C. Respons Perintah Eksternal
- **Surat Perintah Dinas (SPD):** Ketika Manajer menugaskan Karyawan terbang ke kota lain, notifikasi SPD akan masuk. Karyawan wajib membaca detail penugasan tersebut, menyetujui, dan setelah dinas usai, mengunggah kembali kwitansi bukti pengeluaran taksi/hotel (Reimbursement) ke keranjang dokumen terkait untuk diklaim ke departemen Keuangan.

## 4. Alur Kerja Arsitektural (Flowchart)
Diagram algoritma (State Machine) di bawah menunjukan simulasi *Loop* aktivitas harian (Daily Loop) yang harus dilakukan oleh seorang Karyawan dari mulai *login* hingga *logout*, berhadapan dengan validasi mesin dan persetujuan atasan.

```mermaid
flowchart TD
    %% Portal Masuk
    A[Karyawan Login Dasbor (Self-Service)] --> B{Pilih Modul Fokus Hari Ini}
    
    %% Alur Kerja & Laporan
    B -->|Area Produktivitas| C[Lihat Papan Kanban / Tugas dari Manajer]
    C --> D[Pindahkan Kartu Status: TODO ke IN-PROGRESS]
    D --> E((Kerjakan Eksekusi Fisik/Teknis))
    E --> F[Tulis Rincian Pekerjaan di Form Laporan EAR]
    F --> G[Unggah Lampiran Eviden/Foto Hasil Kerja]
    G --> H[Submit Laporan ke PM (Project Manager)]
    
    H --> I{Validasi Manajer (PM)}
    I -->|Ditolak (Kualitas Rendah)| J[Notifikasi Merah: Wajib Revisi Laporan]
    J --> F
    I -->|Disetujui| K[Log Produktivitas Disahkan: +Jam Kerja Efektif]
    K --> L[Sistem Kalkulasi Skor KPI Akhir Bulan]

    %% Alur Cuti & Administrasi
    B -->|Area Administrasi| M[Pilih Fitur Pengajuan]
    M -->|Cetak Gaji| N[Akses Brankas Slip Gaji (PDF Download)]
    M -->|Ajukan Cuti| O[Pilih Tanggal di Kalender & Unggah Surat Dokter]
    
    O --> P{Analisa Algoritma Cuti}
    P -->|Cek Kuota Gagal| Q[Sistem Menolak Otomatis (Blocked by Engine)]
    P -->|Kuota Cukup| R[Routing ke Manajer HR untuk Disetujui]
    R --> S[Status Cuti Terbit (Approved) & Kuota Terpotong]
```

## 5. Matriks Otorisasi Absolut & Batasan Etika
Role Karyawan diciptakan dengan fondasi *Minimal Privilege* (Hak Akses Paling Dasar), demi mencegah kebocoran, *fraud* (penipuan), maupun kecelakaan data.

| Fitur/Modul HRIS | Akses Spesifik Karyawan | Limitasi Keras (Hard Restrictions) |
| :--- | :--- | :--- |
| **Profil & Database Pribadi**| `[READ/UPDATE ringan]` Bisa mengupdate Alamat Domisili, Nomor Darurat, Riwayat Pendidikan. | Sangat dikunci untuk mengubah Nama Resmi, NIK, Departemen, atau Gaji Pokok. Modifikasi ini harus dilakukan Admin. |
| **Aktivitas Pekerjaan (EAR)** | `[CREATE/READ/UPDATE]` Bebas mengedit EAR selama statusnya masih "Pending" atau "Draft". | Modul terkunci mutlak (`LOCKED`); Karyawan tidak bisa mengedit atau menghapus laporan EAR yang sudah ditekan "Approve" oleh Manajernya. |
| **Cuti & Kehadiran** | `[CREATE/READ]` Bebas mengajukan dan memantau status persetujuan. | Karyawan buta arah (*Blind*) terhadap rekap cuti Karyawan lain untuk mencegah kecemburuan sosial. |
| **Sistem Persetujuan (Approval)**| `[NONE]` (Tidak Ada Akses Sama Sekali). | Karyawan dilarang dan tidak akan pernah memiliki tombol "Approve" atau "Reject" transaksi orang lain. |

## 6. Skenario Penyelesaian Masalah (Troubleshooting & Edge Cases)
Dalam navigasi harian, ada kalanya Karyawan membentur anomali sistem. Berikut pedoman taktisnya:
1. **Insiden Pembatalan Izin yang Disetujui (Cuti Batal Berangkat):**
   - **Kasus:** Karyawan telah disetujui untuk cuti 3 hari untuk liburan keluarga, dan sistem telah memotong 3 saldo cuti tahunan. Namun, sehari sebelum berangkat, bandara ditutup akibat bencana alam (Erupsi), sehingga Karyawan tidak jadi berangkat dan memutuskan tetap bekerja (WFH/WFO).
   - **Resolusi Karyawan:** Karyawan tidak bisa memencet "Batal" atau mengembalikan saldo cutinya sendiri karena dokumen sudah terkunci statusnya (Approved). Karyawan harus menghubungi pihak HR, mengirimkan bukti pembatalan tiket. HR-lah yang akan menekan tombol de-otorisasi (*Revoke*) agar 3 kuota tersebut di- *refund* (dikembalikan otomatis) ke akun Karyawan.
2. **Keterlambatan Ekstrem Input Pekerjaan (Backdate Blocking):**
   - **Kasus:** Karyawan lupa mengisi laporan kerja EAR selama 4 hari penuh di minggu lalu karena terlalu sibuk bekerja di lapangan tanpa sinyal internet. Di hari Senin berikutnya, saat Karyawan ingin meng-*input* pekerjaan minggu lalu (*backdate*), sistem menolak dan kotak kalendernya abu-abu (Disabled).
   - **Resolusi Karyawan:** Sistem HRIS Next dikonfigurasi dengan fitur anti-fraud (*Max Backdate Lock*), misalnya hanya mengizinkan pengisian surut maksimal H-2. Karyawan harus melaporkan insiden ini ke PM (Project Manager), yang akan menembuskan *Request to Unlock* kepada Admin. Setelah Admin membuka blokir sementara, Karyawan baru diizinkan melengkapi rekam jejak pekerjaannya.
3. **Perselisihan Penolakan Hasil Laporan Kerja (EAR Dispute):**
   - **Kasus:** Laporan Karyawan tentang perbaikan instalasi kabel di-*Reject* oleh Project Manager dengan komentar "Foto kurang jelas dan durasi 8 jam tidak masuk akal untuk tugas sepele ini".
   - **Resolusi Karyawan:** Karyawan membuka dokumen tersebut, menyisipkan foto eviden *High-Resolution* yang baru dari galerinya, mengoreksi durasi jam menjadi lebih masuk akal (misal 3 Jam), menulis komparasi teknis yang solid di kolom komentar perbaikan, lalu menekan tombol "Re-Submit" agar berkas kembali naik ke meja PM untuk validasi ulang ronde kedua.

## 7. Kebijakan Kepatuhan & Standar Operasional Prosedur (SLA & SOP)
Untuk mempertahankan keakuratan metrik evaluasi tahunan perusahaan, Karyawan tunduk pada protokol besi berikut:
- **Prinsip *Real-Time Honesty* (SLA Pengisian Laporan):** Karyawan dituntut secara mutlak meng- *input* Realisasi Pekerjaan pada hari yang sama (maksimal pukul 23:59). Algoritma perusahaan mencatat *timestamp* penyerahan; menunda laporan hingga menumpuk berhari-hari akan menyebabkan bendera merah (Red Flag) pada algoritma kedisiplinan (Discipline Index), berpotensi menekan besaran bonus tahunan.
- **Kepatuhan Bukti Eksekusi (Evidentiary Compliance):** Karyawan dilarang merangkum laporan secara samar seperti "Mengerjakan tugas biasa". Kalimat harus spesifik dan berorientasi *Output* (Contoh: "Menyelesaikan Modul Login Auth v2.0 menggunakan JWT"). Lampiran berkas (Link Github, Foto Survei Lahan) diwajibkan untuk pekerjaan yang memakan waktu lebih dari 50% *Shift* harian.
- **Transparansi Pra-Kejadian Cuti (Advance Notice):** Pengajuan cuti terencana wajib masuk sistem maksimal H-7 sebelum hari eksekusi. Sistem berhak memberikan label "Darurat/Emergency" jika cuti diajukan H-1, yang berpotensi ditolak mentah-mentah oleh algoritma (Kecuali cuti sakit bersurat dokter / Kematian keluarga inti).

## 8. Kesimpulan Peran
Modul *Self-Service* bagi Karyawan di dalam HRIS Next bukanlah sekadar alat pengganti mesin absen sidik jari (*fingerprint scanner*), melainkan sebuah Papan Skor Produktivitas (Productivity Scoreboard). Dengan kebebasan otonomi yang diberikan, Karyawan dituntut untuk bertindak sebagai auditor bagi waktu kerjanya sendiri. Menguasai dasbor ini berarti Karyawan memegang kendali atas visibilitas kariernya—setiap detik, setiap baris laporan, dan setiap disiplin administratif akan tercatat menjadi portofolio kinerja absolut yang dihitung oleh algoritma sistem ketika masa promosi dan kenaikan upah tiba.
