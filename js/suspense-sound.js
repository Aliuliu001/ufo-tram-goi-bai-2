/**
 * Suspense Sound System
 * Web Audio API procedural audio - ambient music + SFX
 * Separated controls for background music and sound effects
 */

let context;
let chaseTimer;
let riser;
let musicEnabled = true;
let sfxEnabled = true;
let ambientOsc = null;
let ambientGain = null;

/**
 * Get or create AudioContext
 */
function audio() {
  context ||= new AudioContext();
  if (context.state === 'suspended') context.resume();
  return context;
}

/**
 * Play a tone
 */
function tone(freq, at, duration, type = 'sine', volume = .05, filterFrequency = 0) {
  if (!sfxEnabled) return;
  const c = audio();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(volume, at);
  g.gain.exponentialRampToValueAtTime(.001, at + duration);
  
  if (filterFrequency) {
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(filterFrequency, at);
    o.connect(f).connect(g).connect(c.destination);
  } else {
    o.connect(g).connect(c.destination);
  }
  
  o.start(at);
  o.stop(at + duration + .02);
}

/**
 * Kick drum sound
 */
function kick(at, power = .14) {
  if (!sfxEnabled) return;
  const c = audio();
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.setValueAtTime(165, at);
  o.frequency.exponentialRampToValueAtTime(38, at + .13);
  g.gain.setValueAtTime(power, at);
  g.gain.exponentialRampToValueAtTime(.001, at + .15);
  o.connect(g).connect(c.destination);
  o.start(at);
  o.stop(at + .16);
}

/**
 * Set music enabled/disabled
 */
export function setMusicEnabled(value) {
  musicEnabled = value;
  if (!musicEnabled) {
    stopAmbient();
  } else {
    startAmbient();
  }
  saveAudioPreferences();
}

/**
 * Set SFX enabled/disabled
 */
export function setSfxEnabled(value) {
  sfxEnabled = value;
  if (!sfxEnabled) stopChase();
  saveAudioPreferences();
}

/**
 * Legacy function for backward compatibility
 */
export function setSoundEnabled(value) {
  setMusicEnabled(value);
  setSfxEnabled(value);
}

/**
 * Start ambient background music
 */
export function startAmbient() {
  // Disabled: ambient drone was too annoying
  // Keep this function for backward compatibility but do nothing
  stopAmbient();
}

/**
 * Stop ambient music
 */
export function stopAmbient() {
  if (ambientOsc) {
    const c = audio();
    const now = c.currentTime;
    
    if (ambientGain) {
      ambientGain.gain.cancelScheduledValues(now);
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, now);
      ambientGain.gain.linearRampToValueAtTime(0, now + 1); // Fade out
    }
    
    ambientOsc.forEach(osc => {
      try {
        osc.stop(now + 1.1);
      } catch {}
    });
    
    setTimeout(() => {
      ambientOsc = null;
      ambientGain = null;
    }, 1200);
  }
}

/**
 * Start chase sequence (scan mode)
 */
export function startChase(seconds = 6) {
  stopChase();
  if (!sfxEnabled) return;
  
  const c = audio();
  const start = c.currentTime;
  let step = 0;
  
  // Rising tension sound
  const rise = c.createOscillator();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  
  rise.type = 'sawtooth';
  rise.frequency.setValueAtTime(100, start);
  rise.frequency.exponentialRampToValueAtTime(1250, start + seconds);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(220, start);
  filter.frequency.exponentialRampToValueAtTime(5100, start + seconds);
  
  gain.gain.setValueAtTime(.018, start);
  gain.gain.linearRampToValueAtTime(.13, start + Math.max(1, seconds - .25));
  gain.gain.linearRampToValueAtTime(.001, start + seconds);
  
  rise.connect(filter).connect(gain).connect(c.destination);
  rise.start(start);
  rise.stop(start + seconds + .05);
  riser = rise;
  
  // Rhythmic elements
  const bass = [55, 55, 65.41, 73.42, 82.41, 73.42, 98, 110];
  const lead = [220, 261.63, 329.63, 392, 440, 523.25];
  
  chaseTimer = setInterval(() => {
    const p = step / Math.max(1, seconds * 11);
    const now = c.currentTime;
    const fast = p > .58;
    
    kick(now, .09 + p * .12);
    tone(bass[step % bass.length] * (p > .72 ? 1.25 : 1), now, .11, 'sawtooth', .1 + p * .04, 900 + p * 2200);
    
    if (step % (fast ? 2 : 4) === 0) {
      tone(lead[Math.floor(step / 2) % lead.length], now, .12, 'square', .055 + p * .05, 1800 + p * 2200);
    }
    
    if (step % 2 === 0) {
      tone(780 + p * 920, now, .045, 'triangle', .04 + p * .04);
    }
    
    if (p > .78) {
      tone(1300 + p * 1200, now, .025, 'sine', .035);
    }
    
    step++;
  }, 72);
}

/**
 * Ping sound during target scan
 */
export function ping(progress = 0) {
  if (!sfxEnabled) return;
  const c = audio();
  const now = c.currentTime;
  tone(520 + progress * 1200, now, .12, 'triangle', .11);
  tone(150 + progress * 180, now, .1, 'sawtooth', .045, 1200);
}

/**
 * Stop chase sequence
 */
export function stopChase() {
  if (chaseTimer) {
    clearInterval(chaseTimer);
    chaseTimer = null;
  }
  try {
    riser?.stop();
  } catch {}
  riser = null;
}

/**
 * Reveal sound (result announcement)
 */
export function reveal() {
  stopChase();
  if (!sfxEnabled) return;
  
  const c = audio();
  [293.66, 369.99, 440, 587.33, 739.99].forEach((f, i) => 
    tone(f, c.currentTime + i * .07, .48, 'triangle', .12)
  );
  kick(c.currentTime, .2);
  tone(320, c.currentTime, .76, 'sine', .08);
}

/**
 * Load audio preferences from localStorage
 */
export function loadAudioPreferences() {
  try {
    const prefs = JSON.parse(localStorage.getItem('ufo-preferences') || '{}');
    musicEnabled = prefs.musicEnabled !== false;
    sfxEnabled = prefs.sfxEnabled !== false;
    
    if (musicEnabled) {
      startAmbient();
    }
    
    return { musicEnabled, sfxEnabled };
  } catch {
    return { musicEnabled: true, sfxEnabled: true };
  }
}

/**
 * Save audio preferences to localStorage
 */
function saveAudioPreferences() {
  try {
    const prefs = JSON.parse(localStorage.getItem('ufo-preferences') || '{}');
    prefs.musicEnabled = musicEnabled;
    prefs.sfxEnabled = sfxEnabled;
    localStorage.setItem('ufo-preferences', JSON.stringify(prefs));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Get current audio state
 */
export function getAudioState() {
  return { musicEnabled, sfxEnabled };
}
