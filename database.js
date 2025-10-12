const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = process.env.DB_PATH || './database.sqlite';

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message);
      } else {
        console.log('✅ Connected to SQLite database');
        this.initTables();
      }
    });
  }

  initTables() {
    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Banners table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        platform TEXT NOT NULL,
        purpose TEXT NOT NULL,
        main_text TEXT NOT NULL,
        colors TEXT,
        target_audience TEXT,
        design_data TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
  }

  // User methods
  createUser(email, password, name) {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10);
      this.db.run(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, email, name });
        }
      );
    });
  }

  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, email, name, created_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  updateUserPassword(email, newPassword) {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      this.db.run(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email],
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve({ success: false, message: 'User not found.' });
          }
          else {
            resolve({ success: true, changes: this.changes });
          }
        }
      );
    });
  }

  // Banner methods
  createBanner(bannerData) {
    return new Promise((resolve, reject) => {
      const { user_id, title, platform, purpose, main_text, colors, target_audience, design_data, image_url } = bannerData;
      this.db.run(
        `INSERT INTO banners (user_id, title, platform, purpose, main_text, colors, target_audience, design_data, image_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, title, platform, purpose, main_text, colors, target_audience, design_data, image_url],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...bannerData });
        }
      );
    });
  }

  getBannersByUser(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM banners WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  getBannerById(id, userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM banners WHERE id = ? AND user_id = ?',
        [id, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  updateBanner(id, userId, updateData) {
    return new Promise((resolve, reject) => {
      const { title, design_data, image_url } = updateData;
      this.db.run(
        'UPDATE banners SET title = ?, design_data = ?, image_url = ? WHERE id = ? AND user_id = ?',
        [title, design_data, image_url, id, userId],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  deleteBanner(id, userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM banners WHERE id = ? AND user_id = ?',
        [id, userId],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }
}

module.exports = new Database();