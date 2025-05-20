// app/(routes)/resist/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import TabNavigation from '@/components/resist/TabNavigation';
import HomeTab from '@/components/resist/HomeTab';
import EthosTab from '@/components/resist/EthosTab';
import NewsTab from '@/components/resist/NewsTab';
import TimeDisplay from '@/components/resist/TimeDisplay';

export default function ResistPage() {
  // State for RSS feed
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'ethos', or 'news'

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
          <NewsTab feedItems={feedItems} isLoading={isLoading} error={error} />
        )}
      </div>

      {/* Terminal Command Line */}
      <div className='flex items-center pt-2 text-sm font-mono'>
        <span className='text-terminal-green mr-1.5'>$</span>
        <span className='text-terminal-text animate-blink'>_</span>
      </div>
    </div>
  );
}
