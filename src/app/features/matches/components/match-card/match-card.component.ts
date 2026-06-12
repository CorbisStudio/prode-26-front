import { Component, DestroyRef, input, computed, inject, signal } from '@angular/core';
import { Match } from '../../../../core/models/match.model';
import { PredictionService } from '../../../../core/services/prediction.service';
import { getRelativeDateLabel, formatMatchTime, canPredict } from '../../../../shared/utils/date.utils';
import { formatStageLabel } from '../../../../shared/utils/label.utils';
import { ImgSkeletonComponent } from '../../../../shared/components/img-skeleton/img-skeleton.component';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [ImgSkeletonComponent],
  template: `
    <article
      class="glass-interactive mb-2"
      [class]="hero() ? 'match-hero rounded-3xl p-4 sm:p-8' : 'glass rounded-2xl p-4'"
    >

      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <span class="text-[11px] font-bold text-gris/70 uppercase tracking-[0.18em]">
          {{ stageLabel() }}
        </span>

        @if (isFinished()) {
          <span class="inline-flex items-center gap-1.5 bg-cancha/12 text-cancha text-xs font-bold px-2.5 py-1 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-cancha"></span>
            Finalizado
          </span>
        } @else if (isLive()) {
          <span class="inline-flex items-center gap-1.5 bg-red-500/10 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            En vivo
          </span>
        } @else if (!predictionOpen()) {
          <span class="inline-flex items-center gap-1.5 bg-gris/10 text-gris text-xs font-bold px-2.5 py-1 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-gris"></span>
            Cerrado
          </span>
        } @else {
          <span class="inline-flex items-center justify-end gap-2 flex-wrap">
            <span class="text-xs text-gris font-medium whitespace-nowrap">{{ dateLabel() }} · {{ matchTime() }}</span>
            @if (hero() && closesInLabel()) {
              <span class="inline-flex items-center gap-1.5 bg-dorado/15 text-dorado-dark text-xs font-bold px-2.5 py-1 rounded-full tabular-nums">
                Cierra en {{ closesInLabel() }}
              </span>
            }
          </span>
        }
      </div>

      <!-- Teams + Score -->
      <div class="flex items-center gap-3">

        <!-- Home team -->
        <div class="flex-1 flex flex-col items-center gap-2">
          <div
            class="bg-white/70 shadow-sm flex items-center justify-center"
            [class]="hero() ? 'w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2' : 'w-14 h-14 rounded-2xl p-1.5'"
          >
            @if (match().home_team?.flag_url) {
              <app-img-skeleton
                [src]="match().home_team!.flag_url!"
                [alt]="match().home_team?.name ?? 'Local'"
                [wrapperClass]="hero() ? 'w-11 h-11 sm:w-16 sm:h-16 rounded-lg' : 'w-10 h-10 rounded-md'"
                imgClass="w-full h-full object-contain"
              />
            } @else {
              <span class="text-xs font-bold text-gris">?</span>
            }
          </div>
          <span
            class="font-bold text-noche text-center leading-tight"
            [class]="hero() ? 'font-display text-base sm:text-xl' : 'text-sm'"
          >{{ match().home_team?.name ?? 'Por definir' }}</span>
        </div>

        <!-- Score / Input -->
        <div class="flex flex-col items-center gap-2 min-w-[112px]">
          @if (isFinished()) {
            <div class="flex flex-col items-center gap-1">
              <span class="text-[10px] font-bold uppercase tracking-[0.18em] text-cancha">Resultado final</span>
              <div class="score-display text-noche" [class]="hero() ? 'text-5xl sm:text-7xl' : 'text-5xl'">
                {{ match().home_score ?? 0 }}<span class="text-gris/30 mx-1">–</span>{{ match().away_score ?? 0 }}
              </div>
            </div>
          } @else if (!predictionOpen()) {
            <div class="flex flex-col items-center gap-1">
              <span class="text-[10px] font-bold uppercase tracking-[0.18em] text-gris/50">Mi predicción</span>
              <div class="score-display text-gris" [class]="hero() ? 'text-5xl sm:text-7xl' : 'text-5xl'">
                {{ predictionHome() !== '' ? predictionHome() : '–' }}<span class="text-gris/30 mx-1">–</span>{{ predictionAway() !== '' ? predictionAway() : '–' }}
              </div>
              <span class="text-[10px] text-gris/50 font-medium uppercase tracking-wider">Cerrada</span>
            </div>
          } @else {
            @if (hasPrediction()) {
              <span class="text-[10px] font-bold uppercase tracking-wider text-cancha">Mi predicción</span>
            }
            <div class="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="0"
                [value]="predictionHome()"
                (input)="onInput($event, 'home')"
                [disabled]="saving()"
                class="glass-score-input text-center font-black text-noche rounded-xl disabled:opacity-50"
                [class]="hero() ? 'w-14 sm:w-20 text-2xl sm:text-4xl py-2 sm:py-3' : 'w-14 text-2xl py-2'"
              />
              <span class="text-lg font-black text-gris/35">–</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                [value]="predictionAway()"
                (input)="onInput($event, 'away')"
                [disabled]="saving()"
                class="glass-score-input text-center font-black text-noche rounded-xl disabled:opacity-50"
                [class]="hero() ? 'w-14 sm:w-20 text-2xl sm:text-4xl py-2 sm:py-3' : 'w-14 text-2xl py-2'"
              />
            </div>

            @if (pendingSave()) {
              <span class="inline-flex items-center gap-1.5 text-xs text-gris font-medium">
                <svg class="animate-spin h-3 w-3 text-gris" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            } @else if (hasPrediction() && !saveError()) {
              <span class="animate-pop-in inline-flex items-center gap-1.5 text-xs text-cancha font-semibold">
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
          <div
            class="bg-white/70 shadow-sm flex items-center justify-center"
            [class]="hero() ? 'w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2' : 'w-14 h-14 rounded-2xl p-1.5'"
          >
            @if (match().away_team?.flag_url) {
              <app-img-skeleton
                [src]="match().away_team!.flag_url!"
                [alt]="match().away_team?.name ?? 'Visitante'"
                [wrapperClass]="hero() ? 'w-11 h-11 sm:w-16 sm:h-16 rounded-lg' : 'w-10 h-10 rounded-md'"
                imgClass="w-full h-full object-contain"
              />
            } @else {
              <span class="text-xs font-bold text-gris">?</span>
            }
          </div>
          <span
            class="font-bold text-noche text-center leading-tight"
            [class]="hero() ? 'font-display text-base sm:text-xl' : 'text-sm'"
          >{{ match().away_team?.name ?? 'Por definir' }}</span>
        </div>

      </div>
    </article>
  `,
})
export class MatchCardComponent {
  private readonly predictions = inject(PredictionService);

  readonly match = input.required<Match>();
  readonly hero = input(false);
  readonly saving = signal(false);
  readonly saveError = signal(false);
  readonly pendingSave = signal(false);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_MS = 800;

  /** Ticks every 30 s so the hero countdown stays fresh. */
  private readonly now = signal(Date.now());

  constructor() {
    const tick = setInterval(() => this.now.set(Date.now()), 30_000);
    inject(DestroyRef).onDestroy(() => clearInterval(tick));
  }

  /** Time remaining until predictions close (1 h before kickoff), e.g. "2h 14m". */
  readonly closesInLabel = computed(() => {
    this.now();
    const kickoff = new Date(this.match().utc_date).getTime();
    const diff = kickoff - 60 * 60 * 1000 - Date.now();
    if (diff <= 0) return '';
    const totalMin = Math.floor(diff / 60_000);
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const mins = totalMin % 60;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  });

  readonly stageLabel = computed(() => formatStageLabel(this.match().group || this.match().stage));
  readonly isFinished = computed(() => this.match().status === 'FINISHED');
  readonly isLive = computed(() => this.match().status === 'IN_PLAY' || this.match().status === 'PAUSED');
  readonly dateLabel = computed(() => getRelativeDateLabel(this.match().utc_date));
  readonly matchTime = computed(() => formatMatchTime(this.match().utc_date));
  readonly predictionOpen = computed(() => canPredict(this.match().utc_date));

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

  onInput(event: Event, side: 'home' | 'away'): void {
    if (!this.predictionOpen()) return;

    const raw = (event.target as HTMLInputElement).value;
    const value = raw === '' ? 0 : parseInt(raw, 10);
    if (isNaN(value) || value < 0) return;

    this.pendingSave.set(true);
    this.saveError.set(false);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.saveDebounced(value, side);
    }, this.DEBOUNCE_MS);
  }

  private async saveDebounced(value: number, side: 'home' | 'away'): Promise<void> {
    if (!this.predictionOpen()) {
      this.pendingSave.set(false);
      return;
    }

    const current = this.predictions.getPrediction(this.match().id);
    const home = side === 'home' ? value : (current?.homeScore ?? 0);
    const away = side === 'away' ? value : (current?.awayScore ?? 0);

    if (current && current.homeScore === home && current.awayScore === away) {
      this.pendingSave.set(false);
      return;
    }

    this.saving.set(true);
    try {
      await this.predictions.savePrediction({
        matchId: this.match().id,
        homeScore: home,
        awayScore: away,
      });
      this.saveError.set(false);
    } catch {
      this.saveError.set(true);
    } finally {
      this.saving.set(false);
      this.pendingSave.set(false);
    }
  }
}
