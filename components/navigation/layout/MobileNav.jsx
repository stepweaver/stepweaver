'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/terminal-ui.module.css';
import terminalStyles from '@/styles/terminal.module.css';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [animatedItems, setAnimatedItems] = useState([]);
  const [isGlitching, setIsGlitching] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'codex', path: '/codex' },
    {
      name: 'bluesky',
      path: 'https://bsky.app/profile/stepweaver.dev',
      external: true,
    },
    { name: 'github', path: 'https://github.com/stepweaver', external: true },
  ];

  // First effect just tracks open state
  useEffect(() => {
    if (!isOpen) {
      setAnimatedItems([]);
    }
  }, [isOpen]);

  // Second effect handles animations when open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const items = [];
        navLinks.forEach((_, index) => {
          setTimeout(() => {
            setAnimatedItems((prev) => [...prev, index]);
          }, index * 100);
        });
        return items;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Glitch effect for lambda symbol
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  return (
    <div className='md:hidden fixed right-4 z-50 backdrop-blur-md bg-terminal/80'>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className='cursor-pointer p-3 text-3xl text-terminal-green hover:text-terminal-yellow transition-colors duration-200'
          aria-expanded={isOpen}
          aria-label='Toggle navigation menu'
        >
          <span className='block'>≡</span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed inset-0 ${styles.terminalDark} animate-fadeIn overflow-hidden ${terminalStyles.crtEffect}`}
          style={{
            boxShadow: 'inset 0 0 60px rgba(0, 255, 65, 0.15)',
          }}
        >
          {/* Scanline effect */}
          <div className={terminalStyles.scanlinePattern}></div>

          <div className={styles.terminalHeader}>
            <div className='text-xl font-ibm text-terminal-green flex items-center gap-2'>
              <span
                className={`${styles.lambdaSymbol} ${
                  isGlitching
                    ? styles.lambdaGlitching + ' animate-glitch'
                    : styles.lambdaNormal
                }`}
              >
                λ
              </span>
              ~/menu
            </div>

            <div className='flex gap-2'>
              <div
                className={`${styles.terminalButton} bg-terminal-yellow cursor-pointer`}
                onClick={() => setIsOpen(false)}
              ></div>
              <div
                className={`${styles.terminalButton} bg-terminal-green cursor-pointer`}
                onClick={() => setIsOpen(false)}
              ></div>
              <div
                className={`${styles.terminalButton} bg-terminal-red cursor-pointer`}
                onClick={() => setIsOpen(false)}
              ></div>
            </div>
          </div>

          <div className='p-6 text-xl h-[calc(100vh-56px)] overflow-y-auto'>
            <div className='mb-6 text-terminal-dimmed text-sm border-b border-terminal-dimmed/20 pb-2'>
              # Navigation options |{' '}
              <span className='text-terminal-green'>user@stepweaver.dev</span>
            </div>

            <ul className='py-3 font-ibm space-y-6'>
              {navLinks.map((item, index) => (
                <li
                  key={item.path}
                  className={`transition-all duration-300 ${
                    animatedItems.includes(index)
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-4'
                  }`}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    target={item.external ? '_blank' : ''}
                    rel={item.external ? 'noopener noreferrer' : ''}
                    className={`flex items-center py-2 px-3 transition-all duration-200 rounded-sm ${
                      pathname === item.path && !item.external
                        ? `${styles.activeLink} bg-terminal-green/10`
                        : 'text-terminal-text hover:text-terminal-green hover:bg-terminal/40'
                    }`}
                  >
                    <span className='text-terminal-green mr-3'>λ</span>
                    {item.name}
                    {pathname === item.path && !item.external && (
                      <span className='ml-2 animate-blink'>_</span>
                    )}
                    {item.external && (
                      <span className='ml-2 text-terminal-dimmed text-sm'>
                        [ext]
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className='absolute bottom-0 left-0 right-0 border-t border-terminal-dimmed/30 py-4 px-6 text-terminal-dimmed text-sm bg-terminal-dark/80 backdrop-blur-sm'>
              <div className='flex justify-between items-center'>
                <div>stepweaver@v1.0</div>
                <div className='flex items-center'>
                  <span className='h-2 w-2 rounded-full bg-terminal-green mr-2 animate-pulse'></span>
                  <span>connected</span>
                </div>
              </div>

              {/* Simulated terminal input */}
              <div className='mt-3 flex items-center'>
                <span className='text-terminal-green mr-2'>λ</span>
                <span className='text-terminal-text'>navigate</span>
                <span className='ml-1 h-4 w-2 bg-terminal-green animate-blink'></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
