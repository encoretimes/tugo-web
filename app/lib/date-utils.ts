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
export function formatRelativeTime(isoTimestamp: string | undefined | null): string {
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
