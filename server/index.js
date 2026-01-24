const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'portfolio_db',
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: process.env.POSTGRES_PORT || 5432,
});

// File Upload Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/assets');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes

app.get('/', (req, res) => {
  res.json({ status: 'running', message: 'Local CMS API is active. Endpoints available at /api/sections, /api/blogs' });
});

// 1. Get All Sections
app.get('/api/sections', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sections ORDER BY "order" ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Save Section (Upsert)
app.post('/api/sections', async (req, res) => {
  const { id, type, title, content, order, is_visible } = req.body;
  try {
    let query;
    let values;

    if (id) {
      // Update
      query = `
        UPDATE sections 
        SET type = $1, title = $2, content = $3, "order" = $4, is_visible = $5, updated_at = NOW()
        WHERE id = $6 RETURNING *`;
      values = [type, title, content, order, is_visible, id];
    } else {
      // Insert
      query = `
        INSERT INTO sections (type, title, content, "order", is_visible)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      values = [type, title, content, order, is_visible];
    }

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


// 3. Get All Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY published_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. Save Blog (Upsert)
app.post('/api/blogs', async (req, res) => {
  const { id, slug, title, excerpt, content, cover_image, published_at } = req.body;
  try {
    let query;
    let values;

    if (id) {
      // Update
      query = `
        UPDATE blogs 
        SET slug = $1, title = $2, excerpt = $3, content = $4, cover_image = $5, published_at = $6, updated_at = NOW()
        WHERE id = $7 RETURNING *`;
      values = [slug, title, excerpt, content, cover_image, published_at, id];
    } else {
      // Insert
      query = `
        INSERT INTO blogs (slug, title, excerpt, content, cover_image, published_at)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      values = [slug, title, excerpt, content, cover_image, published_at];
    }

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 5. Upload Media
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filename = req.file.filename;
  // IMPORTANT: For local dev, we serve from /assets (assuming public/ is static root)
  // Since we are uploading to ../public/assets, the URL is just /assets/filename
  const url = `/assets/${filename}`;

  try {
    // Save metadata to media table
    const query = `
      INSERT INTO media (filename, url, mime_type, size_bytes)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [filename, url, req.file.mimetype, req.file.size];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error saving media metadata' });
  }
});

app.listen(port, () => {
  console.log(`Local CMS Server running on port ${port}`);
});
