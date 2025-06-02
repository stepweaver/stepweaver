import ContactForm from '@/components/ui/ContactForm';

export const metadata = {
  title: 'About Me',
  description: 'Learn more about me and my work',
  metadataBase: new URL('https://stepweaver.dev'),
  openGraph: {
    title: 'About Me',
    description: 'Learn more about me and my work',
    images: ['/images/lambda-preview.png'],
  },
};

export default function AboutPage() {
  return (
    <div className='space-y-8 mt-4'>
      <div className='border-l-2 border-terminal-green pl-5'>
        <h2 className='text-xl text-terminal-green'>
          # ABOUT ME<span className='blink'>_</span>
        </h2>
        <p className='text-terminal-text mt-4'>
          I&apos;m a developer who learns by building. I didn&apos;t wait for a
          roadmap — I taught myself the skills I needed by diving into real
          projects, solving real problems, and shipping real code.
        </p>
        <p className='text-terminal-text mt-3'>
          I move fast, think clearly, and build with purpose. Whether it&apos;s
          frontend interfaces, full-stack applications, or weird little tools
          that make life easier or more fun, I&apos;m always chasing that moment
          where things just click — when a messy idea turns into something that
          works.
        </p>
        <p className='text-terminal-text mt-3'>
          I love clean code, clever solutions, and the satisfaction of pushing
          through a tough bug. I care about craft, but I care even more about
          shipping things that matter.
        </p>
        <p className='text-terminal-text mt-3'>
          Right now, I&apos;m looking for work — freelance or full-time. If
          you&apos;re building something ambitious and need a developer
          who&apos;s hungry, hands-on, and ready to contribute, let&apos;s talk.
        </p>
        <p className='text-terminal-text mt-3'>
          I&apos;m not here to play at this.
          <br />
          I&apos;m here to build.
        </p>
      </div>
      <div className='text-terminal-dimmed text-sm mt-2'>$ cat about.md</div>
      <div className='mt-8'>
        <ContactForm />
      </div>
    </div>
  );
}
