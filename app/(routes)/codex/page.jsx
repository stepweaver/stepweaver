'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TypeTagButton from '@/components/ui/TypeTagButton';
import Terminal from '@/components/terminal/Terminal';
import TerminalWindow from '@/components/ui/TerminalWindow';

export default function CodexPage() {
  const router = useRouter();
  const [tagParam, setTagParam] = useState(null);
  const [commandInput, setCommandInput] = useState('');
  const [hoveredItemIndex, setHoveredItemIndex] = useState(null);

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
  const [showTerminal, setShowTerminal] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Add state to track hovered hashtag
  const [hoveredTag, setHoveredTag] = useState(null);

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

  useEffect(() => {
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
    if (toggleHashtag.isProcessing) return;
    toggleHashtag.isProcessing = true;

    if (activeHashtags.includes(tag)) {
      setActiveHashtags((prev) => prev.filter((t) => t !== tag));
    } else {
      setActiveHashtags((prev) => [...prev, tag]);
    }

    if (showTerminal && terminalRef.current?.executeCommand) {
      if (toggleHashtag.timer) {
        clearTimeout(toggleHashtag.timer);
      }

      toggleHashtag.timer = setTimeout(() => {
        terminalRef.current.executeCommand(`filter ${tag}`);
        toggleHashtag.isProcessing = false;
      }, 50);
    } else {
      toggleHashtag.isProcessing = false;
    }
  };

  toggleHashtag.isProcessing = false;
  toggleHashtag.timer = null;

  // Setup commands when a type filter is selected
  const handleTypeFilter = (type) => {
    if (handleTypeFilter.processing) return;
    handleTypeFilter.processing = true;

    setActiveTypeFilter(type);

    if (showTerminal && terminalRef.current?.executeCommand) {
      if (handleTypeFilter.timer) {
        clearTimeout(handleTypeFilter.timer);
      }

      handleTypeFilter.timer = setTimeout(() => {
        if (type === 'all') {
          terminalRef.current.executeCommand('codex all');
        } else {
          terminalRef.current.executeCommand(`codex ${type}`);
        }

        handleTypeFilter.processing = false;
      }, 50);
    } else {
      handleTypeFilter.processing = false;
    }
  };

  handleTypeFilter.processing = false;
  handleTypeFilter.timer = null;

  // Toggle terminal visibility
  const toggleTerminal = () => {
    setShowTerminal((prev) => !prev);
  };

  // Enhanced command processing
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    // Define valid content types
    const contentTypes = [
      'all',
      'blog',
      'podcast',
      'website',
      'article',
      'tool',
      'project',
    ];

    // Check if command contains multiple parts (separated by '+')
    if (cmd.includes('+')) {
      const parts = cmd.split('+').map((part) => part.trim());
      let hasSetType = false;

      // Process each part
      parts.forEach((part) => {
        // If it's a content type and we haven't set one yet
        if (contentTypes.includes(part) && !hasSetType) {
          setActiveTypeFilter(part);
          hasSetType = true;
        }
        // If it's a hashtag
        else if (allHashtags.includes(part)) {
          if (!activeHashtags.includes(part)) {
            setActiveHashtags((prev) => [...prev, part]);
          }
        }
      });
    }
    // Check if it's a full command
    else if (cmd.startsWith('codex ')) {
      const type = cmd.substring(6).trim();
      if (contentTypes.includes(type)) {
        setActiveTypeFilter(type);
      }
    }
    // Check if it's a filter command
    else if (cmd.startsWith('filter ')) {
      const tag = cmd.substring(7).trim();
      if (allHashtags.includes(tag)) {
        toggleHashtag(tag);
      }
    }
    // Check if it's just a content type
    else if (contentTypes.includes(cmd)) {
      setActiveTypeFilter(cmd);
    }
    // Check if it's just a hashtag
    else if (allHashtags.includes(cmd)) {
      toggleHashtag(cmd);
    }
    // Check special commands
    else if (cmd === 'clear' || cmd === 'reset') {
      // Reset all filters
      setActiveTypeFilter('all');
      setActiveHashtags([]);
    }

    // Always pass to terminal for visual feedback if visible
    if (showTerminal && terminalRef.current?.executeCommand) {
      // Translate abbreviated commands to full commands for terminal
      if (contentTypes.includes(cmd) && !cmd.startsWith('codex')) {
        terminalRef.current.executeCommand(`codex ${cmd}`);
      } else if (allHashtags.includes(cmd) && !cmd.startsWith('filter')) {
        terminalRef.current.executeCommand(`filter ${cmd}`);
      } else {
        terminalRef.current.executeCommand(cmd);
      }
    }

    setCommandInput('');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `[${date.getFullYear()}-${date.toLocaleString('en-US', {
      month: 'short',
    })}-${String(date.getDate()).padStart(2, '0')}]`;
  };

  // Get type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'blog':
        return 'terminal-green';
      case 'podcast':
        return 'terminal-purple';
      case 'website':
        return 'terminal-yellow';
      case 'article':
        return 'terminal-red';
      case 'tool':
        return 'terminal-blue';
      case 'project':
        return 'terminal-magenta';
      default:
        return 'terminal-green';
    }
  };

  // Function to get enhanced CSS shadow for different colors
  const getGlowStyle = (type) => {
    // Map type to RGB color values for the glow
    const glowColors = {
      blog: '0, 255, 65', // terminal-green
      podcast: '192, 96, 255', // terminal-purple
      website: '255, 214, 0', // terminal-yellow
      article: '255, 80, 80', // terminal-red
      tool: '80, 140, 255', // terminal-blue
      project: '255, 85, 255', // terminal-magenta
    };

    const color = glowColors[type] || '0, 255, 65'; // Default to green
    return {
      textShadow: `0 0 2px rgba(${color}, 0.8), 
                   0 0 7px rgba(${color}, 0.8), 
                   0 0 11px rgba(${color}, 0.6)`,
    };
  };

  // Function to get text color for a type
  const getTypeColorValue = (type) => {
    const colorMap = {
      blog: 'rgb(0, 255, 65)', // terminal-green
      podcast: 'rgb(192, 96, 255)', // terminal-purple
      website: 'rgb(255, 214, 0)', // terminal-yellow
      article: 'rgb(255, 80, 80)', // terminal-red
      tool: 'rgb(80, 140, 255)', // terminal-blue
      project: 'rgb(255, 85, 255)', // terminal-magenta
      all: 'rgb(0, 255, 65)', // Default to green
    };

    return colorMap[type] || colorMap.all;
  };

  return (
    <div className='space-y-6 mt-8'>
      <div>
        {/* Page Title with terminal toggle button */}
        <div className='border-l-2 border-terminal-green pl-5 mb-6'>
          <h2 className='text-xl text-terminal-green flex items-center'>
            # CODEX <span className='animate-blink ml-1 mr-4'>_</span>
          </h2>
          <p className='text-terminal-text mt-2 mb-2'>
            Browse my collection of blog posts, podcasts, projects and more.
            <span className='block mt-1 text-terminal-dimmed text-sm'>
              Try commands like{' '}
              <code className='text-terminal-green'>blog</code>,{' '}
              <code className='text-terminal-green ml-1'>project</code>,
              hashtags like <code className='text-terminal-green ml-1'>ai</code>
              , or combinations like{' '}
              <code className='text-terminal-green ml-1'>blog+ai</code>. Type{' '}
              <code className='text-terminal-green ml-1'>clear</code> to reset
              filters.
            </span>
          </p>
          <button
              onClick={toggleTerminal}
              className='px-2.5 h-5 text-xs bg-terminal-green/10 border border-terminal-green text-terminal-green rounded hover:bg-terminal-green/20 transition-colors cursor-pointer'
            >
              {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
            </button>
        </div>

        {/* Command input with enhanced placeholder */}
        <div className='max-w-4xl mx-auto mb-4'>
          <form onSubmit={handleCommandSubmit} className='flex items-center'>
            <span className='text-terminal-green mr-2'>$</span>
            <input
              type='text'
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className='flex-grow bg-transparent border-none text-terminal-text outline-none focus:ring-0'
              placeholder='Type "blog", "ai", or combinations like "blog+ai"'
            />
            <button
              type='submit'
              className='px-2 h-5 text-xs bg-terminal-green/10 border border-terminal-green text-terminal-green rounded hover:bg-terminal-green/20 cursor-pointer'
            >
              Run
            </button>
          </form>
          <div className='h-px bg-terminal-green/20 mt-2'></div>
        </div>

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

          {/* Tag filter - more compact */}
          <div ref={tagFilterRef} className='mb-3'>
            <div className='flex items-center w-full mb-2'>
              <span className='text-terminal-green mr-2'>$</span>
              <span className='text-terminal-dimmed text-sm'>
                filter by tag:
              </span>
              {activeHashtags.length > 0 && (
                <button
                  onClick={() => setActiveHashtags([])}
                  className='ml-4 text-xs text-terminal-dimmed hover:text-terminal-text'
                >
                  [clear all]
                </button>
              )}
            </div>
            <div className='flex flex-wrap gap-1.5 mx-auto max-w-4xl'>
              {allHashtags.map((tag) => {
                const isSelected = activeHashtags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleHashtag(tag)}
                    className={`px-1.5 py-0.5 text-xs rounded inline-flex items-center cursor-pointer 
                      ${
                        isSelected
                          ? 'bg-terminal-green text-black border-terminal-green'
                          : 'bg-black text-terminal-green border-terminal-green border'
                      }
                    `}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Terminal display - only show when toggled */}
        {showTerminal && (
          <div className='max-w-4xl mx-auto mb-6'>
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
        )}

        {/* Content list - with enhanced glow effect */}
        {!loading && (
          <div className='max-w-4xl mx-auto'>
            <div className='mb-2 flex items-center'>
              <span className='text-terminal-green mr-2'>$</span>
              <span className='text-terminal-dimmed text-sm'>
                Showing {filteredPosts.length} of {allPosts.length} items
                {activeTypeFilter !== 'all' &&
                  ` filtered by type: ${activeTypeFilter}`}
                {activeHashtags.length > 0 &&
                  ` and tags: ${activeHashtags.map((t) => `#${t}`).join(', ')}`}
              </span>
            </div>

            <div className='space-y-1'>
              {filteredPosts.map((post, index) => {
                const typeColor = getTypeColor(post.type);
                const isHovered = hoveredItemIndex === index;

                return (
                  <a
                    key={`${post.slug}-${index}`}
                    href={`/codex/${post.type}/${post.slug}`}
                    className='block py-1 px-2 rounded-sm'
                    onMouseEnter={() => setHoveredItemIndex(index)}
                    onMouseLeave={() => setHoveredItemIndex(null)}
                  >
                    {/* Title - description with date right-aligned */}
                    <div className='flex items-center justify-between'>
                      <div className='flex-1 min-w-0 pr-4'>
                        <div className='truncate'>
                          <span
                            className={`text-${typeColor} font-medium transition-all duration-200`}
                            style={isHovered ? getGlowStyle(post.type) : {}}
                          >
                            {post.title}
                          </span>
                          <span className='text-terminal-dimmed mx-2 font-normal'>
                            -
                          </span>
                          <span className='text-terminal-text font-normal'>
                            {post.description}
                          </span>
                        </div>
                      </div>
                      <div className='text-terminal-dimmed text-xs whitespace-nowrap'>
                        {formatDate(post.date)}
                      </div>
                    </div>

                    {/* Hashtags on second line (if any) */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className='text-xs text-terminal-dimmed ml-4 mt-0.5'>
                        {post.hashtags.map((tag, i) => (
                          <span
                            key={tag}
                            className='transition-colors duration-200'
                            style={{
                              marginLeft: i > 0 ? '0.25rem' : '0',
                              color:
                                hoveredTag === `${index}-${tag}`
                                  ? getTypeColorValue(post.type)
                                  : 'inherit',
                            }}
                            onMouseEnter={() =>
                              setHoveredTag(`${index}-${tag}`)
                            }
                            onMouseLeave={() => setHoveredTag(null)}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
