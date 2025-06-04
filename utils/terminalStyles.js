// Terminal styling utility functions
import formatDate from './formatDate'; // Import the unified formatter

// Export it so other modules can use it through terminalStyles
export { formatDate };

export const getTypeColor = (type) => {
  switch (type) {
    case 'blog':
      return 'terminal-green';
    case 'podcast':
      return 'terminal-purple';
    case 'community':
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

export const getGlowStyle = (type) => {
  // Map type to RGB color values for the glow
  const glowColors = {
    blog: '0, 255, 65', // terminal-green
    podcast: '192, 96, 255', // terminal-purple
    community: '255, 255, 0', // terminal-yellow
    article: '255, 80, 80', // terminal-red
    tool: '80, 140, 255', // terminal-blue
    project: '255, 85, 255', // fluorescent magenta #ff55ff
  };

  const color = glowColors[type] || '0, 255, 65'; // Default to green
  return {
    textShadow: `0 0 2px rgba(${color}, 0.8), 
                 0 0 7px rgba(${color}, 0.8), 
                 0 0 11px rgba(${color}, 0.6)`,
  };
};

export const getTypeColorValue = (type) => {
  const colorMap = {
    blog: 'rgb(0, 255, 65)', // terminal-green
    podcast: 'rgb(192, 96, 255)', // terminal-purple
    community: 'rgb(255, 255, 0)', // terminal-yellow
    article: 'rgb(255, 80, 80)', // terminal-red
    tool: 'rgb(80, 140, 255)', // terminal-blue
    project: 'rgb(255, 85, 255)', // fluorescent magenta #ff55ff
    all: 'rgb(0, 255, 65)', // Default to green
  };

  return colorMap[type] || colorMap.all;
};

const getTypeRGB = (type) => {
  const colors = {
    blog: '76, 175, 80', // terminal-green
    podcast: '156, 39, 176', // terminal-purple
    community: '255, 255, 0', // terminal-yellow
    article: '244, 67, 54', // terminal-red
    tool: '33, 150, 243', // terminal-blue
    project: '233, 30, 99', // terminal-magenta
  };
  return colors[type] || colors.blog;
};

const getTypeRGBColor = (type) => {
  const colors = {
    blog: 'rgb(76, 175, 80)', // terminal-green
    podcast: 'rgb(156, 39, 176)', // terminal-purple
    community: 'rgb(255, 255, 0)', // terminal-yellow
    article: 'rgb(244, 67, 54)', // terminal-red
    tool: 'rgb(33, 150, 243)', // terminal-blue
    project: 'rgb(233, 30, 99)', // terminal-magenta
  };
  return colors[type] || colors.blog;
};
