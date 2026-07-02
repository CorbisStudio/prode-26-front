import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { BackendMatch, BackendPrediction } from '../../../../core/models/backend.model';
import { getRelativeDateLabel, formatMatchTime, getDateFnsLocale } from '../../../../shared/utils/date.utils';
import { formatStageLabel } from '../../../../shared/utils/label.utils';
import { getMatchWinner, getStageMultiplier } from '../../../../shared/utils/match.utils';
import {
  LucideTarget,
  LucideCircleAlert,
  LucideArrowRight,
  LucideShield,
  LucideClock,
  LucideX,
  LucideArrowUpDown,
  LucideChevronDown,
} from '@lucide/angular';

interface PredictionRow {
  prediction: BackendPrediction;
  match: BackendMatch | undefined;
}

type SortMode = 'combined' | 'date' | 'points';

/**
 * Sort priority for the predictions list:
 * 0 = live, 1 = upcoming, 2 = finished, 3 = other/unknown.
 */
function getSortPriority(match: BackendMatch | undefined): number {
  if (!match) return 3;
  if (match.status === 'IN_PLAY' || match.status === 'PAUSED') return 0;
  if (match.status === 'SCHEDULED' || match.status === 'TIMED') return 1;
  if (match.status === 'FINISHED') return 2;
  return 3;
}

function getPointsBadge(
  pred: BackendPrediction,
  match: BackendMatch | undefined,
  multiplier: number
) {
  if (match?.status !== 'FINISHED') {
    return { label: $localize`Pendiente`, color: 'gris', icon: 'clock' } as const;
  }
  if (!pred.is_scored) {
    return { label: $localize`Calculando…`, color: 'gris', icon: 'clock' } as const;
  }
  if (pred.is_exact) {
    return { label: $localize`${pred.points} pts · Exacto · ×${multiplier}`, color: 'dorado', icon: 'target' } as const;
  }
  if (pred.points > 0) {
    return { label: $localize`${pred.points} pts · Ganador · ×${multiplier}`, color: 'celeste', icon: 'shield' } as const;
  }
  return { label: $localize`${pred.points} pts · ×${multiplier}`, color: 'red', icon: 'x' } as const;
}

@Component({
  selector: 'app-predictions-page',
  standalone: true,
  templateUrl: './predictions-page.component.html',
  imports: [
    RouterLink,
    FormsModule,
    LucideTarget,
    LucideCircleAlert,
    LucideArrowRight,
    LucideShield,
    LucideClock,
    LucideX,
    LucideArrowUpDown,
    LucideChevronDown,
  ],
})
export class PredictionsPageComponent {
  private readonly api = inject(ProdeApiService);
  private readonly localeId = inject(LOCALE_ID);

  readonly predictionsResource = this.api.getPredictions();
  readonly matchesResource = this.api.getMatches();

  readonly sortMode = signal<SortMode>('combined');

  readonly rows = computed<PredictionRow[]>(() => {
    const preds = this.predictionsResource.value() ?? [];
    const matches = this.matchesResource.value() ?? [];
    const matchMap = new Map(matches.map((m) => [m.id, m]));
    const rows = preds.map((p) => ({ prediction: p, match: matchMap.get(p.match) }));

    switch (this.sortMode()) {
      case 'date':
        return rows.sort((a, b) => (a.match?.utc_date ?? '').localeCompare(b.match?.utc_date ?? ''));
      case 'points':
        return rows.sort((a, b) => b.prediction.points - a.prediction.points);
      case 'combined':
      default:
        return rows.sort((a, b) => {
          const priorityA = getSortPriority(a.match);
          const priorityB = getSortPriority(b.match);
          if (priorityA !== priorityB) return priorityA - priorityB;

          // Among finished matches, sort by points descending.
          if (a.match?.status === 'FINISHED' && b.match?.status === 'FINISHED') {
            const pointsDiff = b.prediction.points - a.prediction.points;
            if (pointsDiff !== 0) return pointsDiff;
          }

          // Tie-breaker: kickoff date.
          return (a.match?.utc_date ?? '').localeCompare(b.match?.utc_date ?? '');
        });
    }
  });

  readonly totalPoints = computed(() =>
    (this.predictionsResource.value() ?? []).reduce((sum, p) => sum + p.points, 0)
  );

  readonly getBadge = getPointsBadge;
  readonly getWinner = getMatchWinner;
  readonly getMultiplier = getStageMultiplier;
  readonly formatStageLabel = formatStageLabel;
  readonly dateLabel = (d: string) => getRelativeDateLabel(d, getDateFnsLocale(this.localeId));
  readonly timeLabel = (d: string) => formatMatchTime(d, getDateFnsLocale(this.localeId));
}
