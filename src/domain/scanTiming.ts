export const SCAN_SECONDS = [3, 6, 8, 10] as const;

export type ScanSeconds = (typeof SCAN_SECONDS)[number];

export function isScanSeconds(value: number): value is ScanSeconds {
  return SCAN_SECONDS.includes(value as ScanSeconds);
}

export function normalizeScanSeconds(value: number): ScanSeconds {
  return isScanSeconds(value) ? value : 6;
}

export function remainingScanSeconds(deadlineMs: number, nowMs: number): number {
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}
