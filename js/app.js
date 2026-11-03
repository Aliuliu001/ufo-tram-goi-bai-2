import { createRound } from './game-engine.js';
import { createWorld3D } from './scene3d.js';
import { chooseScanWinners, clampPickCount, scanTargetAt } from './scan-round.js';
import { startChase, stopChase, ping, reveal, setMusicEnabled, setSfxEnabled, loadAudioPreferences, getAudioState } from './suspense-sound.js';
import { UFO_SKINS, CREW_SKINS, getUfoSkin, getCrewSkin, loadSkinPreferences, saveSkinPreferences } from './skin-catalog.js';
import { loadClasses, saveClasses, getActiveClass, createClass, updateClass, deleteClass, duplicateClass, exportClassesJSON, importClassesJSON, importClassesCSV } from './class-manager.js';
import { mountImageLibrary } from './image-library.js';
import { mountBackupControls } from './game-backup.js';
import { mountQuestionBank, runLearningActivity } from './question-bank.js';

const DEFAULT_STUDENTS = ['An NhiÃªn', 'Báº£o Ngá»c', 'Gia HÃ¢n', 'Minh Khang', 'Thanh Vy'];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const el = {
  call: $('#call-button'),
  reset: $('#reset-button'),
  name: $('#student-name'),
  status: $('#student-status'),
  list: $('#student-list'),
  progress: $('#progress-fill'),
  progressLabel: $('#progress-label'),
  mission: $('#mission-text'),
  classSelector: $('#class-selector'),
  settings: $('#settings-dialog'),
  settingsOpen: $('#settings-button'),
  classTab: $('#class-tab'),
  studentTab: $('#student-tab'),
  imagesTab: $('#images-tab'),
  questionsTab: $('#questions-tab'),
  classManagement: $('#class-management'),
  input: $('#students-input'),
  save: $('#save-students-button'),
  exportBtn: $('#export-classes'),
  importBtn: $('#import-classes'),
  importFile: $('#import-file'),
  skinDialog: $('#skin-dialog'),
  skinOpen: $('#skin-button'),
  ufoSkinName: $('#ufo-skin-name'),
  crewSkinName: $('#crew-skin-name'),
  ufoSkinGrid: $('#ufo-skin-grid'),
  crewSkinGrid: $('#crew-skin-grid'),
  music: $('#music-button'),
  sound: $('#sound-button'),
  motion: $('#motion-button'),
  pick: $('#pick-count'),
  dec: $('#pick-dec'),
  inc: $('#pick-inc'),
  repeat: $('#no-repeat'),
  timer: $('#scan-timer'),
  title: $('#scan-title'),
  help: $('#scan-help'),
  crewClassName: $('#crew-class-name'),
  crewCount: $('#crew-count'),
  enableAll: $('#enable-all')
};

let students = [];
let round = createRound(students);
let world = null;
let pickCount = 1;
let noRepeat = true;
let seconds = 6;
let scanning = false;
let scanInterval = null;
let restingStudents = new Set();
let reduceMotion = false;

// Class management
let classData = loadClasses();
let activeClass = getActiveClass(classData.classes, classData.activeClassId);
students = [...activeClass.students];

// Load preferences
const skinPrefs = loadSkinPreferences();
let ufoSkin = getUfoSkin(skinPrefs.ufoSkinId);
let crewSkin = getCrewSkin(skinPrefs.crewSkinId);

const audioPrefs = loadAudioPreferences();
let musicOn = audioPrefs.musicEnabled;
let sfxOn = audioPrefs.sfxEnabled;

try { reduceMotion = localStorage.getItem('ufo-reduce-motion') === 'true'; } catch {}
document.documentElement.dataset.reduceMotion = String(reduceMotion);
const renderMotionButton = () => {
  if (!el.motion) return;
  el.motion.textContent = reduceMotion ? 'â' : 'â§';
  el.motion.setAttribute('aria-pressed', String(reduceMotion));
  el.motion.setAttribute('aria-label', reduceMotion ? 'Äang giáº£m hiá»u á»©ng, báº¥m Äá» báº­t láº¡i' : 'Báº­t cháº¿ Äá» giáº£m hiá»u á»©ng');
};
renderMotionButton();

function loadStudents() {
  try {
    const x = JSON.parse(localStorage.getItem('ufo-students'));
    return Array.isArray(x) && x.length ? x : DEFAULT_STUDENTS;
  } catch {
    return DEFAULT_STUDENTS;
  }
}

function saveStudents() {
  try {
    localStorage.setItem('ufo-students', JSON.stringify(students));
  } catch {}
}

function available() {
  const ready = students.filter(name => !restingStudents.has(name));
  return noRepeat ? round.remaining.filter(name => ready.includes(name)) : ready;
}

function render() {
  const total = students.length;
  const done = round.called.length;
  const ready = available().length;
  
  pickCount = clampPickCount(pickCount, ready);
  
  el.progress.style.width = `${total ? done / total * 100 : 0}%`;
  el.progressLabel.textContent = `${done} / ${total} há»c sinh`;
  el.mission.textContent = ready ? `CÃ²n ${ready} báº¡n Äang chá» tÃ­n hiá»u` : 'ÄÃ£ hoÃ n thÃ nh lÆ°á»£t gá»i bÃ i!';
  
  el.pick.textContent = pickCount;
  el.dec.disabled = scanning || pickCount <= 1;
  el.inc.disabled = scanning || pickCount >= Math.max(1, ready);
  el.call.disabled = scanning || !ready;
  el.call.textContent = scanning ? 'ð Äang dÃ² tÃ¬mâ¦' : ready ? 'ð Báº¯t Äáº§u dÃ² tÃ¬m' : 'â ÄÃ£ gá»i Äá»§ lÆ°á»£t';
  
  // Render student list - use textContent to avoid XSS
  el.list.innerHTML = '';
  students.forEach(name => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `student-chip ${noRepeat && round.called.includes(name) ? 'called' : ''} ${restingStudents.has(name) ? 'resting' : ''}`;
    chip.textContent = `${restingStudents.has(name) ? 'â' : (noRepeat && round.called.includes(name) ? 'â' : 'â¦')} ${name}`;
    chip.disabled = scanning;
    chip.onclick = () => {
      if (restingStudents.has(name)) restingStudents.delete(name); else restingStudents.add(name);
      world?.setStudents(available());
      render();
    };
    el.list.appendChild(chip);
  });
  if (el.crewClassName) el.crewClassName.textContent = activeClass.name;
  if (el.crewCount) el.crewCount.textContent = `${students.length - restingStudents.size} báº¡n sáºµn sÃ ng`;
  
  el.help.textContent = `Nháº¥n Space Äá» báº¯t Äáº§u Â· DÃ² tÃ¬m trong ${seconds} giÃ¢y Â· CÆ¡ há»i nhÆ° nhau cho ${ready} há»c sinh.`;
  
  // Disable skin button while scanning
  if (el.skinOpen) {
    el.skinOpen.disabled = scanning;
  }
}

function setTimer(left, mode = 'Sáº´N SÃNG DÃ TÃM') {
  el.timer.innerHTML = `${left} GIÃY<br><small>${mode}</small>`;
}

function startScan() {
  if (scanning || !available().length) return;
  
  scanning = true;
  document.querySelector('.stage').classList.add('scanning');
  el.name.closest('.world-card').classList.add('scanning');
  
  const pool = available();
  const winners = chooseScanWinners(pool, pickCount);
  let remaining = seconds;
  let tick = 0;
  
  el.name.textContent = 'ÄANG DÃ TÃMâ¦';
  el.status.textContent = 'UFO chá»p sÃ¡ng vÃ  Äá»i má»¥c tiÃªu. Káº¿t quáº£ ÄÆ°á»£c giá»¯ bÃ­ máº­t Äáº¿n giÃ¢y cuá»i.';
  el.title.textContent = 'UFO Äang quÃ©t khu phá»';
  
  world?.beginScan(pool);
  render();
  setTimer(remaining, 'ÄANG DÃ TÃM');
  startChase(seconds);
  
  scanInterval = setInterval(() => {
    tick++;
    remaining--;
    
    const target = scanTargetAt(pool, tick, .55);
    const intensity = 1 - remaining / seconds;
    
    world?.scanTarget(target, intensity);
    ping(intensity);
    
    el.name.textContent = target;
    el.name.classList.remove('scan-zoom');
    void el.name.offsetWidth;
    el.name.classList.add('scan-zoom');
    
    el.status.textContent = `Äang quÃ©t tÃ­n hiá»u quanh ${target}â¦`;
    setTimer(Math.max(0, remaining), 'ÄANG DÃ TÃM');
    
    if (remaining <= 0) {
      clearInterval(scanInterval);
      finishScan(winners);
    }
  }, 650);
}

function finishScan(winners) {
  stopChase();
  document.querySelector('.stage').classList.remove('scanning');
  el.name.closest('.world-card').classList.remove('scanning');
  
  el.name.textContent = 'ÄANG KHÃA TÃN HIá»Uâ¦';
  el.status.textContent = 'UFO ÄÃ£ khÃ³a káº¿t quáº£. TÃªn sáº½ ÄÆ°á»£c cÃ´ng bá» sau khi hÃºt xong.';
  
  world?.finishScan(winners, () => {
    winners.forEach(x => {
      if (noRepeat && !round.called.includes(x)) {
        round.called.push(x);
      }
    });
    
    round.remaining = students.filter(x => !round.called.includes(x));
    round.isComplete = round.remaining.length === 0;
    scanning = false;
    
    world?.setStudents(students.filter(x => !noRepeat || !round.called.includes(x)));
    
    el.name.textContent = winners.join(' Â· ');
    el.status.textContent = 'ÄÃ£ lÃªn tÃ u thÃ nh cÃ´ng!';
    reveal();
    setTimer(seconds, 'HOÃN THÃNH NHIá»M Vá»¤');
    el.title.textContent = 'ÄÃ£ cÃ´ng bá» káº¿t quáº£';
    render();
    runLearningActivity(activeClass.id, winners, () => {
      el.status.textContent = 'ÄÃ£ hoÃ n thÃ nh nhiá»m vá»¥ há»c táº­p. UFO tháº£ phi hÃ nh gia xuá»ng Äá» tiáº¿p tá»¥c cháº¡y!';
    });
  });
}

function reset() {
  clearInterval(scanInterval);
  stopChase();
  document.querySelector('.stage').classList.remove('scanning');
  el.name.closest('.world-card').classList.remove('scanning');
  
  scanning = false;
  round = createRound(students);
  
  world?.setStudents(available());
  world?.cancelScan();
  
  el.name.textContent = 'Báº¥m Äá» gá»i há»c sinh';
  el.status.textContent = 'UFO Äang tuáº§n tra. KÃ©o khung 3D Äá» xoay gÃ³c nhÃ¬n.';
  setTimer(seconds);
  render();
}

function selectUfoSkin(id) {
  ufoSkin = getUfoSkin(id);
  document.documentElement.style.setProperty('--accent', ufoSkin.accent);
  document.documentElement.style.setProperty('--accent-2', ufoSkin.accent2);
  
  if (el.ufoSkinName) {
    el.ufoSkinName.textContent = ufoSkin.name;
  }
  
  world?.setSkin(ufoSkin);
  saveSkinPreferences(ufoSkin.id, crewSkin.id);
  
  renderUfoSkinGrid();
}

function selectCrewSkin(id) {
  crewSkin = getCrewSkin(id);
  
  if (el.crewSkinName) {
    el.crewSkinName.textContent = crewSkin.name;
  }
  
  world?.setCharacterSkin(crewSkin.id);
  saveSkinPreferences(ufoSkin.id, crewSkin.id);
  
  renderCrewSkinGrid();
}

function renderUfoSkinGrid() {
  if (!el.ufoSkinGrid) return;
  
  el.ufoSkinGrid.innerHTML = '';
  UFO_SKINS.forEach(skin => {
    const btn = document.createElement('button');
    btn.className = `skin-option ${skin.id === ufoSkin.id ? 'selected' : ''}`;
    btn.type = 'button';
    btn.dataset.skin = skin.id;
    btn.style.setProperty('--skin-a', skin.accent);
    btn.style.setProperty('--skin-b', skin.accent2);
    
    const preview = document.createElement('span');
    preview.className = 'skin-preview';
    preview.textContent = 'ð¸';
    
    const name = document.createElement('strong');
    name.textContent = skin.name;
    
    btn.appendChild(preview);
    btn.appendChild(name);
    el.ufoSkinGrid.appendChild(btn);
  });
}

function renderCrewSkinGrid() {
  if (!el.crewSkinGrid) return;
  
  el.crewSkinGrid.innerHTML = '';
  CREW_SKINS.forEach(skin => {
    const btn = document.createElement('button');
    btn.className = `skin-option ${skin.id === crewSkin.id ? 'selected' : ''}`;
    btn.type = 'button';
    btn.dataset.skin = skin.id;
    
    const preview = document.createElement('span');
    preview.className = 'skin-preview';
    preview.textContent = skin.id === 'astronaut' ? 'ð¨âð' : 
                          skin.id === 'animals' ? 'ð±' : 
                          skin.id === 'forest' ? 'ð³' : 'ð¤';
    
    const nameEl = document.createElement('strong');
    nameEl.textContent = skin.name;
    
    const desc = document.createElement('small');
    desc.textContent = skin.description;
    
    btn.appendChild(preview);
    btn.appendChild(nameEl);
    btn.appendChild(desc);
    el.crewSkinGrid.appendChild(btn);
  });
}

// Event handlers
el.call.onclick = startScan;
el.reset.onclick = reset;

// Class management functions
function renderClassSelector() {
  if (!el.classSelector) return;
  
  el.classSelector.innerHTML = '';
  classData.classes.forEach(cls => {
    const option = document.createElement('option');
    option.value = cls.id;
    option.textContent = cls.name;
    option.selected = cls.id === classData.activeClassId;
    el.classSelector.appendChild(option);
  });
}

function switchClass(classId) {
  classData.activeClassId = classId;
  activeClass = getActiveClass(classData.classes, classId);
  students = [...activeClass.students];
  restingStudents = new Set();
  
  // Update lastUsed
  classData.classes = updateClass(classData.classes, classId, {});
  saveClasses(classData.classes, classData.activeClassId);
  
  // Reset round
  round = createRound(students);
  world?.setStudents(students);
  
  render();
  renderClassSelector();
}

function renderClassManagement() {
  if (!el.classManagement) return;
  
  el.classManagement.innerHTML = '';
  
  const header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px';
  
  const title = document.createElement('h3');
  title.textContent = 'Quáº£n lÃ½ lá»p';
  title.style.cssText = 'margin:0;font-size:16px;font-weight:600';
  
  const addBtn = document.createElement('button');
  addBtn.className = 'secondary-button';
  addBtn.textContent = '+ ThÃªm lá»p';
  addBtn.onclick = () => {
    const name = prompt('TÃªn lá»p má»i:', `Lá»p ${classData.classes.length + 1}`);
    if (name && name.trim()) {
      const newClass = createClass(name.trim(), []);
      classData.classes.push(newClass);
      saveClasses(classData.classes, classData.activeClassId);
      renderClassManagement();
      renderClassSelector();
    }
  };
  
  header.appendChild(title);
  header.appendChild(addBtn);
  el.classManagement.appendChild(header);
  
  // Class list
  classData.classes.forEach(cls => {
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid var(--line);border-radius:8px;padding:12px;margin-bottom:12px;background:var(--panel)';
    
    const cardHeader = document.createElement('div');
    cardHeader.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px';
    
    const cardTitle = document.createElement('strong');
    cardTitle.textContent = cls.name;
    cardTitle.style.cssText = 'font-size:14px';
    
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:6px';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'tiny-button';
    editBtn.textContent = 'âï¸';
    editBtn.title = 'Äá»i tÃªn';
    editBtn.onclick = () => {
      const newName = prompt('TÃªn lá»p:', cls.name);
      if (newName && newName.trim()) {
        classData.classes = updateClass(classData.classes, cls.id, { name: newName.trim() });
        saveClasses(classData.classes, classData.activeClassId);
        renderClassManagement();
        renderClassSelector();
      }
    };
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'tiny-button';
    copyBtn.textContent = 'ð';
    copyBtn.title = 'Sao chÃ©p';
    copyBtn.onclick = () => {
      classData.classes = duplicateClass(classData.classes, cls.id);
      saveClasses(classData.classes, classData.activeClassId);
      renderClassManagement();
      renderClassSelector();
    };
    
    const delBtn = document.createElement('button');
    delBtn.className = 'tiny-button';
    delBtn.textContent = 'ðï¸';
    delBtn.title = 'XÃ³a';
    delBtn.disabled = classData.classes.length <= 1;
    delBtn.onclick = () => {
      if (confirm(`XÃ³a lá»p "${cls.name}"?`)) {
        classData.classes = deleteClass(classData.classes, cls.id);
        if (classData.activeClassId === cls.id) {
          classData.activeClassId = classData.classes[0].id;
          switchClass(classData.activeClassId);
        }
        saveClasses(classData.classes, classData.activeClassId);
        renderClassManagement();
        renderClassSelector();
      }
    };
    
    actions.appendChild(editBtn);
    actions.appendChild(copyBtn);
    actions.appendChild(delBtn);
    
    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(actions);
    
    const studentCount = document.createElement('small');
    studentCount.textContent = `${cls.students.length} há»c sinh`;
    studentCount.style.cssText = 'color:var(--muted);font-size:12px';
    
    card.appendChild(cardHeader);
    card.appendChild(studentCount);
    el.classManagement.appendChild(card);
  });
  
  // Import/Export section
  const ioSection = document.createElement('div');
  ioSection.style.cssText = 'margin-top:20px;padding-top:20px;border-top:1px solid var(--line)';
  
  const ioTitle = document.createElement('h3');
  ioTitle.textContent = 'Sao lÆ°u / KhÃ´i phá»¥c';
  ioTitle.style.cssText = 'margin:0 0 12px;font-size:14px;font-weight:600';
  
  const ioButtons = document.createElement('div');
  ioButtons.style.cssText = 'display:flex;gap:8px';
  
  const exportBtn = document.createElement('button');
  exportBtn.className = 'secondary-button';
  exportBtn.textContent = 'ð¥ Xuáº¥t JSON';
  exportBtn.onclick = () => {
    const json = exportClassesJSON(classData.classes);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ufo-classes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const importBtn = document.createElement('button');
  importBtn.className = 'secondary-button';
  importBtn.textContent = 'ð¤ Nháº­p JSON';
  importBtn.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          const result = importClassesJSON(ev.target.result);
          if (result.success) {
            if (confirm(`Nháº­p ${result.classes.length} lá»p? (Sáº½ thay tháº¿ dá»¯ liá»u hiá»n táº¡i)`)) {
              classData.classes = result.classes;
              classData.activeClassId = result.classes[0].id;
              saveClasses(classData.classes, classData.activeClassId);
              switchClass(classData.activeClassId);
              renderClassManagement();
            }
          } else {
            alert(`Lá»i: ${result.error}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  ioButtons.appendChild(exportBtn);
  ioButtons.appendChild(importBtn);
  
  ioSection.appendChild(ioTitle);
  ioSection.appendChild(ioButtons);
  el.classManagement.appendChild(ioSection);
}

// Event handlers
el.call.onclick = startScan;
el.reset.onclick = reset;

el.dec.onclick = () => {
  pickCount--;
  render();
};

el.inc.onclick = () => {
  pickCount++;
  render();
};

el.repeat.onclick = () => {
  noRepeat = !noRepeat;
  el.repeat.classList.toggle('on', noRepeat);
  el.repeat.setAttribute('aria-pressed', noRepeat);
  reset();
};

if (el.enableAll) el.enableAll.onclick = () => {
  restingStudents = new Set();
  world?.setStudents(available());
  render();
};

$$('[data-seconds]').forEach(b => {
  b.onclick = () => {
    seconds = Number(b.dataset.seconds);
    $$('[data-seconds]').forEach(x => x.classList.toggle('selected', x === b));
    setTimer(seconds);
    render();
  };
});

$$('[data-camera]').forEach(b => {
  b.onclick = () => {
    $$('[data-camera]').forEach(x => x.classList.toggle('selected', x === b));
    world?.setCameraMode(b.dataset.camera);
  };
});

// Class selector
if (el.classSelector) {
  el.classSelector.onchange = () => {
    switchClass(el.classSelector.value);
  };
}

// Settings tabs
if (el.classTab && el.studentTab) {
  const switchSettingsPanel = panel => {
    [['class', el.classTab], ['students', el.studentTab], ['images', el.imagesTab], ['questions', el.questionsTab]].forEach(([name, button]) => {
      if (!button) return;
      const active = name === panel;
      button.style.borderBottomColor = active ? 'var(--accent)' : 'transparent';
      button.style.color = active ? 'var(--text)' : 'var(--muted)';
    });
    $('#class-management').style.display = panel === 'class' ? 'block' : 'none';
    $('#student-list-editor').style.display = panel === 'students' ? 'block' : 'none';
    $('#image-library').style.display = panel === 'images' ? 'block' : 'none';
    $('#backup-library').style.display = panel === 'images' ? 'block' : 'none';
    $('#question-bank').style.display = panel === 'questions' ? 'block' : 'none';
  };
  el.classTab.onclick = () => {
    switchSettingsPanel('class');
  };
  
  el.studentTab.onclick = () => {
    switchSettingsPanel('students');
    el.input.value = students.join('\n');
  };
  el.imagesTab.onclick = () => switchSettingsPanel('images');
  el.questionsTab.onclick = () => switchSettingsPanel('questions');
  mountImageLibrary($('#image-library'));
  mountBackupControls($('#backup-library'));
  mountQuestionBank($('#question-bank'));
}

el.settingsOpen.onclick = () => {
  el.input.value = students.join('\n');
  renderClassManagement();
  
  // Reset to class tab
  if (el.classTab) {
    switchSettingsPanel('class');
  }
  
  el.settings.showModal();
};

el.save.onclick = e => {
  e.preventDefault();
  const next = el.input.value.split('\n').map(x => x.trim()).filter(Boolean);
  if (next.length) {
    students = [...new Set(next)];
    
    // Update active class
    classData.classes = updateClass(classData.classes, activeClass.id, { students });
    activeClass.students = students;
    saveClasses(classData.classes, classData.activeClassId);
    
    el.settings.close();
    reset();
  }
};

el.skinOpen.onclick = () => {
  renderUfoSkinGrid();
  renderCrewSkinGrid();
  el.skinDialog.showModal();
};

if (el.ufoSkinGrid) {
  el.ufoSkinGrid.onclick = e => {
    const b = e.target.closest('[data-skin]');
    if (b) {
      selectUfoSkin(b.dataset.skin);
    }
  };
}

if (el.crewSkinGrid) {
  el.crewSkinGrid.onclick = e => {
    const b = e.target.closest('[data-skin]');
    if (b) {
      selectCrewSkin(b.dataset.skin);
    }
  };
}

if (el.music) {
  el.music.onclick = () => {
    musicOn = !musicOn;
    setMusicEnabled(musicOn);
    el.music.textContent = musicOn ? 'ðµ' : 'ð';
    el.music.setAttribute('aria-label', musicOn ? 'Táº¯t nháº¡c ná»n' : 'Báº­t nháº¡c ná»n');
  };
}

if (el.sound) {
  el.sound.onclick = () => {
    sfxOn = !sfxOn;
    setSfxEnabled(sfxOn);
    el.sound.textContent = sfxOn ? 'ð' : 'ð';
    el.sound.setAttribute('aria-label', sfxOn ? 'Táº¯t hiá»u á»©ng Ã¢m' : 'Báº­t hiá»u á»©ng Ã¢m');
  };
}

if (el.motion) {
  el.motion.onclick = () => {
    reduceMotion = !reduceMotion;
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
    try { localStorage.setItem('ufo-reduce-motion', String(reduceMotion)); } catch {}
    renderMotionButton();
  };
}

window.addEventListener('keydown', e => {
  if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    startScan();
  }
});

// Initialize
renderClassSelector();
selectUfoSkin(ufoSkin.id);
selectCrewSkin(crewSkin.id);
setTimer(seconds);
render();

if (el.music) {
  el.music.textContent = musicOn ? 'ðµ' : 'ð';
  el.music.setAttribute('aria-label', musicOn ? 'Táº¯t nháº¡c ná»n' : 'Báº­t nháº¡c ná»n');
}

if (el.sound) {
  el.sound.textContent = sfxOn ? 'ð' : 'ð';
  el.sound.setAttribute('aria-label', sfxOn ? 'Táº¯t hiá»u á»©ng Ã¢m' : 'Báº­t hiá»u á»©ng Ã¢m');
}

createWorld3D($('#world3d'), $('#world-labels')).then(x => {
  world = x;
  world.setStudents(students);
  world.setSkin(ufoSkin);
  world.setCharacterSkin(crewSkin.id);
  el.name.textContent = 'Báº¥m Äá» gá»i há»c sinh';
  el.status.textContent = 'UFO Äang tuáº§n tra. KÃ©o khung 3D Äá» xoay gÃ³c nhÃ¬n.';
}).catch(() => {
  el.name.textContent = 'KhÃ´ng má» ÄÆ°á»£c tháº¿ giá»i 3D';
});
