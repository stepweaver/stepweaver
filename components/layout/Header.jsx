'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [imageError, setImageError] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const formatPath = () => {
    if (pathname === '/') return '';
    return `/${pathname.substring(1)}`;
  };

  const getSubtitle = () => {
    switch (pathname) {
      case '/':
        return '[Web Developer] in South Bend';
      case '/about':
        return '[Building, Learning, Growing]';
      case '/codex':
        return '[BEHOLD! My glorious collection]';
      default:
        return '[Web Developer] in South Bend';
    }
  };

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    };

    const initialTimeout = setTimeout(triggerGlitch, 1000);

    const glitchInterval = setInterval(triggerGlitch, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <header className='py-4 border-b border-terminal-border/30'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='flex flex-col space-y-2'>
          <div className='w-full overflow-x-auto'>
            <div className='font-ibm text-2xl flex items-center justify-center md:justify-start whitespace-nowrap overflow-hidden w-full'>
              <span
                className={`lambda-symbol mr-1 ${
                  isGlitching
                    ? 'lambda-glitching animate-glitch'
                    : 'lambda-normal'
                }`}
              >
                λ
              </span>
              <span className='text-terminal-green'>stepweaver</span>
              <span className='text-terminal-green break-all md:break-normal ml-0 md:ml-0 truncate max-w-[40vw] sm:max-w-[60vw]'>
                {formatPath()}
              </span>
              <span className='ml-1 text-terminal-green animate-blink'>_</span>
            </div>
          </div>

          <div className='flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-6 mt-3'>
            <div className='text-center md:text-left'>
              <h1 className='text-3xl text-terminal-text font-ibm tracking-tight'>
                Stephen Weaver
              </h1>
              <h2 className='text-lg mt-1 text-terminal-muted font-ibm'>
                {getSubtitle()}
              </h2>
            </div>

            {/* Profile Image */}
            <div className='mt-4 md:mt-0 flex justify-center'>
              <div className='rounded-full border-2 border-terminal-green w-52 h-52 overflow-hidden'>
                {imageError ? (
                  <div className='flex items-center justify-center h-full text-terminal-green text-4xl font-ibm'>
                    SW
                  </div>
                ) : (
                  <Image
                    src='/images/pixarMe.png'
                    alt='Stephen Weaver'
                    width={200}
                    height={200}
                    priority={true}
                    className='w-full h-full object-cover'
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
