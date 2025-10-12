const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const dbPath = './database.sqlite';
const newPassword = 'password123';

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Reset password for manish@gmail.com
const resetPassword = () => {
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
  db.run(
    'UPDATE users SET password = ? WHERE email = ?',
    [hashedPassword, 'manish@gmail.com'],
    function(err) {
      if (err) {
        console.error('❌ Error updating password:', err.message);
      } else if (this.changes === 0) {
        console.log('❌ No user found with email: manish@gmail.com');
      } else {
        console.log('✅ Password reset successfully!');
        console.log('Email: manish@gmail.com');
        console.log('New Password: password123');
      }
      
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err.message);
        } else {
          console.log('✅ Database connection closed.');
        }
      });
    }
  );
};

resetPassword();