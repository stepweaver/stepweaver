import React from 'react';

export default function TabNavigation({
  activeTab,
  setActiveTab,
  setIsLoading,
}) {
  const tabs = [
    { key: 'home', label: '/home' },
    { key: 'ethos', label: '/ethos' },
    { key: 'news', label: '/news' },
    { key: 'podcast', label: '/podcast' },
    { key: 'resources', label: '/resources' },
    { key: 'music', label: '/music' },
  ];

  return (
    <>
      {/* Desktop Tabs */}
      <div className='hidden sm:flex font-mono text-sm mb-2'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setIsLoading(true);
            }}
            className={`mr-1 px-3 py-1 cursor-pointer ${
              activeTab === tab.key
                ? 'bg-terminal-bg text-terminal-green border-b border-terminal-green'
                : 'text-terminal-dimmed hover:text-terminal-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Mobile Dropdown */}
      <div className='sm:hidden mb-2'>
        <select
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value);
            setIsLoading(true);
          }}
          className='w-full p-2 border border-terminal-green bg-terminal-dark text-terminal-green font-mono text-sm rounded'
          style={{
            backgroundColor: 'var(--color-terminal-dark)',
            color: 'var(--color-terminal-green)',
            borderColor: 'var(--color-terminal-green)',
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
