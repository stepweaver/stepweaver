import React from 'react';

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'all', label: '/all' },
    { id: 'blog', label: '/blog' },
    { id: 'podcast', label: '/podcast' },
    { id: 'project', label: '/project' },
    { id: 'article', label: '/article' },
    { id: 'tool', label: '/tool' },
    { id: 'community', label: '/community' },
  ];

  return (
    <div className='flex justify-center border-b border-terminal-dimmed/20 font-ibm'>
      <div className='flex space-x-1'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 text-sm transition-all duration-200 cursor-pointer
              ${
                activeTab === tab.id
                  ? 'text-terminal-green border-b-2 border-terminal-green hover:text-terminal-green/90'
                  : 'text-terminal-dimmed hover:text-terminal-text hover:bg-terminal-dimmed/5'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
