export interface Team {
  id: number;
  name: string;
  code: string;
  group: string;
  flag_url: string;
}

export interface TeamStats {
  team: Team;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
