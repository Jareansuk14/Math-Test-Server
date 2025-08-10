export function nextHintLevel(numWrongAttempts: number): 1 | 2 | 3 | null {
  if (numWrongAttempts <= 0) return null;
  if (numWrongAttempts === 1) return 1;
  if (numWrongAttempts === 2) return 2;
  return 3;
}
