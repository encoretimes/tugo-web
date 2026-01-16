/**
 * Convert ISO timestamp to Korean relative time format
 *
 * @param isoTimestamp - ISO 8601 timestamp string (e.g., "2025-10-29T14:43:53.173534")
 * @returns Korean relative time string
 *
 * Format rules:
 * - Less than 1 minute: "방금 전"
 * - 1 to 59 minutes: "N분 전"
 * - 1 to 23 hours: "N시간 전"
 * - Today (but more than 24h): "오늘 HH:mm"
 * - 1 to 6 days ago: "N일 전"
 * - 7 to 27 days ago: "N주일 전"
 * - 28 to 364 days ago: "N개월 전"
 * - 365+ days ago: "N년 전"
 */
export function formatRelativeTime(
  isoTimestamp: string | undefined | null
): string {
  try {
    // Handle null/undefined
    if (!isoTimestamp) {
      return '날짜 없음';
    }

    const now = new Date();
    const target = new Date(isoTimestamp);

    // Invalid date check
    if (isNaN(target.getTime())) {
      console.warn('Invalid date format:', isoTimestamp);
      return '날짜 오류';
    }

    // Future timestamp - show as "방금 전"
    if (target > now) {
      return '방금 전';
    }

    // Calculate differences
    const diffMs = now.getTime() - target.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Less than 1 minute
    if (diffMinutes < 1) {
      return '방금 전';
    }

    // 1 to 59 minutes
    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    }

    // 1 to 23 hours
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }

    // Check if today (same date) but more than 24 hours
    const isToday =
      now.getFullYear() === target.getFullYear() &&
      now.getMonth() === target.getMonth() &&
      now.getDate() === target.getDate();

    if (isToday) {
      const hours = target.getHours().toString().padStart(2, '0');
      const minutes = target.getMinutes().toString().padStart(2, '0');
      return `오늘 ${hours}:${minutes}`;
    }

    // 1 to 6 days ago
    if (diffDays >= 1 && diffDays <= 6) {
      return `${diffDays}일 전`;
    }

    // 7 to 27 days ago (1-3 weeks)
    if (diffDays >= 7 && diffDays <= 27) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}주일 전`;
    }

    // 28 to 364 days ago (months)
    if (diffDays >= 28 && diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}개월 전`;
    }

    // 365+ days ago (years)
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      return `${years}년 전`;
    }

    // Fallback (shouldn't reach here)
    return '날짜 오류';
  } catch (error) {
    // Error handling: return user-friendly message
    console.error('Error formatting relative time:', error, isoTimestamp);
    return '날짜 오류';
  }
}

/**
 * 쪽지 목록용 시간 포맷
 *
 * @param isoTimestamp - ISO 8601 timestamp string
 * @returns Formatted time string for room list
 *
 * Format rules:
 * - 오늘: "HH:mm" (예: "14:30")
 * - 어제: "어제"
 * - 올해 내: "M월 D일" (예: "1월 15일")
 * - 작년 이전: "YYYY.M.D" (예: "2024.12.15")
 */
export function formatRoomListTime(
  isoTimestamp: string | undefined | null
): string {
  try {
    if (!isoTimestamp) {
      return '';
    }

    const now = new Date();
    const target = new Date(isoTimestamp);

    if (isNaN(target.getTime())) {
      return '';
    }

    const isToday =
      now.getFullYear() === target.getFullYear() &&
      now.getMonth() === target.getMonth() &&
      now.getDate() === target.getDate();

    if (isToday) {
      const hours = target.getHours().toString().padStart(2, '0');
      const minutes = target.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      yesterday.getFullYear() === target.getFullYear() &&
      yesterday.getMonth() === target.getMonth() &&
      yesterday.getDate() === target.getDate();

    if (isYesterday) {
      return '어제';
    }

    const isSameYear = now.getFullYear() === target.getFullYear();

    if (isSameYear) {
      return `${target.getMonth() + 1}월 ${target.getDate()}일`;
    }

    return `${target.getFullYear()}.${target.getMonth() + 1}.${target.getDate()}`;
  } catch {
    return '';
  }
}

/**
 * 날짜 구분선용 포맷
 *
 * @param isoTimestamp - ISO 8601 timestamp string
 * @returns Formatted date string for date separator
 *
 * Format rules:
 * - 오늘: "오늘"
 * - 어제: "어제"
 * - 올해 내: "M월 D일 요일" (예: "1월 15일 수요일")
 * - 작년 이전: "YYYY년 M월 D일 요일" (예: "2024년 12월 15일 일요일")
 */
export function formatDateSeparator(isoTimestamp: string): string {
  try {
    const now = new Date();
    const target = new Date(isoTimestamp);

    if (isNaN(target.getTime())) {
      return '';
    }

    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[target.getDay()];

    const isToday =
      now.getFullYear() === target.getFullYear() &&
      now.getMonth() === target.getMonth() &&
      now.getDate() === target.getDate();

    if (isToday) {
      return '오늘';
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      yesterday.getFullYear() === target.getFullYear() &&
      yesterday.getMonth() === target.getMonth() &&
      yesterday.getDate() === target.getDate();

    if (isYesterday) {
      return '어제';
    }

    const isSameYear = now.getFullYear() === target.getFullYear();

    if (isSameYear) {
      return `${target.getMonth() + 1}월 ${target.getDate()}일 ${weekday}`;
    }

    return `${target.getFullYear()}년 ${target.getMonth() + 1}월 ${target.getDate()}일 ${weekday}`;
  } catch {
    return '';
  }
}

/**
 * 두 타임스탬프가 같은 날짜인지 확인
 *
 * @param ts1 - First ISO 8601 timestamp
 * @param ts2 - Second ISO 8601 timestamp
 * @returns true if both timestamps are on the same day
 */
export function isSameDay(ts1: string, ts2: string): boolean {
  try {
    const d1 = new Date(ts1);
    const d2 = new Date(ts2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch {
    return false;
  }
}

/**
 * 두 타임스탬프가 같은 분인지 확인 (메시지 그룹화용)
 *
 * @param ts1 - First ISO 8601 timestamp
 * @param ts2 - Second ISO 8601 timestamp
 * @returns true if both timestamps are within the same minute
 */
export function isSameMinute(ts1: string, ts2: string): boolean {
  try {
    const d1 = new Date(ts1);
    const d2 = new Date(ts2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate() &&
      d1.getHours() === d2.getHours() &&
      d1.getMinutes() === d2.getMinutes()
    );
  } catch {
    return false;
  }
}
