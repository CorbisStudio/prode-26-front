import { Match } from '../../core/models/match.model';

export type MatchWinner = 'home' | 'away' | 'draw' | null;

/**
 * Determines the winner of a finished match.
 * Falls back to score comparison when `winner` is not populated.
 */
export function getMatchWinner(match: Match): MatchWinner {
  if (match.status !== 'FINISHED') return null;

  if (match.winner) {
    if (match.winner === 'HOME_TEAM') return 'home';
    if (match.winner === 'AWAY_TEAM') return 'away';
    if (match.winner === 'DRAW') return 'draw';
  }

  const home = match.home_score ?? 0;
  const away = match.away_score ?? 0;
  if (home > away) return 'home';
  if (away > home) return 'away';
  return 'draw';
}

export function getStageMultiplier(stage: string): number {
  switch (stage) {
    case 'LAST_32':
    case 'LAST_16':
      return 2;
    case 'QUARTER_FINALS':
      return 3;
    case 'SEMI_FINALS':
    case 'THIRD_PLACE':
      return 4;
    case 'FINAL':
      return 5;
    case 'GROUP_STAGE':
    default:
      return 1;
  }
}
