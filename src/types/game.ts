/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 
  | 'IDLE'          // Free exploration / characters wandering or player controlling
  | 'SCANNING'      // UFO descended, sweeping scanning beam across terrain
  | 'CHASING'       // UFO chasing characters, students fleeing, jumping fences, hiding
  | 'BEAMING'       // UFO locks on a student, cyan beam gently lifts them
  | 'QUIZ'          // Reading / Phonics challenge open for the beamed student
  | 'CELEBRATING';  // Correct answer, student floats down with confetti

export type CameraMode = 
  | 'CHASE'         // Dynamic cinematic chase cam tracking the action
  | 'ORBIT'         // Free OrbitControls
  | 'PRESET_SCHOOL' // Focused view on School House & courtyard
  | 'PRESET_CAVE'   // Focused view on Crystal Cave & lanterns
  | 'PRESET_LAKE'   // Focused view on Turquoise Lake & bridge
  | 'PRESET_UFO';   // High angle looking down from UFO

export type ThemeMode = 'light' | 'dark';

export interface StudentData {
  id: string;
  name: string;
  color: string;       // Primary jacket color
  pantsColor: string;
  hatColor: string;
  hairColor: string;
  isPlayerControlled?: boolean;
  state: 'idle' | 'running' | 'jumping' | 'crouching' | 'beamed';
  position: [number, number, number];
  rotation: number;
}

export interface PhonicsCard {
  id: string;
  word: string;
  category: 'Animals' | 'Nature' | 'School' | 'Short Vowels' | 'Fun Words';
  clue: string;
  missingIndex: number; // Index in the word that is missing
  phonicsTip: string;
  options: string[];    // Multiple choice letter options
  iconSymbol: string;
}

export interface GameSettings {
  difficulty: 'early' | 'phonics' | 'advanced';
  soundEnabled: boolean;
  chaseSpeed: 'relaxed' | 'normal' | 'speedy';
  showNameTags: boolean;
  selectedCharacterId: string;
}
