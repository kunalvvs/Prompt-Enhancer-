const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send email verification
const sendVerificationEmail = async (email, username, token) => {
  const transporter = createTransporter();
  
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Prompt Elevate',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🧠 Prompt Elevate</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Welcome to Prompt Elevate, ${username}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Thanks for joining Prompt Elevate! To complete your registration and start saving your prompts, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
        
        <div style="background: #333; color: white; text-align: center; padding: 20px; font-size: 12px;">
          © 2025 Prompt Elevate. Enhance your prompts, elevate your AI experience.
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, username) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Prompt Elevate! 🎉',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🧠 Prompt Elevate</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Welcome aboard, ${username}! 🚀</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Your email has been verified successfully! You're now ready to:
          </p>
          
          <ul style="color: #666; line-height: 1.8;">
            <li>✨ Enhance your prompts with AI</li>
            <li>📚 Save and organize your prompt history</li>
            <li>🔗 Access our integrated AI tools</li>
            <li>⚡ Get instant improvements and suggestions</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;">
              Start Using Prompt Elevate
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Need help getting started? Check out our integrated AI tools:
          </p>
          
          <div style="margin: 20px 0;">
            <p style="margin: 5px 0;">
              🤖 <a href="https://innovachat.vercel.app/" style="color: #667eea;">InnovaChat</a> - Advanced AI Conversations
            </p>
            <p style="margin: 5px 0;">
              🛠️ <a href="https://aitoolsgalaxy.vercel.app/" style="color: #667eea;">AI Tools Galaxy</a> - Complete AI Toolkit
            </p>
          </div>
        </div>
        
        <div style="background: #333; color: white; text-align: center; padding: 20px; font-size: 12px;">
          © 2025 Prompt Elevate. Enhance your prompts, elevate your AI experience.
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendWelcomeEmail
};
