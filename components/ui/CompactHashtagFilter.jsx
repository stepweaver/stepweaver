import { useState } from 'react';

export default function CompactHashtagFilter({ 
  hashtags, 
  activeHashtags, 
  onToggleHashtag 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Display top 10 hashtags when collapsed
  const displayTags = isExpanded ? hashtags : hashtags.slice(0, 10);
  
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-1.5">
        {displayTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onToggleHashtag(tag)}
            className={`px-1.5 py-0.5 text-xs rounded inline-flex items-center
              ${activeHashtags.includes(tag) 
                ? 'bg-terminal-green text-black' 
                : 'bg-black text-terminal-green border-terminal-green border'}`}
          >
            #{tag}
          </button>
        ))}
        
        {!isExpanded && hashtags.length > 10 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="px-1.5 py-0.5 text-xs rounded inline-flex items-center text-terminal-dimmed hover:text-terminal-text"
          >
            +{hashtags.length - 10} more...
          </button>
        )}
        
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="px-1.5 py-0.5 text-xs rounded inline-flex items-center text-terminal-dimmed hover:text-terminal-text"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}