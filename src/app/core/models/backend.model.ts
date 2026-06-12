export interface BackendUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface BackendTeam {
  id: number;
  name: string;
  code: string;
  group: string;
  flag_url: string;
}

export type BackendMatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'SUSPENDED'
  | 'CANCELLED';

export interface BackendMatch {
  id: number;
  stage: string;
  group: string;
  matchday: number;
  home_team: BackendTeam | null;
  away_team: BackendTeam | null;
  utc_date: string;
  status: BackendMatchStatus;
  home_score: number | null;
  away_score: number | null;
  winner: string | null;
}

export interface BackendPrediction {
  id: number;
  match: number;
  match_detail?: BackendMatchDetail;
  home_score: number;
  away_score: number;
  points: number;
  is_scored: boolean;
  is_exact: boolean;
}

export interface BackendMatchDetail {
  id: number;
  home_team: string;
  away_team: string;
  utc_date: string;
  stage: string;
  group: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
}

export interface BackendLeague {
  id: number;
  name: string;
  join_code: string;
  owner: number;
  members_count: string;
  create_date: string;
}

export interface RankingEntry {
  position: number;
  user_id: number;
  username: string;
  full_name: string;
  profile_picture_url: string | null;
  total_points: number;
  exact_hits: number;
  groups?: string[];
}

export interface TokenPair {
  access: string;
  refresh: string;
}
