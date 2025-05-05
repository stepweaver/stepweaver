import { sendEmail } from '@/utils/transporter';
import { rateLimitEmail } from '@/utils/rate-limiter';
import { createNotificationEmail } from '@/utils/email-templates/notification';
import { createConfirmationEmail } from '@/utils/email-templates/confirmation';

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    // Note: In production with proxies, you may need to use X-Forwarded-For header
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    const rateLimit = rateLimitEmail(ip);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: rateLimit.message,
          retry_after: Math.ceil(rateLimit.remainingTime / 1000), // seconds
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(rateLimit.remainingTime / 1000),
          },
        }
      );
    }

    const data = await request.json();
    const { name, email, message } = data;

    // Validate form data
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          error: 'All fields are required (name, email, message)',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Current date/time format
    const now = new Date();
    const timestamp = now.toLocaleString();

    // Randomly generate a request ID
    const reqId = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Get email content from notification template
    const { text: notificationText, html: notificationHtml } =
      createNotificationEmail(name, email, message, timestamp, reqId);

    // Prepare email content for admin notification
    const mailOptions = {
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[CONTACT] New message from ${name}`,
      text: notificationText,
      html: notificationHtml,
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        Importance: 'High',
      },
    };

    // Send email to admin using our utility
    const result = await sendEmail(mailOptions);

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    // Get confirmation email content from template
    const { text: confirmationText, html: confirmationHtml } =
      createConfirmationEmail(name, reqId);

    // Standard confirmation email to the user
    const confirmationMailOptions = {
      to: email,
      subject: `Thanks for reaching out to stepweaver.dev`,
      text: confirmationText,
      html: confirmationHtml,
    };

    // Send confirmation email to the user
    const confirmationResult = await sendEmail(confirmationMailOptions);

    // Even if the confirmation email fails, we still consider the main email sending a success
    if (!confirmationResult.success) {
      console.warn(
        'Failed to send confirmation email:',
        confirmationResult.error
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
