import localFont from 'next/font/local';
import './globals.css';
import '../styles/mdx.css';
import NavWrap from '@/components/navigation/layout/NavWrap';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MatrixRain from '@/components/transition/MatrixRain';

const ocrFont = localFont({
  src: './fonts/OCRA.woff',
  variable: '--font-ocr',
  display: 'swap',
});

const ibm3270 = localFont({
  src: './fonts/IBM_3270.woff',
  variable: '--font-ibm',
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s | stepweaver',
    default: 'stepweaver | Web Developer',
  },
  description: 'A terminal-inspired portfolio and codex by Stephen Weaver.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stepweaver.dev/',
    siteName: 'stepweaver',
    title: 'stepweaver | Web Developer',
    description: 'A terminal-inspired portfolio and codex by Stephen Weaver.',
    images: [
      {
        url: '/images/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'Stephen Weaver Terminal Portfolio',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [{ rel: 'manifest', url: '/favicon/site.webmanifest' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${ocrFont.variable} ${ibm3270.variable} antialiased suppressHydrationWarning`}
    >
      <head>
        <meta name='theme-color' content='#0d1211' />
      </head>
      <body className='w-full min-h-screen flex flex-col'>
        {/* CRT Effect */}
        <div className='crt-background'></div>
        <div className='crt-overlay'></div>
        <div className='crt-vignette'></div>

        {/* Main Content */}
        <MatrixRain>
          <div className='mx-auto w-full max-w-4xl px-4 md:px-6 flex flex-col'>
            <Header />
            <NavWrap />
            <main className='flex-1 w-full pb-8'>{children}</main>
            <Footer />
          </div>
        </MatrixRain>
      </body>
    </html>
  );
}
