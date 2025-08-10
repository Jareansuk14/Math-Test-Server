"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRealScore = computeRealScore;
function computeRealScore(firstAttemptCorrectFlags) {
    return firstAttemptCorrectFlags.reduce((sum, flag) => sum + (flag ? 1 : 0), 0);
}
