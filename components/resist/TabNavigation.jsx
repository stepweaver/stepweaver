import React from 'react';

export default function TabNavigation({
  activeTab,
  setActiveTab,
  setIsLoading,
}) {
  return (
    <div className='flex text-sm mb-2'>
      <button
        onClick={() => setActiveTab('home')}
        className={`mr-1 px-3 py-1 cursor-pointer ${
          activeTab === 'home'
            ? 'bg-terminal-bg text-terminal-green border-b border-terminal-green'
            : 'text-terminal-dimmed hover:text-terminal-text'
        }`}
      >
        /home
      </button>
      <button
        onClick={() => setActiveTab('ethos')}
        className={`mr-1 px-3 py-1 cursor-pointer ${
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
          setIsLoading(true);
        }}
        className={`mr-1 px-3 py-1 cursor-pointer ${
          activeTab === 'news'
            ? 'bg-terminal-bg text-terminal-blue border-b border-terminal-blue'
            : 'text-terminal-dimmed hover:text-terminal-text'
        }`}
      >
        /news
      </button>
      <button
        onClick={() => {
          setActiveTab('podcast');
          setIsLoading(true);
        }}
        className={`mr-1 px-3 py-1 cursor-pointer ${
          activeTab === 'podcast'
            ? 'bg-terminal-bg text-terminal-purple border-b border-terminal-purple'
            : 'text-terminal-dimmed hover:text-terminal-text'
        }`}
      >
        /podcast
      </button>
      <button
        onClick={() => {
          setActiveTab('resources');
          setIsLoading(true);
        }}
        className={`mr-1 px-3 py-1 cursor-pointer ${
          activeTab === 'resources'
            ? 'bg-terminal-bg text-terminal-red border-b border-terminal-red'
            : 'text-terminal-dimmed hover:text-terminal-text'
        }`}
      >
        /resources
      </button>
      <button
        onClick={() => {
          setActiveTab('music');
          setIsLoading(true);
        }}
        className={`mr-1 px-3 py-1 cursor-pointer ${
          activeTab === 'music'
            ? 'bg-terminal-bg text-terminal-green border-b border-terminal-green'
            : 'text-terminal-dimmed hover:text-terminal-text'
        }`}
      >
        /music
      </button>
    </div>
  );
}
