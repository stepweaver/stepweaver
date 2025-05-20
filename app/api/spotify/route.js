import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable route caching

export async function GET(request) {
  try {
    // Get show ID from the URL parameters
    const { searchParams } = new URL(request.url);
    const showId = searchParams.get('showId');

    console.log('Fetching Spotify podcast with ID:', showId);

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

    // Fetch show details with explicit ID
    const showResponse = await fetch(
      `https://api.spotify.com/v1/shows/${showId}?market=US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!showResponse.ok) {
      throw new Error(`Failed to fetch show: ${showResponse.status}`);
    }

    const show = await showResponse.json();
    console.log('Show title:', show.name); // Log the show name for debugging

    // Fetch episodes
    const episodesResponse = await fetch(
      `https://api.spotify.com/v1/shows/${showId}/episodes?market=US&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!episodesResponse.ok) {
      throw new Error(`Failed to fetch episodes: ${episodesResponse.status}`);
    }

    const episodes = await episodesResponse.json();

    return NextResponse.json({
      show,
      episodes: episodes.items,
    });
  } catch (error) {
    console.error('Error in Spotify API route:', error);
    return NextResponse.json(
      { error: `Failed to fetch Spotify data: ${error.message}` },
      { status: 500 }
    );
  }
}
