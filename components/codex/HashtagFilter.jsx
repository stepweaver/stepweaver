'use client';

export default function HashtagFilter({
  allHashtags,
  activeHashtags,
  toggleHashtag,
}) {
  return (
    <div className='mb-3' id='tag-filter'>
      <div className='flex items-center w-full mb-2'>
        <span className='text-terminal-green mr-2'>$</span>
        <span className='text-terminal-dimmed text-sm'>filter by tag:</span>
        {activeHashtags.length > 0 && (
          <button
            onClick={() => toggleHashtag('clear')}
            className='ml-4 text-xs text-terminal-dimmed hover:text-terminal-text'
          >
            [clear all]
          </button>
        )}
      </div>
      <div className='flex flex-wrap gap-1.5 mx-auto max-w-4xl'>
        {allHashtags.map((tag) => {
          const isSelected = activeHashtags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleHashtag(tag)}
              className={`px-1.5 py-0.5 text-xs rounded inline-flex items-center cursor-pointer 
                ${
                  isSelected
                    ? 'bg-terminal-green text-black border-terminal-green'
                    : 'bg-black text-terminal-green border-terminal-green border'
                }
              `}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
