# KasbonKu — Aplikasi Pencatatan Kasbon & Piutang

**KasbonKu** adalah aplikasi web ringan, modern, dan **100% offline-first** untuk mencatat kasbon karyawan, pelanggan warung/UMKM, uang muka operasional, maupun pinjaman teman/keluarga. Dibangun menggunakan **Vanilla HTML, CSS, dan JavaScript** tanpa dependency berat — langsung bisa dibuka di browser, di-host di GitHub Pages, dan di-install sebagai PWA di HP.

## Fitur Utama

- **Ringkasan Keuangan Real-Time**: Pantau total sisa belum lunas, persentase pembayaran tertagih, serta kasbon yang sudah jatuh tempo / terlambat.
- **Pencatatan Kasbon Cepat**: Format Rupiah otomatis saat mengetik, tombol tambah cepat (`+50rb`, `+100rb`, `+250rb`, `+500rb`, `+1jt`), saran nama peminjam sebelumnya (autofill nomor WA & kategori), serta tenggat jatuh tempo.
- **Pembayaran Bertahap (Cicilan) & Pelunasan 1-Tap**: Catat cicilan berkali-kali dengan pilihan cepat (`25%`, `50%`, `Lunas`), metode bayar (`Tunai`, `Transfer Bank`, `QRIS / E-Wallet`, `Potong Gaji`), progress bar otomatis, dan riwayat pembayaran lengkap.
- **Pengingat Tagihan WhatsApp**: Pilih gaya bahasa (**Sopan & Ramah**, **Formal Kantor**, atau **Santai**), edit pesan langsung, lalu kirim ke WhatsApp atau salin teks — lengkap dengan info rekening/e-wallet usaha.
- **Nota Kasbon Digital (PNG)**: Generate struk/nota kasbon digital berbasis HTML5 Canvas dengan stempel status (`BELUM LUNAS` / `LUNAS`) dan riwayat cicilan, siap diunduh menjadi PNG untuk dikirim ke peminjam.
- **Buku Nama Peminjam**: Rekap otomatis per orang (total sisa aktif, total dibayar, dan tombol **Rekap WA** gabungan untuk semua kasbon aktif milik orang tersebut).
- **Riwayat Mutasi & Laporan Visual**: Arus kronologis kasbon keluar dan pembayaran masuk, grafik batang 6 bulan terakhir (SVG), serta komposisi piutang per kategori.
- **Ekspor & Backup Offline**: Salin laporan ringkas untuk Grup WA, ekspor ke **CSV (Excel/Google Sheets)**, serta **Backup & Restore JSON**.
- **Mode Terang & Mode Gelap** + **PWA Offline Support** (`manifest.json` & `sw.js`).

## Struktur Project

```text
kasbon/
├── index.html          # Struktur utama HTML5, navigasi desktop/mobile, & modal
├── css/
│   └── style.css       # Desain sistem "Warm Crisp Ledger" (Light & Dark mode, responsif)
├── js/
│   ├── utils.js        # Helper format Rupiah, tanggal Indonesia, WA, & status jatuh tempo
│   ├── storage.js      # Penyimpanan offline localStorage, data contoh, ekspor CSV/JSON
│   ├── receipt.js      # Generator Nota Kasbon Digital (HTML5 Canvas -> PNG)
│   └── app.js          # Controller UI (Daftar Kasbon, Buku Nama, Mutasi, Laporan)
├── assets/
│   └── icon.svg        # Ikon aplikasi SVG (Favicon & PWA)
├── manifest.json       # Konfigurasi PWA Web App Manifest
├── sw.js               # Service Worker untuk akses offline
└── .nojekyll           # Konfigurasi bersih untuk GitHub Pages
```

## Cara Menjalankan

### 1. Jalankan Lokal
Cukup buka file `index.html` langsung di browser, atau jalankan server statis lokal agar fitur PWA & Service Worker aktif:

```bash
# Menggunakan Python
python3 -m http.server 8080

# Atau menggunakan Node.js
npx serve .
```

Lalu buka `http://localhost:8080`.

### 2. Deploy ke GitHub Pages
1. Buka **Settings → Pages** pada repository GitHub ini.
2. Pada **Build and deployment → Source**, pilih **Deploy from a branch**.
3. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
4. Aplikasi akan langsung aktif di `https://hardadinuraziz.github.io/kasbon/`.

## Privasi & Penyimpanan Data
Seluruh data catatan kasbon disimpan secara lokal di browser perangkat Anda menggunakan `localStorage` dan tidak dikirim ke server eksternal mana pun. Gunakan fitur **Backup JSON** di menu **Laporan & Backup** secara berkala untuk menyimpan cadangan data Anda.
