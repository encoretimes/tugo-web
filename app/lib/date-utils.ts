/**
 * Convert ISO timestamp to Korean relative time format
 *
 * @param isoTimestamp - ISO 8601 timestamp string (e.g., "2025-10-29T14:43:53.173534")
 * @returns Korean relative time string
 *
 * Format rules:
 * - Today: "오늘 14:30" (오늘 + HH:mm)
 * - 1 to 6 days ago: "N일 전" (1일 전, 2일 전, etc.)
 * - 7 to 27 days (1-4 weeks): "N주일 전" (1주일 전, 2주일 전, 3주일 전, 4주일 전)
 * - 4 weeks+ and 1+ month: "N개월 전" (1개월 전 ~ 11개월 전)
 * - 1+ year: "N년 전" (1년 전, 2년 전, etc.)
 */
export function formatRelativeTime(isoTimestamp: string): string {
  try {
    const now = new Date();
    const target = new Date(isoTimestamp);

    // Invalid date check
    if (isNaN(target.getTime())) {
      return isoTimestamp;
    }

    // Future timestamp check
    if (target > now) {
      return isoTimestamp;
    }

    // Calculate differences
    const diffMs = now.getTime() - target.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Check if today (same date)
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

    // 7 to 27 days ago (1-4 weeks)
    if (diffDays >= 7 && diffDays <= 27) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}주일 전`;
    }

    // Calculate month difference properly
    const yearsDiff = now.getFullYear() - target.getFullYear();
    const monthsDiff = now.getMonth() - target.getMonth();
    const totalMonthsDiff = yearsDiff * 12 + monthsDiff;

    // 1 to 11 months ago
    // Use month difference if >= 1 month, otherwise keep showing weeks
    if (totalMonthsDiff >= 1 && totalMonthsDiff < 12) {
      return `${totalMonthsDiff}개월 전`;
    }

    // 1+ years ago
    if (totalMonthsDiff >= 12) {
      const years = Math.floor(totalMonthsDiff / 12);
      return `${years}년 전`;
    }

    // Edge case: 4+ weeks but less than 1 full month
    // This handles the case between 4주일 전 and 1개월 전
    if (diffDays >= 28) {
      return '4주일 전';
    }

    // Fallback (shouldn't reach here)
    return isoTimestamp;
  } catch (error) {
    // Error handling: return original timestamp
    console.error('Error formatting relative time:', error);
    return isoTimestamp;
  }
}
