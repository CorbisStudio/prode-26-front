import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  private readonly localeId = inject(LOCALE_ID);

  transform(value: string | Date, dateFormat = 'PPP p'): string {
    const date = typeof value === 'string' ? parseISO(value) : value;
    const locale = this.localeId.startsWith('es') ? es : enUS;
    return format(date, dateFormat, { locale });
  }
}
