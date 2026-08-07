# Sistem Placement Test — Quran Memo (v2, Simplified)

## Latar Belakang

Onboarding lama (levelling statis Beginner→Mid→Pro berurutan) diganti dengan sistem placement test yang lebih ringkas: musyrif yang menentukan level/rekomendasi, bukan sistem AI otomatis. Threshold angka tetap ada, tapi fungsinya jadi **pedoman penilaian musyrif**, bukan keputusan otomatis sistem.

Hasil akhir placement test mengarahkan user ke salah satu dari 3 kategori:

| Kategori | Arti |
| --- | --- |
| **RBQ** (Reflek Baca Quran) | Bacaan masih dasar, perlu benerin cara baca dulu |
| **RTQ** (Reflek Tajwidul Quran) | Sudah bisa baca lancar, tapi tajwid belum stabil |
| **Rekomendasi Hafalan/Tahfidz** | Bacaan sudah layak, langsung boleh mulai menghafal |

---

## 1. Placement Test Bacaan

### 1.1 Gate Question

**"Sudah bisa baca Quran atau belum?"**

- **Belum bisa** → otomatis masuk **RBQ**, skip uji rekam (nggak masuk akal minta rekam kalau belum bisa baca sama sekali)
- **Bisa** → lanjut ke Uji Baca

### 1.2 Uji Baca

- **Instruksi:** user mengirim rekaman bacaan QS Maryam ayat 1-10

### 1.3 Verifikasi

- **Diverifikasi manual oleh musyrif Quran Memo** (tidak pakai AI)
- **SLA:** maksimal 1x24 jam sejak rekaman dikirim
- Musyrif dengar rekaman, lalu menentukan kategori user (RBQ / RTQ / Rekomendasi Hafalan)

### 1.4 Pedoman Penilaian Musyrif (bukan keputusan otomatis)

**Indikasi arah RBQ** (Kualitas bacaan rendah - begginer level):

1. Masih tertukar antar huruf, masih terbalik antar huruf.
2. Membaca Al-Qurannya terlalu lambat. Hal ini dikarenakan ia masih membaca Al-Quran sambil memperhatikan struktur kata setelahnya (ini yang membuatnya lambat sekali membaca Al-Quran)
3. Belum bisa membedakan bacaan panjang dan pendek
4. Waqaf sembarangan (terutama waqaf di tengah-tengah kata)

**Indikasi arah RTQ** (Lancar membaca, tapi tajwidnya perlu perbaikan - mid level):

1. Aspek Huruf. Pembahasan tentang Huruf ini meliputi 2 hal: Makharijul Huruf (Tempat keluar Huruf) dan Sifatul Huruf (Sifat-sifat Huruf)
2. Aspek Tajwid. Yaitu pembahasan tentang Istilah-istilah Tajwid yang umum digunakan
3. Aspek Waqaf. Pembahasan tentang bagaimana waqaf yang baik dan benar

**Indikasi arah Rekomendasi Hafalan:**

- Lancar, tempo wajar, tajwid diterapkan dengan baik, kualitas huruf sudah presisi

Angka-angka ini fleksibel di tangan musyrif — kalau user borderline, musyrif boleh pakai judgment (misal dengar konsistensi di beberapa ayat, bukan cuma skor rata-rata).

---

## 2. Placement Test Hafalan

### 2.1 Onboarding Question (tanpa uji verifikasi audio)

1. **Sudah pernah menghafal Quran atau belum?**
2. Kalau pernah, **surat apa saja yang pernah dihafal?** (checklist per surat/juz)

Tidak ada uji rekam/verifikasi acak untuk hafalan di versi ini — cukup dari jawaban onboarding.

### 2.2 Rekomendasi Surat oleh Musyrif

Musyrif memberi **rekomendasi surat/target hafalan**, berdasarkan gabungan dua data:

- Hasil Placement Test Bacaan (RBQ / RTQ / Rekomendasi Hafalan)
- Jawaban onboarding hafalan (pernah hafal apa aja)

Contoh logika: kalau user RBQ tapi udah pernah hafal beberapa surat pendek → musyrif bisa rekomendasikan lanjut mode dengar-ulang untuk surat pendek lain sambil jalan RBQ. Kalau Rekomendasi Hafalan dan belum pernah hafal apa-apa → musyrif rekomendasikan mulai dari Juz Amma.

### 2.3 Free Will User

Meskipun musyrif kasih rekomendasi, **user yang sudah masuk level Menghafal tetap bebas pilih surat sendiri** — rekomendasi musyrif sifatnya saran/starting point, bukan gate yang mengunci pilihan.

---

## 3. Modul Hafalan — 2 Jalur (tidak berubah dari draft sebelumnya)

- **Self-paced:** user pilih target sendiri (per ayat / halaman / surat / mini target)
- **Roadmap Levelling** (sistem lama): Beginner (Juz Amma) → Mid (Tabarak, Juz 28-29, Al-Waqiah, Ar-Rahman) → Pro (Juz 1-27) — tetap dipakai sebagai salah satu opsi jalur

---

## 4. Alur Keseluruhan (Onboarding End-to-End)

1. Intro/welcome
2. Gate question: bisa baca Quran atau belum?
3. **Belum bisa** → otomatis RBQ, skip ke langkah 7
4. **Bisa** → kirim rekaman Maryam 1-10
5. Musyrif verifikasi (maks 1x24 jam)
6. Musyrif tentukan kategori: RBQ / RTQ / Rekomendasi Hafalan
7. Notifikasi hasil ke user
8. (Kalau RBQ/RTQ) → mulai modul perbaikan bacaan yang sesuai
9. (Kalau Rekomendasi Hafalan, atau user tetap mau lanjut walau RBQ/RTQ) → Onboarding Question Hafalan
10. Musyrif kasih rekomendasi surat/target
11. User pilih: ikut rekomendasi musyrif ATAU pilih surat sendiri (free will)
12. Pilih jalur: Self-paced atau Roadmap Levelling
13. Mulai

---

## 5. Open Questions

1. Kalau user RBQ/RTQ tapi tetap mau langsung hafal (bukan mode audio-led vs mandiri kayak draft sebelumnya) — apakah opsi mode hafalan berbeda ini masih relevan dipertahankan di versi simplified ini, atau dianggap keputusan musyrif kasus per kasus?
2. Kapasitas musyrif: berapa banyak submission yang realistis direview per hari dalam SLA 1x24 jam?
3. Apakah rekomendasi surat dari musyrif ditampilkan sebagai teks/note biasa, atau perlu semacam "paket rekomendasi" yang bisa langsung di-klik user buat mulai?