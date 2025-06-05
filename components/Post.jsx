import formatDate from '@/utils/formatDate';

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
      case 'community':
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
      case 'community':
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
      case 'community':
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

  // Format the date properly using our utility
  const formattedDate = date ? formatDate(date) : null;

  return (
    <article className='max-w-3xl px-2 bg-terminal/20'>
      <header
        className='mb-8 border-l-2 pl-4'
        style={{
          borderColor: `var(--color-${
            type === 'blog'
              ? 'terminal-green'
              : type === 'podcast'
              ? 'terminal-purple'
              : type === 'community'
              ? 'terminal-yellow'
              : type === 'article'
              ? 'terminal-red'
              : type === 'tool'
              ? 'terminal-blue'
              : 'terminal-magenta'
          })`,
        }}
      >
        {/* Type & Date line */}
        <div className='flex items-center justify-between mb-4'>
          <div
            className={`inline-block px-2 py-0.5 rounded ${typeInfo.class
              .replace('bg-terminal-green/20', 'bg-terminal-green/10')
              .replace('bg-terminal-purple/20', 'bg-terminal-purple/10')
              .replace('bg-terminal-yellow/20', 'bg-terminal-yellow/10')
              .replace('bg-terminal-red/20', 'bg-terminal-red/10')
              .replace('bg-terminal-blue/20', 'bg-terminal-blue/10')
              .replace('bg-terminal-magenta/20', 'bg-terminal-magenta/10')}`}
          >
            <span className='mr-2'>{typeInfo.icon}</span>
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
          {formattedDate && (
            <div className='text-terminal-dimmed' style={{ fontSize: '16px' }}>
              {formattedDate}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className={`text-3xl ${hashtagStyle} mb-4 font-ibm`}>{title}</h1>

        {/* Excerpt */}
        {excerpt && (
          <h2 className='text-terminal-text mb-4 text-lg'>{excerpt}</h2>
        )}

        {/* Hashtags */}
        {tagArray && tagArray.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-0 mt-4'>
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

      <div className='w-full border-b border-dashed border-terminal-dimmed mb-6'></div>
      <section className='prose prose-invert prose-p:my-6 prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-4 max-w-none text-terminal-text'>
        {children}
      </section>
    </article>
  );
}
