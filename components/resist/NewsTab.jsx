import React from 'react';

export default function NewsTab({ feedItems, isLoading, error }) {
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

  return (
    <div className='p-4 text-sm font-mono'>
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
                  className='block cursor-pointer'
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
              className='text-terminal-blue hover:text-terminal-cyan inline-block cursor-pointer'
            >
              {'$'} subscribe --channel=parnas-perspective
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
