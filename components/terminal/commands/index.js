import { fileSystem } from '../data/fileSystem';
import { weatherArt } from '../data/weatherArt';

// Cache for content data to avoid repeated fetching
let contentCache = null;
let contentLastFetched = 0;
let syncCallback = null;

// Function to fetch content from the API
const fetchContent = async () => {
  // Check if we have a recent cache (less than 5 minutes old)
  const now = Date.now();
  if (contentCache && now - contentLastFetched < 300000) {
    return contentCache;
  }

  try {
    const response = await fetch('/api/codex');
    const data = await response.json();

    // Update cache
    contentCache = data;
    contentLastFetched = now;

    return data;
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
};

// Format a content item for terminal display
const formatContentItem = (item, index) => {
  // Format date as [YYYY-MMM-DD]
  const date = new Date(item.date);
  const formattedDate = `[${date.getFullYear()}-${date
    .toLocaleString('en-US', {
      month: 'short',
    })
    .toUpperCase()}-${String(date.getDate()).padStart(2, '0')}]`;

  // Get color based on content type
  let typeColor;
  switch (item.type) {
    case 'blog':
      typeColor = 'text-terminal-green';
      break;
    case 'project':
      typeColor = 'text-terminal-pink';
      break;
    case 'podcast':
      typeColor = 'text-terminal-purple';
      break;
    case 'article':
      typeColor = 'text-terminal-red';
      break;
    case 'tool':
      typeColor = 'text-terminal-blue';
      break;
    case 'community':
      typeColor = 'text-terminal-yellow';
      break;
    default:
      typeColor = 'text-terminal-white';
  }

  // Truncate title if needed (shorter for mobile compatibility)
  const maxTitleLength = 40;
  const title = item.title || '';
  const truncatedTitle =
    title.length > maxTitleLength
      ? title.substring(0, maxTitleLength) + '...'
      : title;

  // Truncate description if needed
  const maxDescLength = 60;
  const description = item.description || '';
  const truncatedDesc =
    description.length > maxDescLength
      ? description.substring(0, maxDescLength) + '...'
      : description;

  // Create the navigation path for the content item
  const navigationPath = `codex/${item.type}/${item.slug}`;

  // Return a responsive layout
  return `<div class="flex items-center justify-between whitespace-nowrap overflow-hidden mb-1">
    <div class="flex overflow-hidden sm:flex-1 min-w-0">
      <span class="${typeColor} cursor-pointer hover:underline text-ellipsis overflow-hidden" data-open="${navigationPath}">${truncatedTitle}</span>
      <span class="mx-2 text-terminal-dimmed hidden sm:inline">-</span>
      <span class="text-terminal-text text-ellipsis overflow-hidden hidden sm:inline">${truncatedDesc}</span>
    </div>
    <span class="text-terminal-dimmed text-xs ml-2 whitespace-nowrap">${formattedDate}</span>
  </div>`;
};

// Function to find a post by slug or partial slug and display it
const findAndOpenPost = async (searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return [
      '<span class="text-terminal-red">Error: No search query provided.</span>',
      '<span class="text-terminal-dimmed">Usage: open [post-slug]</span>',
      '<span class="text-terminal-dimmed">Example: open my-first-post</span>',
    ];
  }

  const content = await fetchContent();
  const normalizedQuery = searchQuery.toLowerCase().trim();

  // Find posts where slug includes the search term
  const matchingPosts = content.filter(
    (post) =>
      post.slug.toLowerCase().includes(normalizedQuery) ||
      post.title.toLowerCase().includes(normalizedQuery)
  );

  if (matchingPosts.length === 0) {
    return [
      `<span class="text-terminal-red">Error: No posts found matching "${searchQuery}".</span>`,
      '<span class="text-terminal-dimmed">Try searching with a different term or see all posts with "codex all".</span>',
    ];
  }

  if (matchingPosts.length === 1) {
    // If only one match, return a link to that post with a redirect message
    const post = matchingPosts[0];
    const navigationPath = `codex/${post.type}/${post.slug}`;

    // Use only data-auto-open for automatic navigation, remove the script tag approach
    return [
      `<span class="text-terminal-green">Found: "${post.title}"</span>`,
      `<span class="text-terminal-dimmed">Opening <span class="text-terminal-cyan cursor-pointer" data-open="${navigationPath}">${navigationPath}</span>...</span>`,
      `<span data-auto-open="${navigationPath}" style="display:inline-block;">Navigating to post...</span>`,
    ];
  } else {
    // If multiple matches, show a list of options
    const output = [
      `<span class="text-terminal-green">Found ${matchingPosts.length} posts matching "${searchQuery}":</span>`,
      '',
    ];

    // Add each matching post as a clickable link
    matchingPosts.forEach((post, index) => {
      output.push(formatContentItem(post, index + 1));
    });

    output.push('');
    output.push(
      '<span class="text-terminal-dimmed">Click on a post title to open it, or use "open [full-slug]" for exact match.</span>'
    );

    return output;
  }
};

// Helper function to get color based on content type
const getTypeColor = (type) => {
  switch (type) {
    case 'blog':
      return 'text-terminal-green';
    case 'project':
      return 'text-terminal-pink';
    case 'podcast':
      return 'text-terminal-purple';
    case 'article':
      return 'text-terminal-red';
    case 'tool':
      return 'text-terminal-blue';
    case 'community':
      return 'text-terminal-yellow';
    default:
      return 'text-terminal-yellow';
  }
};

// Function to list content items by type
const listContentByType = async (type) => {
  const content = await fetchContent();

  if (content.length === 0) {
    return ['No content available in the database.'];
  }

  let filteredContent = content;

  // Filter by type if provided
  if (type && type !== 'all') {
    filteredContent = content.filter((item) => item.type === type);

    if (filteredContent.length === 0) {
      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
      const typeColor = getTypeColor(type);
      return [
        `<span class="text-terminal-cyan">━━━ ${typeLabel} Content ━━━</span>`,
        `<span class="${typeColor}">No ${type} content available yet.</span>`,
        `<span class="text-terminal-dimmed">Try another content type or "codex all" to see all content.</span>`,
      ];
    }
  }

  // Sort by date (newest first)
  filteredContent.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Format output for terminal display
  const output = [
    `<span class="text-terminal-cyan">━━━ ${
      type === 'all' ? 'ALL CONTENT' : `${type.toUpperCase()} CONTENT`
    } ━━━</span>`,
    `<span class="text-terminal-dimmed">Displaying all${
      type !== 'all' ? ' ' + type : ''
    } content.</span>`,
    '',
  ];

  filteredContent.forEach((item, index) => {
    output.push(formatContentItem(item, index + 1));
  });

  return output;
};

// Function to generate a content type submenu
const getContentTypeMenu = async () => {
  const content = await fetchContent();

  if (content.length === 0) {
    return ['No content available.'];
  }

  // Get unique content types and count items
  const typeCounts = {};
  content.forEach((item) => {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
  });

  // Format output for terminal display
  const output = [
    '<span class="text-terminal-cyan">━━━ CONTENT BROWSER ━━━</span>',
    '<span class="text-terminal-dimmed">Browse content by type or view all.</span>',
    '',
  ];

  // Add the "all" option
  output.push(
    `<span><span class="text-terminal-green inline-block min-w-[90px]">all</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white cursor-pointer" data-cmd="codex all">All content (${content.length})</span></span>`
  );

  // Add each content type
  Object.entries(typeCounts)
    .sort()
    .forEach(([type, count]) => {
      const typeColor = getTypeColor(type);

      output.push(
        `<span><span class="${typeColor} inline-block min-w-[90px]">${type}</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white cursor-pointer" data-cmd="codex ${type}">${type.toUpperCase()} content (${count})</span></span>`
      );
    });

  output.push('');
  output.push(
    '<span class="text-terminal-dimmed">Try: "codex all" or "codex blog"</span>'
  );

  return output;
};

// Function to fetch weather data
const fetchWeather = async (location = 'new york') => {
  try {
    // Using OpenWeatherMap API with environment variable
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    // Check if API key is available
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return [
        `<span class="text-terminal-red">Weather API key not configured</span>`,
        `<span class="text-terminal-yellow">Please add your OpenWeatherMap API key to .env.local</span>`,
      ];
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [
          `<span class="text-terminal-red">Location not found: ${location}</span>`,
          `<span class="text-terminal-yellow">Usage: weather [city name]</span>`,
        ];
      }
      throw new Error(`Weather service error: ${response.status}`);
    }

    const data = await response.json();

    // Get the appropriate ASCII art based on weather condition
    let art = weatherArt.default;
    const weatherCondition = data.weather[0].main.toLowerCase();

    if (weatherCondition.includes('clear')) {
      art = weatherArt.clear;
    } else if (weatherCondition.includes('cloud')) {
      art = weatherArt.clouds;
    } else if (
      weatherCondition.includes('rain') ||
      weatherCondition.includes('drizzle')
    ) {
      art = weatherArt.rain;
    } else if (weatherCondition.includes('thunderstorm')) {
      art = weatherArt.thunderstorm;
    } else if (weatherCondition.includes('snow')) {
      art = weatherArt.snow;
    } else if (
      weatherCondition.includes('mist') ||
      weatherCondition.includes('fog') ||
      weatherCondition.includes('haze')
    ) {
      art = weatherArt.mist;
    }

    // Format the weather data in a terminal-friendly way with ASCII art
    return [
      `<span class="text-terminal-yellow">Weather for ${data.name}, ${data.sys.country}</span>`,
      art,
      `<span class="text-terminal-cyan">Temperature:</span> ${Math.round(
        data.main.temp
      )}°F (feels like ${Math.round(data.main.feels_like)}°F)`,
      `<span class="text-terminal-cyan">Conditions:</span> ${data.weather[0].description}`,
      `<span class="text-terminal-cyan">Humidity:</span> ${data.main.humidity}%`,
      `<span class="text-terminal-cyan">Wind:</span> ${Math.round(
        data.wind.speed
      )} mph`,
    ];
  } catch (error) {
    return [
      `<span class="text-terminal-red">Error fetching weather data: ${error.message}</span>`,
      `<span class="text-terminal-yellow">Usage: weather [location]</span> (e.g., weather london)`,
    ];
  }
};

// Function to display resume in terminal format
const displayResume = () => {
  return [
    '<span class="text-terminal-cyan">━━━ STEPHEN WEAVER ━━━</span>',
    '',
    '<span class="text-terminal-yellow">WEB DEVELOPER & BUSINESS ANALYST</span>',
    '',
    '<span class="text-terminal-green">EXPERIENCE</span>',
    '<span class="text-terminal-white ml-4">Web Developer</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">λstepweaver</span>',
    '<span class="text-terminal-white ml-4">Business Analyst</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">University of Notre Dame, Irish1Card Office</span>',
    '<span class="text-terminal-white ml-4">Airborne Cryptologic Linguist</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">United States Air Force</span>',
    '',
    '<span class="text-terminal-green">TECHNICAL SKILLS</span>',
    '<span class="text-terminal-white ml-4">Frontend</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">React, Next.js, JavaScript, TypeScript, Tailwind CSS</span>',
    '<span class="text-terminal-white ml-4">Backend</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">Node.js, Express, MongoDB, SQL, RESTful APIs</span>',
    '<span class="text-terminal-white ml-4">DevOps</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">Git, GitHub, AWS, npm/yarn</span>',
    '<span class="text-terminal-white ml-4">AI / Prompt Engineering</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">LLMs, prompt chaining, AI-assisted dev, Cursor IDE</span>',
    '',
    '<span class="text-terminal-green">EDUCATION</span>',
    '<span class="text-terminal-white ml-4">Bachelor of Arts, Grand Valley State University</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">Communication Studies</span>',
    '<span class="text-terminal-white ml-4">Associate of Arts, Ivy Tech Community College</span> <span class="text-terminal-yellow">-</span> <span class="text-terminal-green">Business Administration</span>',
    '',
    '',
    '<span onclick="window.open(\'/weaver_resume.pdf\', \'_blank\')" class="text-terminal-pink cursor-pointer animate-pulse py-2 inline-block my-2">DOWNLOAD RESUME</span>',
  ];
};

// Function to handle resume download
const handleResumeDownload = () => {
  // This function is used when someone types "download resume" directly
  return ['<span class="text-terminal-yellow">Opening resume PDF...</span>'];
};

export const handleCommand = async (
  command,
  currentPath,
  setCurrentPath,
  callback
) => {
  // Store callback if provided
  if (callback) {
    syncCallback = callback;
  }

  const cmd = command.trim();
  const lowerCmd = cmd.toLowerCase();

  // Parse command and arguments
  const args = cmd.split(' ');
  const mainCommand = args[0].toLowerCase();
  const arg = args.length > 1 ? args.slice(1).join(' ') : '';

  switch (mainCommand) {
    case 'help':
      return [
        '<span class="text-terminal-cyan">━━━ SYSTEM COMMANDS ━━━</span>',
        '<span class="text-terminal-blue inline-block min-w-[70px] max-w-[90px]">clear</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">Clear the terminal</span>',
        '<span class="text-terminal-blue inline-block min-w-[70px] max-w-[90px]">cd</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">Change directory <span class="text-terminal-cyan">(cd about, cd codex, etc)</span></span>',
        '<span class="text-terminal-blue inline-block min-w-[70px] max-w-[90px]">resume</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">Display my resume</span>',
        '<span class="text-terminal-blue inline-block min-w-[70px] max-w-[90px]">open</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">Open a post by slug <span class="text-terminal-cyan">(open my-post-slug)</span></span>',
        '<span class="text-terminal-blue inline-block min-w-[70px] max-w-[90px]">weather</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">Show the weather <span class="text-terminal-cyan">(weather [location])</span></span>',
        '<span class="text-terminal-blue inline-block min-w-[70px] max-w-[90px]">sudo</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">Attempt to gain admin privileges</span>',
        '<span class="text-terminal-blue inline-block min-w-[70px] max-w-[90px]">codex</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white text-sm">Browse content by type</span>',
      ];
    case 'clear':
      return [];
    case 'open':
      return await findAndOpenPost(arg);
    case 'weather':
      return await fetchWeather(arg || 'new york');
    case 'sudo':
      return [
        'sudo: Permission denied. Trying to hack my portfolio? 😉',
        'YOU SHALL NOT PASS! 🔥 😈 🧙🏿‍♂️',
      ];
    case 'cd':
      return handleCdCommand(arg, currentPath, setCurrentPath);
    case 'ls':
      // Special handling for 'ls codex' and 'ls codex/type' commands from UI buttons
      if (arg.startsWith('codex')) {
        const parts = arg.split('/');
        if (parts.length > 1 && parts[1]) {
          // Format is 'ls codex/type' - display content filtered by type
          return await listContentByType(parts[1]);
        } else {
          // Just 'ls codex' - show all content
          return await listContentByType('all');
        }
      }
      // Standard ls behavior for filesystem
      return handleLsCommand(arg, currentPath);
    case 'filter':
      // Handle filter commands from tag buttons
      if (arg) {
        // For future implementation - filter by tag
        const content = await fetchContent();

        // Filter content by the specified tag
        const filteredContent = content.filter(
          (item) => item.hashtags && item.hashtags.includes(arg)
        );

        if (filteredContent.length === 0) {
          return [
            `<span class="text-terminal-cyan">No content found with tag "#${arg}"</span>`,
            `<span class="text-terminal-dimmed">Try another tag or type "codex all" to see all content.</span>`,
          ];
        }

        // Sort by date (newest first)
        filteredContent.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get most common content type for this tag (to determine color)
        const typeCount = {};
        filteredContent.forEach((item) => {
          typeCount[item.type] = (typeCount[item.type] || 0) + 1;
        });

        // Get the most frequent type
        let dominantType = 'default';
        let maxCount = 0;
        for (const [type, count] of Object.entries(typeCount)) {
          if (count > maxCount) {
            maxCount = count;
            dominantType = type;
          }
        }

        const tagColor = getTypeColor(dominantType);

        // Format output for terminal display - single heading
        const output = [
          `<span class="${tagColor}">━━━ CONTENT TAGGED WITH #${arg.toUpperCase()} (${
            filteredContent.length
          } ITEMS) ━━━</span>`,
          '',
        ];

        filteredContent.forEach((item, index) => {
          output.push(formatContentItem(item, index + 1));
        });

        // Notify any callback functions about the filter change
        if (syncCallback) {
          syncCallback({ tags: [arg] });
        }

        return output;
      }
      return ['Usage: filter [tag]'];
    case 'codex':
      // Check if there are subcommands
      if (args.length > 1) {
        const subCommand = args[1].toLowerCase();

        // Get all available content types first
        const content = await fetchContent();
        const availableTypes = ['all'];
        content.forEach((item) => {
          if (!availableTypes.includes(item.type)) {
            availableTypes.push(item.type);
          }
        });

        // Handle content type directly
        if (subCommand === 'all' || availableTypes.includes(subCommand)) {
          return await listContentByType(subCommand);
        } else if (subCommand === 'list' && args.length > 2) {
          // For backward compatibility with list subcommand
          const contentType = args[2].toLowerCase();
          if (contentType === 'all' || availableTypes.includes(contentType)) {
            return await listContentByType(contentType);
          } else {
            return [
              `<span class="text-terminal-red">Error: Content type "${contentType}" not found.</span>`,
              `<span class="text-terminal-dimmed">Available types: ${availableTypes.join(
                ', '
              )}</span>`,
              `<span class="text-terminal-dimmed">Try "codex all" to see all content.</span>`,
            ];
          }
        } else if (subCommand === 'help') {
          // Handle help subcommand
          return [
            '<span class="text-terminal-cyan">━━━ CODEX HELP ━━━</span>',
            '<span class="text-terminal-blue inline-block min-w-[110px]">codex</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">Show content type menu</span>',
            '<span class="text-terminal-blue inline-block min-w-[110px]">codex all</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">List all content</span>',
            '<span class="text-terminal-blue inline-block min-w-[110px]">codex [type]</span><span class="text-terminal-yellow inline-block w-[18px] text-center">|</span><span class="text-terminal-white">List content of specific type</span>',
          ];
        } else {
          // Unknown subcommand or type
          const typeColor = getTypeColor(subCommand);
          return [
            `<span class="${typeColor}">Error: Content type "${subCommand}" not found.</span>`,
            `<span class="text-terminal-dimmed">Available types: ${availableTypes.join(
              ', '
            )}</span>`,
            `<span class="text-terminal-dimmed">Try "codex all" to see all content.</span>`,
          ];
        }
      }

      // Default to showing the main menu
      return await getContentTypeMenu();
    case 'resume':
      return displayResume();
    case 'download':
      if (arg === 'resume') {
        // Open the PDF in a new tab when the command is executed
        setTimeout(() => {
          window.open('/weaver_resume.pdf', '_blank');
        }, 100);
        return handleResumeDownload();
      }
      return ['Usage: download resume'];
    case '':
      return [];
    default:
      // Handle not found
      return [`Command not found: ${cmd}. Type "help" for available commands.`];
  }
};

const handleCdCommand = (arg, currentPath, setCurrentPath) => {
  if (!arg || arg === '~') {
    setCurrentPath('~');
    return [`Changed directory to ~`];
  } else if (arg === '..') {
    if (currentPath === '~') {
      return [`Already at home directory`];
    }
    const newPath = currentPath.split('/').slice(0, -1).join('/');
    setCurrentPath(newPath || '~');
    return [`Changed directory to ${newPath || '~'}`];
  } else {
    const targetPath =
      arg.startsWith('/') || arg.startsWith('~')
        ? arg
        : `${currentPath}/${arg}`;

    // Normalize path
    const normalizedPath = targetPath.replace(/\/+/g, '/');

    if (fileSystem[normalizedPath]) {
      setCurrentPath(normalizedPath);
      return [`Changed directory to ${normalizedPath}`];
    } else {
      return [`Directory not found: ${arg}`];
    }
  }
};

const handleLsCommand = (arg, currentPath) => {
  const dirToList = arg || currentPath;
  if (fileSystem[dirToList]) {
    return fileSystem[dirToList].length > 0
      ? fileSystem[dirToList]
      : ['Directory is empty'];
  } else {
    return [`Directory not found: ${dirToList}`];
  }
};
