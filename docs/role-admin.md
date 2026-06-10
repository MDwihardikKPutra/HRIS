# Administrator (Admin) - Dokumentasi Peran Komprehensif

## 1. Abstrak & Tinjauan Eksekutif
Administrator (sering disebut sebagai System Administrator atau Root) adalah puncak hierarki hak akses di dalam ekosistem HRIS Next. Peran ini tidak didesain untuk penggunaan harian oleh staf manajerial biasa, melainkan dirancang secara khusus untuk tim Infrastruktur IT, Chief Technology Officer (CTO), atau personel khusus yang ditugaskan untuk mengamankan, mengonfigurasi, dan merawat mesin utama aplikasi. Di dalam sistem HRIS, peran ini memiliki kekuatan absolut, yang berarti setiap tindakan yang dilakukan oleh Administrator dapat berdampak secara langsung, seketika (real-time), dan mengubah fondasi arsitektur data. Dokumentasi ini disusun untuk memandu Administrator memahami kedalaman, konsekuensi, serta standar operasi dalam menjalankan wewenang tersebut tanpa merusak integritas data (data integrity) yang ada di dalam database perusahaan. 

## 2. Filosofi Hak Akses & Konteks Peran
Di dalam desain perangkat lunak berkelas enterprise (RBAC - Role Based Access Control), sebuah sistem yang stabil membutuhkan setidaknya satu entitas yang memiliki status "Global Scope". Filosofi utama dari peran Administrator adalah:
- **Penyelesai Kebuntuan (The Ultimate Fallback):** Ketika sebuah proses persetujuan (approval workflow) terhenti karena masalah teknis atau karena ketiadaan personel kunci (misalnya seorang Manajer Proyek kecelakaan dan tidak dapat menyetujui transaksi penting), Administrator hadir sebagai *override layer* yang memecahkan kebuntuan tersebut.
- **Isolasi Infrastruktur:** Admin mengisolasi kerumitan teknis (seperti pengaturan server, pembuatan cabang departemen baru, sinkronisasi data antar modul) sehingga pengguna biasa (End-User) hanya melihat antarmuka yang bersih dan berfokus pada pekerjaan mereka.
- **Pengawasan Panoptikon:** Admin adalah entitas satu-satunya yang mampu melihat jejak aktivitas (Audit Trail) dari seluruh *role* lainnya. Hal ini esensial untuk menjaga kepatuhan sistem terhadap audit keamanan informasi (seperti ISO 27001).

## 3. Rincian Tanggung Jawab Operasional dan Teknis
Sebagai pemegang kunci utama, Administrator memegang kendali penuh atas modul-modul berikut. Setiap modul memiliki kompleksitas dan risiko yang harus dipahami:

### A. Manajemen Kredensial & Pengguna (User Management)
Admin bertanggung jawab penuh terhadap siklus hidup (lifecycle) sebuah akun.
- **Onboarding (Pembuatan Akun):** Melakukan injeksi data ke dalam database pengguna. Ini mencakup penentuan Role, penetapan Departemen, Posisi (Jabatan), dan penentuan akses sandi sementara (temporary password). Admin harus memastikan bahwa email yang didaftarkan terhubung ke server SMTP internal perusahaan untuk notifikasi yang sah.
- **Offboarding (Penonaktifan Akun):** Ketika seorang karyawan *resign* (mengundurkan diri) atau dipecat, Admin dilarang menggunakan fungsi *Hard Delete* (menghapus permanen dari database) untuk menjaga relasi *foreign key* dari rekam jejak finansial masa lalu. Alih-alih dihapus, Admin akan mengubah status akun menjadi "Inactive" atau "Suspended", yang memutus akses *login* namun mempertahankan riwayat kerjanya di masa lampau.
- **Modifikasi Hak Akses:** Jika terjadi mutasi atau promosi, Admin bertanggung jawab mencabut role lama (misalnya: dari Karyawan biasa menjadi HR Manager) dan memastikan *session login* lama di-flush agar akses baru segera efektif.

### B. Konfigurasi Master Data
Master Data adalah data statis dasar yang menjadi pilar seluruh modul operasional.
- **Hierarki Departemen:** Menambah atau merestrukturisasi departemen (misalnya memecah divisi "Tech" menjadi "Frontend" dan "Backend").
- **Parameter Sistem:** Mengubah batas nilai, misalnya maksimal hari cuti tahunan, batasan toleransi *late check-in*, atau penambahan lokasi/cabang kantor yang baru untuk kebutuhan Geolocation.

### C. Eksekusi "Emergency Bypass"
Dalam situasi *force majeure* (kondisi tak terduga):
- Admin dapat menyetujui (Approve) secara paksa dokumen Purchase Order (PO) yang bernilai ratusan juta rupiah yang *stuck* di antrean.
- Admin dapat menolak (Reject) Surat Perintah Dinas (SPD) yang diajukan oleh Manajer sekalipun.
Setiap kali fungsi *Bypass* ditekan, sistem secara otomatis merekam *Timestamp*, IP Address, dan Catatan (Remarks) ke dalam *System Log* untuk keperluan audit investigatif.

## 4. Alur Kerja Arsitektural (Flowchart)

Diagram berikut tidak hanya menjelaskan alur klik antarmuka, melainkan relasi *state machine* ketika Administrator melakukan tindakan teknis.

```mermaid
flowchart TD
    %% Admin Authentication Loop
    A[Portal Login Admin] -->|Enkripsi JWT| B{Otentikasi & Otorisasi}
    B -->|Akses Ditolak| Z[Catat Log Kegagalan Login]
    B -->|Akses Diterima| C[Dashboard Global Area]

    %% Main Branching
    C --> D[Modul Manajemen Pengguna]
    C --> E[Modul Master Data]
    C --> F[Modul Audit & Bypass]

    %% User Management Branch
    D --> D1{Operasi Akun}
    D1 -->|Soft Delete| D2[Ubah Status: Suspended]
    D1 -->|Create| D3[Generate Hash Password & Send Email]
    D1 -->|Mutasi Role| D4[Re-assign RBAC Permissions]

    %% Bypass Branch
    F --> F1[Ambil Alih Permohonan Pending]
    F1 --> F2{Validasi Kondisi Darurat?}
    F2 -- Ya --> F3[Eksekusi Override (Approve/Reject)]
    F2 -- Tidak --> F4[Tinggalkan untuk Approver Asli]
    
    %% Audit Trails
    D2 --> AuditLog[(System Audit Database)]
    D3 --> AuditLog
    D4 --> AuditLog
    F3 --> AuditLog

    %% State Reflection
    AuditLog --> H[Pembaruan Status Real-time via WebSocket]
```

## 5. Matriks Otorisasi Absolut & Batasan Etika
Dalam sistem RBAC, Administrator memiliki status tertingginya, namun dibatasi oleh pedoman etika perusahaan:

| Ruang Lingkup Data | Akses Teknis Sistem | Batasan Etika Bisnis (SOP Compliance) |
| :--- | :--- | :--- |
| **Profil Identitas Karyawan** | `[CRUD]` Penuh (Bisa mengubah nama, email, NIK). | Tidak boleh mengubah struktur nama resmi tanpa lampiran dokumen kependudukan dari HR. |
| **Data Gaji & Finansial** | `[READ]` Mampu melihat database gaji di backend. | Sangat Dilarang (Strictly Prohibited) mengubah angka pokok (*base salary*) lewat *backdoor* tanpa perintah Direksi. |
| **Cuti & Absensi** | `[UPDATE]` Mampu mereset sisa kuota cuti. | Penggunaan hanya saat *bug* sistem mengurangi kuota secara tidak sengaja. |
| **Audit Logs** | `[READ]` Hanya dapat membaca (Immutable). | Log aktivitas adalah tabel suci. Admin **TIDAK BISA** menghapus atau memodifikasi *Audit Trail* demi keamanan investigasi (Anti-Tampering). |

## 6. Skenario Penyelesaian Masalah (Troubleshooting & Edge Cases)

Terdapat berbagai anomali sistem (Edge Cases) di mana peran Administrator sangat vital:
1. **Insiden "Ghost Approver":** 
   - **Kasus:** Seorang Project Manager resign dari perusahaan, namun masih ada 15 laporan Realisasi Pekerjaan (EAR) dan permohonan Cuti yang menunggu persetujuannya di sistem. HR tidak bisa melakukan apa-apa.
   - **Resolusi Admin:** Admin masuk ke modul Manajemen Proyek (Global), menghapus penetapan (*un-assign*) PM lama dari proyek tersebut, lalu menugaskan PM pengganti. Semua antrean otomatis akan berpindah ke *dashboard* PM yang baru.
2. **Insiden "Locked Out" / Lupa Sandi Massal:**
   - **Kasus:** Terjadi masalah pada sinkronisasi *Active Directory* atau migrasi server yang mengakibatkan 50 karyawan gagal *login*.
   - **Resolusi Admin:** Admin melakukan *bulk password reset* menggunakan skrip internal (jika tersedia), lalu menggunakan API sistem untuk memancarkan email tautan *reset* kepada ke-50 karyawan secara serentak tanpa perlu mengintervensi database secara manual satu per satu.
3. **Peringatan Keamanan (Multiple Failed Logins):**
   - **Kasus:** Sistem mendeteksi adanya serangan *Brute Force* ke akun *Finance* dari IP tak dikenal.
   - **Resolusi Admin:** Admin menerima notifikasi melalui panel Audit, langsung melakukan penguncian (*Emergency Lock*) pada akun Finance, memaksa keluar (*Force Logout*) seluruh *session* yang aktif, dan meminta pemilik akun melakukan verifikasi dua langkah (MFA) ulang.

## 7. Kebijakan Kepatuhan & Standar Operasional Prosedur (SLA & SOP)
Untuk mencegah penyalahgunaan kekuasaan teknis (Abuse of Power), Administrator diwajibkan mengikuti SOP ketat:
- **SLA Respons Cepat:** Setiap tiket *Bypass Approval* atau *Reset Akun* wajib diselesaikan dalam kurun waktu **maksimal 4 jam kerja**. Kerusakan konfigurasi (misal, Departemen tidak muncul) harus diperbaiki seketika (Critical Priority).
- **Protokol *No-Delete*:** Di bawah keadaan apa pun, Administrator tidak diperkenankan menjalankan instruksi SQL `DELETE FROM table_name` untuk data inti transaksional (seperti rekaman tagihan atau rekam medis cuti). Jika ada data salah masukkan, pendekatannya adalah *Soft Delete* (mengubah flag `is_deleted = true`).
- **Prinsip *Least Privilege* Transisional:** Jika seorang Admin sedang cuti liburan panjang, ia diwajibkan menyerahkan akses super (delegasi) kepada sub-Admin atau IT Lead, dan akses tersebut harus dicabut otomatis oleh sistem tepat pada hari Admin utama kembali bekerja.

## 8. Kesimpulan Peran
Administrator di HRIS Next adalah jantung pertahanan dan penggerak infrastruktur. Dibutuhkan pengetahuan mendalam tentang alur data, logika *database relasional*, dan disiplin etika tinggi. Kesalahan kecil dalam pengubahan *Master Data* oleh Admin dapat beresonansi dan melumpuhkan laporan operasional seluruh divisi perusahaan. Oleh karenanya, prinsip kehati-hatian, kepatuhan pada Audit, dan dokumentasi setiap tindakan adalah nyawa dari peran Administrator.
