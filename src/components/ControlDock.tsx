/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CameraMode, GameState, StudentData } from '../types/game';

interface ControlDockProps {
  theme: 'light' | 'dark';
  gameState: GameState;
  cameraMode: CameraMode;
  manualControl: boolean;
  soundEnabled: boolean;
  scanSeconds: 3 | 6 | 8 | 10;
  scanSecondsLeft: number;
  students: StudentData[];
  activeStudentId: string;
  selectedCategory: string;
  categories: string[];
  onToggleTheme: () => void;
  onStartChase: () => void;
  onSetCameraMode: (mode: CameraMode) => void;
  onToggleManualControl: (val: boolean) => void;
  onToggleSound: () => void;
  onSelectScanSeconds: (seconds: 3 | 6 | 8 | 10) => void;
  onSelectStudent: (id: string) => void;
  onSelectCategory: (cat: string) => void;
  onUpdateStudentName: (id: string, newName: string) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  theme,
  gameState,
  cameraMode,
  manualControl,
  soundEnabled,
  scanSeconds,
  scanSecondsLeft,
  students,
  activeStudentId,
  selectedCategory,
  categories,
  onToggleTheme,
  onStartChase,
  onSetCameraMode,
  onToggleManualControl,
  onToggleSound,
  onSelectScanSeconds,
  onSelectStudent,
  onSelectCategory,
  onUpdateStudentName,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'camera' | 'roster'>('game');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const isBusy = gameState === 'CHASING' || gameState === 'BEAMING' || gameState === 'SCANNING';

  const cameraOptions: { id: CameraMode; label: string; icon: string }[] = [
    { id: 'CHASE', label: 'Cinematic Chase', icon: '🎥' },
    { id: 'ORBIT', label: 'Free Orbit', icon: '🔄' },
    { id: 'PRESET_SCHOOL', label: 'School Yard', icon: '🏫' },
    { id: 'PRESET_CAVE', label: 'Crystal Cave', icon: '💎' },
    { id: 'PRESET_LAKE', label: 'Turquoise Lake', icon: '🌊' },
    { id: 'PRESET_UFO', label: 'UFO Overhead', icon: '🛸' },
  ];

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-40 transition-transform duration-300 w-full px-4 flex flex-col items-center pointer-events-none ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'bottom-5'
      }`}
      style={{ maxWidth: 'min(920px, 94vw)' }}
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="pointer-events-auto bg-white/95 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 hover:border-cyan-500 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-4 py-1.5 rounded-t-xl shadow-lg transition-colors cursor-pointer flex items-center gap-1.5 mb-[-1px]"
      >
        <span>{isCollapsed ? '▴ Show Controls' : '▾ Hide Controls (Zen Mode)'}</span>
      </button>

      {/* Main Unified Dock Panel (Solid rgba background, zero backdrop-filter) */}
      <div className="pointer-events-auto w-full bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 sm:p-4 text-slate-800 dark:text-slate-200 transition-colors">
        {/* Top Status & Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          {/* Static State Indicator (No pulsating dots) */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {gameState === 'IDLE' && 'Village Peaceful · Ready'}
              {gameState === 'SCANNING' && 'UFO Scanning Terrain...'}
              {gameState === 'CHASING' && 'Chase in Progress!'}
              {gameState === 'BEAMING' && 'Tractor Beam Active!'}
              {gameState === 'QUIZ' && 'Classroom Reading Clue'}
              {gameState === 'CELEBRATING' && 'Success! Returning Safely'}
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              🎮 UFO Chase
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              📷 Camera Views
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              📚 Roster & Words
            </button>
          </div>

          {/* Quick Sound & Theme Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              title="Toggle theme template"
            >
              <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={onToggleSound}
              className="p-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              title="Toggle procedural audio"
            >
              <span>{soundEnabled ? '🔊 Sound On' : '🔇 Muted'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Game & Chase Controls */}
        {activeTab === 'game' && (
          <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onStartChase}
                disabled={isBusy}
                className={`py-2.5 px-6 rounded-xl font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                  isBusy
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 shadow-cyan-500/20 active:scale-95'
                }`}
              >
                <span className="text-lg">🛸</span>
                <span>{isBusy ? 'Scanning Terrain...' : 'Start UFO Chase Round'}</span>
              </button>

              {/* Manual Control Toggle */}
              <button
                onClick={() => onToggleManualControl(!manualControl)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  manualControl
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{manualControl ? '🕹️ Player Control: ON' : '🤖 Auto Wander'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 p-2">
              <span className="px-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Quét</span>
              {([3, 6, 8, 10] as const).map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => onSelectScanSeconds(seconds)}
                  disabled={isBusy}
                  className={`rounded-lg px-2 py-1 text-xs font-black transition-colors ${
                    scanSeconds === seconds
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-cyan-100 dark:hover:bg-slate-700'
                  } ${isBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  {seconds}s
                </button>
              ))}
              {gameState === 'SCANNING' && (
                <span className="ml-1 rounded-md bg-amber-300 px-2 py-1 text-xs font-black text-slate-950">Còn {scanSecondsLeft}s</span>
              )}
            </div>

            {/* Helper Key Bindings when manual is active */}
            {manualControl ? (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span>Steer student:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono text-slate-800 dark:text-white">
                  WASD
                </kbd>
                <span>or</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono text-slate-800 dark:text-white">
                  Arrows
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-mono text-slate-800 dark:text-white">
                  SPACE
                </kbd>
                <span>to jump fence!</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                UFO scans and gently picks a random student character for reading clues.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Camera Presets */}
        {activeTab === 'camera' && (
          <div className="pt-3 flex flex-wrap gap-2 items-center">
            {cameraOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSetCameraMode(opt.id)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  cameraMode === opt.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 3: Roster & Phonics Configuration */}
        {activeTab === 'roster' && (
          <div className="pt-3 space-y-3">
            {/* Phonics Category Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Word Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Student Roster Chips & Rename */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Students:</span>
              {students.map((student) => {
                const isActive = activeStudentId === student.id;
                return (
                  <div
                    key={student.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 border-cyan-500 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: student.color }}
                    />
                    {editingStudentId === student.id ? (
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={() => {
                          if (tempName.trim()) onUpdateStudentName(student.id, tempName.trim());
                          setEditingStudentId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (tempName.trim()) onUpdateStudentName(student.id, tempName.trim());
                            setEditingStudentId(null);
                          }
                        }}
                        className="w-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-1 py-0.5 rounded text-xs outline-none border border-cyan-500"
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => onSelectStudent(student.id)}
                        className="cursor-pointer hover:underline"
                        title="Click to control this student"
                      >
                        {student.name}
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setEditingStudentId(student.id);
                        setTempName(student.name);
                      }}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-[10px] ml-1 cursor-pointer"
                      title="Rename student"
                    >
                      ✏️
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
