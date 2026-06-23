import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  DEFAULT_LOCALE,
  SEO_DICTIONARY,
  SeoRouteData,
  SITE_ORIGIN,
  SUPPORTED_LOCALES,
  SupportedLocale,
} from '../config/seo.config';

/**
 * Lightweight SEO service for a client-side rendered Angular SPA.
 *
 * In a pure SPA, search engines that execute JavaScript (Googlebot) will see
 * these tags after navigation. For crawlers that do not execute JS, the tags
 * are still useful for social sharing (Open Graph / Twitter Cards) and improve
 * the rendered HTML for hybrid rendering later.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly localeId = inject(LOCALE_ID);

  private readonly locale: SupportedLocale = SUPPORTED_LOCALES.includes(this.localeId as SupportedLocale)
    ? (this.localeId as SupportedLocale)
    : DEFAULT_LOCALE;

  /**
   * Subscribe to router events and update SEO tags on every successful navigation.
   * Call once from AppComponent (typically in an afterNextRender hook).
   */
  start(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.applyFromRoute(this.router.routerState.snapshot.root);
      });
  }

  /**
   * Walk the route tree to find the deepest child with SEO data and apply it.
   */
  applyFromRoute(route: ActivatedRouteSnapshot): void {
    let seo: SeoRouteData | undefined;
    let current: ActivatedRouteSnapshot | null = route;

    while (current) {
      if (current.data && current.data['seo']) {
        seo = current.data['seo'] as SeoRouteData;
      }
      current = current.firstChild;
    }

    if (!seo) {
      // Fallback to home SEO data if no route-specific config is found.
      seo = { key: 'home' };
    }

    this.setTags(seo);
  }

  /**
   * Apply title, description, canonical, Open Graph, Twitter Cards and hreflang.
   */
  setTags(data: SeoRouteData): void {
    const copy = SEO_DICTIONARY[data.key]?.[this.locale] ?? SEO_DICTIONARY['home'][this.locale];
    const path = this.getCanonicalPath();
    const canonicalUrl = `${SITE_ORIGIN}${path}`;

    this.title.setTitle(copy.title);

    this.meta.updateTag({ name: 'description', content: copy.description });

    // Canonical: self-referencing, absolute URL.
    this.setLinkTag('canonical', 'canonical', canonicalUrl);

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: copy.title });
    this.meta.updateTag({ property: 'og:description', content: copy.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:type', content: data.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:locale', content: this.locale === 'en' ? 'en_US' : 'es_AR' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Corbis Prode' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: copy.title });
    this.meta.updateTag({ name: 'twitter:description', content: copy.description });

    // Robots directive for auth-like flows.
    if (data.noIndex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.removeTag("name='robots'");
    }

    // Hreflang alternates: every page must reference itself and all alternates.
    this.setHreflangTags(path);
  }

  /**
   * Build the canonical path for the current URL, preserving the locale prefix
   * and removing trailing hashes/query strings that don't affect route identity.
   */
  private getCanonicalPath(): string {
    const url = this.router.url;
    const [pathAndQuery] = url.split('#');
    const [path, query] = pathAndQuery.split('?');

    // Keep only known search params that change page content meaningfully.
    const keepParams = ['group'];
    const preserved = new URLSearchParams();
    if (query) {
      const params = new URLSearchParams(query);
      for (const key of keepParams) {
        const value = params.get(key);
        if (value) {
          preserved.set(key, value);
        }
      }
    }

    const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    const queryString = preserved.toString() ? `?${preserved.toString()}` : '';
    return normalizedPath === '' ? '/' : `${normalizedPath}${queryString}`;
  }

  /**
   * Set or replace a <link> tag by id + rel.
   */
  private setLinkTag(id: string, rel: string, href: string): void {
    const selector = `link#${id}`;
    const existing = document.querySelector(selector);

    if (existing) {
      existing.setAttribute('href', href);
      return;
    }

    const link = document.createElement('link');
    link.setAttribute('id', id);
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    document.head.appendChild(link);
  }

  /**
   * Render hreflang alternate links for every supported locale.
   * Includes x-default pointing to the default locale version.
   */
  private setHreflangTags(path: string): void {
    // Remove current locale prefix from path so we can rebuild alternates.
    const pathWithoutLocale = path.replace(new RegExp(`^/${this.locale}`), '') || '/';

    // Remove any stale hreflang links injected previously.
    document.querySelectorAll('link[data-seo-hreflang]').forEach((el) => el.remove());

    for (const locale of SUPPORTED_LOCALES) {
      const localePath = pathWithoutLocale === '/' ? `/${locale}/` : `/${locale}${pathWithoutLocale}`;
      const href = `${SITE_ORIGIN}${localePath}`;

      const link = document.createElement('link');
      link.setAttribute('data-seo-hreflang', locale);
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', locale);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    }

    // x-default points to the default locale.
    const defaultPath = pathWithoutLocale === '/' ? `/${DEFAULT_LOCALE}/` : `/${DEFAULT_LOCALE}${pathWithoutLocale}`;
    const xDefault = document.createElement('link');
    xDefault.setAttribute('data-seo-hreflang', 'x-default');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', `${SITE_ORIGIN}${defaultPath}`);
    document.head.appendChild(xDefault);
  }
}
