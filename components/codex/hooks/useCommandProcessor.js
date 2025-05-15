import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useCommandProcessor({
  allHashtags,
  setActiveTypeFilter,
  setActiveHashtags,
  activeHashtags,
  terminalRef,
  showTerminal,
}) {
  const router = useRouter();
  const [lastError, setLastError] = useState(null);

  // Helper to display error message in terminal
  const showErrorInTerminal = (message) => {
    if (showTerminal && terminalRef.current?.executeCommand) {
      terminalRef.current.executeCommand(`echo ${message}`);
    }
  };

  const toggleHashtag = useCallback(
    (tag) => {
      // Remove the # prefix if present
      let normalizedTag = tag.toLowerCase();
      if (normalizedTag.startsWith('#')) {
        normalizedTag = normalizedTag.substring(1);
      }

      if (normalizedTag === 'clear') {
        setActiveHashtags([]);
        return;
      }

      // Find the correctly cased tag from allHashtags if it exists
      const matchedTag = allHashtags.find(
        (t) => t.toLowerCase() === normalizedTag
      );

      if (!matchedTag) return; // Tag doesn't exist

      // Find if already active (case-insensitive check)
      const isActive = activeHashtags.some(
        (t) => t.toLowerCase() === normalizedTag
      );

      if (isActive) {
        setActiveHashtags((prev) =>
          prev.filter((t) => t.toLowerCase() !== normalizedTag)
        );
      } else {
        setActiveHashtags((prev) => [...prev, matchedTag]);
      }

      if (showTerminal && terminalRef.current?.executeCommand) {
        terminalRef.current.executeCommand(`filter ${matchedTag}`);
      }
    },
    [activeHashtags, setActiveHashtags, showTerminal, terminalRef, allHashtags]
  );

  const processCommand = useCallback(
    (cmd, isNewCommand = false) => {
      const normalizedCmd = cmd.toLowerCase();
      setLastError(null); // Clear any previous errors

      // Handle the 'open' command which should be passed directly to the terminal
      if (normalizedCmd.startsWith('open ')) {
        // We need to make sure the terminal is shown when using the open command
        if (terminalRef.current?.executeCommand) {
          // Check if terminal is ready and handle command
          try {
            // Force terminal to be shown for the open command to work
            terminalRef.current.executeCommand(cmd);

            // Extract the slug from the open command
            const slug = normalizedCmd.substring(5).trim();
            console.log(`Processing open command for: ${slug}`);
          } catch (err) {
            console.error('Error executing terminal command:', err);
          }
        } else {
          console.warn('Terminal reference not available for open command');
        }
        return;
      }

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

      // When starting a new command (not a combination), reset filters first unless explicitly combining
      if (isNewCommand && !normalizedCmd.includes('+')) {
        // Reset filters before applying new ones for a fresh start
        setActiveTypeFilter('all');
        setActiveHashtags([]);
      }

      // Check if command contains multiple parts (separated by '+')
      if (normalizedCmd.includes('+')) {
        const parts = normalizedCmd.split('+').map((part) => part.trim());
        let hasSetType = false;
        let validParts = false;

        // Process each part
        parts.forEach((part) => {
          // If it's a content type and we haven't set one yet
          if (contentTypes.includes(part) && !hasSetType) {
            setActiveTypeFilter(part);
            hasSetType = true;
            validParts = true;
          }
          // If it's a hashtag (must start with #)
          else if (part.startsWith('#') && part.length > 1) {
            const tagName = part.substring(1).toLowerCase(); // Remove the # prefix
            const matchedTag = allHashtags.find(
              (t) => t.toLowerCase() === tagName
            );
            if (matchedTag) {
              const isActive = activeHashtags.some(
                (t) => t.toLowerCase() === tagName
              );
              if (!isActive) {
                setActiveHashtags((prev) => [...prev, matchedTag]);
              }
              validParts = true;
            } else if (tagName) {
              // Show error for invalid tag
              const errorMsg = `"${part}" is not a valid tag. Available tags include: #${allHashtags
                .slice(0, 3)
                .join(', #')}...`;
              setLastError(errorMsg);
              showErrorInTerminal(errorMsg);
            }
          } else if (part && !contentTypes.includes(part)) {
            // Error for non-hashtag, non-content type
            const errorMsg = `"${part}" is not recognized. Use content types (${contentTypes[0]}, ${contentTypes[1]}...) or hashtags starting with # (like #ai)`;
            setLastError(errorMsg);
            showErrorInTerminal(errorMsg);
          }
        });

        // If no valid parts were found, show general error
        if (!validParts && parts.length > 0) {
          const errorMsg =
            'Invalid input. Try filtering by content type or #hashtag.';
          setLastError(errorMsg);
          showErrorInTerminal(errorMsg);
        }
      }
      // Check if it's a full command
      else if (normalizedCmd.startsWith('codex ')) {
        const type = normalizedCmd.substring(6).trim();
        if (contentTypes.includes(type)) {
          setActiveTypeFilter(type);
        } else {
          const errorMsg = `"${type}" is not a valid content type. Valid types are: ${contentTypes.join(
            ', '
          )}`;
          setLastError(errorMsg);
          showErrorInTerminal(errorMsg);
        }
      }
      // Check if it's a filter command
      else if (normalizedCmd.startsWith('filter ')) {
        const tag = normalizedCmd.substring(7).trim();

        // Convert to hashtag format if not already
        const tagName = tag.startsWith('#')
          ? tag.substring(1).toLowerCase()
          : tag.toLowerCase();

        const matchedTag = allHashtags.find((t) => t.toLowerCase() === tagName);

        if (matchedTag) {
          toggleHashtag(tagName);
        } else {
          const errorMsg = `Tag "#${tagName}" not found. Try one of these: #${allHashtags
            .slice(0, 3)
            .join(', #')}...`;
          setLastError(errorMsg);
          showErrorInTerminal(errorMsg);
        }
      }
      // Check if it's just a content type
      else if (contentTypes.includes(normalizedCmd)) {
        setActiveTypeFilter(normalizedCmd);
      }
      // Check if it's just a hashtag (must start with #)
      else if (normalizedCmd.startsWith('#') && normalizedCmd.length > 1) {
        const tagName = normalizedCmd.substring(1); // Remove the # prefix
        const matchedTag = allHashtags.find(
          (t) => t.toLowerCase() === tagName.toLowerCase()
        );
        if (matchedTag) {
          toggleHashtag(tagName);
        } else {
          const errorMsg = `Hashtag "${normalizedCmd}" not found. Try one of these: #${allHashtags
            .slice(0, 3)
            .join(', #')}...`;
          setLastError(errorMsg);
          showErrorInTerminal(errorMsg);
        }
      }
      // Check special commands
      else if (normalizedCmd === 'clear' || normalizedCmd === 'reset') {
        // Reset all filters
        setActiveTypeFilter('all');
        setActiveHashtags([]);
      }
      // Handle unknown commands - this is the key part we're adding
      else if (normalizedCmd.trim() !== '') {
        const errorMsg = `Command not recognized: "${cmd}". Try filtering by type (blog, project, etc) or hashtags with # prefix (like #ai, #react, etc).`;
        setLastError(errorMsg);
        showErrorInTerminal(errorMsg);
        console.log(`Invalid command entered: ${cmd}`);

        // Let the terminal handle it as normally would
        if (showTerminal && terminalRef.current?.executeCommand) {
          terminalRef.current.executeCommand(cmd);
        }
        return;
      }

      // Always pass to terminal for visual feedback if visible
      if (showTerminal && terminalRef.current?.executeCommand) {
        // Translate abbreviated commands to full commands for terminal
        if (
          contentTypes.includes(normalizedCmd) &&
          !normalizedCmd.startsWith('codex')
        ) {
          terminalRef.current.executeCommand(`codex ${normalizedCmd}`);
        } else if (
          allHashtags.some((t) => t.toLowerCase() === normalizedCmd) &&
          !normalizedCmd.startsWith('filter')
        ) {
          const matchedTag = allHashtags.find(
            (t) => t.toLowerCase() === normalizedCmd
          );
          terminalRef.current.executeCommand(
            `filter ${matchedTag || normalizedCmd}`
          );
        } else if (!lastError) {
          // Only pass the command to terminal if there's no error
          terminalRef.current.executeCommand(cmd); // Keep original casing for terminal display
        }
      }
    },
    [
      allHashtags,
      activeHashtags,
      setActiveTypeFilter,
      setActiveHashtags,
      showTerminal,
      terminalRef,
      toggleHashtag,
      lastError,
      setLastError,
      showErrorInTerminal,
    ]
  );

  return {
    toggleHashtag,
    processCommand,
    lastError,
  };
}
