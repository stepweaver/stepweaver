import React from 'react';

export default function HomeTab({ setActiveTab, setIsLoading }) {
  return (
    <div className='p-4 text-sm font-mono'>
      <div className='text-terminal-green text-center pb-3 border-b border-terminal-dimmed/20'>
        <p className='text-sm'>Welcome to the resistance.</p>
      </div>

      <div className='py-8 flex flex-col items-center justify-center space-y-6'>
        <div className='text-center max-w-md'>
          <p className='text-terminal-cyan text-sm mb-4'>
            I speak truth. This is my digital public square.
          </p>
          <p className='text-terminal-text'>
            In a time when misinformation flourishes and autocracy threatens,
            this space exists to document, to observe, and to resist.
          </p>
        </div>

        <div className='flex space-x-6 pt-4'>
          <button
            onClick={() => setActiveTab('ethos')}
            className='text-terminal-yellow border border-terminal-yellow/30 px-3 py-1 hover:bg-terminal-yellow/10 cursor-pointer'
          >
            My Ethos →
          </button>
          <button
            onClick={() => {
              setActiveTab('news');
              setIsLoading(true);
            }}
            className='text-terminal-blue border border-terminal-blue/30 px-3 py-1 hover:bg-terminal-blue/10 cursor-pointer'
          >
            Latest News →
          </button>
        </div>
      </div>

      <div className='text-terminal-dimmed text-center text-xs pt-3 border-t border-terminal-dimmed/20'>
        <p>
          "The only thing necessary for the triumph of evil is for good people
          to do nothing."
        </p>
      </div>
    </div>
  );
}
