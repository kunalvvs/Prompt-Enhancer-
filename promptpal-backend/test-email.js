const nodemailer = require('nodemailer');

// Test email configuration
const testEmail = async () => {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'innovativedeveloperzone@gmail.com', // Replace with your Gmail
        pass: 'fklm ryrp pdln emne' // Replace with your 16-character app password
      }
    });

    // Test email
    const mailOptions = {
      from: 'innovativedeveloperzone@gmail.com',
      to: 'playergaming785@gmail.com', // Send to yourself for testing
      subject: '✅ Prompt Elevate - Email Test',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🧠 Prompt Elevate</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Email Configuration Test Successful! 🎉</h2>
            <p style="color: #666;">
              Your email service is configured correctly and ready to send verification emails.
            </p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #2d5a2d; margin: 0; font-weight: bold;">
                ✅ Gmail SMTP connection working
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Check your inbox for the test email.');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('🔑 Authentication failed. Check your:');
      console.log('   - Gmail address is correct');
      console.log('   - App password is correct (16 characters)');
      console.log('   - 2-Factor Authentication is enabled');
    }
  }
};

testEmail();
