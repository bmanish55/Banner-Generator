// Database viewer script
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = './database.sqlite';

function viewDatabase() {
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('❌ Error opening database:', err.message);
      return;
    }
    console.log('✅ Connected to SQLite database');
  });

  // Show all tables
  console.log('\n📋 Database Tables:');
  console.log('==================');
  
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
      return;
    }
    
    if (rows.length === 0) {
      console.log('No tables found in database.');
      db.close();
      return;
    }

    rows.forEach((row) => {
      console.log(`- ${row.name}`);
    });

    // Show users table
    console.log('\n👥 Users Table:');
    console.log('===============');
    db.all("SELECT id, email, name, created_at FROM users", [], (err, users) => {
      if (err) {
        console.error('Error fetching users:', err.message);
      } else if (users.length === 0) {
        console.log('No users found.');
      } else {
        console.table(users);
      }

      // Show banners table
      console.log('\n🎨 Banners Table:');
      console.log('=================');
      db.all("SELECT id, user_id, title, platform, purpose, main_text, target_audience, created_at FROM banners", [], (err, banners) => {
        if (err) {
          console.error('Error fetching banners:', err.message);
        } else if (banners.length === 0) {
          console.log('No banners found.');
        } else {
          console.table(banners);
        }

        // Show banner count by user
        console.log('\n📊 Banner Statistics:');
        console.log('=====================');
        db.all(`
          SELECT 
            u.name as user_name,
            u.email,
            COUNT(b.id) as banner_count
          FROM users u 
          LEFT JOIN banners b ON u.id = b.user_id 
          GROUP BY u.id, u.name, u.email
        `, [], (err, stats) => {
          if (err) {
            console.error('Error fetching statistics:', err.message);
          } else if (stats.length === 0) {
            console.log('No statistics available.');
          } else {
            console.table(stats);
          }

          // Show platform distribution
          console.log('\n📱 Platform Distribution:');
          console.log('=========================');
          db.all(`
            SELECT platform, COUNT(*) as count 
            FROM banners 
            GROUP BY platform 
            ORDER BY count DESC
          `, [], (err, platforms) => {
            if (err) {
              console.error('Error fetching platform stats:', err.message);
            } else if (platforms.length === 0) {
              console.log('No platform data available.');
            } else {
              console.table(platforms);
            }

            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err.message);
              } else {
                console.log('\n✅ Database connection closed.');
              }
            });
          });
        });
      });
    });
  });
}

// Run the viewer
viewDatabase();