'use client';

import React, { useState, useEffect } from 'react';

export default function TimeDisplay() {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    // Only run on client-side
    const getMilitaryTime = () => {
      const now = new Date();
      return now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };

    // Set initial time
    setTime(getMilitaryTime());

    // Update time every second
    const intervalId = setInterval(() => {
      setTime(getMilitaryTime());
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return <div className='text-terminal-dimmed text-xs font-mono'>{time}</div>;
}
