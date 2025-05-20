import React, { useState, useEffect } from 'react';

export default function PodcastTab({
  feedItems,
  isLoading,
  error,
  setFeedSource,
}) {
  const [activeFeed, setActiveFeed] = useState('findout');
  const [spotifyData, setSpotifyData] = useState(null);
  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const [spotifyError, setSpotifyError] = useState(null);
  const [podcastId, setPodcastId] = useState('3RinpxSRrx13zd8NwTWenu'); // Default to Find Out Podcast

  // Update the parent component's feed source when activeFeed changes
  useEffect(() => {
    if (setFeedSource) {
      setFeedSource(activeFeed);
    }
  }, [activeFeed, setFeedSource]);

  // Change podcast ID when active feed changes
  useEffect(() => {
    if (activeFeed === 'findout') {
      setPodcastId('3RinpxSRrx13zd8NwTWenu');
    } else if (activeFeed === 'lincoln') {
      setPodcastId('6F16aSGEXM49ktwWScBKuK');
    }
  }, [activeFeed]);

  // Fetch Spotify data
  useEffect(() => {
    async function fetchSpotifyData() {
      try {
        setSpotifyLoading(true);
        const timestamp = new Date().getTime(); // Add timestamp to prevent caching
        const response = await fetch(
          `/api/spotify?showId=${podcastId}&t=${timestamp}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch Spotify data');
        }
        const data = await response.json();
        setSpotifyData(data);
        setSpotifyLoading(false);
      } catch (err) {
        console.error('Error fetching Spotify data:', err);
        setSpotifyError(err.message);
        setSpotifyLoading(false);
      }
    }

    fetchSpotifyData();
  }, [podcastId]);

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
    findout: {
      title: 'Find Out Podcast',
      subtitle: 'Conversations about politics, media and culture',
      color: 'text-terminal-purple',
      borderColor: 'border-terminal-purple',
      buttonColor: 'text-terminal-purple hover:text-terminal-magenta',
      subscribeUrl: 'https://findoutpodcast.substack.com/',
      subscribeChannel: 'find-out-podcast',
      spotifyUrl: 'https://open.spotify.com/show/3RinpxSRrx13zd8NwTWenu',
    },
    lincoln: {
      title: 'The Lincoln Project',
      subtitle: 'Saying the things others are afraid to say',
      color: 'text-terminal-cyan',
      borderColor: 'border-terminal-cyan',
      buttonColor: 'text-terminal-cyan hover:text-terminal-blue',
      subscribeUrl: 'https://lincolnproject.us',
      subscribeChannel: 'lincoln-project',
      spotifyUrl: 'https://open.spotify.com/show/6F16aSGEXM49ktwWScBKuK',
    },
  };

  const activeContent = feedContent[activeFeed] || feedContent.findout;

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
            onClick={() => setActiveFeed('findout')}
            className={`px-2 py-0.5 text-xs cursor-pointer ${
              activeFeed === 'findout'
                ? 'bg-terminal-purple/10 text-terminal-purple border border-terminal-purple/20'
                : 'text-terminal-dimmed hover:text-terminal-text'
            }`}
          >
            find-out
          </button>
          <button
            onClick={() => setActiveFeed('lincoln')}
            className={`px-2 py-0.5 text-xs cursor-pointer ${
              activeFeed === 'lincoln'
                ? 'bg-terminal-cyan/10 text-terminal-cyan border border-terminal-cyan/20'
                : 'text-terminal-dimmed hover:text-terminal-text'
            }`}
          >
            lincoln-project
          </button>
        </div>
      </div>

      {/* Spotify Embed Section */}
      {spotifyLoading ? (
        <div className='py-4 text-center'>
          <div className='inline-block border border-dashed border-terminal-dimmed/30 px-4 py-3'>
            <p className='text-terminal-dimmed animate-pulse'>
              $ loading spotify data<span className='animate-blink'>_</span>
            </p>
          </div>
        </div>
      ) : spotifyError ? (
        <div className='py-2 text-terminal-dimmed text-xs'>
          <p>Spotify data unavailable</p>
        </div>
      ) : (
        <div>
          {spotifyData && (
            <div>
              <div className='flex items-center mb-3'>
                {spotifyData.show.images && spotifyData.show.images[0] && (
                  <img
                    src={spotifyData.show.images[0].url}
                    alt={spotifyData.show.name}
                    className='w-16 h-16 mr-3 rounded'
                  />
                )}
                <div>
                  <p className={`${activeContent.color}`}>
                    {spotifyData.show.name}
                  </p>
                  <p className='text-terminal-dimmed text-xs'>
                    {spotifyData.show.publisher}
                  </p>
                </div>
              </div>

              <div className='mb-2'>
                <a
                  href={activeContent.spotifyUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`${activeContent.buttonColor} text-xs border ${activeContent.borderColor}/30 px-2 py-1 inline-block`}
                >
                  $ listen --on=spotify
                </a>
              </div>

              {spotifyData.episodes && spotifyData.episodes.length > 0 && (
                <div className='text-xs mt-2'>
                  <p className='text-terminal-text mb-1'>Latest episodes:</p>
                  <ul className='space-y-1 pl-2 border-l border-terminal-dimmed/20'>
                    {spotifyData.episodes.slice(0, 3).map((episode, idx) => (
                      <li
                        key={idx}
                        className='flex justify-between items-center'
                      >
                        <a
                          href={episode.external_urls.spotify}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-terminal-yellow hover:text-terminal-text truncate mr-2'
                          style={{ maxWidth: '75%' }}
                        >
                          {episode.name}
                        </a>
                        <span className='text-terminal-dimmed whitespace-nowrap'>
                          [{new Date(episode.release_date).getFullYear()}-
                          {new Date(episode.release_date).toLocaleString(
                            'en-US',
                            { month: 'short' }
                          )}
                          -
                          {String(
                            new Date(episode.release_date).getDate()
                          ).padStart(2, '0')}
                          ]
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RSS Feed Content */}
      {!isLoading && !error && feedItems.length > 0 && (
        <div>
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
