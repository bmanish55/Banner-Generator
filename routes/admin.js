const express = require('express');
const db = require('../database');

const router = express.Router();

// Simple admin view of database (remove in production!)
router.get('/database', async (req, res) => {
  try {
    // Get all users
    const users = await new Promise((resolve, reject) => {
      db.db.all("SELECT id, email, name, created_at FROM users", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get all banners
    const banners = await new Promise((resolve, reject) => {
      db.db.all("SELECT id, user_id, title, platform, purpose, main_text, target_audience, created_at FROM banners", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Get statistics
    const stats = await new Promise((resolve, reject) => {
      db.db.all(`
        SELECT 
          u.name as user_name,
          u.email,
          COUNT(b.id) as banner_count
        FROM users u 
        LEFT JOIN banners b ON u.id = b.user_id 
        GROUP BY u.id, u.name, u.email
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      message: 'Database contents retrieved successfully',
      data: {
        users,
        banners,
        statistics: stats,
        counts: {
          total_users: users.length,
          total_banners: banners.length
        }
      }
    });
  } catch (error) {
    console.error('Database view error:', error);
    res.status(500).json({ message: 'Failed to retrieve database contents' });
  }
});

// Get database tables info
router.get('/database/tables', async (req, res) => {
  try {
    const tables = await new Promise((resolve, reject) => {
      db.db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      message: 'Database tables retrieved successfully',
      tables: tables.map(t => t.name)
    });
  } catch (error) {
    console.error('Database tables error:', error);
    res.status(500).json({ message: 'Failed to retrieve database tables' });
  }
});

module.exports = router;