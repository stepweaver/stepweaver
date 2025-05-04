import styles from '../../styles/terminal.module.css';

export default function TerminalWindow({
  children,
  title = 'Terminal',
  showStatusBar = false,
  statusText = 'Ready',
  lastUpdated = null,
  customTitleContent = null,
}) {
  // Format the current date if lastUpdated is not provided
  const formattedDate =
    lastUpdated ||
    new Date().getFullYear() +
      '-' +
      new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase() +
      '-' +
      String(new Date().getDate()).padStart(2, '0');

  return (
    <div className={`${styles.container} ${styles.terminalWindowShadow}`}>
      <div className={`${styles.header} ${styles.bgTerminalHeader}`}>
        <div className='flex space-x-2'>
          <div className={`${styles.button} bg-red-500`}></div>
          <div className={`${styles.button} bg-yellow-500`}></div>
          <div className={`${styles.button} bg-green-500`}></div>
        </div>
        <div
          className={`text-center text-terminal-green font-ibm text-sm ${styles.terminalTitleShadow}`}
        >
          {customTitleContent || title}
        </div>
        <div className='w-12'></div>
      </div>
      <div
        className={`${styles.bgTerminalWindow} ${styles.terminalInnerGlow} ${styles.scanlinePattern}`}
      >
        {children}
      </div>

      {showStatusBar && (
        <div className='bg-terminal-light border-t border-terminal-border p-2 text-xs text-terminal-muted flex justify-between'>
          <div className='text-terminal-green'>Status: {statusText}</div>
          <div className='text-terminal-green'>
            Last updated: {formattedDate}
          </div>
        </div>
      )}
    </div>
  );
}
