import { Match } from '../../core/models/match.model';
import { canPredict } from './date.utils';

export const USER_GROUPS = {
  CLIENT: 'CLIENT',
  MANAGER: 'MANAGER',
  CORBISTER: 'CORBISTER',
  ADMIN: 'ADMIN',
  EXTERNAL: 'EXTERNAL',
} as const;

export type UserGroup = (typeof USER_GROUPS)[keyof typeof USER_GROUPS];

/**
 * Users in CLIENT or MANAGER groups are only allowed to predict knockout-stage
 * matches (everything except GROUP_STAGE).
 */
export function isRestrictedToKnockout(userGroups: string[] = []): boolean {
  const normalized = userGroups.map((g) => g.toUpperCase());
  return normalized.includes(USER_GROUPS.CLIENT) || normalized.includes(USER_GROUPS.MANAGER);
}

export function isKnockoutStage(stage: string): boolean {
  return stage !== 'GROUP_STAGE';
}

/**
 * Full prediction permission check: time window + group/stage rules.
 */
export function canUserPredictMatch(userGroups: string[] = [], match: Match): boolean {
  if (!canPredict(match.utc_date)) return false;
  if (isRestrictedToKnockout(userGroups) && !isKnockoutStage(match.stage)) return false;
  return true;
}

/**
 * Filter ranking entries according to the current user's groups.
 *
 * - CLIENT users see only CLIENT and MANAGER entries.
 * - CORBISTER users see only CORBISTER and MANAGER entries.
 * - Any other group (ADMIN, EXTERNAL, etc.) sees the full ranking.
 */
export interface RankableEntry {
  groups?: string[];
}

export function filterRankingByUserGroups<T extends RankableEntry>(
  entries: T[],
  userGroups: string[] = [],
): T[] {
  const normalizedUserGroups = userGroups.map((g) => g.toUpperCase());

  if (normalizedUserGroups.includes(USER_GROUPS.CLIENT)) {
    return entries.filter((entry) =>
      entry.groups?.some((g) => {
        const ng = g.toUpperCase();
        return ng === USER_GROUPS.CLIENT || ng === USER_GROUPS.MANAGER;
      }),
    );
  }

  if (normalizedUserGroups.includes(USER_GROUPS.CORBISTER)) {
    return entries.filter((entry) =>
      entry.groups?.some((g) => {
        const ng = g.toUpperCase();
        return ng === USER_GROUPS.CORBISTER || ng === USER_GROUPS.MANAGER;
      }),
    );
  }

  return entries;
}
