## 1. Komunitas (Community)

Komunitas adalah kelompok sosial terbesar dalam ekosistem Quran Memo. User dapat membuat atau bergabung ke komunitas untuk menghafal bersama secara terorganisir.

### 1.1 Ketentuan Dasar

- Setiap user dapat membuat komunitas sendiri
- Satu komunitas wajib memiliki **minimal 2 halaqah** sebelum dapat dipublikasikan
- Tidak ada batas maksimal jumlah anggota per komunitas
- Setiap komunitas memiliki satu **Admin/Leader** sebagai pengelola utama
- Komunitas tersedia dalam dua mode:

| Mode       | Keterangan                                               |
| ---------- | -------------------------------------------------------- |
| **Open**   | Siapa saja dapat bergabung tanpa persetujuan admin       |
| **Privat** | Hanya bisa bergabung via undangan atau persetujuan admin |

- Mode privat direkomendasikan untuk madrasah, pesantren, atau lembaga yang menggunakan Quran Memo secara internal

### 1.2 Yang Bisa Dilakukan Admin Komunitas

- Membuat dan mengelola halaqah di dalam komunitas
- Mengatur nama, deskripsi, dan identitas komunitas
- Mengatur mode komunitas: open atau privat
- Menerima atau menolak anggota
- Memantau progress seluruh anggota via dashboard komunitas

---

## 2. Study Group/Halaqah

Halaqah/Study Group adalah unit kelompok belajar di dalam komunitas — atau dapat berdiri mandiri tanpa komunitas.

### 2.1 Ketentuan Dasar

- Jumlah anggota per halaqah: **minimal 5, maksimal 20 orang**
- Setiap halaqah memiliki satu **Ketua Halaqah**
- Halaqah dapat berdiri **mandiri** tanpa bergabung ke komunitas
- Halaqah mandiri tetap memiliki leaderboard internal sendiri
- Halaqah yang tergabung dalam komunitas masuk ke leaderboard komunitas

### 2.2 Perbedaan Halaqah Mandiri vs Halaqah dalam Komunitas

| Aspek                   | Halaqah Mandiri          | Halaqah dalam Komunitas           |
| ----------------------- | ------------------------ | --------------------------------- |
| Leaderboard global      | ✅ Dihitung per user     | ✅ Dihitung per user              |
| Leaderboard regional    | ✅ Dihitung per user     | ✅ Dihitung per user              |
| Leaderboard komunitas   | ❌ Tidak masuk           | ✅ Masuk                          |
| Leaderboard per halaqah | ✅ Internal halaqah saja | ✅ Internal + tampil di komunitas |

---

## 3. Fitur untuk Madrasah & Lembaga

Madrasah, pesantren, dan lembaga tahfiz dapat menggunakan Quran Memo dengan struktur yang sama seperti komunitas reguler, dengan rekomendasi pengaturan berikut:

- Mode komunitas: **Privat**
- Setiap kelas atau kelompok belajar dibuat sebagai **halaqah** tersendiri
- Admin komunitas dipegang oleh pengelola atau koordinator lembaga
- Ketua halaqah dipegang oleh guru atau musyrif kelas

⚠️ Apakah lembaga mendapat fitur khusus tambahan di luar struktur komunitas reguler — belum ditentukan. Misalnya: dashboard lembaga, laporan progress kolektif, atau integrasi musyrif tetap per halaqah.

---

# Leader Board

Leader Board adalah fitur gamifikasi utama yang mendorong semangat bersaing, konsistensi, dan kebersamaan antar user.

### 1 Jenis Leader Board

| Jenis                           | Cakupan                      | Siapa yang Masuk                          |
| ------------------------------- | ---------------------------- | ----------------------------------------- |
| **Global - User**               | Seluruh user Quran Memo      | Semua user, dihitung per individu         |
| **Regional - User**             | Per negara                   | Semua user, dihitung per individu         |
| **Global - Halaqah**            | Seluruh halaqah Quran Memo   | Seluruh halaqah di QuranMemo              |
| **Regional - Halaqah**          | Seluruh halaqah Quran Memo   | Seluruh halaqah di QuranMemo              |
| **Global - Komunitas**          | Seluruh komunitas            | Seluruh komunitas di QuranMemo            |
| **Regional - Komunitas**        | Seluruh komunitas            | Seluruh komunitas di Qur                  |
| **Per Komunitas — All Member**  | Seluruh anggota komunitas    | Anggota komunitas, dihitung per individuo |
| **Per Komunitas — Per Halaqah** | Halaqah dalam satu komunitas | Halaqah sebagai unit, bukan individu      |
| **Per Halaqah**                 | Anggota dalam satu halaqah   | Anggota halaqah, dihitung per individu    |

### 2 Periode Leaderboard

Semua jenis leaderboard tersedia dalam tiga periode — user dapat switch tampilan:

| Periode      | Keterangan                                                      |
| ------------ | --------------------------------------------------------------- |
| **Pekanan**  | Reset setiap Senin pukul 00.00 — mendorong konsistensi mingguan |
| **Bulanan**  | Reset setiap tanggal 1 — mendorong target jangka menengah       |
| **All-time** | Tidak pernah reset — mencerminkan dedikasi jangka panjang       |

<aside>
💡

Ada leaderboard khusus event!

</aside>

### 4.3 Basis XP Leaderboard

XP yang masuk ke leaderboard bersumber dari seluruh aktivitas hafalan:

| Aktivitas                   | XP                  |
| --------------------------- | ------------------- |
| Menyelesaikan mini target   | ⚠️ belum ditentukan |
| Checkpoint per juz          | ⚠️ belum ditentukan |
| Checkpoint 3/5/10/15/20 juz | ⚠️ belum ditentukan |
| Setoran ke musyrif          | ⚠️ belum ditentukan |
| Streak harian               | ⚠️ belum ditentukan |
| Nilai setoran Mumtaz        | ⚠️ belum ditentukan |

⚠️ Besaran XP per aktivitas perlu ditentukan. Rekomendasi: XP tidak flat — kualitas setoran mempengaruhi besaran XP agar leaderboard mencerminkan kualitas hafalan, bukan sekadar kuantitas aktivitas.

### 4.4 Catatan Tambahan

**Privasi leaderboard**
Tidak semua user nyaman namanya tampil di ranking publik. Direkomendasikan ada opsi **mode anonim** di leaderboard global dan regional — nama diganti username atau disembunyikan, XP tetap terhitung.
⚠️ Apakah mode anonim akan diadopsi — belum diputuskan.

**Leaderboard per komunitas — per halaqah**
Di leaderboard komunitas mode "per halaqah", yang dibandingkan adalah **halaqah sebagai unit** — bukan individu. Perlu ditentukan bagaimana XP halaqah dihitung: total XP semua anggota, rata-rata XP per anggota, atau kombinasi keduanya.
⚠️ Metode kalkulasi XP halaqah sebagai unit belum ditentukan.

---

## 5. Keputusan yang Masih Diperlukan

| #   | Isu                                                               | Dampak                          |
| --- | ----------------------------------------------------------------- | ------------------------------- |
| 1   | Fitur tambahan untuk lembaga di luar struktur komunitas reguler?  | Segmen madrasah/pesantren       |
| 2   | Besaran XP per aktivitas                                          | Sistem gamifikasi & leaderboard |
| 3   | Apakah kualitas setoran mempengaruhi besaran XP?                  | Integritas leaderboard          |
| 4   | Opsi mode anonim di leaderboard publik?                           | Privasi user                    |
| 5   | Metode kalkulasi XP halaqah sebagai unit di leaderboard komunitas | Leaderboard per halaqah         |
| 6   | Apakah komunitas/halaqah bisa punya musyrif tetap?                | Koneksi ke ekosistem musyrif    |
