import React, { useState, useEffect } from 'react';

export default function ResourcesTab({
  feedItems,
  isLoading,
  error,
  setFeedSource,
}) {
  const [activeFeed, setActiveFeed] = useState('reich');

  // Update the parent component's feed source when activeFeed changes
  useEffect(() => {
    if (setFeedSource) {
      setFeedSource(activeFeed);
    }
  }, [activeFeed, setFeedSource]);

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

  // Content based on feed source
  const feedContent = {
    reich: {
      title: 'Robert Reich',
      subtitle: 'Economic policy and political analysis',
      color: 'text-terminal-red',
      borderColor: 'border-terminal-red',
      buttonColor: 'text-terminal-red hover:text-terminal-orange',
      subscribeUrl: 'https://robertreich.substack.com/',
      subscribeChannel: 'robert-reich',
    },
    // Could add more resources here in the future
  };

  const activeContent = feedContent[activeFeed] || feedContent.reich;

  return (
    <div className='p-4 text-sm'>
      <div className='border-b border-terminal-dimmed/20 pb-2 mb-3'>
        <div className='mb-2'>
          <p className={`text-lg uppercase ${activeContent.color}`}>
            {activeContent.title}
          </p>
          <p className='text-terminal-dimmed text-sm'>
            {activeContent.subtitle}
          </p>
        </div>
        <div className='flex space-x-2 pt-1'>
          <button
            onClick={() => setActiveFeed('reich')}
            className={`px-2 py-0.5 text-xs cursor-pointer ${
              activeFeed === 'reich'
                ? 'bg-terminal-red/10 text-terminal-red border border-terminal-red/20'
                : 'text-terminal-dimmed hover:text-terminal-text'
            }`}
          >
            reich
          </button>
          {/* More resources can be added here in the future */}
        </div>
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
            Failed to retrieve resources feed
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
                  className='block cursor-pointer'
                >
                  <div>
                    <p className='text-terminal-yellow'>
                      {decodeHtmlEntities(item.title)}
                    </p>
                    <p className='text-terminal-dimmed text-xs mt-0.5'>
                      {formatDate(item.pubDate)}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className='mt-4 pt-2 border-t border-terminal-dimmed/20 text-right'>
            <a
              href={activeContent.subscribeUrl}
              target='_blank'
              rel='noopener noreferrer'
              className={`${activeContent.buttonColor} inline-block cursor-pointer`}
            >
              {'$'} subscribe --channel={activeContent.subscribeChannel}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
