import { Component, computed, inject, signal, ElementRef, HostListener } from '@angular/core';
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
    <header class="surface-nav sticky top-0 z-50" #headerRef>
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

          <!-- User / Auth + Mobile toggle -->
          <div class="flex items-center gap-2">
            @if (isAuthenticated()) {
              <!-- Desktop: name + avatar + logout -->
              <div class="hidden md:flex items-center gap-3">
                <div class="flex items-center gap-2.5">
                  @if (user()?.profile_picture_url) {
                    <img
                      [src]="user()!.profile_picture_url!"
                      [alt]="userName()"
                      class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  } @else {
                    <div class="w-8 h-8 rounded-full bg-celeste-light flex items-center justify-center text-celeste text-xs font-bold ring-1 ring-slate-200">
                      {{ userInitials() }}
                    </div>
                  }
                  <span class="text-sm font-medium text-noche">{{ userName() }}</span>
                </div>
                <button
                  (click)="logout()"
                  class="btn-dorado flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full"
                >
                  <svg lucideLogOut class="w-4 h-4"></svg>
                  <span>Salir</span>
                </button>
              </div>

              <!-- Mobile: avatar + logout compact -->
              <div class="flex md:hidden items-center gap-2">
                @if (user()?.profile_picture_url) {
                  <img
                    [src]="user()!.profile_picture_url!"
                    [alt]="userName()"
                    class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                } @else {
                  <div class="w-8 h-8 rounded-full bg-celeste-light flex items-center justify-center text-celeste text-xs font-bold ring-1 ring-slate-200">
                    {{ userInitials() }}
                  </div>
                }
                <button
                  (click)="logout()"
                  class="btn-dorado flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full"
                >
                  <svg lucideLogOut class="w-3.5 h-3.5"></svg>
                </button>
              </div>
            } @else {
              <a
                routerLink="/login"
                class="btn-dorado flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full"
              >
                <svg lucideLogIn class="w-4 h-4"></svg>
                <span class="hidden sm:inline">Entrar</span>
              </a>
            }

            <button
              (click)="toggleMobile($event)"
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
  private readonly elRef = inject(ElementRef);

  readonly navItems = NAV_ITEMS;
  readonly mobileOpen = signal(false);
  readonly user = computed(() => this.auth.user());
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());

  readonly userName = computed(() => {
    const u = this.user();
    if (!u) return '';
    if (u.first_name && u.last_name) return `${u.first_name} ${u.last_name}`;
    if (u.first_name) return u.first_name;
    return u.name || u.username;
  });

  readonly userInitials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    const first = u.first_name?.charAt(0) || u.name?.charAt(0) || u.username?.charAt(0) || '?';
    const last = u.last_name?.charAt(0) || '';
    return (first + last).toUpperCase();
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.mobileOpen()) return;
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.mobileOpen.set(false);
    }
  }

  toggleMobile(event: MouseEvent): void {
    event.stopPropagation();
    this.mobileOpen.update((v) => !v);
  }

  logout(): void {
    this.mobileOpen.set(false);
    this.auth.logout();
  }
}
