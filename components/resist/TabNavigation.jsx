import React from 'react';

export default function TabNavigation({
  activeTab,
  setActiveTab,
  setIsLoading,
}) {
  return (
    <div className='flex font-mono text-sm mb-2'>
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
    </div>
  );
}
