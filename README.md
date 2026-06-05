# Prode del Mundial

Aplicación de pronósticos (prode) para el Mundial de Fútbol, construida con Angular 20 y el ecosistema moderno de la plataforma web.

## Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Angular | 20 | Framework frontend con standalone components |
| TypeScript | 5.8 | Tipado estricto habilitado |
| Tailwind CSS | 4 | Estilos utilitarios |
| Vitest | 3 | Testing unitario (reemplaza Karma/Jasmine) |
| pnpm | 10 | Package manager |
| date-fns | 4 | Manejo de fechas |
| Lucide Angular | 1.17 | Íconos SVG tree-shakeables |

## Características del Stack

- **Zoneless Change Detection**: `provideZonelessChangeDetection()` — sin Zone.js, mejor performance.
- **Standalone Components**: Sin NgModules. Cada componente es autónomo.
- **Signals Reactivos**: Sistema reactivo principal. Sin NgRx.
- **Control Flow Nativo**: `@if`, `@for`, `@switch` en templates. Sin `*ngIf` / `*ngFor`.
- **Lazy Loading**: Por feature vía Angular Router.
- **`@defer`**: Carga diferida de vistas pesadas (standings, bracket).
- **`httpResource()`**: Data fetching declarativo que devuelve Signals directamente (Angular 19+).
- **Sin RxJS**: Salvo donde sea estrictamente necesario (Angular HttpClient interno).

## API de Fútbol

Por defecto se usa **football-data.org** (v4) con proxy en desarrollo para evitar problemas de CORS.

### Configurar API Key

1. Registrate en [football-data.org](https://www.football-data.org/) y obtené una API key gratuita.
2. Editá `src/app/core/tokens/api-config.token.ts` y reemplazá el valor de `apiKey`:

```typescript
export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  factory: () => ({
    baseUrl: 'https://api.football-data.org/v4',
    apiKey: 'TU_API_KEY_AQUI',
  }),
});
```

> En producción, usá variables de entorno o un backend proxy para no exponer la key en el cliente.

## Scripts Disponibles

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm start

# Build de producción
pnpm build

# Tests unitarios
pnpm test

# Tests en modo watch
pnpm test:watch

# Linting
pnpm lint

# Formateo
pnpm format
```

## Estructura del Proyecto

```
src/app/
  core/
    models/         # Tipos de datos (Team, Match, Standing, User)
    services/       # FootballApiService, PredictionService, AuthService
    interceptors/   # ApiKeyInterceptor
    tokens/         # API_CONFIG injection token
  features/
    home/           # Página de inicio + Login
    matches/        # Fixture completo con filtros
    standings/      # Tablas de posiciones por grupo
    predictions/    # Predicciones del usuario
    bracket/        # Fase eliminatoria
  shared/
    components/     # Layout, Header, Footer
    pipes/          # FormatDatePipe
    utils/          # Helpers de fecha
```

Cada feature usa **lazy loading** y es un **standalone component**.

## Notas Técnicas

- **Tailwind v4** se importa vía `@use "tailwindcss"` en `styles.scss`.
- **Proxy de desarrollo**: Configurado en `proxy.conf.json` para redirigir `/api/*` a `https://api.football-data.org/v4`.
- **Predicciones**: Se almacenan en `localStorage` bajo la key `prode_predictions`.
- **Auth**: Simulado con localStorage. No requiere backend.

## Licencia

MIT
