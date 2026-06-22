import { Component, computed, inject, signal, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { LucideLogIn, LucideLogOut, LucideMenu, LucideX, LucideUserPlus } from '@lucide/angular';

const NAV_ITEMS = [
  { path: '/', label: $localize`Inicio`, exact: true },
  { path: '/partidos', label: $localize`Partidos`, exact: false },
  { path: '/predicciones', label: $localize`Predicciones`, exact: false },
  { path: '/eliminatorias', label: $localize`Eliminatorias`, exact: false },
  { path: '/ranking', label: $localize`Ranking`, exact: false },
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LanguageSelectorComponent, LucideLogIn, LucideLogOut, LucideMenu, LucideX, LucideUserPlus],
  templateUrl: './header.component.html',
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
    console.log('Toggling mobile menu. Currently open:', this.mobileOpen());
    event.stopPropagation();
    this.mobileOpen.update((v) => !v);
  }

  logout(): void {
    this.mobileOpen.set(false);
    this.auth.logout();
  }
}
