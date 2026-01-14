import { FC } from 'react';

interface IconProps {
  className?: string;
  filled?: boolean;
}

/**
 * 홈 아이콘
 */
export const HomeIcon: FC<IconProps> = ({
  className = 'w-6 h-6',
  filled = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {filled ? (
      <path
        d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z"
        fill="currentColor"
        stroke="none"
      />
    ) : (
      <>
        <path d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" />
        <path d="M9 22V12H15V22" />
      </>
    )}
  </svg>
);

/**
 * 탐색/나침반 아이콘
 */
export const CompassIcon: FC<IconProps> = ({
  className = 'w-6 h-6',
  filled = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    {filled ? (
      <polygon
        points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"
        fill="currentColor"
        stroke="none"
      />
    ) : (
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="none" />
    )}
  </svg>
);

/**
 * 글쓰기/플러스 아이콘
 */
export const PlusIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5V19" />
    <path d="M5 12H19" />
  </svg>
);

/**
 * 알림/종 아이콘
 */
export const BellIcon: FC<IconProps> = ({
  className = 'w-6 h-6',
  filled = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {filled ? (
      <>
        <path
          d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
          fill="currentColor"
          stroke="none"
        />
        <path
          d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      </>
    ) : (
      <>
        <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" />
        <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" />
      </>
    )}
  </svg>
);

/**
 * 프로필/사용자 아이콘
 */
export const UserIcon: FC<IconProps> = ({
  className = 'w-6 h-6',
  filled = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {filled ? (
      <>
        <circle cx="12" cy="8" r="4" fill="currentColor" stroke="none" />
        <path
          d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20V21H4V20Z"
          fill="currentColor"
          stroke="none"
        />
      </>
    ) : (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" />
      </>
    )}
  </svg>
);

/**
 * 쪽지/메일 아이콘
 */
export const MailIcon: FC<IconProps> = ({
  className = 'w-6 h-6',
  filled = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {filled ? (
      <>
        <rect
          x="2"
          y="4"
          width="20"
          height="16"
          rx="2"
          fill="currentColor"
          stroke="none"
        />
        <path d="M22 6L12 13L2 6" stroke="white" strokeWidth={1.5} />
      </>
    ) : (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 6L12 13L2 6" />
      </>
    )}
  </svg>
);

/**
 * 햄버거 메뉴 아이콘
 */
export const MenuIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12H21" />
    <path d="M3 6H21" />
    <path d="M3 18H21" />
  </svg>
);

/**
 * 닫기 (X) 아이콘
 */
export const CloseIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6L18 18" />
  </svg>
);

/**
 * 북마크 아이콘
 */
export const BookmarkIcon: FC<IconProps> = ({
  className = 'w-6 h-6',
  filled = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {filled ? (
      <path
        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
        fill="currentColor"
        stroke="none"
      />
    ) : (
      <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" />
    )}
  </svg>
);

/**
 * 설정/톱니바퀴 아이콘
 */
export const SettingsIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/**
 * 로그아웃 아이콘
 */
export const LogoutIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/**
 * 글/문서 아이콘 (내 게시글)
 */
export const DocumentIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

/**
 * 댓글 아이콘 (내 댓글)
 */
export const CommentIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

/**
 * 달/다크모드 아이콘
 */
export const MoonIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/**
 * 해/라이트모드 아이콘
 */
export const SunIcon: FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
