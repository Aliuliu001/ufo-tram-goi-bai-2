/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundManager } from '../audio/soundManager';
import { PhonicsCard, StudentData } from '../types/game';

interface ReadingClueModalProps {
  student: StudentData | null;
  card: PhonicsCard;
  onSuccess: () => void;
  onNextWord?: () => void;
}

export const ReadingClueModal: React.FC<ReadingClueModalProps> = ({
  student,
  card,
  onSuccess,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const correctLetter = card.word[card.missingIndex];

  const handleSelect = (letter: string) => {
    setSelectedOption(letter);
    if (letter === correctLetter) {
      setIsAnswerCorrect(true);
      soundManager.playCorrect();
    } else {
      setIsAnswerCorrect(false);
      soundManager.playWrong();
    }
  };

  const handleBeamDown = () => {
    soundManager.playClick();
    onSuccess();
  };

  // Render the word with blanks
  const letters = card.word.split('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 transition-opacity">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl p-6 shadow-2xl text-slate-800 dark:text-white text-center transition-colors">
        {/* Glow Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl animate-bounce">🛸</span>
          <span className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">
            Classroom Reading Clue
          </span>
          <span className="text-3xl animate-bounce">✨</span>
        </div>

        {/* Selected Student Banner */}
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
          {student?.name || 'Classroom Champion'} is Beamed Up!
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
          Solve the reading clue to guide the student safely back to the schoolyard.
        </p>

        {/* Word Clue Card */}
        <div className="bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mb-5 shadow-inner">
          <div className="text-5xl mb-3">{card.iconSymbol}</div>
          <p className="text-base font-medium text-slate-700 dark:text-slate-200 italic mb-4">
            "{card.clue}"
          </p>

          {/* Word with Missing Letter Slot */}
          <div className="flex items-center justify-center gap-3 mb-2">
            {letters.map((char, idx) => {
              const isMissing = idx === card.missingIndex;
              const displayChar = isMissing
                ? isAnswerCorrect
                  ? correctLetter
                  : selectedOption || '?'
                : char;

              return (
                <div
                  key={idx}
                  className={`w-14 h-16 rounded-xl flex items-center justify-center text-3xl font-black transition-all ${
                    isMissing
                      ? isAnswerCorrect
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border-2 border-emerald-300 scale-105'
                        : selectedOption && !isAnswerCorrect
                        ? 'bg-rose-500 text-white border-2 border-rose-300'
                        : 'bg-cyan-500/15 border-2 border-dashed border-cyan-500 text-cyan-600 dark:text-cyan-300'
                      : 'bg-white dark:bg-slate-700/80 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 shadow-sm'
                  }`}
                >
                  {displayChar}
                </div>
              );
            })}
          </div>
          <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
            Category: {card.category}
          </div>
        </div>

        {/* Multiple Choice Letter Options */}
        <div className="mb-5">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Pick the missing letter:
          </p>
          <div className="grid grid-cols-4 gap-3">
            {card.options.map((option) => {
              const isChosen = selectedOption === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={isAnswerCorrect === true}
                  className={`h-13 text-2xl font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
                    isChosen && isAnswerCorrect
                      ? 'bg-emerald-500 text-white shadow-md'
                      : isChosen && !isAnswerCorrect
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-600 hover:border-cyan-500'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phonics Feedback / Tip */}
        {isAnswerCorrect === true && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 rounded-xl p-3 mb-4 text-emerald-800 dark:text-emerald-200 text-sm">
            <span className="font-bold">Fantastic! 🎉 </span>
            {card.phonicsTip}
          </div>
        )}

        {isAnswerCorrect === false && (
          <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 rounded-xl p-3 mb-4 text-rose-800 dark:text-rose-200 text-sm">
            Nice try! Listen closely to the sound and try another letter.
          </div>
        )}

        {/* Action Button */}
        {isAnswerCorrect ? (
          <button
            onClick={handleBeamDown}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Beam Down Safe & Sound</span>
            <span>🌈</span>
          </button>
        ) : (
          <button
            onClick={handleBeamDown}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 py-1 transition-colors cursor-pointer"
          >
            Skip clue & continue round
          </button>
        )}
      </div>
    </div>
  );
};
