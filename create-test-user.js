const axios = require('axios');

async function createTestUser() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      email: 'test@gmail.com',
      password: 'password123',
      name: 'Test User'
    });
    console.log('✅ Test user created successfully!');
    console.log('Email: test@gmail.com');
    console.log('Password: password123');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Failed to create test user');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error:', error.message);
    }
    console.log('Full error:', error);
  }
}

createTestUser();