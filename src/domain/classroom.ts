export type ScanSeconds = 6 | 8 | 10;

export interface ClassroomStudent {
  id: string;
  name: string;
  active: boolean;
}

export interface Classroom {
  id: string;
  name: string;
  students: ClassroomStudent[];
}

export interface FlightSettings {
  selectedClassId: string;
  pickCount: number;
  noRepeat: boolean;
  scanSeconds: ScanSeconds;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export interface FlightLog {
  id: string;
  classId: string;
  studentIds: string[];
  createdAt: string;
}

export interface ClassroomStore {
  version: 1;
  classrooms: Classroom[];
  settings: FlightSettings;
  logs: FlightLog[];
}

const palette = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Khoa', 'Lan'];

const makeStudents = (prefix: string): ClassroomStudent[] =>
  palette.map((name, index) => ({
    id: `${prefix}-${index + 1}`,
    name: `Học sinh ${name}`,
    active: true,
  }));

export const createSampleStore = (): ClassroomStore => {
  const classrooms = [
    { id: 'class-acorn', name: 'Lớp Acorn', students: makeStudents('acorn') },
    { id: 'class-hazelnut', name: 'Lớp Hazelnut', students: makeStudents('hazelnut') },
    { id: 'class-broccoli', name: 'Lớp Broccoli', students: makeStudents('broccoli').slice(0, 7) },
    { id: 'class-potato', name: 'Lớp Potato', students: makeStudents('potato').slice(0, 7) },
  ];

  return {
    version: 1,
    classrooms,
    settings: {
      selectedClassId: classrooms[0].id,
      pickCount: 1,
      noRepeat: true,
      scanSeconds: 6,
      musicEnabled: true,
      sfxEnabled: true,
    },
    logs: [],
  };
};

export const getClassroom = (store: ClassroomStore, classId = store.settings.selectedClassId): Classroom | undefined =>
  store.classrooms.find((classroom) => classroom.id === classId);

export const getCalledStudentIds = (store: ClassroomStore, classId: string): Set<string> =>
  new Set(store.logs.filter((log) => log.classId === classId).flatMap((log) => log.studentIds));

export const getEligibleStudents = (store: ClassroomStore, classId = store.settings.selectedClassId): ClassroomStudent[] => {
  const classroom = getClassroom(store, classId);
  if (!classroom) return [];
  const called = getCalledStudentIds(store, classId);
  return classroom.students.filter((student) => student.active && (!store.settings.noRepeat || !called.has(student.id)));
};

export const getReadyStudentCount = (store: ClassroomStore, classId = store.settings.selectedClassId): number =>
  getClassroom(store, classId)?.students.filter((student) => student.active).length ?? 0;

export const getPickLimit = (store: ClassroomStore, classId = store.settings.selectedClassId): number => {
  const eligible = getEligibleStudents(store, classId).length;
  return Math.max(1, eligible);
};

export const clampPickCount = (store: ClassroomStore): ClassroomStore => ({
  ...store,
  settings: {
    ...store.settings,
    pickCount: Math.min(Math.max(1, store.settings.pickCount), getPickLimit(store)),
  },
});

/** Pick a unique set for one flight.  The supplied random function keeps the rule testable. */
export const pickStudents = (
  store: ClassroomStore,
  random: () => number = Math.random,
): ClassroomStudent[] => {
  const eligible = [...getEligibleStudents(store)];
  const wanted = Math.min(store.settings.pickCount, eligible.length);
  for (let index = eligible.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [eligible[index], eligible[other]] = [eligible[other], eligible[index]];
  }
  return eligible.slice(0, wanted);
};

export const appendFlight = (
  store: ClassroomStore,
  students: ClassroomStudent[],
  createdAt = new Date().toISOString(),
): ClassroomStore => {
  if (students.length === 0) return store;
  const log: FlightLog = {
    id: `flight-${createdAt}-${students.map((student) => student.id).join('-')}`,
    classId: store.settings.selectedClassId,
    studentIds: students.map((student) => student.id),
    createdAt,
  };
  return clampPickCount({ ...store, logs: [log, ...store.logs] });
};

export const resetClassRound = (store: ClassroomStore, classId = store.settings.selectedClassId): ClassroomStore =>
  clampPickCount({ ...store, logs: store.logs.filter((log) => log.classId !== classId) });

export const updateClassroom = (store: ClassroomStore, nextClassroom: Classroom): ClassroomStore =>
  clampPickCount({
    ...store,
    classrooms: store.classrooms.map((classroom) => classroom.id === nextClassroom.id ? nextClassroom : classroom),
  });

export const selectClassroom = (store: ClassroomStore, classId: string): ClassroomStore => {
  if (!getClassroom(store, classId)) return store;
  return clampPickCount({ ...store, settings: { ...store.settings, selectedClassId: classId } });
};
