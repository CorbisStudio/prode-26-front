import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { BackendMatch, BackendPrediction } from '../../../../core/models/backend.model';
import { getRelativeDateLabel, formatMatchTime } from '../../../../shared/utils/date.utils';
import { formatStageLabel } from '../../../../shared/utils/label.utils';
import {
  LucideTarget,
  LucideCircleAlert,
  LucideArrowRight,
  LucideShield,
  LucideClock,
  LucideX,
} from '@lucide/angular';

interface PredictionRow {
  prediction: BackendPrediction;
  match: BackendMatch | undefined;
}

function getPointsBadge(pred: BackendPrediction, match: BackendMatch | undefined) {
  if (match?.status !== 'FINISHED') {
    return { label: 'Pendiente', color: 'gris', icon: 'clock' } as const;
  }
  if (!pred.is_scored) {
    return { label: 'Calculando…', color: 'gris', icon: 'clock' } as const;
  }
  if (pred.is_exact) {
    return { label: '3 pts · Exacto', color: 'dorado', icon: 'target' } as const;
  }
  if (pred.points > 0) {
    return { label: '1 pt · Ganador', color: 'celeste', icon: 'shield' } as const;
  }
  return { label: '0 pts', color: 'red', icon: 'x' } as const;
}

@Component({
  selector: 'app-predictions-page',
  standalone: true,
  templateUrl: './predictions-page.component.html',
  imports: [
    RouterLink,
    LucideTarget,
    LucideCircleAlert,
    LucideArrowRight,
    LucideShield,
    LucideClock,
    LucideX,
  ],
})
export class PredictionsPageComponent {
  private readonly api = inject(ProdeApiService);

  readonly predictionsResource = this.api.getPredictions();
  readonly matchesResource = this.api.getMatches();

  readonly rows = computed<PredictionRow[]>(() => {
    const preds = this.predictionsResource.value() ?? [];
    const matches = this.matchesResource.value() ?? [];
    const matchMap = new Map(matches.map((m) => [m.id, m]));
    return preds
      .map((p) => ({ prediction: p, match: matchMap.get(p.match) }))
      .sort((a, b) => {
        const dateA = a.match?.utc_date ?? '';
        const dateB = b.match?.utc_date ?? '';
        return dateA.localeCompare(dateB);
      });
  });

  readonly totalPoints = computed(() =>
    (this.predictionsResource.value() ?? []).reduce((sum, p) => sum + p.points, 0)
  );

  readonly getBadge = getPointsBadge;
  readonly formatStageLabel = formatStageLabel;
  readonly dateLabel = (d: string) => getRelativeDateLabel(d);
  readonly timeLabel = formatMatchTime;
}
