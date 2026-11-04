const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log('Applying 4 new user revisions to index.html...');
console.log('Original size:', html.length);

function safeReplace(source, pattern, replacerString) {
  if (typeof pattern === 'string') {
    if (!source.includes(pattern)) {
      throw new Error('Pattern string not found: ' + pattern.slice(0, 60));
    }
    return source.replace(pattern, () => replacerString);
  }
  if (!pattern.test(source)) {
    throw new Error('Pattern regex not found: ' + pattern.toString().slice(0, 60));
  }
  return source.replace(pattern, () => replacerString);
}

// 1. HEAD: Add PWA Manifest, Icons, and iOS Meta Tags (Req 4)
const oldHeadMeta = `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`;
const newHeadMeta = `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#ec4899">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="PinkyPay">
  <link rel="apple-touch-icon" href="/icon.svg">
  <link rel="icon" type="image/svg+xml" href="/icon.svg">`;
html = safeReplace(html, oldHeadMeta, newHeadMeta);

// 2. HEADER: Make Logo clickable (Back to Home) & Add Hosting + Install App buttons (Req 2, Req 3, Req 4)
const oldHeaderLogo = `<!-- Brand Logo & Title -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl pink-gradient flex items-center justify-center text-white shadow-xs shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-base font-extrabold tracking-tight text-pink-900">PinkyFlow</h1>
              <span id="activeNavBadge" class="hidden px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-full border border-pink-200"></span>
            </div>
          </div>
        </div>`;

const newHeaderLogo = `<!-- Brand Logo & Title (Klik untuk Back ke Home) -->
        <div id="headerLogoBtn" class="flex items-center gap-2 cursor-pointer hover:opacity-90 transition group" title="Klik untuk Kembali ke Beranda (Home)">
          <div class="w-8 h-8 rounded-xl pink-gradient flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-base font-extrabold tracking-tight text-pink-900">PinkyPay</h1>
              <span id="activeNavBadge" class="hidden px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-pink-700 rounded-full border border-pink-200"></span>
            </div>
          </div>
        </div>`;
html = safeReplace(html, oldHeaderLogo, newHeaderLogo);

// Add Hosting & Install App buttons into Header
const oldHeaderRightButtons = `<button id="btnOpenDbSyncModal" type="button" title="Status Realtime Database & Koneksi HP" class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-pink-50 text-pink-900 border border-pink-200/90 transition shadow-2xs flex items-center gap-1.5 shrink-0">
          <span id="headerSyncDot" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span id="headerSyncText" class="hidden sm:inline">Database Realtime</span>
          <span class="sm:hidden font-extrabold text-[10px]">DB</span>
        </button>`;

const newHeaderRightButtons = `<button id="btnOpenDbSyncModal" type="button" title="Status Realtime Database & Koneksi HP" class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-pink-50 text-pink-900 border border-pink-200/90 transition shadow-2xs flex items-center gap-1.5 shrink-0">
          <span id="headerSyncDot" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span id="headerSyncText" class="hidden sm:inline">Database Realtime</span>
          <span class="sm:hidden font-extrabold text-[10px]">DB</span>
        </button>

        <!-- Tombol Hosting & Link Publik (Req 3) -->
        <button id="btnOpenHostingModal" type="button" title="Hosting & Link Akses Publik (Online)" class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-pink-50 text-pink-900 border border-pink-200/90 transition shadow-2xs flex items-center gap-1.5 shrink-0">
          <svg class="w-3.5 h-3.5 text-pink-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span class="hidden sm:inline">Link Publik</span>
        </button>

        <!-- Tombol Pasang Aplikasi (Req 4) -->
        <button id="btnInstallAppHeader" type="button" title="Pasang sebagai Aplikasi HP / Komputer" class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-white pink-gradient hover:opacity-95 transition shadow-xs shadow-pink-300/40 flex items-center gap-1.5 shrink-0">
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
          <span class="hidden sm:inline">Pasang App</span>
        </button>`;
html = safeReplace(html, oldHeaderRightButtons, newHeaderRightButtons);

// 3. BURGER DRAWER: Add Hosting & Install App menu items
const oldBurgerHistoryItem = `<button type="button" id="btnDrawerOpenHistoryLog" class="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between text-pink-800 hover:bg-pink-50">
            <span class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              <span>Log Aktivitas Akun</span>
            </span>
            <span id="drawerLogBadge" class="hidden px-2 py-0.5 text-[10px] font-extrabold bg-pink-600 text-white rounded-full">0</span>
          </button>`;

const newBurgerHistoryAndExtra = `<button type="button" id="btnDrawerOpenHistoryLog" class="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between text-pink-800 hover:bg-pink-50">
            <span class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              <span>Log Aktivitas Akun</span>
            </span>
            <span id="drawerLogBadge" class="hidden px-2 py-0.5 text-[10px] font-extrabold bg-pink-600 text-white rounded-full">0</span>
          </button>

          <!-- Menu Hosting Publik -->
          <button type="button" id="btnDrawerHosting" class="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between text-pink-800 hover:bg-pink-50">
            <span class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </span>
              <span>Hosting & Domain Publik</span>
            </span>
            <span class="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">Online</span>
          </button>

          <!-- Menu Pasang Aplikasi HP -->
          <button type="button" id="btnDrawerInstallApp" class="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left transition flex items-center justify-between bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200/80">
            <span class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg pink-gradient text-white flex items-center justify-center shadow-2xs">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </span>
              <span>Pasang Sebagai Aplikasi HP</span>
            </span>
            <span class="px-2 py-0.5 text-[9px] font-bold bg-pink-200 text-pink-800 rounded-full">App</span>
          </button>`;
html = safeReplace(html, oldBurgerHistoryItem, newBurgerHistoryAndExtra);

// 4. TAB 2 (Anggaran): Add Back to Home button at top (Req 2)
const oldTabBudgetsStart = `<section id="tab-budgets" class="tab-panel hidden space-y-6">`;
const newTabBudgetsStart = `<section id="tab-budgets" class="tab-panel hidden space-y-5">
      <!-- Tombol Kembali ke Beranda (Req 2) -->
      <div class="flex items-center justify-between">
        <button type="button" class="btn-back-to-home inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-pink-900 text-xs font-bold border border-pink-200 transition shadow-2xs">
          <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          <span>Kembali ke Beranda (Home)</span>
        </button>
        <span class="text-xs text-pink-600 font-bold bg-pink-100/70 px-3 py-1 rounded-full border border-pink-200/80">Anggaran & Amplop</span>
      </div>`;
html = safeReplace(html, oldTabBudgetsStart, newTabBudgetsStart);

// 5. TAB 3 (Tagihan): Add Back to Home button at top (Req 2)
const oldTabBillsStart = `<section id="tab-bills" class="tab-panel hidden space-y-6">`;
const newTabBillsStart = `<section id="tab-bills" class="tab-panel hidden space-y-5">
      <!-- Tombol Kembali ke Beranda (Req 2) -->
      <div class="flex items-center justify-between">
        <button type="button" class="btn-back-to-home inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-pink-900 text-xs font-bold border border-pink-200 transition shadow-2xs">
          <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          <span>Kembali ke Beranda (Home)</span>
        </button>
        <span class="text-xs text-pink-600 font-bold bg-pink-100/70 px-3 py-1 rounded-full border border-pink-200/80">Tagihan & Langganan</span>
      </div>`;
html = safeReplace(html, oldTabBillsStart, newTabBillsStart);

// 6. TAB 4 (Laporan): Add Back to Home button at top (Req 2)
const oldTabReportsStart = `<section id="tab-reports" class="tab-panel hidden space-y-6 print-area">`;
const newTabReportsStart = `<section id="tab-reports" class="tab-panel hidden space-y-5 print-area">
      <!-- Tombol Kembali ke Beranda (Req 2) -->
      <div class="flex items-center justify-between no-print">
        <button type="button" class="btn-back-to-home inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-pink-900 text-xs font-bold border border-pink-200 transition shadow-2xs">
          <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          <span>Kembali ke Beranda (Home)</span>
        </button>
        <span class="text-xs text-pink-600 font-bold bg-pink-100/70 px-3 py-1 rounded-full border border-pink-200/80">Laporan Visual & Analisis</span>
      </div>`;
html = safeReplace(html, oldTabReportsStart, newTabReportsStart);

// 7. Multi-Dompet view: Add Back to Home button at top (Req 2)
const oldWalletsGridStart = `<div id="homeWalletsDebtsGrid" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-5">`;
const newWalletsGridStart = `<div id="homeWalletsDebtsGrid" class="hidden space-y-4">
        <!-- Tombol Kembali ke Beranda dari Multi-Dompet -->
        <div class="flex items-center justify-between">
          <button type="button" class="btn-back-to-home inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-pink-900 text-xs font-bold border border-pink-200 transition shadow-2xs">
            <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
            <span>Kembali ke Beranda (Home)</span>
          </button>
          <span class="text-xs text-pink-600 font-bold bg-pink-100/70 px-3 py-1 rounded-full border border-pink-200/80">Multi-Dompet & Catatan Utang</span>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">`;
html = safeReplace(html, oldWalletsGridStart, newWalletsGridStart);

// Also close the extra wrapper div for homeWalletsDebtsGrid
const oldWalletsGridEnd = `<!-- TAB 2: ANGGARAN (BUDGETING) & AMPLOP DIGITAL -->`;
const newWalletsGridEnd = `</div>
      </div>

    <!-- ========================================== -->
    <!-- TAB 2: ANGGARAN (BUDGETING) & AMPLOP DIGITAL -->`;
html = safeReplace(html, oldWalletsGridEnd, newWalletsGridEnd);

// 8. UPDATE Category Budget Card in renderBudgetsAndEnvelopes (Req 1)
// Add Ubah & Hapus buttons directly on each budget category card
const oldBudgetCardCode = /budgetContainer\.innerHTML = expCats\.map\(c => \{[\s\S]*?return `\s*<div class="p-3\.5 rounded-xl bg-white border border-pink-200 space-y-2">[\s\S]*?<\/div>\s*`;\s*\}\)\.join\(''\);/;

const newBudgetCardCode = `budgetContainer.innerHTML = expCats.map(c => {
        const limitIDR = Number(c.monthlyLimit || 0) * factor;
        const spentIDR = Number(catSpend[c.id] || 0) * (period === 'yearly' ? 12 : (period === 'daily' ? (1 / 30) : 1));
        const pct = limitIDR > 0 ? Math.round((spentIDR / limitIDR) * 100) : 0;
        const barWidth = Math.min(100, pct);

        let barColor = 'bg-pink-500';
        let statusTag = \`<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">Aman (\${pct}%)</span>\`;
        if (pct >= 100) {
          barColor = 'bg-rose-600';
          statusTag = \`<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Melebihi Kuota (\${pct}%)</span>\`;
        } else if (pct >= state.alertThreshold) {
          barColor = 'bg-amber-500';
          statusTag = \`<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Hampir Penuh (\${pct}%)</span>\`;
        }

        return \`
          <div class="p-4 rounded-2xl bg-white border border-pink-200/90 shadow-2xs hover:border-pink-300 transition space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-lg shrink-0 shadow-2xs">\${c.icon}</span>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs sm:text-sm font-extrabold text-pink-950 truncate">\${c.name}</span>
                    \${limitIDR === 0 ? \`<span class="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-semibold">Tanpa Batas</span>\` : ''}
                  </div>
                  <span class="text-[10px] text-pink-500 font-medium">Batas Bulanan: \${formatMoneyFromIDR(c.monthlyLimit || 0)}</span>
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                \${statusTag}
                <!-- Tombol Ubah Kategori & Kuota (Req 1) -->
                <button type="button" data-edit-cat="\${c.id}" class="px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-800 text-[11px] font-bold border border-pink-200 transition shadow-2xs flex items-center gap-1" title="Ubah Nama, Icon, atau Batas Kuota Anggaran">
                  <svg class="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  <span>Ubah</span>
                </button>
                <!-- Tombol Hapus Kategori (Req 1) -->
                <button type="button" data-delete-cat="\${c.id}" class="w-7 h-7 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition shadow-2xs" title="Hapus Kategori Anggaran">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                </button>
              </div>
            </div>
            <div class="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden">
              <div class="h-full \${barColor} rounded-full transition-all duration-300" style="width: \${barWidth}%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-pink-700 font-medium">
              <span>Terpakai: <strong>\${formatMoneyFromIDR(spentIDR)}</strong></span>
              <span>Kuota \${periodLabel}: <strong>\${formatMoneyFromIDR(limitIDR)}</strong></span>
            </div>
          </div>
        \`;
      }).join('');`;

html = safeReplace(html, oldBudgetCardCode, newBudgetCardCode);

// 9. TRANSACTION LIST: Add Edit Transaction button next to Delete (Req 1)
const oldTxItemActions = `<button type="button" data-delete-tx="\${tx.id}" aria-label="Hapus Transaksi" title="Hapus Transaksi" class="w-7 h-7 rounded-lg text-pink-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition">`;

const newTxItemActions = `<button type="button" data-edit-tx="\${tx.id}" aria-label="Ubah Kategori/Detail Transaksi" title="Ubah Kategori / Nominal Transaksi" class="w-7 h-7 rounded-lg text-pink-400 hover:text-pink-700 hover:bg-pink-100 flex items-center justify-center transition">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
              </button>
              <button type="button" data-delete-tx="\${tx.id}" aria-label="Hapus Transaksi" title="Hapus Transaksi" class="w-7 h-7 rounded-lg text-pink-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition">`;
html = safeReplace(html, oldTxItemActions, newTxItemActions);

// 10. MODALS: Add Hosting Modal, Install App Modal, and Edit Transaction Modal
const modalInsertPoint = `<!-- ========================================== -->\n  <!-- MODAL: KUSTOMISASI KATEGORI -->`;

const newModalsContent = `<!-- ========================================== -->
  <!-- MODAL: HOSTING & LINK PUBLIK (Req 3) -->
  <!-- ========================================== -->
  <div id="hostingModal" class="fixed inset-0 bg-pink-950/40 backdrop-blur-xs z-50 hidden items-center justify-center p-4 no-print">
    <div class="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-pink-200 space-y-4 max-h-[90vh] overflow-y-auto custom-scroll">
      <div class="flex items-center justify-between border-b border-pink-100 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shadow-2xs">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-pink-950">Hosting & Domain Publik (Online)</h3>
            <p class="text-[11px] text-pink-600">Akses PinkyPay dari mana saja melalui link internet umum</p>
          </div>
        </div>
        <button type="button" data-close-modal="hostingModal" class="w-8 h-8 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center font-bold transition">✕</button>
      </div>

      <!-- Live Domain Status Banner -->
      <div id="hostingActiveDomainBanner" class="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 via-pink-50 to-pink-100/60 border border-emerald-200 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-900">Alamat Web Saat Ini</span>
          <span id="hostingCurrentBadge" class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-2xs">Aktif</span>
        </div>
        <div class="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-pink-200">
          <code id="hostingLiveUrl" class="text-xs font-black text-pink-900 break-all select-all">http://localhost:3000</code>
          <button type="button" id="btnCopyHostingLiveUrl" class="px-3 py-1.5 rounded-lg pink-gradient text-white text-xs font-bold shrink-0 shadow-xs">Salin Link</button>
        </div>
      </div>

      <!-- Opsi 1: Link Cepat Online Instan -->
      <div class="p-3.5 rounded-xl bg-pink-50/70 border border-pink-200 space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-extrabold text-pink-900 flex items-center gap-1.5">
            <span class="w-5 h-5 rounded-lg bg-pink-500 text-white text-[10px] font-black flex items-center justify-center">1</span>
            <span>Link Online Cepat (Gratis Tanpa Bikin Akun)</span>
          </h4>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-200 text-pink-800">Cepat</span>
        </div>
        <p class="text-[11px] text-pink-700 leading-relaxed">
          Buka terminal baru di folder proyek dan ketik:
        </p>
        <div class="p-2 rounded-lg bg-pink-950 text-pink-100 text-xs font-mono flex items-center justify-between">
          <code>npm run share</code>
          <button type="button" id="btnCopyNpmShare" class="text-[10px] text-pink-300 hover:text-white px-2 py-0.5 rounded bg-white/10">Salin</button>
        </div>
        <p class="text-[10px] text-pink-600">
          Perintah ini akan langsung membagikan web ke internet melalui link publik HTTPS (contoh: <code>https://pinkypay-mia-peter.loca.lt</code>) yang bisa dibuka dari HP mana saja!
        </p>
      </div>

      <!-- Opsi 2: Deploy Permanen 24/7 Gratis -->
      <div class="p-3.5 rounded-xl bg-pink-50/70 border border-pink-200 space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-extrabold text-pink-900 flex items-center gap-1.5">
            <span class="w-5 h-5 rounded-lg bg-pink-500 text-white text-[10px] font-black flex items-center justify-center">2</span>
            <span>Deploy Permanen 24/7 Gratis (Render / Vercel)</span>
          </h4>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Permanen</span>
        </div>
        <p class="text-[11px] text-pink-700 leading-relaxed">
          Proyek ini sudah dilengkapi konfigurasi cloud siap pakai: <code>render.yaml</code> dan <code>vercel.json</code>.
        </p>
        <ol class="list-decimal list-inside text-[11px] text-pink-800 space-y-1 pl-1">
          <li>Upload folder proyek ini ke <strong>GitHub</strong>.</li>
          <li>Buka <strong>render.com</strong> atau <strong>vercel.com</strong> (gratis).</li>
          <li>Pilih <em>New Web Service</em> dari repository GitHub Anda.</li>
          <li>Dapatkan link permanen seperti <code>https://pinkypay.onrender.com</code> yang aktif selamanya!</li>
        </ol>
      </div>

      <div class="flex justify-end pt-2 border-t border-pink-100">
        <button type="button" data-close-modal="hostingModal" class="px-4 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-bold transition">Tutup</button>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL: PASANG APLIKASI / INSTALL APP (Req 4) -->
  <!-- ========================================== -->
  <div id="installAppModal" class="fixed inset-0 bg-pink-950/40 backdrop-blur-xs z-50 hidden items-center justify-center p-4 no-print">
    <div class="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-pink-200 space-y-4 max-h-[90vh] overflow-y-auto custom-scroll">
      <div class="flex items-center justify-between border-b border-pink-100 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl pink-gradient text-white flex items-center justify-center shadow-2xs">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-pink-950">Pasang PinkyPay Sebagai Aplikasi</h3>
            <p class="text-[11px] text-pink-600">Buka langsung dari layar utama HP / Komputer tanpa browser</p>
          </div>
        </div>
        <button type="button" data-close-modal="installAppModal" class="w-8 h-8 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center font-bold transition">✕</button>
      </div>

      <!-- App Card Preview -->
      <div class="p-3.5 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/60 border border-pink-200 flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl pink-gradient flex items-center justify-center text-white shadow-md shadow-pink-300/60 shrink-0">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
          </svg>
        </div>
        <div>
          <h4 class="text-sm font-extrabold text-pink-950">PinkyPay Mobile & Desktop App</h4>
          <p class="text-[11px] text-pink-600">Mendukung PWA Standalone, Notifikasi, Offline & Realtime Sync</p>
        </div>
      </div>

      <!-- Tombol Pasang Otomatis (Chrome / Android / Desktop) -->
      <div id="pwaInstallNativeSection" class="space-y-2">
        <button type="button" id="btnModalInstallTrigger" class="w-full py-3 rounded-xl pink-gradient text-white font-extrabold text-xs shadow-md shadow-pink-300/50 hover:opacity-95 transition flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
          <span>Pasang Aplikasi Sekarang (1-Klik)</span>
        </button>
      </div>

      <!-- Panduan Khusus iPhone / Safari -->
      <div class="p-3.5 rounded-xl bg-pink-50/50 border border-pink-200 space-y-2">
        <h5 class="text-xs font-bold text-pink-900 flex items-center gap-1.5">
          <span>🍎 Pengguna iPhone / iPad (Safari):</span>
        </h5>
        <ol class="list-decimal list-inside text-[11px] text-pink-800 space-y-1.5 pl-1 leading-relaxed">
          <li>Buka web ini di browser <strong>Safari</strong> iPhone Anda.</li>
          <li>Ketuk tombol <strong>Bagikan (Share)</strong> 📤 di bilah navigasi bawah Safari.</li>
          <li>Gulir ke bawah lalu pilih menu <strong>"Tambah ke Layar Utama" (Add to Home Screen) ➕</strong>.</li>
          <li>Ketuk <strong>"Tambah" (Add)</strong> di pojok kanan atas. Ikon PinkyPay akan otomatis terpasang seperti aplikasi dari App Store!</li>
        </ol>
      </div>

      <div class="flex justify-end pt-2 border-t border-pink-100">
        <button type="button" data-close-modal="installAppModal" class="px-4 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-bold transition">Tutup</button>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL: EDIT TRANSAKSI & UBAH KATEGORI (Req 1) -->
  <!-- ========================================== -->
  <div id="editTxModal" class="fixed inset-0 bg-pink-950/40 backdrop-blur-xs z-50 hidden items-center justify-center p-4 no-print">
    <div class="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-pink-200 space-y-4">
      <div class="flex items-center justify-between border-b border-pink-100 pb-3">
        <h3 class="text-base font-extrabold text-pink-900 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
          <span>Ubah Transaksi & Kategori</span>
        </h3>
        <button type="button" data-close-modal="editTxModal" class="text-pink-500 hover:text-pink-800 font-bold">✕</button>
      </div>
      <form id="editTxForm" class="space-y-3">
        <input type="hidden" id="editTxId" />
        <div>
          <label class="block text-xs font-bold text-pink-800 mb-1">Keterangan Transaksi</label>
          <input type="text" id="editTxTitle" required class="w-full rounded-xl border border-pink-200 px-3 py-2 text-xs text-pink-950 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-pink-800 mb-1">Nominal (IDR)</label>
            <input type="text" inputmode="numeric" data-format-number="true" id="editTxAmount" required class="w-full rounded-xl border border-pink-200 px-3 py-2 text-xs font-bold text-right text-pink-950 focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-pink-800 mb-1">Tanggal</label>
            <input type="date" id="editTxDate" required class="w-full rounded-xl border border-pink-200 px-3 py-2 text-xs text-pink-950 focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-pink-800 mb-1">Ubah Kategori Anggaran (Req 1)</label>
          <select id="editTxCategorySelect" class="w-full rounded-xl border border-pink-200 px-3 py-2 text-xs font-bold text-pink-900 bg-white">
            <!-- Dynamic Category Options -->
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-pink-800 mb-1">Dompet / Rekening</label>
          <select id="editTxWalletSelect" class="w-full rounded-xl border border-pink-200 px-3 py-2 text-xs font-bold text-pink-900 bg-white">
            <!-- Dynamic Wallet Options -->
          </select>
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-pink-100">
          <button type="button" data-close-modal="editTxModal" class="px-3 py-1.5 rounded-xl border border-pink-200 text-pink-700 text-xs font-bold">Batal</button>
          <button type="submit" class="px-4 py-1.5 rounded-xl pink-gradient text-white text-xs font-bold shadow-xs">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>\n\n  ` + modalInsertPoint;

html = safeReplace(html, modalInsertPoint, newModalsContent);

// 11. JAVASCRIPT: Add Back-to-Home handlers, PWA install handlers, Edit Tx handlers, and Hosting handlers
const oldListenersMarker = `// Hero Card: Tambah Utang Cepat (Req 1)`;

const newFeaturesJs = `// ----------------------------------------------------
      // REVISI 2: TOMBOL KEMBALI KE BERANDA (HOME)
      // ----------------------------------------------------
      function navigateToHome() {
        switchTab('transactions');
        // Reset sub-views in Home jika sedang membuka multi-dompet
        const txGrid = document.getElementById('homeTxMainGrid');
        const walGrid = document.getElementById('homeWalletsDebtsGrid');
        if (txGrid && walGrid) {
          txGrid.classList.remove('hidden');
          walGrid.classList.add('hidden');
        }
        // Update active mobile nav tab
        document.querySelectorAll('.mobile-tab-btn').forEach(b => {
          const isActive = b.getAttribute('data-mobile-tab') === 'transactions';
          b.className = \`mobile-tab-btn flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl font-extrabold transition \${
            isActive ? 'text-pink-600' : 'text-pink-400 font-medium'
          }\`;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      document.querySelectorAll('.btn-back-to-home').forEach(btn => {
        btn.addEventListener('click', navigateToHome);
      });

      const headerLogoBtn = document.getElementById('headerLogoBtn');
      if (headerLogoBtn) headerLogoBtn.addEventListener('click', navigateToHome);

      // ----------------------------------------------------
      // REVISI 3: MODAL HOSTING & DOMAIN PUBLIK (ONLINE)
      // ----------------------------------------------------
      function updateHostingModalInfo() {
        const liveUrlEl = document.getElementById('hostingLiveUrl');
        const badgeEl = document.getElementById('hostingCurrentBadge');
        const currentOrigin = window.location.origin;
        if (liveUrlEl) liveUrlEl.textContent = currentOrigin;

        const isPublic = window.location.hostname !== 'localhost' &&
                         !window.location.hostname.startsWith('127.') &&
                         !window.location.hostname.startsWith('192.168.');
        if (badgeEl) {
          badgeEl.textContent = isPublic ? 'Domain Publik Aktif' : 'Server Lokal';
          badgeEl.className = isPublic
            ? 'px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-2xs'
            : 'px-2.5 py-0.5 rounded-full text-xs font-black bg-pink-600 text-white shadow-2xs';
        }
      }

      const btnOpenHost = document.getElementById('btnOpenHostingModal');
      if (btnOpenHost) {
        btnOpenHost.addEventListener('click', () => {
          updateHostingModalInfo();
          openModal('hostingModal');
        });
      }

      const btnDrawerHost = document.getElementById('btnDrawerHosting');
      if (btnDrawerHost) {
        btnDrawerHost.addEventListener('click', () => {
          closeBurgerMenu();
          updateHostingModalInfo();
          openModal('hostingModal');
        });
      }

      const btnCopyHostLive = document.getElementById('btnCopyHostingLiveUrl');
      if (btnCopyHostLive) {
        btnCopyHostLive.addEventListener('click', () => {
          const url = document.getElementById('hostingLiveUrl').textContent.trim();
          navigator.clipboard.writeText(url).then(() => {
            showToast('📋 Link berhasil disalin: ' + url);
          });
        });
      }

      const btnCopyNpmShare = document.getElementById('btnCopyNpmShare');
      if (btnCopyNpmShare) {
        btnCopyNpmShare.addEventListener('click', () => {
          navigator.clipboard.writeText('npm run share').then(() => {
            showToast('📋 Perintah "npm run share" disalin!');
          });
        });
      }

      // ----------------------------------------------------
      // REVISI 4: PWA / INSTALL APP LOGIC
      // ----------------------------------------------------
      let deferredPrompt = null;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const nativeSection = document.getElementById('pwaInstallNativeSection');
        if (nativeSection) nativeSection.classList.remove('hidden');
      });

      function handleInstallAppClick() {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              showToast('🎉 Aplikasi PinkyPay berhasil dipasang!');
            }
            deferredPrompt = null;
          });
        } else {
          // Buka modal petunjuk untuk iPhone Safari / browser lain
          openModal('installAppModal');
        }
      }

      const btnInstallHdr = document.getElementById('btnInstallAppHeader');
      if (btnInstallHdr) btnInstallHdr.addEventListener('click', handleInstallAppClick);

      const btnInstallDrw = document.getElementById('btnDrawerInstallApp');
      if (btnInstallDrw) {
        btnInstallDrw.addEventListener('click', () => {
          closeBurgerMenu();
          handleInstallAppClick();
        });
      }

      const btnModalInstall = document.getElementById('btnModalInstallTrigger');
      if (btnModalInstall) btnModalInstall.addEventListener('click', handleInstallAppClick);

      // Register PWA Service Worker
      if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
        navigator.serviceWorker.register('/sw.js').then(reg => {
          console.log('✅ ServiceWorker registered:', reg.scope);
        }).catch(err => {
          console.warn('ServiceWorker registration error:', err);
        });
      }

      // ----------------------------------------------------
      // REVISI 1: UBAH TRANSAKSI & KATEGORI (EDIT TX)
      // ----------------------------------------------------
      function openEditTxModal(txId) {
        const tx = state.transactions.find(t => t.id === txId);
        if (!tx) return;

        document.getElementById('editTxId').value = tx.id;
        document.getElementById('editTxTitle').value = tx.title;
        document.getElementById('editTxAmount').value = formatNumberWithDots(tx.amount);
        document.getElementById('editTxDate').value = tx.date;

        const catSelect = document.getElementById('editTxCategorySelect');
        const relevantCats = state.categories.filter(c => c.type === tx.type);
        catSelect.innerHTML = relevantCats.map(c => \`<option value="\${c.id}" \${c.id === tx.categoryId ? 'selected' : ''}>\${c.icon} \${c.name}</option>\`).join('');

        const walSelect = document.getElementById('editTxWalletSelect');
        walSelect.innerHTML = state.wallets.map(w => \`<option value="\${w.id}" \${w.id === tx.walletId ? 'selected' : ''}>\${w.name}</option>\`).join('');

        openModal('editTxModal');
      }

      document.getElementById('editTxForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const txId = document.getElementById('editTxId').value;
        const tx = state.transactions.find(t => t.id === txId);
        if (!tx) return;

        const newTitle = document.getElementById('editTxTitle').value.trim();
        const newAmount = parseFormattedNumber(document.getElementById('editTxAmount').value || '0');
        const newDate = document.getElementById('editTxDate').value;
        const newCatId = document.getElementById('editTxCategorySelect').value;
        const newWalId = document.getElementById('editTxWalletSelect').value;

        if (!newTitle || newAmount <= 0) return;

        // Revert old wallet balance
        const oldWal = state.wallets.find(w => w.id === tx.walletId);
        if (oldWal) {
          oldWal.balanceIDR -= (tx.type === 'income' ? tx.amountIDR : -tx.amountIDR);
        }

        // Calculate new IDR
        const newAmountIDR = convertToIDR(newAmount, tx.currency);

        // Apply new wallet balance
        const newWal = state.wallets.find(w => w.id === newWalId) || state.wallets[0];
        if (newWal) {
          newWal.balanceIDR += (tx.type === 'income' ? newAmountIDR : -newAmountIDR);
        }

        const oldCat = state.categories.find(c => c.id === tx.categoryId);
        const newCat = state.categories.find(c => c.id === newCatId);

        tx.title = newTitle;
        tx.amount = newAmount;
        tx.amountIDR = newAmountIDR;
        tx.date = newDate;
        tx.categoryId = newCatId;
        tx.walletId = newWalId;

        logActivity('✏️', 'Transaksi', 'Ubah Transaksi & Kategori', \`Transaksi "\${newTitle}" diubah ke kategori \${newCat ? newCat.name : ''} (\${formatMoneyFromIDR(newAmountIDR)}).\`);

        closeModal('editTxModal');
        saveState(false);
        renderAll();
        showToast(\`Transaksi "\${newTitle}" berhasil diperbarui!\`);
      });

      // Delegasi klik edit transaksi
      document.getElementById('txListContainer').addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-edit-tx]');
        if (editBtn) {
          openEditTxModal(editBtn.getAttribute('data-edit-tx'));
        }
      });

      // Hero Card: Tambah Utang Cepat (Req 1)`;

html = safeReplace(html, oldListenersMarker, newFeaturesJs);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Features applied successfully! New length:', html.length);
