import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideLogIn, LucideLogOut, LucideMenu, LucideX } from '@lucide/angular';

const NAV_ITEMS = [
  { path: '/', label: 'Inicio', exact: true },
  { path: '/partidos', label: 'Partidos', exact: false },
  { path: '/predicciones', label: 'Predicciones', exact: false },
  { path: '/eliminatorias', label: 'Eliminatorias', exact: false },
  { path: '/ranking', label: 'Ranking', exact: false },
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideLogIn, LucideLogOut, LucideMenu, LucideX],
  template: `
    <header class="surface-nav sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center shrink-0 group">
            <img
              src="/img/logo-azul.png"
              alt="Prode Mundial"
              class="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center surface-pill rounded-full px-1.5 py-1 gap-0.5">
            @for (item of navItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-slate-100 text-noche font-semibold shadow-sm"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="px-4 py-1.5 rounded-full text-sm text-gris hover:text-noche hover:bg-slate-50 transition-all duration-200"
              >
                {{ item.label }}
              </a>
            }
          </nav>

          <!-- CTA / Auth + Mobile toggle -->
          <div class="flex items-center gap-2">
            @if (isAuthenticated()) {
              <span class="hidden lg:inline text-sm text-gris font-medium mr-1">{{ user()?.name }}</span>
              <button
                (click)="logout()"
                class="btn-dorado flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-full"
              >
                <svg lucideLogOut class="w-4 h-4"></svg>
                <span class="hidden sm:inline">Salir</span>
              </button>
            } @else {
              <a
                routerLink="/login"
                class="btn-dorado flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-full"
              >
                <svg lucideLogIn class="w-4 h-4"></svg>
                <span class="hidden sm:inline">Entrar</span>
              </a>
            }

            <button
              (click)="mobileOpen.set(!mobileOpen())"
              class="md:hidden p-2 rounded-xl surface-pill text-gris hover:text-noche transition-colors"
              [attr.aria-expanded]="mobileOpen()"
              aria-label="Toggle menu"
            >
              @if (mobileOpen()) {
                <svg lucideX class="w-5 h-5"></svg>
              } @else {
                <svg lucideMenu class="w-5 h-5"></svg>
              }
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileOpen()) {
        <div
          class="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl"
          (click)="mobileOpen.set(false)"
        >
          <nav class="max-w-7xl mx-auto px-4 py-3 space-y-1">
            @for (item of navItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-slate-50 text-noche font-semibold"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="block px-4 py-2.5 rounded-xl text-sm text-gris hover:text-noche hover:bg-slate-50 transition-colors"
                (click)="mobileOpen.set(false)"
              >
                {{ item.label }}
              </a>
            }
          </nav>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);

  readonly navItems = NAV_ITEMS;
  readonly mobileOpen = signal(false);
  readonly user = computed(() => this.auth.user());
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());

  logout(): void {
    this.auth.logout();
  }
}
