# 🧮 Sistem Mata Uang & Progres – Qur'anMemo

---

## 1. XP (Experience Points)

**XP adalah mata uang progres yang mencerminkan effort nyata pengguna.**

- ✅ Tidak bisa dibeli  
- ✅ Tidak bisa dikonversi ke Energy  
- ✅ Hanya didapat dari aktivitas menghafal

### Cara Mendapatkan XP

| Aktivitas | XP |
|-----------|-----|
| 1 step hafalan | 20 XP |
| 1 misi harian | 35 XP |

### Fungsi XP

- Naik level
- Peringkat di leaderboard
- Menentukan **reward Gems per Juz** (semakin tinggi level, semakin besar reward)

> ✨ **Catatan Desain:** XP sengaja dipisahkan dari Energy agar tidak ada shortcut. User tidak bisa "membeli" progres.

---

## 2. Energy

**Energy adalah token akses harian** untuk membatasi jumlah belajar dalam sehari.  
Tujuannya: mencegah overload hafalan & mendorong konsistensi jangka panjang.

### Mekanisme Dasar

| Aturan | Keterangan |
|--------|-------------|
| Kuota harian | 25 Energy |
| Reset waktu | Setiap hari pukul 03.00 |
| 1 tahap hafalan | -1 Energy |
| Jika habis | Harus tunggu reset atau pakai Gems |

### Cara Mendapatkan Energy Tambahan

| Sumber | Energy |
|--------|--------|
| Claim reward login harian | Sesuai jadwal |
| 5 step berturut-turut tanpa salah | +4 Energy |
| Konversi dari Gems | Lihat tabel konversi |

> ⚠️ **Catatan:** Kuota 25 Energy/hari dibuat konservatif untuk mendorong kebiasaan harian. Nilai ini bisa disesuaikan berdasarkan data retensi user.

### Tabel Perubahan Energy

| Event | Perubahan Energy |
|-------|------------------|
| Reset harian (03.00) | ↻ 25 (isi ulang kuota) |
| Membuka 1 tahap hafalan | −1 |
| 5 step berturut-turut tanpa salah | +4 |
| Konversi 100 Gems | +15 |
| Konversi 200 Gems | +35 (lebih efisien) |

---

## 3. Gems

**Gems adalah mata uang reward** dari pencapaian hafalan.  
Bisa dikonversi ke **Energy** jika kuota harian habis.

### Reward per Pencapaian

| Pencapaian | Gems |
|------------|------|
| Per target | 55 |
| Per surah (< 30 ayat) | 75 |
| Per surah (30–80 ayat) | 120 |
| Per surah (81–100 ayat) | 150 |
| Per surah (> 100 ayat) | 250 |
| Per check point | 150 |
| Per juz (skala dengan level) | 1.000 + (level × 100) |

> 📌 **Catatan batas surah:**  
> Surah dengan tepat 30 ayat masuk kategori **30–80 ayat** (inklusif di batas atas).

### Konversi Gems → Energy

| Gems Keluar | Energy Masuk | Efisiensi |
|-------------|--------------|------------|
| 100 Gems | 15 Energy | 6.7 Gems/Energy |
| 200 Gems | 35 Energy | **5.7 Gems/Energy** (lebih hemat) |

> 💡 Tier kedua sengaja dibuat lebih efisien agar user punya alasan untuk memilih nominal lebih besar.

---

## 4. Ringkasan Hubungan Antar Mata Uang

| Mata Uang | Sumber | Kegunaan | Bisa Dibeli? |
|-----------|--------|----------|---------------|
| **XP** | Hafalan (per step), misi harian | Level, leaderboard, reward Gems per Juz | ❌ Tidak |
| **Energy** | Reset harian, bonus, konversi Gems | Akses tahap hafalan | ❌ Tidak langsung (via Gems) |
| **Gems** | Pencapaian hafalan (target, surah, juz, dll) | Konversi ke Energy | ❌ Tidak |

---

## 5. Alur Sederhana dalam Sesi Hafalan

```mermaid
flowchart LR
    A[Mulai sesi] --> B{Energy > 0?}
    B -->|Ya| C[-1 Energy\n +Progres]
    B -->|Tidak| D[Pakai Gems\n atau tunggu reset]
    C --> E[Akhiri tahap]
    E --> F[+20 XP\n +Reward Gems jika capai target]

----


6. Catatan untuk Developer
XP & Energy tidak boleh saling dikonversi (desain disengaja)

Reset Energy pukul 03.00 harus berbasis server (bukan local time user)

Bonus 5 step berturut-turut tanpa salah perlu mekanisme streak counter per sesi

Konversi Gems → Energy harus ada konfirmasi karena tidak bisa dibatalkan