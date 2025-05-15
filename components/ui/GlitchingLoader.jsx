'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/terminal.module.css';

export default function GlitchingLoader() {
  const [glitchState, setGlitchState] = useState(0);

  useEffect(() => {
    // Different versions of the text for glitching
    const glitchTexts = [
      'LOADING CONTENT...',
      'LOAD1NG C0NT3NT...',
      'L0ADING C0NTENT>.',
      'LOADING_CONTENT:..',
      'LOADING CONTENT...',
    ];

    // Create a more erratic glitch sequence
    let timeouts = [];

    const runGlitchSequence = () => {
      // Clear any existing timeouts
      timeouts.forEach(clearTimeout);
      timeouts = [];

      // Random intervals between 100-300ms
      const intervals = [150, 80, 220, 100, 180, 90, 120];

      // Schedule a sequence of glitches
      for (let i = 0; i < 10; i++) {
        const timeout = setTimeout(
          () => {
            setGlitchState(Math.floor(Math.random() * glitchTexts.length));
          },
          intervals.reduce(
            (sum, interval, idx) => (idx <= i ? sum + interval : sum),
            0
          )
        );

        timeouts.push(timeout);
      }

      // Reset to normal state after sequence
      const resetTimeout = setTimeout(() => {
        setGlitchState(0);

        // Schedule next sequence
        const nextSequenceTimeout = setTimeout(
          runGlitchSequence,
          2000 + Math.random() * 1000
        );
        timeouts.push(nextSequenceTimeout);
      }, intervals.reduce((a, b) => a + b, 0) + 100);

      timeouts.push(resetTimeout);
    };

    // Start the first sequence after a delay
    const initialTimeout = setTimeout(runGlitchSequence, 500);
    timeouts.push(initialTimeout);

    // Cleanup all timeouts
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className='flex justify-center items-center py-20'>
      <div
        className={`${styles.textGlitch} text-terminal-green text-xl font-ibm font-mono tracking-wider relative overflow-hidden`}
      >
        {glitchState !== 0 && (
          <span
            className='absolute top-0 left-0 w-full h-full flex items-center justify-center text-terminal-red'
            style={{
              clipPath:
                'polygon(0 25%, 30% 25%, 30% 30%, 70% 30%, 70% 50%, 30% 50%, 30% 75%, 100% 75%, 100% 80%, 0 80%)',
              transform: 'translateX(-2px)',
              opacity: 0.8,
            }}
          >
            LOADING CONTENT...
          </span>
        )}

        {glitchState !== 0 && (
          <span
            className='absolute top-0 left-0 w-full h-full flex items-center justify-center text-terminal-cyan'
            style={{
              clipPath: 'polygon(0 40%, 40% 40%, 40% 60%, 0 60%)',
              transform: 'translateX(2px)',
              opacity: 0.8,
            }}
          >
            LOADING CONTENT...
          </span>
        )}

        <span className={glitchState !== 0 ? styles.scanlineEffect : ''}>
          {glitchState === 0
            ? 'LOADING CONTENT...'
            : glitchState === 1
            ? 'LOAD1NG C0NT3NT...'
            : glitchState === 2
            ? 'L0ADING C0NTENT>.'
            : glitchState === 3
            ? 'LOADING_CONTENT:..'
            : 'LOADING CONTENT...'}
        </span>
      </div>
    </div>
  );
}
