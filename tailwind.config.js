/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          DEFAULT: 'var(--color-terminal-dark)',
          light: 'var(--color-terminal-light)',
          border: 'var(--color-terminal-border)',
          green: 'var(--color-terminal-green)',
          yellow: 'var(--color-terminal-yellow)',
          red: 'var(--color-terminal-red)',
          blue: 'var(--color-terminal-blue)',
          text: 'var(--color-terminal-text)',
          muted: 'var(--color-terminal-muted)',
          cyan: 'var(--color-terminal-cyan)',
          dimmed: 'var(--color-terminal-dimmed)',
          window: 'var(--color-terminal-dark)',
          header: 'var(--color-terminal-light)',
          magenta: 'var(--color-terminal-magenta)',
          purple: 'var(--color-terminal-purple)',
          orange: 'var(--color-terminal-orange)',
        },
      },
      fontFamily: {
        ocr: ['var(--font-ocr)'],
        ibm: ['var(--font-ibm)'],
        mono: ['var(--font-mono)'],
        sans: ['var(--font-sans)'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        glitch: 'glitch 0.3s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '60%': { transform: 'skewX(2deg)' },
          '80%': { transform: 'skewX(-2deg)' },
        },
      },
    },
  },
};
