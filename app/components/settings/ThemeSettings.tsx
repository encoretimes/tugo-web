'use client';

import { useThemeStore, ThemeMode } from '@/store/themeStore';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

const themeOptions: {
  value: ThemeMode;
  label: string;
  icon: typeof SunIcon;
}[] = [
  { value: 'light', label: '라이트', icon: SunIcon },
  { value: 'dark', label: '다크', icon: MoonIcon },
  { value: 'system', label: '시스템', icon: ComputerDesktopIcon },
];

export default function ThemeSettings() {
  const { mode, setMode } = useThemeStore();

  return (
    <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
      <div className="mb-4">
        <h4 className="text-base font-medium text-gray-900 dark:text-neutral-100">
          테마
        </h4>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          화면 테마를 설정합니다
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-md border transition-all ${
              mode === value
                ? 'border-gray-400 dark:border-neutral-500 text-gray-900 dark:text-neutral-100'
                : 'border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 hover:border-gray-300 dark:hover:border-neutral-600'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
