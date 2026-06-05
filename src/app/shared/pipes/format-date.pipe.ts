import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date, dateFormat = 'PPP p'): string {
    const date = typeof value === 'string' ? parseISO(value) : value;
    return format(date, dateFormat, { locale: es });
  }
}
