import { format, parseISO, isToday, isTomorrow, isYesterday, differenceInMinutes } from 'date-fns';
import { es, enUS, type Locale } from 'date-fns/locale';

export function getRelativeDateLabel(date: string | Date, locale: Locale = es): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return $localize`Hoy`;
  if (isTomorrow(d)) return $localize`Mañana`;
  if (isYesterday(d)) return $localize`Ayer`;
  
  const label =
    locale.code === enUS.code
      ? format(d, 'EEEE, MMMM d', { locale })
      : format(d, "EEEE d 'de' MMMM", { locale });

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMatchTime(date: string | Date, locale: Locale = es): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm', { locale });
}

export function getDateFnsLocale(localeId: string): Locale {
  return localeId.startsWith('es') ? es : enUS;
}

export function canPredict(date: string | Date): boolean {
  if (new URLSearchParams(window.location.search).has('preview')) return true;
  const matchDate = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  return differenceInMinutes(matchDate, now) > 60;
}
