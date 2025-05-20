import React, { useState, useEffect } from 'react';

export default function MusicTab() {
  const [spotifyData, setSpotifyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch playlist data
  useEffect(() => {
    async function fetchPlaylistData() {
      try {
        setIsLoading(true);
        const timestamp = new Date().getTime(); // Add timestamp to prevent caching
        const response = await fetch(
          `/api/spotify/playlist?id=5iomNYmTVVcllyFq6y1TXh&t=${timestamp}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch playlist data');
        }
        const data = await response.json();
        setSpotifyData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching playlist data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    }

    fetchPlaylistData();
  }, []);

  return (
    <div className='p-4 text-sm'>
      <div className='border-b border-terminal-dimmed/20 pb-2 mb-3'>
        <div className='mb-2'>
          <p className='text-lg uppercase text-terminal-green'>
            Resistance Music
          </p>
          <p className='text-terminal-dimmed text-sm'>
            Anti-Trump playlist for the resistance
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className='py-12 text-center'>
          <div className='inline-block border border-dashed border-terminal-dimmed/30 px-4 py-3'>
            <p className='text-terminal-dimmed animate-pulse'>
              $ loading playlist data<span className='animate-blink'>_</span>
            </p>
          </div>
        </div>
      ) : error ? (
        <div className='py-4 border-l-2 border-terminal-red pl-3'>
          <p className='text-terminal-red'>ERROR: {error}</p>
          <p className='text-terminal-dimmed mt-1'>
            Failed to retrieve playlist
          </p>
        </div>
      ) : spotifyData ? (
        <div>
          <div className='flex items-start mb-6'>
            {spotifyData.playlist.images && spotifyData.playlist.images[0] && (
              <img
                src={spotifyData.playlist.images[0].url}
                alt='Playlist cover'
                className='w-24 h-24 mr-4 rounded'
              />
            )}
            <div>
              <h3 className='text-terminal-green text-lg'>
                {spotifyData.playlist.name}
              </h3>
              <p className='text-terminal-dimmed text-xs'>
                {spotifyData.playlist.tracks?.total || 0} tracks
              </p>

              <div className='mt-3'>
                <a
                  href={`https://open.spotify.com/playlist/${spotifyData.playlist.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-terminal-green hover:text-terminal-text text-xs border border-terminal-green/30 px-2 py-1 inline-block'
                >
                  $ listen --on=spotify
                </a>
              </div>
            </div>
          </div>

          <div className='mt-4'>
            <p className='text-terminal-text mb-2'>Recently added:</p>
            <ul className='space-y-1'>
              {spotifyData.tracks?.slice(0, 5).map((track, idx) => (
                <li
                  key={idx}
                  className='flex justify-between items-center py-1 hover:bg-terminal-bg/80'
                >
                  <a
                    href={track.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-terminal-yellow truncate mr-2 hover:text-terminal-text'
                    style={{ maxWidth: '60%' }}
                  >
                    {track.name}
                  </a>
                  <span
                    className='text-terminal-dimmed whitespace-nowrap truncate'
                    style={{ maxWidth: '40%' }}
                  >
                    {track.artists?.map((a) => a.name).join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className='py-4 border-l-2 border-terminal-yellow pl-3'>
          <p className='text-terminal-yellow'>No playlist found</p>
        </div>
      )}
    </div>
  );
}
