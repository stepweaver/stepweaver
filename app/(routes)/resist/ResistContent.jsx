'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/terminal.module.css';

export default function ResistContent() {
  const [isGlitching, setIsGlitching] = useState(false);

  // Trigger glitch effect on hover
  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  return (
    <div className='space-y-8 mt-4'>
      <div className='border-l-2 border-terminal-red pl-5'>
        <h2
          className='text-xl text-terminal-red flex items-center'
          onMouseEnter={triggerGlitch}
        >
          <span className={`mr-2 ${isGlitching ? 'animate-glitch' : ''}`}>
            #
          </span>
          RESIST<span className='animate-blink ml-1'>_</span>
        </h2>

        <div className='mt-6 text-terminal-text'>
          <h3 className='text-lg text-terminal-yellow mb-4 font-ibm'>
            My Ethos:
          </h3>
          <p className='text-terminal-text mt-3 font-bold'>
            I speak truth. I will not be silenced.
          </p>

          <p className='text-terminal-text mt-4'>
            This is America—and the First Amendment must stand.
            <br />
            Free speech. Free press. Free thought.
            <br />
            These are not optional. They are fundamental.
          </p>

          <p className='text-terminal-text mt-4'>
            We are living through a moment where truth is under siege. Our
            Constitution is being tested by a regime that stacks institutions
            with loyalists, attacks the press, and warps justice for power. I do
            not believe this is normal—and I refuse to pretend that it is.
          </p>

          <p className='text-terminal-text mt-4'>
            I'm not here to build a following. I'm not here to go viral.
            <br />
            I'm here to document. To observe. To resist.
            <br />
            I will share what I see. I'll post links, cite sources, and speak
            plainly.
            <br />
            You don't have to agree with me—but you will know where I stand.
          </p>

          <p className='text-terminal-text mt-4'>
            I believe in democracy, justice, and anti-fascism.
            <br />
            That doesn't make me radical—it makes me American.
          </p>

          <p className='text-terminal-text mt-4'>
            I am a developer. A veteran. A builder.
            <br />
            But first and always—I am a citizen with a voice.
          </p>

          <p className='text-terminal-text mt-4 font-bold'>
            This site is mine.
            <br />
            This space is free.
            <br />
            And this voice will not be quiet.
          </p>
        </div>
      </div>

      <div className='border-l-2 border-terminal-green pl-5 mt-12'>
        <h3 className='text-lg text-terminal-green'>Resources</h3>
        <div className='mt-4 space-y-3'>
          <ResourceLink
            title='Pro-Democracy Organizations'
            links={[
              {
                name: 'Protect Democracy',
                url: 'https://protectdemocracy.org/',
              },
              { name: 'Common Cause', url: 'https://www.commoncause.org/' },
              { name: 'ACLU', url: 'https://www.aclu.org/' },
            ]}
          />

          <ResourceLink
            title='Independent Media'
            links={[
              { name: 'Democracy Now!', url: 'https://www.democracynow.org/' },
              { name: 'The Guardian', url: 'https://www.theguardian.com/us' },
              { name: 'ProPublica', url: 'https://www.propublica.org/' },
            ]}
          />

          <div className='mt-6 text-terminal-dimmed text-sm'>
            More resources coming soon...
          </div>
        </div>
      </div>

      <div className='text-terminal-dimmed text-sm mt-2'>$ cat resist.md</div>
    </div>
  );
}

function ResourceLink({ title, links }) {
  return (
    <div className='mb-4'>
      <h4 className='text-terminal-yellow mb-2'>{title}</h4>
      <ul className='list-disc pl-5 space-y-1'>
        {links.map((link, index) => (
          <li key={index} className='text-terminal-text'>
            <Link
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-terminal-blue hover:text-terminal-cyan transition-colors duration-200 hover:underline'
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
