// This file is no longer needed with the next-mdx-remote approach
// Only used with the standard Next.js MDX handling
// You can safely delete this file

'use client';

// This file is required for MDX to work with Next.js App Router
export function useMDXComponents(components) {
  return {
    // Use the default components
    ...components,
  };
}
