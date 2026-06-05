import { Component, input, computed, inject, signal } from '@angular/core';
import { Match } from '../../../../core/models/match.model';
import { PredictionService } from '../../../../core/services/prediction.service';
import { getRelativeDateLabel, formatMatchTime } from '../../../../shared/utils/date.utils';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [],
  template: `
    <article class="glass rounded-2xl p-4 mb-2">

      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <span class="text-xs font-bold text-gris/70 uppercase tracking-widest">
          {{ match().group || match().stage }}
        </span>

        @if (isFinished()) {
          <span class="inline-flex items-center gap-1.5 bg-cancha/12 text-cancha text-xs font-bold px-2.5 py-1 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-cancha"></span>
            Final
          </span>
        } @else if (isLive()) {
          <span class="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            En vivo
          </span>
        } @else {
          <span class="text-xs text-gris font-medium">{{ dateLabel() }} · {{ matchTime() }}</span>
        }
      </div>

      <!-- Teams + Score -->
      <div class="flex items-center gap-3">

        <!-- Home team -->
        <div class="flex-1 flex flex-col items-center gap-2">
          <div class="w-14 h-14 rounded-2xl bg-white/70 shadow-sm flex items-center justify-center p-1.5">
            <img [src]="match().home_team.flag_url" [alt]="match().home_team.name" class="w-10 h-10 object-contain" />
          </div>
          <span class="text-sm font-bold text-noche text-center leading-tight">{{ match().home_team.name }}</span>
        </div>

        <!-- Score / Input -->
        <div class="flex flex-col items-center gap-2 min-w-[112px]">
          @if (isFinished()) {
            <div class="glass-heavy rounded-2xl px-5 py-3 text-center">
              <div class="text-3xl font-black text-noche tracking-tight tabular-nums">
                {{ match().home_score ?? 0 }}&nbsp;–&nbsp;{{ match().away_score ?? 0 }}
              </div>
            </div>
          } @else {
            <div class="flex items-center gap-2">
              <input
                type="number"
                min="0"
                [value]="predictionHome()"
                (change)="updatePrediction($event, 'home')"
                [disabled]="saving()"
                class="glass-score-input w-14 text-center text-2xl font-black text-noche rounded-xl py-2 disabled:opacity-50"
              />
              <span class="text-lg font-black text-gris/35">–</span>
              <input
                type="number"
                min="0"
                [value]="predictionAway()"
                (change)="updatePrediction($event, 'away')"
                [disabled]="saving()"
                class="glass-score-input w-14 text-center text-2xl font-black text-noche rounded-xl py-2 disabled:opacity-50"
              />
            </div>

            @if (hasPrediction() && !saveError()) {
              <span class="inline-flex items-center gap-1.5 text-xs text-cancha font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-cancha"></span>
                Guardado
              </span>
            }
            @if (saveError()) {
              <span class="text-xs text-red-500 font-semibold">Error al guardar</span>
            }
          }
        </div>

        <!-- Away team -->
        <div class="flex-1 flex flex-col items-center gap-2">
          <div class="w-14 h-14 rounded-2xl bg-white/70 shadow-sm flex items-center justify-center p-1.5">
            <img [src]="match().away_team.flag_url" [alt]="match().away_team.name" class="w-10 h-10 object-contain" />
          </div>
          <span class="text-sm font-bold text-noche text-center leading-tight">{{ match().away_team.name }}</span>
        </div>

      </div>
    </article>
  `,
})
export class MatchCardComponent {
  private readonly predictions = inject(PredictionService);

  readonly match = input.required<Match>();
  readonly saving = signal(false);
  readonly saveError = signal(false);

  readonly isFinished = computed(() => this.match().status === 'FINISHED');
  readonly isLive = computed(() => this.match().status === 'IN_PLAY' || this.match().status === 'PAUSED');
  readonly dateLabel = computed(() => getRelativeDateLabel(this.match().utc_date));
  readonly matchTime = computed(() => formatMatchTime(this.match().utc_date));

  readonly predictionHome = computed(() => {
    const p = this.predictions.getPrediction(this.match().id);
    return p?.homeScore ?? '';
  });

  readonly predictionAway = computed(() => {
    const p = this.predictions.getPrediction(this.match().id);
    return p?.awayScore ?? '';
  });

  readonly hasPrediction = computed(() => {
    const p = this.predictions.getPrediction(this.match().id);
    return p !== undefined;
  });

  async updatePrediction(event: Event, side: 'home' | 'away'): Promise<void> {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (isNaN(value) || value < 0) return;

    const current = this.predictions.getPrediction(this.match().id);
    const home = side === 'home' ? value : (current?.homeScore ?? 0);
    const away = side === 'away' ? value : (current?.awayScore ?? 0);

    this.saving.set(true);
    this.saveError.set(false);

    try {
      await this.predictions.savePrediction({
        matchId: this.match().id,
        homeScore: home,
        awayScore: away,
      });
    } catch {
      this.saveError.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
