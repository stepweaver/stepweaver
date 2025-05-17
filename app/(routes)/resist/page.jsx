export const metadata = {
  title: 'Resist',
  description: 'Speaking truth and refusing to be silenced',
  openGraph: {
    title: 'Resist | Stephen Weaver',
    description: 'Speaking truth and refusing to be silenced',
  },
};

export default function ResistPage() {
  return (
    <div className='container mx-auto py-12 px-4 max-w-3xl'>
      <h1 className='text-3xl font-bold mb-8'>Resist</h1>

      <div className='prose prose-lg text-terminal-text'>
        <p className='font-semibold text-xl'>
          I speak truth. I will not be silenced.
        </p>

        <p>
          This is America—and the First Amendment must stand.
          <br />
          Free speech. Free press. Free thought.
          <br />
          These are not optional. They are fundamental.
        </p>

        <p>
          We are living through a moment where truth is under siege. Our
          Constitution is being tested by a regime that stacks institutions with
          loyalists, attacks the press, and warps justice for power. I do not
          believe this is normal—and I refuse to pretend that it is.
        </p>

        <p>
          I'm not here to build a following. I'm not here to go viral.
          <br />
          I'm here to document. To observe. To resist.
          <br />
          I will share what I see. I'll post links, cite sources, and speak
          plainly.
          <br />
          You don't have to agree with me—but you will know where I stand.
        </p>

        <p>
          I believe in democracy, justice, and anti-fascism.
          <br />
          That doesn't make me radical—it makes me American.
        </p>

        <p>
          I am a developer. A veteran. A builder.
          <br />
          But first and always—I am a citizen with a voice.
        </p>

        <p>
          This site is mine.
          <br />
          This space is free.
          <br />
          And this voice will not be quiet.
        </p>
      </div>
    </div>
  );
}
