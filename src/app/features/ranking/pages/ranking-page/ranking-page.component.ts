import { Component, computed, effect, inject, signal } from '@angular/core';
import confetti from 'canvas-confetti';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LucideTrophy, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-ranking-page',
  standalone: true,
  imports: [LucideTrophy, LucideChevronLeft, LucideChevronRight],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-dorado/12 flex items-center justify-center">
          <svg lucideTrophy class="w-6 h-6 text-dorado-dark"></svg>
        </div>
        <div>
          <h1 class="text-2xl font-black text-noche">Ranking Global</h1>
          <p class="text-sm text-gris mt-0.5">¿Quién predice mejor en Corbis?</p>
        </div>
      </div>

      @if (rankingResource.isLoading()) {
        <div class="glass rounded-2xl p-16 text-center text-gris">Cargando ranking...</div>
      } @else if (rankingResource.error()) {
        <div class="glass rounded-2xl p-16 text-center text-red-500">Error al cargar el ranking.</div>
      } @else {
        @let entries = rankingResource.value() ?? [];
        @if (entries.length === 0) {
          <div class="glass rounded-2xl p-16 text-center text-gris">
            Aún no hay participantes en el ranking.
          </div>
        } @else {
          <div class="glass rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="glass-table-header">
                    <th class="py-3.5 px-5 text-center w-16 text-xs font-bold text-gris uppercase tracking-wider">#</th>
                    <th class="py-3.5 px-5 text-left text-xs font-bold text-gris uppercase tracking-wider">Jugador</th>
                    <th class="py-3.5 px-5 text-center text-xs font-bold text-gris uppercase tracking-wider">Exactos</th>
                    <th class="py-3.5 px-5 text-center text-xs font-bold text-gris uppercase tracking-wider">Puntos</th>
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
                            <img
                              [src]="entry.profile_picture_url"
                              [alt]="entry.full_name"
                              class="w-9 h-9 rounded-full object-cover ring-2 ring-white/60"
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
                <div class="text-sm text-gris">
                  {{ startIndex() + 1 }} – {{ endIndex() }} de {{ entries.length }} jugadores
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

  readonly rankingResource = this.api.getRanking();
  readonly currentPage = signal(1);
  private readonly confettiLaunched = signal(false);

  readonly entries = computed(() => this.rankingResource.value() ?? []);

  readonly totalPages = computed(() => {
    const count = this.entries().length;
    return Math.ceil(count / PAGE_SIZE);
  });

  readonly startIndex = computed(() => (this.currentPage() - 1) * PAGE_SIZE);
  readonly endIndex = computed(() => Math.min(this.currentPage() * PAGE_SIZE, this.entries().length));

  readonly paginatedEntries = computed(() => {
    const all = this.entries();
    return all.slice(this.startIndex(), this.endIndex());
  });

  constructor() {
    effect(() => {
      const entries = this.entries();
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
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FCB500', '#2563EB', '#e6e6e6'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FCB500', '#2563EB', '#e6e6e6'],
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
