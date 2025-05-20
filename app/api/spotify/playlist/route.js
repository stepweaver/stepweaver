import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable route caching

export async function GET(request) {
  try {
    // Get playlist ID from the URL parameters
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('id') || '5iomNYmTVVcllyFq6y1TXh'; // Default to anti-Trump playlist

    console.log('Fetching Spotify playlist with ID:', playlistId);

    // Get token from Spotify
    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        cache: 'no-store',
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch playlist details
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}?market=US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!playlistResponse.ok) {
      throw new Error(`Failed to fetch playlist: ${playlistResponse.status}`);
    }

    const playlist = await playlistResponse.json();

    // Get tracks (limited to first 20 for display purposes)
    const tracks =
      playlist.tracks?.items?.slice(0, 20).map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists,
        album: item.track.album.name,
        image: item.track.album.images?.[0]?.url,
        duration: item.track.duration_ms,
        url: item.track.external_urls.spotify,
      })) || [];

    return NextResponse.json({
      playlist,
      tracks,
    });
  } catch (error) {
    console.error('Error in Spotify playlist API route:', error);
    return NextResponse.json(
      { error: `Failed to fetch Spotify playlist data: ${error.message}` },
      { status: 500 }
    );
  }
}
