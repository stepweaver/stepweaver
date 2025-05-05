export function createNotificationEmail(
  name,
  email,
  message,
  timestamp,
  reqId
) {
  return {
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
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
          .message { margin: 20px 0; padding: 15px; border-left: 4px solid #ooff41; }
          .footer { font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>stepweaver.dev Contact Form Submission</h2>
          </div>
          
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          
          <div class="message">
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div class="footer">
            <p>This message was submitted via the contact form on stepweaver.dev at ${timestamp}</p>
            <p>Reference ID: ${reqId}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
