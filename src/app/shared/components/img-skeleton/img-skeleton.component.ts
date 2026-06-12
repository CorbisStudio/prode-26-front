import { Component, input, linkedSignal } from '@angular/core';

/**
 * Renders an image with a pulsing skeleton placeholder shown until the
 * image finishes loading (or errors). The skeleton inherits the wrapper's
 * border radius, so pass the shape/sizing via `wrapperClass`.
 */
@Component({
  selector: 'app-img-skeleton',
  standalone: true,
  template: `
    <div class="relative overflow-hidden" [class]="wrapperClass()">
      @if (!loaded()) {
        <div class="absolute inset-0 animate-pulse bg-gris/20 rounded-[inherit]"></div>
      }
      <img
        [src]="src()"
        [alt]="alt()"
        [class]="imgClass()"
        [class.opacity-0]="!loaded()"
        class="transition-opacity duration-300"
        (load)="loaded.set(true)"
        (error)="loaded.set(true)"
      />
    </div>
  `,
})
export class ImgSkeletonComponent {
  readonly src = input.required<string>();
  readonly alt = input('');
  readonly imgClass = input('');
  readonly wrapperClass = input('');

  /** Resets to `false` whenever `src` changes, then flips to `true` on load. */
  readonly loaded = linkedSignal<string, boolean>({
    source: this.src,
    computation: () => false,
  });
}
