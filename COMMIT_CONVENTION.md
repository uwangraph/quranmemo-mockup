# Pedoman Commit Git - QuranMemo Mockup

Setiap kali asisten AI (seperti Antigravity atau model AI lainnya) melakukan commit Git di dalam repositori ini atas permintaan user, **wajib** mematuhi ketentuan-ketentuan berikut secara otomatis tanpa perlu diingatkan kembali.

## 📋 Ketentuan Utama Commit

1. **Bahasa Indonesia**: Seluruh pesan commit (baik judul maupun deskripsi detail) harus ditulis menggunakan Bahasa Indonesia yang baik, jelas, dan profesional.
2. **Sertakan Deskripsi di Setiap Commit**:
   *   Pesan commit harus terdiri dari **judul singkat** (di baris pertama) dan **deskripsi detail** (di baris/paragraf berikutnya) yang menerangkan apa yang diubah, kenapa diubah, dan dampaknya.
   *   Jika menggunakan terminal, format eksekusinya adalah menyertakan dua parameter `-m`:
       ```bash
       git commit -m "jenis: judul singkat" -m "Penjelasan deskripsi detail perubahan..."
       ```
3. **Pisahkan Commit Berdasarkan Fitur (Atomic Commits)**:
   *   Jangan pernah menggabungkan beberapa pekerjaan/fitur/refaktorisasi yang berbeda dalam satu commit tunggal yang besar.
   *   Pisahkan perubahan secara bertahap dan commit per modul atau per jenis perbaikan yang spesifik (misalnya, refaktor dashboard dipisah dengan perbaikan audio).

## ✍️ Format Penulisan Pesan Commit

Gunakan standar *Conventional Commits* yang disesuaikan ke Bahasa Indonesia:

*   `feat: ...` -> Untuk penambahan fitur baru (misal: `feat: tambah tombol rekam ulang`).
*   `fix: ...` -> Untuk perbaikan masalah atau bug (misal: `fix: perbaiki modal yang membeku`).
*   `refactor: ...` -> Untuk penataan ulang struktur kode/modularisasi tanpa mengubah fungsi (misal: `refactor: modularisasi antarmuka belajar`).
*   `style: ...` -> Untuk perbaikan tampilan/CSS semata tanpa menyentuh logika kode.
*   `docs: ...` -> Untuk pembaruan berkas dokumentasi atau panduan.

---

*Catatan untuk AI: Harap baca berkas ini sebelum melakukan eksekusi perintah Git commit di dalam repositori ini.*
