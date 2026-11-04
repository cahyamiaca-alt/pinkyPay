// ====================================================
// Test Suite: 8 Revisi Awal + 4 Revisi Terbaru PinkyPay
// ====================================================

const fs = require('fs');

console.log('🚀 Menjalankan Test Suite PinkyPay 2.1...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

const html = fs.readFileSync('index.html', 'utf8');

// ----------------------------------------------------
// TEST 1: Ringkasan Hutang & Piutang di Home
// ----------------------------------------------------
console.log('📌 Test: Ringkasan Hutang & Piutang di Home');
assert(html.includes('id="heroDebtSummaryRow"'), 'Elemen heroDebtSummaryRow tersedia di Hero Card Home');
assert(html.includes('id="heroReceivableVal"'), 'Elemen heroReceivableVal tersedia untuk nilai piutang (+)');
assert(html.includes('id="heroPayableVal"'), 'Elemen heroPayableVal tersedia untuk nilai utang (-)');
assert(html.includes('id="btnHeroAddDebt"'), 'Tombol cepat "+ Catat Utang" tersedia di Hero Card Home');

// ----------------------------------------------------
// TEST 2: Pembayaran Tagihan Masuk Riwayat Home
// ----------------------------------------------------
console.log('\n📌 Test: Riwayat Transaksi Saat Bayar Tagihan');
assert(html.includes("title: 'Pembayaran Tagihan: ' + bill.name"), 'Tagihan yang dibayar memiliki title "Pembayaran Tagihan: [Nama]"');
assert(html.includes("date: today"), 'Tanggal transaksi tagihan menggunakan tanggal hari ini (today)');
assert(html.includes("state.transactions.unshift"), 'Transaksi pembayaran tagihan otomatis di-unshift ke daftar riwayat transaksi Home');
assert(html.includes("wal.balanceIDR -= bill.amountIDR"), 'Saldo dompet otomatis dipotong saat bayar tagihan');

// ----------------------------------------------------
// TEST 3: Notifikasi Mentereng Kelebihan Dana / Overbudget
// ----------------------------------------------------
console.log('\n📌 Test: Notifikasi Mentereng Kelebihan Dana / Overbudget');
assert(html.includes('id="globalAlertBadge"'), 'Badge notifikasi mentereng tersedia di banner');
assert(html.includes('✨ SURPLUS KELEBIHAN DANA'), 'Notifikasi mode Surplus Kelebihan Dana tersedia');
assert(html.includes('🚨 OVERBUDGET'), 'Notifikasi mode Overbudget Alarm Siren tersedia');
assert(html.includes('animate-bounce'), 'Animasi perhatian (bounce) aktif pada badge surplus');
assert(html.includes('animate-pulse'), 'Animasi alarm (pulse) aktif pada banner overbudget');

// ----------------------------------------------------
// TEST 4: Backend SQLite Realtime & Multi-Device
// ----------------------------------------------------
console.log('\n📌 Test: Realtime SQLite & Multi-Device Sync');
assert(fs.existsSync('server.js'), 'server.js backend zero-dependency tersedia');
assert(html.includes('id="btnOpenDbSyncModal"'), 'Tombol status Database Realtime tersedia di header');
assert(html.includes('id="dbSyncModal"'), 'Modal status database & koneksi HP tersedia');
assert(html.includes('id="dbSyncLanUrl"'), 'Display alamat LAN Wi-Fi untuk HP tersedia');
assert(html.includes("new EventSource('/api/events')"), 'Frontend terhubung ke SSE (/api/events) untuk realtime sync');

// ----------------------------------------------------
// TEST 5: Hapus Fitur Asisten Chat AI
// ----------------------------------------------------
console.log('\n📌 Test: Asisten Chat AI Telah Dihapus');
assert(!html.includes('id="btnOpenAiDrawer"'), 'Tombol open AI drawer di header sudah dihapus');
assert(!html.includes('id="aiDrawer"'), 'Elemen aiDrawer sudah dihapus dari HTML');
assert(!html.includes('id="aiChatMessages"'), 'Elemen aiChatMessages sudah dihapus');
assert(!html.includes('function handleAiPrompt'), 'Fungsi handleAiPrompt sudah dihapus');

// ----------------------------------------------------
// TEST 6: Catat Cepat Autodetect Pemasukan & Pengeluaran
// ----------------------------------------------------
console.log('\n📌 Test: Catat Cepat Autodetect Pemasukan & Pengeluaran');
assert(html.includes('id="quickDetectBadge"'), 'Badge preview real-time deteksi otomatis tersedia');
assert(html.includes('id="quickDetectTypePill"'), 'Pill tipe deteksi (Pemasukan / Pengeluaran) tersedia');

// ----------------------------------------------------
// TEST 7: Tampilan Responsif HP & Website
// ----------------------------------------------------
console.log('\n📌 Test: Tampilan Responsif HP & Website');
assert(html.includes('id="mobileBottomNav"'), 'Sticky Mobile Bottom Navigation Bar tersedia untuk HP');
assert(html.includes('data-mobile-tab="transactions"'), 'Tab Home tersedia di mobile bottom nav');
assert(html.includes('data-mobile-tab="budgets"'), 'Tab Anggaran tersedia di mobile bottom nav');
assert(html.includes('data-mobile-tab="bills"'), 'Tab Tagihan tersedia di mobile bottom nav');
assert(html.includes('data-mobile-tab="reports"'), 'Tab Laporan tersedia di mobile bottom nav');

// ----------------------------------------------------
// TEST REVISI TERBARU 1: Anggaran per kategori bisa diubah atau dihapus
// ----------------------------------------------------
console.log('\n📌 Test Revisi 1: Ubah & Hapus Anggaran per Kategori');
assert(html.includes('data-edit-cat="${c.id}"'), 'Tombol data-edit-cat hadir langsung di setiap kartu anggaran categoryBudgetList');
assert(html.includes('data-delete-cat="${c.id}"'), 'Tombol data-delete-cat hadir langsung di setiap kartu anggaran categoryBudgetList');
assert(html.includes('id="editCategoryModal"'), 'Modal editCategoryModal tersedia untuk ubah nama, icon, tipe, batas kuota');
assert(html.includes('id="editCategoryForm"'), 'Form editCategoryForm menangani perubahan anggaran per kategori');
assert(html.includes('id="editTxModal"'), 'Modal editTxModal tersedia untuk mengubah kategori pada transaksi yang sudah ada');
assert(html.includes('id="editTxCategorySelect"'), 'Dropdown editTxCategorySelect memungkinkan transaksi dipindah kategori');

// ----------------------------------------------------
// TEST REVISI TERBARU 2: Tombol Klik untuk Back ke Home
// ----------------------------------------------------
console.log('\n📌 Test Revisi 2: Tombol Klik untuk Back ke Home');
assert(html.includes('class="btn-back-to-home'), 'Tombol class btn-back-to-home tersedia di halaman non-home');
assert(html.includes('id="headerLogoBtn"'), 'Logo headerLogoBtn dapat diklik untuk kembali ke Home');
assert(html.includes('navigateToHome'), 'Fungsi navigateToHome tersedia di script untuk kembali ke Home dan reset view');
const backBtnMatches = html.match(/class="[^"]*btn-back-to-home[^"]*"/g) || [];
assert(backBtnMatches.length >= 3, `Tombol kembali ke Home tersedia di ${backBtnMatches.length} lokasi/tab`);

// ----------------------------------------------------
// TEST REVISI TERBARU 3: Hosting agar Websitenya Dihosting Online (Link Publik)
// ----------------------------------------------------
console.log('\n📌 Test Revisi 3: Hosting Online & Link Akses Publik');
assert(html.includes('id="btnOpenHostingModal"'), 'Tombol "Link Publik" tersedia di header');
assert(html.includes('id="hostingModal"'), 'Modal hostingModal tersedia');
assert(html.includes('id="hostingLiveUrl"'), 'Display link publik aktif hostingLiveUrl tersedia');
assert(fs.existsSync('render.yaml'), 'Berkas render.yaml tersedia untuk 1-click cloud hosting di Render.com');
assert(fs.existsSync('vercel.json'), 'Berkas vercel.json tersedia untuk cloud hosting di Vercel');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert(pkg.scripts && pkg.scripts.share, 'npm script "share" tersedia untuk tunnel HTTPS instan (localtunnel)');
assert(pkg.scripts && pkg.scripts.tunnel, 'npm script "tunnel" tersedia untuk Cloudflare Tunnel');

// ----------------------------------------------------
// TEST REVISI TERBARU 4: Buat dalam Bentuk App (PWA & Installable)
// ----------------------------------------------------
console.log('\n📌 Test Revisi 4: Aplikasi PWA (Mobile & Desktop App)');
assert(fs.existsSync('manifest.json'), 'Berkas manifest.json PWA tersedia');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
assert(manifest.display === 'standalone', 'PWA display mode diatur ke "standalone" (tampilan aplikasi asli tanpa browser URL bar)');
assert(manifest.theme_color === '#ec4899', 'PWA theme_color sesuai palet PinkyPay');
assert(fs.existsSync('sw.js'), 'Service Worker sw.js tersedia untuk offline caching & instalasi aplikasi');
assert(fs.existsSync('icon.svg'), 'Ikon aplikasi icon.svg tersedia');
assert(html.includes('<link rel="manifest" href="/manifest.json">'), 'Tag link manifest.json terpasang di head HTML');
assert(html.includes('<meta name="apple-mobile-web-app-capable" content="yes">'), 'Tag iOS apple-mobile-web-app-capable terpasang');
assert(html.includes('id="btnInstallAppHeader"'), 'Tombol "Pasang App" tersedia di header');
assert(html.includes('id="installAppModal"'), 'Modal petunjuk pasang aplikasi installAppModal tersedia (iPhone & Android)');
assert(html.includes('serviceWorker.register'), 'Pendaftaran service worker aktif di script index.html');

console.log(`\n====================================================`);
console.log(`🎉 HASIL PENGUJIAN LENGKAP: ${passedTests} / ${totalTests} TEST BERHASIL!`);
console.log(`====================================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
