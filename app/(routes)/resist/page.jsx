// app/(routes)/resist/page.jsx
'use client';

import React, { useEffect, useState } from 'react';

export default function ResistPage() {
  // State for RSS feed
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'ethos', or 'news'

  // Get current military time (24-hour format)
  const getMilitaryTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  useEffect(() => {
    async function fetchFeed() {
      if (activeTab !== 'news') return; // Only fetch when news tab is active

      try {
        const response = await fetch('/api/rss');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Server error');
        }

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setFeedItems(data.items || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError(err.message || 'Failed to load news feed');
        setIsLoading(false);
      }
    }

    fetchFeed();
  }, [activeTab]);

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      // Military date format
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  }

  // Function to decode HTML entities
  function decodeHtmlEntities(text) {
    if (!text) return '';

    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&mdash;': '\u2014', // Em dash
      '&#8212;': '\u2014', // Em dash
      '&#8211;': '\u2013', // En dash
      '&#8216;': '\u2018', // Left single quote
      '&#8217;': '\u2019', // Right single quote
      '&#8220;': '\u201C', // Left double quote
      '&#8221;': '\u201D', // Right double quote
      '&#8230;': '\u2026', // Ellipsis
    };

    // Replace named and numbered entities
    let decoded = text.replace(/&[#\w]+;/g, (entity) => {
      if (entities[entity]) return entities[entity];

      if (entity.startsWith('&#x')) {
        const hex = entity.slice(3, -1);
        return String.fromCodePoint(parseInt(hex, 16));
      } else if (entity.startsWith('&#')) {
        const decimal = entity.slice(2, -1);
        return String.fromCodePoint(parseInt(decimal, 10));
      }

      return entity;
    });

    // Remove any HTML tags
    decoded = decoded.replace(/<[^>]+>/g, '');

    return decoded;
  }

  return (
    <div className='max-w-3xl mx-auto px-3 py-4'>
      {/* Terminal Header */}
      <div className='flex justify-between items-center mb-3'>
        <div className='font-mono text-sm flex items-center'>
          <span className='text-terminal-red font-bold mr-1.5'>#</span>
          <span className='text-terminal-text'>
            RESIST<span className='animate-blink ml-1'>_</span>
          </span>
        </div>
        <div className='text-terminal-dimmed text-xs font-mono'>
          {getMilitaryTime()}
        </div>
      </div>

      {/* Terminal Navigation */}
      <div className='flex font-mono text-xs mb-2'>
        <button
          onClick={() => setActiveTab('home')}
          className={`mr-1 px-3 py-1 ${
            activeTab === 'home'
              ? 'bg-terminal-bg text-terminal-green border-b border-terminal-green'
              : 'text-terminal-dimmed hover:text-terminal-text'
          }`}
        >
          /home
        </button>
        <button
          onClick={() => setActiveTab('ethos')}
          className={`mr-1 px-3 py-1 ${
            activeTab === 'ethos'
              ? 'bg-terminal-bg text-terminal-yellow border-b border-terminal-yellow'
              : 'text-terminal-dimmed hover:text-terminal-text'
          }`}
        >
          /ethos
        </button>
        <button
          onClick={() => {
            setActiveTab('news');
            if (isLoading) setIsLoading(true);
          }}
          className={`mr-1 px-3 py-1 ${
            activeTab === 'news'
              ? 'bg-terminal-bg text-terminal-blue border-b border-terminal-blue'
              : 'text-terminal-dimmed hover:text-terminal-text'
          }`}
        >
          /news
        </button>
      </div>

      {/* Content Panel */}
      <div className='border border-terminal-dimmed/30 bg-terminal-bg/90 min-h-[350px] max-h-[420px] overflow-y-auto'>
        {/* Home Tab Content */}
        {activeTab === 'home' && (
          <div className='p-4 text-xs font-mono'>
            <div className='text-terminal-green text-center pb-3 border-b border-terminal-dimmed/20'>
              <p className='text-sm'>Welcome to the resistance.</p>
            </div>

            <div className='py-8 flex flex-col items-center justify-center space-y-6'>
              <div className='text-center max-w-md'>
                <p className='text-terminal-cyan text-sm mb-4'>
                  I speak truth. This is my digital public square.
                </p>
                <p className='text-terminal-text'>
                  In a time when misinformation flourishes and autocracy
                  threatens, this space exists to document, to observe, and to
                  resist.
                </p>
              </div>

              <div className='flex space-x-6 pt-4'>
                <button
                  onClick={() => setActiveTab('ethos')}
                  className='text-terminal-yellow border border-terminal-yellow/30 px-3 py-1 hover:bg-terminal-yellow/10'
                >
                  My Ethos →
                </button>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    if (isLoading) setIsLoading(true);
                  }}
                  className='text-terminal-blue border border-terminal-blue/30 px-3 py-1 hover:bg-terminal-blue/10'
                >
                  Latest News →
                </button>
              </div>
            </div>

            <div className='text-terminal-dimmed text-center text-xs pt-3 border-t border-terminal-dimmed/20'>
              <p>
                "The only thing necessary for the triumph of evil is for good
                people to do nothing."
              </p>
            </div>
          </div>
        )}

        {/* Ethos Tab Content */}
        {activeTab === 'ethos' && (
          <div className='p-4 text-xs font-mono'>
            <div className='text-terminal-yellow border-b border-terminal-dimmed/20 pb-2 mb-3'>
              <p className='text-sm'>My Ethos</p>
            </div>

            <div className='space-y-3 text-terminal-text/90'>
              <p>I speak truth. I will not be silenced.</p>

              <p>
                This is America—and the First Amendment must stand. Free speech.
                Free press. Free thought. These are not optional. They are
                fundamental.
              </p>

              <p>
                We are living through a moment where truth is under siege. Our
                Constitution is being tested by a regime that stacks
                institutions with loyalists, attacks the press, and warps
                justice for power. I do not believe this is normal—and I refuse
                to pretend that it is.
              </p>

              <p>
                I'm not here to build a following. I'm not here to go viral. I'm
                here to document. To observe. To resist. I will share what I
                see. I'll post links, cite sources, and speak plainly. You don't
                have to agree with me—but you will know where I stand.
              </p>

              <p>
                I believe in democracy, justice, and anti-fascism. That doesn't
                make me radical—it makes me American.
              </p>

              <p>
                I am a developer. A veteran. A builder. But first and always—I
                am a citizen with a voice.
              </p>

              <p>
                This site is mine. This space is free. And I will not be
                silenced.
              </p>
            </div>
          </div>
        )}

        {/* News Tab Content */}
        {activeTab === 'news' && (
          <div className='p-4 text-xs font-mono'>
            <div className='text-terminal-blue border-b border-terminal-dimmed/20 pb-2 mb-3'>
              <p className='text-sm'>The Parnas Perspective</p>
              <p className='text-terminal-dimmed text-xs'>
                News and Gen Z perspective on current issues
              </p>
            </div>

            {isLoading ? (
              <div className='py-12 text-center'>
                <div className='inline-block border border-dashed border-terminal-dimmed/30 px-4 py-3'>
                  <p className='text-terminal-dimmed animate-pulse'>
                    $ loading feed data<span className='animate-blink'>_</span>
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className='py-4 border-l-2 border-terminal-red pl-3'>
                <p className='text-terminal-red'>ERROR: {error}</p>
                <p className='text-terminal-dimmed mt-1'>
                  Failed to retrieve news feed
                </p>
              </div>
            ) : feedItems.length === 0 ? (
              <div className='py-4 border-l-2 border-terminal-yellow pl-3'>
                <p className='text-terminal-yellow'>No posts found</p>
                <p className='text-terminal-dimmed mt-1'>
                  Check back later for updates
                </p>
              </div>
            ) : (
              <div>
                <ul className='space-y-2'>
                  {feedItems.map((item, idx) => (
                    <li
                      key={idx}
                      className='hover:bg-terminal-bg/80 p-1 transition-colors'
                    >
                      <a
                        href={item.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block'
                      >
                        <div className='flex'>
                          <span className='text-terminal-blue mr-2 font-bold'>
                            [{idx + 1}]
                          </span>
                          <div>
                            <p className='text-terminal-yellow'>
                              {decodeHtmlEntities(item.title)}
                            </p>
                            <p className='text-terminal-dimmed text-xs mt-0.5'>
                              {formatDate(item.pubDate)}
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className='mt-4 pt-2 border-t border-terminal-dimmed/20 text-right'>
                  <a
                    href='https://aaronparnas.substack.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-terminal-blue hover:text-terminal-cyan inline-block'
                  >
                    {'$'} subscribe --channel=parnas-perspective
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Command Line */}
      <div className='flex items-center pt-2 text-xs font-mono'>
        <span className='text-terminal-green mr-1.5'>$</span>
        <span className='text-terminal-text animate-blink'>_</span>
      </div>
    </div>
  );
}
