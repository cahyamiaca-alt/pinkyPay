// ====================================================
// PinkyPay Realtime SQLite Server
// Backend Zero-Dependency untuk Sinkronisasi Multi-Device
// Mia & Peter Data Sync via Node.js Native HTTP & SQLite
// ====================================================

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'pinkypay.db');
const INDEX_HTML_PATH = path.join(__dirname, 'index.html');

// 1. Inisialisasi Database SQLite
const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_states (
    user_id TEXT PRIMARY KEY,
    state_json TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at INTEGER NOT NULL
  );
`);

console.log('✅ SQLite Database siap:', DB_PATH);

// Prepared Statements
const stmtGetState = db.prepare('SELECT state_json, updated_at FROM user_states WHERE user_id = ?');
const stmtSetState = db.prepare(`
  INSERT INTO user_states (user_id, state_json, updated_at)
  VALUES (?, ?, ?)
  ON CONFLICT(user_id) DO UPDATE SET
    state_json = excluded.state_json,
    updated_at = excluded.updated_at
`);
const stmtInsertLog = db.prepare('INSERT INTO audit_logs (user_id, action, details, created_at) VALUES (?, ?, ?, ?)');

// 2. Realtime Server-Sent Events (SSE) Pool
const sseClients = new Set();

function broadcastSSE(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}

// Heartbeat ping SSE setiap 25 detik agar koneksi tetap stabil di mobile & Wi-Fi
setInterval(() => {
  broadcastSSE({ type: 'ping', time: Date.now() });
}, 25000);

// Helper mencari alamat IP lokal (LAN)
function getLocalIps() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
}

// 3. HTTP Server
const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = req.method;

  // Header CORS untuk fleksibilitas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- ENDPOINT: SERVE INDEX.HTML ---
  if (pathname === '/' || pathname === '/index.html') {
    fs.readFile(INDEX_HTML_PATH, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Gagal memuat index.html: ' + err.message);
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    });
    return;
  }

  // --- ENDPOINT: STATIC ASSETS PWA (Manifest, Service Worker, Icon) ---
  if (pathname === '/manifest.json' || pathname === '/manifest.webmanifest') {
    const p = path.join(__dirname, 'manifest.json');
    if (fs.existsSync(p)) {
      res.writeHead(200, { 'Content-Type': 'application/manifest+json; charset=utf-8', 'Cache-Control': 'no-cache' });
      fs.createReadStream(p).pipe(res);
      return;
    }
  }

  if (pathname === '/sw.js') {
    const p = path.join(__dirname, 'sw.js');
    if (fs.existsSync(p)) {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-cache' });
      fs.createReadStream(p).pipe(res);
      return;
    }
  }

  if (pathname === '/icon.svg' || pathname === '/favicon.ico') {
    const p = path.join(__dirname, 'icon.svg');
    if (fs.existsSync(p)) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' });
      fs.createReadStream(p).pipe(res);
      return;
    }
  }

  // --- ENDPOINT: SSE STREAM REALTIME (/api/events) ---
  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write(`data: ${JSON.stringify({ type: 'connected', clientsCount: sseClients.size + 1, time: Date.now() })}\n\n`);

    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // --- ENDPOINT: NETWORK INFO (/api/network-info) ---
  if (pathname === '/api/network-info') {
    const ips = getLocalIps();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      port: PORT,
      localUrl: `http://localhost:${PORT}`,
      networkUrls: ips.map(ip => `http://${ip}:${PORT}`),
      ips
    }));
    return;
  }

  // --- ENDPOINT: SERVER STATUS (/api/status) ---
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      sseClients: sseClients.size,
      db: DB_PATH
    }));
    return;
  }

  // --- ENDPOINT: GET USER STATE (/api/state/:userId) ---
  const stateMatch = pathname.match(/^\/api\/state\/([a-zA-Z0-9_-]+)$/);
  if (stateMatch && method === 'GET') {
    const userId = stateMatch[1].toLowerCase();
    try {
      const row = stmtGetState.get(userId);
      if (!row) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ exists: false, userId }));
        return;
      }
      const parsedState = JSON.parse(row.state_json);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        exists: true,
        userId,
        state: parsedState,
        updatedAt: row.updated_at
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- ENDPOINT: SAVE USER STATE (/api/state/:userId) ---
  if (stateMatch && method === 'POST') {
    const userId = stateMatch[1].toLowerCase();
    const senderClientId = urlObj.searchParams.get('clientId') || '';

    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Batasi payload maksimal 10MB
      if (body.length > 10 * 1024 * 1024) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload terlalu besar' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const now = Date.now();
        stmtSetState.run(userId, JSON.stringify(parsed), now);
        stmtInsertLog.run(userId, 'SAVE_STATE', `Simpan state akun ${userId}`, now);

        // Broadcast perubahan ke semua perangkat lain yang terhubung
        broadcastSSE({
          type: 'sync',
          userId,
          senderClientId,
          updatedAt: now
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, userId, updatedAt: now }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Format JSON tidak valid: ' + err.message }));
      }
    });
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Endpoint tidak ditemukan');
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIps();
  console.log('\n====================================================');
  console.log('🌸 PINKYPAY REALTIME DATABASE SERVER AKTIF! 🌸');
  console.log('====================================================');
  console.log(`💻 Akses Komputer ini : http://localhost:${PORT}`);
  if (ips.length > 0) {
    ips.forEach(ip => {
      console.log(`📱 Akses Ponsel/HP (Wi-Fi) : http://${ip}:${PORT}`);
    });
  }
  console.log(`💾 Database SQLite     : ${DB_PATH}`);
  console.log(`🔄 Mode Realtime       : Server-Sent Events (SSE) Aktif`);
  console.log('====================================================\n');
});

// Penanganan proses exit
process.on('SIGINT', () => {
  console.log('\nMenutup server PinkyPay...');
  server.close(() => {
    try { db.close(); } catch (e) {}
    process.exit(0);
  });
});

