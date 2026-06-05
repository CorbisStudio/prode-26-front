import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { LucideTrophy } from '@lucide/angular';

@Component({
  selector: 'app-bracket-page',
  standalone: true,
  imports: [LucideTrophy, DatePipe],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-dorado/12 flex items-center justify-center">
          <svg lucideTrophy class="w-6 h-6 text-dorado"></svg>
        </div>
        <div>
          <h1 class="text-2xl font-black text-noche">Fase Eliminatoria</h1>
          <p class="text-sm text-gris mt-0.5">El camino hacia la gloria</p>
        </div>
      </div>

      @defer (when !matchesResource.isLoading()) {
        @if (matchesResource.error()) {
          <div class="glass rounded-2xl p-16 text-center text-red-500">Error al cargar los datos.</div>
        } @else {
          @let rounds = roundsWithMatches();
          @if (rounds.length === 0) {
            <div class="glass rounded-2xl p-16 text-center">
              <div class="w-16 h-16 rounded-2xl bg-dorado/10 flex items-center justify-center mx-auto mb-4">
                <svg lucideTrophy class="w-8 h-8 text-dorado/50"></svg>
              </div>
              <p class="text-gris font-medium">Los partidos de eliminatoria aún no están definidos.</p>
              <p class="text-gris/50 text-sm mt-1">Volvé cuando finalice la fase de grupos.</p>
            </div>
          } @else {
            <div class="space-y-10">
              @for (round of rounds; track round.name) {
                <section>
                  <div class="flex items-center gap-2.5 mb-5 justify-center">
                    <span class="w-8 h-px bg-gris-suave"></span>
                    <h2 class="text-base font-black text-noche uppercase tracking-wider">{{ round.name }}</h2>
                    <span class="w-8 h-px bg-gris-suave"></span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    @for (match of round.matches; track match.id) {
                      <article class="glass glass-interactive rounded-2xl p-4">

                        <div class="text-xs text-gris/60 text-center mb-4 font-medium">
                          {{ match.utc_date | date: 'dd/MM · HH:mm' }}
                        </div>

                        <div class="space-y-3">
                          <!-- Home team -->
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                              <div class="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center p-0.5 shrink-0">
                                <img [src]="match.home_team.flag_url" class="w-6 h-6 object-contain" />
                              </div>
                              <span class="text-sm font-bold text-noche">{{ match.home_team.code }}</span>
                            </div>
                            @if (match.status === 'FINISHED') {
                              <span class="font-black text-noche text-lg tabular-nums">{{ match.home_score ?? 0 }}</span>
                            }
                          </div>

                          <!-- Divider -->
                          <div class="border-t border-white/30"></div>

                          <!-- Away team -->
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                              <div class="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center p-0.5 shrink-0">
                                <img [src]="match.away_team.flag_url" class="w-6 h-6 object-contain" />
                              </div>
                              <span class="text-sm font-bold text-noche">{{ match.away_team.code }}</span>
                            </div>
                            @if (match.status === 'FINISHED') {
                              <span class="font-black text-noche text-lg tabular-nums">{{ match.away_score ?? 0 }}</span>
                            }
                          </div>
                        </div>

                        @if (match.status === 'FINISHED') {
                          <div class="mt-3 pt-3 border-t border-white/25 text-center">
                            <span class="inline-flex items-center gap-1.5 text-xs text-cancha font-semibold">
                              <span class="w-1.5 h-1.5 rounded-full bg-cancha"></span>
                              Final
                            </span>
                          </div>
                        }

                      </article>
                    }
                  </div>
                </section>
              }
            </div>
          }
        }
      } @placeholder {
        <div class="glass rounded-2xl p-16 text-center text-gris">Cargando eliminatorias...</div>
      }
    </div>
  `,
})
export class BracketPageComponent {
  private readonly api = inject(ProdeApiService);

  readonly matchesResource = this.api.getMatches();

  readonly roundsWithMatches = computed(() => {
    const matches = this.matchesResource.value() ?? [];

    const knockoutStages = ['ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'];

    const map = new Map<string, typeof matches>();
    for (const match of matches) {
      if (!knockoutStages.includes(match.stage)) continue;
      if (!map.has(match.stage)) {
        map.set(match.stage, []);
      }
      map.get(match.stage)!.push(match);
    }

    const stageOrder = ['ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'];
    const stageNames: Record<string, string> = {
      ROUND_OF_16: 'Octavos de Final',
      QUARTER_FINALS: 'Cuartos de Final',
      SEMI_FINALS: 'Semifinales',
      THIRD_PLACE: 'Tercer Puesto',
      FINAL: 'Final',
    };

    return stageOrder
      .filter((stage) => map.has(stage))
      .map((stage) => ({
        name: stageNames[stage],
        matches: map.get(stage)!,
      }));
  });
}
