import { Component, computed, inject } from '@angular/core';
import { ProdeApiService } from '../../../../core/services/prode-api.service';
import { calculateStandingsFromMatches } from '../../../../core/utils/standings-calculator';
import { StandingRowComponent } from '../../components/standing-row/standing-row.component';
import { LucideChartColumn } from '@lucide/angular';

@Component({
  selector: 'app-standings-page',
  standalone: true,
  imports: [StandingRowComponent, LucideChartColumn],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-celeste/10 flex items-center justify-center">
          <svg lucideChartColumn class="w-6 h-6 text-celeste-dark"></svg>
        </div>
        <div>
          <h1 class="text-2xl font-black text-noche">Posiciones por Grupo</h1>
          <p class="text-sm text-gris mt-0.5">Clasificación de la fase de grupos</p>
        </div>
      </div>

      @defer (when !matchesResource.isLoading()) {
        @if (matchesResource.error()) {
          <div class="glass rounded-2xl p-16 text-center text-red-500">Error al cargar las posiciones.</div>
        } @else {
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
        }
      } @placeholder {
        <div class="glass rounded-2xl p-16 text-center text-gris">Cargando posiciones...</div>
      }
    </div>
  `,
})
export class StandingsPageComponent {
  private readonly api = inject(ProdeApiService);

  readonly matchesResource = this.api.getMatches();

  readonly standings = computed(() => {
    const matches = this.matchesResource.value() ?? [];
    return calculateStandingsFromMatches(matches);
  });
}
