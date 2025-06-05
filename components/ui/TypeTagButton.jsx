export default function TypeTagButton({ type, active, onClick, children }) {
  const typeStyles = {
    blog: 'bg-terminal-green/20 text-terminal-green border-terminal-green',
    podcast:
      'bg-terminal-purple/20 text-terminal-purple border-terminal-purple',
    community:
      'bg-terminal-yellow/20 text-terminal-yellow border-terminal-yellow',
    article: 'bg-terminal-red/20 text-terminal-red border-terminal-red',
    tool: 'bg-terminal-blue/20 text-terminal-blue border-terminal-blue',
    project:
      'bg-terminal-magenta/20 text-terminal-magenta border-terminal-magenta',
    all: 'bg-terminal-green/20 text-terminal-green border-terminal-green',
  };
  const activeStyles = {
    blog: 'bg-terminal-green text-black border-terminal-green',
    podcast: 'bg-terminal-purple text-black border-terminal-purple',
    community: 'bg-terminal-yellow text-black border-terminal-yellow',
    article: 'bg-terminal-red text-black border-terminal-red',
    tool: 'bg-terminal-blue text-black border-terminal-blue',
    project: 'bg-terminal-magenta text-black border-terminal-magenta',
    all: 'bg-terminal-green text-black border-terminal-green',
  };
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 text-xs rounded border h-5 inline-flex items-center justify-center cursor-pointer ${
        active ? activeStyles[type] : typeStyles[type]
      }`}
    >
      {children}
    </button>
  );
}
