/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CameraMode } from '../types/game';

interface HeaderBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSelectZone: (zone: CameraMode) => void;
  onStartChase: () => void;
  isBusy: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  theme,
  onToggleTheme,
  onSelectZone,
  onStartChase,
  isBusy,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Zone 1: Single text element wordmark */}
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2">
        <span>🛸</span>
        <span>UFO Chase Adventure</span>
      </span>

      {/* Zone 2: 4–5 clean single-line text navigation links to map zones */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={() => onSelectZone('PRESET_SCHOOL')}
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          School House
        </button>
        <button
          onClick={() => onSelectZone('PRESET_CAVE')}
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Crystal Cave
        </button>
        <button
          onClick={() => onSelectZone('PRESET_LAKE')}
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Turquoise Lake
        </button>
        <button
          onClick={() => onSelectZone('CHASE')}
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Chase View
        </button>
        <button
          onClick={() => onSelectZone('ORBIT')}
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Free Orbit
        </button>
      </nav>

      {/* Zone 3: Primary action + Theme Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleTheme}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        <button
          onClick={onStartChase}
          disabled={isBusy}
          className={`px-4 py-2 text-xs font-bold text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            isBusy
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 shadow-sm'
          }`}
        >
          {isBusy ? 'Scanning...' : 'Launch Chase'}
        </button>
      </div>
    </header>
  );
};
