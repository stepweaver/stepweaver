'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    };

    const initialTimeout = setTimeout(triggerGlitch, 2000);

    const glitchInterval = setInterval(triggerGlitch, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <footer className='pt-8 pb-6 text-sm font-ibm'>
      <div className='flex justify-center items-center'>
        <div className='text-terminal-text'>
          <span className='text-terminal-green'>$</span>{' '}
          <span>
            echo &quot;© {year}{' '}
            <span
              className={`lambda-symbol ${
                isGlitching
                  ? 'lambda-glitching animate-glitch'
                  : 'lambda-normal'
              }`}
            >
              λ
            </span>
          </span>
          stepweaver.dev&quot;
          <span className='ml-1 text-terminal-green animate-blink'>_</span>
        </div>
      </div>
    </footer>
  );
}
