export const dynamic = 'force-dynamic';
('use client');

import React, { Suspense } from 'react';
import CodexPageInner from './components/CodexPageInner';

export default function CodexPage(props) {
  return (
    <Suspense
      fallback={
        <div className='text-terminal-dimmed text-center py-8'>
          Loading codex...
        </div>
      }
    >
      <CodexPageInner {...props} />
    </Suspense>
  );
}
