'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/16/solid';

interface MentionTextProps {
  content: string;
  className?: string;
}

// URL을 truncate하는 함수
function truncateUrl(url: string, maxLength: number = 40): string {
  if (url.length <= maxLength) return url;

  // protocol 제거 후 표시
  const withoutProtocol = url.replace(/^https?:\/\//, '');

  if (withoutProtocol.length <= maxLength) return withoutProtocol;

  // 도메인과 경로 분리
  const domainMatch = withoutProtocol.match(/^([^/]+)(\/.*)?$/);
  if (!domainMatch) return withoutProtocol.slice(0, maxLength) + '...';

  const domain = domainMatch[1];
  const path = domainMatch[2] || '';

  if (path.length === 0) {
    return domain.length > maxLength
      ? domain.slice(0, maxLength) + '...'
      : domain;
  }

  // 도메인 + 일부 경로 표시
  const availableForPath = maxLength - domain.length - 3; // 3 for "..."
  if (availableForPath <= 5) {
    return domain + '/...';
  }

  return domain + path.slice(0, availableForPath) + '...';
}

/**
 * 텍스트에서 @username 패턴과 URL을 찾아 링크로 렌더링하는 컴포넌트
 */
export default function MentionText({
  content,
  className = '',
}: MentionTextProps) {
  // URL 패턴 (http, https, www로 시작하는 것 감지)
  const urlPattern =
    /(?:https?:\/\/|www\.)[^\s<>"\u3000-\u303F\uFF00-\uFFEF]+/gi;

  // @username 패턴 매칭 (백엔드와 동일한 패턴 사용)
  const mentionPattern = /@([a-zA-Z0-9_-]+)/g;

  // 텍스트를 파싱하여 멘션, URL, 일반 텍스트로 분리
  const parseContent = (): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // URL과 멘션을 모두 찾아서 위치순으로 정렬
    const matches: Array<{
      type: 'url' | 'mention';
      start: number;
      end: number;
      text: string;
      value: string;
    }> = [];

    // URL 매칭
    let urlMatch;
    while ((urlMatch = urlPattern.exec(content)) !== null) {
      matches.push({
        type: 'url',
        start: urlMatch.index,
        end: urlMatch.index + urlMatch[0].length,
        text: urlMatch[0],
        value: urlMatch[0].startsWith('www.')
          ? `https://${urlMatch[0]}`
          : urlMatch[0],
      });
    }

    // 멘션 매칭
    let mentionMatch;
    while ((mentionMatch = mentionPattern.exec(content)) !== null) {
      // URL 내부에 있는 멘션은 제외
      const isInsideUrl = matches.some(
        (m) =>
          m.type === 'url' &&
          mentionMatch!.index >= m.start &&
          mentionMatch!.index < m.end
      );

      if (!isInsideUrl) {
        matches.push({
          type: 'mention',
          start: mentionMatch.index,
          end: mentionMatch.index + mentionMatch[0].length,
          text: mentionMatch[0],
          value: mentionMatch[1],
        });
      }
    }

    // 시작 위치 기준 정렬
    matches.sort((a, b) => a.start - b.start);

    // 겹치는 매치 제거
    const filteredMatches = matches.filter((match, index) => {
      if (index === 0) return true;
      const prevMatch = matches[index - 1];
      return match.start >= prevMatch.end;
    });

    // 파싱
    for (const match of filteredMatches) {
      // 매치 이전 텍스트 추가
      if (match.start > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {content.substring(lastIndex, match.start)}
          </span>
        );
      }

      if (match.type === 'mention') {
        // 멘션 링크
        parts.push(
          <Link
            key={`mention-${match.start}`}
            href={`/@${match.value}`}
            className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            @{match.value}
          </Link>
        );
      } else {
        // URL 링크
        parts.push(
          <a
            key={`url-${match.start}`}
            href={match.value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-primary-600 hover:text-primary-700 hover:underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="break-all">{truncateUrl(match.text)}</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 flex-shrink-0 inline" />
          </a>
        );
      }

      lastIndex = match.end;
    }

    // 마지막 텍스트 추가
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <div className={`break-words ${className}`}>
      {content ? parseContent() : content}
    </div>
  );
}
