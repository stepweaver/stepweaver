'use client';

import { useState, useEffect } from 'react';

export default function CommandInput({ onExecuteCommand, placeholder, error }) {
  const [commandInput, setCommandInput] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Update error message when a new error is received
  useEffect(() => {
    setErrorMessage(error);
    
    // Clear error after 4 seconds
    if (error) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    onExecuteCommand(commandInput.trim(), true);
    setCommandInput('');
  };

  return (
    <div className='max-w-4xl mx-auto mb-4'>
      <form onSubmit={handleSubmit} className='flex items-center'>
        <span className='text-terminal-green mr-2'>$</span>
        <input
          type='text'
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          className='flex-grow bg-transparent border-none text-terminal-text outline-none focus:ring-0'
          placeholder={
            placeholder ||
            'Try "blog", "ai", or "open my-post" to find posts directly'
          }
        />
        <button
          type='submit'
          className='px-2 py-0.5 text-xs bg-terminal-green/10 border border-terminal-green text-terminal-green rounded hover:bg-terminal-green/20'
        >
          Run
        </button>
      </form>
      {errorMessage && (
        <div className='mt-2 text-terminal-red text-sm'>
          {errorMessage}
        </div>
      )}
      <div className='h-px bg-terminal-green/20 mt-2'></div>
    </div>
  );
}
