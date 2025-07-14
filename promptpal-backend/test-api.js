const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testAPI = async () => {
  console.log('🧪 Testing Prompt Elevate API...\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing health check...');
    const response = await axios.get('http://localhost:5000');
    console.log('✅ Health check passed:', response.data.message);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Test Registration
  try {
    console.log('\n2. Testing user registration...');
    const testUser = {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✅ Registration response:', registerResponse.data.message);
    console.log('📧 Requires verification:', registerResponse.data.requiresVerification);
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data || error.message);
  }

  // Test 3: Test Login (should fail without verification)
  try {
    console.log('\n3. Testing login without verification...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login response:', loginResponse.data);
  } catch (error) {
    console.log('❌ Login failed (expected):', error.response?.data?.error);
    console.log('📧 Requires verification:', error.response?.data?.requiresVerification);
  }

  // Test 4: Test Google Auth endpoint (without actual Google token)
  try {
    console.log('\n4. Testing Google auth endpoint...');
    const googleResponse = await axios.post(`${API_URL}/auth/google`, {
      credential: 'fake-token'
    });
    console.log('✅ Google auth response:', googleResponse.data);
  } catch (error) {
    console.log('❌ Google auth failed (expected with fake token):', error.response?.data?.error);
  }

  console.log('\n🎉 API testing completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Open http://localhost:5173 in your browser');
  console.log('2. Try signing up with a real email');
  console.log('3. Check your email for verification link');
  console.log('4. Try Google Sign-In button');
};

testAPI();
