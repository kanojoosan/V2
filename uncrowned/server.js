require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(require('path').join(__dirname, 'public')));

const ADMIN = { username: 'admin', password: 'admin123' };

let db;
let sessions = {};

async function initDB() {
  db = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'uncrowned_db',
    waitForConnections: true,
    connectionLimit: 10,
    jsonStrings: false,
  });
  console.log('Connected to MySQL database.');
}

function genToken() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!sessions[token]) return res.status(401).json({ error: 'Please log in.' });
  req.session = sessions[token];
  next();
}

function requireAdmin(req, res, next) {
  const token = req.headers['authorization'];
  if (!sessions[token] || sessions[token].role !== 'admin')
    return res.status(403).json({ error: 'Admin access required.' });
  req.session = sessions[token];
  next();
}

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    rows.forEach(r => { if (typeof r.sizes === 'string') r.sizes = JSON.parse(r.sizes); });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/products', requireAdmin, async (req, res) => {
  const { name, category, price, image, sizes } = req.body;
  if (!name || !category || !price || !image)
    return res.status(400).json({ error: 'All fields are required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, category, price, sizes, image) VALUES (?, ?, ?, ?, ?)',
      [name, category, parseInt(price), JSON.stringify(sizes || []), image]
    );
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.json({ status: 'success', product: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const { name, category, price, image, sizes } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, category=?, price=?, sizes=?, image=? WHERE id=?',
      [name, category, parseInt(price), JSON.stringify(sizes || []), image, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found.' });
    res.json({ status: 'success', product: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json({ status: 'success', message: 'Product deleted.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/signup', async (req, res) => {
  const { username, email, password, age, agreedToTerms, agreedToPrivacy } = req.body;
  if (!username || !email || !password || !age)
    return res.status(400).json({ error: 'All fields are required.' });
  if (parseInt(age) < 18)
    return res.status(403).json({ error: 'You must be 18 or older.' });
  if (!agreedToTerms || !agreedToPrivacy)
    return res.status(400).json({ error: 'Please agree to Terms and Privacy Policy.' });
  try {
    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (exists.length) return res.status(409).json({ error: 'Email already registered.' });

    const [result] = await db.query(
      'INSERT INTO users (username, email, password, age, role) VALUES (?, ?, ?, ?, ?)',
      [username, email.toLowerCase(), password, parseInt(age), 'customer']
    );
    const token = genToken();
    sessions[token] = { userId: result.insertId, username, role: 'customer' };
    await db.query('INSERT INTO sessions (token, user_id, username, role) VALUES (?, ?, ?, ?)',
      [token, result.insertId, username, 'customer']);
    res.json({ status: 'success', token, username, role: 'customer' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  if ((email === ADMIN.username || email === 'admin') && password === ADMIN.password) {
    const token = genToken();
    sessions[token] = { username: 'Admin', role: 'admin' };
    return res.json({ status: 'success', token, username: 'Admin', role: 'admin' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?',
      [email.toLowerCase(), email.toLowerCase(), password]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials.' });
    const user = rows[0];
    const token = genToken();
    sessions[token] = { userId: user.id, username: user.username, role: user.role };
    await db.query('INSERT INTO sessions (token, user_id, username, role) VALUES (?, ?, ?, ?)',
      [token, user.id, user.username, user.role]);
    res.json({ status: 'success', token, username: user.username, role: user.role });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/logout', async (req, res) => {
  const token = req.headers['authorization'];
  delete sessions[token];
  try { await db.query('DELETE FROM sessions WHERE token = ?', [token]); } catch (_) { }
  res.json({ status: 'success' });
});

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, age, created_at FROM users WHERE role = "customer" ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.username AS customer
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    for (const o of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      o.items = items;
      o.address = typeof o.address === 'string' ? JSON.parse(o.address) : o.address;
    }
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/orders/:orderNum/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'out_for_delivery', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status.' });
  try {
    await db.query('UPDATE orders SET status = ? WHERE order_num = ?', [status, req.params.orderNum]);
    res.json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/orders/my', requireAuth, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.session.userId]
    );
    for (const o of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      o.items = items;
      o.address = typeof o.address === 'string' ? JSON.parse(o.address) : o.address;
    }
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/orders/:orderNum/received', requireAuth, async (req, res) => {
  try {
    await db.query(
      'UPDATE orders SET status = "completed" WHERE order_num = ? AND user_id = ?',
      [req.params.orderNum, req.session.userId]
    );
    res.json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/orders/:orderNum/rate', requireAuth, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ error: 'Rating must be 1–5.' });
  try {
    await db.query(
      'UPDATE orders SET rated = 1, rating = ?, rating_comment = ? WHERE order_num = ? AND user_id = ?',
      [rating, comment || '', req.params.orderNum, req.session.userId]
    );
    res.json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/checkout', requireAuth, async (req, res) => {
  const { cart, subtotal, shipping, total, address, paymentMethod } = req.body;
  if (!cart || cart.length === 0) return res.status(400).json({ error: 'Cart is empty.' });

  const orderNum = 'UC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_num, user_id, subtotal, shipping, total, payment_method, status, address)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [orderNum, req.session.userId, subtotal || total, shipping || 150, total, paymentMethod, JSON.stringify(address)]
    );
    const orderId = orderResult.insertId;

    for (const item of cart) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, name, category, size, price, image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.id || null, item.name, item.category, item.size, item.finalPrice || item.price, item.image]
      );
    }

    await conn.commit();
    conn.release();
    res.json({ status: 'success', orderNum, message: `Order ${orderNum} confirmed!` });
  } catch (e) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/address', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM saved_addresses WHERE user_id = ? ORDER BY is_default DESC LIMIT 1',
      [req.session.userId]
    );
    res.json(rows[0] || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/address', requireAuth, async (req, res) => {
  const { fname, lname, phone, street, city, province, zip, region } = req.body;
  try {
    await db.query('DELETE FROM saved_addresses WHERE user_id = ?', [req.session.userId]);
    await db.query(
      'INSERT INTO saved_addresses (user_id, fname, lname, phone, street, city, province, zip, region) VALUES (?,?,?,?,?,?,?,?,?)',
      [req.session.userId, fname, lname, phone, street, city, province, zip, region]
    );
    res.json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('\n=======================================');
    console.log('  UNCROWNED is running!');
    console.log('  Open: http://localhost:' + PORT);
    console.log('  Admin: admin / admin123');
    console.log('  DB: MySQL (uncrowned_db)');
    console.log('=======================================\n');
  });
}).catch(err => {
  console.error('Failed to connect to database:', err.message);
  process.exit(1);
});