import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
    <div class="space-y-10">

      <!-- Hero -->
      <section class="text-center py-14 relative">
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div class="w-[600px] h-[600px] bg-celeste/6 rounded-full blur-3xl"></div>
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
            El prode del Mundial 2026 que une al equipo. Demostrá que sabés más de fútbol que el resto.
          </p>

          <div class="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              routerLink="/login"
              class="btn-dorado inline-flex items-center gap-2 text-white font-bold px-9 py-4 rounded-full text-base"
            >
              <svg lucideTarget class="w-5 h-5"></svg>
              Empezar a jugar
            </a>
            <a
              routerLink="/partidos"
              class="glass glass-interactive inline-flex items-center gap-2 text-noche font-semibold px-7 py-4 rounded-full text-sm"
            >
              Ver el fixture
              <svg lucideArrowRight class="w-4 h-4"></svg>
            </a>
          </div>
          <p class="text-xs text-gris/60 tracking-wide mt-4">Velocidad · Precisión · Resultados</p>
        </div>
      </section>

      <!-- Mundial 2026 info -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="glass rounded-2xl p-6 text-center">
          <div class="w-12 h-12 rounded-2xl bg-celeste/10 flex items-center justify-center mx-auto mb-3">
            <svg lucideMapPin class="w-6 h-6 text-celeste-dark"></svg>
          </div>
          <p class="text-2xl font-black text-noche">USA · CAN · MEX</p>
          <p class="text-xs text-gris mt-1 font-medium">Sedes del Mundial 2026</p>
        </div>

        <div class="glass rounded-2xl p-6 text-center">
          <div class="w-12 h-12 rounded-2xl bg-dorado/10 flex items-center justify-center mx-auto mb-3">
            <svg lucideTrophy class="w-6 h-6 text-dorado"></svg>
          </div>
          <p class="text-2xl font-black text-noche">48 equipos</p>
          <p class="text-xs text-gris mt-1 font-medium">Primer Mundial expandido</p>
        </div>

        <div class="glass rounded-2xl p-6 text-center">
          <div class="w-12 h-12 rounded-2xl bg-cancha/10 flex items-center justify-center mx-auto mb-3">
            <svg lucideCalendar class="w-6 h-6 text-cancha"></svg>
          </div>
          <p class="text-2xl font-black text-noche">104 partidos</p>
          <p class="text-xs text-gris mt-1 font-medium">Para predecir y ganar</p>
        </div>
      </section>

      <!-- Features -->
      <section>
        <h2 class="text-xl font-bold text-noche mb-5">¿Cómo funciona?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="glass rounded-2xl p-6 flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-celeste/10 flex items-center justify-center shrink-0">
              <svg lucideTarget class="w-5 h-5 text-celeste-dark"></svg>
            </div>
            <div>
              <p class="font-bold text-noche text-sm mb-1">Predecí cada partido</p>
              <p class="text-xs text-gris leading-relaxed">
                Antes de que empiece cada partido, ingresá tu pronóstico con el marcador exacto que creés que va a terminar.
              </p>
            </div>
          </div>

          <div class="glass rounded-2xl p-6 flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-dorado/10 flex items-center justify-center shrink-0">
              <svg lucideTrophy class="w-5 h-5 text-dorado"></svg>
            </div>
            <div>
              <p class="font-bold text-noche text-sm mb-1">Sumá puntos automáticamente</p>
              <p class="text-xs text-gris leading-relaxed">
                Al finalizar cada partido, los puntos se acreditan solos. Acertar el resultado te da 1 punto; el marcador exacto, 3 puntos.
              </p>
            </div>
          </div>

          <div class="glass rounded-2xl p-6 flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-cancha/10 flex items-center justify-center shrink-0">
              <svg lucideChartColumn class="w-5 h-5 text-cancha"></svg>
            </div>
            <div>
              <p class="font-bold text-noche text-sm mb-1">Seguí la tabla de posiciones</p>
              <p class="text-xs text-gris leading-relaxed">
                Mirá cómo va cada grupo del Mundial en tiempo real y planificá mejor tus próximas predicciones.
              </p>
            </div>
          </div>

          <div class="glass rounded-2xl p-6 flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-dorado/10 flex items-center justify-center shrink-0">
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
export class HomePageComponent {}
