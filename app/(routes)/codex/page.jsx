'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TypeTagButton from '@/components/ui/TypeTagButton';
import Terminal from '@/components/terminal/Terminal';
import TerminalWindow from '@/components/ui/TerminalWindow';

export default function CodexPage() {
  const router = useRouter();
  const [tagParam, setTagParam] = useState(null);

  // Get search params on client side
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTagParam(params.get('tag'));
  }, []);

  // State for filters
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeHashtags, setActiveHashtags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const terminalRef = useRef(null);

  // Sync terminal state with UI buttons
  const syncFilterState = (filters) => {
    // Safely handle null or undefined filters
    if (!filters) return;

    if (filters.type !== undefined) {
      setActiveTypeFilter(filters.type || 'all');
    }
    if (filters.tags !== undefined) {
      setActiveHashtags(filters.tags || []);
    }
  };

  useEffect(() => {
    // Update terminal when filters change via UI
    if (terminalRef.current) {
      terminalRef.current.updateFilters({
        type: activeTypeFilter === 'all' ? null : activeTypeFilter,
        tags: activeHashtags,
      });
    }
  }, [activeTypeFilter, activeHashtags]);

  // Fetch all posts from API
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch('/api/codex');
        const data = await res.json();
        setPosts(data);

        // Initialize terminal with reference to sync function
        if (terminalRef.current) {
          terminalRef.current.setSyncCallback(syncFilterState);
        }
      } catch (error) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Sort all posts by date descending
  const allPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
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

  // Only set activeHashtags from tagParam on initial load
  const initializedFromUrl = useRef(false);
  useEffect(() => {
    if (tagParam && !initializedFromUrl.current) {
      setActiveHashtags([tagParam]);
      initializedFromUrl.current = true;
    }
  }, [tagParam]);

  // Reference for scrolling to tag filter section when arriving with a tag parameter
  const tagFilterRef = useRef(null);

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

  // Toggle hashtag selection
  const toggleHashtag = (tag) => {
    // Debounce flag to prevent multiple rapid clicks
    if (toggleHashtag.isProcessing) return;
    toggleHashtag.isProcessing = true;

    // Update state only once
    if (activeHashtags.includes(tag)) {
      setActiveHashtags((prev) => prev.filter((t) => t !== tag));
    } else {
      setActiveHashtags((prev) => [...prev, tag]);
    }

    // Execute command in terminal (once)
    if (terminalRef.current?.executeCommand) {
      // Clear previous timer if exists
      if (toggleHashtag.timer) {
        clearTimeout(toggleHashtag.timer);
      }

      // Set a new timer
      toggleHashtag.timer = setTimeout(() => {
        terminalRef.current.executeCommand(`filter ${tag}`);
        toggleHashtag.isProcessing = false;
      }, 50);
    } else {
      // Reset processing flag immediately if no terminal reference
      toggleHashtag.isProcessing = false;
    }
  };

  // Initialize flags
  toggleHashtag.isProcessing = false;
  toggleHashtag.timer = null;

  // Setup commands when a type filter is selected
  const handleTypeFilter = (type) => {
    // Prevent duplicate commands during rapid clicks
    if (handleTypeFilter.processing) return;
    handleTypeFilter.processing = true;

    // Update UI state
    setActiveTypeFilter(type);

    // Execute command in terminal when type is clicked
    if (terminalRef.current?.executeCommand) {
      // Clear any existing timeout
      if (handleTypeFilter.timer) {
        clearTimeout(handleTypeFilter.timer);
      }

      // Set a single timer to execute the command
      handleTypeFilter.timer = setTimeout(() => {
        if (type === 'all') {
          terminalRef.current.executeCommand('codex all');
        } else {
          terminalRef.current.executeCommand(`codex ${type}`);
        }

        // Reset processing flag
        handleTypeFilter.processing = false;
      }, 50);
    } else {
      // Reset immediately if no terminal reference
      handleTypeFilter.processing = false;
    }
  };

  // Initialize flags
  handleTypeFilter.processing = false;
  handleTypeFilter.timer = null;

  return (
    <div className='space-y-8 mt-8'>
      <div>
        {/* Page Title */}
        <div className='border-l-2 border-terminal-green pl-5 mb-8'>
          <h2 className='text-xl text-terminal-green'>
            # CODEX <span className='animate-blink'>_</span>
          </h2>
          <p className='text-terminal-text mt-4'>
            Browse my collection of blog posts, podcasts, projects and more. Use
            the terminal to explore or filter using the buttons below.
          </p>
        </div>

        {/* Filters */}
        <div className='mt-6 mb-8'>
          {/* Type filter */}
          <div className='mb-4'>
            <div className='flex items-center justify-center w-full mb-4'>
              <span className='text-terminal-green mr-2'>$</span>
              <span className='text-terminal-dimmed'>filter by type:</span>
            </div>
            <div className='flex flex-wrap gap-2 justify-evenly mx-auto max-w-4xl'>
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
                {activeTypeFilter !== 'blog' && (
                  <span className='mr-1'>📝</span>
                )}
                blog
              </TypeTagButton>
              <TypeTagButton
                type='podcast'
                active={activeTypeFilter === 'podcast'}
                onClick={() => handleTypeFilter('podcast')}
              >
                {activeTypeFilter !== 'podcast' && (
                  <span className='mr-1'>🎙️</span>
                )}
                podcast
              </TypeTagButton>
              <TypeTagButton
                type='website'
                active={activeTypeFilter === 'website'}
                onClick={() => handleTypeFilter('website')}
              >
                {activeTypeFilter !== 'website' && (
                  <span className='mr-1'>🌐</span>
                )}
                website
              </TypeTagButton>
              <TypeTagButton
                type='article'
                active={activeTypeFilter === 'article'}
                onClick={() => handleTypeFilter('article')}
              >
                {activeTypeFilter !== 'article' && (
                  <span className='mr-1'>📄</span>
                )}
                article
              </TypeTagButton>
              <TypeTagButton
                type='tool'
                active={activeTypeFilter === 'tool'}
                onClick={() => handleTypeFilter('tool')}
              >
                {activeTypeFilter !== 'tool' && (
                  <span className='mr-1'>🛠️</span>
                )}
                tool
              </TypeTagButton>
              <TypeTagButton
                type='project'
                active={activeTypeFilter === 'project'}
                onClick={() => handleTypeFilter('project')}
              >
                {activeTypeFilter !== 'project' && (
                  <span className='mr-1'>✨</span>
                )}
                project
              </TypeTagButton>
            </div>
          </div>

          {/* Tag filter */}
          <div ref={tagFilterRef} className='mb-4'>
            <div className='flex items-center justify-center w-full mb-4'>
              <span className='text-terminal-green mr-2'>$</span>
              <span className='text-terminal-dimmed'>filter by tag:</span>
            </div>
            <div className='flex flex-wrap gap-2 justify-center mx-auto max-w-4xl'>
              {allHashtags.map((tag) => {
                const isSelected = activeHashtags.includes(tag);
                const isPulsing = isSelected;

                return (
                  <button
                    key={tag}
                    onClick={() => toggleHashtag(tag)}
                    className={`px-2 text-sm rounded border inline-flex items-center justify-center cursor-pointer 
                      ${
                        isSelected
                          ? 'bg-terminal-green text-black border-terminal-green'
                          : 'bg-black text-terminal-green border-terminal-green'
                      }
                      ${isPulsing ? 'animate-pulse' : ''}
                    `}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Terminal display */}
        <div className='max-w-4xl mx-auto'>
          <div
            className={`transition-opacity duration-500 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <TerminalWindow title='~/codex'>
              {!loading && <Terminal ref={terminalRef} />}
            </TerminalWindow>
          </div>
        </div>
      </div>
    </div>
  );
}
