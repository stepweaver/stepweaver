export default function manifest() {
  return {
    name: 'Stephen Weaver | Web Developer',
    short_name: 'Stephen Weaver',
    description:
      'Terminal-inspired portfolio of Stephen Weaver, full-stack developer and business-minded technologist.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#00ff00',
    icons: [
      {
        src: '/favicon/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
