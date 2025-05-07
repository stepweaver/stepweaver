'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className='md:hidden fixed right-4 z-50 backdrop-blur-md bg-terminal-bg/80'>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className='cursor-pointer p-3 text-3xl text-terminal-green'
          aria-expanded={isOpen}
          aria-label='Toggle navigation menu'
        >
          <span className='block'>≡</span>
        </button>
      )}

      {isOpen && (
        <div className='fixed top-6 right-4 w-56 terminal-dark'>
          <div className='terminal-header'>
            <div className='text-xl font-ibm text-terminal-green'>~/menu</div>

            <div
              className='terminal-button bg-terminal-red cursor-pointer'
              onClick={() => setIsOpen(false)}
            ></div>
          </div>
          <div className='p-6 text-xl'>
            <ul className='py-3 font-ibm'>
              {navLinks.map((item) => (
                <li key={item.path} className='px-4 py-3'>
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    target={item.external ? '_blank' : ''}
                    rel={item.external ? 'noopener noreferrer' : ''}
                    className={`${
                      pathname === item.path && !item.external
                        ? 'active-link'
                        : 'text-terminal-text hover:text-terminal-green'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
