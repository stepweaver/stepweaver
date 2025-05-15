import { useCallback } from 'react';

export default function useCommandProcessor({
  allHashtags,
  setActiveTypeFilter,
  setActiveHashtags,
  activeHashtags,
  terminalRef,
  showTerminal,
}) {
  const toggleHashtag = useCallback(
    (tag) => {
      const normalizedTag = tag.toLowerCase();
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

        // Process each part
        parts.forEach((part) => {
          // If it's a content type and we haven't set one yet
          if (contentTypes.includes(part) && !hasSetType) {
            setActiveTypeFilter(part);
            hasSetType = true;
          }
          // If it's a hashtag (case-insensitive check)
          else {
            const matchedTag = allHashtags.find(
              (t) => t.toLowerCase() === part
            );
            if (matchedTag) {
              const isActive = activeHashtags.some(
                (t) => t.toLowerCase() === part
              );
              if (!isActive) {
                setActiveHashtags((prev) => [...prev, matchedTag]);
              }
            }
          }
        });
      }
      // Check if it's a full command
      else if (normalizedCmd.startsWith('codex ')) {
        const type = normalizedCmd.substring(6).trim();
        if (contentTypes.includes(type)) {
          setActiveTypeFilter(type);
        }
      }
      // Check if it's a filter command
      else if (normalizedCmd.startsWith('filter ')) {
        const tag = normalizedCmd.substring(7).trim();
        toggleHashtag(tag);
      }
      // Check if it's just a content type
      else if (contentTypes.includes(normalizedCmd)) {
        setActiveTypeFilter(normalizedCmd);
      }
      // Check if it's just a hashtag
      else {
        const matchedTag = allHashtags.find(
          (t) => t.toLowerCase() === normalizedCmd
        );
        if (matchedTag) {
          toggleHashtag(normalizedCmd);
        }
        // Check special commands
        else if (normalizedCmd === 'clear' || normalizedCmd === 'reset') {
          // Reset all filters
          setActiveTypeFilter('all');
          setActiveHashtags([]);
        }
      }

      // Always pass to terminal for visual feedback if visible
      if (showTerminal && terminalRef.current?.executeCommand) {
        // Translate abbreviated commands to full commands for terminal
        if (contentTypes.includes(normalizedCmd) && !normalizedCmd.startsWith('codex')) {
          terminalRef.current.executeCommand(`codex ${normalizedCmd}`);
        } else if (allHashtags.some(t => t.toLowerCase() === normalizedCmd) && !normalizedCmd.startsWith('filter')) {
          const matchedTag = allHashtags.find(t => t.toLowerCase() === normalizedCmd);
          terminalRef.current.executeCommand(`filter ${matchedTag || normalizedCmd}`);
        } else {
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
    ]
  );

  return {
    toggleHashtag,
    processCommand,
  };
}
