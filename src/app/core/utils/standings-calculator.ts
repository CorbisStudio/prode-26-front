import { Match } from '../models/match.model';
import { Team, TeamStats } from '../models/team.model';
import { GroupStanding } from '../models/standing.model';

export function calculateStandingsFromMatches(matches: Match[]): GroupStanding[] {
  const groupMap = new Map<string, Map<number, TeamStats>>();

  for (const match of matches) {
    if (match.status !== 'FINISHED') continue;
    if (match.stage !== 'GROUP_STAGE') continue;

    const group = match.group;
    if (!group) continue;

    if (!groupMap.has(group)) {
      groupMap.set(group, new Map());
    }
    const teams = groupMap.get(group)!;

    const home = match.home_team;
    const away = match.away_team;
    const homeScore = match.home_score ?? 0;
    const awayScore = match.away_score ?? 0;

    ensureTeam(teams, home);
    ensureTeam(teams, away);

    const homeStats = teams.get(home.id)!;
    const awayStats = teams.get(away.id)!;

    homeStats.played++;
    awayStats.played++;

    homeStats.goalsFor += homeScore;
    homeStats.goalsAgainst += awayScore;
    awayStats.goalsFor += awayScore;
    awayStats.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      homeStats.won++;
      homeStats.points += 3;
      awayStats.lost++;
    } else if (homeScore < awayScore) {
      awayStats.won++;
      awayStats.points += 3;
      homeStats.lost++;
    } else {
      homeStats.draw++;
      awayStats.draw++;
      homeStats.points += 1;
      awayStats.points += 1;
    }
  }

  const result: GroupStanding[] = [];
  for (const [groupName, teamsMap] of groupMap) {
    const table = Array.from(teamsMap.values())
      .map((stats) => ({
        ...stats,
        goalDifference: stats.goalsFor - stats.goalsAgainst,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });

    result.push({ group: groupName, table });
  }

  return result.sort((a, b) => a.group.localeCompare(b.group));
}

function ensureTeam(map: Map<number, TeamStats>, team: Team): void {
  if (!map.has(team.id)) {
    map.set(team.id, {
      team,
      played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }
}
