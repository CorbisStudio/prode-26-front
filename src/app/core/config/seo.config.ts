export interface SeoTranslations {
  title: string;
  description: string;
}

export interface SeoRouteData {
  /** Key used to look up translated title/description in SEO_DICTIONARY. */
  key: string;
  /** Open Graph type. Defaults to 'website'. */
  ogType?: 'website' | 'article';
  /** If true, adds robots noindex,nofollow. Useful for auth flows. */
  noIndex?: boolean;
}

/**
 * Bilingual SEO copy per route. Keeping this separate from $localize makes it
 * easy to tune title/description length independently of the UI translations.
 */
export const SEO_DICTIONARY: Record<string, Record<'es' | 'en', SeoTranslations>> = {
  home: {
    es: {
      title: 'Prode Mundial 2026 · Corbis',
      description:
        'El Prode oficial del Mundial 2026. Predecí resultados, competí con tus amigos y dominá el ranking con el equipo de Corbis.',
    },
    en: {
      title: 'World Cup Prode 2026 · Corbis',
      description:
        'The official 2026 World Cup prediction game. Predict match results, compete with friends and climb the leaderboard with Team Corbis.',
    },
  },
  ranking: {
    es: {
      title: 'Ranking del Prode Mundial · Corbis',
      description:
        'Mirá quién lidera el ranking del Prode del Mundial 2026. Puntos, predicciones exactas y posición de cada jugador.',
    },
    en: {
      title: 'World Cup Prode Ranking · Corbis',
      description:
        'See who leads the 2026 World Cup Prode ranking. Points, exact predictions and player standings.',
    },
  },
  partidos: {
    es: {
      title: 'Partidos del Mundial 2026 · Corbis',
      description:
        'Consultá todos los partidos del Mundial 2026, horarios, resultados y hacé tus predicciones en el Prode de Corbis.',
    },
    en: {
      title: '2026 World Cup Matches · Corbis',
      description:
        'Check all 2026 World Cup matches, schedules, results and place your predictions in the Corbis Prode.',
    },
  },
  posiciones: {
    es: {
      title: 'Posiciones Mundial 2026 · Corbis',
      description:
        'Seguí las posiciones de los grupos del Mundial 2026. Tablas actualizadas de la fase de grupos.',
    },
    en: {
      title: '2026 World Cup Standings · Corbis',
      description: 'Follow the 2026 World Cup group standings. Updated tables from the group stage.',
    },
  },
  predicciones: {
    es: {
      title: 'Mis Predicciones · Corbis',
      description:
        'Hacé y gestioná tus predicciones para el Mundial 2026. Competí por el primer puesto del Prode de Corbis.',
    },
    en: {
      title: 'My Predictions · Corbis',
      description:
        'Make and manage your predictions for the 2026 World Cup. Compete for first place in the Corbis Prode.',
    },
  },
  eliminatorias: {
    es: {
      title: 'Eliminatorias Mundial 2026 · Corbis',
      description:
        'Visualizá el cuadro de eliminatorias del Mundial 2026. Octavos, cuartos, semifinales y la gran final.',
    },
    en: {
      title: '2026 World Cup Bracket · Corbis',
      description:
        'View the 2026 World Cup knockout bracket. Round of 16, quarter-finals, semi-finals and the final.',
    },
  },
  login: {
    es: {
      title: 'Entrar · Prode Mundial Corbis',
      description:
        'Iniciá sesión en el Prode oficial del Mundial 2026 de Corbis y empezá a predecir.',
    },
    en: {
      title: 'Log in · Corbis World Cup Prode',
      description:
        'Sign in to the official Corbis 2026 World Cup Prode and start predicting.',
    },
  },
  register: {
    es: {
      title: 'Registrarse · Prode Mundial Corbis',
      description:
        'Creá tu cuenta gratuita en el Prode del Mundial 2026 de Corbis y competí por el primer puesto.',
    },
    en: {
      title: 'Sign up · Corbis World Cup Prode',
      description:
        'Create your free account for the Corbis 2026 World Cup Prode and compete for first place.',
    },
  },
  activate: {
    es: {
      title: 'Activar cuenta · Prode Mundial Corbis',
      description:
        'Activá tu cuenta de Corbis para empezar a jugar el Prode del Mundial 2026.',
    },
    en: {
      title: 'Activate account · Corbis World Cup Prode',
      description:
        'Activate your Corbis account to start playing the 2026 World Cup Prode.',
    },
  },
};

export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'es';

/** Replace with the production domain before going live. */
export const SITE_ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://prode.corbis.com';
