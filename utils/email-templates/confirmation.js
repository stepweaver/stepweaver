export function createConfirmationEmail(name, reqId) {
  // Get time of day for personalized greeting
  const hour = new Date().getHours();
  let greeting = 'Hello';

  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  // First name only for more casual feel
  const firstName = name.split(' ')[0];

  // Random personal touch messages
  const personalTouches = [
    // Tech movie nods
    'Message uploaded. No neural implant required.',
    "You've just hacked the Gibson. Nice move.",
    'This conversation is now fully sentient.',
    'Your data packet arrived safely—no black ice detected.',
    "I see you're a fan of reality. Or is this just a simulation?",
    'Your message is the zero to my one. 😆',
    'Inbox status: enhanced by your input.',
    "You've just pinged the right node.",
    "This is the reply you're looking for.",
    // Philosophy
    'In the network of minds, every message matters.',
    'Cogito, ergo email.',
    'Your inquiry: a spark in the digital void.',
    'Every byte counts. Thanks for yours.',
    'Your message: a new thread in the tapestry of the web.',
    'To email is to be. (Paraphrasing Descartes)',
    'Your message: the unmoved mover of this conversation.',
    'Inbox, therefore I am.',
    'Communication is the beginning of understanding.',
    'Your message: a syllogism in the logic of the web.',
    'Every message is a step on the path to wisdom.',
    'In the digital agora, your voice echoes.',
    'Your words: the atoms of digital philosophy.',
    'This email: a minor premise in our major dialogue.',
    'All knowledge begins with a message.',
    'Your inquiry: the Socratic method in action.',
    'The only thing I know is that I have received your message.',
    'Your message: a Platonic form of good communication.',
    'Virtue is replying promptly.',
    'Your message: a thesis awaiting its antithesis.',
    // A touch of dry humor
    'No spam filter could stop this one.',
    'Inbox equilibrium restored.',
    'Your message: not a bot, I presume?',
    'This email brought to you by caffeine and curiosity.',
    'If only all messages were this interesting.',
    'This message has been processed by 0% AI, 100% caffeine.',
    'Inbox zero? Not today, but your message is a highlight.',
    'If only my code was as clear as your message.',
    'This reply was brought to you by procrastination.',
    'Your message: the best thing in my inbox since lunch.',
    'If I had a nickel for every great message like this, I&apos;d have... one nickel.',
    'Your message: not flagged as “suspicious,” for once.',
    'Replying before my coffee kicks in—wish me luck.',
    'This email is gluten-free, dairy-free, and 100% digital.',
    'Your message: the reason I&apos;m not debugging right now.',
    'If only all emails were this readable.',
    'This message will self-destruct in 5... 4... just kidding.',
    'Your message: the highlight of my notification bar.',
    'If this were a test, you&apos;d get an A+ for communication.',
    'Your message: the plot twist my inbox needed.',
  ];

  // Pick a random personal touch message
  const personalTouch =
    personalTouches[Math.floor(Math.random() * personalTouches.length)];

  // Add a personal signature
  const signature = 'Stephen Weaver';
  const personalNote = 'Web Developer & Digital Creator';

  return {
    text: `
      ${greeting}, ${firstName}!
      
      Thanks for reaching out! ${personalTouch}
      
      Feel free to reply to this email if you think of anything else or check out some of my latest work at stepweaver.dev/codex.
      
      Best regards,
      ${signature}
      ${personalNote}
      
      P.S. Your reference ID is ${reqId} (just in case you need to follow up)
    `,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Message Received</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; padding: 15px; border-radius: 5px; color: white; }
          .message { margin: 20px 0; background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .signature { margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; }
          .signature img { width: 150px; height: auto; }
          .personal-note { font-style: italic; color: #7f8c8d; margin-top: 5px; }
          .footer { font-size: 12px; color: #7f8c8d; margin-top: 30px; }
          .highlight { color: #3498db; font-weight: bold; }
          .resources { background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin-top: 20px; }
          .button { display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; 
                   text-decoration: none; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>👋 ${greeting}, ${firstName}!</h2>
          </div>
          
          <div class="message">
            <p><span class="highlight">${personalTouch}</span></p>
            
            <p>Thanks for reaching out! I&apos;ll get back to you as soon as possible.</p>
          </div>
          
          <div class="resources">
            <h3>While You Wait...</h3>
            <p>Feel free to explore some of my latest projects and insights:</p>
            <ul>
              <li>Check out my <a href="https://stepweaver.dev/codex">digital codex</a> of projects and articles</li>
              <li>Follow me on <a href="https://github.com/stepweaver">GitHub</a> to see what I'm currently building</li>
            </ul>
            <a href="https://stepweaver.dev/codex" class="button">Explore My Work →</a>
          </div>
          
          <div class="signature">
            <p>Best regards,</p>
            <p><strong>Stephen Weaver</strong></p>
            <p class="personal-note">Web Developer & Digital Creator</p>
          </div>
          
          <div class="footer">
            <p>If you need to reference this conversation later, your ID is: ${reqId}</p>
            <p>This email was sent in response to your form submission on stepweaver.dev</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
