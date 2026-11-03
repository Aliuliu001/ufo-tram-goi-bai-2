export function abductionProgress(elapsedSeconds) {
  return Math.max(0, Math.min(1, elapsedSeconds));
}
