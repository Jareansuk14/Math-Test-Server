"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextHintLevel = nextHintLevel;
function nextHintLevel(numWrongAttempts) {
    if (numWrongAttempts <= 0)
        return null;
    if (numWrongAttempts === 1)
        return 1;
    if (numWrongAttempts === 2)
        return 2;
    return 3;
}
