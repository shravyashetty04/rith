import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const PORT = 3001;

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file, returning default schema:', err);
    return { users: [], profiles: [], subscriptions: [], payments: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// Helper to set CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const server = http.createServer((req, res) => {
  setCORSHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse body helper
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    let parsedBody = {};
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON body');
        return;
      }
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    console.log(`${req.method} ${pathname}`);

    // ---------- Routing ----------

    // POST /api/auth/signup
    if (req.method === 'POST' && pathname === '/api/auth/signup') {
      const { email, password, fullName } = parsedBody;
      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Email and password are required');
        return;
      }

      const db = readDB();
      const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Email is already registered');
        return;
      }

      const newUser = {
        id: 'u_' + Math.random().toString(36).substring(2, 9),
        email,
        password: crypto.createHash('sha256').update(password).digest('hex'),
        fullName: fullName || 'Subscriber',
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      writeDB(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName } }));
      return;
    }

    // POST /api/auth/signin
    if (req.method === 'POST' && pathname === '/api/auth/signin') {
      const { email, password } = parsedBody;
      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Email and password are required');
        return;
      }

      const db = readDB();
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      const user = db.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword
      );

      if (!user) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Invalid email or password');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user: { id: user.id, email: user.email, fullName: user.fullName } }));
      return;
    }

    // GET /api/profiles
    if (req.method === 'GET' && pathname === '/api/profiles') {
      const db = readDB();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.profiles));
      return;
    }

    // POST /api/profiles
    if (req.method === 'POST' && pathname === '/api/profiles') {
      const { name, avatar, isKids, color } = parsedBody;
      if (!name) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Profile name is required');
        return;
      }

      const db = readDB();
      const newProfile = {
        id: 'p_' + Math.random().toString(36).substring(2, 9),
        name,
        avatar: avatar || '🦊',
        isKids: !!isKids,
        color: color || '#E50914',
        createdAt: new Date().toISOString()
      };

      db.profiles.push(newProfile);
      writeDB(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newProfile));
      return;
    }

    // DELETE /api/profiles
    if (req.method === 'DELETE' && pathname.startsWith('/api/profiles/')) {
      const id = pathname.split('/').pop();
      const db = readDB();
      db.profiles = db.profiles.filter((p) => p.id !== id);
      writeDB(db);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Profile deleted successfully');
      return;
    }

    // POST /api/subscriptions
    if (req.method === 'POST' && pathname === '/api/subscriptions') {
      const { userId, planId, paymentMethod } = parsedBody;
      if (!userId || !planId) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('User ID and Plan ID are required');
        return;
      }

      const db = readDB();
      const newSub = {
        id: 's_' + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        plan_id: planId,
        status: 'active',
        payment_method: paymentMethod || 'card',
        created_at: new Date().toISOString()
      };

      db.subscriptions.push(newSub);
      writeDB(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newSub));
      return;
    }

    // GET /api/subscriptions/active
    if (req.method === 'GET' && pathname.startsWith('/api/subscriptions/active/')) {
      const userId = pathname.split('/').pop();
      const db = readDB();
      const sub = db.subscriptions.find((s) => s.user_id === userId && s.status === 'active');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sub || null));
      return;
    }

    // POST /api/payments
    if (req.method === 'POST' && pathname === '/api/payments') {
      const { userId, amount, currency, method, invoiceId } = parsedBody;
      if (!userId || !amount) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('User ID and amount are required');
        return;
      }

      const db = readDB();
      const newPayment = {
        id: 'pay_' + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        amount,
        currency: currency || 'INR',
        method: method || 'card',
        invoice_id: invoiceId || '',
        status: 'paid',
        created_at: new Date().toISOString()
      };

      db.payments.push(newPayment);
      writeDB(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newPayment));
      return;
    }

    // GET /api/admin/users
    if (req.method === 'GET' && pathname === '/api/admin/users') {
      const db = readDB();
      const safeUsers = db.users.map(u => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        plan: 'Free',
        status: 'Active',
        created_at: u.createdAt
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(safeUsers));
      return;
    }

    // GET /api/admin/titles
    if (req.method === 'GET' && pathname === '/api/admin/titles') {
      const db = readDB();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.titles || []));
      return;
    }

    // POST /api/admin/titles
    if (req.method === 'POST' && pathname === '/api/admin/titles') {
      const db = readDB();
      if (!db.titles) db.titles = [];

      const newTitle = {
        id: 't_custom_' + Math.random().toString(36).substring(2, 9),
        ...parsedBody,
        created_at: new Date().toISOString()
      };

      db.titles.push(newTitle);
      writeDB(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newTitle));
      return;
    }

    // PUT /api/admin/titles/:id
    if (req.method === 'PUT' && pathname.startsWith('/api/admin/titles/')) {
      const id = pathname.substring('/api/admin/titles/'.length);
      const db = readDB();
      if (!db.titles) db.titles = [];

      const index = db.titles.findIndex((t) => t.id === id);
      if (index !== -1) {
        db.titles[index] = {
          ...db.titles[index],
          ...parsedBody,
          updated_at: new Date().toISOString()
        };
        writeDB(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db.titles[index]));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Title not found');
      }
      return;
    }

    // DELETE /api/admin/titles/:id
    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/titles/')) {
      const id = pathname.substring('/api/admin/titles/'.length);
      const db = readDB();
      if (!db.titles) db.titles = [];
      db.titles = db.titles.filter((t) => t.id !== id);
      writeDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // POST /api/upload
    if (req.method === 'POST' && pathname === '/api/upload') {
      const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }

      const { fileName, fileData } = parsedBody;
      if (!fileName || !fileData) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing fileName or fileData' }));
        return;
      }

      const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const targetPath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(targetPath, buffer);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ url: `/uploads/${fileName}` }));
      return;
    }

    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint Not Found');
  });
});

server.listen(PORT, () => {
  console.log(`Local Backend Server running at http://localhost:${PORT}`);
});
