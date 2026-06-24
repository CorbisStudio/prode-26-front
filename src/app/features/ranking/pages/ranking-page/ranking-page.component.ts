import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LucideTrophy, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { ImgSkeletonComponent } from '../../../../shared/components/img-skeleton/img-skeleton.component';
import { filterRankingByUserGroups } from '../../../../shared/utils/prediction.utils';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-ranking-page',
  standalone: true,
  imports: [LucideTrophy, LucideChevronLeft, LucideChevronRight, ImgSkeletonComponent, RouterLink],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-dorado/12 flex items-center justify-center">
          <svg lucideTrophy class="w-6 h-6 text-dorado-dark"></svg>
        </div>
        <div>
          @if (groupFilter()) {
            <h1 class="font-display text-3xl sm:text-4xl font-bold tracking-tight text-noche" i18n>Ranking · {{ groupFilter() }}</h1>
            <div class="flex items-center gap-2 mt-0.5">
              <p class="text-sm text-gris" i18n>Filtrado por grupo</p>
              <a routerLink="/ranking" class="text-xs font-semibold text-celeste-dark hover:underline" i18n>Ver ranking global</a>
            </div>
          } @else {
            <h1 class="font-display text-3xl sm:text-4xl font-bold tracking-tight text-noche" i18n>Ranking Global</h1>
            <p class="text-sm text-gris mt-0.5" i18n>¿Quién predice mejor en Corbis?</p>
          }
        </div>
      </div>

      @if (myEntry(); as entry) {
        <div class="surface-heavy rounded-2xl p-5 flex items-center gap-4 border-l-4 border-dorado">
          <div class="w-12 h-12 rounded-full bg-dorado/15 flex items-center justify-center shrink-0">
            <span class="font-display text-xl font-black text-dorado-dark">#{{ entry.position }}</span>
          </div>
          <div>
            <p class="text-sm text-gris" i18n>Tu lugar en el ranking</p>
            <p class="font-bold text-noche">
              {{ entry.total_points }} pts · {{ entry.exact_hits }} exactos
            </p>
          </div>
        </div>
      }

      @if (rankingResource.isLoading()) {
        <div class="glass rounded-2xl p-16 text-center text-gris" i18n>Cargando ranking...</div>
      } @else if (rankingResource.error()) {
        <div class="glass rounded-2xl p-16 text-center text-red-500" i18n>Error al cargar el ranking.</div>
      } @else {
        @if (filteredEntries().length === 0) {
          <div class="glass rounded-2xl p-16 text-center text-gris">
            @if (groupFilter()) {
              <ng-container i18n>No hay participantes del grupo <strong>{{ groupFilter() }}</strong> en el ranking.</ng-container>
            } @else {
              <ng-container i18n>Aún no hay participantes en el ranking.</ng-container>
            }
          </div>
        } @else {
          <div class="glass rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="glass-table-header">
                    <th class="py-3.5 px-5 text-center w-16 text-xs font-bold text-gris uppercase tracking-wider" i18n>#</th>
                    <th class="py-3.5 px-5 text-left text-xs font-bold text-gris uppercase tracking-wider" i18n>Jugador</th>
                    <th class="py-3.5 px-5 text-center text-xs font-bold text-gris uppercase tracking-wider" i18n>Exactos</th>
                    <th class="py-3.5 px-5 text-center text-xs font-bold text-gris uppercase tracking-wider" i18n>Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  @for (entry of paginatedEntries(); track entry.user_id) {
                    <tr
                      class="glass-table-row"
                      [class.bg-dorado/6]="entry.position === 1"
                      [class.bg-gris/4]="entry.position === 2"
                      [class.bg-amber-600/4]="entry.position === 3"
                    >
                      <td class="py-4 px-5 text-center">
                        @if (entry.position === 1) {
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-dorado text-noche text-xs font-black shadow-sm">
                            <svg lucideTrophy class="w-3.5 h-3.5"></svg>
                          </span>
                        } @else if (entry.position === 2) {
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gris/25 text-noche text-xs font-black">
                            2
                          </span>
                        } @else if (entry.position === 3) {
                          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-600/20 text-amber-700 text-xs font-black">
                            3
                          </span>
                        } @else {
                          <span class="font-semibold text-gris">{{ entry.position }}</span>
                        }
                      </td>

                      <td class="py-4 px-5">
                        <div class="flex items-center gap-3">
                          @if (entry.profile_picture_url) {
                            <app-img-skeleton
                              [src]="entry.profile_picture_url"
                              [alt]="entry.full_name"
                              wrapperClass="w-9 h-9 rounded-full ring-2 ring-white/60"
                              imgClass="w-full h-full object-cover"
                            />
                          } @else {
                            <div class="w-9 h-9 rounded-full bg-celeste/15 flex items-center justify-center text-celeste-dark text-sm font-black ring-2 ring-white/60">
                              {{ entry.full_name.charAt(0).toUpperCase() }}
                            </div>
                          }
                          <div>
                            <p class="font-semibold text-noche">{{ entry.full_name }}</p>
                            <p class="text-xs text-gris/70">{{ entry.username }}</p>
                          </div>
                        </div>
                      </td>

                      <td class="py-4 px-5 text-center font-semibold text-gris">{{ entry.exact_hits }}</td>
                      <td class="py-4 px-5 text-center">
                        <span class="font-black text-noche text-base">{{ entry.total_points }}</span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <div class="flex items-center justify-between px-6 py-4 border-t border-white/25">
                <div class="text-sm text-gris" i18n>
                  {{ startIndex() + 1 }} – {{ endIndex() }} de {{ filteredEntries().length }} jugadores
                </div>
                <div class="flex items-center gap-2">
                  <button
                    (click)="prevPage()"
                    [disabled]="currentPage() === 1"
                    class="p-2 rounded-xl glass disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-white/50"
                  >
                    <svg lucideChevronLeft class="w-4 h-4 text-noche"></svg>
                  </button>

                  <span class="text-sm font-bold text-noche min-w-[3rem] text-center tabular-nums">
                    {{ currentPage() }} / {{ totalPages() }}
                  </span>

                  <button
                    (click)="nextPage()"
                    [disabled]="currentPage() === totalPages()"
                    class="p-2 rounded-xl glass disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-white/50"
                  >
                    <svg lucideChevronRight class="w-4 h-4 text-noche"></svg>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
})
export class RankingPageComponent {
  private readonly api = inject(ProdeApiService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly rankingResource = this.api.getRanking();
  readonly currentPage = signal(1);
  private readonly confettiLaunched = signal(false);

  readonly groupFilter = signal(this.route.snapshot.queryParamMap.get('group')?.trim() ?? '');

  readonly allEntries = computed(() => this.rankingResource.value() ?? []);

  readonly visibleEntries = computed(() =>
    filterRankingByUserGroups(this.allEntries(), this.auth.user()?.groups ?? [])
  );

  readonly filteredEntries = computed(() => {
    const all = this.visibleEntries();
    const filter = this.groupFilter().toLowerCase();

    const filtered = filter
      ? all.filter((entry) => entry.groups?.some((group) => group.toLowerCase() === filter))
      : all;

    // Recompute positions inside the visible ranking so the order is always
    // sequential, even when the backend sent global positions across mixed groups.
    return filtered.map((entry, index) => ({ ...entry, position: index + 1 }));
  });

  readonly totalPages = computed(() => {
    const count = this.filteredEntries().length;
    return Math.ceil(count / PAGE_SIZE);
  });

  readonly startIndex = computed(() => (this.currentPage() - 1) * PAGE_SIZE);
  readonly endIndex = computed(() => Math.min(this.currentPage() * PAGE_SIZE, this.filteredEntries().length));

  readonly paginatedEntries = computed(() => {
    const all = this.filteredEntries();
    return all.slice(this.startIndex(), this.endIndex());
  });

  readonly myEntry = computed(() => {
    const user = this.auth.user();
    if (!user) return null;
    return this.filteredEntries().find((entry) => entry.user_id === user.id) ?? null;
  });

  constructor() {
    effect(() => {
      // Reset pagination when the group filter changes
      this.groupFilter();
      this.currentPage.set(1);
    });

    effect(() => {
      const entries = this.filteredEntries();
      const user = this.auth.user();

      if (entries.length === 0 || !user || this.confettiLaunched()) return;

      const top1 = entries.find((e) => e.position === 1);
      if (top1 && top1.user_id === user.id) {
        this.confettiLaunched.set(true);
        this.launchConfetti();
      }
    });
  }

  private launchConfetti(): void {
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FCB500', '#2563EB', '#e6e6e6', '#0000FF'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FCB500', '#2563EB', '#e6e6e6', '#0000FF'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }
}
