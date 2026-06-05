import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PredictionService } from '../../../../core/services/prediction.service';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';
import {
  LucideCalendar,
  LucideTarget,
  LucideTrophy,
  LucideChartColumn,
  LucideArrowRight,
  LucideBookOpen,
  LucideShield,
} from '@lucide/angular';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    FormatDatePipe,
    LucideCalendar,
    LucideTarget,
    LucideTrophy,
    LucideChartColumn,
    LucideArrowRight,
    LucideBookOpen,
    LucideShield,
  ],
  template: `
    <div class="space-y-10">

      <!-- Hero -->
      <section class="text-center py-14 relative">
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div class="w-[500px] h-[500px] bg-celeste/6 rounded-full blur-3xl"></div>
        </div>

        <div class="relative">
          <div class="inline-flex items-center gap-2 glass-pill rounded-full px-4 py-1.5 mb-7">
            <span class="text-xs font-semibold text-gris tracking-wider uppercase">Prode Oficial · Corbis Studio</span>
          </div>

          <h1 class="text-5xl md:text-6xl font-black text-noche mb-4 leading-[1.08] tracking-tight">
            Predecí.<br />
            <span class="text-gradient">Competí. Dominá.</span>
          </h1>

          <p class="text-lg text-gris max-w-lg mx-auto leading-relaxed mt-4">
            El prode del Mundial que une al equipo. Demostrá que sabés más de fútbol que el resto.
          </p>

          @if (!isAuthenticated()) {
            <div class="mt-9 flex flex-col items-center gap-3">
              <a
                routerLink="/login"
                class="btn-dorado inline-flex items-center gap-2 text-white font-bold px-9 py-4 rounded-full text-base"
              >
                <svg lucideTarget class="w-5 h-5"></svg>
                Empezar a jugar
              </a>
              <p class="text-xs text-gris/60 tracking-wide">Velocidad · Precisión · Resultados</p>
            </div>
          }
        </div>
      </section>

      <!-- Stats (authenticated) -->
      @if (isAuthenticated()) {
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-noche/8 flex items-center justify-center">
                <svg lucideTarget class="w-5 h-5 text-noche"></svg>
              </div>
              <span class="text-sm text-gris font-medium">Tus predicciones</span>
            </div>
            <p class="text-4xl font-black text-noche">{{ predictionsCount() }}</p>
          </div>

          <div class="glass rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-dorado/10 flex items-center justify-center">
                <svg lucideTrophy class="w-5 h-5 text-dorado"></svg>
              </div>
              <span class="text-sm text-gris font-medium">Puntos totales</span>
            </div>
            <p class="text-4xl font-black text-noche">{{ userPoints() }}</p>
          </div>

          <div class="glass rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-cancha/10 flex items-center justify-center">
                <svg lucideCalendar class="w-5 h-5 text-cancha"></svg>
              </div>
              <span class="text-sm text-gris font-medium">Próximos partidos</span>
            </div>
            <p class="text-4xl font-black text-noche">{{ upcomingMatchesCount() }}</p>
          </div>
        </section>
      }

      <!-- Upcoming matches preview -->
      <section>
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-noche">Próximos partidos</h2>
          <a
            routerLink="/partidos"
            class="flex items-center gap-1 text-sm text-celeste-dark font-medium hover:gap-2 transition-all duration-200"
          >
            Ver todos
            <svg lucideArrowRight class="w-4 h-4"></svg>
          </a>
        </div>

        @if (matchesResource.isLoading()) {
          <div class="glass rounded-2xl p-10 text-center text-gris">Cargando partidos...</div>
        } @else if (matchesResource.error()) {
          <div class="glass rounded-2xl p-10 text-center text-red-500">Error al cargar los partidos</div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (match of upcomingMatches(); track match.id) {
              <article class="glass glass-interactive rounded-2xl p-5">
                <div class="text-xs text-gris/70 font-medium mb-4 uppercase tracking-wide">
                  {{ match.utc_date | formatDate:'PPP p' }}
                </div>
                <div class="flex items-center justify-between gap-3">
                  <div class="flex flex-col items-center gap-2 flex-1">
                    <div class="w-12 h-12 rounded-2xl bg-white/70 shadow-sm flex items-center justify-center p-1">
                      <img [src]="match.home_team.flag_url" [alt]="match.home_team.name" class="w-9 h-9 object-contain" />
                    </div>
                    <span class="text-sm font-bold text-noche text-center">{{ match.home_team.code }}</span>
                  </div>

                  <div class="flex flex-col items-center gap-1">
                    <span class="text-xs font-bold text-gris/50 tracking-widest uppercase">vs</span>
                  </div>

                  <div class="flex flex-col items-center gap-2 flex-1">
                    <div class="w-12 h-12 rounded-2xl bg-white/70 shadow-sm flex items-center justify-center p-1">
                      <img [src]="match.away_team.flag_url" [alt]="match.away_team.name" class="w-9 h-9 object-contain" />
                    </div>
                    <span class="text-sm font-bold text-noche text-center">{{ match.away_team.code }}</span>
                  </div>
                </div>
              </article>
            } @empty {
              <div class="col-span-full glass rounded-2xl p-10 text-center text-gris">
                No hay partidos programados próximamente.
              </div>
            }
          </div>
        }
      </section>

      <!-- Quick links -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          routerLink="/partidos"
          class="glass glass-interactive rounded-2xl p-5 flex items-center gap-4 group"
        >
          <div class="w-11 h-11 rounded-xl bg-celeste/10 flex items-center justify-center shrink-0 group-hover:bg-celeste/18 transition-colors">
            <svg lucideCalendar class="w-5 h-5 text-celeste-dark"></svg>
          </div>
          <div>
            <p class="font-bold text-noche text-sm">Partidos</p>
            <p class="text-xs text-gris mt-0.5">Fixture completo</p>
          </div>
        </a>

        <a
          routerLink="/predicciones"
          class="glass glass-interactive rounded-2xl p-5 flex items-center gap-4 group"
        >
          <div class="w-11 h-11 rounded-xl bg-dorado/10 flex items-center justify-center shrink-0 group-hover:bg-dorado/18 transition-colors">
            <svg lucideTarget class="w-5 h-5 text-dorado-dark"></svg>
          </div>
          <div>
            <p class="font-bold text-noche text-sm">Predicciones</p>
            <p class="text-xs text-gris mt-0.5">Tus pronósticos</p>
          </div>
        </a>

        <a
          routerLink="/ranking"
          class="glass glass-interactive rounded-2xl p-5 flex items-center gap-4 group"
        >
          <div class="w-11 h-11 rounded-xl bg-dorado/10 flex items-center justify-center shrink-0 group-hover:bg-dorado/18 transition-colors">
            <svg lucideTrophy class="w-5 h-5 text-dorado"></svg>
          </div>
          <div>
            <p class="font-bold text-noche text-sm">Ranking</p>
            <p class="text-xs text-gris mt-0.5">Tabla de jugadores</p>
          </div>
        </a>

        <a
          routerLink="/posiciones"
          class="glass glass-interactive rounded-2xl p-5 flex items-center gap-4 group"
        >
          <div class="w-11 h-11 rounded-xl bg-celeste/10 flex items-center justify-center shrink-0 group-hover:bg-celeste/18 transition-colors">
            <svg lucideChartColumn class="w-5 h-5 text-celeste-dark"></svg>
          </div>
          <div>
            <p class="font-bold text-noche text-sm">Posiciones</p>
            <p class="text-xs text-gris mt-0.5">Grupos del Mundial</p>
          </div>
        </a>
      </section>

      <!-- Reglas del juego -->
      <section class="glass rounded-2xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-dorado/12 flex items-center justify-center shrink-0">
            <svg lucideBookOpen class="w-5 h-5 text-dorado"></svg>
          </div>
          <div>
            <h2 class="text-xl font-black text-noche">Las Reglas del Juego</h2>
            <p class="text-xs text-gris mt-0.5">Cómo se suman los puntos</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <!-- Regla 1: Ganador -->
          <div class="glass-heavy rounded-2xl p-5 flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-celeste/12 flex items-center justify-center shrink-0">
              <svg lucideShield class="w-6 h-6 text-celeste-dark"></svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <p class="font-black text-noche text-sm">Resultado correcto</p>
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-celeste text-white text-xs font-black">1</span>
              </div>
              <p class="text-xs text-gris leading-relaxed">
                Acertás quién gana (o si empata), sin importar los goles exactos.
              </p>
              <p class="text-xs text-celeste-dark font-semibold mt-2">Ej: predecís 2-1 y termina 3-1 → <span class="text-noche">1 punto</span></p>
            </div>
          </div>

          <!-- Regla 2: Exacto -->
          <div class="glass-heavy rounded-2xl p-5 flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-dorado/12 flex items-center justify-center shrink-0">
              <svg lucideTarget class="w-6 h-6 text-dorado"></svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <p class="font-black text-noche text-sm">Resultado exacto</p>
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-dorado text-white text-xs font-black">3</span>
              </div>
              <p class="text-xs text-gris leading-relaxed">
                Acertás el marcador exacto del partido, gol por gol.
              </p>
              <p class="text-xs text-dorado-dark font-semibold mt-2">Ej: predecís 2-1 y termina 2-1 → <span class="text-noche">3 puntos</span></p>
            </div>
          </div>
        </div>

        <div class="border-t border-white/30 pt-5">
          <p class="text-xs text-gris/70 leading-relaxed text-center">
            Los puntos se acreditan automáticamente al finalizar cada partido.
            El ranking refleja la suma total de puntos de todos los partidos jugados.
          </p>
        </div>
      </section>

    </div>
  `,
})
export class HomePageComponent {
  private readonly api = inject(ProdeApiService);
  private readonly auth = inject(AuthService);
  private readonly predictions = inject(PredictionService);

  readonly matchesResource = this.api.getMatches(undefined, undefined, 'SCHEDULED');
  readonly isAuthenticated = this.auth.isAuthenticated;

  readonly upcomingMatches = computed(() => {
    const matches = this.matchesResource.value() ?? [];
    return matches.slice(0, 6);
  });

  readonly upcomingMatchesCount = computed(() => this.upcomingMatches().length);
  readonly predictionsCount = computed(() => this.predictions.allPredictions().length);
  readonly userPoints = computed(() => 0);
}
