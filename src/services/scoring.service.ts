export function computeRealScore(firstAttemptCorrectFlags: boolean[]): number {
  return firstAttemptCorrectFlags.reduce((sum, flag) => sum + (flag ? 1 : 0), 0);
}
