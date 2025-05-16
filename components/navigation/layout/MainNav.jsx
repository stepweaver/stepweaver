'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/styles/terminal-ui.module.css';

export default function MainNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

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

  return (
    <nav
      className={`sticky top-0 py-2 font-ibm transition-all duration-300 z-50 ${
        scrolled ? 'backdrop-blur-xs' : ''
      } hidden md:block`}
    >
      <div className='flex items-center justify-center space-x-8'>
        {navLinks.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noopener noreferrer' : ''}
            className={`flex items-center text-md font-ibm ${
              pathname === item.path && !item.external
                ? styles.activeLink
                : 'text-terminal-text hover:text-terminal-green'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
