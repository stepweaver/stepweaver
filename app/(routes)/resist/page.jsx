'use client';

import React, { useEffect, useState } from 'react';
import TabNavigation from '@/components/resist/TabNavigation';
import HomeTab from '@/components/resist/HomeTab';
import EthosTab from '@/components/resist/EthosTab';
import NewsTab from '@/components/resist/NewsTab';
import PodcastTab from '@/components/resist/PodcastTab';
import ResourcesTab from '@/components/resist/ResourcesTab';
import TimeDisplay from '@/components/resist/TimeDisplay';
import MusicTab from '@/components/resist/MusicTab';

export default function ResistPage() {
  // State for RSS feeds
  const [parsedFeedItems, setParsedFeedItems] = useState({
    parnas: [],
    underthedesk: [],
    reich: [],
    meidastouch: [],
    findout: [],
    lincoln: [],
    offense: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'ethos', 'news', 'podcast', or 'resources'
  const [currentFeedSource, setCurrentFeedSource] = useState('parnas');

  useEffect(() => {
    async function fetchFeed(source) {
      if (!source) return;

      try {
        // Check if we already have the feed data
        if (parsedFeedItems[source] && parsedFeedItems[source].length > 0) {
          setIsLoading(false);
          return;
        }

        const timestamp = new Date().getTime();
        const response = await fetch(
          `/api/rss?source=${source}&t=${timestamp}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Server error');
        }

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        // Update the specific feed source data
        setParsedFeedItems((prev) => ({
          ...prev,
          [source]: data.items || [],
        }));
        setIsLoading(false);
      } catch (err) {
        console.error(`Error fetching ${source} RSS feed:`, err);
        setError(err.message || `Failed to load ${source} feed`);
        setIsLoading(false);
      }
    }

    // Determine which feed(s) to fetch based on active tab
    if (activeTab === 'news') {
      setCurrentFeedSource('parnas');
      fetchFeed('parnas');
      fetchFeed('underthedesk');
      fetchFeed('meidastouch');
    } else if (activeTab === 'podcast') {
      setCurrentFeedSource('findout');
      fetchFeed('findout');
      fetchFeed('lincoln');
    } else if (activeTab === 'resources') {
      setCurrentFeedSource('reich');
      fetchFeed('reich');
      fetchFeed('offense');
    }
  }, [activeTab]);

  return (
    <div className='max-w-3xl mx-auto px-3 py-4'>
      {/* Terminal Header */}
      <div className='flex justify-between items-center mb-3'>
        <div className='text-lg flex items-center'>
          <span className='text-terminal-red font-bold mr-1.5'>#</span>
          <span className='text-terminal-white'>
            RESIST<span className='animate-blink ml-1'>_</span>
          </span>
        </div>
        <TimeDisplay />
      </div>

      {/* Terminal Navigation */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsLoading={setIsLoading}
      />

      {/* Content Panel */}
      <div className='bg-terminal-bg/90'>
        {/* Home Tab Content */}
        {activeTab === 'home' && (
          <HomeTab setActiveTab={setActiveTab} setIsLoading={setIsLoading} />
        )}

        {/* Ethos Tab Content */}
        {activeTab === 'ethos' && <EthosTab />}

        {/* News Tab Content */}
        {activeTab === 'news' && (
          <NewsTab
            feedItems={
              currentFeedSource === 'parnas'
                ? parsedFeedItems.parnas
                : currentFeedSource === 'underthedesk'
                ? parsedFeedItems.underthedesk
                : parsedFeedItems.meidastouch
            }
            isLoading={isLoading}
            error={error}
            setFeedSource={setCurrentFeedSource}
          />
        )}

        {/* Podcast Tab Content */}
        {activeTab === 'podcast' && (
          <PodcastTab
            feedItems={
              currentFeedSource === 'findout'
                ? parsedFeedItems.findout
                : parsedFeedItems.lincoln
            }
            isLoading={isLoading}
            error={error}
            setFeedSource={setCurrentFeedSource}
          />
        )}

        {/* Resource Tab Content */}
        {activeTab === 'resources' && (
          <ResourcesTab
            feedItems={parsedFeedItems.reich}
            isLoading={isLoading}
            error={error}
            setFeedSource={setCurrentFeedSource}
          />
        )}

        {/* Music Tab Content */}
        {activeTab === 'music' && <MusicTab />}
      </div>
    </div>
  );
}
