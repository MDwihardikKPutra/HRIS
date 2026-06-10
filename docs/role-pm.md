# Project Manager (PM) - Dokumentasi Peran Komprehensif

## 1. Abstrak & Tinjauan Eksekutif
Project Manager (PM) memegang kendali atas urat nadi operasional dan eksekusi misi di lapangan. Di dalam HRIS Next, *role* PM bertindak sebagai jembatan strategis antara perencanaan korporasi di kantor pusat (Manajemen/Direksi) dengan para eksekutor teknis (Karyawan/Staf Lapangan). Peran ini didesain secara spesifik untuk memantau siklus hidup proyek (*Project Lifecycle*), memastikan ketepatan waktu pengiriman tugas (SLA), menyelaraskan beban kapasitas tim (*Resource Capacity*), dan memvalidasi kebenaran progres riil melalui laporan Laporan Aktivitas Karyawan (EAR). Pemahaman yang utuh terhadap fitur pelacakan (*tracking*), papan visual (Kanban), serta otoritas persetujuan (Approval) adalah sebuah keharusan demi menuntaskan proyek dengan margin efisiensi finansial dan produktivitas manusia yang paling optimal.

## 2. Filosofi Hak Akses & Konteks Peran
Peran PM didasarkan pada konsep *Agile Supervision* dan *Micro-Delegation* di dalam platform *Role Based Access Control* (RBAC). Filosofi arsitektur dari *dashboard* PM mencakup:
- **Pengawasan Otonom Bertarget (Targeted Autonomous Supervision):** Tidak seperti HR yang melihat pergerakan seluruh ratusan pegawai perusahaan, seorang PM secara kriptografis diisolasi hanya untuk dapat melihat, mengatur, dan memanipulasi *data points* dari tim spesifik yang ditugaskan (*assigned*) ke dalam proyek yang dipimpinnya. Ini menjaga hierarki wewenang dan menajamkan fokus analitik (Noise Reduction).
- **Gerbang Penilaian Performa (The Validation Gatekeeper):** Tidak ada satu pun Karyawan yang mendapatkan "Skor Kinerja/Jam Produktif" kecuali laporan *Employee Activity Report* (EAR)-nya telah disetujui (Approved) secara eksplisit oleh PM. PM memverifikasi bahwa 8 jam kerja yang diklaim stafnya benar-benar menghasilkan *output* yang terukur secara kualitas teknis.
- **Katalisator Logistik (Logistics Catalyst):** PM adalah pemegang kunci inisiasi belanja operasional. Sistem mengandalkan PM untuk menjadi penilai utama apakah timnya butuh diterbangkan ke luar kota (Pengajuan Surat Perintah Dinas / SPD) atau membutuhkan pencairan dana perakitan mesin (Purchase Order) yang diteruskan kepada tim Finance.

## 3. Rincian Tanggung Jawab Operasional dan Teknis
Sebagai konduktor dari orkestra teknis, pekerjaan keseharian Project Manager (PM) menuntut interaksi berat dengan antarmuka manajemen tugas dan panel visualisasi data.

### A. Manajemen Proyek Visual (Kanban Orchestration)
Ini adalah jantung dari *workspace* PM, di mana kompleksitas proyek diurai menjadi tugas mikro (Micro-tasks).
- **Task Breakdown & Assignment:** Setelah kontrak proyek ditandatangani, PM masuk ke modul Proyek, memecah (breakdown) tujuan akhir ke dalam belasan atau puluhan kartu *Task*. PM kemudian melakukan *Drag and Drop* anggota tim ke kartu tugas spesifik tersebut, dengan menetapkan level prioritas (High, Medium, Low) dan *Due Date* (Tenggat Waktu).
- **Pemantauan Progress (Sprint Monitoring):** PM mengamati secara berkala perpindahan kartu kerja di Papan Kanban. Kartu yang terlalu lama terjebak di kolom "In-Progress" (Bottleneck) akan ditandai merah oleh algoritma sistem, sehingga PM bisa segera melakukan rapat evaluasi (Stand-up) dengan staf terkait untuk mendiagnosis hambatannya.

### B. Otorisasi EAR (Employee Activity Report)
Validasi harian ini adalah tugas rutin namun krusial, yang berdampak langsung pada Key Performance Indicator (KPI) karyawan.
- **Micro-Validation:** Setiap sore atau pagi hari, PM membuka laci *Pending Approvals*. PM wajib membaca rincian jam, deskripsi *output* kerja (misal: "Coding API Login" atau "Merakit Kabel Fiber"), dan bukti lampiran berupa foto *screenshot*/lapangan. Jika kualitas kerjanya di bawah standar (Sub-par), PM wajib menggunakan fitur "Reject & Comment", memaksa staf tersebut mengulang atau memperbaiki pekerjaannya di hari berikutnya tanpa dihitung sebagai jam produktif.

### C. Pengelolaan Aset & Mobilitas Tim (Resource Deployment)
- **Otorisasi Dinas Lapangan:** PM berhak mengeluarkan rancangan Surat Perintah Dinas (SPD). PM harus menentukan lokasi kota tujuan, durasi hari, hingga staf mana saja yang diwajibkan berangkat. SPD yang telah diverifikasi kelayakan teknisnya oleh PM akan otomatis merayap (*routing*) ke meja HR dan Finance untuk proses pembayaran tiket dan akomodasi.

## 4. Alur Kerja Arsitektural (Flowchart)
Diagram di bawah mendemonstrasikan algoritma kompleks (State Machine) dari ekosistem interaksi PM dengan tim lapangan melalui mekanisme "Kanban - EAR Feedback Loop".

```mermaid
flowchart TD
    %% Phase 1: Planning
    A[Terima Proyek Baru dari Manajemen] --> B(Akses Modul 'Kelola Proyek')
    B --> C[Definisikan Scope & Timeline Global]
    C --> D[Pecah Scope menjadi Micro-Tasks]
    D --> E[Injeksi Kartu Task ke Kolom TODO]
    
    %% Phase 2: Assignment & Execution
    E --> F[Assign Staf/Karyawan ke Task]
    F --> G((Notifikasi Push ke Karyawan))
    G --> H[Karyawan Merubah Status menjadi IN-PROGRESS]
    
    %% Phase 3: Reporting
    H --> I[Karyawan Submit Laporan Harian (EAR)]
    I --> J{PM: Analisa & Verifikasi Output}

    %% Phase 4: Decision Matrix
    J -->|Output Cacat/Tidak Jelas| K[Reject dengan Feedback]
    K --> L[Karyawan Revisi Laporan/Kerja]
    L --> I
    
    J -->|Output Sesuai Ekspektasi| M[Approve EAR]
    M --> N[Sistem Kalkulasi Menit Produktif (KPI)]
    
    %% Phase 5: Task Closure
    M --> O{Apakah Semua EAR untuk Task tsb Selesai?}
    O -- Belum --> H
    O -- Sudah Final --> P[PM / Staf Pindahkan Task ke DONE]
    P --> Q[Algoritma Sistem Memperbarui Progres Total Proyek (%)]
```

## 5. Matriks Otorisasi Absolut & Batasan Etika
Project Manager memiliki kuasa tertinggi dalam hal operasional proyek, namun tidak memiliki kuasa administratif keuangan dan SDM. 

| Fitur/Modul HRIS | Akses Spesifik PM | Limitasi Keras (Hard Restrictions) |
| :--- | :--- | :--- |
| **Kelola Proyek (Kanban)** | Create, Read, Update, Delete (Penuh) atas proyek miliknya. | Tidak dapat mengintip, mengedit, atau menghapus daftar *task* dari proyek PM lainnya (Data Silo). |
| **Approval Realisasi (EAR)** | Otoritas Validasi Mutlak (Gatekeeper Pertama). | Dilarang keras menyetujui laporan fiktif (Kolusi), karena Audit Log akan melacak jam *submit* dan IP lokasi karyawan. |
| **Profil & Gaji Staf** | Membaca biodata ringan dan nomor telepon staf proyeknya. | Buta Total (Zero Visibility) terhadap angka gaji, slip, atau histori penyakit/surat dokter dari anak buahnya. Hal ini diproteksi oleh HR & Finance. |
| **Anggaran (Budget)** | Membaca kuota *Cost Center* / sisa dana operasional proyek. | Tidak berhak mencetak uang, tidak berhak merestrukturisasi batas bujet tanpa izin Manajemen atas. |

## 6. Skenario Penyelesaian Masalah (Troubleshooting & Edge Cases)
Kemampuan PM memutar otak menggunakan *tools* HRIS saat menghadapi anomali adalah kunci dari manajemen krisis yang berhasil:
1. **Insiden Ketidakhadiran Massal (Resource Scarcity):**
   - **Kasus:** H-3 sebelum instalasi mesin di *site*, 2 orang teknisi utama dari tim proyek mengajukan cuti darurat sakit (dan telah di-Approve oleh HR secara sah). Proyek berpotensi mangkrak (Delay).
   - **Resolusi PM:** PM membuka *Dashboard* Kapasitas Karyawan (Resource Allocation Matrix) untuk mencari staf lain di perusahaan yang saat ini "Idle" atau memiliki beban kerja ringan di proyek lain. PM secara diplomatis meminjam staf tersebut, memintanya dimasukkan (assigned) ke dalam proyek darurat ini, lalu mendelegasikan (Re-assign) *Task* yang ditinggalkan teknisi sakit ke staf pinjaman tersebut agar tenggat waktu (deadline) tetap aman.
2. **Manipulasi Jam Kerja Harian (EAR Fraud):**
   - **Kasus:** PM mendapati bahwa staf B melaporkan aktivitas "Research Framework" selama 8 jam berturut-turut selama 3 hari di sistem, namun *output code/repository*-nya kosong. 
   - **Resolusi PM:** PM menggunakan otoritasnya untuk menekan fungsi "Bulk Reject" terhadap 3 laporan hari tersebut. PM juga menyisipkan parameter teguran (Warning Note) di komentar EAR agar masuk ke dalam rekam jejak HR. Hal ini menyebabkan skor performa produktivitas staf B anjlok di bulan itu, memaksa staf tersebut untuk disiplin di hari kerja selanjutnya.
3. **Penyumbatan Jalur Approval (Bottleneck Otorisasi):**
   - **Kasus:** PM sedang ditugaskan survei lapangan ke hutan pedalaman tanpa sinyal internet selama 1 minggu. Berpuluh-puluh dokumen EAR dari tim di kota tertahan (Pending) karena sistem menunggu klik "Approve" dari PM, yang mengakibatkan KPI tim macet.
   - **Resolusi PM:** Sebelum kehilangan konektivitas, PM sadar dan mengaktifkan mode "Delegation of Authority" (jika diaktifkan oleh Admin), atau minimal menghubungi Admin untuk memindahkan sementara (*Override/Bypass*) otorisasi *approval* kepada Wakil PM atau *Tech Lead* agar roda birokrasi sistem tetap berputar.

## 7. Kebijakan Kepatuhan & Standar Operasional Prosedur (SLA & SOP)
Untuk menjaga agar data proyek (*Analytics*) di layar direksi selalu faktual, PM wajib tunduk pada prosedur ketat:
- **Zero-Backlog Policy (SLA Validasi Laporan):** Sistem menuntut disiplin *real-time*. PM dilarang menumpuk peninjauan EAR lebih dari 2x24 jam. Kebiasaan meng-approve EAR secara "Borongan" (Bulk Approve tanpa baca) di akhir bulan sangat diharamkan karena menghancurkan validitas metrik produktivitas dan membebani server saat kalkulasi gaji/insentif.
- **Kepatuhan Bukti Eksekusi (Evidentiary Compliance):** PM harus memastikan (mengedukasi) timnya untuk selalu menyertakan *URL link* (misal Git, Trello, Google Docs) atau *Screenshot/Foto* di setiap EAR yang menghabiskan durasi kerja panjang (lebih dari 4 jam).
- **Penutupan Proyek Administratif (Project Closure):** Ketika instalasi fisik proyek telah rampung, tugas PM belum selesai. PM wajib mengunci proyek (Lock Project) di HRIS, mengubah statusnya menjadi "Completed". Hal ini akan mengarsipkan seluruh data, membekukan *budget* yang tersisa agar tidak bisa lagi diklaim, dan melepaskan (*un-assign*) para staf sehingga status mereka kembali "Available" di radar HR perusahaan.

## 8. Kesimpulan Peran
Modul Project Management di HRIS Next adalah senjata taktis. Bagi seorang PM, HRIS bukan sekadar sistem absensi, melainkan "Ruang Perang" (War Room). PM mengandalkan platform ini untuk menganalisa titik lemah performa bawahan, menjaga margin laba operasional (OPEX), dan membuktikan akuntabilitas kinerja tim kepada jajaran Direksi. Kedisiplinan PM dalam memindahkan kartu Kanban dan menginvestigasi laporan EAR adalah penentu utama apakah proyek tersebut akan menghasilkan profitabilitas tinggi atau kerugian membengkak akibat inefisiensi waktu yang tidak terpantau.
