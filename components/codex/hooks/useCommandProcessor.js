import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useCommandProcessor({
  allHashtags,
  setActiveTab,
  setActiveHashtags,
  activeHashtags,
  terminalRef,
  showTerminal,
  activeTab,
}) {
  const router = useRouter();
  const [lastError, setLastError] = useState(null);

  // Helper to display error message in terminal
  const showErrorInTerminal = (message) => {
    if (showTerminal && terminalRef.current?.executeCommand) {
      terminalRef.current.executeCommand(`echo ${message}`);
    }
  };

  const processCommand = (command) => {
    setLastError(null);
    const parts = command.toLowerCase().trim().split(' ');

    let typeCommand = null;
    let hashtagCommands = [];

    // Process each part of the command
    parts.forEach((part) => {
      if (part === 'clear') {
        // Handle clear command
        typeCommand = 'all';
        hashtagCommands = [];
        return;
      }
      if (part.startsWith('/')) {
        // Type filter
        typeCommand = part.slice(1); // Remove the /
      } else if (part.startsWith('#')) {
        // Hashtag filter
        hashtagCommands.push(part.slice(1)); // Remove the #
      }
    });

    // Handle type command
    if (typeCommand) {
      const validTypes = [
        'all',
        'blog',
        'podcast',
        'project',
        'article',
        'tool',
        'community',
      ];
      if (!validTypes.includes(typeCommand)) {
        setLastError(
          `Invalid type: ${typeCommand}. Try /blog, /podcast, /project, etc.`
        );
        return;
      }
      setActiveTab(typeCommand);

      // Clear hashtags when switching to 'all' view
      if (typeCommand === 'all') {
        setActiveHashtags([]);
      }
    }

    // Handle hashtag commands
    if (hashtagCommands.length > 0) {
      // Normalize hashtags to handle special characters
      const normalizedHashtags = hashtagCommands.map((tag) => tag.trim());

      const validHashtags = normalizedHashtags.filter((tag) => {
        // Case insensitive matching for hashtags
        return allHashtags.some(
          (validTag) => validTag.toLowerCase() === tag.toLowerCase()
        );
      });

      const invalidHashtags = normalizedHashtags.filter(
        (tag) =>
          !allHashtags.some(
            (validTag) => validTag.toLowerCase() === tag.toLowerCase()
          )
      );

      if (invalidHashtags.length > 0) {
        setLastError(
          `Unknown hashtag(s): ${invalidHashtags
            .map((t) => '#' + t)
            .join(', ')}`
        );
      }

      if (validHashtags.length > 0) {
        // Find the correctly cased hashtags from allHashtags
        const correctCaseHashtags = validHashtags
          .map((tag) =>
            allHashtags.find(
              (validTag) => validTag.toLowerCase() === tag.toLowerCase()
            )
          )
          .filter(Boolean); // Remove any undefined values

        setActiveHashtags(correctCaseHashtags);
        // If adding hashtags and no type specified, switch to 'all' to show all matches
        if (!typeCommand && activeTab !== 'all') {
          setActiveTab('all');
        }
      }
    }

    // If no valid commands found
    if (!typeCommand && hashtagCommands.length === 0) {
      setLastError(
        'Try commands like /blog, #ai, or combine them like "/blog #ai"'
      );
    }
  };

  return {
    processCommand,
    lastError,
  };
}
