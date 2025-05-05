export default function Post({
  type,
  title,
  date,
  excerpt,
  hashtags,
  children,
}) {
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

  const typeInfo = getTypeInfo(type);
  const hashtagStyle = getHashtagStyle(type);

  return (
    <article className='max-w-2xl px-2 bg-terminal/20'>
      <header className='mb-6'>
        <h1 className='text-3xl text-terminal-green mb-2 font-ibm'>{title}</h1>
        {date && <p className='text-terminal-dimmed text-sm mb-2'>[{date}]</p>}
        {excerpt && <h2 className='text-terminal-text mb-4'>{excerpt}</h2>}
        <div className='mb-2 flex flex-wrap gap-2'>
          <a
            href={`/codex?tag=${encodeURIComponent(type)}`}
            className={`px-2 py-0.5 text-sm rounded border h-6 inline-flex items-center justify-center cursor-pointer ${typeInfo.class}`}
          >
            {typeInfo.icon && <span className='mr-1'>{typeInfo.icon}</span>}
            {type}
          </a>
        </div>
      </header>
      <div className='w-full border-b border-dashed border-terminal-dimmed'></div>
      <section className='text-terminal-text'>
        {children}

        {hashtags && hashtags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-4'>
            {hashtags.map((tag) => (
              <a
                key={tag}
                href={`/codex?tag=${encodeURIComponent(tag)}`}
                className={`text-sm ${hashtagStyle} cursor-pointer hover:text-terminal-text`}
              >
                #{tag}
              </a>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
