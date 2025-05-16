'use client';

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { handleCommand } from './commands';
import { useCommandHistory } from './hooks/useCommandHistory';
import { useRouter } from 'next/navigation';
import styles from '../../styles/terminal.module.css';

// Utility functions for command processing
const handleClearCommand = (welcomeMessages, setLines, setInput) => {
  // Normal clear behavior
  setLines([...welcomeMessages]);
  setInput('');
};

const handleNavigationCommand = (
  destination,
  currentPath,
  setLines,
  setInput,
  router
) => {
  const newPromptLine = `guest@stepweaver.dev ${currentPath}`;
  const newCommandLine = `λ cd ${destination}`;

  setLines((prev) => [
    ...prev,
    newPromptLine,
    newCommandLine,
    `Navigating to /${destination}...`,
  ]);
  setInput('');

  // Delay navigation slightly to show the message
  setTimeout(() => {
    if (destination === 'bluesky') {
      window.open('https://bsky.app', '_blank');
    } else if (destination === 'github') {
      window.open('https://github.com/stepweaver', '_blank');
    } else {
      router.push(`/${destination}`);
    }
  }, 500);
};

const handleWeatherCommand = (command, currentPath, setLines) => {
  const newPromptLine = `user@stepweaver.dev ${currentPath}`;
  const newCommandLine = `λ ${command}`;

  setLines((prev) => [
    ...prev,
    newPromptLine,
    newCommandLine,
    `<span class="text-terminal-yellow">Fetching weather data...</span>`,
  ]);
};

const displayCommandPrompt = (command, currentPath, setLines) => {
  const newPromptLine = `user@stepweaver.dev ${currentPath}`;
  const newCommandLine = `λ ${command}`;

  setLines((prev) => [...prev, newPromptLine, newCommandLine]);
};

const updateWeatherOutput = (output, setLines) => {
  setLines((prev) => [...prev.slice(0, -1), ...output]);
};

const updateRegularOutput = (output, setLines) => {
  setLines((prev) => [...prev, ...output]);
};

const Terminal = forwardRef((props, ref) => {
  // Define welcome messages as a constant so we can reuse it
  const welcomeMessages = [
    '<span class="text-terminal-green">Welcome to λstepweaver terminolio v1.1.0 - A terminal for stepweaver.dev</span>',
    '<span>Type <span class="text-terminal-cyan">"help"</span> to see a list of available commands.</span>',
  ];

  const [lines, setLines] = useState(welcomeMessages);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const [syncCallback, setSyncCallback] = useState(null);
  const [lastCommand, setLastCommand] = useState('');
  const [lastCommandTime, setLastCommandTime] = useState(0);

  const {
    history,
    historyIndex,
    setHistoryIndex,
    addToHistory,
    navigateHistory,
  } = useCommandHistory();

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    // Execute a command programmatically
    executeCommand: (cmd) => {
      processCommand(cmd);
    },

    // Set a callback function to sync filter state with UI
    setSyncCallback: (callback) => {
      setSyncCallback(callback);
    },

    // Update filters from UI
    updateFilters: ({ type, tags }) => {
      // For future implementation
      if (type) {
        if (type === 'all') {
          processCommand('codex all');
        } else {
          processCommand(`codex ${type}`);
        }
      }

      if (tags && tags.length > 0) {
        // Process only the first tag for now
        processCommand(`filter ${tags[0]}`);
      }
    },
  }));

  // Scroll to bottom when lines change
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [lines]);

  // Cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  const processCommand = async (command) => {
    if (command.trim()) {
      // Check for duplicate rapid commands (prevents double execution)
      const now = Date.now();
      if (command === lastCommand && now - lastCommandTime < 500) {
        return; // Skip if same command executed within 500ms
      }

      // Update command tracking
      setLastCommand(command);
      setLastCommandTime(now);

      addToHistory(command);
    }

    // Special handling for clear command
    if (command.trim().toLowerCase() === 'clear') {
      handleClearCommand(welcomeMessages, setLines, setInput);
      return;
    }

    // Special handling for navigation commands
    const cmd = command.trim().toLowerCase();
    if (cmd.startsWith('cd ')) {
      const destination = cmd.substring(3).trim();

      // Check if it's a navigation to a specific page
      if (['about', 'codex', 'bluesky', 'github'].includes(destination)) {
        handleNavigationCommand(
          destination,
          currentPath,
          setLines,
          setInput,
          router
        );
        return;
      }

      // For resume, just show the resume display instead of navigating
      if (destination === 'resume') {
        displayCommandPrompt(command, currentPath, setLines);
        processCommand('resume');
        return;
      }
    }

    // Show loading message for weather command
    if (cmd.startsWith('weather')) {
      handleWeatherCommand(command, currentPath, setLines);
    } else {
      displayCommandPrompt(command, currentPath, setLines);
    }

    // Execute the command
    const output = await handleCommand(
      command,
      currentPath,
      setCurrentPath,
      syncCallback
    );

    // If it was a weather command, replace the loading line with the actual output
    if (cmd.startsWith('weather')) {
      updateWeatherOutput(output, setLines);
    } else {
      updateRegularOutput(output, setLines);
    }

    setInput('');
    setCursorPosition(0);
  };

  const handleKeyDown = (e) => {
    // Handle history navigation (up/down arrows)
    const newInput = navigateHistory(e.key);
    if (newInput !== undefined) {
      e.preventDefault();
      setInput(newInput);
      // Reset cursor position to end of new input
      setTimeout(() => {
        if (inputRef.current) {
          const length = newInput.length;
          inputRef.current.setSelectionRange(length, length);
          setCursorPosition(length);
        }
      }, 0);
      return;
    }

    // Handle cursor position for arrow keys
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCursorPosition((prev) => Math.max(0, prev - 1));
      setTimeout(() => {
        if (inputRef.current) {
          const pos = Math.max(0, cursorPosition - 1);
          inputRef.current.setSelectionRange(pos, pos);
        }
      }, 0);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCursorPosition((prev) => Math.min(input.length, prev + 1));
      setTimeout(() => {
        if (inputRef.current) {
          const pos = Math.min(input.length, cursorPosition + 1);
          inputRef.current.setSelectionRange(pos, pos);
        }
      }, 0);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCursorPosition(0);
      if (inputRef.current) {
        inputRef.current.setSelectionRange(0, 0);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      setCursorPosition(input.length);
      if (inputRef.current) {
        inputRef.current.setSelectionRange(input.length, input.length);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  const handleClick = (e) => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processCommand(input);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Add handler for clicking on elements with data-open attribute
  const handleContentClick = (e) => {
    // Find closest element with data-open attribute
    const target = e.target.closest('[data-open]');
    if (target) {
      const path = target.getAttribute('data-open');
      if (path) {
        // Navigate to the path
        router.push(`/${path}`);
      }
    }
  };

  // Effect to handle auto-open elements after they're added to the DOM
  useEffect(() => {
    // Find any auto-open elements that were added in the latest render
    const autoOpenElements =
      containerRef.current?.querySelectorAll('[data-auto-open]');
    if (autoOpenElements && autoOpenElements.length > 0) {
      // Get the first one and navigate to its path after a short delay
      const path = autoOpenElements[0].getAttribute('data-auto-open');
      if (path) {
        // Increase the delay to ensure the content is properly rendered before navigation
        const timer = setTimeout(() => {
          // Navigate to the post
          console.log(`Auto-opening path: /${path}`);
          router.push(`/${path}`);
        }, 1500); // Use a more consistent delay
        return () => clearTimeout(timer);
      }
    }
  }, [lines, router]);

  return (
    <div
      ref={containerRef}
      className={`h-64 sm:h-80 md:h-96 overflow-y-auto p-2 sm:p-4 text-sm sm:text-md text-terminal-text font-ibm leading-tight cursor-text ${styles.scrollbarHide} ${styles.crtTerminal} ${styles.crtEffect}`}
      onClick={focusInput}
    >
      <div className='terminal-output mb-4' onClick={handleContentClick}>
        {lines.map((line, i) => (
          <div key={i} className='mb-0.5'>
            {line.startsWith('λ ') ? (
              <span className='flex items-center'>
                <span
                  className={`text-terminal-green text-xs inline-block mr-1 ${styles.crtText}`}
                >
                  λ
                </span>
                <span className={`text-terminal-text ${styles.crtText}`}>
                  {line.substring(2)}
                </span>
              </span>
            ) : line.startsWith('guest@') ? (
              <span className={`text-terminal-green ${styles.crtText}`}>
                {line}
              </span>
            ) : line.startsWith('<span') || line.startsWith('<div') ? (
              <pre
                className={`${styles.terminalNoWrap} leading-tight font-ibm ${styles.crtText}`}
                dangerouslySetInnerHTML={{ __html: line }}
              />
            ) : (
              <pre
                className={`${styles.terminalNoWrap} leading-tight font-ibm ${styles.crtText}`}
              >
                {line}
              </pre>
            )}
          </div>
        ))}
      </div>
      <div className='terminal-prompt'>
        <div className={`text-terminal-green mb-1 ${styles.crtText}`}>
          user@stepweaver.dev {currentPath}
        </div>
        <div className='flex items-center'>
          <span
            className={`text-terminal-green text-xs inline-block mr-1 ${styles.crtText}`}
          >
            λ
          </span>
          <div className='relative flex-grow'>
            <div className='relative'>
              {/* Simple text before cursor */}
              <span className='text-terminal-text pr-0'>
                {input.substring(0, cursorPosition)}
              </span>

              {/* Cursor block */}
              <span
                className={`inline-block h-5 w-2.5 align-middle -mt-0.5 bg-terminal-green ${
                  cursorVisible ? 'opacity-100' : 'opacity-0'
                } ${styles.cursorGlow}`}
              ></span>

              {/* Simple text after cursor */}
              <span className='text-terminal-text pl-0'>
                {input.substring(cursorPosition)}
              </span>
            </div>

            {/* Hidden input for keyboard handling */}
            <form
              onSubmit={handleSubmit}
              className='absolute top-0 left-0 w-full'
            >
              <input
                ref={inputRef}
                type='text'
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                className='opacity-0 absolute top-0 left-0 w-full h-full cursor-text'
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Terminal;
