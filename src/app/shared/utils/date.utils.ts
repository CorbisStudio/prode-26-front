import { format, parseISO, isToday, isTomorrow, isYesterday, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

export function getRelativeDateLabel(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Hoy';
  if (isTomorrow(d)) return 'Mañana';
  if (isYesterday(d)) return 'Ayer';
  const label = format(d, "EEEE d 'de' MMMM", { locale: es });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMatchTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm', { locale: es });
}

/**
 * Determina si aún se pueden ingresar predicciones para un partido.
 * Las predicciones se cierran 1 hora antes del inicio.
 */
export function canPredict(date: string | Date): boolean {
  const matchDate = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  return differenceInMinutes(matchDate, now) > 60;
}
