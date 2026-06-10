const fs = require('fs');

const adminContent = `
                {activeTab === 'admin' && (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="mb-8 border-b border-slate-100 pb-8">
                      <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">Administrator (Admin)</h1>
                      <p className="text-[13px] text-slate-500 max-w-3xl leading-relaxed mb-6">
                        Administrator adalah peran tingkat tertinggi (root) yang dibangun khusus untuk mengawasi operasional teknis HRIS. Admin memiliki izin tanpa batas untuk mengelola, mengubah, atau memvalidasi data lintas departemen secara langsung.
                      </p>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Tinjauan</th>
                              <th className="py-3 px-4 font-bold text-slate-700">Detail</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Konteks Peran</td>
                              <td className="py-3 px-4 text-slate-600">Akses langsung ke seluruh API dan menu antarmuka.</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Kesesuaian Ideal</td>
                              <td className="py-3 px-4 text-slate-600">Tim IT, CTO, atau System Administrator.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Rekomendasi Jalur (First Steps)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-indigo-300 transition-colors">
                          <div className="text-indigo-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs">1</div> Setup Pengguna</div>
                          <h3 className="font-bold text-slate-800 mb-2">Manajemen Kredensial</h3>
                          <p className="text-[12px] text-slate-500">Pelajari cara menambahkan akun baru, reset password, dan blokir akses melalui modul Manajemen Pengguna.</p>
                        </div>
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-indigo-300 transition-colors">
                          <div className="text-indigo-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs">2</div> Pahami Override</div>
                          <h3 className="font-bold text-slate-800 mb-2">Bypass Persetujuan</h3>
                          <p className="text-[12px] text-slate-500">Uji coba menyetujui dokumen Cuti atau Pembelian yang terkunci di Manajer yang sedang berhalangan hadir.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Kapabilitas Kunci</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4 p-5 border border-slate-100 bg-slate-50 rounded-xl">
                          <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0"/>
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Akses Lintas Modul (Global Scope)</h3>
                            <p className="text-[13px] text-slate-600">Menembus pembatasan sidebar. Admin melihat seluruh menu, termasuk metrik keuangan, metrik SDM, log proyek, dan aktivitas harian personal.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
`;

const hrContent = `
                {activeTab === 'hr' && (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="mb-8 border-b border-slate-100 pb-8">
                      <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">Human Resources (HR)</h1>
                      <p className="text-[13px] text-slate-500 max-w-3xl leading-relaxed mb-6">
                        HR difokuskan pada pengelolaan kesejahteraan pegawai dan kepatuhan administratif. Mereka memonitor presensi, izin cuti, serta pergerakan organisasi dari perspektif personil.
                      </p>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Tinjauan</th>
                              <th className="py-3 px-4 font-bold text-slate-700">Detail</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Konteks Peran</td>
                              <td className="py-3 px-4 text-slate-600">Fokus pada Modul Cuti, Master Data, dan Presensi Kalender.</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Kesesuaian Ideal</td>
                              <td className="py-3 px-4 text-slate-600">Personalia, HRD, Talent Acquisition.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Rekomendasi Jalur (First Steps)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-emerald-300 transition-colors">
                          <div className="text-emerald-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">1</div> Pemantauan Kalender</div>
                          <h3 className="font-bold text-slate-800 mb-2">Tinjau Beban Organisasi</h3>
                          <p className="text-[12px] text-slate-500">Cek Kalender Perusahaan untuk melihat tumpukan Cuti (merah) atau SPD (kuning) guna mengantisipasi kelangkaan SDM.</p>
                        </div>
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-emerald-300 transition-colors">
                          <div className="text-emerald-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">2</div> Dasbor HR</div>
                          <h3 className="font-bold text-slate-800 mb-2">Eksekusi Pending Request</h3>
                          <p className="text-[12px] text-slate-500">Selesaikan seluruh antrean permohonan Cuti yang menunggu persetujuan pada widget "Butuh Tindakan".</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Kapabilitas Kunci</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4 p-5 border border-slate-100 bg-slate-50 rounded-xl">
                          <Users className="w-6 h-6 text-emerald-600 shrink-0"/>
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Manajemen Cuti Terpusat</h3>
                            <p className="text-[13px] text-slate-600">Menganalisa sisa kuota cuti karyawan dan memutuskan validitas permohonan Izin/Cuti dengan mencocokkan jadwal proyek.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
`;

const financeContent = `
                {activeTab === 'finance' && (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="mb-8 border-b border-slate-100 pb-8">
                      <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">Finance (Keuangan)</h1>
                      <p className="text-[13px] text-slate-500 max-w-3xl leading-relaxed mb-6">
                        Finance bertanggung jawab atas aliran dana keluar, pengelolaan penggajian, dan persetujuan pembelian. Mereka menjaga kesehatan moneter dari seluruh aktivitas karyawan.
                      </p>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Tinjauan</th>
                              <th className="py-3 px-4 font-bold text-slate-700">Detail</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Konteks Peran</td>
                              <td className="py-3 px-4 text-slate-600">Akses Modul Penggajian, Pembelian, Tagihan, dan Approval Dana.</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Kesesuaian Ideal</td>
                              <td className="py-3 px-4 text-slate-600">CFO, Staf Akuntansi, Bendahara.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Rekomendasi Jalur (First Steps)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-amber-300 transition-colors">
                          <div className="text-amber-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs">1</div> Proses Payroll</div>
                          <h3 className="font-bold text-slate-800 mb-2">Simulasi Penggajian</h3>
                          <p className="text-[12px] text-slate-500">Masuk ke modul Penggajian untuk mencetak slip dan memverifikasi perhitungan potogan BPJS/Pajak karyawan otomatis.</p>
                        </div>
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-amber-300 transition-colors">
                          <div className="text-amber-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs">2</div> Eksekusi PO</div>
                          <h3 className="font-bold text-slate-800 mb-2">Otorisasi Pembelian</h3>
                          <p className="text-[12px] text-slate-500">Tinjau antrean "Purchase Order" (PO) untuk mencairkan anggaran operasional proyek (CAPEX/OPEX).</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Kapabilitas Kunci</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4 p-5 border border-slate-100 bg-slate-50 rounded-xl">
                          <CreditCard className="w-6 h-6 text-amber-600 shrink-0"/>
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Distribusi Slip Gaji & Rekonsiliasi</h3>
                            <p className="text-[13px] text-slate-600">Mengelola siklus penggajian bulanan, memastikan komponen upah tersinkronisasi, dan merilis dana pembayaran tagihan ke vendor via modul Keuangan Terpusat.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
`;

const pmContent = `
                {activeTab === 'pm' && (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="mb-8 border-b border-slate-100 pb-8">
                      <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">Project Manager (PM)</h1>
                      <p className="text-[13px] text-slate-500 max-w-3xl leading-relaxed mb-6">
                        Project Manager adalah motor penggerak eksekusi lapangan. Mereka mengatur pembagian tugas (Kanban), memantau kemajuan riil, dan menyetujui Laporan Pekerjaan harian dari anggota tim.
                      </p>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Tinjauan</th>
                              <th className="py-3 px-4 font-bold text-slate-700">Detail</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Konteks Peran</td>
                              <td className="py-3 px-4 text-slate-600">Akses Modul Proyek, Kanban, dan Persetujuan EAR (Realisasi).</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Kesesuaian Ideal</td>
                              <td className="py-3 px-4 text-slate-600">Team Lead, Supervisor Lapangan, Manajer Proyek.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Rekomendasi Jalur (First Steps)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-purple-300 transition-colors">
                          <div className="text-purple-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs">1</div> Board Interaktif</div>
                          <h3 className="font-bold text-slate-800 mb-2">Pindahkan Status Task</h3>
                          <p className="text-[12px] text-slate-500">Buka modul "Kelola Proyek" dan gunakan <em>Drag and Drop</em> di Papan Kanban untuk mengubah progress pekerjaan (Todo, In-Progress, Done).</p>
                        </div>
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-purple-300 transition-colors">
                          <div className="text-purple-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs">2</div> Cek Laporan Tim</div>
                          <h3 className="font-bold text-slate-800 mb-2">Validasi EAR</h3>
                          <p className="text-[12px] text-slate-500">Setujui (Approve) laporan Realisasi Kerja Harian (EAR) yang diajukan oleh karyawan proyek yang Anda supervisi.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Kapabilitas Kunci</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4 p-5 border border-slate-100 bg-slate-50 rounded-xl">
                          <Briefcase className="w-6 h-6 text-purple-600 shrink-0"/>
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Visibilitas Komprehensif Proyek</h3>
                            <p className="text-[13px] text-slate-600">Melihat perbandingan antara <em>Planned vs Actual Work</em>, memantau penggunaan biaya proyek secara <em>real-time</em>, dan menyetujui SPD karyawan teknis untuk keperluan lapangan.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
`;

const karyawanContent = `
                {activeTab === 'karyawan' && (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="mb-8 border-b border-slate-100 pb-8">
                      <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">Karyawan Umum</h1>
                      <p className="text-[13px] text-slate-500 max-w-3xl leading-relaxed mb-6">
                        Karyawan adalah entitas utama pembuat data (Data Creator). Mereka merancang jadwal, merealisasikan tugas, meminta cuti liburan, serta menerima kompensasi upah.
                      </p>
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <table className="w-full text-left text-[13px]">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Tinjauan</th>
                              <th className="py-3 px-4 font-bold text-slate-700">Detail</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Konteks Peran</td>
                              <td className="py-3 px-4 text-slate-600">Akses Mandiri (Self-Service) untuk pembuatan dokumen.</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-slate-800">Kesesuaian Ideal</td>
                              <td className="py-3 px-4 text-slate-600">Staf Reguler, Operator Lapangan, Entitas Individual.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Rekomendasi Jalur (First Steps)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-rose-300 transition-colors">
                          <div className="text-rose-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs">1</div> Pengajuan Dokumen</div>
                          <h3 className="font-bold text-slate-800 mb-2">Eksplorasi Self-Service</h3>
                          <p className="text-[12px] text-slate-500">Cobalah membuat Rencana Kerja baru, kemudian buat Realisasi berdasarkan rencana tersebut melalui Modul Karyawan.</p>
                        </div>
                        <div className="p-5 border border-slate-200 rounded-xl bg-white hover:border-rose-300 transition-colors">
                          <div className="text-rose-600 font-bold mb-2 text-sm flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-xs">2</div> Cetak Riwayat</div>
                          <h3 className="font-bold text-slate-800 mb-2">Slip Gaji & Bukti</h3>
                          <p className="text-[12px] text-slate-500">Kunjungi halaman Penggajian Personal untuk membuka PDF rincian Slip Gaji resmi tanpa harus memintanya secara manual ke bagian Finance.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-6">Kapabilitas Kunci</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4 p-5 border border-slate-100 bg-slate-50 rounded-xl">
                          <Users className="w-6 h-6 text-rose-600 shrink-0"/>
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Isolasi Keamanan (Privacy First)</h3>
                            <p className="text-[13px] text-slate-600">Setiap Karyawan hanya dapat melihat dan memodifikasi data miliknya sendiri. Tidak ada kebocoran privasi gaji, riwayat sanksi, atau cuti ke sesama kolega.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
`;

const file = 'src/app/(authenticated)/documentation/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Normalize newlines in the file content
content = content.replace(/\r\n/g, '\n');

// Find the start and end of the div we want to replace
const startStr = '<div className="p-6">';
const endStr = '</div>\n            </div>\n          </div>';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const newInner = adminContent + hrContent + financeContent + pmContent + karyawanContent;
  const newContent = content.substring(0, startIdx + startStr.length) + '\n' + newInner + '\n              ' + content.substring(endIdx);
  fs.writeFileSync(file, newContent);
  console.log('Replaced content successfully');
} else {
  console.log('Failed to find replacement markers.');
  console.log('startIdx:', startIdx, 'endIdx:', endIdx);
}
