export default function Post({
  type,
  title,
  date,
  excerpt,
  hashtags,
  children,
}) {
  // Process hashtags to ensure we have an array to work with
  const tagArray = Array.isArray(hashtags)
    ? hashtags
    : typeof hashtags === 'string'
    ? [hashtags]
    : [];

  const getTypeInfo = (type) => {
    switch (type) {
      case 'blog':
        return {
          icon: '📝',
          class:
            'bg-terminal-green/20 text-terminal-green border-terminal-green',
        };
      case 'podcast':
        return {
          icon: '🎙️',
          class:
            'bg-terminal-purple/20 text-terminal-purple border-terminal-purple',
        };
      case 'website':
        return {
          icon: '🌐',
          class:
            'bg-terminal-yellow/20 text-terminal-yellow border-terminal-yellow',
        };
      case 'article':
        return {
          icon: '📄',
          class: 'bg-terminal-red/20 text-terminal-red border-terminal-red',
        };
      case 'tool':
        return {
          icon: '🛠️',
          class: 'bg-terminal-blue/20 text-terminal-blue border-terminal-blue',
        };
      case 'project':
        return {
          icon: '✨',
          class:
            'bg-terminal-magenta/20 text-terminal-magenta border-terminal-magenta',
        };
      default:
        return {
          icon: '',
          class:
            'bg-terminal-green/20 text-terminal-green border-terminal-green',
        };
    }
  };

  const getHashtagStyle = (postType) => {
    switch (postType) {
      case 'blog':
        return 'text-terminal-green';
      case 'podcast':
        return 'text-terminal-purple';
      case 'website':
        return 'text-terminal-yellow';
      case 'article':
        return 'text-terminal-red';
      case 'tool':
        return 'text-terminal-blue';
      case 'project':
        return 'text-terminal-magenta';
      default:
        return 'text-terminal-green';
    }
  };

  const getHashtagGlowStyle = (postType) => {
    switch (postType) {
      case 'blog':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-green)]';
      case 'podcast':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-purple)]';
      case 'website':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-yellow)]';
      case 'article':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-red)]';
      case 'tool':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-blue)]';
      case 'project':
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-magenta)]';
      default:
        return 'hover:drop-shadow-[0_0_8px_var(--color-terminal-green)]';
    }
  };

  const typeInfo = getTypeInfo(type);
  const hashtagStyle = getHashtagStyle(type);

  return (
    <article className='max-w-2xl px-2 bg-terminal/20'>
      <header className='mb-6'>
        <h1 className='text-3xl text-terminal-green mb-2 font-ibm'>{title}</h1>
        {date && <p className='text-terminal-dimmed text-sm mb-2'>[{date}]</p>}
        {excerpt && <h2 className='text-terminal-text mb-4'>{excerpt}</h2>}
        {tagArray && tagArray.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {tagArray.map((tag, index) => (
              <a
                key={index}
                href={`/codex?tag=${encodeURIComponent(tag)}`}
                className={`
                  text-sm ${hashtagStyle} cursor-pointer transition-all duration-200
                  ${getHashtagGlowStyle(type)}
                `}
              >
                #{tag}
              </a>
            ))}
          </div>
        )}
      </header>

      <div className='w-full border-b border-dashed border-terminal-dimmed'></div>
      <section className='text-terminal-text'>{children}</section>
    </article>
  );
}
