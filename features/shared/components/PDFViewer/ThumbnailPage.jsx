'use client';

import { memo } from 'react';
import { Page } from 'react-pdf';

// Memoized thumbnail component to prevent re-rendering
export const ThumbnailPage = memo(({ page, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${
        isActive ? 'border-primary shadow-md' : 'border-transparent'
      }`}
    >
      <div className="relative bg-white">
        <Page pageNumber={page} width={160} renderTextLayer={false} renderAnnotationLayer={false} />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center">
          {page}
        </div>
      </div>
    </button>
  );
});

ThumbnailPage.displayName = 'ThumbnailPage';
