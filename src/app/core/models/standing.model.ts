import { TeamStats } from './team.model';

export interface GroupStanding {
  group: string;
  table: TeamStats[];
}

export interface CompetitionStandings {
  competition: string;
  season: string;
  standings: GroupStanding[];
}
