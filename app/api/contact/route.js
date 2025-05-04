import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/transporter';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;
    const subject = 'Contact Form Submission'; // Default subject since your form doesn't have one

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

    // Prepare email content for admin notification
    const mailOptions = {
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[CONTACT] New message from ${name}`,
      text: `
        New message from ${name} (${email})
        
        Message:
        ${message}
        
        Submitted at: ${timestamp}
        Reference: ${reqId}
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Message</title>
        </head>
        <body>
          <h2>stepweaver.dev Contact Form Submission</h2>
          
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          
          <div>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>This message was submitted via the contact form on stepweaver.dev at ${timestamp}</p>
          <p>Reference ID: ${reqId}</p>
        </body>
        </html>
      `,
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

    // Standard confirmation email to the user
    const confirmationMailOptions = {
      to: email,
      subject: `Thanks for reaching out to stepweaver.dev`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Message Received</title>
        </head>
        <body>
          <h2>Message Received!</h2> //TODO: Custom message
          
          <p>Hey ${name}! 👋</p>
          
          <p>Thanks for reaching out via my contact form.</p>
          
          <p>Your message is now safely in my inbox and I'm looking forward to reading it. I'll get back to you as soon as I can!</p>
          
          <p>In the meantime, feel free to reply if you think of anything else you'd like to add.</p>
          
          <hr>
          
          <p>While you wait, feel free to explore more of my site.</p>
          
          <p style="margin-top: 20px; font-style: italic; color: #777;">Crafting digital experiences that make a difference.</p>
          <p>Reference ID: ${reqId}</p>
        </body>
        </html>
      `,
      text: `
        Message Received
        
        Hey ${name}! Thanks for reaching out! I've received your message.
        
        I'll review your message and get back to you soon.
        
        You can reply directly to this email if you'd like to add any additional information.
        
        Reference ID: ${reqId}
      `,
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
