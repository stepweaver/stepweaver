export const metadata = {
  title: 'Codex | Stephen Weaver',
  description:
    'Browse my collection of blog posts, podcasts, projects and more.',
  openGraph: {
    title: 'Codex | Stephen Weaver',
    description:
      'Browse my collection of blog posts, podcasts, projects and more.',
    url: 'https://stepweaver.dev/codex',
    type: 'website',
    images: ['/images/lambda-preview.png'],
  },
};

export default function CodexLayout({ children }) {
  return children;
}
