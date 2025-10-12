const axios = require('axios');

const testPasswords = [
  'password', 
  '123456', 
  'password123', 
  'manish123', 
  'test123',
  'admin123',
  'bitroot',
  'bitroot123'
];

async function testLogin(email, password) {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    console.log(`✅ Success with password: "${password}"`);
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.log(`❌ Failed with password: "${password}"`);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('No response received - server might be down');
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

async function runTests() {
  console.log('Testing login for manish@gmail.com with password123...\n');
  
  const success = await testLogin('manish@gmail.com', 'password123');
  if (success) {
    console.log('\n🎉 Login working!');
  } else {
    console.log('\n❌ Login still not working');
  }
}

runTests().catch(console.error);