'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TypeTagButton from '@/components/ui/TypeTagButton';
import Terminal from '@/components/terminal/Terminal';
import TerminalWindow from '@/components/ui/TerminalWindow';
import GlitchingLoader from '@/components/ui/GlitchingLoader';
import CommandInput from '@/components/codex/CommandInput';
import HashtagFilter from '@/components/codex/HashtagFilter';
import PostItem from '@/components/codex/PostItem';
import useCommandProcessor from '@/components/codex/hooks/useCommandProcessor';
import { formatDate, getTypeColor } from '@/utils/terminalStyles';
import TabNavigation from '@/components/codex/TabNavigation';

const ColoredText = ({ color, children }) => (
  <span className={`text-terminal-${color}`}>{children}</span>
);

export default function CodexPage() {
  const router = useRouter();
  const [tagParam, setTagParam] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [activeHashtags, setActiveHashtags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const terminalRef = useRef(null);
  const tagFilterRef = useRef(null);

  // Get search params on client side
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    if (tag) {
      setTagParam(tag);
      setActiveHashtags([tag]);
    }
  }, []);

  // Fetch all posts from API
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/codex');

        if (!res.ok) {
          throw new Error('Failed to fetch content');
        }

        const data = await res.json();
        setPosts(data);

        if (terminalRef.current) {
          terminalRef.current.setSyncCallback(syncFilterState);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Sort all posts by date descending
  const allPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      // Use updated date if available, otherwise use original date
      const dateA = a.updated ? new Date(a.updated) : new Date(a.date);
      const dateB = b.updated ? new Date(b.updated) : new Date(b.date);
      return dateB - dateA;
    });
  }, [posts]);

  // Get all unique hashtags for filter buttons, filtered by type if needed
  const filteredHashtags = useMemo(() => {
    const tags = new Set();
    const relevantPosts =
      activeTab === 'all'
        ? allPosts
        : allPosts.filter((post) => post.type === activeTab);

    relevantPosts.forEach((post) => {
      if (post.hashtags) {
        post.hashtags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [allPosts, activeTab]);

  // Filter content based on selected filters
  const filteredPosts = useMemo(() => {
    let result = allPosts;

    // First filter by type if not 'all'
    if (activeTab !== 'all') {
      result = result.filter((post) => post.type === activeTab);
    }

    // Then filter by hashtags if any are selected
    if (activeHashtags.length > 0) {
      result = result.filter((post) => {
        const postTags = post.hashtags || [];
        return activeHashtags.some((tag) => postTags.includes(tag));
      });
    }

    return result;
  }, [allPosts, activeTab, activeHashtags]);

  // Sync terminal state with UI buttons
  const syncFilterState = (filters) => {
    if (!filters) return;

    if (filters.type !== undefined) {
      setActiveTab(filters.type || 'all');
    }
    if (filters.tags !== undefined) {
      setActiveHashtags(filters.tags || []);
    }
  };

  // Use command processor hook
  const { processCommand, lastError } = useCommandProcessor({
    allHashtags: filteredHashtags,
    setActiveTab,
    setActiveHashtags,
    activeHashtags,
    terminalRef,
    showTerminal,
    activeTab,
  });

  // Update terminal when filters change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.updateFilters({
        type: activeTab === 'all' ? null : activeTab,
        tags: activeHashtags,
      });
    }
  }, [activeTab, activeHashtags]);

  // Scroll to tag filter section when tag is in URL
  useEffect(() => {
    if (tagParam && tagFilterRef.current) {
      const timeoutId = setTimeout(() => {
        tagFilterRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [tagParam]);

  // Toggle terminal visibility
  const toggleTerminal = () => {
    setShowTerminal((prev) => !prev);
  };

  // Process commands and ensure terminal is visible for certain commands like open
  const handleExecuteCommand = (cmd) => {
    // If it's an "open" command, make sure the terminal is visible
    if (cmd.toLowerCase().startsWith('open ')) {
      setShowTerminal(true);

      // Add a slight delay to ensure terminal is fully rendered before sending the command
      setTimeout(() => {
        processCommand(cmd, true);
      }, 300);
    } else {
      // Process other commands immediately
      processCommand(cmd, true);
    }
  };

  // Handle type filter button click
  const handleTypeFilter = (type) => {
    setActiveTab(type);

    if (showTerminal && terminalRef.current?.executeCommand) {
      if (type === 'all') {
        terminalRef.current.executeCommand('codex all');
      } else {
        terminalRef.current.executeCommand(`codex ${type}`);
      }
    }
  };

  // Handle hashtag click
  const handleHashtagClick = (tag) => {
    // If we're not in the 'all' tab, switch to it
    if (activeTab !== 'all') {
      setActiveTab('all');
    }

    // Toggle the hashtag in the active hashtags array
    setActiveHashtags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  // Add direct click handler for navigation
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Find closest element with data-open attribute
      const target = e.target.closest('[data-open], [data-auto-open]');
      if (target) {
        const path =
          target.getAttribute('data-open') ||
          target.getAttribute('data-auto-open');
        if (path) {
          // Navigate to the path
          e.preventDefault();
          router.push(`/${path}`);
        }
      }
    };

    // Add event listener
    document.addEventListener('click', handleDocumentClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [router]);

  return (
    <div className='space-y-6 mt-8'>
      <div>
        {/* Page Title */}
        <div className='border-l-2 border-terminal-green pl-5 mb-6'>
          <h2 className='text-xl text-terminal-green flex items-center'>
            # CODEX<span className='animate-blink ml-1 mr-4'>_</span>
          </h2>
          <p className='text-terminal-text mt-2'>
            Welcome to the vault. Every blog post, podcast, project, rant, or
            idea I've logged — all here, all searchable. Use commands or click
            below to filter. Go wild!
          </p>
        </div>

        {/* Terminal Toggle and Command Input */}
        <div className='mb-6 mt-8'>
          <button
            onClick={toggleTerminal}
            className='mb-6 px-2.5 h-5 text-xs bg-terminal-green/10 border border-terminal-green text-terminal-green rounded hover:bg-terminal-green/20 transition-colors cursor-pointer'
          >
            {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
          </button>

          <div className='text-terminal-dimmed text-sm mb-3'>
            <span className='text-terminal-green'>$</span> Try these commands:
            <div className='ml-4 mt-2'>
              <div>
                <span className='text-terminal-green'>/all</span> - view all
                posts
              </div>
              <div>
                <span className='text-terminal-green'>/blog</span> - view blog
                posts
              </div>
              <div>
                <span className='text-terminal-green'>/podcast</span> - view
                podcasts
              </div>
              <div>
                <span className='text-terminal-green'>#ai</span> - filter by
                hashtag
              </div>
              <div>
                <span className='text-terminal-green'>/blog #ai</span> - combine
                filters
              </div>
              <div>
                <span className='text-terminal-green'>clear</span> - reset all
                filters
              </div>
            </div>
          </div>

          <CommandInput
            onExecuteCommand={handleExecuteCommand}
            placeholder='Type /blog, #ai, clear, or combine filters like "/blog #ai"'
            error={lastError}
          />
        </div>

        {/* Display loading or error state */}
        {loading ? (
          <GlitchingLoader />
        ) : error ? (
          <div className='border border-terminal-red/50 bg-terminal-red/10 text-terminal-red p-4 my-4 rounded'>
            {error}
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={(type) => {
                setActiveTab(type);
                // Clear hashtag filters when changing tabs unless going to 'all'
                if (type !== 'all') {
                  setActiveHashtags([]);
                }
              }}
            />

            {/* Hashtag filter */}
            {filteredHashtags.length > 0 && (
              <div ref={tagFilterRef} className='mb-6 mt-4'>
                <div className='flex items-center justify-center mb-2'>
                  <span className='text-terminal-green mr-2'>$</span>
                  <span className='text-terminal-dimmed text-sm'>
                    {activeTab === 'all'
                      ? 'all hashtags:'
                      : `${activeTab} hashtags:`}
                  </span>
                </div>
                <div className='flex flex-wrap gap-2 justify-center'>
                  {filteredHashtags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleHashtagClick(tag)}
                      className={`
                        px-3 py-1.5 text-sm rounded cursor-pointer
                        transition-all duration-200 
                        ${
                          activeHashtags.includes(tag)
                            ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/50 hover:bg-terminal-green/30'
                            : 'text-terminal-dimmed hover:text-terminal-text hover:bg-terminal-dimmed/10 border border-transparent hover:border-terminal-dimmed/20'
                        }
                        hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(76,175,80,0.3)]
                      `}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Terminal display - only show when toggled */}
            {showTerminal && (
              <div className='mb-6'>
                <div className='transition-opacity duration-500'>
                  <TerminalWindow title='~/codex'>
                    <Terminal ref={terminalRef} />
                  </TerminalWindow>
                </div>
              </div>
            )}

            {/* Content list */}
            <div>
              <div className='mb-4 flex items-center text-sm text-terminal-dimmed'>
                <span className='text-terminal-green mr-2'>$</span>
                Showing {filteredPosts.length} of {allPosts.length} items
                {activeTab !== 'all' && ` in ${activeTab}`}
                {activeHashtags.length > 0 &&
                  ` tagged with ${activeHashtags
                    .map((t) => `#${t}`)
                    .join(', ')}`}
              </div>

              <div className='space-y-2'>
                {filteredPosts.map((post, index) => (
                  <PostItem
                    key={`${post.slug}-${index}`}
                    post={post}
                    formatDate={formatDate}
                    getTypeColor={getTypeColor}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
