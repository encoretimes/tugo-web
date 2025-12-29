'use client';

import React from 'react';
import Link from 'next/link';

interface MentionTextProps {
  content: string;
  className?: string;
}

/**
 * 텍스트에서 @username 패턴을 찾아 링크로 렌더링하는 컴포넌트
 */
export default function MentionText({
  content,
  className = '',
}: MentionTextProps) {
  // @username 패턴 매칭 (백엔드와 동일한 패턴 사용)
  const mentionPattern = /@([a-zA-Z0-9_-]+)/g;

  // 텍스트를 파싱하여 멘션과 일반 텍스트로 분리
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionPattern.exec(content)) !== null) {
    const username = match[1];
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;

    // 멘션 이전 텍스트 추가
    if (matchStart > lastIndex) {
      parts.push(content.substring(lastIndex, matchStart));
    }

    // 멘션 링크 추가
    parts.push(
      <Link
        key={`mention-${matchStart}-${username}`}
        href={`/@${username}`}
        className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        @{username}
      </Link>
    );

    lastIndex = matchEnd;
  }

  // 마지막 텍스트 추가
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <div className={className}>{parts.length > 0 ? parts : content}</div>;
}
