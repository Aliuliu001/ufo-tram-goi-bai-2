/**
 * Class Management System
 * Manages multiple classes with separate student lists
 */

const STORAGE_KEY = 'ufo-classes';
const DEFAULT_CLASS = {
  id: 'class-default',
  name: 'Lớp mặc định',
  students: ['An Nhiên', 'Bảo Ngọc', 'Gia Hân', 'Minh Khang', 'Thanh Vy'],
  lastUsed: Date.now()
};

/**
 * Load all classes from localStorage
 */
export function loadClasses() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && Array.isArray(data.classes) && data.classes.length > 0) {
      return {
        classes: data.classes,
        activeClassId: data.activeClassId || data.classes[0].id
      };
    }
  } catch {}
  
  // Default: create one class
  return {
    classes: [DEFAULT_CLASS],
    activeClassId: DEFAULT_CLASS.id
  };
}

/**
 * Save all classes to localStorage
 */
export function saveClasses(classes, activeClassId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ classes, activeClassId }));
  } catch (e) {
    console.error('Failed to save classes:', e);
  }
}

/**
 * Get active class
 */
export function getActiveClass(classes, activeClassId) {
  return classes.find(c => c.id === activeClassId) || classes[0];
}

/**
 * Create new class
 */
export function createClass(name, students = []) {
  return {
    id: `class-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    students,
    lastUsed: Date.now()
  };
}

/**
 * Update class
 */
export function updateClass(classes, classId, updates) {
  return classes.map(c => 
    c.id === classId ? { ...c, ...updates, lastUsed: Date.now() } : c
  );
}

/**
 * Delete class
 */
export function deleteClass(classes, classId) {
  // Don't allow deleting the last class
  if (classes.length <= 1) return classes;
  return classes.filter(c => c.id !== classId);
}

/**
 * Duplicate class
 */
export function duplicateClass(classes, classId) {
  const original = classes.find(c => c.id === classId);
  if (!original) return classes;
  
  const duplicate = createClass(
    `${original.name} (Sao chép)`,
    [...original.students]
  );
  
  return [...classes, duplicate];
}

/**
 * Export all classes to JSON
 */
export function exportClassesJSON(classes) {
  return JSON.stringify({ classes, exportedAt: new Date().toISOString() }, null, 2);
}

/**
 * Import classes from JSON
 */
export function importClassesJSON(jsonString, mode = 'merge') {
  try {
    const data = JSON.parse(jsonString);
    if (!data.classes || !Array.isArray(data.classes)) {
      throw new Error('Invalid format');
    }
    
    // Validate classes
    const validClasses = data.classes.filter(c => 
      c.id && c.name && Array.isArray(c.students)
    );
    
    if (validClasses.length === 0) {
      throw new Error('No valid classes found');
    }
    
    return { success: true, classes: validClasses };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Parse CSV format: "Class Name,Student1,Student2,..."
 */
export function importClassesCSV(csvText) {
  try {
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    const classes = [];
    
    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const [name, ...students] = parts;
        classes.push(createClass(name, students));
      }
    });
    
    if (classes.length === 0) {
      throw new Error('No valid classes found in CSV');
    }
    
    return { success: true, classes };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
