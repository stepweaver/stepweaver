import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get feed source from query parameter or default to Parnas
    const { searchParams } = new URL(request.url);
    const feedSource = searchParams.get('source') || 'parnas';

    // Define feed URLs based on source
    const feedUrls = {
      parnas: 'https://aaronparnas.substack.com/feed',
      underthedesk: 'https://underthedesknews.substack.com/feed',
      reich: 'https://robertreich.substack.com/feed',
      meidastouch: 'https://meidastouch.substack.com/feed',
      findout: 'https://findoutpodcast.substack.com/feed',
      lincoln: 'https://lincolnproject.us/feed',
    };

    const feedUrl = feedUrls[feedSource];
    if (!feedUrl) {
      return NextResponse.json(
        { error: `Invalid feed source: ${feedSource}` },
        { status: 400 }
      );
    }

    console.log(`RSS API: Fetching feed from ${feedSource} at ${feedUrl}...`);

    // Fetch RSS feed with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS-Reader/1.0)',
      },
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `RSS API: HTTP error ${response.status} ${response.statusText}`
      );
      throw new Error(
        `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
      );
    }

    const xmlText = await response.text();
    console.log(`RSS API: Received XML response of length ${xmlText.length}`);

    // Verify we got valid XML
    if (!xmlText || xmlText.length < 100 || !xmlText.includes('<rss')) {
      console.error('RSS API: Invalid XML response', xmlText.substring(0, 100));
      throw new Error('Received invalid RSS feed data');
    }

    // Parse XML and extract items (done on server-side)
    const items = parseRSSFeed(xmlText);
    console.log(`RSS API: Successfully parsed ${items.length} items`);

    if (items.length === 0) {
      console.warn('RSS API: No items found in feed');
      // Return empty array instead of error so the UI can handle it gracefully
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items, source: feedSource });
  } catch (error) {
    console.error('Error in RSS API route:', error);
    return NextResponse.json(
      { error: `Failed to fetch or parse RSS feed: ${error.message}` },
      { status: 500 }
    );
  }
}

function parseRSSFeed(xmlText) {
  // Use simple string parsing for server-side XML parsing
  // This avoids DOM-specific APIs that might not be available in Node.js

  try {
    // Extract items using regex
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items = [];
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];

      // Extract title, link, date, and description
      const title = extractTag(itemContent, 'title');
      const link = extractTag(itemContent, 'link');
      const pubDate = extractTag(itemContent, 'pubDate');
      let description = extractTag(itemContent, 'description');

      // Skip items with missing essential data
      if (!title || !link) {
        console.warn('RSS API: Skipping item with missing title or link');
        continue;
      }

      // Clean up CDATA if present
      const cleanedTitle = title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      const cleanedDescription = description
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
        .trim();

      items.push({
        title: cleanedTitle,
        link: link,
        pubDate: pubDate,
        description: cleanedDescription,
      });
    }

    // Return the first 5 items
    return items.slice(0, 5);
  } catch (error) {
    console.error('RSS API: Error parsing feed:', error);
    return []; // Return empty array on parse error
  }
}

function extractTag(content, tagName) {
  try {
    const regex = new RegExp(
      `<${tagName}(?:\\s+[^>]*)?>(.*?)<\/${tagName}>`,
      's'
    );
    const match = regex.exec(content);
    return match ? match[1] : '';
  } catch (error) {
    console.error(`RSS API: Error extracting ${tagName} tag:`, error);
    return '';
  }
}
