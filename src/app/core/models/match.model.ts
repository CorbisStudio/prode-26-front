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

export type MatchDuration = 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';

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
  duration: MatchDuration | null;
  penalties_home: number | null;
  penalties_away: number | null;
  regular_time_home: number | null;
  regular_time_away: number | null;
  extra_time_home: number | null;
  extra_time_away: number | null;
}

export interface MatchPrediction {
  matchId: number;
  homeScore: number;
  awayScore: number;
}
