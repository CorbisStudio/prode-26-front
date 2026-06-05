import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideLogIn, LucideLogOut, LucideMenu } from '@lucide/angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideLogIn, LucideLogOut, LucideMenu],
  template: `
    <header class="glass-nav sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center shrink-0 group">
            <img
              src="/img/logo-azul.png"
              alt="Prode Mundial"
              class="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.04]"
            />
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center glass-pill rounded-full px-2 py-1.5 gap-0.5">
            <a
              routerLink="/"
              routerLinkActive="bg-white shadow-sm text-noche font-semibold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-1.5 rounded-full text-sm text-gris hover:text-noche hover:bg-white/70 transition-all duration-200"
            >
              Inicio
            </a>
            <a
              routerLink="/partidos"
              routerLinkActive="bg-white shadow-sm text-noche font-semibold"
              class="px-4 py-1.5 rounded-full text-sm text-gris hover:text-noche hover:bg-white/70 transition-all duration-200"
            >
              Partidos
            </a>
            <a
              routerLink="/predicciones"
              routerLinkActive="bg-white shadow-sm text-noche font-semibold"
              class="px-4 py-1.5 rounded-full text-sm text-gris hover:text-noche hover:bg-white/70 transition-all duration-200"
            >
              Mis Predicciones
            </a>
            <a
              routerLink="/eliminatorias"
              routerLinkActive="bg-white shadow-sm text-noche font-semibold"
              class="px-4 py-1.5 rounded-full text-sm text-gris hover:text-noche hover:bg-white/70 transition-all duration-200"
            >
              Eliminatorias
            </a>
            <a
              routerLink="/ranking"
              routerLinkActive="bg-white shadow-sm text-noche font-semibold"
              class="px-4 py-1.5 rounded-full text-sm text-gris hover:text-noche hover:bg-white/70 transition-all duration-200"
            >
              Ranking
            </a>
          </nav>

          <!-- CTA / Auth -->
          <div class="flex items-center gap-3">
            @if (isAuthenticated()) {
              <span class="hidden lg:inline text-sm text-gris font-medium">{{ user()?.name }}</span>
              <button
                (click)="logout()"
                class="btn-dorado flex items-center gap-1.5 text-white text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                <svg lucideLogOut class="w-4 h-4"></svg>
                <span class="hidden sm:inline">Salir</span>
              </button>
            } @else {
              <a
                routerLink="/login"
                class="btn-dorado flex items-center gap-1.5 text-white text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                <svg lucideLogIn class="w-4 h-4"></svg>
                <span class="hidden sm:inline">Entrar</span>
              </a>
            }

            <button class="md:hidden p-2 rounded-full glass text-gris hover:text-noche transition-colors">
              <svg lucideMenu class="w-5 h-5"></svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);

  readonly user = computed(() => this.auth.user());
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());

  logout(): void {
    this.auth.logout();
  }
}
