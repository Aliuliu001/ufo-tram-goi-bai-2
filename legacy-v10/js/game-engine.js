export function createRound(students) {
  return {
    remaining: [...students],
    called: [],
    isComplete: students.length === 0,
  };
}

export function pickNextStudent(round, random = Math.random) {
  if (round.remaining.length === 0) {
    return { student: null, round: { ...round, isComplete: true } };
  }

  const index = Math.floor(random() * round.remaining.length);
  const student = round.remaining[index];
  const remaining = round.remaining.filter((_, itemIndex) => itemIndex !== index);

  return {
    student,
    round: {
      remaining,
      called: [...round.called, student],
      isComplete: remaining.length === 0,
    },
  };
}
