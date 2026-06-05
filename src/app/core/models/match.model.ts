import { Team } from './team.model';

export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'SUSPENDED'
  | 'CANCELLED';

export interface Match {
  id: number;
  stage: string;
  group: string;
  matchday: number;
  home_team: Team | null;
  away_team: Team | null;
  utc_date: string;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  winner: string | null;
}

export interface MatchPrediction {
  matchId: number;
  homeScore: number;
  awayScore: number;
}
