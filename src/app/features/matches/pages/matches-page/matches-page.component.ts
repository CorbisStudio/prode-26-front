import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { parseISO, format, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Match } from '../../../../core/models/match.model';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { MatchCardComponent } from '../../components/match-card/match-card.component';
import { StandingRowComponent } from '../../../standings/components/standing-row/standing-row.component';
import { calculateStandingsFromMatches } from '../../../../core/utils/standings-calculator';
import { formatStageLabel } from '../../../../shared/utils/label.utils';
import { canPredict } from '../../../../shared/utils/date.utils';
import { LucideFilter, LucideCalendar, LucideChevronDown } from '@lucide/angular';

type StatusFilter = 'ALL' | 'FINISHED' | 'UPCOMING' | 'ARGENTINA';
type ViewMode = 'fecha' | 'grupo' | 'equipos';

interface MatchGroup {
  dateKey?: string;
  label: string;
  matches: Match[];
  isPast?: boolean;
}

interface DatePill {
  key: string;
  label: string;
  isToday: boolean;
  isPast: boolean;
}

function getDateLabel(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Hoy';
  if (isTomorrow(d)) return 'Mañana';
  const label = format(d, "EEEE d 'de' MMMM", { locale: es });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

@Component({
  selector: 'app-matches-page',
  standalone: true,
  imports: [MatchCardComponent, StandingRowComponent, LucideFilter, LucideCalendar, LucideChevronDown, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Page header + filters -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 class="font-display text-3xl sm:text-4xl font-bold tracking-tight text-noche">Partidos</h1>

        <div class="flex items-center gap-3 flex-wrap">

          <!-- View toggle pill -->
          <div class="glass-pill rounded-full p-1 flex gap-0.5">
            <button
              (click)="viewMode.set('fecha')"
              [class.bg-white]="viewMode() === 'fecha'"
              [class.shadow-sm]="viewMode() === 'fecha'"
              [class.text-noche]="viewMode() === 'fecha'"
              [class.font-semibold]="viewMode() === 'fecha'"
              [class.text-gris]="viewMode() !== 'fecha'"
              class="px-4 py-1.5 rounded-full text-sm transition-all duration-200"
            >
              Por fecha
            </button>
            <button
              (click)="viewMode.set('grupo')"
              [class.bg-white]="viewMode() === 'grupo'"
              [class.shadow-sm]="viewMode() === 'grupo'"
              [class.text-noche]="viewMode() === 'grupo'"
              [class.font-semibold]="viewMode() === 'grupo'"
              [class.text-gris]="viewMode() !== 'grupo'"
              class="px-4 py-1.5 rounded-full text-sm transition-all duration-200"
            >
              Por grupo
            </button>
            <button
              (click)="viewMode.set('equipos')"
              [class.bg-white]="viewMode() === 'equipos'"
              [class.shadow-sm]="viewMode() === 'equipos'"
              [class.text-noche]="viewMode() === 'equipos'"
              [class.font-semibold]="viewMode() === 'equipos'"
              [class.text-gris]="viewMode() !== 'equipos'"
              class="px-4 py-1.5 rounded-full text-sm transition-all duration-200"
            >
              Equipos
            </button>
          </div>

          <!-- Status filter -->
          @if (viewMode() !== 'equipos') {
            <div class="flex items-center gap-1.5 glass-pill rounded-full px-3 py-1.5">
              <svg lucideFilter class="w-4 h-4 text-gris shrink-0"></svg>
              <select
                [ngModel]="statusFilter()"
                (ngModelChange)="statusFilter.set($event)"
                class="bg-transparent border-0 text-sm text-gris focus:outline-none px-0 cursor-pointer appearance-none min-w-0 max-w-[140px]"
              >
                <option value="ALL">Todos</option>
                <option value="UPCOMING">Próximos</option>
                <option value="FINISHED">Finalizados</option>
                <option value="ARGENTINA">Argentina 🇦🇷</option>
              </select>
              <svg lucideChevronDown class="w-3.5 h-3.5 text-gris shrink-0 -ml-0.5"></svg>
            </div>
          }

        </div>
      </div>

      <!-- Hero: live match or next open-prediction match -->
      @if (viewMode() === 'fecha' && statusFilter() === 'ALL' && heroMatch(); as hm) {
        <section>
          <div class="flex items-center gap-2.5 mb-3">
            <span class="w-1 h-5 rounded-full bg-dorado"></span>
            <h2 class="text-[11px] font-bold uppercase tracking-[0.18em] text-gris/70">
              {{ hm.status === 'IN_PLAY' || hm.status === 'PAUSED' ? 'Ahora en juego' : 'Próximo partido' }}
            </h2>
          </div>
          <app-match-card [match]="hm" [hero]="true" />
        </section>
      }

      <!-- Date Pills Timeline -->
      @if (viewMode() === 'fecha' && datePills().length > 0) {
        <div class="glass-liquid no-scrollbar sticky top-20 z-30 rounded-2xl py-2 px-3 overflow-x-auto flex gap-2">
          @for (pill of datePills(); track pill.key) {
            @let isActive = activeDateKey() === pill.key;
            <button
              (click)="scrollToDate(pill.key)"
              class="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors border shrink-0 inline-flex items-center gap-1.5"
              [class.bg-celeste]="isActive"
              [class.text-white]="isActive"
              [class.border-celeste]="isActive"
              [class.bg-white]="!isActive"
              [class.text-gris]="pill.isPast && !isActive"
              [class.text-noche]="!pill.isPast && !isActive"
              [class.border-gris-suave]="!isActive"
            >
              @if (pill.isToday) {
                <span class="w-1.5 h-1.5 rounded-full shrink-0" [class.bg-white]="isActive" [class.bg-celeste]="!isActive"></span>
              }
              {{ pill.label }}
            </button>
          }
        </div>
      }

      <!-- Content -->
      @if (matchesResource.isLoading()) {
        <div class="glass rounded-2xl p-16 text-center text-gris">Cargando...</div>
      } @else if (matchesResource.error()) {
        <div class="glass rounded-2xl p-16 text-center text-red-500">Error al cargar los datos. Intenta más tarde.</div>
      } @else {

        <!-- Standings view -->
        @if (viewMode() === 'equipos') {
          @let groups = standings();
          @if (groups.length === 0) {
            <div class="glass rounded-2xl p-16 text-center text-gris">No hay datos disponibles.</div>
          } @else {
            <div class="space-y-6">
              @for (group of groups; track group.group) {
                <section class="glass rounded-2xl overflow-hidden">
                  <div class="px-6 py-4 border-b border-white/25">
                    <h2 class="text-base font-bold text-noche">{{ formatStageLabel(group.group) }}</h2>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="glass-table-header">
                          <th class="py-3 px-4 text-center w-12 text-xs font-bold text-gris uppercase tracking-wider">#</th>
                          <th class="py-3 px-4 text-left text-xs font-bold text-gris uppercase tracking-wider">Equipo</th>
                          <th class="py-3 px-4 text-center text-xs font-bold text-gris uppercase tracking-wider">PJ</th>
                          <th class="py-3 px-4 text-center text-xs font-bold text-gris uppercase tracking-wider">PG</th>
                          <th class="py-3 px-4 text-center text-xs font-bold text-gris uppercase tracking-wider">PE</th>
                          <th class="py-3 px-4 text-center text-xs font-bold text-gris uppercase tracking-wider">PP</th>
                          <th class="py-3 px-4 text-center text-xs font-bold text-gris uppercase tracking-wider">GF:GC</th>
                          <th class="py-3 px-4 text-center text-xs font-bold text-gris uppercase tracking-wider">DG</th>
                          <th class="py-3 px-4 text-center text-xs font-bold text-gris uppercase tracking-wider">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (stats of group.table; track stats.team.id; let i = $index) {
                          <tr app-standing-row [stats]="stats" [position]="i + 1"></tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </section>
              }
            </div>
          }

        <!-- Date / Group view -->
        } @else {
          @if (groupedMatches().length === 0) {
            <div class="glass rounded-2xl p-16 text-center text-gris">No se encontraron partidos.</div>
          } @else {
            <div class="space-y-10">
              @for (group of groupedMatches(); track group.label; let i = $index) {
                <section [id]="group.dateKey ? 'date-' + group.dateKey : null">
                  <h2 class="font-display text-lg font-bold tracking-tight text-noche mb-4 flex items-center gap-2.5">
                    <span class="w-1 h-5 rounded-full bg-celeste"></span>
                    @if (viewMode() === 'fecha') {
                      <svg lucideCalendar class="w-4 h-4 text-gris/60"></svg>
                    }
                    {{ group.label }}
                  </h2>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    @for (match of group.matches; track match.id; let j = $index) {
                      <div class="animate-card-in" [style.animation-delay]="(j * 60) + 'ms'">
                        <app-match-card [match]="match" />
                      </div>
                    }
                  </div>
                </section>
                @if (separatorIndex() === i) {
                  <div class="flex items-center gap-4 py-6">
                    <div class="flex-1 h-px bg-gris-suave"></div>
                    <span class="text-xs font-semibold text-gris uppercase tracking-wider">Próximos partidos</span>
                    <div class="flex-1 h-px bg-gris-suave"></div>
                  </div>
                }
              }
            </div>
          }
        }
      }
    </div>
  `,
})
export class MatchesPageComponent {
  private readonly api = inject(ProdeApiService);

  readonly formatStageLabel = formatStageLabel;

  readonly statusFilter = signal<StatusFilter>('ALL');
  readonly viewMode = signal<ViewMode>('fecha');

  /** Date pill currently highlighted: the one the user navigated to (or today as fallback). */
  readonly selectedDateKey = signal<string | null>(null);

  readonly activeDateKey = computed(() => {
    const selected = this.selectedDateKey();
    const pills = this.datePills();
    if (selected && pills.some((p) => p.key === selected)) return selected;
    return pills.find((p) => p.isToday)?.key ?? null;
  });

  readonly matchesResource = this.api.getMatches();

  /** Featured match: a live one wins; otherwise the next match still open for predictions. */
  readonly heroMatch = computed<Match | null>(() => {
    const matches = this.matchesResource.value() ?? [];
    const live = matches.find((m) => m.status === 'IN_PLAY' || m.status === 'PAUSED');
    if (live) return live;
    return (
      matches
        .filter((m) => (m.status === 'SCHEDULED' || m.status === 'TIMED') && canPredict(m.utc_date))
        .sort((a, b) => a.utc_date.localeCompare(b.utc_date))[0] ?? null
    );
  });

  readonly filteredMatches = computed(() => {
    const matches = this.matchesResource.value() ?? [];
    const filter = this.statusFilter();
    if (filter === 'ALL') return matches;
    if (filter === 'UPCOMING') {
      return matches.filter((m) => m.status === 'SCHEDULED' || m.status === 'TIMED');
    }
    if (filter === 'ARGENTINA') {
      return matches.filter((m) => m.home_team?.name === 'Argentina' || m.away_team?.name === 'Argentina');
    }
    return matches.filter((m) => m.status === filter);
  });

  readonly groupedMatches = computed<MatchGroup[]>(() => {
    if (this.viewMode() === 'grupo') {
      return this.groupByCategory();
    }
    return this.groupByDate();
  });

  readonly standings = computed(() => {
    const matches = this.matchesResource.value() ?? [];
    return calculateStandingsFromMatches(matches);
  });

  readonly datePills = computed(() => {
    const matches = this.filteredMatches();
    const map = new Map<string, { key: string; label: string; matches: Match[] }>();

    for (const match of matches) {
      const d = parseISO(match.utc_date);
      const dateKey = format(d, 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        const label = format(d, 'EEE d', { locale: es });
        map.set(dateKey, {
          key: dateKey,
          label: label.charAt(0).toUpperCase() + label.slice(1),
          matches: [],
        });
      }
      map.get(dateKey)!.matches.push(match);
    }

    const sorted = Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));

    return sorted.map((g) => ({
      key: g.key,
      label: g.label,
      isToday: isToday(parseISO(g.key)),
      isPast: g.matches.every((m) => m.status === 'FINISHED'),
    }));
  });

  readonly separatorIndex = computed(() => {
    const groups = this.groupedMatches();
    if (this.statusFilter() !== 'ALL' || this.viewMode() !== 'fecha') return -1;
    for (let i = 0; i < groups.length - 1; i++) {
      if (groups[i].isPast && !groups[i + 1].isPast) {
        return i;
      }
    }
    return -1;
  });

  private wasLoading = true;

  constructor() {
    effect(() => {
      const isLoading = this.matchesResource.isLoading();
      const viewMode = this.viewMode();
      const groups = this.groupedMatches();

      if (this.wasLoading && !isLoading && viewMode === 'fecha' && groups.length > 0) {
        const upcomingGroup = groups.find((g) => !g.isPast);
        if (upcomingGroup?.dateKey) {
          setTimeout(() => this.scrollToDate(upcomingGroup.dateKey!), 150);
        }
      }
      this.wasLoading = isLoading;
    });
  }

  scrollToDate(key: string): void {
    this.selectedDateKey.set(key);
    const el = document.getElementById(`date-${key}`);
    if (!el) return;

    const headerHeight = 88; // header h-16 + padding top
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  private groupByDate(): MatchGroup[] {
    const map = new Map<string, { dateKey: string; label: string; matches: Match[] }>();

    for (const match of this.filteredMatches()) {
      const dateKey = format(parseISO(match.utc_date), 'yyyy-MM-dd');
      const displayLabel = getDateLabel(match.utc_date);

      if (!map.has(dateKey)) {
        map.set(dateKey, { dateKey, label: displayLabel, matches: [] });
      }
      map.get(dateKey)!.matches.push(match);
    }

    const sorted = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    return sorted.map(([_, group]) => ({
      dateKey: group.dateKey,
      label: group.label,
      matches: group.matches.sort((a, b) => a.utc_date.localeCompare(b.utc_date)),
      isPast: group.matches.every((m) => m.status === 'FINISHED'),
    }));
  }

  private groupByCategory(): MatchGroup[] {
    const map = new Map<string, { label: string; matches: Match[] }>();
    for (const match of this.filteredMatches()) {
      const key = match.group || match.stage || 'Otros';
      if (!map.has(key)) {
        map.set(key, { label: formatStageLabel(key) || 'Otros', matches: [] });
      }
      map.get(key)!.matches.push(match);
    }
    return Array.from(map.values());
  }
}
