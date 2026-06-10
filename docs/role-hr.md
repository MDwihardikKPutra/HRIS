# Human Resources (HR) - Dokumentasi Peran Komprehensif

## 1. Abstrak & Tinjauan Eksekutif
Peran Human Resources (HR) atau Personalia di dalam sistem HRIS Next adalah fondasi yang memelihara ekosistem sosial, kesejahteraan, disiplin, dan struktur hukum dari sumber daya manusia perusahaan. Tidak seperti peran teknis (Admin) atau peran lapangan (Project Manager), HR bertindak sebagai penjaga gerbang administrasi kepersonaliaan. Mereka mengontrol arus pergerakan absensi, mengelola kompensasi non-finansial (seperti saldo cuti, jatah libur), serta memastikan setiap aktivitas ketidakhadiran karyawan tercatat dengan rapi, sah, dan tidak membahayakan produktivitas atau operasional proyek perusahaan. Dokumentasi komprehensif ini menjabarkan anatomi tanggung jawab, batasan akses, hingga penyelesaian anomali bagi pengguna dengan role HR.

## 2. Filosofi Hak Akses & Konteks Peran
Di dalam desain *Role Based Access Control* (RBAC), peran HR didesain dengan tingkat privilese "Semi-Global". Filosofi operasional dari HR meliputi:
- **Penyaring Produktivitas (The Productivity Filter):** HR tidak hanya bertugas "menyetujui" setiap permohonan. Mereka adalah lapisan analisis terakhir yang harus melihat dampak ketidakhadiran seseorang terhadap *Kalender Perusahaan*. Jika sebuah permohonan cuti diajukan berbarengan dengan periode krusial pengiriman proyek (deadline), HR adalah otoritas tunggal yang dapat menganulir atau mereschedule jadwal cuti karyawan tersebut demi menjaga produktivitas perusahaan.
- **Wali Privasi Karyawan:** HR menangani data medis (surat keterangan sakit), alasan pribadi cuti (kedukaan, pernikahan), hingga data demografis yang sensitif. Sistem mengisolasi data ini secara kriptografis dari akses rekan kerja biasa, memposisikan HR sebagai brankas kerahasiaan (*The Vault of Privacy*).
- **Penjaga Kepatuhan Hukum (Compliance Guardian):** Aturan ketenagakerjaan (Undang-Undang Cuti Tahunan, Cuti Melahirkan, Jatah Istirahat Panjang) tertanam di dalam algoritma HRIS. HR adalah pelaksana (Enforcer) yang memastikan konfigurasi kuota di sistem selaras dengan regulasi nasional.

## 3. Rincian Tanggung Jawab Operasional dan Teknis
Tugas keseharian seorang HR Manager/Staf Personalia dalam platform HRIS sangat bergantung pada *dashboard* yang intensif secara data. Modul inti yang dikelola meliputi:

### A. Orkestrasi Manajemen Cuti & Izin Berjenjang
Permohonan Cuti dan Izin Tidak Masuk Kerja (Sakit, Kepentingan Pribadi) adalah volume data harian tertinggi dalam HRIS.
- **Validasi Silang (Cross-Validation):** Ketika permohonan cuti masuk, sistem memberikan rekomendasi berbasis warna (Red/Yellow/Green flag). HR bertugas melihat *Dashboard* yang menampillkan kuota tahunan yang tersisa. Jika kuota minus atau telah kedaluwarsa, HR berhak mengubah tipe cuti (misalnya dari Cuti Tahunan menjadi *Unpaid Leave* / Potong Gaji).
- **Verifikasi Evidensi Dokumen:** Untuk tipe cuti tertentu (contoh: Izin Sakit lebih dari 2 hari), sistem akan mewajibkan lampiran (attachment) berupa file PDF/JPG Surat Dokter. HR memiliki *viewer* khusus untuk membuka, memeriksa legalitas stempel puskesmas/klinik, dan mengambil keputusan. Jika dokumen terindikasi cacat atau *expired*, HR dapat menekan tombol "Reject & Request Revision".

### B. Pusat Kendali Kalender Perusahaan (Corporate Calendar)
Fitur ini adalah radar bagi HR untuk mengawasi pergerakan massa karyawan secara *zoom-out*.
- **Pemantauan Heatmap SDM:** HR dapat melihat tanggal-tanggal kritis. Jika dalam rentang waktu yang sama terdapat lebih dari 15% karyawan di suatu Departemen mengajukan cuti (misalnya saat hari terjepit nasional / Harpitnas), Kalender akan menyala merah. Di titik ini, HR mengambil langkah manajerial dengan membekukan (freeze) persetujuan cuti tambahan.
- **Pengaturan Libur Nasional (Public Holiday Config):** HR memiliki kewenangan untuk mendeklarasikan Hari Libur Nasional. Ketika hari libur ditetapkan di kalender, semua komponen sistem akan menyesuaikan. Absensi pada hari tersebut tidak akan dianggap *Mangkir*, dan SLA pekerjaan proyek secara otomatis akan mundur satu hari.

## 4. Alur Kerja Arsitektural (Flowchart)
Diagram di bawah ini menunjukan kompleksitas logika mesin (Engine Logic) ketika HR mengeksekusi sebuah dokumen cuti, mulai dari pemeriksaan berlapis hingga dampaknya terhadap *Payroll*.

```mermaid
flowchart TD
    %% Initiation
    A[Notifikasi Permohonan Baru Masuk] --> B(Buka Modul Approval Cuti)
    B --> C{Sistem Analisa Otomatis}
    
    %% System Auto-Checks
    C -->|Cek 1| D[Apakah Sisa Kuota Cuti Cukup?]
    C -->|Cek 2| E[Apakah Ada Lampiran Bukti Sakit?]
    C -->|Cek 3| F[Apakah Bentrok dengan Agenda Proyek?]

    %% HR Human Decision
    D & E & F --> G{Tindakan Manusia (HR)}
    
    %% Pathways
    G -->|Tolak Mutlak| H[Reject dengan Catatan]
    G -->|Minta Klarifikasi| I[Kembalikan Status ke 'Draft']
    G -->|Setujui Langsung| J[Approve Permohonan]
    
    %% Post-Approval Impact
    J --> K[Sistem Memotong Saldo Cuti DB]
    J --> L[Sistem Menandai Kalender Perusahaan]
    
    %% Payroll Integration
    J --> M{Tipe Cuti?}
    M -->|Unpaid Leave| N[Kirim Notifikasi API ke Modul Finance: Potong Gaji]
    M -->|Paid Leave| O[Abaikan Efek Gaji, Proses Selesai]
    
    %% Final
    H --> P[Notifikasi Push ke Karyawan]
    I --> P
    N --> P
    O --> P
```

## 5. Matriks Otorisasi Absolut & Batasan Etika
Role HR dituntut untuk netral dan memiliki kompartementalisasi akses informasi.

| Fitur/Modul HRIS | Akses Spesifik HR | Limitasi Keras (Hard Restrictions) |
| :--- | :--- | :--- |
| **Persetujuan Cuti/Izin** | Hak Otorisasi Final (Veto). | Tidak dapat mendaftarkan/menyetujui permohonan atas namanya sendiri tanpa di-approve oleh Direktur. |
| **Data Privasi Karyawan** | Visibilitas penuh identitas (KTP, Domisili, Kontak Darurat). | Sangat Dilarang mengunduh dokumen kependudukan dalam format masal (Bulk Download) tanpa izin Admin. |
| **Manajemen Performa/EAR** | Membaca hasil akumulasi (Performance Score). | Tidak memiliki hak merubah, menyetujui, atau membatalkan validasi kerja lapangan (EAR). Itu adalah otoritas Project Manager (PM). |
| **Slip Gaji (Payroll View)**| Hanya dapat melihat *Take Home Pay* pokok untuk keperluan administrasi kredit bank. | Tidak bisa memanipulasi perhitungan komisi, potongan utang, atau mendistribusikan gaji ke bank. |

## 6. Skenario Penyelesaian Masalah (Troubleshooting & Edge Cases)
Dalam dinamika perusahaan, ada banyak kondisi anomali yang harus ditengahi oleh kemampuan analitik HR:
1. **Insiden Pembatalan Cuti yang Sudah Disetujui (Post-Approval Cancellation):**
   - **Kasus:** Seorang karyawan telah disetujui cuti liburan selama 5 hari. Namun di hari H-1, terjadi krisis proyek (Urgent Bug Fix) yang mengharuskannya masuk bekerja, sehingga liburannya batal.
   - **Resolusi HR:** Karena status cuti di sistem sudah "Approved" dan memotong kuota saldo, HR harus menekan fungsi *Revoke & Refund Balance* pada dokumen cuti lama. Sistem secara logis akan mengembalikan saldo cuti sejumlah 5 hari kembali ke akun karyawan, dan membersihkan rekam jejak merah di Kalender Perusahaan tanpa harus merusak laporan audit bulanan.
2. **Karyawan Masuk Rumah Sakit Mendadak (Incapacitated State):**
   - **Kasus:** Seorang staf teknis mengalami kecelakaan parah dan koma, tidak mungkin ia login ke HRIS untuk memencet tombol "Ajukan Izin Sakit". Akibatnya, esok harinya mesin absensi menganggap staf tersebut "Alpa/Mangkir" dan mengancam pemotongan gaji secara otomatis.
   - **Resolusi HR:** HR memiliki kapabilitas "Proxy Request" atau "Form Pengajuan Atas Nama" (Surrogate). HR mengisi form pengajuan izin dengan status darurat atas nama karyawan tersebut. Karena diajukan oleh HR, sistem secara implisit langsung memberikannya status *Auto-Approved* tanpa hirarki bertingkat.
3. **Rollover Cuti Akhir Tahun (Year-End Rollover Conflict):**
   - **Kasus:** Pada tanggal 31 Desember pukul 23:59, sistem HRIS diprogram untuk menghanguskan sisa cuti yang tak terpakai (Reset to Zero). Beberapa karyawan komplain bahwa sisa cutinya hilang.
   - **Resolusi HR:** HR bekerja sama dengan Admin menjalankan modul *Adjustment Script* (Penyesuaian Manual). HR menginput dokumen *Grace Period* yang memberikan pengecualian (ekstensi batas kadaluwarsa) selama 3 bulan pertama di tahun depan secara legal dan tercatat sistem.

## 7. Kebijakan Kepatuhan & Standar Operasional Prosedur (SLA & SOP)
Disiplin prosedural menjaga HR tetap profesional dalam memfasilitasi kebutuhan kolega:
- **SLA Persetujuan Dokumen:** Dalam SOP kelas enterprise, HR diwajibkan menyapu bersih (Clear Queue) semua dokumen Cuti dan Izin masuk maksimal dalam 2x24 jam kalender kerja. Menumpuk *approval* akan menghambat Project Manager dalam mendesain jadwal teknis proyek.
- **Validasi Dokumen Medis (Zero-Trust Policy):** Sistem mewajibkan setiap HR untuk memverifikasi keabsahan stempel surat keterangan sakit yang dilampirkan via PDF. Jika ditemukan manipulasi digital (Pemalsuan Dokumen Cuti), HR wajib merubah status menjadi "Fraud Investigation" yang otomatis memberikan notifikasi kepada pihak manajemen puncak, alih-alih sekadar menolak permohonannya.
- **Integritas Sinkronisasi Payroll:** HR wajib mengunci seluruh pergerakan status absensi (Locking Period) pada tanggal 25 setiap bulannya. Segala revisi cuti atau keterlambatan tidak boleh lagi diotak-atik lewat dari batas tanggal (*cut-off date*) ini karena data sudah dialirkan (streaming) ke database *Finance* untuk kalkulasi pelepasan gaji yang presisi.

## 8. Kesimpulan Peran
Dalam platform canggih seperti HRIS Next, seorang HR bukan lagi sekadar penstempel kertas. Mereka adalah pilot dari "Kalender Sosial" perusahaan. Keputusan mereka mempengaruhi algoritma gaji, rotasi beban kerja, dan kesehatan struktural perusahaan. Memahami setiap alat, peringatan, dan grafik di Dasbor HR adalah kewajiban agar perusahaan tetap berada dalam rel kepatuhan regulasi pemerintah sekaligus menjamin kebahagiaan para pekerjanya secara objektif dan sistematis.
