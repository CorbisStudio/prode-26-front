import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { parseISO, format, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Match } from '../../../../core/models/match.model';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { MatchCardComponent } from '../../components/match-card/match-card.component';
import { StandingRowComponent } from '../../../standings/components/standing-row/standing-row.component';
import { calculateStandingsFromMatches } from '../../../../core/utils/standings-calculator';
import { MatchStatus } from '../../../../core/models/match.model';
import { LucideFilter, LucideCalendar } from '@lucide/angular';

type StatusFilter = 'ALL' | MatchStatus;
type ViewMode = 'fecha' | 'grupo' | 'equipos';

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
  imports: [MatchCardComponent, StandingRowComponent, LucideFilter, LucideCalendar, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Page header + filters -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 class="text-2xl font-black text-noche">Partidos</h1>

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
            <div class="flex items-center gap-2 glass-pill rounded-full px-3 py-1.5">
              <svg lucideFilter class="w-4 h-4 text-gris shrink-0"></svg>
              <select
                [ngModel]="statusFilter()"
                (ngModelChange)="statusFilter.set($event)"
                class="bg-transparent border-0 text-sm text-gris focus:outline-none pr-1 cursor-pointer"
              >
                <option value="ALL">Todos</option>
                <option value="SCHEDULED">Programados</option>
                <option value="TIMED">Confirmados</option>
                <option value="IN_PLAY">En vivo</option>
                <option value="FINISHED">Finalizados</option>
              </select>
            </div>
          }

        </div>
      </div>

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
                    <h2 class="text-base font-bold text-noche">{{ group.group }}</h2>
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
              @for (group of groupedMatches(); track group.label) {
                <section>
                  <h2 class="text-base font-bold text-noche mb-4 flex items-center gap-2.5">
                    <span class="w-1 h-5 rounded-full bg-celeste"></span>
                    @if (viewMode() === 'fecha') {
                      <svg lucideCalendar class="w-4 h-4 text-gris/60"></svg>
                    }
                    {{ group.label }}
                  </h2>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    @for (match of group.matches; track match.id) {
                      <app-match-card [match]="match" />
                    }
                  </div>
                </section>
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

  readonly statusFilter = signal<StatusFilter>('ALL');
  readonly viewMode = signal<ViewMode>('fecha');

  readonly matchesResource = this.api.getMatches();

  readonly filteredMatches = computed(() => {
    const matches = this.matchesResource.value() ?? [];
    const filter = this.statusFilter();
    if (filter === 'ALL') return matches;
    return matches.filter((m) => m.status === filter);
  });

  readonly groupedMatches = computed(() => {
    if (this.viewMode() === 'grupo') {
      return this.groupByCategory();
    }
    return this.groupByDate();
  });

  readonly standings = computed(() => {
    const matches = this.matchesResource.value() ?? [];
    return calculateStandingsFromMatches(matches);
  });

  private groupByDate() {
    const map = new Map<string, { label: string; matches: Match[] }>();

    for (const match of this.filteredMatches()) {
      const dateKey = format(parseISO(match.utc_date), 'yyyy-MM-dd');
      const displayLabel = getDateLabel(match.utc_date);

      if (!map.has(dateKey)) {
        map.set(dateKey, { label: displayLabel, matches: [] });
      }
      map.get(dateKey)!.matches.push(match);
    }

    const sorted = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    return sorted.map(([_, group]) => ({
      ...group,
      matches: group.matches.sort((a, b) => a.utc_date.localeCompare(b.utc_date)),
    }));
  }

  private groupByCategory() {
    const map = new Map<string, { label: string; matches: Match[] }>();
    for (const match of this.filteredMatches()) {
      const key = match.group || match.stage || 'Otros';
      if (!map.has(key)) {
        map.set(key, { label: key, matches: [] });
      }
      map.get(key)!.matches.push(match);
    }
    return Array.from(map.values());
  }
}
