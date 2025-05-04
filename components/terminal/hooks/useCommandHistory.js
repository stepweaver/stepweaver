import { useState } from 'react';

export const useCommandHistory = () => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = (command) => {
    if (command.trim()) {
      setHistory((prev) => [...prev, command]);
      setHistoryIndex(-1);
    }
  };

  const navigateHistory = (key) => {
    if (key === 'ArrowUp') {
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        return history[history.length - 1 - newIndex];
      }
    } else if (key === 'ArrowDown') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        return history[history.length - 1 - newIndex];
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        return '';
      }
    }
    return undefined;
  };

  return {
    history,
    historyIndex,
    setHistoryIndex,
    addToHistory,
    navigateHistory,
  };
};
