import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="surface-dark mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-center sm:text-left">
            <p class="text-white/80 text-sm font-semibold tracking-tight" i18n>Prode Mundial {{ currentYear }}</p>
            <p class="text-white/30 text-xs mt-0.5" i18n>Predecí mejor. Jugá mejor.</p>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-white/25 text-xs" i18n>Un proyecto de</span>
            <span class="text-white/55 text-xs font-bold tracking-widest uppercase">Corbis</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
