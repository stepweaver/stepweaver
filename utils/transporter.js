import nodemailer from 'nodemailer';

// Reuse transporter between invocations
let cachedTransporter = null;

// Create reusable transporter with environment variables
const createTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // Check if required environment variables are set
  const requiredVars = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_HOST', 'EMAIL_PORT'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false',
    },
  });
  return cachedTransporter;
};

/**
 * Send an email using nodemailer
 * @param {Object} options - Email options (to, subject, text, html, etc.)
 * @returns {Promise<Object>} - Result with success status and error if any
 */
export async function sendEmail(options) {
  try {
    // Make sure from address is set - use default if not provided
    if (!options.from) {
      options.from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    }

    const transporter = createTransporter();

    if (!transporter) {
      throw new Error(
        'Email transporter could not be created. Check environment variables.'
      );
    }

    const info = await transporter.sendMail(options);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
}
