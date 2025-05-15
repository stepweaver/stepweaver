'use client';

import { useState } from 'react';

export default function CommandInput({ onExecuteCommand, placeholder }) {
  const [commandInput, setCommandInput] = useState('');

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
            placeholder || 'Type "blog", "ai", or combinations like "blog+ai"'
          }
        />
        <button
          type='submit'
          className='px-2 py-0.5 text-xs bg-terminal-green/10 border border-terminal-green text-terminal-green rounded hover:bg-terminal-green/20'
        >
          Run
        </button>
      </form>
      <div className='h-px bg-terminal-green/20 mt-2'></div>
    </div>
  );
}
