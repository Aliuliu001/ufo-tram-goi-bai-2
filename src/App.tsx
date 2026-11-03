/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { soundManager } from './audio/soundManager';
import { ControlDock } from './components/ControlDock';
import { HeaderBar } from './components/HeaderBar';
import { ReadingClueModal } from './components/ReadingClueModal';
import { INITIAL_STUDENTS, PHONICS_CARDS } from './data/phonicsData';
import { GameEngine } from './three/gameEngine';
import { CameraMode, GameState, PhonicsCard, StudentData } from './types/game';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('ufo-theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [students, setStudents] = useState<StudentData[]>(INITIAL_STUDENTS as StudentData[]);
  const [activeStudentId, setActiveStudentId] = useState<string>(INITIAL_STUDENTS[0].id);
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [cameraMode, setCameraMode] = useState<CameraMode>('CHASE');
  const [manualControl, setManualControl] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scanSeconds, setScanSeconds] = useState<3 | 6 | 8 | 10>(6);
  const [scanSecondsLeft, setScanSecondsLeft] = useState<number>(6);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Phonics card state for when a student is beamed
  const [beamedStudent, setBeamedStudent] = useState<StudentData | null>(null);
  const [cardIndex, setCardIndex] = useState<number>(0);

  const categories = ['All', 'Animals', 'Nature', 'School', 'Short Vowels', 'Fun Words'];

  // Filtered cards based on teacher selection
  const availableCards = useMemo(() => {
    if (selectedCategory === 'All') return PHONICS_CARDS;
    return PHONICS_CARDS.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  const currentCard: PhonicsCard = availableCards[cardIndex % availableCards.length] || PHONICS_CARDS[0];

  useEffect(() => {
    if (!canvasMountRef.current) return;

    // Initialize 3D Engine once inside empty DOM container
    const engine = new GameEngine(canvasMountRef.current, students, {
      onStateChange: (state: GameState) => {
        setGameState(state);
        if (state === 'SCANNING') {
          soundManager.playUfoScan();
        } else if (state === 'BEAMING') {
          soundManager.startTractorBeam();
        } else if (state === 'IDLE' || state === 'CELEBRATING') {
          soundManager.stopTractorBeam();
        }
      },
      onStudentSelected: (student: StudentData) => {
        setBeamedStudent(student);
      },
      onBeamedComplete: (student: StudentData) => {
        setBeamedStudent(student);
        // Advance to a fresh card
        setCardIndex((prev) => (prev + 1) % availableCards.length);
      },
      onScanTick: setScanSecondsLeft,
    });

    engine.setTheme(theme);
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
      soundManager.stopTractorBeam();
    };
  }, []);

  // Update HTML class and 3D engine whenever theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('ufo-theme', theme);
    } catch {
      // Theme still works when browser storage is unavailable.
    }
    engineRef.current?.setTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    soundManager.playClick();
  };

  // Synchronize manual control toggle with 3D engine
  const handleToggleManualControl = (enabled: boolean) => {
    setManualControl(enabled);
    engineRef.current?.setPlayerManualControl(enabled);
    soundManager.playClick();
  };

  const handleStartChase = () => {
    setScanSecondsLeft(scanSeconds);
    engineRef.current?.startChase(undefined, scanSeconds);
    soundManager.playClick();
  }; 

  const handleSelectScanSeconds = (seconds: 3 | 6 | 8 | 10) => {
    setScanSeconds(seconds);
    setScanSecondsLeft(seconds);
    soundManager.playClick();
  };

  const handleSetCameraMode = (mode: CameraMode) => {
    setCameraMode(mode);
    engineRef.current?.setCameraMode(mode);
    soundManager.playClick();
  };

  const handleSelectStudent = (id: string) => {
    setActiveStudentId(id);
    engineRef.current?.setActiveStudent(id);
    soundManager.playClick();
  };

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.enabled = nextVal;
    if (!nextVal) {
      soundManager.stopTractorBeam();
    }
  };

  const handleUpdateStudentName = (id: string, newName: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  const handleQuizSuccess = () => {
    engineRef.current?.completeQuizSuccess();
    setBeamedStudent(null);
  };

  const isBusy = gameState === 'CHASING' || gameState === 'BEAMING' || gameState === 'SCANNING';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Bar Navigation */}
      <HeaderBar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSelectZone={handleSetCameraMode}
        onStartChase={handleStartChase}
        isBusy={isBusy}
      />

      {/* Classroom Reading Clue Modal (Shown during QUIZ phase) */}
      {gameState === 'QUIZ' && (
        <ReadingClueModal
          student={beamedStudent}
          card={currentCard}
          onSuccess={handleQuizSuccess}
        />
      )}

      {/* Viewport-first Unified Collapsible Bottom Dock */}
      <ControlDock
        theme={theme}
        gameState={gameState}
        cameraMode={cameraMode}
        manualControl={manualControl}
        soundEnabled={soundEnabled}
        scanSeconds={scanSeconds}
        scanSecondsLeft={scanSecondsLeft}
        students={students}
        activeStudentId={activeStudentId}
        selectedCategory={selectedCategory}
        categories={categories}
        onToggleTheme={handleToggleTheme}
        onStartChase={handleStartChase}
        onSetCameraMode={handleSetCameraMode}
        onToggleManualControl={handleToggleManualControl}
        onToggleSound={handleToggleSound}
        onSelectScanSeconds={handleSelectScanSeconds}
        onSelectStudent={handleSelectStudent}
        onSelectCategory={setSelectedCategory}
        onUpdateStudentName={handleUpdateStudentName}
      />
    </div>
  );
}
