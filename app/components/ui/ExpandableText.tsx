'use client';

import { useState, useRef, useEffect } from 'react';
import MentionText from '@/components/feed/MentionText';

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
  onExpand?: () => void;
  showFullContent?: boolean; // 전체 내용을 보여줄지 여부
}

export default function ExpandableText({
  text,
  maxLines = 20,
  className = '',
  onExpand,
  showFullContent = false,
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

  const handleTextClick = () => {
    if (onExpand) {
      onExpand();
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExpand) {
      onExpand();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={className}>
      <div
        ref={textRef}
        onClick={handleTextClick}
        className={`whitespace-pre-wrap break-words ${
          !showFullContent && !isExpanded && needsExpansion
            ? `line-clamp-${maxLines}`
            : ''
        } ${onExpand ? 'cursor-pointer' : ''}`}
        style={
          !showFullContent && !isExpanded && needsExpansion
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
      {!showFullContent && needsExpansion && (
        <button
          onClick={handleMoreClick}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
        >
          {onExpand ? '더보기' : isExpanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  );
}
