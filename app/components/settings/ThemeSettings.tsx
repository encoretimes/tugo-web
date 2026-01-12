'use client';

import { useThemeStore, ThemeMode } from '@/store/themeStore';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

const themeOptions: { value: ThemeMode; label: string; icon: typeof SunIcon }[] = [
  { value: 'light', label: '라이트', icon: SunIcon },
  { value: 'dark', label: '다크', icon: MoonIcon },
  { value: 'system', label: '시스템', icon: ComputerDesktopIcon },
];

export default function ThemeSettings() {
  const { mode, setMode } = useThemeStore();

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
        테마 설정
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        화면 테마를 설정합니다
      </p>

      <div className="flex gap-2">
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === value
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
