import { Component, input } from '@angular/core';
import { TeamStats } from '../../../../core/models/team.model';

@Component({
  selector: 'tr[app-standing-row]',
  standalone: true,
  host: { class: 'glass-table-row' },
  template: `
    <td class="py-3 px-4 text-center font-bold w-12 text-noche tabular-nums">{{ position() }}</td>
    <td class="py-3 px-4">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center p-0.5 shrink-0">
          <img [src]="stats().team.flag_url" [alt]="stats().team.name" class="w-5 h-5 object-contain" />
        </div>
        <span class="font-semibold text-noche text-sm">{{ stats().team.name }}</span>
      </div>
    </td>
    <td class="py-3 px-4 text-center text-sm text-gris tabular-nums">{{ stats().played }}</td>
    <td class="py-3 px-4 text-center text-sm text-gris tabular-nums">{{ stats().won }}</td>
    <td class="py-3 px-4 text-center text-sm text-gris tabular-nums">{{ stats().draw }}</td>
    <td class="py-3 px-4 text-center text-sm text-gris tabular-nums">{{ stats().lost }}</td>
    <td class="py-3 px-4 text-center text-sm text-gris tabular-nums">{{ stats().goalsFor }}:{{ stats().goalsAgainst }}</td>
    <td class="py-3 px-4 text-center text-sm text-gris tabular-nums">{{ stats().goalDifference }}</td>
    <td class="py-3 px-4 text-center font-black text-noche tabular-nums">{{ stats().points }}</td>
  `,
})
export class StandingRowComponent {
  readonly stats = input.required<TeamStats>();
  readonly position = input.required<number>();
}
