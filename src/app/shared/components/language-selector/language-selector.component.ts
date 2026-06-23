import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { LucideGlobe, LucideChevronDown } from '@lucide/angular';

interface Language {
  code: string;
  label: string;
  short: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [LucideGlobe, LucideChevronDown],
  template: `
    <div class="relative" #container>
      <button
        type="button"
        (click)="toggle($event)"
        class="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full text-gris hover:text-noche hover:bg-slate-50 transition-all duration-200"
        [attr.aria-expanded]="open()"
        i18n-aria-label aria-label="Seleccionar idioma"
      >
        <svg lucideGlobe class="w-4 h-4"></svg>
        <span>{{ currentLang().short }}</span>
        <svg lucideChevronDown class="w-3.5 h-3.5 transition-transform duration-200" [class.rotate-180]="open()"></svg>
      </button>

      @if (open()) {
        <div
          class="absolute right-0 mt-2 w-36 rounded-xl bg-white shadow-lg border border-slate-100 py-1 z-50 overflow-hidden"
          (click)="$event.stopPropagation()"
        >
          @for (lang of languages; track lang.code) {
            <a
              [href]="buildUrl(lang.code)"
              (click)="selectLanguage($event, lang.code)"
              class="block px-4 py-2 text-sm transition-colors duration-200"
              [class.bg-slate-50]="lang.code === localeId"
              [class.text-noche]="lang.code === localeId"
              [class.font-semibold]="lang.code === localeId"
              [class.text-gris]="lang.code !== localeId"
              [class.hover:bg-slate-50]="lang.code !== localeId"
            >
              {{ lang.label }}
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class LanguageSelectorComponent {
  readonly localeId = inject(LOCALE_ID);
  private readonly elRef = inject(ElementRef);

  readonly open = signal(false);

  readonly languages: Language[] = [
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'en', label: 'English', short: 'EN' },
  ];

  readonly currentLang = () => this.languages.find((l) => l.code === this.localeId) ?? this.languages[0];

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.open.set(false);
    }
  }

  selectLanguage(event: MouseEvent, code: string): void {
    event.preventDefault();
    this.setLocaleCookie(code);
    window.location.href = this.buildUrl(code);
  }

  buildUrl(targetCode: string): string {
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;

    // If we are already under a locale prefix, swap it.
    const currentPrefix = `/${this.localeId}`;
    let newPath: string;

    if (path.startsWith(currentPrefix + '/') || path === currentPrefix) {
      newPath = '/' + targetCode + path.slice(currentPrefix.length);
    } else {
      // No locale prefix (typical in dev mode): prepend the target locale.
      newPath = '/' + targetCode + (path.startsWith('/') ? path : '/' + path);
    }

    return newPath + search + hash;
  }

  private setLocaleCookie(locale: string): void {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `locale=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  }
}
