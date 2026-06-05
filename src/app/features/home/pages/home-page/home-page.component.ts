import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import {
  LucideCalendar,
  LucideTarget,
  LucideTrophy,
  LucideChartColumn,
  LucideArrowRight,
  LucideBookOpen,
  LucideShield,
  LucideUsers,
  LucideMapPin,
} from '@lucide/angular';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    LucideCalendar,
    LucideTarget,
    LucideTrophy,
    LucideChartColumn,
    LucideArrowRight,
    LucideBookOpen,
    LucideShield,
    LucideUsers,
    LucideMapPin,
  ],
  template: `
    <div class="space-y-16">

      <!-- Hero -->
      <section class="text-center pt-12 pb-4">
        <div class="inline-flex items-center gap-2 surface-pill rounded-full px-4 py-1.5 mb-8">
          <span class="text-[11px] font-semibold text-gris tracking-wider uppercase">Prode Oficial · Corbis Studio</span>
        </div>

        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-noche mb-5 leading-[1.1] tracking-tight">
          Predecí.<br />
          <span class="text-celeste-dark">Competí. Dominá.</span>
        </h1>

        <p class="text-lg text-gris max-w-lg mx-auto leading-relaxed">
          El prode del Mundial 2026 que une al equipo. Demostrá que sabés más de fútbol que el resto.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            [routerLink]="isAuthenticated() ? '/partidos' : '/login'"
            class="btn-dorado inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full text-sm"
          >
            <svg lucideTarget class="w-4 h-4"></svg>
            Empezar a jugar
          </a>
          <a
            routerLink="/partidos"
            class="surface-elevated inline-flex items-center gap-2 text-noche font-semibold px-7 py-3.5 rounded-full text-sm"
          >
            Ver los Partidos
            <svg lucideArrowRight class="w-4 h-4"></svg>
          </a>
        </div>
        <p class="text-xs text-gris/50 tracking-wide mt-5">Velocidad · Precisión · Resultados</p>
      </section>

      <!-- Reglas del juego — Jerarquía alta -->
    
      <!-- Mundial 2026 info -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="surface rounded-2xl p-6 text-center">
          <div class="w-11 h-11 rounded-xl bg-celeste-light flex items-center justify-center mx-auto mb-3">
            <svg lucideMapPin class="w-5 h-5 text-celeste"></svg>
          </div>
          <p class="text-xl font-black text-noche">USA · CAN · MEX</p>
          <p class="text-xs text-gris mt-1 font-medium">Sedes del Mundial 2026</p>
        </div>

        <div class="surface rounded-2xl p-6 text-center">
          <div class="w-11 h-11 rounded-xl bg-dorado-light flex items-center justify-center mx-auto mb-3">
            <svg lucideTrophy class="w-5 h-5 text-dorado"></svg>
          </div>
          <p class="text-xl font-black text-noche">48 equipos</p>
          <p class="text-xs text-gris mt-1 font-medium">Primer Mundial expandido</p>
        </div>

        <div class="surface rounded-2xl p-6 text-center">
          <div class="w-11 h-11 rounded-xl bg-cancha-light flex items-center justify-center mx-auto mb-3">
            <svg lucideCalendar class="w-5 h-5 text-cancha"></svg>
          </div>
          <p class="text-xl font-black text-noche">104 partidos</p>
          <p class="text-xs text-gris mt-1 font-medium">Para predecir y ganar</p>
        </div>
      </section>

      <!-- Features -->
      <section>
        <h2 class="text-lg font-bold text-noche mb-5">¿Cómo funciona?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="surface rounded-2xl p-6 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-celeste-light flex items-center justify-center shrink-0">
              <svg lucideTarget class="w-5 h-5 text-celeste"></svg>
            </div>
            <div>
              <p class="font-bold text-noche text-sm mb-1">Predecí cada partido</p>
              <p class="text-xs text-gris leading-relaxed">
                Antes de que empiece cada partido, ingresá tu pronóstico con el marcador exacto que creés que va a terminar.
              </p>
            </div>
          </div>

          <div class="surface rounded-2xl p-6 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-dorado-light flex items-center justify-center shrink-0">
              <svg lucideTrophy class="w-5 h-5 text-dorado"></svg>
            </div>
            <div>
              <p class="font-bold text-noche text-sm mb-1">Sumá puntos automáticamente</p>
              <p class="text-xs text-gris leading-relaxed">
                Al finalizar cada partido, los puntos se acreditan solos. Acertar el resultado te da 1 punto; el marcador exacto, 3 puntos.
              </p>
            </div>
          </div>

          <div class="surface rounded-2xl p-6 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-cancha-light flex items-center justify-center shrink-0">
              <svg lucideChartColumn class="w-5 h-5 text-cancha"></svg>
            </div>
            <div>
              <p class="font-bold text-noche text-sm mb-1">Seguí la tabla de posiciones</p>
              <p class="text-xs text-gris leading-relaxed">
                Mirá cómo va cada grupo del Mundial en tiempo real y planificá mejor tus próximas predicciones.
              </p>
            </div>
          </div>

          <div class="surface rounded-2xl p-6 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-dorado-light flex items-center justify-center shrink-0">
              <svg lucideUsers class="w-5 h-5 text-dorado"></svg>
            </div>
            <div>
              <p class="font-bold text-noche text-sm mb-1">Competí contra el equipo</p>
              <p class="text-xs text-gris leading-relaxed">
                El ranking muestra a todos los participantes. ¿Quién domina el prode de Corbis Studio este Mundial?
              </p>
            </div>
          </div>
        </div>
      </section>

        <section class="surface-heavy rounded-3xl p-8 sm:p-10">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 rounded-xl bg-dorado-light flex items-center justify-center shrink-0">
            <svg lucideBookOpen class="w-6 h-6 text-dorado-dark"></svg>
          </div>
          <div>
            <h2 class="text-xl sm:text-xl font-black text-noche">Las Reglas del Juego</h2>
            <p class="text-sm text-gris mt-0.5">Cómo se suman los puntos</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div class="surface rounded-2xl p-6 flex items-start gap-5">
            <div class="w-12 h-12 rounded-xl bg-celeste-light flex items-center justify-center shrink-0">
              <svg lucideShield class="w-6 h-6 text-celeste"></svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <p class="font-black text-noche text-base">Resultado correcto</p>
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-celeste text-white text-xs font-black">1</span>
              </div>
              <p class="text-sm text-gris leading-relaxed">
                Acertás quién gana (o si empata), sin importar los goles exactos.
              </p>
              <p class="text-sm text-celeste-dark font-semibold mt-3">Ej: predecís 2-1 y termina 3-1 → <span class="text-noche">1 punto</span></p>
            </div>
          </div>

          <div class="surface rounded-2xl p-6 flex items-start gap-5">
            <div class="w-12 h-12 rounded-xl bg-dorado-light flex items-center justify-center shrink-0">
              <svg lucideTarget class="w-6 h-6 text-dorado-dark"></svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <p class="font-black text-noche text-base">Resultado exacto</p>
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-dorado text-noche text-xs font-black">3</span>
              </div>
              <p class="text-sm text-gris leading-relaxed">
                Acertás el marcador exacto del partido, gol por gol.
              </p>
              <p class="text-sm text-dorado-dark font-semibold mt-3">Ej: predecís 2-1 y termina 2-1 → <span class="text-noche">3 puntos</span></p>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-6">
          <p class="text-sm text-gris/60 leading-relaxed text-center max-w-2xl mx-auto">
            Los puntos se acreditan automáticamente al finalizar cada partido.
            El ranking refleja la suma total de puntos de todos los partidos jugados.
          </p>
        </div>
      </section>


      <!-- Quick links -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          routerLink="/partidos"
          class="surface surface-elevated rounded-2xl p-5 flex items-center gap-4 group"
        >
          <div class="w-10 h-10 rounded-lg bg-celeste-light flex items-center justify-center shrink-0 group-hover:bg-celeste/10 transition-colors">
            <svg lucideCalendar class="w-5 h-5 text-celeste"></svg>
          </div>
          <div>
            <p class="font-bold text-noche text-sm">Partidos</p>
            <p class="text-xs text-gris mt-0.5">Fixture completo</p>
          </div>
        </a>

        <a
          routerLink="/predicciones"
          class="surface surface-elevated rounded-2xl p-5 flex items-center gap-4 group"
        >
          <div class="w-10 h-10 rounded-lg bg-dorado-light flex items-center justify-center shrink-0 group-hover:bg-dorado/10 transition-colors">
            <svg lucideTarget class="w-5 h-5 text-dorado"></svg>
          </div>
          <div>
            <p class="font-bold text-noche text-sm">Predicciones</p>
            <p class="text-xs text-gris mt-0.5">Tus pronósticos</p>
          </div>
        </a>

        <a
          routerLink="/ranking"
          class="surface surface-elevated rounded-2xl p-5 flex items-center gap-4 group"
        >
          <div class="w-10 h-10 rounded-lg bg-dorado-light flex items-center justify-center shrink-0 group-hover:bg-dorado/10 transition-colors">
            <svg lucideTrophy class="w-5 h-5 text-dorado"></svg>
          </div>
          <div>
            <p class="font-bold text-noche text-sm">Ranking</p>
            <p class="text-xs text-gris mt-0.5">Tabla de jugadores</p>
          </div>
        </a>

        <a
          routerLink="/posiciones"
          class="surface surface-elevated rounded-2xl p-5 flex items-center gap-4 group"
        >
          <div class="w-10 h-10 rounded-lg bg-celeste-light flex items-center justify-center shrink-0 group-hover:bg-celeste/10 transition-colors">
            <svg lucideChartColumn class="w-5 h-5 text-celeste"></svg>
          </div>
          <div>
            <p class="font-bold text-noche text-sm">Posiciones</p>
            <p class="text-xs text-gris mt-0.5">Grupos del Mundial</p>
          </div>
        </a>
      </section>

    </div>
  `,
})
export class HomePageComponent {
  private readonly auth = inject(AuthService);
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());
}
