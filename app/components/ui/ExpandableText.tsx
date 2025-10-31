'use client';

import { useState, useRef, useEffect } from 'react';
import MentionText from '@/components/feed/MentionText';

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export default function ExpandableText({
  text,
  maxLines = 20,
  className = '',
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(textRef.current).lineHeight
      );
      const textHeight = textRef.current.scrollHeight;
      const lines = Math.round(textHeight / lineHeight);

      setNeedsExpansion(lines > maxLines);
    }
  }, [text, maxLines]);

  return (
    <div className={className}>
      <div
        ref={textRef}
        className={`whitespace-pre-wrap ${
          !isExpanded && needsExpansion ? `line-clamp-${maxLines}` : ''
        }`}
        style={
          !isExpanded && needsExpansion
            ? {
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
            : undefined
        }
      >
        <MentionText content={text} />
      </div>
      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {isExpanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  );
}
