/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhonicsCard } from '../types/game';

export const PHONICS_CARDS: PhonicsCard[] = [
  {
    id: 'cat',
    word: 'CAT',
    category: 'Animals',
    clue: 'A furry pet that says meow and purrs softly!',
    missingIndex: 1, // 'A'
    phonicsTip: 'Short /æ/ sound as in Apple and Hat.',
    options: ['A', 'E', 'O', 'U'],
    iconSymbol: '🐱'
  },
  {
    id: 'frog',
    word: 'FROG',
    category: 'Animals',
    clue: 'A green hopper that swims in the turquoise pond!',
    missingIndex: 2, // 'O'
    phonicsTip: 'Short /ɒ/ sound as in Pond and Hop.',
    options: ['O', 'A', 'I', 'U'],
    iconSymbol: '🐸'
  },
  {
    id: 'star',
    word: 'STAR',
    category: 'Nature',
    clue: 'Shines brightly up in the clear night sky!',
    missingIndex: 2, // 'A'
    phonicsTip: 'R-controlled vowel /ɑːr/ as in Park and Far.',
    options: ['A', 'E', 'I', 'Y'],
    iconSymbol: '⭐'
  },
  {
    id: 'tree',
    word: 'TREE',
    category: 'Nature',
    clue: 'Has tall wooden branches, green leaves, and roots in the grass.',
    missingIndex: 2, // 'E'
    phonicsTip: 'Long /iː/ vowel blend made by "EE"!',
    options: ['E', 'O', 'A', 'U'],
    iconSymbol: '🌳'
  },
  {
    id: 'book',
    word: 'BOOK',
    category: 'School',
    clue: 'Open its colorful pages to read exciting stories in class!',
    missingIndex: 1, // 'O'
    phonicsTip: 'The double "OO" makes the short /ʊ/ sound as in Look.',
    options: ['O', 'A', 'E', 'I'],
    iconSymbol: '📖'
  },
  {
    id: 'bell',
    word: 'BELL',
    category: 'School',
    clue: 'Rings loud and joyful at the top of the school tower!',
    missingIndex: 1, // 'E'
    phonicsTip: 'Short /ɛ/ vowel sound as in Bed and Pen.',
    options: ['E', 'A', 'I', 'O'],
    iconSymbol: '🔔'
  },
  {
    id: 'sun',
    word: 'SUN',
    category: 'Nature',
    clue: 'Gives warm golden daylight to the whole meadow!',
    missingIndex: 1, // 'U'
    phonicsTip: 'Short /ʌ/ vowel sound as in Cup and Run.',
    options: ['U', 'A', 'O', 'I'],
    iconSymbol: '☀️'
  },
  {
    id: 'gem',
    word: 'GEM',
    category: 'Fun Words',
    clue: 'A glowing purple crystal found inside the magical cave!',
    missingIndex: 1, // 'E'
    phonicsTip: 'Soft "G" sounding like /dʒ/ followed by short /ɛ/.',
    options: ['E', 'A', 'O', 'U'],
    iconSymbol: '💎'
  },
  {
    id: 'ship',
    word: 'SHIP',
    category: 'Fun Words',
    clue: 'A flying saucer or space vessel with rotating rings!',
    missingIndex: 2, // 'I'
    phonicsTip: 'Short /ɪ/ vowel sound as in Dig and Fish.',
    options: ['I', 'E', 'A', 'O'],
    iconSymbol: '🛸'
  },
  {
    id: 'jump',
    word: 'JUMP',
    category: 'Short Vowels',
    clue: 'What you do when leaping high over the garden fence!',
    missingIndex: 1, // 'U'
    phonicsTip: 'Short /ʌ/ vowel sound as in Duck and Fun.',
    options: ['U', 'O', 'A', 'I'],
    iconSymbol: '🦘'
  }
];

export const INITIAL_STUDENTS = [
  { id: 'kid-1', name: 'Maya', color: '#EF4444', pantsColor: '#1E3A8A', hatColor: '#F59E0B', hairColor: '#78350F' }, // Red jacket, yellow beanie
  { id: 'kid-2', name: 'Liam', color: '#3B82F6', pantsColor: '#374151', hatColor: '#10B981', hairColor: '#1F2937' }, // Blue jacket, green cap
  { id: 'kid-3', name: 'Sophie', color: '#EC4899', pantsColor: '#1E40AF', hatColor: '#8B5CF6', hairColor: '#D97706' }, // Pink sweater, purple beret
  { id: 'kid-4', name: 'Ethan', color: '#10B981', pantsColor: '#4B5563', hatColor: '#F97316', hairColor: '#451A03' }, // Emerald hoodie, orange beanie
  { id: 'kid-5', name: 'Chloe', color: '#F59E0B', pantsColor: '#1E3A8A', hatColor: '#EC4899', hairColor: '#92400E' }, // Amber jacket, magenta beanie
  { id: 'kid-6', name: 'Noah', color: '#8B5CF6', pantsColor: '#111827', hatColor: '#06B6D4', hairColor: '#1C1917' }, // Violet jacket, cyan cap
];
