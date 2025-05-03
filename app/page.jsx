export default function Home() {
  return (
    <div className='space-y-4'>
      <div className='border-l-2 border-terminal-green pl-5'>
        <h2 className='text-xl text-terminal-green'>
          # WELCOME <span className='blink'>_</span>
        </h2>
        <p className='text-terminal-text mt-4'>
          I&apos;m a web developer and business analyst at the University of
          Notre Dame with a passion for creating unique digital experiences and
          building tools that help people work smarter, not harder.
        </p>
      </div>
      <div className='text-terminal-dimmed text-sm mt-2'>$ cat welcome.md</div>
    </div>
  );
}
