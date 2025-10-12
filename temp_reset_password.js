const db = require('./database');

const email = 'manish@gmail.com';
const newPassword = '123456';

async function resetPassword() {
  console.log(`Attempting to reset password for ${email}...`);
  try {
    const result = await db.updateUserPassword(email, newPassword);
    if (result.success) {
      console.log(`✅ Password for ${email} has been successfully reset.`);
    } else {
      console.error(`❌ Failed to reset password: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ An error occurred while resetting the password:', error);
  }
}

resetPassword();
