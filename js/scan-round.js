export function clampPickCount(value, available) {
  return Math.max(1, Math.min(Number(value) || 1, Math.max(1, available)));
}

export function chooseScanWinners(available, count, random = Math.random) {
  const pool = [...available];
  const winners = [];
  const limit = clampPickCount(count, pool.length);
  while (pool.length && winners.length < limit) winners.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  return winners;
}

export function scanTargetAt(names, tick, step = 1) {
  if (!names.length) return null;
  return names[Math.floor(tick / step) % names.length];
}
