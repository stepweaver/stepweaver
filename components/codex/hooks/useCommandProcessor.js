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
      if (tag === 'clear') {
        setActiveHashtags([]);
        return;
      }

      if (activeHashtags.includes(tag)) {
        setActiveHashtags((prev) => prev.filter((t) => t !== tag));
      } else {
        setActiveHashtags((prev) => [...prev, tag]);
      }

      if (showTerminal && terminalRef.current?.executeCommand) {
        terminalRef.current.executeCommand(`filter ${tag}`);
      }
    },
    [activeHashtags, setActiveHashtags, showTerminal, terminalRef]
  );

  const processCommand = useCallback(
    (cmd, isNewCommand = false) => {
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
      if (isNewCommand && !cmd.includes('+')) {
        // Reset filters before applying new ones for a fresh start
        setActiveTypeFilter('all');
        setActiveHashtags([]);
      }

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
