'use client';

import { useState, useEffect } from 'react';
import GlitchButton from '@/components/ui/GlitchButton';
import TerminalWindow from '@/components/ui/TerminalWindow';
import styles from '@/styles/terminal.module.css';
import buttonStyles from '@/styles/buttons.module.css';
import animStyles from '@/styles/animations.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    error: null,
  });
  const [statusText, setStatusText] = useState('Ready');

  // Reset status text after success
  useEffect(() => {
    if (status.success) {
      setStatusText('Message Sent!');

      const timer = setTimeout(() => {
        setStatusText('Ready');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status.success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: null, error: null });
    setStatusText('Submitting...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ submitting: false, success: data.message, error: null });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({
          submitting: false,
          success: null,
          error: data.error || 'Something went wrong',
        });
        setStatusText(`Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: null,
        error: 'Failed to send message',
      });
      setStatusText('Error: Failed to send message');
    }
  };

  const formattedDate = `[${new Date().getFullYear()}-${new Date()
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase()}-${String(new Date().getDate()).padStart(2, '0')}]`;

  return (
    <div className='space-y-6 sm:space-y-8'>
      <div>
        <TerminalWindow
          showStatusBar={true}
          statusText={statusText}
          lastUpdated={formattedDate}
          customTitleContent={
            <div className='text-terminal-green'>~/contact</div>
          }
        >
          <div className={`p-4 ${styles.scanlinePattern}`}>
            {status.error && (
              <div className='mb-4 p-2 border border-terminal-red bg-terminal-red/20'>
                <p className='text-terminal-red text-sm'>
                  [ERROR] {status.error}
                </p>
              </div>
            )}

            <form className='space-y-3' onSubmit={handleSubmit}>
              <div>
                <label className='text-terminal-green text-sm block mb-1'>
                  NAME:
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full bg-black border border-terminal-border text-terminal-text p-1.5 text-sm focus:outline-none focus:border-terminal-green focus:shadow-terminal-glow'
                  placeholder='John Doe'
                  required
                />
              </div>

              <div>
                <label className='text-terminal-green text-sm block mb-1'>
                  EMAIL:
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full bg-black border border-terminal-border text-terminal-text p-1.5 text-sm focus:outline-none focus:border-terminal-green focus:shadow-terminal-glow'
                  placeholder='john@example.com'
                  required
                />
              </div>

              <div>
                <label className='text-terminal-green text-sm block mb-1'>
                  MESSAGE:
                </label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  className='w-full bg-black border border-terminal-border text-terminal-text p-1.5 text-sm h-32 focus:outline-none focus:border-terminal-green focus:shadow-terminal-glow'
                  placeholder='Type your message here...'
                  required
                ></textarea>
              </div>

              <div className='pt-2 flex space-x-3'>
                <GlitchButton
                  type='submit'
                  disabled={status.submitting}
                  isLoading={status.submitting}
                  loadingText='SENDING...'
                >
                  SUBMIT
                </GlitchButton>

                <GlitchButton href='/weaver_resume.pdf' download={true}>
                  DOWNLOAD RESUME
                </GlitchButton>
              </div>
            </form>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
