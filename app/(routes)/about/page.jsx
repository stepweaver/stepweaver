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
          I&apos;m a problem-solver, builder, and relentless learner with a
          passion for web development and modern JavaScript frameworks. I don't
          just code—I engineer, refine, and optimize.
        </p>
        <p className='text-terminal-text mt-3'>
          Whether I&apos;m building full-stack applications, exploring DevOps
          automation, or pushing the boundaries of what&apos;s possible with new
          technologies, I thrive on learning, adapting, and solving complex
          problems.
        </p>
        <p className='text-terminal-text mt-3'>
          I believe in continuous growth and collaboration, always striving to
          create solutions that are as efficient as they are impactful.
        </p>
      </div>
      <div className='text-terminal-dimmed text-sm mt-2'>$ cat about.md</div>
      <div className='mt-8'>
        <ContactForm />
      </div>
    </div>
  );
}
