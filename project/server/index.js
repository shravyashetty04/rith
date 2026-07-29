import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
        password, // In production, hash passwords!
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
      const user = db.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
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

    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint Not Found');
  });
});

server.listen(PORT, () => {
  console.log(`Local Backend Server running at http://localhost:${PORT}`);
});
