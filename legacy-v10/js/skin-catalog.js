/**
 * UFO Skin Catalog
 * Defines all available UFO and crew skins
 */

export const UFO_SKINS = [
  {
    id: 'jupiter',
    name: 'Thám hiểm Sao Mộc',
    type: 'scout',
    accent: '#9af76d',
    accent2: '#6ddaf7'
  },
  {
    id: 'rescue',
    name: 'Đội cứu hộ Ngân Hà',
    type: 'rescue',
    accent: '#ffbd6a',
    accent2: '#ff6e9b'
  },
  {
    id: 'treasure',
    name: 'Thợ săn kho báu Vũ trụ',
    type: 'treasure',
    accent: '#d2a8ff',
    accent2: '#7ba9ff'
  },
  {
    id: 'storm',
    name: 'Chiến binh Bão Tố',
    type: 'storm',
    accent: '#ffcf58',
    accent2: '#ff7ca8'
  }
];

export const CREW_SKINS = [
  {
    id: 'astronaut',
    name: 'Phi hành gia',
    description: 'Bộ đồ vũ trụ chuẩn'
  },
  {
    id: 'animals',
    name: 'Biệt đội động vật',
    description: 'Tai, mõm và đuôi đáng yêu'
  },
  {
    id: 'forest',
    name: 'Tinh linh rừng xanh',
    description: 'Thân cây với tán lá xanh tươi'
  },
  {
    id: 'robots',
    name: 'Đội robot tự động',
    description: 'Thân kim loại với antenna'
  }
];

/**
 * Find UFO skin by ID
 * @param {string} id - Skin ID
 * @returns {object} UFO skin object
 */
export function getUfoSkin(id) {
  return UFO_SKINS.find(s => s.id === id) || UFO_SKINS[0];
}

/**
 * Find crew skin by ID
 * @param {string} id - Skin ID
 * @returns {object} Crew skin object
 */
export function getCrewSkin(id) {
  return CREW_SKINS.find(s => s.id === id) || CREW_SKINS[0];
}

/**
 * Load saved skin preferences from localStorage
 * @returns {object} { ufoSkinId, crewSkinId }
 */
export function loadSkinPreferences() {
  try {
    const prefs = JSON.parse(localStorage.getItem('ufo-preferences') || '{}');
    return {
      ufoSkinId: prefs.ufoSkinId || 'jupiter',
      crewSkinId: prefs.crewSkinId || 'astronaut'
    };
  } catch {
    return { ufoSkinId: 'jupiter', crewSkinId: 'astronaut' };
  }
}

/**
 * Save skin preferences to localStorage
 * @param {string} ufoSkinId - UFO skin ID
 * @param {string} crewSkinId - Crew skin ID
 */
export function saveSkinPreferences(ufoSkinId, crewSkinId) {
  try {
    const prefs = JSON.parse(localStorage.getItem('ufo-preferences') || '{}');
    prefs.ufoSkinId = ufoSkinId;
    prefs.crewSkinId = crewSkinId;
    localStorage.setItem('ufo-preferences', JSON.stringify(prefs));
  } catch {
    // Ignore localStorage errors
  }
}
