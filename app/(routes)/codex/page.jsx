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

const ColoredText = ({ color, children }) => (
  <span className={`text-terminal-${color}`}>{children}</span>
);

export default function CodexPage() {
  const router = useRouter();
  const [tagParam, setTagParam] = useState(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
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

  // Get all unique hashtags for filter buttons
  const allHashtags = useMemo(() => {
    const tags = new Set();
    allPosts.forEach((post) => {
      if (post.hashtags) {
        post.hashtags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [allPosts]);

  // Filter content based on selected filters
  const filteredPosts = useMemo(() => {
    let result = allPosts;
    if (activeTypeFilter !== 'all') {
      result = result.filter((post) => post.type === activeTypeFilter);
    }
    if (activeHashtags.length > 0) {
      result = result.filter((post) => {
        const postTags = post.hashtags || [];
        return activeHashtags.some((tag) => postTags.includes(tag));
      });
    }
    return result;
  }, [allPosts, activeTypeFilter, activeHashtags]);

  // Sync terminal state with UI buttons
  const syncFilterState = (filters) => {
    if (!filters) return;

    if (filters.type !== undefined) {
      setActiveTypeFilter(filters.type || 'all');
    }
    if (filters.tags !== undefined) {
      setActiveHashtags(filters.tags || []);
    }
  };

  // Use command processor hook
  const { toggleHashtag, processCommand } = useCommandProcessor({
    allHashtags,
    setActiveTypeFilter,
    setActiveHashtags,
    activeHashtags,
    terminalRef,
    showTerminal,
  });

  // Update terminal when filters change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.updateFilters({
        type: activeTypeFilter === 'all' ? null : activeTypeFilter,
        tags: activeHashtags,
      });
    }
  }, [activeTypeFilter, activeHashtags]);

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
    }

    // Process the command
    processCommand(cmd, true);
  };

  // Handle type filter button click
  const handleTypeFilter = (type) => {
    setActiveTypeFilter(type);

    if (showTerminal && terminalRef.current?.executeCommand) {
      if (type === 'all') {
        terminalRef.current.executeCommand('codex all');
      } else {
        terminalRef.current.executeCommand(`codex ${type}`);
      }
    }
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
        {/* Page Title with terminal toggle button */}
        <div className='border-l-2 border-terminal-green pl-5 mb-6'>
          <h2 className='text-xl text-terminal-green flex items-center'>
            # CODEX<span className='animate-blink ml-1 mr-4'>_</span>
          </h2>
          <p className='text-terminal-text mt-2'>
            Browse my collection of blog posts, podcasts, projects and more.
            <span className='block mt-1 text-terminal-dimmed text-sm'>
              Try commands like{' '}
              <code className='text-terminal-green'>blog</code>,{' '}
              <code className='text-terminal-green ml-1'>project</code>,
              hashtags like <code className='text-terminal-green ml-1'>ai</code>
              , or use{' '}
              <code className='text-terminal-green ml-1'>open [slug]</code> to
              find posts directly. Try combinations like{' '}
              <code className='text-terminal-green ml-1'>blog+ai</code>. Type{' '}
              <code className='text-terminal-green ml-1'>clear</code> to reset
              filters.
            </span>
          </p>
        </div>
        <button
          onClick={toggleTerminal}
          className='mb-4 px-2.5 h-5 text-xs bg-terminal-green/10 border border-terminal-green text-terminal-green rounded hover:bg-terminal-green/20 transition-colors cursor-pointer'
        >
          {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
        </button>

        {/* Command input component */}
        <CommandInput
          onExecuteCommand={handleExecuteCommand}
          placeholder='Try "blog", "ai", or "open my-post" to find posts directly'
        />

        {/* Display loading or error state */}
        {loading ? (
          <GlitchingLoader />
        ) : error ? (
          <div className='border border-terminal-red/50 bg-terminal-red/10 text-terminal-red p-4 my-4 rounded'>
            {error}
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className='mb-4'>
              {/* Type filter */}
              <div className='mb-3'>
                <div className='flex items-center w-full mb-2'>
                  <span className='text-terminal-green mr-2'>$</span>
                  <span className='text-terminal-dimmed text-sm'>
                    filter by type:
                  </span>
                </div>
                <div className='flex flex-wrap gap-2 mx-auto max-w-4xl'>
                  <TypeTagButton
                    type='all'
                    active={activeTypeFilter === 'all'}
                    onClick={() => handleTypeFilter('all')}
                  >
                    all
                  </TypeTagButton>
                  <TypeTagButton
                    type='blog'
                    active={activeTypeFilter === 'blog'}
                    onClick={() => handleTypeFilter('blog')}
                  >
                    blog
                  </TypeTagButton>
                  <TypeTagButton
                    type='podcast'
                    active={activeTypeFilter === 'podcast'}
                    onClick={() => handleTypeFilter('podcast')}
                  >
                    podcast
                  </TypeTagButton>
                  <TypeTagButton
                    type='website'
                    active={activeTypeFilter === 'website'}
                    onClick={() => handleTypeFilter('website')}
                  >
                    website
                  </TypeTagButton>
                  <TypeTagButton
                    type='article'
                    active={activeTypeFilter === 'article'}
                    onClick={() => handleTypeFilter('article')}
                  >
                    article
                  </TypeTagButton>
                  <TypeTagButton
                    type='tool'
                    active={activeTypeFilter === 'tool'}
                    onClick={() => handleTypeFilter('tool')}
                  >
                    tool
                  </TypeTagButton>
                  <TypeTagButton
                    type='project'
                    active={activeTypeFilter === 'project'}
                    onClick={() => handleTypeFilter('project')}
                  >
                    project
                  </TypeTagButton>
                </div>
              </div>

              {/* Hashtag filter component */}
              <div ref={tagFilterRef}>
                <HashtagFilter
                  allHashtags={allHashtags}
                  activeHashtags={activeHashtags}
                  toggleHashtag={toggleHashtag}
                />
              </div>
            </div>

            {/* Terminal display - only show when toggled */}
            {showTerminal && (
              <div className='max-w-4xl mx-auto mb-6'>
                <div className='transition-opacity duration-500'>
                  <TerminalWindow title='~/codex'>
                    <Terminal ref={terminalRef} />
                  </TerminalWindow>
                </div>
              </div>
            )}

            {/* Content list */}
            <div className='max-w-4xl mx-auto'>
              <div className='mb-2 flex items-center'>
                <span className='text-terminal-green mr-2'>$</span>
                <span className='text-terminal-dimmed text-sm'>
                  Showing {filteredPosts.length} of {allPosts.length} items
                  {activeTypeFilter !== 'all' &&
                    ` filtered by type: ${activeTypeFilter}`}
                  {activeHashtags.length > 0 &&
                    ` and tags: ${activeHashtags
                      .map((t) => `#${t}`)
                      .join(', ')}`}
                </span>
              </div>

              <div>
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
